import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateCategoryMutation } from "@/features/products/productApiSlice";
import { FloatingInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CategoryUpsertDialog = ({ open, setOpen, categories }) => {
  const [categoryName, setCategoryName] = useState("");
  const [createCategory, { isLoading: isLoadingCreateCategory }] =
    useCreateCategoryMutation();

  const handleCreateCategory = async () => {
    const normalizedName = categoryName.trim();

    if (!normalizedName) {
      return;
    }

    try {
      const res = await createCategory({ name: normalizedName }).unwrap();

      if (res.data.success) {
        toast.success(res.data.message || "New category created!");
        setOpen(false);
      }
    } catch (error) {
      toast.error(`Category creation failed: ${error}`);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Existing categories:{" "}
            {categories.length > 0
              ? categories.map((category) => category.name).join(", ")
              : "No categories yet."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-4">
          <FloatingInput
            label="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
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
            onClick={handleCreateCategory}
            disabled={isLoadingCreateCategory}
          >
            {isLoadingCreateCategory ? "Saving..." : "Save Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryUpsertDialog;
