import { Button } from "@/components/ui/button";
import { Text, Title } from "@/components/ui/typography";
import { Download, Plus, Trash2, Upload, X, Info, Package } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const AddProductPage = () => {
  const [variantImages, setVariantImages] = useState({});

  const { register, control, handleSubmit } = useForm({
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

  const {
    fields: variantFields,
    append: addVariant,
    remove: removeVariant,
  } = useFieldArray({ control, name: "variants" });

  const onSubmit = (data) => {
    const finalData = {
      ...data,
      variants: data.variants.map((variant, idx) => ({
        ...variant,
        images: variantImages[idx] || [],
      })),
    };
    console.log("Product Data:", finalData);
    alert("Product saved successfully! Check console for data.");
  };

  const handleVariantImageUpload = (e, variantIndex) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setVariantImages((prev) => ({
      ...prev,
      [variantIndex]: [...(prev[variantIndex] || []), ...previews],
    }));
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    setVariantImages((prev) => ({
      ...prev,
      [variantIndex]: prev[variantIndex].filter((_, i) => i !== imageIndex),
    }));
  };

  return (
    <div className="">
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
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
        </div>
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
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
                        <Label>Category *</Label>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="mt-1.5 w-full">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="running">Running</SelectItem>
                            <SelectItem value="training">Training</SelectItem>
                            <SelectItem value="basketball">
                              Basketball
                            </SelectItem>
                            <SelectItem value="lifestyle">Lifestyle</SelectItem>
                            <SelectItem value="hiking">Hiking</SelectItem>
                            <SelectItem value="soccer">Soccer</SelectItem>
                            <SelectItem value="tennis">Tennis</SelectItem>
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
                    className="mt-1.5"
                    {...register("description", { required: true })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Write a compelling description that highlights what makes
                    this shoe special
                  </p>
                </div>
              </div>
            </Card>

            {/* Variants */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Product Variants
                    </h2>
                    <p className="text-sm text-gray-500">
                      Add different variations with colors, images, and sizes
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                      addVariant({
                        name: "",
                        color: "",
                        colorCode: "",
                        sizeSystem: "us",
                        sizes: [{ size: "", stock: "" }],
                      })
                    }
                  >
                    <Plus size={16} className="mr-1" /> Add Variant
                  </Button>
                </div>
              </CardHeader>

              <div className="space-y-6">
                {variantFields.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
                    <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm font-medium">No variants added yet</p>
                    <p className="text-xs mt-1">
                      Click "Add Variant" to create product variations
                    </p>
                  </div>
                ) : (
                  variantFields.map((variant, vIndex) => (
                    <VariantCard
                      key={variant.id}
                      vIndex={vIndex}
                      register={register}
                      control={control}
                      removeVariant={removeVariant}
                      variantImages={variantImages[vIndex] || []}
                      handleVariantImageUpload={handleVariantImageUpload}
                      removeVariantImage={removeVariantImage}
                    />
                  ))
                )}
              </div>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Key Features
                </h2>
                <p className="text-sm text-gray-500">
                  Highlight the main selling points
                </p>
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
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

            {/* Technical Specifications */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Technical Specifications
                </h2>
                <p className="text-sm text-gray-500">
                  Detailed performance metrics
                </p>
              </CardHeader>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Weight</Label>
                  <Input
                    placeholder="e.g., 7.2 oz (Men's 9)"
                    className="mt-1.5"
                    {...register("specifications.weight")}
                  />
                </div>
                <div>
                  <Label>Heel-to-Toe Drop</Label>
                  <Input
                    placeholder="e.g., 8mm"
                    className="mt-1.5"
                    {...register("specifications.drop")}
                  />
                </div>
                <div>
                  <Label>Upper Material</Label>
                  <Input
                    placeholder="e.g., Flyknit mesh"
                    className="mt-1.5"
                    {...register("specifications.upperMaterial")}
                  />
                </div>
                <div>
                  <Label>Midsole</Label>
                  <Input
                    placeholder="e.g., React foam"
                    className="mt-1.5"
                    {...register("specifications.midsole")}
                  />
                </div>
                <div>
                  <Label>Outsole</Label>
                  <Input
                    placeholder="e.g., Rubber with traction pattern"
                    className="mt-1.5"
                    {...register("specifications.outsole")}
                  />
                </div>
                <div>
                  <Label>Cushioning Type</Label>
                  <Input
                    placeholder="e.g., High cushioning"
                    className="mt-1.5"
                    {...register("specifications.cushioning")}
                  />
                </div>
                <div>
                  <Label>Stability</Label>
                  <Input
                    placeholder="e.g., Neutral"
                    className="mt-1.5"
                    {...register("specifications.stability")}
                  />
                </div>
                <div>
                  <Label>Recommended Terrain</Label>
                  <Input
                    placeholder="e.g., Road, Track"
                    className="mt-1.5"
                    {...register("specifications.terrain")}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>
              </CardHeader>

              <div className="space-y-4">
                <div>
                  <Label>Price *</Label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="120.00"
                      className="pl-7"
                      {...register("price", { required: true })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Compare at Price</Label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="150.00"
                      className="pl-7"
                      {...register("comparePrice")}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Show a discount by adding original price
                  </p>
                </div>

                <div>
                  <Label>Cost per Item</Label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="60.00"
                      className="pl-7"
                      {...register("costPerItem")}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    For profit tracking (not shown to customers)
                  </p>
                </div>
              </div>
            </Card>

            {/* Organization */}
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
                        >
                          <SelectTrigger className="mt-1.5 w-full">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="men">Men's</SelectItem>
                            <SelectItem value="women">Women's</SelectItem>
                            <SelectItem value="unisex">Unisex</SelectItem>
                            <SelectItem value="kids">Kids</SelectItem>
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
                        <Label>Collection</Label>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="mt-1.5 w-full">
                            <SelectValue placeholder="Select collection" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="summer-24">
                              Summer 2024
                            </SelectItem>
                            <SelectItem value="fall-24">Fall 2024</SelectItem>
                            <SelectItem value="speed-series">
                              Speed Series
                            </SelectItem>
                            <SelectItem value="training">
                              Training Essentials
                            </SelectItem>
                            <SelectItem value="limited">
                              Limited Edition
                            </SelectItem>
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
                  <p className="text-xs text-gray-500 mt-1">
                    Separate tags with commas
                  </p>
                </div>
              </div>
            </Card>

            {/* SEO Section */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Search Engine Optimization
                </h2>
                <p className="text-sm text-gray-500">
                  Improve product discoverability
                </p>
              </CardHeader>

              <div className="space-y-4">
                <div>
                  <Label>Meta Title</Label>
                  <Input
                    placeholder="SEO optimized product title"
                    className="mt-1.5"
                    {...register("metaTitle")}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: 50-60 characters
                  </p>
                </div>
                <div>
                  <Label>Meta Description</Label>
                  <Textarea
                    rows={3}
                    placeholder="Brief description for search results"
                    className="mt-1.5"
                    {...register("metaDescription")}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: 150-160 characters
                  </p>
                </div>
              </div>
            </Card>

            {/* Status Info */}
            <Card className="bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-1">
                    Product Status
                  </p>
                  <p className="text-blue-700">
                    Product will be saved as draft. You can publish it later
                    from the products list.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Submit Button */}
        <div className="sticky bottom-0 bg-white border-t translate-y-8 py-5 -mx-8">
          <div className="container flbx">
            <Link to="/products">
              <Button variant="outline">Cancel</Button>
            </Link>

            <div className="flx gap-3">
              <Button type="button" variant="outline" size="lg">
                Save as Draft
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                size="lg"
                className="px-8"
              >
                Publish Product
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Variant Card Component
const VariantCard = ({
  vIndex,
  register,
  control,
  removeVariant,
  variantImages,
  handleVariantImageUpload,
  removeVariantImage,
}) => {
  const {
    fields: sizeFields,
    append: addSize,
    remove: removeSize,
  } = useFieldArray({
    control,
    name: `variants.${vIndex}.sizes`,
  });

  return (
    <div className="border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white">
      {/* Variant Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Variant {vIndex + 1}
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => removeVariant(vIndex)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 size={16} className="mr-1" />
          Remove Variant
        </Button>
      </div>

      {/* Variant Name & Color */}
      <div className="space-y-4 mb-6">
        <div>
          <Label>Variant Name *</Label>
          <Input
            placeholder="e.g., Triple Black, University Red"
            className="mt-1.5"
            {...register(`variants.${vIndex}.name`, { required: true })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Color Name</Label>
            <Input
              placeholder="e.g., Black"
              className="mt-1.5"
              {...register(`variants.${vIndex}.color`)}
            />
          </div>
          <div>
            <Label>Color Code</Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                type="color"
                className="w-14 h-10 p-1 cursor-pointer"
                {...register(`variants.${vIndex}.colorCode`)}
              />
              <Input
                placeholder="#000000"
                className="flex-1"
                {...register(`variants.${vIndex}.colorCode`)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Variant Images */}
      <div className="mb-6">
        <Label>Variant Images *</Label>
        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors bg-white">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            id={`variant-image-${vIndex}`}
            onChange={(e) => handleVariantImageUpload(e, vIndex)}
          />
          <label htmlFor={`variant-image-${vIndex}`} className="cursor-pointer">
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">
              Upload images for this variant
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG or WEBP (max. 5MB each)
            </p>
          </label>
        </div>

        {/* Image Preview */}
        {variantImages.length > 0 && (
          <div className="grid grid-cols-5 gap-3 mt-4">
            {variantImages.map((img, imgIndex) => (
              <div key={imgIndex} className="relative group">
                <img
                  src={img.preview}
                  alt={`Variant ${vIndex + 1} - Image ${imgIndex + 1}`}
                  className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeVariantImage(vIndex, imgIndex)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X size={12} />
                </button>
                {imgIndex === 0 && (
                  <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                    Primary
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sizes */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <Label className="text-base font-semibold">
            Available Sizes & Stock
          </Label>

          <div className="flx gap-2">
            {/* Size System */}
            <Controller
              control={control}
              name={`variants.${vIndex}.sizeSystem`}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size system" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">US Sizing</SelectItem>
                    <SelectItem value="uk">UK Sizing</SelectItem>
                    <SelectItem value="eu">EU Sizing</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addSize({ size: "", stock: "" })}
            >
              <Plus size={14} className="mr-1" />
              Add Size
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {sizeFields.map((sizeField, sIndex) => (
            <div
              key={sizeField.id}
              className="flex gap-3 items-start bg-white p-3 rounded-lg border"
            >
              <div className="flex-1">
                <Label className="text-xs text-gray-600">Size</Label>
                <Input
                  placeholder="e.g., 9.5"
                  className="mt-1"
                  {...register(`variants.${vIndex}.sizes.${sIndex}.size`, {
                    required: true,
                  })}
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs text-gray-600">Stock</Label>
                <Input
                  type="number"
                  placeholder="e.g., 50"
                  className="mt-1"
                  {...register(`variants.${vIndex}.sizes.${sIndex}.stock`, {
                    required: true,
                  })}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeSize(sIndex)}
                className="mt-6 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}

          {sizeFields.length === 0 && (
            <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed">
              <p className="text-sm">No sizes added yet</p>
              <p className="text-xs mt-1">
                Click "Add Size" to add available sizes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;

// Enhanced Card Components
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="mb-6 pb-4 border-b border-gray-100">{children}</div>
);
