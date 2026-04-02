import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Text, Title } from "@/components/ui/typography";
import {
  useCreateCategoryMutation,
  useCreateCollectionMutation,
  useCreateColorMutation,
  useCreateProductMutation,
  useCreateSizeMutation,
  useProductSettingsQuery,
} from "@/features/products/productApiSlice";
import {
  Download,
  ImagePlus,
  Info,
  Package,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const EMPTY_LIST = [];

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

const createPreviewImage = (file) => ({
  file,
  preview: URL.createObjectURL(file),
});

const AddProductPage = () => {
  const navigate = useNavigate();
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [activeTab, setActiveTab] = useState("basic");
  const [sizeSelection, setSizeSelection] = useState("");
  const [colorSelection, setColorSelection] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [variantImages, setVariantImages] = useState({});
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  const [isSizeDialogOpen, setIsSizeDialogOpen] = useState(false);
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSizeValue, setNewSizeValue] = useState("");
  const [newColorName, setNewColorName] = useState("");
  const [newColorCode, setNewColorCode] = useState("#111827");
  const [newCollectionTitle, setNewCollectionTitle] = useState("");
  const [newCollectionSubtitle, setNewCollectionSubtitle] = useState("");
  const [newCollectionType, setNewCollectionType] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");
  const [newCollectionImage, setNewCollectionImage] = useState(null);

  const {
    data,
    isLoading: isProductSettingsLoading,
    refetch: refetchProductSettings,
  } = useProductSettingsQuery();

  const { register, control, handleSubmit, getValues, setValue } = useForm({
    defaultValues: {
      title: "",
      sku: "",
      brand: "",
      price: "",
      comparePrice: "",
      costPerItem: "",
      category: "",
      collections: "",
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
      tags: "",
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
  const selectedSizes =
    useWatch({ control, name: "variantConfiguration.sizeOptions" }) ??
    EMPTY_LIST;
  const selectedColors =
    useWatch({ control, name: "variantConfiguration.colorOptions" }) ??
    EMPTY_LIST;
  const variants = useWatch({ control, name: "variants" }) ?? EMPTY_LIST;

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
      if (productImage?.preview) {
        URL.revokeObjectURL(productImage.preview);
      }

      if (newCollectionImage?.preview) {
        URL.revokeObjectURL(newCollectionImage.preview);
      }

      Object.values(variantImages).forEach((image) => {
        if (image?.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [newCollectionImage, productImage, variantImages]);

  const handleSizeSelect = (value) => {
    if (value === "__add_new__") {
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
    if (value === "__add_new__") {
      setIsColorDialogOpen(true);
      setColorSelection("");
      return;
    }

    if (!selectedColors.includes(value)) {
      setValue("variantConfiguration.colorOptions", [...selectedColors, value]);
    }

    setColorSelection("");
  };

  const removeSelectedSize = (sizeId) => {
    setVariantImages((prev) => {
      const nextImages = { ...prev };

      selectedColors.forEach((colorId) => {
        const combinationKey = buildCombinationKey(sizeId, colorId);

        if (nextImages[combinationKey]?.preview) {
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

        if (nextImages[combinationKey]?.preview) {
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

  const replaceProductImage = (file) => {
    if (!file) {
      return;
    }

    if (productImage?.preview) {
      URL.revokeObjectURL(productImage.preview);
    }

    setProductImage(createPreviewImage(file));
  };

  const removeProductImage = () => {
    if (productImage?.preview) {
      URL.revokeObjectURL(productImage.preview);
    }

    setProductImage(null);
  };

  const replaceCollectionImage = (file) => {
    if (!file) {
      return;
    }

    if (newCollectionImage?.preview) {
      URL.revokeObjectURL(newCollectionImage.preview);
    }

    setNewCollectionImage(createPreviewImage(file));
  };

  const removeCollectionImage = () => {
    if (newCollectionImage?.preview) {
      URL.revokeObjectURL(newCollectionImage.preview);
    }

    setNewCollectionImage(null);
  };

  const replaceVariantImage = (combinationKey, file) => {
    if (!file) {
      return;
    }

    setVariantImages((prev) => {
      if (prev[combinationKey]?.preview) {
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
      if (prev[combinationKey]?.preview) {
        URL.revokeObjectURL(prev[combinationKey].preview);
      }

      const nextImages = { ...prev };
      delete nextImages[combinationKey];
      return nextImages;
    });
  };

  const [createCategory, { isLoading: isLoadingCreateCategory }] =
    useCreateCategoryMutation();

  const [createSize, { isLoading: isLoadingCreateSize }] =
    useCreateSizeMutation();

  const [createColor, { isLoading: isLoadingCreateColor }] =
    useCreateColorMutation();

  const [createCollection, { isLoading: isLoadingCreateCollection }] =
    useCreateCollectionMutation();

  const handleCreateCategory = async () => {
    const normalizedName = newCategoryName.trim();

    if (!normalizedName) {
      return;
    }

    try {
      await createCategory({ name: normalizedName }).unwrap();
      const refreshed = await refetchProductSettings();
      const createdCategory = refreshed?.data?.data?.categories?.find(
        (category) => category.name === normalizedName,
      );

      if (createdCategory?.id) {
        setValue("category", createdCategory.id);
      }

      setNewCategoryName("");
      setIsCategoryDialogOpen(false);
    } catch (error) {
      console.error("Category creation failed:", error);
      alert("Category save failed.");
    }
  };

  const handleCreateSize = async () => {
    const normalizedSize = newSizeValue.trim();

    if (!normalizedSize) {
      return;
    }

    try {
      await createSize({ name: normalizedSize }).unwrap();
      const refreshed = await refetchProductSettings();
      const createdSize = refreshed?.data?.data?.sizes?.find(
        (size) => size.name === normalizedSize,
      );

      if (createdSize?.id && !selectedSizes.includes(createdSize.id)) {
        setValue("variantConfiguration.sizeOptions", [
          ...selectedSizes,
          createdSize.id,
        ]);
      }

      setNewSizeValue("");
      setIsSizeDialogOpen(false);
    } catch (error) {
      console.error("Size creation failed:", error);
      alert("Size save failed.");
    }
  };

  const handleCreateColor = async () => {
    const normalizedName = newColorName.trim();

    if (!normalizedName) {
      return;
    }

    const color = {
      name: normalizedName,
      color_code: newColorCode,
    };

    try {
      await createColor(color).unwrap();
      const refreshed = await refetchProductSettings();
      const createdColor = refreshed?.data?.data?.colors?.find(
        (item) => item.name === normalizedName,
      );

      if (createdColor?.id && !selectedColors.includes(createdColor.id)) {
        setValue("variantConfiguration.colorOptions", [
          ...selectedColors,
          createdColor.id,
        ]);
      }

      setNewColorName("");
      setNewColorCode("#111827");
      setIsColorDialogOpen(false);
    } catch (error) {
      console.error("Color creation failed:", error);
      alert("Color save failed.");
    }
  };

  const handleCreateCollection = async () => {
    const normalizedTitle = newCollectionTitle.trim();

    if (!normalizedTitle) {
      return;
    }

    const formData = new FormData();
    formData.append("title", normalizedTitle);

    if (newCollectionSubtitle.trim()) {
      formData.append("subtitle", newCollectionSubtitle.trim());
    }

    if (newCollectionType.trim()) {
      formData.append("type", newCollectionType.trim());
    }

    if (newCollectionDescription.trim()) {
      formData.append("description", newCollectionDescription.trim());
    }

    if (newCollectionImage?.file) {
      formData.append("image", newCollectionImage.file);
    }

    try {
      await createCollection(formData).unwrap();
      const refreshed = await refetchProductSettings();
      const createdCollection = refreshed?.data?.data?.collections?.find(
        (collection) => collection.title === normalizedTitle,
      );

      if (createdCollection?.id) {
        setValue("collections", createdCollection.id);
      }

      if (newCollectionImage?.preview) {
        URL.revokeObjectURL(newCollectionImage.preview);
      }

      setNewCollectionTitle("");
      setNewCollectionSubtitle("");
      setNewCollectionType("");
      setNewCollectionDescription("");
      setNewCollectionImage(null);
      setIsCollectionDialogOpen(false);
    } catch (error) {
      console.error("Collection creation failed:", error);
      alert("Collection save failed.");
    }
  };

  const onSubmit = async (data) => {
    const structuredPayload = {
      product_details: {
        title: data.title,
        sku: data.sku,
        brand: data.brand,
        category: data.category,
        collection: [data.collections],
        gender: data.gender,
        description: data.description,
        pricing: {
          price: parseNumber(data.price),
          compare_price: parseNumber(data.comparePrice),
          cost_per_item: parseNumber(data.costPerItem),
        },
        features: data.features.filter(Boolean),
        specifications: data.specifications,
        tags: data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        seo: {
          meta_title: data.metaTitle,
          meta_description: data.metaDescription,
        },
        image: productImage
          ? {
              file_name: productImage.file.name,
            }
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
        size: variant.sizeId,
        color: variant.colorId,
        sku: variant.sku,
        name: variant.name,
        stock: parseNumber(variant.stock) ?? 0,
        image: variantImages[variant.combinationKey]
          ? {
              file_name: variantImages[variant.combinationKey].file.name,
            }
          : null,
      })),
    };

    const formData = new FormData();
    formData.append("product_data", JSON.stringify(structuredPayload));

    if (productImage?.file) {
      formData.append("product_image", productImage.file);
    }

    Object.entries(variantImages).forEach(([combinationKey, image]) => {
      if (image?.file) {
        formData.append(`variant_image.${combinationKey}`, image.file);
      }
    });

    try {
      await createProduct(formData).unwrap();
      console.log("Product Data:", structuredPayload);
      alert("Product saved successfully.");
      navigate("/products");
    } catch (error) {
      console.error("Product creation failed:", error);
      console.log("Product Data:", structuredPayload);
      alert("Product save failed. Check console for payload details.");
    }
  };

  const tabClassName = (tabId) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      activeTab === tabId
        ? "bg-gray-900 text-white"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`;

  return (
    <div>
      <div className="flbx">
        <div>
          <Title variant="lg" className="text-gray-900">
            Add New Product
          </Title>
          <Text className="mt-1 text-gray-500">
            Create a new shoe product listing with complete details
          </Text>
        </div>

        <Button variant="outline" className="flex items-center gap-2">
          <Download size={18} />
          Import CSV
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            type="button"
            className={tabClassName("basic")}
            onClick={() => setActiveTab("basic")}
          >
            Basic Product Details
          </button>
          <button
            type="button"
            className={tabClassName("variants")}
            onClick={() => setActiveTab("variants")}
          >
            Variants ({variants.length})
          </button>
        </div>

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
                  <div>
                    <Label>Product Title *</Label>
                    <Input
                      placeholder="e.g., Nike Air Zoom Pegasus 40"
                      className="mt-1.5"
                      {...register("title", { required: true })}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Controller
                      control={control}
                      name="category"
                      render={({ field }) => (
                        <div>
                          <div className="flex items-center justify-between gap-3">
                            <Label>Category *</Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto px-0 text-xs"
                              onClick={() => setIsCategoryDialogOpen(true)}
                            >
                              <Plus size={14} className="mr-1" />
                              Add new
                            </Button>
                          </div>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isProductSettingsLoading}
                          >
                            <SelectTrigger className="mt-1.5 w-full">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                    <div>
                      <Label>Brand *</Label>
                      <Input
                        placeholder="e.g., Nike"
                        className="mt-1.5"
                        {...register("brand", { required: true })}
                      />
                    </div>
                    <div>
                      <Label>SKU</Label>
                      <Input
                        placeholder="e.g., NK-PEG40-001"
                        className="mt-1.5"
                        {...register("sku")}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Description *</Label>
                    <Textarea
                      rows={5}
                      placeholder="Describe the shoe's key features, performance benefits, and ideal use cases..."
                      className="mt-1.5 h-32"
                      {...register("description", { required: true })}
                    />
                  </div>
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
                      <Input
                        placeholder="e.g., Responsive ZoomX foam for energy return"
                        {...register(`features.${index}`)}
                      />
                      {featureFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFeature(index)}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
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
                        <div>
                          <Label>Gender *</Label>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isProductSettingsLoading}
                          >
                            <SelectTrigger className="mt-1.5 w-full">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              {genders.map((gender) => (
                                <SelectItem
                                  key={gender.value}
                                  value={gender.value}
                                >
                                  {gender.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />

                    <Controller
                      control={control}
                      name="collections"
                      render={({ field }) => (
                        <div>
                          <div className="flex items-center justify-between gap-3">
                            <Label>Collection</Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto px-0 text-xs"
                              onClick={() => setIsCollectionDialogOpen(true)}
                            >
                              <Plus size={14} className="mr-1" />
                              Add new
                            </Button>
                          </div>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isProductSettingsLoading}
                          >
                            <SelectTrigger className="mt-1.5 w-full">
                              <SelectValue placeholder="Select collection" />
                            </SelectTrigger>
                            <SelectContent>
                              {collections.map((collection) => (
                                <SelectItem
                                  key={collection.id}
                                  value={collection.id}
                                >
                                  {collection.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                  </div>

                  <div>
                    <Label>Tags</Label>
                    <Input
                      placeholder="running, marathon, breathable"
                      className="mt-1.5"
                      {...register("tags")}
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
                  <div>
                    <Label>Meta Description</Label>
                    <Textarea
                      rows={3}
                      placeholder="Brief description for search results"
                      className="mt-1.5"
                      {...register("metaDescription")}
                    />
                  </div>
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
                  <Label>Select Sizes</Label>
                  <Select
                    value={sizeSelection}
                    onValueChange={handleSizeSelect}
                    disabled={isProductSettingsLoading}
                  >
                    <SelectTrigger className="mt-2 w-full bg-white">
                      <SelectValue placeholder="Choose size" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="__add_new__">
                        + Add new size
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedSizes.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No sizes selected.
                      </p>
                    ) : (
                      selectedSizes
                        .map((sizeId) =>
                          sizes.find((size) => size.id === sizeId),
                        )
                        .filter(Boolean)
                        .map((size) => (
                          <button
                            key={size.id}
                            type="button"
                            onClick={() => removeSelectedSize(size.id)}
                            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700"
                          >
                            {size.name}
                            <X size={14} />
                          </button>
                        ))
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <Label>Select Colors</Label>
                  <Select
                    value={colorSelection}
                    onValueChange={handleColorSelect}
                    disabled={isProductSettingsLoading}
                  >
                    <SelectTrigger className="mt-2 w-full bg-white">
                      <SelectValue placeholder="Choose color" />
                    </SelectTrigger>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.id} value={color.id}>
                          <div className="flex items-center gap-2">
                            <span
                              className="h-3 w-3 rounded-full border border-gray-300"
                              style={{ backgroundColor: color?.color_code }}
                            />
                            <span>{color.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                      <SelectItem value="__add_new__">
                        + Add new color
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedColors.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No colors selected.
                      </p>
                    ) : (
                      selectedColors
                        .map((colorId) =>
                          colors.find((color) => color.id === colorId),
                        )
                        .filter(Boolean)
                        .map((color) => (
                          <button
                            key={color.id}
                            type="button"
                            onClick={() => removeSelectedColor(color.id)}
                            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700"
                          >
                            <span
                              className="h-3 w-3 rounded-full border border-gray-300"
                              style={{ backgroundColor: color?.color_code }}
                            />
                            {color.name}
                            <X size={14} />
                          </button>
                        ))
                    )}
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
                              <Input
                                placeholder="Variant SKU"
                                {...register(`variants.${index}.sku`)}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                placeholder="Variant name"
                                {...register(`variants.${index}.name`, {
                                  required: true,
                                })}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
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

        <div className="-mx-8 sticky bottom-0 mt-8 translate-y-8 border-t bg-white py-5">
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
                disabled={isLoading}
              >
                {isLoading ? "Publishing..." : "Publish Product"}
              </Button>
            </div>
          </div>
        </div>
      </form>

      <Dialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Existing categories:{" "}
              {categories.length > 0
                ? categories.map((category) => category.name).join(", ")
                : "No categories yet."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label>Category Name</Label>
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g., Sneaker"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCategoryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateCategory}
              disabled={isLoadingCreateCategory}
            >
              {isLoadingCreateCategory ? "Saving..." : "Save Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isCollectionDialogOpen}
        onOpenChange={(open) => {
          setIsCollectionDialogOpen(open);

          if (!open) {
            removeCollectionImage();
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Collection</DialogTitle>
            <DialogDescription>
              Collections use a title, optional details, and an uploaded image.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Title</Label>
              <Input
                value={newCollectionTitle}
                onChange={(e) => setNewCollectionTitle(e.target.value)}
                placeholder="e.g., Summer 2026"
              />
            </div>

            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input
                value={newCollectionSubtitle}
                onChange={(e) => setNewCollectionSubtitle(e.target.value)}
                placeholder="Optional subtitle"
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Input
                value={newCollectionType}
                onChange={(e) => setNewCollectionType(e.target.value)}
                placeholder="Optional type"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Description</Label>
              <Textarea
                rows={4}
                value={newCollectionDescription}
                onChange={(e) => setNewCollectionDescription(e.target.value)}
                placeholder="Optional description"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Image</Label>
              <ImageUploadTile
                id="collection-image-upload"
                image={newCollectionImage}
                label="Upload collection image"
                onSelect={replaceCollectionImage}
                onRemove={removeCollectionImage}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCollectionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateCollection}
              disabled={isLoadingCreateCollection}
            >
              {isLoadingCreateCollection ? "Saving..." : "Save Collection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSizeDialogOpen} onOpenChange={setIsSizeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Size</DialogTitle>
            <DialogDescription>
              Existing sizes:{" "}
              {sizes.length > 0
                ? sizes.map((size) => size.name).join(", ")
                : "No sizes yet."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label>Size</Label>
            <Input
              value={newSizeValue}
              onChange={(e) => setNewSizeValue(e.target.value)}
              placeholder="e.g., 12.5"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSizeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateSize}
              disabled={isLoadingCreateSize}
            >
              {isLoadingCreateSize ? "Saving..." : "Save Size"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isColorDialogOpen} onOpenChange={setIsColorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Color</DialogTitle>
            <DialogDescription>
              Create a color with name and picker value.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Color Name</Label>
              <Input
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="e.g., Burgundy"
              />
            </div>

            <div className="space-y-2">
              <Label>Color Picker</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={newColorCode}
                  onChange={(e) => setNewColorCode(e.target.value)}
                  className="h-11 w-14 cursor-pointer rounded-md border border-gray-200 bg-white p-1"
                />
                <Input
                  value={newColorCode}
                  onChange={(e) => setNewColorCode(e.target.value)}
                  placeholder="#111827"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsColorDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateColor}
              disabled={isLoadingCreateColor}
            >
              {isLoadingCreateColor ? "Saving..." : "Save Color"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Field = ({ label, placeholder, register }) => (
  <div>
    <Label>{label}</Label>
    <Input placeholder={placeholder} className="mt-1.5" {...register} />
  </div>
);

const PriceField = ({ label, placeholder, register }) => (
  <div>
    <Label>{label}</Label>
    <div className="relative mt-1.5">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
        $
      </span>
      <Input
        type="number"
        step="0.01"
        placeholder={placeholder}
        className="pl-7"
        {...register}
      />
    </div>
  </div>
);

const ImageUploadTile = ({
  id,
  image,
  label,
  onSelect,
  onRemove,
  compact = false,
}) => (
  <div className={compact ? "w-24" : "w-full"}>
    <input
      id={id}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        onSelect(file);
        e.target.value = "";
      }}
    />
    {image ? (
      <div
        className={`group relative overflow-hidden rounded-xl border border-gray-200 bg-white ${
          compact ? "h-24 w-24" : "h-72"
        }`}
      >
        <label htmlFor={id} className="block h-full cursor-pointer">
          <img
            src={image.preview}
            alt={label}
            className="h-full w-full object-cover"
          />
        </label>
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white"
        >
          <X size={12} />
        </button>
      </div>
    ) : (
      <label
        htmlFor={id}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-center text-gray-500 transition hover:border-gray-400 hover:bg-gray-100 ${
          compact ? "h-24 w-24 gap-1" : "h-72 gap-3"
        }`}
      >
        <ImagePlus className={compact ? "h-5 w-5" : "h-8 w-8"} />
        <span className={compact ? "text-[11px]" : "text-sm font-medium"}>
          {label}
        </span>
      </label>
    )}
  </div>
);

export default AddProductPage;

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="mb-6 border-b border-gray-100 pb-4">{children}</div>
);
