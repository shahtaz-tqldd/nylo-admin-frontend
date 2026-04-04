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

import { useCreateSizeMutation } from "@/features/products/productApiSlice";

const SizeUpsertDialog = ({ open, setOpen, sizes }) => {
  const [sizeValue, setsizeValue] = useState("");
  const [createSize, { isLoading }] = useCreateSizeMutation();

  const handleCreateSize = async () => {
    const normalizedName = sizeValue.trim();

    if (!normalizedName) {
      return;
    }

    try {
      const res = await createSize({ name: normalizedName }).unwrap();

      if (res?.data?.success) {
        toast.success(res?.data?.message || "New Size created!");
        setOpen(false);
      }
    } catch (error) {
      toast.error(`Size creation failed: ${error}`);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Size</DialogTitle>
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
          <Button type="button" onClick={handleCreateSize} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Size"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SizeUpsertDialog;
