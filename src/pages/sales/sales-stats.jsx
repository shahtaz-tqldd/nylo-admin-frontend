import React from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  ReceiptText,
  ShoppingBag,
} from "lucide-react";

import { Text, Title } from "@/components/ui/typography";
import { useSalesSummaryQuery } from "@/features/store/storeApiSlice";

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
      label: `${formatPercentage(Math.abs(numericValue))} vs previous month`,
    };
  }

  return {
    icon: ArrowUpRight,
    tone: "text-emerald-700",
    label: `${formatPercentage(numericValue)} vs previous month`,
  };
};

const getStatusConfig = (label) => ({
  icon: ShoppingBag,
  tone: "text-sky-700",
  label,
});

const normalizeSalesSummary = (response) => response?.data ?? response ?? null;

const LoadingCard = () => (
  <div className="animate-pulse rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
    <div className="h-5 w-40 rounded bg-slate-200" />
    <div className="mt-4 h-10 w-48 rounded bg-slate-200" />
    <div className="mt-6 grid gap-3 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-36 rounded-2xl border border-slate-200 bg-slate-50"
        />
      ))}
    </div>
  </div>
);

const ErrorCard = () => (
  <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 shadow-sm">
    <Title variant="sm" className="text-red-800">
      Sales summary unavailable
    </Title>
    <Text className="mt-2 text-red-700">
      Failed to load the latest sales metrics.
    </Text>
  </div>
);

const MetricCard = ({ icon, label, value, trend, accentClassName }) => {
  const TrendIcon = trend.icon;

  return (
    <article
      className={`rounded-[24px] border border-slate-200 p-5 shadow-sm ${accentClassName}`}
    >
      <div className="flbx items-start gap-4">
        <div className="space-y-3">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-slate-700 shadow-sm">
            {React.createElement(icon, { className: "h-5 w-5" })}
          </div>
          <div>
            <Text variant="sm" className="text-slate-600">
              {label}
            </Text>
            <Title variant="lg" className="mt-2 text-slate-950">
              {value}
            </Title>
          </div>
        </div>
      </div>
      <span
        className={`inline-flex items-center gap-1 text-sm mt-4 font-semibold ${trend.tone}`}
      >
        <TrendIcon className="h-3.5 w-3.5" />
        {trend.label}
      </span>

      {/* <Text className="mt-6 text-slate-600">{description}</Text> */}
    </article>
  );
};

const DetailStat = ({ label, value, helper }) => (
  <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
    <Text variant="sm" className="text-slate-500">
      {label}
    </Text>
    <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
    <Text variant="sm" className="!text-xs mt-2 text-slate-500">
      {helper}
    </Text>
  </div>
);

const SalesStat = () => {
  const { data, isLoading, isError } = useSalesSummaryQuery();
  const summary = React.useMemo(() => normalizeSalesSummary(data), [data]);

  if (isLoading) return <LoadingCard />;
  if (isError || !summary) return <ErrorCard />;

  const totalRevenue = formatCurrency(summary.total_revenue);
  const revenueThisMonth = formatCurrency(summary.revenue_this_month);
  const previousMonthRevenue = formatCurrency(summary.previous_month_revenue);
  const totalOrders = formatNumber(summary.total_orders);
  const ordersThisMonth = formatNumber(summary.orders_placed_this_month);
  const averageOrderValue = formatCurrency(summary.average_order_value);
  const previousAverageOrderValue = formatCurrency(
    summary.previous_month_average_order_value,
  );

  const revenueTrend = getTrendConfig(summary.revenue_growth_percentage);
  const averageOrderValueTrend = getTrendConfig(
    summary.average_order_value_growth_percentage,
  );
  const ordersTrend = getStatusConfig(`${totalOrders} total orders recorded`);

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-[linear-gradient(135deg,rgba(16,185,129,0.14),rgba(255,255,255,1)_55%,rgba(15,23,42,0.04))] px-6 py-6 md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Sales snapshot
            </div>
            <Title variant="lg" className="mt-4 text-slate-950">
              {totalRevenue} in total revenue
            </Title>
            <Text className="mt-3 max-w-xl text-slate-600 !text-sm">
              This month brought in {revenueThisMonth} from {ordersThisMonth}{" "}
              order{Number(summary.orders_placed_this_month) === 1 ? "" : "s"},
              with an average order value of {averageOrderValue}.
            </Text>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <DetailStat
              label="Revenue this month"
              value={revenueThisMonth}
              helper={`Previous month: ${previousMonthRevenue}`}
            />
            <DetailStat
              label="Average order value"
              value={averageOrderValue}
              helper={`Previous month: ${previousAverageOrderValue}`}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3 md:p-8">
        <MetricCard
          icon={DollarSign}
          label="Revenue Growth"
          value={revenueThisMonth}
          trend={revenueTrend}
          accentClassName="bg-[linear-gradient(180deg,rgba(236,253,245,1),rgba(255,255,255,1))]"
        />

        <MetricCard
          icon={ShoppingBag}
          label="Orders This Month"
          value={ordersThisMonth}
          trend={ordersTrend}
          accentClassName="bg-[linear-gradient(180deg,rgba(239,246,255,1),rgba(255,255,255,1))]"
        />

        <MetricCard
          icon={ReceiptText}
          label="Average Order Value"
          value={averageOrderValue}
          trend={averageOrderValueTrend}
          accentClassName="bg-[linear-gradient(180deg,rgba(255,247,237,1),rgba(255,255,255,1))]"
        />
      </div>
    </section>
  );
};

export default SalesStat;
