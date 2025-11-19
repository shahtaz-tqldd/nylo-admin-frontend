import DataTable from "@/components/table";
import { Button } from "@/components/ui/button";
import { Text, Title } from "@/components/ui/typography";
import { Plus } from "lucide-react";
import React from "react";
import { DEMO_CUSTOMERS } from "./demo-data";

const CustomerPage = () => {
  const customerColumns = [
    { key: "customer", header: "Customer" },
    { key: "phone", header: "Phone Number" },
    { key: "region", header: "Region" },
    { key: "last_active", header: "Last Active" },
    { key: "created_at", header: "Joined On", sortable: true },
    { key: "message_count", header: "Messages" },
    { key: "order_count", header: "Orders", sortable: true },
    { key: "status", header: "Status" },
  ];

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <Title variant="lg">Customers</Title>
          <Text className="mt-2">
            High-level summary of customers and their analytics
          </Text>
        </div>
        <Button className="flex">
          <Plus />
          Customer
        </Button>
      </div>

      <DataTable
        data={DEMO_CUSTOMERS}
        columns={customerColumns}
        defaultPageSize={10}
        className="mt-8"
        isShowActions
        isShowCheckbox
      />
    </div>
  );
};

export default CustomerPage;
