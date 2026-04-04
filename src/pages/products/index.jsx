import React, { useState } from "react";
import DataTable from "@/components/table";
import { Text, Title } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Layers, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useProductListQuery } from "@/features/products/productApiSlice";
import moment from "moment";

const ProductPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading } = useProductListQuery();
  const PLACEHOLDER_IAMGE =
    "https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?q=80&w=100";
  const products =
    data?.data?.map((item) => ({
      id: item?.id,
      product: (
        <div className="flx gap-2">
          <img
            src={item?.image_url || PLACEHOLDER_IAMGE}
            className="h-10 w-10 rounded-lg object-cover"
          />
          <div>
            <h2 className="font-semibold">{item?.title}</h2>
            <p className="text-sm opacity-60">{item?.brand}</p>
          </div>
        </div>
      ),
      price: `$${item.price}`,
      category: item.category_name,
      stock: item?.total_stock,
      created_at: moment(item.created_at).format("MMM DD, YYYY"),
      order_count: item?.total_order_palced,
      status: item?.is_active ? "Active" : "Inactive",
    })) || [];

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
        <div className="flx gap-4">
          <Link to="/products/collections">
            <Button variant="outline" className="pr-4 pl-3">
              <div className="flx gap-1.5">
                <Layers className="!h-4" />
                Collections
              </div>
            </Button>
          </Link>

          <Link to="/products/add-new-product">
            <Button className="pr-4 pl-3">
              <div className="flx gap-1.5">
                <Plus className="!h-4" />
                Product
              </div>
            </Button>
          </Link>
        </div>
      </div>

      <DataTable
        data={products}
        columns={productColumns}
        defaultPageSize={10}
        className="mt-8"
        isShowActions
        isShowCheckbox
        isLoading={isLoading}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
    </div>
  );
};

export default ProductPage;
