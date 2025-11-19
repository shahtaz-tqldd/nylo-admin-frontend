import DataTable from "@/components/table";
import React from "react";
import { DEMO_PRODUCTS } from "./demo-data";
import { Text, Title } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const ProductPage = () => {
  const productColumns = [
    { key: "product", header: "Product" },
    { key: "price", header: "Price", sortable: true },
    { key: "category", header: "Category" },
    { key: "stock", header: "Stock", sortable: true },
    { key: "created_at", header: "Created On", sortable: true },
    { key: "order_count", header: "Orders", sortable: true },
    { key: "status", header: "Status" },
  ];

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <Title variant="lg">Products</Title>
          <Text className="mt-2">
            High-level summary of customers and their analytics
          </Text>
        </div>
        <Link to="/products/add-new-product">
          <Button className="pr-5 pl-3">
            <div className="flx gap-1.5">
              <Plus className="!h-4" />
              Product
            </div>
          </Button>
        </Link>
      </div>

      <DataTable
        data={DEMO_PRODUCTS}
        columns={productColumns}
        defaultPageSize={10}
        className="mt-8"
        isShowActions
        isShowCheckbox
      />
    </div>
  );
};

export default ProductPage;
