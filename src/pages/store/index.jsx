import React from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/input";
import { FloatingTextarea } from "@/components/ui/textarea";
import { Text, Title } from "@/components/ui/typography";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useStoreDetailsQuery,
  useUpdateStoreMutation,
} from "@/features/store/storeApiSlice";
import {
  Eye,
  Globe,
  Mail,
  Palette,
  Phone,
  Save,
  Store,
  Upload,
} from "lucide-react";

const SECTION_STYLES =
  "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm";

const FALLBACK_FIELD_KEYS = [
  "primary_color",
  "accent_color",
  "logo",
  "favicon",
  "facebook",
  "whatsapp",
  "instagram",
];
const IMAGE_FIELDS = [
  { key: "logo", label: "Store Logo", helper: "Recommended: 400x400px, PNG or SVG" },
  { key: "favicon", label: "Favicon", helper: "Recommended: 32x32px or 64x64px, ICO or PNG" },
];

const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "INR", label: "INR - Indian Rupee" },
];

const TIMEZONE_OPTIONS = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
];

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ja", label: "Japanese" },
  { value: "zh", label: "Chinese" },
];

const FIELD_SECTIONS = [
  {
    id: "identity",
    title: "Store Identity",
    description: "Core storefront information that customers will see first.",
    icon: Store,
    fields: [
      { key: "name", label: "Store Name", component: "input" },
      { key: "tagline", label: "Tagline", component: "input" },
      { key: "description", label: "Store Description", component: "textarea" },
    ],
  },
  {
    id: "contact",
    title: "Contact Information",
    description: "How customers can reach the store.",
    icon: Mail,
    fields: [
      { key: "email", label: "Email Address", type: "email", component: "input" },
      { key: "phone", label: "Phone Number", type: "tel", component: "input" },
      { key: "address", label: "Address", component: "textarea" },
    ],
  },
  {
    id: "configuration",
    title: "Store Configuration",
    description: "Regional settings used across the storefront.",
    icon: Globe,
    fields: [
      {
        key: "currency",
        label: "Currency",
        component: "select",
        options: CURRENCY_OPTIONS,
      },
      {
        key: "timezone",
        label: "Timezone",
        component: "select",
        options: TIMEZONE_OPTIONS,
      },
      {
        key: "language",
        label: "Language",
        component: "select",
        options: LANGUAGE_OPTIONS,
      },
      { key: "tax", label: "Tax Rate", component: "input" },
    ],
  },
  {
    id: "social",
    title: "Social Links",
    description: "Public social handles connected to the storefront.",
    icon: Phone,
    fields: [
      { key: "facebook", label: "Facebook", component: "input" },
      { key: "whatsapp", label: "WhatsApp", component: "input" },
      { key: "instagram", label: "Instagram", component: "input" },
    ],
  },
];

const isAvailableFieldValue = (value) =>
  value !== null && value !== undefined && value !== "";

const getInitialDraft = (store) => ({
  name: store?.name ?? "",
  tagline: store?.tagline ?? "",
  description: store?.description ?? "",
  primary_color: store?.primary_color ?? "",
  accent_color: store?.accent_color ?? "",
  email: store?.email ?? "",
  phone: store?.phone ?? "",
  address: store?.address ?? "",
  currency: store?.currency ?? "",
  timezone: store?.timezone ?? "",
  language: store?.language ?? "",
  tax: store?.tax ?? "",
  facebook: store?.facebook ?? "",
  whatsapp: store?.whatsapp ?? "",
  instagram: store?.instagram ?? "",
  logo: store?.logo ?? null,
  favicon: store?.favicon ?? null,
});

const StorePage = () => {
  const { data, isLoading, isError, refetch } = useStoreDetailsQuery();
  const [updateStore, { isLoading: isSaving }] = useUpdateStoreMutation();
  const store = React.useMemo(() => data?.data ?? data ?? null, [data]);
  const fileInputRefs = React.useRef({});
  const previewUrlsRef = React.useRef([]);

  const [initialValues, setInitialValues] = React.useState(null);
  const [formValues, setFormValues] = React.useState(null);
  const [mediaFiles, setMediaFiles] = React.useState({ logo: null, favicon: null });

  React.useEffect(() => {
    if (!store) {
      return;
    }

    const nextDraft = getInitialDraft(store);
    setInitialValues(nextDraft);
    setFormValues(nextDraft);
    setMediaFiles({ logo: null, favicon: null });
  }, [store]);

  React.useEffect(
    () => () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );

  const visibleFields = React.useMemo(() => {
    if (!store) {
      return {};
    }

    const next = {};

    Object.keys(store).forEach((key) => {
      next[key] =
        isAvailableFieldValue(store[key]) || FALLBACK_FIELD_KEYS.includes(key);
    });

    return next;
  }, [store]);

  const visibleSections = React.useMemo(
    () =>
      FIELD_SECTIONS.map((section) => ({
        ...section,
        fields: section.fields.filter((field) => visibleFields[field.key]),
      })).filter((section) => section.fields.length > 0),
    [visibleFields],
  );

  const mediaPreview = React.useMemo(
    () => ({
      logo:
        mediaFiles.logo?.previewUrl ??
        (typeof formValues?.logo === "string" ? formValues.logo : null),
      favicon:
        mediaFiles.favicon?.previewUrl ??
        (typeof formValues?.favicon === "string" ? formValues.favicon : null),
    }),
    [formValues, mediaFiles],
  );

  const handleInputChange = React.useCallback((key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleFileChange = React.useCallback((key, file) => {
    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    previewUrlsRef.current.push(previewUrl);

    setMediaFiles((prev) => {
      if (prev[key]?.previewUrl) {
        URL.revokeObjectURL(prev[key].previewUrl);
        previewUrlsRef.current = previewUrlsRef.current.filter(
          (url) => url !== prev[key].previewUrl,
        );
      }

      return {
        ...prev,
        [key]: {
          file,
          previewUrl,
        },
      };
    });

    setFormValues((prev) => ({ ...prev, [key]: previewUrl }));
  }, []);

  const resetDraft = React.useCallback(() => {
    if (!initialValues) {
      return;
    }

    setFormValues(initialValues);
    setMediaFiles({ logo: null, favicon: null });
  }, [initialValues]);

  const hasDraftChanges = React.useMemo(() => {
    if (!initialValues || !formValues) {
      return false;
    }

    const scalarChanged = Object.keys(initialValues).some((key) => {
      if (IMAGE_FIELDS.some((field) => field.key === key)) {
        return false;
      }

      return (initialValues[key] ?? "") !== (formValues[key] ?? "");
    });

    return scalarChanged || Boolean(mediaFiles.logo || mediaFiles.favicon);
  }, [formValues, initialValues, mediaFiles]);

  const handleSave = React.useCallback(async () => {
    if (!formValues) {
      return;
    }

    const payload = new FormData();

    Object.entries(formValues).forEach(([key, value]) => {
      if (key === "logo" || key === "favicon") {
        return;
      }

      payload.append(key, value ?? "");
    });

    if (mediaFiles.logo?.file) {
      payload.append("logo", mediaFiles.logo.file);
    }

    if (mediaFiles.favicon?.file) {
      payload.append("favicon", mediaFiles.favicon.file);
    }

    try {
      const response = await updateStore({ payload }).unwrap();
      await refetch();
      toast.success(response?.message || response?.data?.message || "Store updated.");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update store.");
    }
  }, [formValues, mediaFiles, refetch, updateStore]);

  if (isLoading || !formValues) {
    return (
      <div className="space-y-4">
        <Title variant="lg">Storefront</Title>
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8">
          <Text>Loading store configuration...</Text>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <Title variant="lg">Storefront</Title>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
          <Text className="text-red-700">
            Failed to load store configuration.
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flbx items-start gap-4">
        <div>
          <Title variant="lg">Storefront</Title>
          <Text className="mt-2">
            Edit the store draft locally, then save everything together.
          </Text>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
            {hasDraftChanges ? "Unsaved changes" : "All changes saved"}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={resetDraft}
            disabled={!hasDraftChanges || isSaving}
          >
            Reset
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!hasDraftChanges || isSaving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className={SECTION_STYLES}>
            <div className="mb-6 flex items-start gap-3">
              <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
                <Palette className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Branding</h2>
                <Text className="mt-1">
                  Update colors and storefront assets before publishing changes.
                </Text>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="primary_color_picker"
                    className="text-sm font-medium text-slate-700"
                  >
                    Primary Color
                  </label>
                  <div className="flex gap-3">
                    <input
                      id="primary_color_picker"
                      type="color"
                      value={formValues.primary_color || "#000000"}
                      onChange={(event) =>
                        handleInputChange("primary_color", event.target.value)
                      }
                      className="h-12 w-14 rounded-xl border border-slate-300 bg-white p-1"
                    />
                    <FloatingInput
                      name="primary_color"
                      label="Primary Color"
                      value={formValues.primary_color}
                      onChange={(event) =>
                        handleInputChange("primary_color", event.target.value)
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="accent_color_picker"
                    className="text-sm font-medium text-slate-700"
                  >
                    Accent Color
                  </label>
                  <div className="flex gap-3">
                    <input
                      id="accent_color_picker"
                      type="color"
                      value={formValues.accent_color || "#000000"}
                      onChange={(event) =>
                        handleInputChange("accent_color", event.target.value)
                      }
                      className="h-12 w-14 rounded-xl border border-slate-300 bg-white p-1"
                    />
                    <FloatingInput
                      name="accent_color"
                      label="Accent Color"
                      value={formValues.accent_color}
                      onChange={(event) =>
                        handleInputChange("accent_color", event.target.value)
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {IMAGE_FIELDS.map((field) => (
                  <div
                    key={field.key}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="text-sm font-medium text-slate-800">{field.label}</p>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white">
                        {mediaPreview[field.key] ? (
                          <img
                            src={mediaPreview[field.key]}
                            alt={field.label}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <Upload className="h-7 w-7 text-slate-400" />
                        )}
                      </div>

                      <div className="flex-1">
                        <input
                          ref={(element) => {
                            fileInputRefs.current[field.key] = element;
                          }}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) =>
                            handleFileChange(field.key, event.target.files?.[0])
                          }
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRefs.current[field.key]?.click()}
                        >
                          {mediaPreview[field.key] ? "Change Image" : "Upload Image"}
                        </Button>
                        <Text className="mt-2 text-slate-500">{field.helper}</Text>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {visibleSections.map((section) => {
              const SectionIcon = section.icon;

              return (
                <div key={section.id} className={SECTION_STYLES}>
                  <div className="mb-6 flex items-start gap-3">
                    <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
                      <SectionIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        {section.title}
                      </h2>
                      <Text className="mt-1">{section.description}</Text>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {section.fields.map((field) => {
                      const value = formValues[field.key] ?? "";

                      if (field.component === "textarea") {
                        return (
                          <FloatingTextarea
                            key={field.key}
                            name={field.key}
                            label={field.label}
                            value={value}
                            onChange={(event) =>
                              handleInputChange(field.key, event.target.value)
                            }
                          />
                        );
                      }

                      if (field.component === "select") {
                        return (
                          <div key={field.key} className="space-y-2">
                            <label
                              htmlFor={field.key}
                              className="text-sm font-medium text-slate-700"
                            >
                              {field.label}
                            </label>
                            <Select
                              value={value}
                              onValueChange={(nextValue) =>
                                handleInputChange(field.key, nextValue)
                              }
                            >
                              <SelectTrigger id={field.key} className="h-12 rounded-xl">
                                <SelectValue placeholder={`Select ${field.label}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        );
                      }

                      return (
                        <FloatingInput
                          key={field.key}
                          name={field.key}
                          label={field.label}
                          type={field.type ?? "text"}
                          value={value}
                          onChange={(event) =>
                            handleInputChange(field.key, event.target.value)
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="xl:col-span-1">
          <div className={`${SECTION_STYLES} sticky top-6`}>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Store Preview</h2>
                <Text className="mt-1">Preview the current draft before saving.</Text>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex justify-center">
                {mediaPreview.logo ? (
                  <img
                    src={mediaPreview.logo}
                    alt="Store logo preview"
                    className="h-28 w-28 rounded-2xl border border-slate-200 bg-white object-contain"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white">
                    <Store className="h-10 w-10 text-slate-400" />
                  </div>
                )}
              </div>

              <div className="text-center">
                <h3
                  className="text-2xl font-semibold"
                  style={{ color: formValues.primary_color || "#0f172a" }}
                >
                  {formValues.name || "Store Name"}
                </h3>
                {formValues.tagline ? (
                  <p className="mt-1 text-sm text-slate-500">{formValues.tagline}</p>
                ) : null}
              </div>

              <div className="flex justify-center gap-3 border-t border-slate-200 pt-4">
                <div className="text-center">
                  <div
                    className="mb-2 h-10 w-10 rounded-xl border border-slate-200"
                    style={{ backgroundColor: formValues.primary_color || "#e2e8f0" }}
                  />
                  <span className="text-xs text-slate-500">Primary</span>
                </div>
                <div className="text-center">
                  <div
                    className="mb-2 h-10 w-10 rounded-xl border border-slate-200"
                    style={{ backgroundColor: formValues.accent_color || "#e2e8f0" }}
                  />
                  <span className="text-xs text-slate-500">Accent</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  className="w-full rounded-xl px-4 py-3 text-sm font-medium text-white"
                  style={{
                    backgroundColor: formValues.primary_color || "#0f172a",
                  }}
                >
                  Shop Now
                </button>
                <button
                  type="button"
                  className="w-full rounded-xl border px-4 py-3 text-sm font-medium"
                  style={{
                    borderColor: formValues.accent_color || "#cbd5e1",
                    color: formValues.accent_color || "#334155",
                    backgroundColor: "#fff",
                  }}
                >
                  Learn More
                </button>
              </div>

              {(formValues.email || formValues.phone || formValues.address) && (
                <div className="space-y-2 border-t border-slate-200 pt-4 text-sm text-slate-600">
                  {formValues.email ? <p>{formValues.email}</p> : null}
                  {formValues.phone ? <p>{formValues.phone}</p> : null}
                  {formValues.address ? <p>{formValues.address}</p> : null}
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
