import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Text, Title } from "@/components/ui/typography";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Store,
  Upload,
  Palette,
  Globe,
  Mail,
  Phone,
  MapPin,
  Save,
  Eye,
} from "lucide-react";

const StorePage = () => {
  const [storeData, setStoreData] = useState({
    storeName: "My Awesome Store",
    tagline: "Quality products at great prices",
    description: "",
    logo: null,
    favicon: null,
    brandColor: "#3b82f6",
    accentColor: "#10b981",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    currency: "USD",
    timezone: "UTC",
    language: "en",
    taxRate: "",
    shippingEnabled: true,
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);

  const handleInputChange = (field, value) => {
    setStoreData({ ...storeData, [field]: value });
  };

  const handleFileUpload = (field, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === "logo") {
          setLogoPreview(reader.result);
        } else if (field === "favicon") {
          setFaviconPreview(reader.result);
        }
        setStoreData({ ...storeData, [field]: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log("Saving store data:", storeData);
    alert("Store settings saved successfully!");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flbx">
        <div>
          <Title variant="lg">Storefront</Title>
          <Text className="mt-2 text-gray-600">
            Configure your store information and branding
          </Text>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview Store
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Store Identity */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Store className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold">Store Identity</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="storeName">Store Name*</Label>
                <Input
                  id="storeName"
                  value={storeData.storeName}
                  onChange={(e) =>
                    handleInputChange("storeName", e.target.value)
                  }
                  placeholder="Enter your store name"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={storeData.tagline}
                  onChange={(e) => handleInputChange("tagline", e.target.value)}
                  placeholder="A short description of your store"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="description">Store Description</Label>
                <textarea
                  id="description"
                  value={storeData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Tell customers about your store..."
                  rows={4}
                  className="mt-1.5 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Branding */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Palette className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold">Branding</h2>
            </div>

            <div className="space-y-6">
              {/* Logo Upload */}
              <div>
                <Label>Store Logo</Label>
                <div className="mt-1.5 flex items-center gap-4">
                  <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      id="logo-upload"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload("logo", e.target.files[0])
                      }
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() =>
                        document.getElementById("logo-upload").click()
                      }
                      className="mb-2"
                    >
                      Upload Logo
                    </Button>
                    <Text className="text-sm text-gray-500">
                      Recommended: 400x400px, PNG or SVG
                    </Text>
                  </div>
                </div>
              </div>

              {/* Favicon Upload */}
              <div>
                <Label>Favicon</Label>
                <div className="mt-1.5 flex items-center gap-4">
                  <div className="w-16 h-16 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50">
                    {faviconPreview ? (
                      <img
                        src={faviconPreview}
                        alt="Favicon preview"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <Upload className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      id="favicon-upload"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload("favicon", e.target.files[0])
                      }
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() =>
                        document.getElementById("favicon-upload").click()
                      }
                      className="mb-2"
                    >
                      Upload Favicon
                    </Button>
                    <Text className="text-sm text-gray-500">
                      Recommended: 32x32px or 64x64px, ICO or PNG
                    </Text>
                  </div>
                </div>
              </div>

              {/* Brand Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brandColor">Primary Brand Color</Label>
                  <div className="mt-1.5 flex gap-2">
                    <input
                      type="color"
                      id="brandColor"
                      value={storeData.brandColor}
                      onChange={(e) =>
                        handleInputChange("brandColor", e.target.value)
                      }
                      className="w-12 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={storeData.brandColor}
                      onChange={(e) =>
                        handleInputChange("brandColor", e.target.value)
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="mt-1.5 flex gap-2">
                    <input
                      type="color"
                      id="accentColor"
                      value={storeData.accentColor}
                      onChange={(e) =>
                        handleInputChange("accentColor", e.target.value)
                      }
                      className="w-12 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={storeData.accentColor}
                      onChange={(e) =>
                        handleInputChange("accentColor", e.target.value)
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Mail className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold">Contact Information</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={storeData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="store@example.com"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={storeData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={storeData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="123 Main Street"
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={storeData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="New York"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={storeData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="NY"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="zipCode">Zip/Postal Code</Label>
                  <Input
                    id="zipCode"
                    value={storeData.zipCode}
                    onChange={(e) =>
                      handleInputChange("zipCode", e.target.value)
                    }
                    placeholder="10001"
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={storeData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  placeholder="United States"
                  className="mt-1.5"
                />
              </div>
            </div>
          </div>

          {/* Store Configuration */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold">Store Configuration</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={storeData.currency}
                    onValueChange={(value) =>
                      handleInputChange("currency", value)
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="AUD">
                        AUD - Australian Dollar
                      </SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={storeData.timezone}
                    onValueChange={(value) =>
                      handleInputChange("timezone", value)
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">
                        Eastern Time (ET)
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        Central Time (CT)
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        Mountain Time (MT)
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time (PT)
                      </SelectItem>
                      <SelectItem value="Europe/London">
                        London (GMT)
                      </SelectItem>
                      <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                      <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Default Language</Label>
                  <Select
                    value={storeData.language}
                    onValueChange={(value) =>
                      handleInputChange("language", value)
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={storeData.taxRate}
                    onChange={(e) =>
                      handleInputChange("taxRate", e.target.value)
                    }
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    max="100"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border shadow-sm p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Live Preview</h2>

            <div className="border rounded-lg p-4 space-y-4">
              {/* Logo Preview */}
              <div className="text-center">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Store logo"
                    className="w-32 h-32 mx-auto object-contain"
                  />
                ) : (
                  <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                    <Store className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Store Name */}
              <div className="text-center">
                <h3
                  className="text-2xl font-bold"
                  style={{ color: storeData.brandColor }}
                >
                  {storeData.storeName || "Store Name"}
                </h3>
                {storeData.tagline && (
                  <p className="text-sm text-gray-600 mt-1">
                    {storeData.tagline}
                  </p>
                )}
              </div>

              {/* Color Swatches */}
              <div className="flex gap-2 justify-center pt-4 border-t">
                <div className="text-center">
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 mb-1"
                    style={{ backgroundColor: storeData.brandColor }}
                  />
                  <Text className="text-xs text-gray-500">Primary</Text>
                </div>
                <div className="text-center">
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 mb-1"
                    style={{ backgroundColor: storeData.accentColor }}
                  />
                  <Text className="text-xs text-gray-500">Accent</Text>
                </div>
              </div>

              {/* Sample Button */}
              <div className="pt-4 border-t">
                <Button
                  className="w-full"
                  style={{ backgroundColor: storeData.brandColor }}
                >
                  Shop Now
                </Button>
                <Button
                  className="w-full mt-2"
                  variant="outline"
                  style={{
                    borderColor: storeData.accentColor,
                    color: storeData.accentColor,
                  }}
                >
                  Learn More
                </Button>
              </div>

              {/* Store Info */}
              {(storeData.email || storeData.phone || storeData.address) && (
                <div className="pt-4 border-t space-y-2">
                  <Text className="text-xs font-semibold text-gray-500 uppercase">
                    Contact
                  </Text>
                  {storeData.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      {storeData.email}
                    </div>
                  )}
                  {storeData.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      {storeData.phone}
                    </div>
                  )}
                  {storeData.address && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {storeData.address}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePage;
