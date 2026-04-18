import { Button } from "@/components/ui/button";
import { Text, Title } from "@/components/ui/typography";
import { Calendar } from "lucide-react";
import React from "react";
import SalesStat from "./sales-stats";
import SalesOverTime from "./sales-over-time";

const SalesPage = () => {
  return (
    <div className="space-y-8">
      <Header />
      <SalesStat />
      <SalesOverTime />

      {/* TOP SELLING PRODUCTS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

      {/* SALES BY CHANNEL */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border rounded-xl p-4 bg-white h-72 flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Sales by Channel</h2>
          <div className="flex-1 h-full bg-gray-50 rounded-lg center">
            Donut / Bar Chart Placeholder
          </div>
        </div>

        {/* SALES BY REGION */}
        <div className="border rounded-xl p-4 bg-white h-72 flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Sales by Region</h2>
          <div className="flex-1 h-full bg-gray-50 rounded-lg center">
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

const Header = () => {
  return (
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
  );
};
