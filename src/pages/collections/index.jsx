import React, { useState } from "react";

// components
import { Button } from "@/components/ui/button";
import { Text, Title } from "@/components/ui/typography";
import CollectionUpsertDialog from "./collection-upsert-dialog";

// icons
import { Plus } from "lucide-react";

import { useCollectionListQuery } from "@/features/products/productApiSlice";

const CollectionPage = () => {
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const { data, isLoading } = useCollectionListQuery();
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

        <Button className="pr-5 pl-3" onClick={() => setIsCollectionOpen(true)}>
          <div className="flx gap-1.5">
            <Plus className="!h-4" />
            New Collection
          </div>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {data?.data?.map((col) => (
          <CollectionCard key={col.id} {...col} />
        ))}
      </div>

      <CollectionUpsertDialog
        open={isCollectionOpen}
        setOpen={setIsCollectionOpen}
      />
    </div>
  );
};

export default CollectionPage;

export const CollectionCard = ({
  image_url,
  title,
  description,
  productCount,
  type,
}) => {
  const FALLBACK_IMAGE =
    "https://cdn.thewirecutter.com/wp-content/media/2025/06/BG-RUNNING-SHOES-8262-2x1-1.jpg?width=2048&quality=75&crop=2:1&auto=webp";
  return (
    <div className="rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition-all cursor-pointer">
      {/* Image */}
      <div className="h-48 w-full overflow-hidden">
        <img
          src={image_url || FALLBACK_IMAGE}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Details */}
      <div className="p-4 space-y-1.5">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
            {type}
          </span>
        </div>

        <p className="text-gray-500 text-sm">{description}</p>

        <p className="text-gray-700 text-sm font-medium mt-2">
          {productCount} products
        </p>
      </div>
    </div>
  );
};
