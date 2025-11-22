import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Text, Title } from "@/components/ui/typography";
import { Plus, Copy } from "lucide-react";
import UpdateCouponDialog from "./update-coupon-dialog";
import DataTable from "@/components/table";
import StatusBadge from "@/components/ui/status";
import { DEMO_COUPONS } from "./demo_data";

const CouponPage = () => {
  const [coupons, setCoupons] = useState(DEMO_COUPONS);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minPurchase: "",
    maxDiscount: "",
    usageLimit: "",
    startDate: "",
    endDate: "",
    status: "active",
  });

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      minPurchase: "",
      maxDiscount: "",
      usageLimit: "",
      startDate: "",
      endDate: "",
      status: "active",
    });
    setEditingCoupon(null);
  };

  const handleOpenDialog = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue.toString(),
        minPurchase: coupon.minPurchase.toString(),
        maxDiscount: coupon.maxDiscount?.toString() || "",
        usageLimit: coupon.usageLimit.toString(),
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        status: coupon.status,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingCoupon) {
      setCoupons(
        coupons.map((c) =>
          c.id === editingCoupon.id
            ? {
                ...c,
                ...formData,
                discountValue: parseFloat(formData.discountValue),
                minPurchase: parseFloat(formData.minPurchase),
                maxDiscount: formData.maxDiscount
                  ? parseFloat(formData.maxDiscount)
                  : null,
                usageLimit: parseInt(formData.usageLimit),
              }
            : c
        )
      );
    } else {
      const newCoupon = {
        id: coupons.length + 1,
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        minPurchase: parseFloat(formData.minPurchase),
        maxDiscount: formData.maxDiscount
          ? parseFloat(formData.maxDiscount)
          : null,
        usageLimit: parseInt(formData.usageLimit),
        usedCount: 0,
      };
      setCoupons([...coupons, newCoupon]);
    }

    handleCloseDialog();
  };

  const couponColumns = [
    { key: "code", header: "Code" },
    { key: "description", header: "Description" },
    { key: "discount", header: "Discount" },
    { key: "usage", header: "Usage" },
    { key: "valid_date", header: "Valid Until", sortable: true },
    { key: "status", header: "Status" },
  ];

  const UsageDisplay = ({ usedCount, usageLimit }) => {
    const percentage = (usedCount / usageLimit) * 100;

    return (
      <div className="w-32">
        <div className="text-sm text-gray-900 mb-1">
          {usedCount} / {usageLimit}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-primary h-1.5 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  const CouponCode = ({ code }) => {
    const handleCopyCode = (code) => {
      navigator.clipboard.writeText(code);
      alert(`Coupon code "${code}" copied!`);
    };

    return (
      <div className="flex items-center gap-2">
        <span className="font-mono font-semibold text-sm">{code}</span>
        <button
          onClick={() => handleCopyCode(code)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
    );
  };
  // Main Mapper Function
  const COUPONS_DATA = DEMO_COUPONS?.map((coupon) => ({
    id: coupon.id,
    code: <CouponCode code={coupon.code} />,
    description: coupon.description,
    discount: (
      <div>
        <div className="text-sm font-medium text-gray-900">
          {coupon.discountType === "percentage"
            ? `${coupon.discountValue}%`
            : `$${coupon.discountValue}`}
        </div>
        {coupon.minPurchase > 0 && (
          <div className="text-xs text-gray-500">
            Min: ${coupon.minPurchase}
          </div>
        )}
      </div>
    ),
    usage: (
      <UsageDisplay
        usedCount={coupon.usedCount}
        usageLimit={coupon.usageLimit}
      />
    ),
    valid_date: coupon.endDate,
    status: <StatusBadge status={coupon.status} />,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flbx">
        <div>
          <Title variant="lg">Coupons</Title>
          <Text className="mt-2 text-gray-600">
            Manage discount coupons and promotional codes
          </Text>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Coupon
        </Button>
      </div>

      <DataTable
        data={COUPONS_DATA}
        columns={couponColumns}
        defaultPageSize={10}
        isShowActions
        isShowCheckbox
      />

      {/* Create/Edit Dialog */}
      <UpdateCouponDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        editingCoupon={editingCoupon}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        handleCloseDialog={handleCloseDialog}
      />
    </div>
  );
};

export default CouponPage;
