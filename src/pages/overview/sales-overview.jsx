import React from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

import { Text, Title } from "@/components/ui/typography";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { useSalesOverTimeQuery } from "@/features/store/storeApiSlice";

const chartConfig = {
  sales: {
    label: "Sales",
    color: "#0f766e",
  },
  orders: {
    label: "Orders",
    color: "#f97316",
  },
};

const formatDateForApi = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US").format(Number(value ?? 0));

const getLast7DaysRange = () => {
  const today = new Date();
  const dateTo = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const dateFrom = new Date(dateTo);
  dateFrom.setDate(dateTo.getDate() - 6);

  return {
    dateFrom: formatDateForApi(dateFrom),
    dateTo: formatDateForApi(dateTo),
  };
};

const formatAxisDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));

const formatLongDate = (value) => {
  if (!value) return "Select dates";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

const normalizeSalesOverTime = (response) => response?.data ?? response ?? null;

const buildChartData = (points = []) =>
  points.map((point) => ({
    date: point.date,
    label: formatLongDate(point.date),
    sales: Number(point.sales ?? 0),
    orders: Number(point.orders ?? 0),
  }));

const LoadingState = () => (
  <section className="animate-pulse overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-200 px-6 py-5 md:px-8">
      <div className="h-6 w-48 rounded bg-slate-200" />
      <div className="mt-3 h-4 w-64 rounded bg-slate-200" />
    </div>
    <div className="p-6 md:p-8">
      <div className="h-[320px] rounded-3xl bg-slate-100" />
    </div>
  </section>
);

const ErrorState = () => (
  <section className="rounded-[28px] border border-red-200 bg-red-50 p-6 shadow-sm">
    <Title variant="sm" className="text-red-800">
      Sales trend unavailable
    </Title>
    <Text className="mt-2 text-red-700">
      Failed to load sales-over-time data for the selected range.
    </Text>
  </section>
);

const EmptyState = () => (
  <div className="flex h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
    <Title variant="sm" className="text-slate-900">
      No sales data in this range
    </Title>
    <Text className="mt-2 max-w-md text-slate-500">
      Try a different date range to inspect another period.
    </Text>
  </div>
);

const SalesOverview = () => {
  const defaultRange = React.useMemo(() => getLast7DaysRange(), []);

  const { data, isLoading, isError } = useSalesOverTimeQuery({
    dateFrom: defaultRange.dateFrom,
    dateTo: defaultRange.dateTo,
  });

  const salesOverTime = React.useMemo(
    () => normalizeSalesOverTime(data),
    [data],
  );
  const chartData = React.useMemo(
    () => buildChartData(salesOverTime?.points),
    [salesOverTime],
  );

  if (isLoading) return <LoadingState />;
  if (isError || !salesOverTime) return <ErrorState />;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
      <Title variant="sm">Sales on this week</Title>

      <div className="mt-6">
        {chartData.length ? (
          <ChartContainer config={chartConfig} className="h-[320px] w-full">
            <ComposedChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 20, right: 8, left: 8, bottom: 8 }}
            >
              <defs>
                <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-sales)"
                    stopOpacity={0.28}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-sales)"
                    stopOpacity={0.04}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={24}
                tickFormatter={formatAxisDate}
              />
              <YAxis
                yAxisId="sales"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                width={68}
                tickFormatter={(value) => `$${value}`}
              />
              <YAxis
                yAxisId="orders"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                width={40}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={{ stroke: "#cbd5e1", strokeDasharray: "4 4" }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => label}
                    formatter={(value, name) =>
                      name === "sales"
                        ? formatCurrency(value)
                        : formatNumber(value)
                    }
                  />
                }
              />
              <Bar
                yAxisId="orders"
                dataKey="orders"
                fill="var(--color-orders)"
                radius={[8, 8, 0, 0]}
                barSize={26}
                fillOpacity={0.22}
              />
              <Area
                yAxisId="sales"
                type="monotone"
                dataKey="sales"
                stroke="var(--color-sales)"
                fill="url(#salesFill)"
                strokeWidth={3}
              />
              <Line
                yAxisId="sales"
                type="monotone"
                dataKey="sales"
                stroke="var(--color-sales)"
                strokeWidth={3}
                dot={{ r: 4, fill: "var(--color-sales)", strokeWidth: 0 }}
                activeDot={{
                  r: 6,
                  fill: "var(--color-sales)",
                  strokeWidth: 0,
                }}
              />
            </ComposedChart>
          </ChartContainer>
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
};

export default SalesOverview;
