import { Text, Title } from "@/components/ui/typography";
import React from "react";
import SalesOverview from "./sales-overview";
import OverviewStats from "./overview";

const Overview = () => {
  return (
    <div className="space-y-12">
      {/* Page Title */}
      <div className="space-y-2">
        <h2 className="text-xl">Hello, Shahtaz Rahman</h2>
        <h2 className="text-3xl">Welcome to Nylo Overview</h2>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Side */}
        <div className="col-span-2 space-y-6">
          <OverviewStats />

          {/* Sales Section Placeholder */}
          <SalesOverview />
          {/* Top Products */}
          <section>
            <Title>Top Selling Products</Title>
            <Text className="mt-2">
              Your best performing products with sales numbers rankings.
            </Text>

            <div className="bg-gray-100 rounded-lg p-6 h-[380px] center mt-6">
              <Text>Top products list placeholder</Text>
            </div>
          </section>
        </div>

        {/* Right Side */}
        <div className="col-span-1 space-y-6">
          {/* Recent Orders */}
          <section>
            <Title>Recent Orders</Title>
            <Text className="mt-1">10+ pending orders for review</Text>

            <div className="bg-gray-100 rounded-lg p-6 h-[380px] center mt-6">
              <Text>Recent orders table placeholder</Text>
            </div>
          </section>

          {/* Store Notices */}
          <section>
            <Title>Important Alerts</Title>
            <Text className="mt-2">
              System alerts, low stock notifications, or pending tasks
            </Text>

            <div className="bg-gray-100 h-[380px] center rounded-lg p-6 mt-6">
              <Text>Alerts / notifications placeholder</Text>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Overview;
