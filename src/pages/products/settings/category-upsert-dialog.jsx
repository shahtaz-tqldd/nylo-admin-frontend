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
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/features/products/productApiSlice";
import { FloatingInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CategoryUpsertDialog = ({
  open,
  setOpen,
  categories,
  initialData = null,
}) => {
  const [categoryName, setCategoryName] = useState(initialData?.name ?? "");
  const [createCategory, { isLoading: isLoadingCreateCategory }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isLoadingUpdateCategory }] =
    useUpdateCategoryMutation();
  const isEditMode = Boolean(initialData?.id);
  const isLoading = isLoadingCreateCategory || isLoadingUpdateCategory;

  const handleCreateCategory = async () => {
    const normalizedName = categoryName.trim();

    if (!normalizedName) {
      return;
    }

    try {
      const res = isEditMode
        ? await updateCategory({
            id: initialData.id,
            body: { name: normalizedName },
          }).unwrap()
        : await createCategory({ name: normalizedName }).unwrap();

      if (res?.data?.success || res?.success) {
        toast.success(
          res?.data?.message ||
            res?.message ||
            (isEditMode
              ? "Category updated successfully!"
              : "New category created!"),
        );
        setCategoryName("");
        setOpen(false);
      }
    } catch (error) {
      toast.error(
        `Category ${isEditMode ? "update" : "creation"} failed: ${
          error?.data?.message || error?.message || "Unknown error"
        }`,
      );
    }
  };

  React.useEffect(() => {
    setCategoryName(initialData?.name ?? "");
  }, [initialData, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Update Category" : "Add New Category"}
          </DialogTitle>
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
            disabled={isLoading}
          >
            {isLoading
              ? "Saving..."
              : isEditMode
                ? "Update Category"
                : "Save Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryUpsertDialog;
