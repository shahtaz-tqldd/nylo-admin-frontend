import { Eye, Store } from "lucide-react";

import { Text } from "@/components/ui/typography";
import { SECTION_STYLES } from "./store-config";

export const StorePreview = ({ formValues, mediaPreview }) => (
  <div className={`${SECTION_STYLES} xl:col-span-2`}>
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
      {/* Logo */}
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

      {/* Name + tagline */}
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

      {/* Color swatches */}
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

      {/* CTA buttons */}
      <div className="space-y-2 border-t border-slate-200 pt-4">
        <button
          type="button"
          className="w-full rounded-xl px-4 py-3 text-sm font-medium text-white"
          style={{ backgroundColor: formValues.primary_color || "#0f172a" }}
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

      {/* Contact details */}
      {(formValues.email || formValues.phone || formValues.address) && (
        <div className="space-y-2 border-t border-slate-200 pt-4 text-sm text-slate-600">
          {formValues.email ? <p>{formValues.email}</p> : null}
          {formValues.phone ? <p>{formValues.phone}</p> : null}
          {formValues.address ? <p>{formValues.address}</p> : null}
        </div>
      )}
    </div>
  </div>
);