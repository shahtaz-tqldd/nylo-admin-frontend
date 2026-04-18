import React from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  useCreateCouponMutation,
  useUpdateCouponMutation,
} from "@/features/coupons/couponApiSlice";
import {
  buildCouponPayload,
  formatDateTimeLocalInput,
} from "./coupon-utils";

const UpdateCouponDialog = ({ open, setOpen, initialData = null }) => {
  const [formData, setFormData] = React.useState({
    code: "",
    description: "",
    coupon_type: "percentage",
    value: "",
    minimum_order_amount: "0",
    maximum_discount_amount: "",
    usage_limit: "",
    valid_from: "",
    valid_until: "",
    is_active: true,
  });
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const isEditMode = Boolean(initialData?.id);
  const isSubmitting = isCreating || isUpdating;

  React.useEffect(() => {
    setFormData({
      code: initialData?.code ?? "",
      description: initialData?.description ?? "",
      coupon_type: initialData?.coupon_type ?? "percentage",
      value:
        initialData?.value === null || initialData?.value === undefined
          ? ""
          : String(initialData.value),
      minimum_order_amount:
        initialData?.minimum_order_amount === null ||
        initialData?.minimum_order_amount === undefined
          ? "0"
          : String(initialData.minimum_order_amount),
      maximum_discount_amount:
        initialData?.maximum_discount_amount === null ||
        initialData?.maximum_discount_amount === undefined
          ? ""
          : String(initialData.maximum_discount_amount),
      usage_limit:
        initialData?.usage_limit === null || initialData?.usage_limit === undefined
          ? ""
          : String(initialData.usage_limit),
      valid_from: formatDateTimeLocalInput(initialData?.valid_from),
      valid_until: formatDateTimeLocalInput(initialData?.valid_until),
      is_active: initialData?.is_active ?? true,
    });
  }, [initialData, open]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    const payload = buildCouponPayload(formData);

    if (!payload.code || !payload.value) {
      toast.error("Coupon code and value are required.");
      return;
    }

    if (payload.valid_from && payload.valid_until) {
      const startsAt = new Date(payload.valid_from);
      const endsAt = new Date(payload.valid_until);

      if (startsAt > endsAt) {
        toast.error("Valid until must be after valid from.");
        return;
      }
    }

    try {
      const response = isEditMode
        ? await updateCoupon({ id: initialData.id, body: payload }).unwrap()
        : await createCoupon(payload).unwrap();

      toast.success(
        response?.message ||
          (isEditMode
            ? "Coupon updated successfully."
            : "Coupon created successfully."),
      );
      setOpen(false);
    } catch (error) {
      toast.error(
        error?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} coupon.`,
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Coupon" : "Create New Coupon"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the coupon details below"
              : "Fill in the details to create a new discount coupon"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code*</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
                placeholder="e.g., SUMMER25"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status*</Label>
              <Select
                value={formData.is_active ? "active" : "inactive"}
                onValueChange={(value) =>
                  setFormData({ ...formData, is_active: value === "active" })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="e.g., Summer Sale 25% Off"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discountType">Discount Type*</Label>
              <Select
                value={formData.coupon_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, coupon_type: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountValue">Discount Value*</Label>
              <Input
                id="discountValue"
                type="number"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
                placeholder={formData.coupon_type === "percentage" ? "25" : "50"}
                required
                min="0.01"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minPurchase">Minimum Purchase ($)*</Label>
              <Input
                id="minPurchase"
                type="number"
                value={formData.minimum_order_amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minimum_order_amount: e.target.value,
                  })
                }
                placeholder="0"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxDiscount">Max Discount ($)</Label>
              <Input
                id="maxDiscount"
                type="number"
                value={formData.maximum_discount_amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maximum_discount_amount: e.target.value,
                  })
                }
                placeholder="Optional"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="usageLimit">Usage Limit</Label>
            <Input
              id="usageLimit"
              type="number"
              value={formData.usage_limit}
              onChange={(e) =>
                setFormData({ ...formData, usage_limit: e.target.value })
              }
              placeholder="Optional"
              min="1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Valid From</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.valid_from}
                onChange={(e) =>
                  setFormData({ ...formData, valid_from: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Valid Until</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.valid_until}
                onChange={(e) =>
                  setFormData({ ...formData, valid_until: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : isEditMode
                ? "Update Coupon"
                : "Create Coupon"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCouponDialog;
