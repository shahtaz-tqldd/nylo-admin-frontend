import React from "react";
import { Palette, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/input";
import { Text } from "@/components/ui/typography";
import { IMAGE_FIELDS, SECTION_STYLES } from "./store-config";

// ─── Color picker + hex input pair ───────────────────────────────────────────

const ColorField = ({ id, label, value, onChange }) => (
  <div className="space-y-2">
    <label htmlFor={`${id}_picker`} className="text-sm font-medium text-slate-700">
      {label}
    </label>
    <div className="flex gap-3">
      <input
        id={`${id}_picker`}
        type="color"
        value={value || "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-14 rounded-xl border border-slate-300 bg-white p-1"
      />
      <FloatingInput
        name={id}
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
      />
    </div>
  </div>
);

// ─── Single image upload slot ─────────────────────────────────────────────────
// Each slot owns its own hidden file input ref — no ref forwarding needed.

const ImageUploadField = ({ field, previewUrl, onFileChange }) => {
  const inputRef = React.useRef(null);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-800">{field.label}</p>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white">
          {previewUrl ? (
            <img src={previewUrl} alt={field.label} className="h-full w-full object-contain" />
          ) : (
            <Upload className="h-7 w-7 text-slate-400" />
          )}
        </div>

        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFileChange(field.key, e.target.files?.[0])}
          />
          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
            {previewUrl ? "Change Image" : "Upload Image"}
          </Button>
          <Text className="mt-2 text-slate-500">{field.helper}</Text>
        </div>
      </div>
    </div>
  );
};

// ─── Branding section ─────────────────────────────────────────────────────────

export const BrandingSection = ({ formValues, mediaPreview, onInputChange, onFileChange }) => (
  <div className={`${SECTION_STYLES} xl:col-span-3`}>
    <div className="mb-6 flex items-start gap-3">
      <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
        <Palette className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Branding</h2>
        <Text className="mt-1">Update colors and storefront assets before publishing changes.</Text>
      </div>
    </div>

    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <ColorField
          id="primary_color"
          label="Primary Color"
          value={formValues.primary_color}
          onChange={(value) => onInputChange("primary_color", value)}
        />
        <ColorField
          id="accent_color"
          label="Accent Color"
          value={formValues.accent_color}
          onChange={(value) => onInputChange("accent_color", value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {IMAGE_FIELDS.map((field) => (
          <ImageUploadField
            key={field.key}
            field={field}
            previewUrl={mediaPreview[field.key]}
            onFileChange={onFileChange}
          />
        ))}
      </div>
    </div>
  </div>
);