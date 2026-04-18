import { Text } from "@/components/ui/typography";

import { useStoreForm } from "./store-form";
import { StorePageHeader } from "./header";
import { BrandingSection } from "./branding";
import { ContactInformationSection } from "./contact-information";
import { StorePreview } from "./preview";
import { SocialLinksSection } from "./social-links";
import { StoreConfigurationSection } from "./store-configuration";
import { StoreIdentity } from "./store-identity";

const LoadingState = () => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 shadow-sm">
    <Text>Loading store configuration...</Text>
  </div>
);

const ErrorState = () => (
  <div className="rounded-2xl border border-red-200 bg-red-50 p-8 shadow-sm">
    <Text className="text-red-700">Failed to load store configuration.</Text>
  </div>
);

const StoreConfigurationPage = () => {
  const {
    isLoading,
    isError,
    formValues,
    mediaPreview,
    hasDraftChanges,
    isSaving,
    visibleFields,
    handleInputChange,
    handleFileChange,
    resetDraft,
    handleSave,
  } = useStoreForm();

  if (isLoading || !formValues) return <LoadingState />;
  if (isError) return <ErrorState />;

  return (
    <div className="space-y-6">
      <StorePageHeader
        title="Store Configuration"
        description="Update the main storefront identity, branding assets, and regional settings."
        hasDraftChanges={hasDraftChanges}
        isSaving={isSaving}
        onReset={resetDraft}
        onSave={handleSave}
      />

      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="flex-1 space-y-5">
          <StoreIdentity
            formValues={formValues}
            visibleFields={visibleFields}
            onInputChange={handleInputChange}
          />
          <BrandingSection
            formValues={formValues}
            mediaPreview={mediaPreview}
            onInputChange={handleInputChange}
            onFileChange={handleFileChange}
          />

          <ContactInformationSection
            formValues={formValues}
            visibleFields={visibleFields}
            onInputChange={handleInputChange}
          />
          <StoreConfigurationSection
            formValues={formValues}
            visibleFields={visibleFields}
            onInputChange={handleInputChange}
          />
          <SocialLinksSection
            formValues={formValues}
            visibleFields={visibleFields}
            onInputChange={handleInputChange}
          />
        </div>

        <div className="w-full xl:max-w-md">
          <div className="xl:sticky xl:top-4">
            <StorePreview formValues={formValues} mediaPreview={mediaPreview} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreConfigurationPage;
