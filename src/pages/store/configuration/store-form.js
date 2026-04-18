import React from "react";
import toast from "react-hot-toast";

import {
  useStoreDetailsQuery,
  useUpdateStoreMutation,
} from "@/features/store/storeApiSlice";
import {
  FALLBACK_FIELD_KEYS,
  IMAGE_FIELDS,
  getInitialDraft,
  isAvailableFieldValue,
} from "./store-config";

export const useStoreForm = () => {
  const { data, isLoading, isError, refetch } = useStoreDetailsQuery();
  const [updateStore, { isLoading: isSaving }] = useUpdateStoreMutation();

  const store = React.useMemo(() => data?.data ?? data ?? null, [data]);

  const previewUrlsRef = React.useRef([]);
  const [initialValues, setInitialValues] = React.useState(null);
  const [formValues, setFormValues] = React.useState(null);
  const [mediaFiles, setMediaFiles] = React.useState({ logo: null, favicon: null });

  // Sync form state when store data arrives or changes
  React.useEffect(() => {
    if (!store) return;
    const nextDraft = getInitialDraft(store);
    setInitialValues(nextDraft);
    setFormValues(nextDraft);
    setMediaFiles({ logo: null, favicon: null });
  }, [store]);

  // Revoke all blob URLs on unmount to avoid memory leaks
  React.useEffect(
    () => () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );

  // Derive which fields/sections are visible based on store data
  const visibleFields = React.useMemo(() => {
    if (!store) return {};
    return Object.fromEntries(
      Object.keys(store).map((key) => [
        key,
        isAvailableFieldValue(store[key]) || FALLBACK_FIELD_KEYS.includes(key),
      ]),
    );
  }, [store]);

  // Resolve preview URLs: prefer in-memory blob, fall back to server URL
  const mediaPreview = React.useMemo(
    () => ({
      logo:
        mediaFiles.logo?.previewUrl ??
        (typeof formValues?.logo === "string" ? formValues.logo : null),
      favicon:
        mediaFiles.favicon?.previewUrl ??
        (typeof formValues?.favicon === "string" ? formValues.favicon : null),
    }),
    [formValues, mediaFiles],
  );

  const hasDraftChanges = React.useMemo(() => {
    if (!initialValues || !formValues) return false;

    const scalarChanged = Object.keys(initialValues).some((key) => {
      if (IMAGE_FIELDS.some((f) => f.key === key)) return false;
      return (initialValues[key] ?? "") !== (formValues[key] ?? "");
    });

    return scalarChanged || Boolean(mediaFiles.logo || mediaFiles.favicon);
  }, [formValues, initialValues, mediaFiles]);

  const handleInputChange = React.useCallback((key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleFileChange = React.useCallback((key, file) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    previewUrlsRef.current.push(previewUrl);

    setMediaFiles((prev) => {
      // Revoke the previous blob for this slot to free memory
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
    if (!initialValues) return;
    setFormValues(initialValues);
    setMediaFiles({ logo: null, favicon: null });
  }, [initialValues]);

  const handleSave = React.useCallback(async () => {
    if (!formValues) return;

    const payload = new FormData();

    Object.entries(formValues).forEach(([key, value]) => {
      if (key === "logo" || key === "favicon") return;
      payload.append(key, value ?? "");
    });

    if (mediaFiles.logo?.file) payload.append("logo", mediaFiles.logo.file);
    if (mediaFiles.favicon?.file) payload.append("favicon", mediaFiles.favicon.file);

    try {
      const response = await updateStore({ payload }).unwrap();
      await refetch();
      toast.success(response?.message || response?.data?.message || "Store updated.");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update store.");
    }
  }, [formValues, mediaFiles, refetch, updateStore]);

  return {
    // Query state
    isLoading,
    isError,
    // Form state
    formValues,
    mediaPreview,
    hasDraftChanges,
    isSaving,
    visibleFields,
    // Handlers
    handleInputChange,
    handleFileChange,
    resetDraft,
    handleSave,
  };
};
