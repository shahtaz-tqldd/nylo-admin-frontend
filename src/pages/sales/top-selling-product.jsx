import { Crown, Package, ShoppingBag, Users } from "lucide-react";
import React from "react";

import { Text, Title } from "@/components/ui/typography";
import { useTopPerformersQuery } from "@/features/store/storeApiSlice";
import { cn } from "@/lib/utils";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US").format(Number(value ?? 0));

const getInitials = (value = "") =>
  value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const ImageThumb = ({ src, alt, fallback }) => {
  if (src) {
    return (
      <img src={src} alt={alt} className="h-12 w-12 rounded-xl object-cover" />
    );
  }

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-600">
      {fallback}
    </div>
  );
};

const SectionHeader = ({ icon, title, helper }) => (
  <div className="mb-3 flex items-start justify-between gap-3">
    <div>
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-slate-100 p-2 text-slate-700">
          {React.createElement(icon, { className: "h-4 w-4" })}
        </div>
        <Title variant="sm">{title}</Title>
      </div>
      <Text variant="sm" className="mt-1">
        {helper}
      </Text>
    </div>
  </div>
);

const ProductRow = ({ item, index }) => {
  const variant = item?.top_selling_variant;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-start gap-3">
        <ImageThumb
          src={item?.image_url}
          alt={item?.name || "Product"}
          fallback={getInitials(item?.name)}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="line-clamp-2 text-sm font-semibold text-slate-950">
                {item?.name}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>{formatNumber(item?.orders_placed)} orders</span>
              </div>
            </div>
            <p className="shrink-0 text-sm font-semibold text-slate-950">
              {formatCurrency(item?.total_sales)}
            </p>
          </div>
          {/* 
          {variant ? (
            <div className="mt-3 rounded-xl border border-white bg-white p-2.5">
              <div className="flex items-start gap-2.5">
                <ImageThumb
                  src={variant?.image_url}
                  alt={variant?.title || "Variant"}
                  fallback="V"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    <Package className="h-3.5 w-3.5" />
                    <span>Top Variant</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-900">
                    {variant?.title}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <Text variant="sm">
                      {formatNumber(variant?.orders_placed)} orders
                    </Text>
                    <p className="text-sm font-semibold text-slate-950">
                      {formatCurrency(variant?.total_sales)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null} */}
        </div>
      </div>
    </div>
  );
};

const CustomerRow = ({ item, index }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">
      {index === 0 ? <Crown className="h-4 w-4" /> : getInitials(item?.name)}
    </div>

    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-semibold text-slate-950">
        {item?.name}
      </p>
      <Text variant="sm" className="truncate">
        {item?.email}
      </Text>
    </div>

    <p className="shrink-0 text-sm font-semibold text-slate-950">
      {formatCurrency(item?.total_purchased)}
    </p>
  </div>
);

const LoadingState = ({ className }) => (
  <section
    className={cn(
      "rounded-2xl border border-slate-200 bg-white p-4",
      className,
    )}
  >
    <div className="animate-pulse space-y-4">
      <div className="h-6 w-40 rounded bg-slate-200" />
      <div className="h-28 rounded-2xl bg-slate-100" />
      <div className="h-28 rounded-2xl bg-slate-100" />
      <div className="h-24 rounded-2xl bg-slate-100" />
    </div>
  </section>
);

const ErrorState = ({ className }) => (
  <section
    className={cn(
      "rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800",
      className,
    )}
  >
    <Title variant="sm" className="text-red-800">
      Top performers unavailable
    </Title>
    <Text className="mt-2 text-red-700">
      Failed to load top customers and products.
    </Text>
  </section>
);

const TopPerformer = ({ className }) => {
  const { data, isLoading, isError } = useTopPerformersQuery();
  const topProducts = data?.data?.top_products?.slice(0, 3) ?? [];
  const topCustomers = data?.data?.top_customers?.slice(0, 3) ?? [];

  if (isLoading) return <LoadingState className={className} />;
  if (isError) return <ErrorState className={className} />;

  return (
    <section className={cn("", className)}>
      <div className="space-y-5">
        <div>
          <SectionHeader
            icon={Package}
            title="Top Sold Products"
            helper="Top 3 products with their best-performing variant."
          />

          <div className="space-y-3">
            {topProducts.length ? (
              topProducts.map((item, index) => (
                <ProductRow key={item.id} item={item} index={index} />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                <Text>No top products available.</Text>
              </div>
            )}
          </div>
        </div>

        <div>
          <SectionHeader
            icon={Users}
            title="Top Customers"
            helper="Top 3 customers by total purchased amount."
          />

          <div className="space-y-3">
            {topCustomers.length ? (
              topCustomers.map((item, index) => (
                <CustomerRow key={item.id} item={item} index={index} />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                <Text>No top customers available.</Text>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopPerformer;
