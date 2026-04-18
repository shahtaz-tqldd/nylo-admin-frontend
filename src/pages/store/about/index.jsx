import React from "react";
import toast from "react-hot-toast";
import { FileText, GalleryVerticalEnd, ImageIcon, Trophy } from "lucide-react";

import { FloatingInput } from "@/components/ui/input";
import { FloatingTextarea } from "@/components/ui/textarea";
import {
  useAboutPageContentQuery,
  useUpdateAboutPageContentMutation,
} from "@/features/store/storeApiSlice";

import { StoreEditorHeader } from "../shared/editor-header";
import {
  StoreEditorErrorState,
  StoreEditorLoadingState,
} from "../shared/editor-states";
import { ImageUploadField } from "../shared/image-upload-field";

const ABOUT_IMAGE_FIELDS = [
  {
    key: "cover_image",
    label: "Cover Image",
    helper: "Hero banner image shown at the top of the page.",
  },
  {
    key: "store_image",
    label: "Store Image",
    helper: "Main supporting store photo for the story section.",
  },
  {
    key: "detail_1_image",
    label: "Detail Image 1",
    helper: "Supporting image for the first detail item.",
  },
  {
    key: "detail_2_image",
    label: "Detail Image 2",
    helper: "Supporting image for the second detail item.",
  },
  {
    key: "detail_3_image",
    label: "Detail Image 3",
    helper: "Supporting image for the third detail item.",
  },
];

const ABOUT_DEFAULTS = {
  cover_image: null,
  left_text_content: "",
  right_text_content: "",
  store_image: null,
  story_title: "",
  story_content: "",
  served_customer_count: "",
  sold_count: "",
  styles_count: "",
  detail_section_title: "",
  detail_1_image: null,
  detail_1_title: "",
  detail_2_image: null,
  detail_2_title: "",
  detail_3_image: null,
  detail_3_title: "",
};

const toAboutDraft = (aboutPage) => ({
  cover_image: aboutPage?.cover_image ?? null,
  left_text_content: aboutPage?.left_text_content ?? "",
  right_text_content: aboutPage?.right_text_content ?? "",
  store_image: aboutPage?.store_image ?? null,
  story_title: aboutPage?.story_title ?? "",
  story_content: aboutPage?.story_content ?? "",
  served_customer_count: `${aboutPage?.served_customer_count ?? ""}`,
  sold_count: `${aboutPage?.sold_count ?? ""}`,
  styles_count: `${aboutPage?.styles_count ?? ""}`,
  detail_section_title: aboutPage?.detail_section_title ?? "",
  detail_1_image: aboutPage?.detail_1_image ?? null,
  detail_1_title: aboutPage?.detail_1_title ?? "",
  detail_2_image: aboutPage?.detail_2_image ?? null,
  detail_2_title: aboutPage?.detail_2_title ?? "",
  detail_3_image: aboutPage?.detail_3_image ?? null,
  detail_3_title: aboutPage?.detail_3_title ?? "",
});

const getAboutPayloadValue = (value) =>
  value === null || value === undefined ? "" : value;

const normalizeAboutResponse = (response) => response?.data ?? response ?? null;

const buildAboutMediaPreview = (formValues, mediaFiles) =>
  ABOUT_IMAGE_FIELDS.reduce((acc, field) => {
    acc[field.key] =
      mediaFiles[field.key]?.previewUrl ??
      (typeof formValues?.[field.key] === "string"
        ? formValues[field.key]
        : null);
    return acc;
  }, {});

const AboutSection = ({ icon, title, description, children, className }) => {
  const SectionIcon = icon;

  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}
    >
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

const useAboutPageForm = () => {
  const { data, isLoading, isError, refetch } = useAboutPageContentQuery();
  const [updateAboutPageContent, { isLoading: isSaving }] =
    useUpdateAboutPageContentMutation();

  const aboutPage = React.useMemo(() => normalizeAboutResponse(data), [data]);
  const previewUrlsRef = React.useRef([]);
  const [initialValues, setInitialValues] = React.useState(ABOUT_DEFAULTS);
  const [formValues, setFormValues] = React.useState(ABOUT_DEFAULTS);
  const [mediaFiles, setMediaFiles] = React.useState(
    ABOUT_IMAGE_FIELDS.reduce(
      (acc, field) => ({ ...acc, [field.key]: null }),
      {},
    ),
  );

  React.useEffect(() => {
    const nextDraft = toAboutDraft(aboutPage);
    setInitialValues(nextDraft);
    setFormValues(nextDraft);
    setMediaFiles(
      ABOUT_IMAGE_FIELDS.reduce(
        (acc, field) => ({ ...acc, [field.key]: null }),
        {},
      ),
    );
  }, [aboutPage]);

  React.useEffect(
    () => () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );

  const mediaPreview = React.useMemo(
    () => buildAboutMediaPreview(formValues, mediaFiles),
    [formValues, mediaFiles],
  );

  const hasDraftChanges = React.useMemo(() => {
    const scalarChanged = Object.keys(initialValues).some((key) => {
      if (ABOUT_IMAGE_FIELDS.some((field) => field.key === key)) return false;
      return (initialValues[key] ?? "") !== (formValues[key] ?? "");
    });

    const mediaChanged = ABOUT_IMAGE_FIELDS.some((field) =>
      Boolean(mediaFiles[field.key]),
    );
    return scalarChanged || mediaChanged;
  }, [formValues, initialValues, mediaFiles]);

  const handleInputChange = React.useCallback((key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleFileChange = React.useCallback((key, file) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    previewUrlsRef.current.push(previewUrl);

    setMediaFiles((prev) => {
      if (prev[key]?.previewUrl) {
        URL.revokeObjectURL(prev[key].previewUrl);
        previewUrlsRef.current = previewUrlsRef.current.filter(
          (url) => url !== prev[key].previewUrl,
        );
      }

      return { ...prev, [key]: { file, previewUrl } };
    });

    setFormValues((prev) => ({ ...prev, [key]: previewUrl }));
  }, []);

  const resetDraft = React.useCallback(() => {
    setFormValues(initialValues);
    setMediaFiles(
      ABOUT_IMAGE_FIELDS.reduce(
        (acc, field) => ({ ...acc, [field.key]: null }),
        {},
      ),
    );
  }, [initialValues]);

  const handleSave = React.useCallback(async () => {
    const payload = new FormData();

    Object.entries(formValues).forEach(([key, value]) => {
      if (ABOUT_IMAGE_FIELDS.some((field) => field.key === key)) return;
      payload.append(key, getAboutPayloadValue(value));
    });

    ABOUT_IMAGE_FIELDS.forEach((field) => {
      if (mediaFiles[field.key]?.file) {
        payload.append(field.key, mediaFiles[field.key].file);
      }
    });

    try {
      const response = await updateAboutPageContent({ payload }).unwrap();
      await refetch();
      toast.success(
        response?.message || response?.data?.message || "About page updated.",
      );
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update about page.");
    }
  }, [formValues, mediaFiles, refetch, updateAboutPageContent]);

  return {
    formValues,
    mediaPreview,
    isLoading,
    isError,
    isSaving,
    hasDraftChanges,
    handleInputChange,
    handleFileChange,
    handleSave,
    resetDraft,
  };
};

const StoreAboutPage = () => {
  const {
    formValues,
    mediaPreview,
    isLoading,
    isError,
    isSaving,
    hasDraftChanges,
    handleInputChange,
    handleFileChange,
    handleSave,
    resetDraft,
  } = useAboutPageForm();

  if (isLoading) {
    return <StoreEditorLoadingState message="Loading about page content..." />;
  }

  if (isError) {
    return (
      <StoreEditorErrorState message="Failed to load about page content." />
    );
  }

  return (
    <div className="space-y-6">
      <StoreEditorHeader
        title="About Us"
        description="Update the brand story, trust metrics, and detail sections shown on the storefront About page."
        hasChanges={hasDraftChanges}
        isSaving={isSaving}
        onReset={resetDraft}
        onSave={handleSave}
      />

      <div className="space-y-6">
        <AboutSection
          icon={GalleryVerticalEnd}
          title="Hero Content"
          description="Set the top banner image and the split text content."
        >
          <div className="space-y-4">
            <ImageUploadField
              name="cover_image"
              label="Cover Image"
              helper="Wide hero image for the About page header."
              previewUrl={mediaPreview.cover_image}
              onFileChange={handleFileChange}
            />
            <div className="grid gap-4 lg:grid-cols-2">
              <FloatingTextarea
                name="left_text_content"
                label="Left Text Content"
                value={formValues.left_text_content}
                onChange={(event) =>
                  handleInputChange("left_text_content", event.target.value)
                }
              />
              <FloatingTextarea
                name="right_text_content"
                label="Right Text Content"
                value={formValues.right_text_content}
                onChange={(event) =>
                  handleInputChange("right_text_content", event.target.value)
                }
              />
            </div>
          </div>
        </AboutSection>
        <div className="flex gap-5">
          <AboutSection
            icon={FileText}
            title="Story Section"
            className="flex-1"
            description="Control the main story block and its supporting store image."
          >
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="space-y-4">
                <FloatingInput
                  name="story_title"
                  label="Story Title"
                  value={formValues.story_title}
                  onChange={(event) =>
                    handleInputChange("story_title", event.target.value)
                  }
                />
                <FloatingTextarea
                  name="story_content"
                  label="Story Content"
                  rows={8}
                  value={formValues.story_content}
                  onChange={(event) =>
                    handleInputChange("story_content", event.target.value)
                  }
                />
              </div>
              <ImageUploadField
                name="store_image"
                label="Store Image"
                helper="Used beside the story content."
                previewUrl={mediaPreview.store_image}
                onFileChange={handleFileChange}
              />
            </div>
          </AboutSection>

          <AboutSection
            icon={Trophy}
            title="Store Metrics"
            description="Numbers that communicate traction and catalog depth."
            className="max-w-sm w-full"
          >
            <div className="space-y-4">
              <FloatingInput
                name="served_customer_count"
                label="Served Customer Count"
                type="number"
                value={formValues.served_customer_count}
                onChange={(event) =>
                  handleInputChange("served_customer_count", event.target.value)
                }
              />
              <FloatingInput
                name="sold_count"
                label="Sold Count"
                type="number"
                value={formValues.sold_count}
                onChange={(event) =>
                  handleInputChange("sold_count", event.target.value)
                }
              />
              <FloatingInput
                name="styles_count"
                label="Styles Count"
                type="number"
                value={formValues.styles_count}
                onChange={(event) =>
                  handleInputChange("styles_count", event.target.value)
                }
              />
            </div>
          </AboutSection>
        </div>

        <AboutSection
          icon={ImageIcon}
          title="Detail Highlights"
          description="Manage the three detail items that reinforce the brand message."
        >
          <div className="space-y-4">
            <FloatingInput
              name="detail_section_title"
              label="Detail Section Title"
              value={formValues.detail_section_title}
              onChange={(event) =>
                handleInputChange("detail_section_title", event.target.value)
              }
            />
            <div className="grid gap-4 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <ImageUploadField
                    name={`detail_${item}_image`}
                    label={`Detail ${item} Image`}
                    helper={`Visual for detail item ${item}.`}
                    previewUrl={mediaPreview[`detail_${item}_image`]}
                    onFileChange={handleFileChange}
                  />
                  <FloatingInput
                    name={`detail_${item}_title`}
                    label={`Detail ${item} Title`}
                    value={formValues[`detail_${item}_title`]}
                    onChange={(event) =>
                      handleInputChange(
                        `detail_${item}_title`,
                        event.target.value,
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </AboutSection>
      </div>

      <div className="space-y-6"></div>
    </div>
  );
};

export default StoreAboutPage;
