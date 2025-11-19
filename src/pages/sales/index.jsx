import { Button } from "@/components/ui/button";
import { Text, Title } from "@/components/ui/typography";
import { Calendar } from "lucide-react";
import React from "react";

const SalesPage = () => {
  return (
    <div className="space-y-8">
      {/*header*/}
      <div className="flbx">
        <div>
          <Title variant="lg">Sales Overview</Title>
          <Text className="mt-2">
            Track revenue, customer trends, and marketplace performance.
          </Text>
        </div>

        <Button variant="outline" className="pr-4 pl-3">
          <div className="flx gap-1.5">
            <Calendar className="!h-4" />
            November
          </div>
        </Button>
      </div>

      {/* ---------------- TOP KPI CARDS ---------------- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI: Total Revenue */}
        <div className="h-28 border rounded-xl bg-gray-50 flex items-center justify-center">
          Total Revenue (Card)
        </div>

        {/* KPI: Total Orders */}
        <div className="h-28 border rounded-xl bg-gray-50 flex items-center justify-center">
          Total Orders (Card)
        </div>

        {/* KPI: Average Order Value */}
        <div className="h-28 border rounded-xl bg-gray-50 flex items-center justify-center">
          Avg Order Value (Card)
        </div>

        {/* KPI: Returning Customers */}
        <div className="h-28 border rounded-xl bg-gray-50 flex items-center justify-center">
          Returning Customers (Card)
        </div>
      </section>

      {/* ---------------- SALES OVER TIME CHART ---------------- */}
      <section className="border rounded-xl p-4 h-80 bg-white">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Sales Over Time</h2>
          {/* Date Filter Placeholder */}
          <div className="w-32 h-8 border rounded-md flex items-center justify-center text-sm text-gray-600">
            Date Filter
          </div>
        </div>

        {/* chart placeholder */}
        <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
          Chart (Line / Area)
        </div>
      </section>

      {/* ---------------- ROW: TOP PRODUCTS + CATEGORY BREAKDOWN ---------------- */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TOP SELLING PRODUCTS */}
        <div className="border rounded-xl p-4 bg-white h-80">
          <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>

          <div className="space-y-3">
            <div className="h-12 bg-gray-50 rounded-md flex items-center px-4">
              Product Row Placeholder
            </div>
            <div className="h-12 bg-gray-50 rounded-md flex items-center px-4">
              Product Row Placeholder
            </div>
            <div className="h-12 bg-gray-50 rounded-md flex items-center px-4">
              Product Row Placeholder
            </div>
          </div>
        </div>

        {/* SALES BY COLLECTION / CATEGORY */}
        <div className="border rounded-xl p-4 bg-white h-80">
          <h2 className="text-lg font-semibold mb-4">Sales by Collection</h2>

          <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
            Bar / Pie Chart Placeholder
          </div>
        </div>
      </section>

      {/* ---------------- SALES CHANNELS + REGIONS ---------------- */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SALES BY CHANNEL */}
        <div className="border rounded-xl p-4 bg-white h-64">
          <h2 className="text-lg font-semibold mb-4">Sales by Channel</h2>
          <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
            Donut / Bar Chart Placeholder
          </div>
        </div>

        {/* SALES BY REGION */}
        <div className="border rounded-xl p-4 bg-white h-64">
          <h2 className="text-lg font-semibold mb-4">Sales by Region</h2>
          <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
            Map / Region Chart Placeholder
          </div>
        </div>
      </section>

      {/* ---------------- SUMMARY BOX ---------------- */}
      <section className="border rounded-xl bg-white p-4 h-40">
        <h2 className="text-lg font-semibold mb-3">Revenue Summary</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className="p-3 rounded-md bg-gray-50 text-center">Taxes</div>
          <div className="p-3 rounded-md bg-gray-50 text-center">Discounts</div>
          <div className="p-3 rounded-md bg-gray-50 text-center">
            Shipping Fees
          </div>
          <div className="p-3 rounded-md bg-gray-50 text-center">
            Net Profit
          </div>
        </div>
      </section>
    </div>
  );
};

export default SalesPage;
