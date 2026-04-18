import React from "react";
import { Pie, PieChart, Cell } from "recharts";

import { Text, Title } from "@/components/ui/typography";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSalesByChannelQuery } from "@/features/store/storeApiSlice";

const CHANNEL_COLORS = [
  "#0f766e",
  "#f97316",
  "#2563eb",
  "#dc2626",
  "#7c3aed",
  "#ca8a04",
];

const CHANNELS = [
  { key: "collections", title: "Collections" },
  { key: "brands", title: "Brands" },
  { key: "categories", title: "Categories" },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US").format(Number(value ?? 0));

const buildChartConfig = (items = []) =>
  items.reduce((config, item, index) => {
    config[item.slug || item.id || `item-${index}`] = {
      label: item.title,
      color: CHANNEL_COLORS[index % CHANNEL_COLORS.length],
    };

    return config;
  }, {});

const buildChartData = (items = []) =>
  items.map((item, index) => ({
    id: item.id,
    slug: item.slug || `item-${index}`,
    label: item.title,
    value: Number(item.total_sales ?? 0),
    totalSales: Number(item.total_sales ?? 0),
    orders: Number(item.orders ?? 0),
    itemsSold: Number(item.items_sold ?? 0),
    fill: CHANNEL_COLORS[index % CHANNEL_COLORS.length],
  }));

const ChannelCard = ({ title, items = [] }) => {
  const chartData = React.useMemo(() => buildChartData(items), [items]);
  const chartConfig = React.useMemo(() => buildChartConfig(items), [items]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <Title variant="sm">{title}</Title>
        <Text className="mt-1">
          Distribution of sales by {title.toLowerCase()}.
        </Text>
      </div>

      {chartData.length ? (
        <>
          <ChartContainer
            config={chartConfig}
            className="mx-auto h-[240px] w-full"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(_, __, item) =>
                      formatCurrency(item?.payload?.totalSales)
                    }
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="label"
                innerRadius={58}
                outerRadius={88}
                paddingAngle={4}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.id || entry.slug} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>

          <div className="mt-4 space-y-3 max-h-44 overflow-y-auto">
            {chartData.map((item) => (
              <div
                key={item.id || item.slug}
                className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <p className="truncate text-sm font-medium text-slate-950">
                      {item.label}
                    </p>
                  </div>
                  <Text variant="sm" className="mt-1">
                    {formatNumber(item.orders)} orders .{" "}
                    {formatNumber(item.itemsSold)} items
                  </Text>
                </div>
                <p className="text-sm font-semibold text-slate-950">
                  {formatCurrency(item.totalSales)}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex h-[240px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center">
          <Text>No sales found for this channel.</Text>
        </div>
      )}
    </section>
  );
};

const SalesByChannel = () => {
  const { data, isLoading, isError } = useSalesByChannelQuery();
  const salesByChannel = data?.data ?? {};

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-5">
        {CHANNELS.map((channel) => (
          <div
            key={channel.key}
            className="h-[420px] animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <Title variant="sm" className="text-red-800">
          Sales by channel unavailable
        </Title>
        <Text className="mt-2 text-red-700">
          Failed to load collections, brands, and categories sales data.
        </Text>
      </section>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-5">
      {CHANNELS.map((channel) => (
        <ChannelCard
          key={channel.key}
          title={channel.title}
          items={salesByChannel[channel.key] ?? []}
        />
      ))}
    </div>
  );
};

export default SalesByChannel;
