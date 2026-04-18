import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/dialog/delete-dialog";
import DataTable from "@/components/table";
import StatusBadge from "@/components/ui/status";
import { Text, Title } from "@/components/ui/typography";
import {
  useCouponDetailsQuery,
  useCouponListQuery,
  useDeleteCouponMutation,
} from "@/features/coupons/couponApiSlice";
import { Copy, Plus } from "lucide-react";

import CouponDetailsDrawer from "./coupon-details-drawer";
import {
  formatCouponDateTime,
  formatCouponDiscount,
  formatCouponStatus,
  formatMoneyValue,
  getCouponUsageProgress,
} from "./coupon-utils";
import UpdateCouponDialog from "./update-coupon-dialog";

const CouponPage = () => {
  const [couponDialogState, setCouponDialogState] = useState({
    open: false,
    item: null,
  });
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { data, isLoading } = useCouponListQuery();
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();
  const { data: detailResponse, isFetching: isDetailsLoading } =
    useCouponDetailsQuery(selectedCoupon?.id, {
      skip: !selectedCoupon?.id || !isDetailsOpen,
    });

  const coupons = useMemo(() => {
    const rawCoupons = data?.data?.results ?? data?.data ?? data?.results ?? [];
    return Array.isArray(rawCoupons) ? rawCoupons : [];
  }, [data]);
  const detailedCoupon = detailResponse?.data ?? detailResponse ?? selectedCoupon;

  const openCreateDialog = () => {
    setCouponDialogState({ open: true, item: null });
  };

  const openUpdateDialog = (coupon) => {
    setCouponDialogState({ open: true, item: coupon });
  };

  const openViewDrawer = (coupon) => {
    setSelectedCoupon(coupon);
    setIsDetailsOpen(true);
  };

  const openDeleteDialog = (coupon) => {
    setSelectedCoupon(coupon);
    setIsDeleteOpen(true);
  };

  const handleDeleteCoupon = async () => {
    if (!selectedCoupon?.id) {
      toast.error("No coupon selected.");
      return false;
    }

    try {
      const response = await deleteCoupon(selectedCoupon.id).unwrap();
      toast.success(response?.message || "Coupon deleted successfully.");
      setSelectedCoupon(null);
      return true;
    } catch (error) {
      toast.error(error?.data?.message || "Coupon delete failed.");
      return false;
    }
  };

  const couponColumns = [
    {
      key: "code",
      header: "Code",
      accessor: (coupon) => coupon.code,
      render: (coupon) => <CouponCode code={coupon.code} />,
    },
    {
      key: "description",
      header: "Description",
      accessor: (coupon) => coupon.description || "",
      render: (coupon) => coupon.description || "-",
    },
    {
      key: "discount",
      header: "Discount",
      accessor: (coupon) => Number(coupon.value ?? 0),
      render: (coupon) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {formatCouponDiscount(coupon)}
          </div>
          <div className="text-xs text-gray-500">
            Min: {formatMoneyValue(coupon.minimum_order_amount)}
          </div>
        </div>
      ),
    },
    {
      key: "usage",
      header: "Usage",
      accessor: (coupon) => Number(coupon.used_count ?? 0),
      render: (coupon) => (
        <UsageDisplay
          usedCount={coupon.used_count}
          usageLimit={coupon.usage_limit}
        />
      ),
    },
    {
      key: "valid_date",
      header: "Valid Until",
      sortable: true,
      accessor: (coupon) => coupon.valid_until || "",
      render: (coupon) => formatCouponDateTime(coupon.valid_until),
    },
    {
      key: "status",
      header: "Status",
      accessor: (coupon) => formatCouponStatus(coupon),
      render: (coupon) => <StatusBadge status={formatCouponStatus(coupon)} />,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flbx">
        <div>
          <Title variant="lg">Coupons</Title>
          <Text className="mt-2 text-gray-600">
            Manage discount coupons and promotional codes
          </Text>
        </div>

        <Button onClick={openCreateDialog} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Coupon
        </Button>
      </div>

      <DataTable
        data={coupons}
        columns={couponColumns}
        defaultPageSize={10}
        isShowActions
        isShowCheckbox
        isLoading={isLoading}
        rowActions={(coupon) => [
          {
            label: "View",
            onSelect: () => openViewDrawer(coupon),
          },
          {
            label: "Edit",
            onSelect: () => openUpdateDialog(coupon),
          },
          {
            label: "Delete",
            onSelect: () => openDeleteDialog(coupon),
            destructive: true,
          },
        ]}
      />

      <UpdateCouponDialog
        open={couponDialogState.open}
        setOpen={(open) =>
          setCouponDialogState((prev) => ({
            ...prev,
            open,
            item: open ? prev.item : null,
          }))
        }
        initialData={couponDialogState.item}
      />

      <CouponDetailsDrawer
        open={isDetailsOpen}
        setOpen={(open) => {
          setIsDetailsOpen(open);
          if (!open) {
            setSelectedCoupon(null);
          }
        }}
        coupon={detailedCoupon}
        isLoading={isDetailsLoading}
      />

      <DeleteDialog
        isOpen={isDeleteOpen}
        setIsOpen={(open) => {
          setIsDeleteOpen(open);
          if (!open) {
            setSelectedCoupon(null);
          }
        }}
        onConfirm={handleDeleteCoupon}
        isLoading={isDeleting}
        title="Delete coupon?"
        description={`This will permanently delete ${
          selectedCoupon?.code ? `"${selectedCoupon.code}"` : "this coupon"
        }.`}
      />
    </div>
  );
};

const UsageDisplay = ({ usedCount, usageLimit }) => {
  const progress = getCouponUsageProgress({
    used_count: usedCount,
    usage_limit: usageLimit,
  });

  return (
    <div className="w-32">
      <div className="mb-1 text-sm text-gray-900">
        {usedCount || 0} / {usageLimit || "∞"}
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-200">
        <div
          className="h-1.5 rounded-full bg-primary transition-all"
          style={{ width: `${progress ?? 0}%` }}
        />
      </div>
    </div>
  );
};

const CouponCode = ({ code }) => {
  const handleCopyCode = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`Coupon code "${value}" copied.`);
    } catch (_error) {
      toast.error("Failed to copy coupon code.");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm font-semibold">{code}</span>
      <button
        type="button"
        onClick={() => handleCopyCode(code)}
        className="text-gray-400 transition-colors hover:text-gray-600"
      >
        <Copy className="h-4 w-4" />
      </button>
    </div>
  );
};

export default CouponPage;
