import { Mail } from "lucide-react";

import { Text } from "@/components/ui/typography";

import {
  CONTACT_INFORMATION_SECTION,
  SECTION_STYLES,
  getVisibleSectionFields,
} from "./store-config";
import { SectionFields } from "./store-fields";

export const ContactInformationSection = ({
  formValues,
  visibleFields,
  onInputChange,
}) => {
  const fields = getVisibleSectionFields(CONTACT_INFORMATION_SECTION, visibleFields);

  if (fields.length === 0) return null;

  return (
    <div className={`${SECTION_STYLES} ${CONTACT_INFORMATION_SECTION.layoutClass}`}>
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {CONTACT_INFORMATION_SECTION.title}
          </h2>
          <Text className="mt-1">{CONTACT_INFORMATION_SECTION.description}</Text>
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
