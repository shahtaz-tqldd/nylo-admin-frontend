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
  useCreateSizeMutation,
  useUpdateSizeMutation,
} from "@/features/products/productApiSlice";

const SizeUpsertDialog = ({ open, setOpen, sizes, initialData = null }) => {
  const [sizeValue, setsizeValue] = useState(initialData?.name ?? "");
  const [createSize, { isLoading }] = useCreateSizeMutation();
  const [updateSize, { isLoading: isLoadingUpdate }] = useUpdateSizeMutation();
  const isEditMode = Boolean(initialData?.id);
  const isSubmitting = isLoading || isLoadingUpdate;

  const handleCreateSize = async () => {
    const normalizedName = sizeValue.trim();

    if (!normalizedName) {
      return;
    }

    try {
      const res = isEditMode
        ? await updateSize({
            id: initialData.id,
            body: { name: normalizedName },
          }).unwrap()
        : await createSize({ name: normalizedName }).unwrap();

      if (res?.data?.success || res?.success) {
        toast.success(
          res?.data?.message ||
            res?.message ||
            (isEditMode ? "Size updated!" : "New Size created!"),
        );
        setsizeValue("");
        setOpen(false);
      }
    } catch (error) {
      toast.error(
        `Size ${isEditMode ? "update" : "creation"} failed: ${
          error?.data?.message || error?.message || "Unknown error"
        }`,
      );
    }
  };

  React.useEffect(() => {
    setsizeValue(initialData?.name ?? "");
  }, [initialData, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Update Size" : "Add New Size"}</DialogTitle>
          <DialogDescription>
            Existing sizes:{" "}
            {sizes.length > 0
              ? sizes.map((size) => size.name).join(", ")
              : "No sizes yet."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-4">
          <FloatingInput
            label="New Size"
            value={sizeValue}
            onChange={(e) => setsizeValue(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleCreateSize}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : isEditMode
                ? "Update Size"
                : "Save Size"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SizeUpsertDialog;
