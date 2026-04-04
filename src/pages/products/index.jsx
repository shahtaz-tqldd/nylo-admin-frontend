import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";

// components
import { Button } from "@/components/ui/button";
import DataTable from "@/components/table";
import DeleteDialog from "@/components/dialog/delete-dialog";
import { Layers, Plus } from "lucide-react";
import MultiSelectFilter from "@/components/dropdown/multi-select-filter";
import { Text, Title } from "@/components/ui/typography";

// services
import {
  useDeleteProductMutation,
  useProductListQuery,
  useProductSettingsQuery,
} from "@/features/products/productApiSlice";

const ProductPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
    category: [],
    gender: [],
    brand: [],
    collection: [],
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { data: settingsData } = useProductSettingsQuery();
  const { data, isLoading } = useProductListQuery(filters);
  const PLACEHOLDER_IAMGE =
    "https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?q=80&w=100";
  const settings = settingsData?.data ?? {};
  const products = useMemo(
    () =>
      data?.data?.map((item) => ({
        id: item?.id,
        title: item?.title,
        brand: item?.brand,
        image_url: item?.image_url,
        price: item?.price,
        category: item?.category_name,
        stock: item?.total_stock,
        created_at: item?.created_at,
        order_count: item?.total_order_palced,
        status: item?.is_active ? "Active" : "Inactive",
      })) || [],
    [data?.data],
  );

  const filterOptions = useMemo(() => {
    const categoryOptions = (settings.categories ?? []).map((category) => ({
      label: category.name,
      value: String(category.id),
    }));

    const genderOptions = (settings.genders ?? []).map((gender) => ({
      label: gender.label,
      value: gender.value,
    }));

    const collectionOptions = (settings.collections ?? []).map(
      (collection) => ({
        label: collection.title,
        value: String(collection.id),
      }),
    );

    const brandOptions = [
      ...new Set([
        ...products.map((product) => product.brand),
        ...filters.brand,
      ]),
    ]
      .filter(Boolean)
      .sort((left, right) => left.localeCompare(right))
      .map((brand) => ({
        label: brand,
        value: brand,
      }));

    return {
      category: categoryOptions,
      gender: genderOptions,
      brand: brandOptions,
      collection: collectionOptions,
    };
  }, [
    filters.brand,
    products,
    settings.categories,
    settings.collections,
    settings.genders,
  ]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1);
  };

  const productColumns = [
    {
      key: "title",
      header: "Product",
      render: (item) => (
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
      searchAccessor: (item) => `${item?.title ?? ""} ${item?.brand ?? ""}`,
    },
    {
      key: "price",
      header: "Price",
      sortable: true,
      accessor: (item) => item.price ?? 0,
      render: (item) => `$${item.price}`,
    },
    { key: "category", header: "Category" },
    { key: "stock", header: "Stock", sortable: true },
    {
      key: "created_at",
      header: "Created On",
      sortable: true,
      accessor: (item) => item.created_at ?? "",
      render: (item) => moment(item.created_at).format("MMM DD, YYYY"),
    },
    { key: "order_count", header: "Orders", sortable: true },
    { key: "status", header: "Status" },
  ];

  const productRowActions = (product) => [
    {
      label: "View",
      onSelect: () => navigate(`/products/update/${product.id}`),
    },
    {
      label: "Update",
      onSelect: () => navigate(`/products/update/${product.id}`),
    },
    {
      label: "Delete",
      destructive: true,
      onSelect: () => {
        setSelectedProduct(product);
        setIsDeleteDialogOpen(true);
      },
    },
  ];

  const [deleteProduct, { isLoading: deleteLoading }] =
    useDeleteProductMutation();

  const handleDelete = async (id) => {
    const res = await deleteProduct(id);
    if (res?.data?.success) {
      toast.success(res?.message || "Product deleted");
    } else {
      toast.error(res?.error?.message || "Product delete failed!");
    }
  };

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
        rowActions={productRowActions}
        toolbar={
          <>
            <MultiSelectFilter
              label="Category"
              options={filterOptions.category}
              selectedValues={filters.category}
              onChange={(value) => handleFilterChange("category", value)}
            />
            <MultiSelectFilter
              label="Gender"
              options={filterOptions.gender}
              selectedValues={filters.gender}
              onChange={(value) => handleFilterChange("gender", value)}
            />
            <MultiSelectFilter
              label="Brand"
              options={filterOptions.brand}
              selectedValues={filters.brand}
              onChange={(value) => handleFilterChange("brand", value)}
            />
            <MultiSelectFilter
              label="Collection"
              options={filterOptions.collection}
              selectedValues={filters.collection}
              onChange={(value) => handleFilterChange("collection", value)}
            />
          </>
        }
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onConfirm={() => {
          handleDelete(selectedProduct?.id);
        }}
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default ProductPage;
