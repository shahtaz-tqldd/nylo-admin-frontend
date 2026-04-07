import React, { useState } from "react";
import moment from "moment";

// components
import DataTable from "@/components/table";
import { Button } from "@/components/ui/button";
import { Text, Title } from "@/components/ui/typography";
import { TableUserProfile } from "@/components/ui/profile";

// features
import { useCustomerListQuery } from "@/features/auth/authApiSlice";

// icons
import { Plus } from "lucide-react";

const CustomerPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useCustomerListQuery({
    page,
    page_size: pageSize,
    search_str: search,
  });

  const customers =
    data?.data?.map((item) => ({
      id: item.id,
      customer: <TableUserProfile name={item.full_name} email={item.email} />,
      phone: item.phone,
      region: item.region,
      last_active: item.last_active_at
        ? moment(item.last_active_at).format("MMM Do YYYY hh:mm a")
        : "-",
      date_joined: moment(item.date_joined).format("MMM Do YYYY"),
      message_count: item.message_count,
      order_count: item.order_count,
      status: item.status,
    })) || [];

  const customerColumns = [
    { key: "customer", header: "Customer" },
    { key: "phone", header: "Phone Number" },
    { key: "region", header: "Region" },
    { key: "last_active", header: "Last Active" },
    { key: "date_joined", header: "Joined On", sortable: true },
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
      </div>

      <DataTable
        className="mt-8"
        data={customers}
        columns={customerColumns}
        defaultPageSize={10}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        isLoading={isLoading}
        isShowActions
        isShowCheckbox
      />
    </div>
  );
};

export default CustomerPage;
