import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";

// components
import { Button } from "@/components/ui/button";
import CollectionUpsertDialog from "./collection-upsert-dialog";
import CollectionDetailsDrawer from "./collection-details-drawer";
import { CollectionCard, CollectionCardSkeleton } from "./collection-card";
import DeleteDialog from "@/components/dialog/delete-dialog";
import { Text, Title } from "@/components/ui/typography";

// icons
import { Plus } from "lucide-react";

// services
import {
  useCollectionListQuery,
  useDeleteCollectionMutation,
} from "@/features/products/productApiSlice";

const CollectionPage = () => {
  const [collectionDialogState, setCollectionDialogState] = useState({
    open: false,
    item: null,
  });
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { data, isLoading } = useCollectionListQuery();
  const [deleteCollection, { isLoading: isDeleting }] =
    useDeleteCollectionMutation();

  const collections = useMemo(() => data?.data ?? [], [data?.data]);

  const openCreateDialog = () => {
    setCollectionDialogState({ open: true, item: null });
  };

  const openUpdateDialog = (collection) => {
    setCollectionDialogState({ open: true, item: collection });
  };

  const openViewDrawer = (collection) => {
    setSelectedCollection(collection);
    setIsViewOpen(true);
  };

  const openDeleteDialog = (collection) => {
    setSelectedCollection(collection);
    setIsDeleteOpen(true);
  };

  const handleDeleteCollection = async () => {
    if (!selectedCollection?.id) {
      return;
    }

    try {
      const response = await deleteCollection(selectedCollection.id).unwrap();
      toast.success(response?.message || "Collection deleted successfully.");
      setSelectedCollection(null);
    } catch (error) {
      toast.error(
        error?.data?.message || error?.message || "Collection delete failed.",
      );
      throw error;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flbx">
        <div>
          <Title variant="lg" className="text-gray-900">
            Collections
          </Title>
          <Text className="mt-1 text-gray-500">
            Create a new shoe product listing with complete details
          </Text>
        </div>

        <Button className="pr-5 pl-3" onClick={openCreateDialog}>
          <div className="flx gap-1.5">
            <Plus className="!h-4" />
            New Collection
          </div>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <CollectionCardSkeleton key={index} />
            ))
          : collections.map((collection) => (
              <CollectionCard
                key={collection.id}
                {...collection}
                onView={() => openViewDrawer(collection)}
                onUpdate={() => openUpdateDialog(collection)}
                onDelete={() => openDeleteDialog(collection)}
              />
            ))}
      </div>

      <CollectionUpsertDialog
        open={collectionDialogState.open}
        setOpen={(open) =>
          setCollectionDialogState((prev) => ({
            ...prev,
            open,
            item: open ? prev.item : null,
          }))
        }
        initialData={collectionDialogState.item}
      />

      <CollectionDetailsDrawer
        open={isViewOpen}
        setOpen={setIsViewOpen}
        collection={selectedCollection}
      />

      <DeleteDialog
        isOpen={isDeleteOpen}
        setIsOpen={(open) => {
          setIsDeleteOpen(open);
          if (!open) {
            setSelectedCollection(null);
          }
        }}
        onConfirm={handleDeleteCollection}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default CollectionPage;
