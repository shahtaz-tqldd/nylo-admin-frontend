import React, { useState } from "react";
import toast from "react-hot-toast";

// components
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
import { FloatingTextarea } from "@/components/ui/textarea";
import { ImageUploadTile } from "@/components/image-upload/image-upload";

// services
import {
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
} from "@/features/products/productApiSlice";
import { canRevokePreview, createPreviewImage } from "@/lib/image-preview";

const CollectionUpsertDialog = ({ open, setOpen, initialData = null }) => {
  const [newCollectionImage, setNewCollectionImage] = useState(null);
  const [newCollectionTitle, setNewCollectionTitle] = useState(
    initialData?.title ?? "",
  );
  const [newCollectionSubtitle, setNewCollectionSubtitle] = useState(
    initialData?.subtitle ?? "",
  );
  const [newCollectionType, setNewCollectionType] = useState(
    initialData?.type ?? "",
  );
  const [newCollectionDescription, setNewCollectionDescription] = useState(
    initialData?.description ?? "",
  );

  const [createCollection, { isLoading }] = useCreateCollectionMutation();
  const [updateCollection, { isLoading: isLoadingUpdate }] =
    useUpdateCollectionMutation();
  const isEditMode = Boolean(initialData?.id);
  const isSubmitting = isLoading || isLoadingUpdate;
  const replaceCollectionImage = (file) => {
    if (!file) {
      return;
    }

    if (canRevokePreview(newCollectionImage)) {
      URL.revokeObjectURL(newCollectionImage.preview);
    }

    setNewCollectionImage(createPreviewImage(file));
  };

  const removeCollectionImage = () => {
    if (canRevokePreview(newCollectionImage)) {
      URL.revokeObjectURL(newCollectionImage.preview);
    }

    setNewCollectionImage(null);
  };

  const handleCreateCollection = async () => {
    const normalizedTitle = newCollectionTitle.trim();

    if (!normalizedTitle) {
      return;
    }

    const formData = new FormData();
    formData.append("title", normalizedTitle);

    if (newCollectionSubtitle.trim()) {
      formData.append("subtitle", newCollectionSubtitle.trim());
    }

    if (newCollectionType.trim()) {
      formData.append("type", newCollectionType.trim());
    }

    if (newCollectionDescription.trim()) {
      formData.append("description", newCollectionDescription.trim());
    }

    if (newCollectionImage?.file) {
      formData.append("image", newCollectionImage.file);
    }

    try {
      const res = isEditMode
        ? await updateCollection({
            id: initialData.id,
            body: formData,
          }).unwrap()
        : await createCollection(formData).unwrap();
      if (res?.success || res?.data?.success) {
        toast.success(
          res?.message ||
            res?.data?.message ||
            (isEditMode
              ? "Collection updated successfully!"
              : "Collection created successfully!"),
        );
        setNewCollectionTitle("");
        setNewCollectionSubtitle("");
        setNewCollectionType("");
        setNewCollectionDescription("");
        setNewCollectionImage(null);
        setOpen(false);
      }
    } catch (error) {
      toast.error(
        `Collection ${isEditMode ? "update" : "creation"} failed: ${
          error?.data?.message || error?.message || "Unknown error"
        }`,
      );
    }
  };

  React.useEffect(() => {
    setNewCollectionTitle(initialData?.title ?? "");
    setNewCollectionSubtitle(initialData?.subtitle ?? "");
    setNewCollectionType(initialData?.type ?? "");
    setNewCollectionDescription(initialData?.description ?? "");
    setNewCollectionImage(
      initialData?.image_url
        ? {
            preview: initialData.image_url,
            file: null,
          }
        : null,
    );
  }, [initialData, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Update Collection" : "Add New Collection"}
          </DialogTitle>
          <DialogDescription>
            Collections use a title, optional details, and an uploaded image.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <FloatingInput
              label="Title"
              value={newCollectionTitle}
              onChange={(e) => setNewCollectionTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <FloatingInput
              label="Subtitle"
              value={newCollectionSubtitle}
              onChange={(e) => setNewCollectionSubtitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <FloatingInput
              label="Type"
              value={newCollectionType}
              onChange={(e) => setNewCollectionType(e.target.value)}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <FloatingTextarea
              label="Description"
              rows={3}
              value={newCollectionDescription}
              onChange={(e) => setNewCollectionDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <ImageUploadTile
              id="collection-image-upload"
              image={newCollectionImage}
              label="Upload collection image"
              onSelect={replaceCollectionImage}
              onRemove={removeCollectionImage}
            />
          </div>
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
            onClick={handleCreateCollection}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : isEditMode
                ? "Update Collection"
                : "Save Collection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionUpsertDialog;

// onOpenChange={(open) => {
//   setIsCollectionDialogOpen(open);

//   if (!open) {
//     removeCollectionImage();
//   }
// }}
