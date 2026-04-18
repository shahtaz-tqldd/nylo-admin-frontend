import { Phone } from "lucide-react";

import { Text } from "@/components/ui/typography";

import {
  SECTION_STYLES,
  SOCIAL_LINKS_SECTION,
  getVisibleSectionFields,
} from "./store-config";
import { SectionFields } from "./store-fields";

export const SocialLinksSection = ({
  formValues,
  visibleFields,
  onInputChange,
}) => {
  const fields = getVisibleSectionFields(SOCIAL_LINKS_SECTION, visibleFields);

  if (fields.length === 0) return null;

  return (
    <div className={`${SECTION_STYLES} ${SOCIAL_LINKS_SECTION.layoutClass}`}>
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
          <Phone className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {SOCIAL_LINKS_SECTION.title}
          </h2>
          <Text className="mt-1">{SOCIAL_LINKS_SECTION.description}</Text>
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
