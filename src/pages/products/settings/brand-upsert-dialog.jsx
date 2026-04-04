import React, { useState } from "react";
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
import { FloatingInput } from "@/components/ui/input";
import {
  useCreateBrandMutation,
  useUpdateBrandMutation,
} from "@/features/products/productApiSlice";

const BrandUpsertDialog = ({ open, setOpen, brands, initialData = null }) => {
  const [brandName, setBrandName] = useState(initialData?.name ?? "");
  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();
  const isEditMode = Boolean(initialData?.id);
  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = async () => {
    const normalizedName = brandName.trim();

    if (!normalizedName) {
      return;
    }

    try {
      const res = isEditMode
        ? await updateBrand({
            id: initialData.id,
            body: { name: normalizedName },
          }).unwrap()
        : await createBrand({ name: normalizedName }).unwrap();

      if (res?.data?.success || res?.success) {
        toast.success(
          res?.data?.message ||
            res?.message ||
            (isEditMode ? "Brand updated successfully!" : "Brand created!"),
        );
        setBrandName("");
        setOpen(false);
      }
    } catch (error) {
      toast.error(
        `Brand ${isEditMode ? "update" : "creation"} failed: ${
          error?.data?.message || error?.message || "Unknown error"
        }`,
      );
    }
  };

  React.useEffect(() => {
    setBrandName(initialData?.name ?? "");
  }, [initialData, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Update Brand" : "Add New Brand"}</DialogTitle>
          <DialogDescription>
            Existing brands:{" "}
            {brands.length > 0
              ? brands.map((brand) => brand.name).join(", ")
              : "No brands yet."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-2">
          <FloatingInput
            label="Brand Name"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : isEditMode
                ? "Update Brand"
                : "Save Brand"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BrandUpsertDialog;
