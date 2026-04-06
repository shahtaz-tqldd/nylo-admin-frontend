import ThreeDotMenu from "@/components/dropdown/three-dot-menu";

export const CollectionCard = ({
  id,
  image_url,
  title,
  subtitle,
  description,
  productCount,
  product_count,
  type,
  onView,
  onUpdate,
  onDelete,
}) => {
  const FALLBACK_IMAGE =
    "https://cdn.thewirecutter.com/wp-content/media/2025/06/BG-RUNNING-SHOES-8262-2x1-1.jpg?width=2048&quality=75&crop=2:1&auto=webp";
  const totalProducts = productCount ?? product_count ?? 0;

  return (
    <div className="rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition-all">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={image_url || FALLBACK_IMAGE}
          alt={title || `Collection ${id}`}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute right-3 top-3">
          <ThreeDotMenu
            className="bg-white/90 hover:bg-white"
            actions={[
              {
                label: "View",
                onSelect: onView,
              },
              {
                label: "Update",
                onSelect: onUpdate,
              },
              {
                label: "Delete",
                destructive: true,
                onSelect: onDelete,
              },
            ]}
          />
        </div>
      </div>

      {/* Details */}
      <div className="p-4 space-y-1.5">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
          {type ? (
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
              {type}
            </span>
          ) : null}
        </div>

        {subtitle ? (
          <p className="text-sm font-medium text-gray-700">{subtitle}</p>
        ) : null}
        <p className="text-gray-500 text-sm">
          {description || "No description provided."}
        </p>

        <p className="text-gray-700 text-sm font-medium mt-2">
          {totalProducts} products
        </p>
      </div>
    </div>
  );
};

export const CollectionCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="h-48 w-full animate-pulse bg-slate-200" />
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="h-5 w-1/2 animate-pulse rounded bg-slate-200" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  );
};
