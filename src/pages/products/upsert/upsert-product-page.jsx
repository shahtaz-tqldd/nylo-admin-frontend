import { Button } from "@/components/ui/button";
import { Field, FloatingInput, PriceField } from "@/components/ui/input";
import {
  FloatingSelect,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FloatingTextarea } from "@/components/ui/textarea";
import { Text, Title } from "@/components/ui/typography";
import {
  useCreateProductMutation,
  useProductDetailsQuery,
  useProductSettingsQuery,
  useUpdateProductMutation,
} from "@/features/products/productApiSlice";
import {
  Download,
  Info,
  Package,
  Plus,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import CategoryUpsertDialog from "../settings/category-upsert-dialog";
import { Card, CardHeader } from "@/components/ui/card";
import SizeUpsertDialog from "../settings/size-upsert-dialog";
import ColorUpsertDialog from "../settings/color-upsert-dialog";
import { ImageUploadTile } from "@/components/image-upload/image-upload";
import { canRevokePreview, createPreviewImage } from "@/lib/image-preview";
import CollectionUpsertDialog from "@/pages/collections/collection-upsert-dialog";

const EMPTY_LIST = [];
const CREATE_NEW_OPTION = "__add_new__";

const buildCombinationKey = (size, colorName) => `${size}__${colorName}`;

const buildVariantName = (title, colorName, size) =>
  [title, colorName, size ? `Size ${size}` : ""].filter(Boolean).join(" - ");

const parseNumber = (value) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const normalizeTag = (value) => value.trim().replace(/\s+/g, " ");

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const diffValues = (currentValue, originalValue) => {
  if (Array.isArray(currentValue) || Array.isArray(originalValue)) {
    return JSON.stringify(currentValue) === JSON.stringify(originalValue)
      ? undefined
      : currentValue;
  }

  if (isPlainObject(currentValue) && isPlainObject(originalValue)) {
    const diff = Object.keys(currentValue).reduce((acc, key) => {
      const nextValue = diffValues(currentValue[key], originalValue[key]);

      if (nextValue !== undefined) {
        acc[key] = nextValue;
      }

      return acc;
    }, {});

    return Object.keys(diff).length > 0 ? diff : undefined;
  }

  return currentValue === originalValue ? undefined : currentValue;
};

const mapProductToFormValues = (product) => {
  const variants = product?.variants ?? EMPTY_LIST;
  const sizeOptions = [...new Set(variants.map((variant) => variant.size?.id))];
  const colorOptions = [
    ...new Set(variants.map((variant) => variant.color?.id)),
  ];

  return {
    title: product?.title ?? "",
    sku: product?.sku ?? "",
    brand: product?.brand ?? "",
    price: product?.price ?? "",
    comparePrice: product?.compare_price ?? "",
    costPerItem: product?.cost_price ?? "",
    category: product?.category?.id ?? "",
    collections: (product?.collections ?? EMPTY_LIST)
      .map((collection) => collection.id)
      .filter(Boolean),
    gender: product?.gender ?? "",
    description: product?.description ?? "",
    features:
      product?.features?.length > 0
        ? product.features
        : [product?.description ?? ""],
    specifications: {
      weight: product?.specifications?.weight ?? "",
      drop: product?.specifications?.drop ?? "",
      upperMaterial: product?.specifications?.upperMaterial ?? "",
      midsole: product?.specifications?.midsole ?? "",
      outsole: product?.specifications?.outsole ?? "",
      cushioning: product?.specifications?.cushioning ?? "",
      stability: product?.specifications?.stability ?? "",
      terrain: product?.specifications?.terrain ?? "",
    },
    variantConfiguration: {
      sizeOptions: sizeOptions.filter(Boolean),
      colorOptions: colorOptions.filter(Boolean),
    },
    variants: variants.map((variant) => ({
      id: variant.id,
      combinationKey: buildCombinationKey(variant.size?.id, variant.color?.id),
      size: variant.size?.name ?? "",
      sizeId: variant.size?.id ?? "",
      colorName: variant.color?.name ?? "",
      colorCode: variant.color?.color_code ?? "",
      colorId: variant.color?.id ?? "",
      sku: variant.sku ?? "",
      name: buildVariantName(
        product?.title ?? "",
        variant.color?.name ?? "",
        variant.size?.name ?? "",
      ),
      stock: variant.stock ?? "",
    })),
    tags: product?.tags ?? EMPTY_LIST,
    metaTitle: product?.seo?.meta_title ?? "",
    metaDescription: product?.seo?.meta_description ?? "",
  };
};

const buildComparablePayload = ({
  data,
  colors,
  productImage,
  variantImages,
}) => ({
  product_details: {
    title: data.title,
    sku: data.sku,
    brand: data.brand,
    category: data.category,
    collection: data.collections,
    gender: data.gender,
    description: data.description,
    pricing: {
      price: parseNumber(data.price),
      compare_price: parseNumber(data.comparePrice),
      cost_per_item: parseNumber(data.costPerItem),
    },
    features: data.features.filter(Boolean),
    specifications: data.specifications,
    tags: data.tags,
    seo: {
      meta_title: data.metaTitle,
      meta_description: data.metaDescription,
    },
    image: productImage
      ? productImage.file
        ? { file_name: productImage.file.name }
        : productImage.preview
      : null,
  },
  variant_configuration: {
    sizes: data.variantConfiguration.sizeOptions,
    colors: data.variantConfiguration.colorOptions
      .map((colorId) => colors.find((color) => color.id === colorId))
      .filter(Boolean)
      .map((color) => ({
        id: color.id,
        name: color.name,
        code: color.color_code,
      })),
  },

  variants: data.variants.map((variant) => ({
    id: variant.id ?? null,
    combination_key: variant.combinationKey,
    size: variant.sizeId,
    color: variant.colorId,
    sku: variant.sku,
    name: variant.name,
    stock: parseNumber(variant.stock) ?? 0,
    image: variantImages[variant.combinationKey]
      ? variantImages[variant.combinationKey].file
        ? {
            file_name: variantImages[variant.combinationKey].file.name,
          }
        : variantImages[variant.combinationKey].preview
      : null,
  })),
});

const buildOriginalComparablePayload = (product) => ({
  product_details: {
    title: product?.title ?? "",
    sku: product?.sku ?? "",
    brand: product?.brand ?? "",
    category: product?.category?.id ?? "",
    collection: (product?.collections ?? EMPTY_LIST)
      .map((collection) => collection.id)
      .filter(Boolean),
    gender: product?.gender ?? "",
    description: product?.description ?? "",
    pricing: {
      price: parseNumber(product?.price),
      compare_price: parseNumber(product?.compare_price),
      cost_per_item: parseNumber(product?.cost_price),
    },
    features: product?.features ?? EMPTY_LIST,
    specifications: {
      weight: product?.specifications?.weight ?? "",
      drop: product?.specifications?.drop ?? "",
      upperMaterial: product?.specifications?.upperMaterial ?? "",
      midsole: product?.specifications?.midsole ?? "",
      outsole: product?.specifications?.outsole ?? "",
      cushioning: product?.specifications?.cushioning ?? "",
      stability: product?.specifications?.stability ?? "",
      terrain: product?.specifications?.terrain ?? "",
    },
    tags: product?.tags ?? EMPTY_LIST,
    seo: {
      meta_title: product?.seo?.meta_title ?? "",
      meta_description: product?.seo?.meta_description ?? "",
    },
    image: product?.image_url ?? null,
  },
  variant_configuration: {
    sizes: [
      ...new Set(
        (product?.variants ?? EMPTY_LIST).map((variant) => variant.size?.id),
      ),
    ],
    colors: [
      ...new Set(
        (product?.variants ?? EMPTY_LIST).map((variant) => variant.color?.id),
      ),
    ]
      .map((colorId) => {
        const color = (product?.variants ?? EMPTY_LIST).find(
          (variant) => variant.color?.id === colorId,
        )?.color;

        if (!color) {
          return null;
        }

        return {
          id: color.id,
          name: color.name,
          code: color.color_code,
        };
      })
      .filter(Boolean),
  },
  variants: (product?.variants ?? EMPTY_LIST).map((variant) => ({
    id: variant.id,
    size: variant.size?.id ?? "",
    color: variant.color?.id ?? "",
    sku: variant.sku ?? "",
    name: buildVariantName(
      product?.title ?? "",
      variant.color?.name ?? "",
      variant.size?.name ?? "",
    ),
    stock: parseNumber(variant.stock) ?? 0,
    image: variant.image_url ?? null,
  })),
});

const SelectionChipList = ({
  items,
  getKey,
  getLabel,
  onRemove,
  emptyText,
  renderPrefix,
}) => (
  <div className="flex flex-wrap gap-2">
    {items.length === 0 ? (
      <p className="text-sm text-gray-500">{emptyText}</p>
    ) : (
      items.map((item) => (
        <button
          key={getKey(item)}
          type="button"
          onClick={() => onRemove(item)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700"
        >
          {renderPrefix ? renderPrefix(item) : null}
          <span>{getLabel(item)}</span>
          <X size={14} />
        </button>
      ))
    )}
  </div>
);

const UpsertProductPage = () => {
  const { productId } = useParams();
  const isEditMode = Boolean(productId);
  const { data: productData } = useProductDetailsQuery(productId, {
    skip: !productId,
  });

  const navigate = useNavigate();
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [activeTab, setActiveTab] = useState("basic");
  const [collectionSelection, setCollectionSelection] = useState("");
  const [sizeSelection, setSizeSelection] = useState("");
  const [colorSelection, setColorSelection] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [variantImages, setVariantImages] = useState({});
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  const [isSizeDialogOpen, setIsSizeDialogOpen] = useState(false);
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false);

  const [originalProductSnapshot, setOriginalProductSnapshot] = useState(null);
  const hydratedProductIdRef = useRef(null);

  const {
    data,
    isLoading: isProductSettingsLoading,
    // refetch: refetchProductSettings,
  } = useProductSettingsQuery();

  const { register, control, handleSubmit, getValues, setValue, reset } =
    useForm({
      defaultValues: {
        title: "",
        sku: "",
        brand: "",
        price: "",
        comparePrice: "",
        costPerItem: "",
        category: "",
        collections: [],
        gender: "",
        description: "",
        features: [""],
        specifications: {
          weight: "",
          drop: "",
          upperMaterial: "",
          midsole: "",
          outsole: "",
          cushioning: "",
          stability: "",
          terrain: "",
        },
        variantConfiguration: {
          sizeOptions: [],
          colorOptions: [],
        },
        variants: [],
        tags: [],
        metaTitle: "",
        metaDescription: "",
      },
    });

  const {
    fields: featureFields,
    append: addFeature,
    remove: removeFeature,
  } = useFieldArray({ control, name: "features" });

  const settings = data?.data ?? {};
  const categories = settings.categories ?? EMPTY_LIST;
  const sizes = settings.sizes ?? EMPTY_LIST;
  const colors = settings.colors ?? EMPTY_LIST;
  const collections = settings.collections ?? EMPTY_LIST;
  const genders = settings.genders ?? EMPTY_LIST;

  const productTitle = useWatch({ control, name: "title" }) ?? "";
  const selectedCollections =
    useWatch({ control, name: "collections" }) ?? EMPTY_LIST;
  const selectedSizes =
    useWatch({ control, name: "variantConfiguration.sizeOptions" }) ??
    EMPTY_LIST;
  const selectedColors =
    useWatch({ control, name: "variantConfiguration.colorOptions" }) ??
    EMPTY_LIST;
  const variants = useWatch({ control, name: "variants" }) ?? EMPTY_LIST;
  const tags = useWatch({ control, name: "tags" }) ?? EMPTY_LIST;

  const selectedCollectionItems = selectedCollections
    .map((collectionId) =>
      collections.find((collection) => collection.id === collectionId),
    )
    .filter(Boolean);
  const availableCollections = collections.filter(
    (collection) => !selectedCollections.includes(collection.id),
  );
  const availableSizes = sizes.filter(
    (size) => !selectedSizes.includes(size.id),
  );
  const availableColors = colors.filter(
    (color) => !selectedColors.includes(color.id),
  );

  useEffect(() => {
    const filteredCollections = selectedCollections.filter((collectionId) =>
      collections.some((collection) => collection.id === collectionId),
    );

    if (filteredCollections.length !== selectedCollections.length) {
      setValue("collections", filteredCollections);
    }
  }, [collections, selectedCollections, setValue]);

  useEffect(() => {
    const filteredSizes = selectedSizes.filter((sizeId) =>
      sizes.some((size) => size.id === sizeId),
    );

    if (filteredSizes.length !== selectedSizes.length) {
      setValue("variantConfiguration.sizeOptions", filteredSizes);
    }
  }, [selectedSizes, setValue, sizes]);

  useEffect(() => {
    const filteredColors = selectedColors.filter((colorId) =>
      colors.some((color) => color.id === colorId),
    );

    if (filteredColors.length !== selectedColors.length) {
      setValue("variantConfiguration.colorOptions", filteredColors);
    }
  }, [colors, selectedColors, setValue]);

  useEffect(() => {
    const existingVariants = getValues("variants") || [];
    const nextVariants = [];

    selectedColors.forEach((colorId) => {
      const color = colors.find((item) => item.id === colorId);
      if (!color) {
        return;
      }

      selectedSizes.forEach((sizeId) => {
        const size = sizes.find((item) => item.id === sizeId);
        if (!size) {
          return;
        }

        const combinationKey = buildCombinationKey(size.id, color.id);
        const existingVariant = existingVariants.find(
          (item) => item.combinationKey === combinationKey,
        );

        nextVariants.push({
          id: existingVariant?.id,
          combinationKey,
          size: size.name,
          sizeId: size.id,
          colorName: color.name,
          colorCode: color.color_code,
          colorId: color.id,
          sku: existingVariant?.sku || "",
          name:
            existingVariant?.name ||
            buildVariantName(productTitle, color.name, size.name),
          stock: existingVariant?.stock || "",
        });
      });
    });

    setValue("variants", nextVariants);
  }, [
    colors,
    getValues,
    productTitle,
    selectedColors,
    selectedSizes,
    setValue,
    sizes,
  ]);

  useEffect(() => {
    return () => {
      if (canRevokePreview(productImage)) {
        URL.revokeObjectURL(productImage.preview);
      }

      Object.values(variantImages).forEach((image) => {
        if (canRevokePreview(image)) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [productImage, variantImages]);

  useEffect(() => {
    if (!isEditMode || isProductSettingsLoading || !productData?.data) {
      return;
    }

    if (hydratedProductIdRef.current === productData.data.id) {
      return;
    }

    const product = productData.data;
    const formValues = mapProductToFormValues(product);
    const nextVariantImages = {};
    const nextProductImage = product.image_url
      ? { preview: product.image_url }
      : null;
    const nextOriginalSnapshot = buildOriginalComparablePayload(product);

    (product.variants ?? EMPTY_LIST).forEach((variant) => {
      const combinationKey = buildCombinationKey(
        variant.size?.id,
        variant.color?.id,
      );

      if (variant.image_url) {
        nextVariantImages[combinationKey] = { preview: variant.image_url };
      }
    });

    reset(formValues);
    hydratedProductIdRef.current = product.id;

    queueMicrotask(() => {
      setProductImage(nextProductImage);
      setVariantImages(nextVariantImages);
      setOriginalProductSnapshot(nextOriginalSnapshot);
    });
  }, [isEditMode, isProductSettingsLoading, productData, reset]);

  const handleSizeSelect = (value) => {
    if (value === CREATE_NEW_OPTION) {
      setIsSizeDialogOpen(true);
      setSizeSelection("");
      return;
    }

    if (!selectedSizes.includes(value)) {
      setValue("variantConfiguration.sizeOptions", [...selectedSizes, value]);
    }

    setSizeSelection("");
  };

  const handleColorSelect = (value) => {
    if (value === CREATE_NEW_OPTION) {
      setIsColorDialogOpen(true);
      setColorSelection("");
      return;
    }

    if (!selectedColors.includes(value)) {
      setValue("variantConfiguration.colorOptions", [...selectedColors, value]);
    }

    setColorSelection("");
  };

  const handleCollectionSelect = (value) => {
    if (value === CREATE_NEW_OPTION) {
      setIsCollectionDialogOpen(true);
      setCollectionSelection("");
      return;
    }

    if (!selectedCollections.includes(value)) {
      setValue("collections", [...selectedCollections, value]);
    }

    setCollectionSelection("");
  };

  const removeSelectedCollection = (collectionId) => {
    setValue(
      "collections",
      selectedCollections.filter((item) => item !== collectionId),
    );
  };

  const removeSelectedSize = (sizeId) => {
    setVariantImages((prev) => {
      const nextImages = { ...prev };

      selectedColors.forEach((colorId) => {
        const combinationKey = buildCombinationKey(sizeId, colorId);

        if (canRevokePreview(nextImages[combinationKey])) {
          URL.revokeObjectURL(nextImages[combinationKey].preview);
        }

        delete nextImages[combinationKey];
      });

      return nextImages;
    });

    setValue(
      "variantConfiguration.sizeOptions",
      selectedSizes.filter((item) => item !== sizeId),
    );
  };

  const removeSelectedColor = (colorId) => {
    setVariantImages((prev) => {
      const nextImages = { ...prev };

      selectedSizes.forEach((sizeId) => {
        const combinationKey = buildCombinationKey(sizeId, colorId);

        if (canRevokePreview(nextImages[combinationKey])) {
          URL.revokeObjectURL(nextImages[combinationKey].preview);
        }

        delete nextImages[combinationKey];
      });

      return nextImages;
    });

    setValue(
      "variantConfiguration.colorOptions",
      selectedColors.filter((item) => item !== colorId),
    );
  };

  const commitTag = (rawValue) => {
    const nextTag = normalizeTag(rawValue);

    if (!nextTag || tags.includes(nextTag)) {
      setTagInput("");
      return;
    }

    setValue("tags", [...tags, nextTag]);
    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove),
    );
  };

  const handleTagKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      commitTag(tagInput);
    }
  };

  const replaceProductImage = (file) => {
    if (!file) {
      return;
    }

    if (canRevokePreview(productImage)) {
      URL.revokeObjectURL(productImage.preview);
    }

    setProductImage(createPreviewImage(file));
  };

  const removeProductImage = () => {
    if (canRevokePreview(productImage)) {
      URL.revokeObjectURL(productImage.preview);
    }

    setProductImage(null);
  };

  const replaceVariantImage = (combinationKey, file) => {
    if (!file) {
      return;
    }

    setVariantImages((prev) => {
      if (canRevokePreview(prev[combinationKey])) {
        URL.revokeObjectURL(prev[combinationKey].preview);
      }

      return {
        ...prev,
        [combinationKey]: createPreviewImage(file),
      };
    });
  };

  const removeVariantImage = (combinationKey) => {
    setVariantImages((prev) => {
      if (canRevokePreview(prev[combinationKey])) {
        URL.revokeObjectURL(prev[combinationKey].preview);
      }

      const nextImages = { ...prev };
      delete nextImages[combinationKey];
      return nextImages;
    });
  };

  const onSubmit = async (data) => {
    const structuredPayload = buildComparablePayload({
      data,
      colors,
      productImage,
      variantImages,
    });

    const changedFields = isEditMode
      ? diffValues(structuredPayload, originalProductSnapshot)
      : null;

    const payload = isEditMode
      ? {
          id: productId,
          product_id: productId,
          ...(changedFields ?? {}),
        }
      : structuredPayload;

    if (isEditMode && Object.keys(payload).length === 2) {
      alert("No product changes to update.");
      return;
    }

    const formData = new FormData();
    formData.append("product_data", JSON.stringify(payload));

    if (productImage?.file) {
      formData.append("product_image", productImage.file);
    }

    Object.entries(variantImages).forEach(([combinationKey, image]) => {
      if (image?.file) {
        formData.append(`variant_image.${combinationKey}`, image.file);
      }
    });

    try {
      if (isEditMode) {
        await updateProduct({ payload: formData, productId }).unwrap();
      } else {
        await createProduct(formData).unwrap();
      }

      navigate("/products");
    } catch (error) {
      console.error(
        isEditMode ? "Product update failed:" : "Product creation failed:",
        error,
      );
      console.log("Product Data:", payload);
      alert("Product save failed. Check console for payload details.");
    }
  };

  const tabClassName = (tabId) =>
    `py-2 px-1 text-sm font-medium transition border-b border-b-2 ${
      activeTab === tabId ? "text-primary border-b-primary" : "text-gray-400"
    }`;

  return (
    <div>
      <div className="flbx">
        <div>
          <Title variant="lg" className="text-gray-900">
            {isEditMode ? "Update Product" : "Add New Product"}
          </Title>
          <Text className="mt-1 text-gray-500">
            {isEditMode
              ? "Update the product listing and submit only the changed fields"
              : "Create a new shoe product listing with complete details"}
          </Text>
        </div>

        <Button variant="outline" className="flex items-center gap-2">
          <Download size={18} />
          Import CSV
        </Button>
      </div>

      {/* tab */}
      <div className="flex justify-between items-center mb-6 mt-8">
        <div className="flex flex-wrap">
          <button
            type="button"
            className={tabClassName("basic")}
            onClick={() => setActiveTab("basic")}
          >
            Basic Product Details
          </button>
          <div className="w-3 border-b border-b-2"></div>
          <button
            type="button"
            className={tabClassName("variants")}
            onClick={() => setActiveTab("variants")}
          >
            Variants ({variants.length})
          </button>
        </div>
        <Link to="/products/settings">
          <Button variant="outline" className="pr-4 pl-3">
            <div className="flx gap-1.5">
              <Settings2 className="!h-4" />
              Settings
            </div>
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {activeTab === "basic" ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Basic Information
                  </h2>
                  <p className="text-sm text-gray-500">
                    Essential product details
                  </p>
                </CardHeader>

                <div className="space-y-4">
                  <FloatingInput
                    label="Product Title"
                    {...register("title", { required: true })}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <Controller
                      control={control}
                      name="category"
                      render={({ field }) => (
                        <FloatingSelect
                          label="Category *"
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isProductSettingsLoading}
                        >
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="w-full justify-start font-normal"
                            onClick={() => setIsCategoryDialogOpen(true)}
                          >
                            <Plus size={14} className="mr-1" />
                            Add new
                          </Button>
                          <SelectSeparator />
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                          {categories.length === 0 && (
                            <span className="text-sm opacity-50 px-2 block py-2">
                              No categories available
                            </span>
                          )}
                        </FloatingSelect>
                      )}
                    />
                    <FloatingInput
                      label="Brand *"
                      placeholder="e.g., Nike"
                      {...register("brand", { required: true })}
                    />
                    <FloatingInput
                      label="SKU"
                      placeholder="e.g., NK-PEG40-001"
                      {...register("sku")}
                    />
                  </div>

                  <FloatingTextarea
                    label="Description *"
                    rows={5}
                    textareaClassName="min-h-32"
                    placeholder="Describe the shoe's key features, performance benefits, and ideal use cases..."
                    {...register("description", { required: true })}
                  />
                </div>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Technical Specifications
                  </h2>
                </CardHeader>

                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Weight"
                    register={register("specifications.weight")}
                    placeholder="e.g., 7.2 oz (Men's 9)"
                  />
                  <Field
                    label="Heel-to-Toe Drop"
                    register={register("specifications.drop")}
                    placeholder="e.g., 8mm"
                  />
                  <Field
                    label="Upper Material"
                    register={register("specifications.upperMaterial")}
                    placeholder="e.g., Flyknit mesh"
                  />
                  <Field
                    label="Midsole"
                    register={register("specifications.midsole")}
                    placeholder="e.g., React foam"
                  />
                  <Field
                    label="Outsole"
                    register={register("specifications.outsole")}
                    placeholder="e.g., Rubber with traction pattern"
                  />
                  <Field
                    label="Cushioning Type"
                    register={register("specifications.cushioning")}
                    placeholder="e.g., High cushioning"
                  />
                  <Field
                    label="Stability"
                    register={register("specifications.stability")}
                    placeholder="e.g., Neutral"
                  />
                  <Field
                    label="Recommended Terrain"
                    register={register("specifications.terrain")}
                    placeholder="e.g., Road, Track"
                  />
                </div>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Key Features
                  </h2>
                </CardHeader>

                <div className="space-y-3">
                  {featureFields.map((field, index) => (
                    <div className="flex gap-2" key={field.id}>
                      <FloatingInput
                        label={`Feature ${index + 1}`}
                        placeholder="e.g., Responsive ZoomX foam for energy return"
                        {...register(`features.${index}`)}
                      />
                      {featureFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFeature(index)}
                          className="mt-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addFeature("")}
                    className="w-full"
                  >
                    <Plus size={16} className="mr-1" /> Add Feature
                  </Button>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <ImageUploadTile
                  id="product-image-upload"
                  image={productImage}
                  label="Upload product image"
                  onSelect={replaceProductImage}
                  onRemove={removeProductImage}
                />
              </Card>
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Pricing
                  </h2>
                </CardHeader>

                <div className="space-y-4">
                  <PriceField
                    label="Price *"
                    placeholder="120.00"
                    register={register("price", { required: true })}
                  />
                  <PriceField
                    label="Compare at Price"
                    placeholder="150.00"
                    register={register("comparePrice")}
                  />
                  <PriceField
                    label="Cost per Item"
                    placeholder="60.00"
                    register={register("costPerItem")}
                  />
                </div>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Organization
                  </h2>
                </CardHeader>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Controller
                      control={control}
                      name="gender"
                      render={({ field }) => (
                        <FloatingSelect
                          label="Gender *"
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isProductSettingsLoading}
                        >
                          {genders.map((gender) => (
                            <SelectItem key={gender.value} value={gender.value}>
                              {gender.label}
                            </SelectItem>
                          ))}
                          {genders.length === 0 && (
                            <span className="text-sm opacity-50 px-2">
                              No options available
                            </span>
                          )}
                        </FloatingSelect>
                      )}
                    />

                    <FloatingSelect
                      label="Collection"
                      onValueChange={handleCollectionSelect}
                      value={collectionSelection}
                      disabled={isProductSettingsLoading}
                    >
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="w-full justify-start font-normal"
                        onClick={() => setIsCollectionDialogOpen(true)}
                      >
                        <Plus size={14} className="mr-1" />
                        Add new
                      </Button>
                      <SelectSeparator />
                      {availableCollections.length === 0 ? (
                        <span className="text-sm opacity-50 px-2 block py-2">
                          No more collections to add
                        </span>
                      ) : (
                        availableCollections.map((collection) => (
                          <SelectItem key={collection.id} value={collection.id}>
                            {collection.title}
                          </SelectItem>
                        ))
                      )}
                    </FloatingSelect>
                  </div>

                  <SelectionChipList
                    items={selectedCollectionItems}
                    getKey={(item) => item.id}
                    getLabel={(item) => item.title}
                    onRemove={(item) => removeSelectedCollection(item.id)}
                    emptyText="No collections selected."
                  />

                  <div className="space-y-3">
                    <FloatingInput
                      label="Tags"
                      placeholder="Type a tag and press Enter or Space"
                      value={tagInput}
                      onChange={(event) => setTagInput(event.target.value)}
                      onKeyDown={handleTagKeyDown}
                      onBlur={() => commitTag(tagInput)}
                      name="tags-input"
                    />
                    <SelectionChipList
                      items={tags}
                      getKey={(item) => item}
                      getLabel={(item) => item}
                      onRemove={removeTag}
                      emptyText="No tags added."
                    />
                  </div>
                </div>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Search Engine Optimization
                  </h2>
                </CardHeader>

                <div className="space-y-4">
                  <Field
                    label="Meta Title"
                    register={register("metaTitle")}
                    placeholder="SEO optimized product title"
                  />
                  <FloatingTextarea
                    label="Meta Description"
                    rows={3}
                    textareaClassName="min-h-24"
                    placeholder="Brief description for search results"
                    {...register("metaDescription")}
                  />
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Variant Options
                </h2>
                <p className="text-sm text-gray-500">
                  Select sizes and colors to generate combinations automatically
                </p>
              </CardHeader>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <FloatingSelect
                    label="Select Sizes"
                    value={sizeSelection}
                    onValueChange={handleSizeSelect}
                    disabled={isProductSettingsLoading}
                    triggerClassName="bg-white"
                  >
                    <SelectItem value={CREATE_NEW_OPTION}>
                      + Add new size
                    </SelectItem>
                    <SelectSeparator />
                    {availableSizes.length === 0 ? (
                      <span className="text-sm opacity-50 px-2 block py-2">
                        No more sizes to add
                      </span>
                    ) : (
                      availableSizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))
                    )}
                  </FloatingSelect>

                  <div className="mt-3">
                    <SelectionChipList
                      items={selectedSizes
                        .map((sizeId) =>
                          sizes.find((size) => size.id === sizeId),
                        )
                        .filter(Boolean)}
                      getKey={(item) => item.id}
                      getLabel={(item) => item.name}
                      onRemove={(item) => removeSelectedSize(item.id)}
                      emptyText="No sizes selected."
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <FloatingSelect
                    label="Select Colors"
                    value={colorSelection}
                    onValueChange={handleColorSelect}
                    disabled={isProductSettingsLoading}
                    triggerClassName="bg-white"
                  >
                    <SelectItem value={CREATE_NEW_OPTION}>
                      + Add new color
                    </SelectItem>
                    <SelectSeparator />
                    {availableColors.length === 0 ? (
                      <span className="text-sm opacity-50 px-2 block py-2">
                        No more colors to add
                      </span>
                    ) : (
                      availableColors.map((color) => (
                        <SelectItem key={color.id} value={color.id}>
                          <div className="flex items-center gap-2">
                            <span
                              className="h-3 w-3 rounded-full border border-gray-300"
                              style={{ backgroundColor: color?.color_code }}
                            />
                            <span>{color.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </FloatingSelect>

                  <div className="mt-3">
                    <SelectionChipList
                      items={selectedColors
                        .map((colorId) =>
                          colors.find((color) => color.id === colorId),
                        )
                        .filter(Boolean)}
                      getKey={(item) => item.id}
                      getLabel={(item) => item.name}
                      onRemove={(item) => removeSelectedColor(item.id)}
                      emptyText="No colors selected."
                      renderPrefix={(item) => (
                        <span
                          className="h-3 w-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: item?.color_code }}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Variant Combinations
                    </h2>
                    <p className="text-sm text-gray-500">
                      Each combination has one image, SKU, name, and stock
                    </p>
                  </div>
                  <div className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                    {variants.length} variants
                  </div>
                </div>
              </CardHeader>

              {variants.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed bg-gray-50 py-12 text-center text-gray-500">
                  <Package className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                  <p className="text-sm font-medium">
                    No variant combinations yet
                  </p>
                  <p className="mt-1 text-xs">
                    Select at least one size and one color to generate variants
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-gray-200">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>Variant</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Color</TableHead>
                          <TableHead>Image</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Stock</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {variants.map((variant, index) => (
                          <TableRow key={variant.combinationKey}>
                            <TableCell className="font-medium">
                              <input
                                type="hidden"
                                {...register(
                                  `variants.${index}.combinationKey`,
                                )}
                              />
                              <input
                                type="hidden"
                                {...register(`variants.${index}.size`)}
                              />
                              <input
                                type="hidden"
                                {...register(`variants.${index}.sizeId`)}
                              />
                              <input
                                type="hidden"
                                {...register(`variants.${index}.colorName`)}
                              />
                              <input
                                type="hidden"
                                {...register(`variants.${index}.colorId`)}
                              />
                              <input
                                type="hidden"
                                {...register(`variants.${index}.colorCode`)}
                              />
                              {index + 1}
                            </TableCell>
                            <TableCell>{variant.size}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span
                                  className="h-3 w-3 rounded-full border border-gray-300"
                                  style={{ backgroundColor: variant.colorCode }}
                                />
                                {variant.colorName}
                              </div>
                            </TableCell>
                            <TableCell>
                              <ImageUploadTile
                                id={`variant-image-${variant.combinationKey}`}
                                image={
                                  variantImages[variant.combinationKey] || null
                                }
                                label="Upload image"
                                compact
                                onSelect={(file) =>
                                  replaceVariantImage(
                                    variant.combinationKey,
                                    file,
                                  )
                                }
                                onRemove={() =>
                                  removeVariantImage(variant.combinationKey)
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <FloatingInput
                                label="Variant SKU"
                                {...register(`variants.${index}.sku`)}
                              />
                            </TableCell>
                            <TableCell>
                              <FloatingInput
                                label="Variant Name"
                                {...register(`variants.${index}.name`, {
                                  required: true,
                                })}
                              />
                            </TableCell>
                            <TableCell>
                              <FloatingInput
                                label="Stock"
                                type="number"
                                min="0"
                                {...register(`variants.${index}.stock`, {
                                  required: true,
                                })}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                    <div className="flex items-start gap-3">
                      <Info className="mt-0.5 h-4 w-4 text-blue-600" />
                      <p className="text-sm text-blue-900">
                        Selecting or removing a size or color updates the
                        variant list automatically and preserves existing row
                        data for matching combinations.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        <div className="-mx-8 sticky bottom-0 translate-y-8 border-t bg-white py-5 z-10">
          <div className="container flbx">
            <Link to="/products">
              <Button variant="outline">Cancel</Button>
            </Link>

            <div className="flx gap-3">
              <Button type="button" variant="outline" size="lg">
                Save as Draft
              </Button>
              <Button
                type="submit"
                size="lg"
                className="px-8"
                disabled={isLoading || isUpdating}
              >
                {isLoading || isUpdating
                  ? isEditMode
                    ? "Updating..."
                    : "Publishing..."
                  : isEditMode
                    ? "Update Product"
                    : "Publish Product"}
              </Button>
            </div>
          </div>
        </div>
      </form>

      <CategoryUpsertDialog
        open={isCategoryDialogOpen}
        setOpen={setIsCategoryDialogOpen}
        categories={categories}
      />
      <SizeUpsertDialog
        open={isSizeDialogOpen}
        setOpen={setIsSizeDialogOpen}
        sizes={sizes}
      />
      <ColorUpsertDialog
        open={isColorDialogOpen}
        setOpen={setIsColorDialogOpen}
      />
      <CollectionUpsertDialog
        open={isCollectionDialogOpen}
        setOpen={setIsCollectionDialogOpen}
      />
    </div>
  );
};

export default UpsertProductPage;
