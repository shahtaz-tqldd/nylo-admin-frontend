import { Button } from "@/components/ui/button";
import { Text, Title } from "@/components/ui/typography";
import { Calendar } from "lucide-react";
import React from "react";
import SalesStat from "./sales-stats";
import SalesOverTime from "./sales-over-time";
import TopPerformer from "./top-selling-product";
import SalesByChannel from "./sales-by-channel";

const SalesPage = () => {
  return (
    <div className="space-y-8">
      <Header />
      <div className="flex gap-5">
        <SalesStat className="flex-1" />
        <TopPerformer className="max-w-sm w-full" />
      </div>
      <SalesOverTime />
      <SalesByChannel />
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
    </div>
  );
};
