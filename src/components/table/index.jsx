import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  ChevronsUpDown,
  SearchIcon,
  ChevronDown,
  Dot,
} from "lucide-react";
import { Button } from "../ui/button";
import Pagination from "../pagination";
import { cn } from "@/lib/utils";
import { Text } from "../ui/typography";
import DeleteDialog from "../dialog/delete-dialog";

function defaultGetRowId(row, idx) {
  if (row.id !== undefined) return row.id;

  return idx;
}

export default function DataTable({
  data,
  columns,
  pageSizeOptions = [10, 25, 50],
  defaultPageSize = 10,
  selectedIds: controlledSelectedIds,
  onSelectionChange,
  getRowId = defaultGetRowId,
  emptyState,
  isShowCheckbox = false,
  isShowActions = false,
  className = "",
}) {
  const [query, setQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [selected, setSelected] = useState(new Set());

  // If parent controls selection, derive from prop
  const selection = controlledSelectedIds ?? selected;
  const setSelection = (s) => {
    if (onSelectionChange) onSelectionChange(s);
    if (!controlledSelectedIds) setSelected(new Set(s));
  };

  // Filtering
  const filtered = useMemo(() => {
    if (!query) return data;
    const q = query.toLowerCase();
    return data.filter((row) => {
      for (const col of columns) {
        const raw = col.accessor ? col.accessor(row) : row[col.key];
        if (raw === null || raw === undefined) continue;
        const s = String(raw).toLowerCase();
        if (s.includes(q)) return true;
      }
      return false;
    });
  }, [data, query, columns]);

  // Sorting
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const key = sortKey;
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const va = a[key] ?? "";
      const vb = b[key] ?? "";

      if (typeof va === "number" && typeof vb === "number")
        return (va - vb) * dir;
      return String(va).localeCompare(String(vb)) * dir;
    });
  }, [filtered, sortKey, sortDir]);

  // Pagination
  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  // Selection helpers
  const toggleRow = (rowId) => {
    const next = new Set(selection);
    if (next.has(rowId)) next.delete(rowId);
    else next.add(rowId);
    setSelection(next);
  };

  const toggleAllOnPage = () => {
    const ids = current.map((r) => getRowId(r));
    const next = new Set(selection);
    const allOnPageSelected = ids.every((id) => next.has(id));
    if (allOnPageSelected) {
      ids.forEach((id) => next.delete(id));
    } else {
      ids.forEach((id) => next.add(id));
    }
    setSelection(next);
  };

  // UI handlers
  const onSort = (col) => {
    if (!col.sortable) return;
    const key = col.key;
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* search + filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="relative max-w-[340px] w-full flex-1">
          <SearchIcon
            size={16}
            className="absolute top-[11px] left-2.5 text-gray-400"
          />
          <input
            placeholder="Search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="py-2 pl-8 pr-4 rounded-md text-sm w-full bg-gray-50 border border-primary/20 focus:border-primary focus:outline-none tr"
          />
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="pl-3 pr-2">
                <div className="flx gap-2">
                  <span>Status</span>
                  <ChevronDown />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Example default actions; consumer can ignore and render their own via renderRowActions */}
              <DropdownMenuItem onSelect={() => console.log("Action: view")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => console.log("Action: edit")}>
                Blocked
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => console.log("Action: delete")}>
                Inactive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* resulst + overview */}
      <div>
        <Text variant="sm">
          Showing <b>{total}</b> results from <b>100</b> items
        </Text>
        {/* <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("");
              setSortKey(null);
              setSortDir("asc");
              setPage(1);
              setSelection(new Set());
            }}
          >
            Reset
          </Button>
        </div> */}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 overflow-hidden !bg-white">
        <Table>
          <TableHeader>
            <TableRow className="!bg-primary/10 !text-primary">
              {isShowCheckbox && (
                <TableHead className="w-12 px-4">
                  <div className="flex items-center">
                    <Checkbox
                      aria-label="Select all"
                      checked={
                        current.length > 0 &&
                        current.every((r) => selection.has(getRowId(r)))
                      }
                      onCheckedChange={toggleAllOnPage}
                    />
                  </div>
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  className={` px-4 ${col.width ? String(col.width) : ""}`}
                >
                  <button
                    className="flex items-center gap-2 w-full text-left"
                    onClick={() => onSort(col)}
                  >
                    <span>{col.header}</span>
                    {col.sortable ? (
                      <ChevronsUpDown className="h-4 w-4 opacity-50" />
                    ) : null}
                  </button>
                </TableHead>
              ))}

              {isShowActions ? (
                <TableHead className="w-12 px-4">Actions</TableHead>
              ) : null}
            </TableRow>
          </TableHeader>

          <TableBody>
            {current.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (isShowActions ? 2 : 1)}>
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    {emptyState ?? "No results."}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              current.map((row) => {
                const rowId = getRowId(row);
                return (
                  <TableRow key={String(rowId)} className="hover:bg-muted/50">
                    {isShowCheckbox && (
                      <TableCell className="w-12 px-4">
                        <Checkbox
                          checked={selection.has(rowId)}
                          onCheckedChange={() => toggleRow(rowId)}
                          aria-label={`Select row ${String(rowId)}`}
                        />
                      </TableCell>
                    )}

                    {columns.map((col) => (
                      <TableCell
                        key={String(col.key)}
                        className={`py-4 opacity-75 px-4 ${
                          col.width ? String(col.width) : ""
                        }`}
                      >
                        {col.render
                          ? col.render(row)
                          : col.accessor
                          ? col.accessor(row)
                          : row[col.key]}
                      </TableCell>
                    ))}

                    {isShowActions ? (
                      <TableCell className="w-12 px-4 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="rubix" size="sm" className="p-2">
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {/* Example default actions; consumer can ignore and render their own via renderRowActions */}
                            <DropdownMenuItem
                              onSelect={() =>
                                console.log("Action: view", rowId)
                              }
                            >
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() =>
                                console.log("Action: edit", rowId)
                              }
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => setIsDeleteDialogOpen(true)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    ) : null}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flx gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="pr-2 pl-3"
                >
                  <div className="flx gap-2">
                    <span>10</span>
                    <ChevronDown />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {pageSizeOptions.map((n) => (
                  <DropdownMenuItem
                    key={n}
                    value={n}
                    onSelect={() => console.log("Action: view")}
                  >
                    {n}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Dot className="text-gray-500" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div>
              Page {page} of {pageCount}
            </div>
          </div>
        </div>
        <Pagination
          totalItems={data.length}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={(p) => setPage(p)}
        />

        <DeleteDialog
          isOpen={isDeleteDialogOpen}
          setIsOpen={setIsDeleteDialogOpen}
        />
      </div>
    </div>
  );
}
