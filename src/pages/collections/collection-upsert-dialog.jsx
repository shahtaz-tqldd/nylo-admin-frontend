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
import { FloatingInput, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useCreateCollectionMutation } from "@/features/products/productApiSlice";
import { ImageUploadTile } from "@/components/image-upload/image-upload";
import { canRevokePreview, createPreviewImage } from "@/lib/image-preview";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CollectionUpsertDialog = ({ open, setOpen }) => {
  const [newCollectionImage, setNewCollectionImage] = useState(null);
  const [newCollectionTitle, setNewCollectionTitle] = useState("");
  const [newCollectionSubtitle, setNewCollectionSubtitle] = useState("");
  const [newCollectionType, setNewCollectionType] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");

  const [createCollection, { isLoading }] = useCreateCollectionMutation();
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
      const res = await createCollection(formData).unwrap();
      if (res?.success) {
        toast.success(res.message || "Collection created successfully!");
        setNewCollectionTitle("");
        setNewCollectionSubtitle("");
        setNewCollectionType("");
        setNewCollectionDescription("");
        setNewCollectionImage(null);
        setOpen(false);
      }
    } catch (error) {
      toast.error(`Collection creation failed: ${error}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Collection</DialogTitle>
          <DialogDescription>
            Collections use a title, optional details, and an uploaded image.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Title</Label>
            <Input
              value={newCollectionTitle}
              onChange={(e) => setNewCollectionTitle(e.target.value)}
              placeholder="e.g., Summer 2026"
            />
          </div>

          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={newCollectionSubtitle}
              onChange={(e) => setNewCollectionSubtitle(e.target.value)}
              placeholder="Optional subtitle"
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <Input
              value={newCollectionType}
              onChange={(e) => setNewCollectionType(e.target.value)}
              placeholder="Optional type"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>Description</Label>
            <Textarea
              rows={4}
              value={newCollectionDescription}
              onChange={(e) => setNewCollectionDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>Image</Label>
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
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Collection"}
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
