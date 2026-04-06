import React from "react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

// icons
import { Eye, Tag } from "lucide-react";

const CollectionDetailsDrawer = ({ open, setOpen, collection }) => {
  const FALLBACK_IMAGE =
    "https://cdn.thewirecutter.com/wp-content/media/2025/06/BG-RUNNING-SHOES-8262-2x1-1.jpg?width=2048&quality=75&crop=2:1&auto=webp";
  const totalProducts =
    collection?.productCount ?? collection?.product_count ?? 0;
  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerContent className="h-screen w-full max-w-full rounded-none border-l p-0 sm:max-w-md">
        <div className="flex h-full flex-col">
          <DrawerHeader className="border-b px-6 py-5 text-left">
            <DrawerTitle>
              {collection?.title || "Collection details"}
            </DrawerTitle>
            <DrawerDescription>
              Review collection information without leaving this page.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            <div className="overflow-hidden rounded-2xl border">
              <img
                src={collection?.image_url || FALLBACK_IMAGE}
                alt={collection?.title || "Collection"}
                className="h-56 w-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {collection?.title || "-"}
                  </h3>
                  {collection?.subtitle ? (
                    <p className="mt-1 text-sm text-gray-500">
                      {collection.subtitle}
                    </p>
                  ) : null}
                </div>

                {collection?.type ? (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                    {collection.type}
                  </span>
                ) : null}
              </div>

              <CollectionMetaRow
                icon={<Tag className="h-4 w-4" />}
                label="Products"
                value={`${totalProducts} products`}
              />

              <CollectionMetaRow
                icon={<Eye className="h-4 w-4" />}
                label="Description"
                value={collection?.description || "No description provided."}
                multiline
              />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CollectionDetailsDrawer;

const CollectionMetaRow = ({ icon, label, value, multiline = false }) => {
  return (
    <div className="rounded-xl border bg-slate-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
        {icon}
        <span>{label}</span>
      </div>
      <p
        className={
          multiline
            ? "text-sm leading-6 text-gray-600"
            : "text-sm text-gray-600"
        }
      >
        {value}
      </p>
    </div>
  );
};
