import React from "react";
import { CalendarDays, DollarSign, ShoppingBag } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSalesOverTimeQuery } from "@/features/store/storeApiSlice";

const FILTER_OPTIONS = {
  this_week: "This Week",
  this_month: "This Month",
  custom: "Custom Range",
};

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

const getMonthToDateRange = () => {
  const today = new Date();
  const dateTo = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const dateFrom = new Date(today.getFullYear(), today.getMonth(), 1);

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

const InsightCard = ({ icon: Icon, label, value, helper }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <div className="flex items-center gap-2 text-slate-500">
      {React.createElement(Icon, { className: "h-4 w-4" })}
      <Text variant="sm" className="text-slate-500">
        {label}
      </Text>
    </div>
    <p className="mt-3 text-xl font-semibold text-slate-950">{value}</p>
    <Text variant="sm" className="mt-2 text-slate-500">
      {helper}
    </Text>
  </div>
);

const SalesOverTime = () => {
  const [filter, setFilter] = React.useState("this_week");
  const defaultRange = React.useMemo(() => getLast7DaysRange(), []);
  const [customRange, setCustomRange] = React.useState(defaultRange);

  const range = React.useMemo(() => {
    if (filter === "this_month") return getMonthToDateRange();
    if (filter === "custom") return customRange;
    return getLast7DaysRange();
  }, [customRange, filter]);

  const shouldSkipCustomQuery =
    filter === "custom" &&
    (!range.dateFrom || !range.dateTo || range.dateFrom > range.dateTo);

  const { data, isLoading, isError } = useSalesOverTimeQuery(
    {
      dateFrom: range.dateFrom,
      dateTo: range.dateTo,
    },
    { skip: shouldSkipCustomQuery },
  );

  const salesOverTime = React.useMemo(
    () => normalizeSalesOverTime(data),
    [data],
  );
  const chartData = React.useMemo(
    () => buildChartData(salesOverTime?.points),
    [salesOverTime],
  );

  const totalSales = React.useMemo(
    () => chartData.reduce((sum, point) => sum + point.sales, 0),
    [chartData],
  );
  const totalOrders = React.useMemo(
    () => chartData.reduce((sum, point) => sum + point.orders, 0),
    [chartData],
  );
  const strongestDay = React.useMemo(
    () =>
      chartData.reduce(
        (best, point) => (point.sales > (best?.sales ?? -1) ? point : best),
        null,
      ),
    [chartData],
  );

  const selectedRangeLabel =
    salesOverTime?.date_from && salesOverTime?.date_to
      ? `${formatLongDate(salesOverTime.date_from)} - ${formatLongDate(
          salesOverTime.date_to,
        )}`
      : `${formatLongDate(range.dateFrom)} - ${formatLongDate(range.dateTo)}`;

  if (isLoading) return <LoadingState />;
  if (isError || (filter !== "custom" && !salesOverTime)) return <ErrorState />;

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-[linear-gradient(135deg,rgba(14,165,233,0.10),rgba(255,255,255,1)_52%,rgba(249,115,22,0.08))] px-6 py-5 md:px-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <Title variant="md" className="text-slate-950">
              Sales Over Time
            </Title>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-600">
              <CalendarDays className="h-3.5 w-3.5" />
              {selectedRangeLabel}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-[180px]">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="h-11 w-full rounded-xl border-slate-300 bg-white px-4 text-sm text-slate-900">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FILTER_OPTIONS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {filter === "custom" ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
                  Start date
                  <input
                    type="date"
                    value={customRange.dateFrom}
                    onChange={(event) =>
                      setCustomRange((prev) => ({
                        ...prev,
                        dateFrom: event.target.value,
                      }))
                    }
                    className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </label>

                <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
                  End date
                  <input
                    type="date"
                    value={customRange.dateTo}
                    min={customRange.dateFrom}
                    onChange={(event) =>
                      setCustomRange((prev) => ({
                        ...prev,
                        dateTo: event.target.value,
                      }))
                    }
                    className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </label>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-4 border-b border-slate-200 p-6 md:grid-cols-3 md:p-8">
        <InsightCard
          icon={DollarSign}
          label="Total sales"
          value={formatCurrency(totalSales)}
          helper="Sum of sales in the selected date range."
        />
        <InsightCard
          icon={ShoppingBag}
          label="Total orders"
          value={formatNumber(totalOrders)}
          helper="Orders placed during the selected date range."
        />
        <InsightCard
          icon={CalendarDays}
          label="Strongest day"
          value={
            strongestDay
              ? `${formatAxisDate(strongestDay.date)} · ${formatCurrency(
                  strongestDay.sales,
                )}`
              : "No sales recorded"
          }
          helper="Highest sales day within the current range."
        />
      </div>

      <div className="p-6 md:p-8">
        {shouldSkipCustomQuery ? (
          <div className="flex h-[320px] flex-col items-center justify-center rounded-3xl border border-amber-200 bg-amber-50 px-6 text-center">
            <Title variant="sm" className="text-amber-900">
              Select a valid custom date range
            </Title>
            <Text className="mt-2 max-w-md text-amber-800">
              The end date must be on or after the start date before sales data
              can be loaded.
            </Text>
          </div>
        ) : chartData.length ? (
          <div className="rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,1),rgba(255,255,255,1))] p-4 md:p-6">
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
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
};

export default SalesOverTime;
