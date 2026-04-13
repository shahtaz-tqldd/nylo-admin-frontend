import React from "react";
import moment from "moment";
import { Tag, Boxes, Package, CircleDollarSign } from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?q=80&w=1000";

const formatMoney = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return `$${value}`;
};

const ProductDetailsDrawer = ({ open, setOpen, product, isLoading }) => {
  const variants = product?.variants ?? [];
  const collections = product?.collections ?? [];

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerContent className="h-screen w-full max-w-full rounded-none border-l p-0 sm:max-w-2xl">
        <div className="flex h-full flex-col">
          <DrawerHeader className="border-b px-6 py-5 text-left">
            <DrawerTitle>{product?.title || "Product details"}</DrawerTitle>
            <DrawerDescription>
              Review product information without leaving this page.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 6 }, (_, idx) => (
                  <div
                    key={idx}
                    className="h-24 animate-pulse rounded-2xl bg-slate-100"
                  />
                ))}
              </div>
            ) : (
              <>
                <div className="overflow-hidden rounded-2xl border">
                  <img
                    src={product?.image_url || FALLBACK_IMAGE}
                    alt={product?.title || "Product"}
                    className="h-64 w-full object-cover"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoCard
                    icon={<Tag className="h-4 w-4" />}
                    label="SKU"
                    value={product?.sku || "-"}
                  />
                  <InfoCard
                    icon={<CircleDollarSign className="h-4 w-4" />}
                    label="Price"
                    value={formatMoney(product?.price)}
                    secondary={`Compare: ${formatMoney(product?.compare_price)}`}
                  />
                  <InfoCard
                    icon={<Boxes className="h-4 w-4" />}
                    label="Category"
                    value={product?.category?.name || "-"}
                    secondary={product?.brand || "-"}
                  />
                  <InfoCard
                    icon={<Package className="h-4 w-4" />}
                    label="Inventory"
                    value={`${product?.total_stock ?? 0} in stock`}
                    secondary={`${variants.length} variants`}
                  />
                </div>

                <Section title="Overview">
                  <InfoRow label="Title" value={product?.title || "-"} />
                  <InfoRow label="Brand" value={product?.brand || "-"} />
                  <InfoRow label="Gender" value={product?.gender || "-"} />
                  <InfoRow
                    label="Created On"
                    value={
                      product?.created_at
                        ? moment(product.created_at).format("MMM DD, YYYY")
                        : "-"
                    }
                  />
                  <InfoRow
                    label="Collections"
                    value={
                      collections.length
                        ? collections.map((item) => item.title).join(", ")
                        : "-"
                    }
                  />
                </Section>

                <Section title="Description">
                  <p className="text-sm leading-6 text-slate-600">
                    {product?.description || "No description provided."}
                  </p>
                </Section>

                <Section title="Features">
                  {(product?.features ?? []).length ? (
                    <div className="flex flex-wrap gap-2">
                      {product.features.map((feature, idx) => (
                        <span
                          key={`${feature}-${idx}`}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No features added.</p>
                  )}
                </Section>

                <Section title="Variants">
                  {variants.length ? (
                    <div className="space-y-3">
                      {variants.map((variant) => (
                        <div
                          key={variant.id}
                          className="flex items-center justify-between gap-4 rounded-xl border bg-slate-50 p-4"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900">
                              {variant?.name || product?.title || "-"}
                            </p>
                            <p className="text-sm text-slate-500">
                              Color: {variant?.color?.name || "-"} | Size:{" "}
                              {variant?.size?.name || "-"}
                            </p>
                          </div>
                          <div className="text-right text-sm text-slate-600">
                            <p>SKU: {variant?.sku || "-"}</p>
                            <p>Stock: {variant?.stock ?? 0}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No variants found.</p>
                  )}
                </Section>
              </>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ProductDetailsDrawer;

const Section = ({ title, children }) => (
  <div className="rounded-2xl border p-5">
    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
    <div className="mt-4">{children}</div>
  </div>
);

const InfoCard = ({ icon, label, value, secondary }) => (
  <div className="rounded-2xl border bg-slate-50 p-4">
    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
      {icon}
      <span>{label}</span>
    </div>
    <p className="text-sm font-semibold text-slate-900">{value}</p>
    {secondary ? <p className="mt-1 text-xs text-slate-500">{secondary}</p> : null}
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 border-b py-3 last:border-b-0 last:pb-0 first:pt-0">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="text-right text-sm font-medium text-slate-900">
      {value}
    </span>
  </div>
);
