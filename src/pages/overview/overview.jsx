import React from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  ShoppingBag,
  Users,
} from "lucide-react";

import { useOverviewQuery } from "@/features/store/storeApiSlice";
import { Text, Title } from "@/components/ui/typography";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US").format(Number(value ?? 0));

const formatPercentage = (value) => `${Number(value ?? 0).toFixed(2)}%`;

const getTrendConfig = (value) => {
  const numericValue = Number(value ?? 0);

  if (numericValue < 0) {
    return {
      icon: ArrowDownRight,
      tone: "text-red-600",
      value: formatPercentage(Math.abs(numericValue)),
      label: "vs previous period",
    };
  }

  return {
    icon: ArrowUpRight,
    tone: "text-emerald-700",
    value: formatPercentage(numericValue),
    label: "vs previous period",
  };
};

const normalizeOverview = (response) => response?.data ?? response ?? null;

const LoadingCard = () => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="animate-pulse rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="h-10 w-10 rounded-2xl bg-slate-200" />
        <div className="mt-5 h-4 w-24 rounded bg-slate-200" />
        <div className="mt-3 h-8 w-32 rounded bg-slate-200" />
        <div className="mt-6 h-4 w-36 rounded bg-slate-200" />
      </div>
    ))}
  </div>
);

const ErrorCard = () => (
  <div className="rounded-[24px] border border-red-200 bg-red-50 p-6 shadow-sm">
    <Title variant="sm" className="text-red-800">
      Overview unavailable
    </Title>
    <Text className="mt-2 text-red-700">
      Failed to load the latest overview metrics.
    </Text>
  </div>
);

const StatCard = ({ icon, title, value, trend, accentClass }) => {
  const TrendIcon = trend.icon;

  return (
    <article
      className={`rounded-[24px] border border-slate-200 p-6 shadow-sm ${accentClass}`}
    >
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/85 text-slate-700 shadow-sm">
        {React.createElement(icon, { className: "h-5 w-5" })}
      </div>

      <div className="mt-5">
        <Text variant="sm" className="text-slate-600">
          {title}
        </Text>
        <Title variant="lg" className="mt-2 text-slate-950">
          {value}
        </Title>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span
          className={`inline-flex items-center gap-1 text-sm font-semibold ${trend.tone}`}
        >
          <TrendIcon className="h-3.5 w-3.5" />
          {trend.value}
        </span>
        <Text variant="sm" className="text-slate-500 !text-xs">
          {trend.label}
        </Text>
      </div>
    </article>
  );
};

const OverviewStats = () => {
  const { data, isLoading, isError } = useOverviewQuery();
  const overview = React.useMemo(() => normalizeOverview(data), [data]);

  if (isLoading) return <LoadingCard />;
  if (isError || !overview) return <ErrorCard />;

  const cards = [
    {
      key: "revenue",
      title: "Total Revenue",
      value: formatCurrency(overview.revenue?.total),
      trend: getTrendConfig(overview.revenue?.growth_percentage),
      icon: DollarSign,
      accentClass:
        "bg-[linear-gradient(180deg,rgba(236,253,245,1),rgba(255,255,255,1))]",
    },
    {
      key: "orders",
      title: "Orders",
      value: formatNumber(overview.orders?.total),
      trend: getTrendConfig(overview.orders?.growth_percentage),
      icon: ShoppingBag,
      accentClass:
        "bg-[linear-gradient(180deg,rgba(239,246,255,1),rgba(255,255,255,1))]",
    },
    {
      key: "customers",
      title: "Customers",
      value: formatNumber(overview.customers?.total),
      trend: getTrendConfig(overview.customers?.growth_percentage),
      icon: Users,
      accentClass:
        "bg-[linear-gradient(180deg,rgba(255,247,237,1),rgba(255,255,255,1))]",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <StatCard key={card.key} {...card} />
      ))}
    </section>
  );
};

export default OverviewStats;
