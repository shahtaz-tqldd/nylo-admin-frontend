import DataTable from "@/components/table";
import { Button } from "@/components/ui/button";
import { Text, Title } from "@/components/ui/typography";
import { Download, Plus } from "lucide-react";
import React from "react";

const OrderPage = () => {
  const columns = [
    { key: "order_id", header: "Order" },
    { key: "created_at", header: "Order Placed", sortable: true },
    { key: "delivery_date", header: "Delivery Date", sortable: true },
    { key: "status", header: "Status" },
  ];

  const DEMO_CUSTOMERS = [
    {
      id: 1,
      order_id: "ORD-2025-001",
      created_at: "August 12, 2025",
      delivery_date: "August 17, 2025",
      status: "Processing",
    },
    {
      id: 2,
      order_id: "ORD-2025-002",
      created_at: "August 12, 2025",
      delivery_date: "August 17, 2025",
      status: "Shipped",
    },
    {
      id: 3,
      order_id: "ORD-2025-003",
      created_at: "August 12, 2025",
      delivery_date: "August 17, 2025",
      status: "Delivered",
    },
    {
      id: 4,
      order_id: "ORD-2025-004",
      created_at: "August 12, 2025",
      delivery_date: "August 17, 2025",
      status: "Pending Payment",
    },
    {
      id: 5,
      order_id: "ORD-2025-005",
      created_at: "August 12, 2025",
      delivery_date: "August 17, 2025",
      status: "Cancelled",
    },
  ];
  return (
    <div>
      <div className="flex justify-between">
        <div>
          <Title variant="lg">Orders</Title>
          <Text className="mt-2">
            High-level summary of orders and their analytics
          </Text>
        </div>
        <div className="flx gap-2">
          <Button variant="outline" className="flex">
            <Download />
            Export
          </Button>
          <Button className="flex">
            <Plus />
            Order
          </Button>
        </div>
      </div>

      <DataTable
        data={DEMO_CUSTOMERS}
        columns={columns}
        defaultPageSize={10}
        className="mt-8"
        isShowActions
        isShowCheckbox
      />
    </div>
  );
};

export default OrderPage;
