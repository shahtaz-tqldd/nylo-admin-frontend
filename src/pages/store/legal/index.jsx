import React from "react";
import toast from "react-hot-toast";
import { FileCheck2, ShieldCheck } from "lucide-react";

import { FloatingTextarea } from "@/components/ui/textarea";
import {
  useLegalContentQuery,
  useUpdateLegalContentMutation,
} from "@/features/store/storeApiSlice";

import { StoreEditorHeader } from "../shared/editor-header";
import {
  StoreEditorErrorState,
  StoreEditorLoadingState,
} from "../shared/editor-states";

const LEGAL_DEFAULTS = {
  privacy_policy: "",
  terms_and_conditions: "",
};

const LegalSection = ({ icon, title, description, children }) => {
  const SectionIcon = icon;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
          <SectionIcon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
};

const normalizeLegalResponse = (response) => response?.data ?? response ?? null;

const useLegalContentForm = () => {
  const { data, isLoading, isError, refetch } = useLegalContentQuery();
  const [updateLegalContent, { isLoading: isSaving }] = useUpdateLegalContentMutation();

  const legalContent = React.useMemo(() => normalizeLegalResponse(data), [data]);
  const [initialValues, setInitialValues] = React.useState(LEGAL_DEFAULTS);
  const [formValues, setFormValues] = React.useState(LEGAL_DEFAULTS);

  React.useEffect(() => {
    const nextDraft = {
      privacy_policy: legalContent?.privacy_policy ?? "",
      terms_and_conditions: legalContent?.terms_and_conditions ?? "",
    };

    setInitialValues(nextDraft);
    setFormValues(nextDraft);
  }, [legalContent]);

  const hasDraftChanges = React.useMemo(
    () =>
      Object.keys(initialValues).some(
        (key) => (initialValues[key] ?? "") !== (formValues[key] ?? ""),
      ),
    [formValues, initialValues],
  );

  const handleInputChange = React.useCallback((key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetDraft = React.useCallback(() => {
    setFormValues(initialValues);
  }, [initialValues]);

  const handleSave = React.useCallback(async () => {
    try {
      const response = await updateLegalContent({ payload: formValues }).unwrap();
      await refetch();
      toast.success(response?.message || response?.data?.message || "Legal content updated.");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update legal content.");
    }
  }, [formValues, refetch, updateLegalContent]);

  return {
    formValues,
    isLoading,
    isError,
    isSaving,
    hasDraftChanges,
    handleInputChange,
    handleSave,
    resetDraft,
  };
};

const StoreLegalPage = () => {
  const {
    formValues,
    isLoading,
    isError,
    isSaving,
    hasDraftChanges,
    handleInputChange,
    handleSave,
    resetDraft,
  } = useLegalContentForm();

  if (isLoading) {
    return <StoreEditorLoadingState message="Loading legal content..." />;
  }

  if (isError) {
    return <StoreEditorErrorState message="Failed to load legal content." />;
  }

  return (
    <div className="space-y-6">
      <StoreEditorHeader
        title="Legal Content"
        description="Maintain the privacy policy and terms content customers see across the storefront."
        hasChanges={hasDraftChanges}
        isSaving={isSaving}
        onReset={resetDraft}
        onSave={handleSave}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <LegalSection
          icon={ShieldCheck}
          title="Privacy Policy"
          description="Update the full privacy policy body."
        >
          <FloatingTextarea
            name="privacy_policy"
            label="Privacy Policy"
            rows={18}
            value={formValues.privacy_policy}
            onChange={(event) => handleInputChange("privacy_policy", event.target.value)}
          />
        </LegalSection>

        <LegalSection
          icon={FileCheck2}
          title="Terms & Conditions"
          description="Update the terms and conditions shown to customers."
        >
          <FloatingTextarea
            name="terms_and_conditions"
            label="Terms & Conditions"
            rows={18}
            value={formValues.terms_and_conditions}
            onChange={(event) =>
              handleInputChange("terms_and_conditions", event.target.value)
            }
          />
        </LegalSection>
      </div>
    </div>
  );
};

export default StoreLegalPage;
