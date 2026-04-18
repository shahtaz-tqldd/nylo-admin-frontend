import React from "react";

import { Text } from "@/components/ui/typography";
import { BadgeDollarSign, Receipt, Truck, WalletCards } from "lucide-react";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));

const normalizeOverview = (overview) => overview?.data ?? overview ?? null;

const cards = [
  {
    key: "total_taxes",
    label: "Total Taxes",
    icon: Receipt,
  },
  {
    key: "total_discounts",
    label: "Total Discounts",
    icon: BadgeDollarSign,
  },
  {
    key: "shipping_fees",
    label: "Shipping Fees",
    icon: Truck,
  },
  {
    key: "total_profit",
    label: "Total Profit",
    icon: WalletCards,
  },
];

const MetricCard = ({ icon, label, value }) => (
  <div>
    <div className="flex items-center gap-2 text-slate-500">
      {React.createElement(icon, { className: "h-4 w-4" })}
      <Text variant="sm">{label}</Text>
    </div>
    <p className="ml-6 mt-2 text-xl font-semibold text-slate-950">{value}</p>
  </div>
);

const LoadingState = () => (
  <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
    {Array.from({ length: 5 }).map((_, index) => (
      <div
        key={index}
        className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
      />
    ))}
  </section>
);

const ErrorState = () => (
  <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
    <p className="text-sm font-medium text-red-800">
      Failed to load sales overview data.
    </p>
  </section>
);

const SalesOverview = ({ overview, isLoading, isError }) => {
  const data = React.useMemo(() => normalizeOverview(overview), [overview]);

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ErrorState />;

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <MetricCard
          key={card.key}
          icon={card.icon}
          label={card.label}
          value={formatCurrency(data[card.key])}
        />
      ))}
    </section>
  );
};

export default SalesOverview;
