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
import ProductDetailsDrawer from "./product-details-drawer";
import ProductOfferDialog from "./product-offer-dialog";

// services
import {
  useCreateOfferItemMutation,
  useCreateSignatureMutation,
  useDeleteOfferItemMutation,
  useDeleteProductMutation,
  useDeleteSignatureMutation,
  useProductDetailsQuery,
  useProductListQuery,
  useProductSettingsQuery,
  useFeaturedItemQuery,
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
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    type: "delete-product",
    title: "Are you absolutely sure?",
    description:
      "This action cannot be undone. This will permanently delete the item.",
    confirmLabel: "Delete",
    loadingLabel: "Deleting...",
  });
  const navigate = useNavigate();
  const { data: settingsData } = useProductSettingsQuery();
  const { data, isLoading } = useProductListQuery(filters);
  const { data: selectedProductDetails, isLoading: isProductDetailsLoading } =
    useProductDetailsQuery(selectedProduct?.id, {
      skip: !selectedProduct?.id || !isDetailsDrawerOpen,
    });
  const {
    data: productOfferAssignments,
    isLoading: isOfferAssignmentsLoading,
  } = useFeaturedItemQuery(undefined, {
    skip: !isOfferDialogOpen,
  });
  const [createSignature, { isLoading: isSignatureSaving }] =
    useCreateSignatureMutation();
  const [createOfferItem, { isLoading: isOfferItemSaving }] =
    useCreateOfferItemMutation();
  const [deleteSignature, { isLoading: isDeleteSignatureLoading }] =
    useDeleteSignatureMutation();
  const [deleteOfferItem, { isLoading: isDeleteOfferItemLoading }] =
    useDeleteOfferItemMutation();

  const PLACEHOLDER_IAMGE =
    "https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?q=80&w=100";

  const settings = settingsData?.data ?? {};
  const products = useMemo(
    () =>
      data?.data?.map((item) => ({
        id: item?.id,
        title: item?.title,
        brand: item?.brand?.name,
        image_url: item?.image_url,
        is_signature: item?.is_signature_item,
        is_offer: item?.is_offer_item,
        price: item?.price,
        category: item?.category?.name,
        stock: item?.total_stock || (
          <span className="text-red-600 text-xs font-semibold">
            Out of stock
          </span>
        ),
        created_at: item?.created_at,
        order_count: item?.orders_count || "-",
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
    const brandOptions = (settings.brands ?? []).map((brand) => ({
      label: brand.name,
      value: String(brand.id),
    }));

    return {
      category: categoryOptions,
      gender: genderOptions,
      collection: collectionOptions,
      brand: brandOptions,
    };
  }, [
    settings.categories,
    settings.brands,
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
            <div className="flex gap-2 mt-1">
              <p className="text-sm opacity-60">{item?.brand}</p>
              {item?.is_signature && (
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-1 py-0.5 rounded">
                  Signature
                </span>
              )}
              {item?.is_offer && (
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-1 py-0.5 rounded">
                  Offer
                </span>
              )}
            </div>
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
      onSelect: () => {
        setSelectedProduct(product);
        setIsDetailsDrawerOpen(true);
      },
    },
    {
      label: "Update",
      onSelect: () => navigate(`/products/update/${product.id}`),
    },
    ...(!product?.is_signature && !product?.is_offer
      ? [
          {
            label: "Add Offer",
            onSelect: () => {
              setSelectedProduct(product);
              setIsOfferDialogOpen(true);
            },
          },
        ]
      : []),
    ...(product?.is_signature
      ? [
          {
            label: "Remove Signature",
            onSelect: () => {
              setSelectedProduct(product);
              setDialogConfig({
                type: "remove-signature",
                title: "Remove signature product?",
                description:
                  "This will remove the selected product from the signature section.",
                confirmLabel: "Remove Signature",
                loadingLabel: "Removing...",
              });
              setIsDeleteDialogOpen(true);
            },
          },
        ]
      : []),
    ...(product?.is_offer
      ? [
          {
            label: "Remove Offers",
            onSelect: () => {
              setSelectedProduct(product);
              setDialogConfig({
                type: "remove-offer",
                title: "Remove offer product?",
                description:
                  "This will remove the selected product from the offer section.",
                confirmLabel: "Remove Offer",
                loadingLabel: "Removing...",
              });
              setIsDeleteDialogOpen(true);
            },
          },
        ]
      : []),
    {
      label: "Delete",
      destructive: true,
      onSelect: () => {
        setSelectedProduct(product);
        setDialogConfig({
          type: "delete-product",
          title: "Are you absolutely sure?",
          description:
            "This action cannot be undone. This will permanently delete the item.",
          confirmLabel: "Delete",
          loadingLabel: "Deleting...",
        });
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
      return true;
    }

    toast.error(res?.error?.message || "Product delete failed!");
    return false;
  };

  const handleRemoveSignature = async (id) => {
    const res = await deleteSignature(id);

    if (res?.data?.success) {
      toast.success(res?.data?.message || "Signature removed");
      return true;
    }

    toast.error(
      res?.error?.data?.message ||
        res?.error?.message ||
        "Failed to remove signature item!",
    );
    return false;
  };

  const handleRemoveOffer = async (id) => {
    const res = await deleteOfferItem(id);

    if (res?.data?.success) {
      toast.success(res?.data?.message || "Offer removed");
      return true;
    }

    toast.error(
      res?.error?.data?.message ||
        res?.error?.message ||
        "Failed to remove offer item!",
    );
    return false;
  };

  const handleConfirmDialog = () => {
    if (!selectedProduct?.id) {
      toast.error("No product selected");
      return false;
    }

    if (dialogConfig.type === "remove-signature") {
      return handleRemoveSignature(selectedProduct.id);
    }

    if (dialogConfig.type === "remove-offer") {
      return handleRemoveOffer(selectedProduct.id);
    }

    return handleDelete(selectedProduct.id);
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
        onConfirm={handleConfirmDialog}
        isLoading={
          deleteLoading || isDeleteSignatureLoading || isDeleteOfferItemLoading
        }
        title={dialogConfig.title}
        description={dialogConfig.description}
        confirmLabel={dialogConfig.confirmLabel}
        loadingLabel={dialogConfig.loadingLabel}
      />

      <ProductDetailsDrawer
        open={isDetailsDrawerOpen}
        setOpen={setIsDetailsDrawerOpen}
        product={selectedProductDetails?.data}
        isLoading={isProductDetailsLoading}
      />

      <ProductOfferDialog
        key={`${selectedProduct?.id ?? "none"}-${isOfferDialogOpen ? "open" : "closed"}`}
        open={isOfferDialogOpen}
        setOpen={setIsOfferDialogOpen}
        product={selectedProduct}
        assignmentData={productOfferAssignments}
        isLoading={isOfferAssignmentsLoading}
        onCreateSignature={createSignature}
        onCreateOfferItem={createOfferItem}
        isSaving={isSignatureSaving || isOfferItemSaving}
      />
    </div>
  );
};

export default ProductPage;
