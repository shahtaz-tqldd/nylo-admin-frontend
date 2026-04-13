import React, { useMemo, useState } from "react";
import moment from "moment";

import DataTable from "@/components/table";
import { Button } from "@/components/ui/button";
import { TableUserProfile } from "@/components/ui/profile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Text, Title } from "@/components/ui/typography";
import { useOrderListQuery } from "@/features/orders/orderApiSlice";
import { ChevronDown, ChevronUp, Plus, Upload } from "lucide-react";

const ORDER_STATUS_OPTIONS = [
  "pending",
  "approved",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const FALLBACK_ITEM_IMAGE =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300";

const formatStatusLabel = (value) => (value ? value.replaceAll("_", " ") : "-");

const getStatusClasses = (status) => {
  const normalized = (status ?? "").toLowerCase();

  const styles = {
    approved: "bg-emerald-100 text-emerald-700",
    paid: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-sky-100 text-sky-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    failed: "bg-red-100 text-red-700",
    unpaid: "bg-slate-100 text-slate-700",
  };

  return styles[normalized] ?? "bg-slate-100 text-slate-700";
};

const StatusPill = ({ value }) => (
  <span
    className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
      value,
    )}`}
  >
    {formatStatusLabel(value)}
  </span>
);

const ItemSnapshotCell = ({ items = [], itemsCount = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!items.length) {
    return <span className="text-sm text-muted-foreground">No items</span>;
  }

  return (
    <div className="min-w-[280px]">
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-lg border bg-slate-50 px-3 py-2 text-left transition hover:bg-slate-100"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div>
          <p className="text-sm font-medium text-slate-900">
            {itemsCount} {itemsCount === 1 ? "item" : "items"}
          </p>
          <p className="text-xs text-slate-500">
            {isOpen ? "Hide order items" : "View order items"}
          </p>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-slate-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-500" />
        )}
      </button>

      {isOpen ? (
        <div className="mt-2 space-y-2 rounded-xl border bg-white p-3">
          {items.map((snapshot) => (
            <div
              key={snapshot.id}
              className="flex items-center gap-3 rounded-lg border bg-slate-50 p-2"
            >
              <img
                src={snapshot.image || FALLBACK_ITEM_IMAGE}
                alt={snapshot.name}
                className="h-12 w-12 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">
                  {snapshot.name}
                </p>
                <p className="text-xs text-slate-500">
                  Color: {snapshot.color || "-"} | Size: {snapshot.size || "-"}
                </p>
              </div>
              <span className="text-xs font-medium text-slate-600">
                x{snapshot.quantity}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const OrderDetailsDrawer = ({ open, setOpen, order }) => {
  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerContent className="h-screen w-full max-w-full rounded-none border-l p-0 sm:max-w-2xl">
        <div className="flex h-full flex-col">
          <DrawerHeader className="border-b px-6 py-5 text-left">
            <DrawerTitle>
              Order #{order?.tracking_number || "details"}
            </DrawerTitle>
            <DrawerDescription>
              Review customer, payment, and item details without leaving this
              page.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard
                label="Customer"
                value={order?.customer_name || "Unknown Customer"}
                secondary={`${order?.customer_email || "-"} | ${
                  order?.customer_phone || "-"
                }`}
              />
              <InfoCard
                label="Tracking Number"
                value={order?.tracking_number || "-"}
                secondary={order?.id || "-"}
              />
              <InfoCard
                label="Order Status"
                value={formatStatusLabel(order?.status)}
              />
              <InfoCard
                label="Payment Status"
                value={formatStatusLabel(order?.payment_status)}
              />
              <InfoCard
                label="Placed On"
                value={
                  order?.created_at
                    ? moment(order.created_at).format("MMM Do YYYY, hh:mm a")
                    : "-"
                }
              />
              <InfoCard
                label="Checkout Expires"
                value={
                  order?.checkout_expires_at
                    ? moment(order.checkout_expires_at).format(
                        "MMM Do YYYY, hh:mm a",
                      )
                    : "-"
                }
              />
            </div>

            <div className="rounded-2xl border p-5">
              <h3 className="text-base font-semibold text-slate-900">
                Payment Summary
              </h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <InfoRow
                  label="Subtotal"
                  value={formatMoney(order?.currency, order?.subtotal)}
                />
                <InfoRow
                  label="Discount"
                  value={formatMoney(order?.currency, order?.discount_amount)}
                />
                <InfoRow
                  label="Shipping"
                  value={formatMoney(order?.currency, order?.shipping_charge)}
                />
                <InfoRow
                  label="Tax"
                  value={formatMoney(order?.currency, order?.tax_amount)}
                />
                <InfoRow label="Promo Code" value={order?.promo_code || "-"} />
                <InfoRow
                  label="Total"
                  value={formatMoney(order?.currency, order?.total_amount)}
                  isStrong
                />
              </div>
            </div>

            <div className="rounded-2xl border p-5">
              <h3 className="text-base font-semibold text-slate-900">
                Item Snapshot
              </h3>
              <div className="mt-4 space-y-3">
                {(order?.items_snapshot ?? []).map((snapshot) => (
                  <div
                    key={snapshot.id}
                    className="flex items-center gap-4 rounded-xl border bg-slate-50 p-3"
                  >
                    <img
                      src={snapshot.image || FALLBACK_ITEM_IMAGE}
                      alt={snapshot.name}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900">
                        {snapshot.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        Color: {snapshot.color || "-"} | Size:{" "}
                        {snapshot.size || "-"}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-slate-600">
                      Qty: {snapshot.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border p-5">
              <h3 className="text-base font-semibold text-slate-900">
                Stripe Reference
              </h3>
              <div className="mt-4 space-y-3">
                <InfoRow
                  label="Checkout Session"
                  value={order?.stripe_checkout_session_id || "-"}
                  mono
                />
                <InfoRow
                  label="Payment Intent"
                  value={order?.stripe_payment_intent_id || "-"}
                  mono
                />
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const UpdateOrderStatusDialog = ({
  open,
  setOpen,
  order,
  selectedStatus,
  setSelectedStatus,
  onSave,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update order status</DialogTitle>
          <DialogDescription>
            Change the current status for order #{order?.tracking_number || "-"}
            .
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="rounded-lg border bg-slate-50 p-3 text-sm">
            <p className="font-medium text-slate-900">
              {order?.customer_name || "Unknown Customer"}
            </p>
            <p className="text-slate-500">{order?.customer_email || "-"}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Order Status
            </label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {formatStatusLabel(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button onClick={onSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const CancelOrderDialog = ({ open, setOpen, order, onConfirm }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel order</DialogTitle>
          <DialogDescription>
            This will mark order #{order?.tracking_number || "-"} as cancelled.
            You can wire the backend API later without changing this flow.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Keep order
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Cancel order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const OrderPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [viewOrder, setViewOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [cancelOrder, setCancelOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusOverrides, setStatusOverrides] = useState({});

  const { data, isLoading } = useOrderListQuery({
    page,
    page_size: pageSize,
    search_str: search,
  });

  const orders = useMemo(
    () =>
      data?.data?.map((item) => ({
        id: item.id,
        tracking_number: item.tracking_number,
        customer_name: `${item?.customer?.first_name ?? ""} ${
          item?.customer?.last_name ?? ""
        }`.trim(),
        customer_email: item?.customer?.email ?? "-",
        customer_phone: item?.customer?.phone ?? "-",
        status: statusOverrides[item.id] ?? item?.status ?? "-",
        payment_status: item?.payment_status ?? "-",
        currency: item?.currency ?? "usd",
        subtotal: item?.subtotal ?? "0.00",
        discount_amount: item?.discount_amount ?? "0.00",
        shipping_charge: item?.shipping_charge ?? "0.00",
        tax_amount: item?.tax_amount ?? "0.00",
        total_amount: Number(item?.total_amount ?? 0),
        total_amount_raw: item?.total_amount ?? "0.00",
        promo_code: item?.promo_code,
        stripe_checkout_session_id: item?.stripe_checkout_session_id,
        stripe_payment_intent_id: item?.stripe_payment_intent_id,
        checkout_expires_at: item?.checkout_expires_at ?? "",
        items_count: item?.items_count ?? 0,
        items_snapshot: item?.items_snapshot ?? [],
        created_at: item?.created_at ?? "",
      })) ?? [],
    [data?.data, statusOverrides],
  );

  const columns = [
    {
      key: "tracking_number",
      header: "Tracking",
      render: (item) => (
        <div>
          <p className="font-medium text-foreground">
            {item.tracking_number || "-"}
          </p>
        </div>
      ),
      searchAccessor: (item) => `${item.tracking_number} ${item.id}`,
    },
    {
      key: "customer_name",
      header: "Customer",
      render: (item) => (
        <TableUserProfile
          name={item.customer_name || "Unknown Customer"}
          email={item.customer_email}
        />
      ),
      searchAccessor: (item) =>
        `${item.customer_name} ${item.customer_email} ${item.customer_phone}`,
    },
    {
      key: "items_snapshot",
      header: "Items",
      sortable: true,
      accessor: (item) => item.items_count,
      render: (item) => (
        <ItemSnapshotCell
          items={item.items_snapshot}
          itemsCount={item.items_count}
        />
      ),
    },
    {
      key: "total_amount",
      header: "Total",
      sortable: true,
      accessor: (item) => item.total_amount,
      render: (item) => formatMoney(item.currency, item.total_amount_raw),
    },
    {
      key: "payment_status",
      header: "Payment",
      sortable: true,
      render: (item) => <StatusPill value={item.payment_status} />,
    },
    {
      key: "status",
      header: "Order Status",
      sortable: true,
      render: (item) => <StatusPill value={item.status} />,
    },
    {
      key: "created_at",
      header: "Placed On",
      sortable: true,
      accessor: (item) => item.created_at,
      render: (item) => moment(item.created_at).format("MMM Do YYYY, hh:mm a"),
    },
  ];

  const orderRowActions = (order) => [
    {
      label: "View",
      onSelect: () => setViewOrder(order),
    },
    {
      label: "Edit",
      onSelect: () => {
        setSelectedStatus(order.status);
        setEditOrder(order);
      },
    },
    {
      label: "Cancel",
      destructive: true,
      onSelect: () => setCancelOrder(order),
    },
  ];

  const handleSaveStatus = () => {
    if (!editOrder || !selectedStatus) return;

    setStatusOverrides((prev) => ({
      ...prev,
      [editOrder.id]: selectedStatus,
    }));
    setEditOrder(null);
  };

  const handleCancelOrder = () => {
    if (!cancelOrder) return;

    setStatusOverrides((prev) => ({
      ...prev,
      [cancelOrder.id]: "cancelled",
    }));
    setCancelOrder(null);
  };

  return (
    <>
      <div>
        <div className="flex justify-between">
          <div>
            <Title variant="lg">Orders</Title>
            <Text className="mt-2">
              High-level summary of orders and their analytics
            </Text>
          </div>
          <div className="flx gap-4">
            <Button variant="outline" className="pl-3 pr-4">
              <div className="flx gap-2">
                <Upload className="!h-3.5" />
                Export
              </div>
            </Button>
            <Button className="pl-3 pr-4">
              <div className="flx gap-2">
                <Plus className="!h-3.5" />
                Order
              </div>
            </Button>
          </div>
        </div>

        <DataTable
          data={orders}
          columns={columns}
          defaultPageSize={10}
          className="mt-8"
          isShowActions
          isShowCheckbox
          isLoading={isLoading}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          searchValue={search}
          onSearchChange={setSearch}
          rowActions={orderRowActions}
        />
      </div>

      <OrderDetailsDrawer
        open={Boolean(viewOrder)}
        setOpen={(open) => {
          if (!open) setViewOrder(null);
        }}
        order={viewOrder}
      />

      <UpdateOrderStatusDialog
        open={Boolean(editOrder)}
        setOpen={(open) => {
          if (!open) setEditOrder(null);
        }}
        order={editOrder}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onSave={handleSaveStatus}
      />

      <CancelOrderDialog
        open={Boolean(cancelOrder)}
        setOpen={(open) => {
          if (!open) setCancelOrder(null);
        }}
        order={cancelOrder}
        onConfirm={handleCancelOrder}
      />
    </>
  );
};

export default OrderPage;

const InfoCard = ({ label, value, secondary }) => {
  return (
    <div className="rounded-2xl border bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
      {secondary ? (
        <p className="mt-1 text-xs text-slate-500">{secondary}</p>
      ) : null}
    </div>
  );
};

const InfoRow = ({ label, value, mono = false, isStrong = false }) => {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span
        className={`text-right text-sm text-slate-900 ${
          mono ? "break-all font-mono text-xs" : ""
        } ${isStrong ? "font-semibold" : "font-medium"}`}
      >
        {value}
      </span>
    </div>
  );
};

function formatMoney(currency, amount) {
  return `${(currency ?? "usd").toUpperCase()} ${Number(amount ?? 0).toFixed(2)}`;
}
