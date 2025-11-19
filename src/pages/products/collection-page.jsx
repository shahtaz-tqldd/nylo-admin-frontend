import { Button } from "@/components/ui/button";
import { Text, Title } from "@/components/ui/typography";
import { Plus } from "lucide-react";
import React from "react";
import { DEMO_COLLECTIONS } from "./demo-data";

const CollectionPage = () => {
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

        <Button className="pr-5 pl-3">
          <div className="flx gap-1.5">
            <Plus className="!h-4" />
            New Collection
          </div>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {DEMO_COLLECTIONS.map((col) => (
          <CollectionCard key={col.id} {...col} />
        ))}
      </div>
    </div>
  );
};

export default CollectionPage;

export const CollectionCard = ({
  image,
  name,
  description,
  productCount,
  tag,
}) => {
  return (
    <div className="rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition-all cursor-pointer">
      {/* Image */}
      <div className="h-64 w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Details */}
      <div className="p-4 space-y-1.5">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900 text-lg">{name}</h3>
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
            {tag}
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
