import { Store } from "lucide-react";

import { Text } from "@/components/ui/typography";

import { SectionFields } from "./store-fields";
import {
  SECTION_STYLES,
  STORE_IDENTITY_SECTION,
  getVisibleSectionFields,
} from "./store-config";

export const StoreIdentity = ({ formValues, visibleFields, onInputChange }) => {
  const fields = getVisibleSectionFields(STORE_IDENTITY_SECTION, visibleFields);

  if (fields.length === 0) return null;

  return (
    <div className={`${SECTION_STYLES} ${STORE_IDENTITY_SECTION.layoutClass}`}>
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
          <Store className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {STORE_IDENTITY_SECTION.title}
          </h2>
          <Text className="mt-1">{STORE_IDENTITY_SECTION.description}</Text>
        </div>
      </div>

      <SectionFields
        fields={fields}
        formValues={formValues}
        onInputChange={onInputChange}
      />
    </div>
  );
};
