import { Globe, Mail, Phone, Store } from "lucide-react";

export const FALLBACK_FIELD_KEYS = [
  "primary_color",
  "accent_color",
  "logo",
  "favicon",
  "email",
  "phone",
  "address",
  "facebook",
  "whatsapp",
  "instagram",
];

export const IMAGE_FIELDS = [
  { key: "logo", label: "Store Logo", helper: "Recommended: 400x400px, PNG or SVG" },
  { key: "favicon", label: "Favicon", helper: "Recommended: 32x32px or 64x64px, ICO or PNG" },
];

export const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "INR", label: "INR - Indian Rupee" },
];

export const TIMEZONE_OPTIONS = [
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

export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ja", label: "Japanese" },
  { value: "zh", label: "Chinese" },
];

export const STORE_IDENTITY_SECTION = {
  id: "identity",
  title: "Store Identity",
  description: "Core storefront information that customers will see first.",
  icon: Store,
  layoutClass: "xl:col-span-3",
  fields: [
    { key: "name", label: "Store Name", component: "input" },
    { key: "tagline", label: "Tagline", component: "input" },
    { key: "description", label: "Store Description", component: "textarea" },
  ],
};

export const CONTACT_INFORMATION_SECTION = {
  id: "contact",
  title: "Contact Information",
  description: "How customers can reach the store.",
  icon: Mail,
  layoutClass: "xl:col-span-1",
  fields: [
    { key: "email", label: "Email Address", type: "email", component: "input" },
    { key: "phone", label: "Phone Number", type: "tel", component: "input" },
    { key: "address", label: "Address", component: "textarea" },
  ],
};

export const STORE_CONFIGURATION_SECTION = {
  id: "configuration",
  title: "Store Configuration",
  description: "Regional settings used across the storefront.",
  icon: Globe,
  layoutClass: "xl:col-span-1",
  fields: [
    { key: "currency", label: "Currency", component: "select", options: CURRENCY_OPTIONS },
    { key: "timezone", label: "Timezone", component: "select", options: TIMEZONE_OPTIONS },
    { key: "language", label: "Language", component: "select", options: LANGUAGE_OPTIONS },
    { key: "tax", label: "Tax Rate", component: "input" },
  ],
};

export const SOCIAL_LINKS_SECTION = {
  id: "social",
  title: "Social Links",
  description: "Public social handles connected to the storefront.",
  icon: Phone,
  layoutClass: "xl:col-span-1",
  fields: [
    { key: "facebook", label: "Facebook", component: "input" },
    { key: "whatsapp", label: "WhatsApp", component: "input" },
    { key: "instagram", label: "Instagram", component: "input" },
  ],
};

export const FIELD_SECTIONS = [
  STORE_IDENTITY_SECTION,
  CONTACT_INFORMATION_SECTION,
  STORE_CONFIGURATION_SECTION,
  SOCIAL_LINKS_SECTION,
];

export const SECTION_STYLES =
  "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm";

export const getInitialDraft = (store) => ({
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

export const isAvailableFieldValue = (value) =>
  value !== null && value !== undefined && value !== "";

export const getVisibleSectionFields = (section, visibleFields) =>
  section.fields.filter((field) => visibleFields[field.key]);
