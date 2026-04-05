import { Text, Title } from "@/components/ui/typography";
import React from "react";

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
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-100 rounded-lg p-6">
              <Title variant="sm">Total Revenue</Title>
              <Text variant="sm" className="mt-2">
                Display total revenue generated over selected period.
              </Text>
            </div>
            <div className="bg-gray-100 rounded-lg p-6">
              <Title variant="sm">Orders</Title>
              <Text variant="sm" className="mt-2">
                Total number of orders and order distribution summary.
              </Text>
            </div>
            <div className="bg-gray-100 rounded-lg p-6">
              <Title variant="sm">Customers</Title>
              <Text variant="sm" className="mt-2">
                Total active customers and new sign-ups.
              </Text>
            </div>
          </section>

          {/* Sales Section Placeholder */}
          <section>
            <div className="bg-gray-100 rounded-lg p-6 h-[380px]">
              <div>
                <Title>Sales Overview</Title>
                <Text className="mt-1">
                  Overall sales performance on this month
                </Text>
              </div>
              <Text>Sales chart or performance module placeholder</Text>
            </div>
          </section>
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
