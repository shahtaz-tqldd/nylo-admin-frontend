import DataTable from "@/components/table";
import DeleteDialog from "@/components/dialog/delete-dialog";
import { Button } from "@/components/ui/button";
import { Text, Title } from "@/components/ui/typography";
import {
  useDeleteCategoryMutation,
  useDeleteCollectionMutation,
  useDeleteColorMutation,
  useDeleteSizeMutation,
  useProductSettingsQuery,
} from "@/features/products/productApiSlice";
import { Plus } from "lucide-react";
import moment from "moment";
import React, { useMemo, useState } from "react";
import CategoryUpsertDialog from "./category-upsert-dialog";
import SizeUpsertDialog from "./size-upsert-dialog";
import ColorUpsertDialog from "./color-upsert-dialog";
import toast from "react-hot-toast";
import { SelectSeparator } from "@/components/ui/select";

const getUserLabel = (user) => {
  if (!user) return "-";
  if (typeof user === "string") return user;
  return user.full_name || user.name || user.email || user.username || "-";
};

const formatDateTime = (value) =>
  value ? moment(value).format("MMM DD, YYYY hh:mm A") : "-";

const buildBaseColumns = (nameHeader = "Name") => [
  { key: "name", header: nameHeader },
  {
    key: "created_at",
    header: "Created At",
    sortable: true,
    accessor: (item) => item.created_at_raw ?? "",
    render: (item) => item.created_at,
  },
  {
    key: "updated_at",
    header: "Updated At",
    sortable: true,
    accessor: (item) => item.updated_at_raw ?? "",
    render: (item) => item.updated_at,
  },
  { key: "created_by", header: "Created By" },
  { key: "updated_by", header: "Updated By" },
];

const SettingsSection = ({
  title,
  description,
  actionLabel,
  onCreate,
  data,
  columns,
  rowActions,
  isLoading,
  total,
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>

        <Button onClick={onCreate} size="sm">
          <div className="flx gap-2">
            <Plus className="h-4 w-4" />
            {actionLabel}
          </div>
        </Button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        isShowActions
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        rowActions={rowActions}
        isSearchable={false}
        emptyState={`No ${title.toLowerCase()} found.`}
        total={total}
      />
    </div>
  );
};

const ProductSettingsPage = () => {
  const [categoryDialog, setCategoryDialog] = useState({
    open: false,
    item: null,
  });
  const [sizeDialog, setSizeDialog] = useState({
    open: false,
    item: null,
  });
  const [colorDialog, setColorDialog] = useState({
    open: false,
    item: null,
  });
  const [deleteState, setDeleteState] = useState({
    open: false,
    type: "",
    item: null,
  });

  const { data, isLoading } = useProductSettingsQuery();
  const settings = data?.data ?? {};
  const categories = useMemo(
    () => settings.categories ?? [],
    [settings.categories],
  );
  const sizes = useMemo(() => settings.sizes ?? [], [settings.sizes]);
  const colors = useMemo(() => settings.colors ?? [], [settings.colors]);

  const [deleteCategory] = useDeleteCategoryMutation();
  const [deleteSize] = useDeleteSizeMutation();
  const [deleteColor] = useDeleteColorMutation();
  const [deleteCollection] = useDeleteCollectionMutation();

  const mapSettingRows = (items, mapper) =>
    items.map((item) => ({
      id: item.id,
      created_at_raw: item.created_at,
      updated_at_raw: item.updated_at,
      created_at: formatDateTime(item.created_at),
      updated_at: formatDateTime(item.updated_at),
      created_by: getUserLabel(item.created_by),
      updated_by: getUserLabel(item.updated_by),
      raw: item,
      ...mapper(item),
    }));

  const categoryRows = useMemo(
    () => mapSettingRows(categories, (item) => ({ name: item.name })),
    [categories],
  );
  const sizeRows = useMemo(
    () => mapSettingRows(sizes, (item) => ({ name: item.name })),
    [sizes],
  );
  const colorRows = useMemo(
    () =>
      mapSettingRows(colors, (item) => ({
        name: (
          <div className="flx gap-3">
            <span
              className="h-5 w-5 rounded-full border"
              style={{ backgroundColor: item.color_code }}
            />
            <div>
              <div className="font-medium text-gray-900">{item.name}</div>
              <div className="text-xs text-gray-500">{item.color_code}</div>
            </div>
          </div>
        ),
      })),
    [colors],
  );

  const categoryColumns = buildBaseColumns("Category");
  const sizeColumns = buildBaseColumns("Size");
  const colorColumns = buildBaseColumns("Color");

  const openDeleteDialog = (type, item) => {
    setDeleteState({
      open: true,
      type,
      item,
    });
  };

  const handleDelete = async () => {
    if (!deleteState.item?.id) {
      return;
    }

    try {
      if (deleteState.type === "category") {
        await deleteCategory(deleteState.item.id).unwrap();
      } else if (deleteState.type === "size") {
        await deleteSize(deleteState.item.id).unwrap();
      } else if (deleteState.type === "color") {
        await deleteColor(deleteState.item.id).unwrap();
      } else if (deleteState.type === "collection") {
        await deleteCollection(deleteState.item.id).unwrap();
      }

      toast.success(
        `${deleteState.type.charAt(0).toUpperCase()}${deleteState.type.slice(
          1,
        )} deleted successfully.`,
      );
      setDeleteState({ open: false, type: "", item: null });
    } catch (error) {
      toast.error(
        error?.data?.message || error?.message || "Delete operation failed.",
      );
    }
  };

  const getRowActions = (type, onEdit) => (row) => [
    {
      label: "Update",
      onSelect: () => onEdit(row.raw),
    },
    {
      label: "Delete",
      destructive: true,
      onSelect: () => openDeleteDialog(type, row.raw),
    },
  ];

  return (
    <div>
      <div>
        <Title variant="lg" className="text-gray-900">
          Product Settings
        </Title>
        <Text className="mt-1 text-gray-500">
          Product Settings that helps to manage and organize filters
        </Text>
      </div>

      <div className="mt-8">
        <SettingsSection
          title="Categories"
          description="Manage product category options and audit details."
          actionLabel="New Category"
          onCreate={() => setCategoryDialog({ open: true, item: null })}
          data={categoryRows}
          columns={categoryColumns}
          rowActions={getRowActions("category", (item) =>
            setCategoryDialog({ open: true, item }),
          )}
          isLoading={isLoading}
          total={categoryRows?.length || 0}
        />

        <div className="grid grid-cols-2 gap-8 mt-10">
          <SettingsSection
            title="Sizes"
            description="Manage available product sizes and track updates."
            actionLabel="New Size"
            onCreate={() => setSizeDialog({ open: true, item: null })}
            data={sizeRows}
            columns={sizeColumns}
            rowActions={getRowActions("size", (item) =>
              setSizeDialog({ open: true, item }),
            )}
            isLoading={isLoading}
            total={sizeRows?.length || 0}
          />

          <SettingsSection
            title="Colors"
            description="Manage color presets and keep audit history visible."
            actionLabel="New Color"
            onCreate={() => setColorDialog({ open: true, item: null })}
            data={colorRows}
            columns={colorColumns}
            rowActions={getRowActions("color", (item) =>
              setColorDialog({ open: true, item }),
            )}
            isLoading={isLoading}
            total={colorRows?.length || 0}
          />
        </div>
      </div>

      <CategoryUpsertDialog
        open={categoryDialog.open}
        setOpen={(open) =>
          setCategoryDialog((prev) => ({
            ...prev,
            open,
            item: open ? prev.item : null,
          }))
        }
        categories={categories}
        initialData={categoryDialog.item}
      />

      <SizeUpsertDialog
        open={sizeDialog.open}
        setOpen={(open) =>
          setSizeDialog((prev) => ({
            ...prev,
            open,
            item: open ? prev.item : null,
          }))
        }
        sizes={sizes}
        initialData={sizeDialog.item}
      />

      <ColorUpsertDialog
        open={colorDialog.open}
        setOpen={(open) =>
          setColorDialog((prev) => ({
            ...prev,
            open,
            item: open ? prev.item : null,
          }))
        }
        initialData={colorDialog.item}
      />

      <DeleteDialog
        isOpen={deleteState.open}
        setIsOpen={(open) =>
          setDeleteState((prev) => ({
            ...prev,
            open,
            item: open ? prev.item : null,
            type: open ? prev.type : "",
          }))
        }
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ProductSettingsPage;
