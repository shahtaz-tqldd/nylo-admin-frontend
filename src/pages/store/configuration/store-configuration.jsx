import { Globe } from "lucide-react";

import { Text } from "@/components/ui/typography";

import {
  SECTION_STYLES,
  STORE_CONFIGURATION_SECTION,
  getVisibleSectionFields,
} from "./store-config";
import { SectionFields } from "./store-fields";

export const StoreConfigurationSection = ({
  formValues,
  visibleFields,
  onInputChange,
}) => {
  const fields = getVisibleSectionFields(
    STORE_CONFIGURATION_SECTION,
    visibleFields,
  );

  if (fields.length === 0) return null;

  return (
    <div
      className={`${SECTION_STYLES} ${STORE_CONFIGURATION_SECTION.layoutClass}`}
    >
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
          <Globe className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {STORE_CONFIGURATION_SECTION.title}
          </h2>
          <Text className="mt-1">
            {STORE_CONFIGURATION_SECTION.description}
          </Text>
        </div>
      </div>

      <SectionFields
        fields={fields}
        formValues={formValues}
        onInputChange={onInputChange}
        className="grid grid-cols-2 gap-4"
      />
    </div>
  );
};
