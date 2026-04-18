import React from "react";
import toast from "react-hot-toast";
import { CircleHelp, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/input";
import { FloatingTextarea } from "@/components/ui/textarea";
import {
  useCreateFaqsMutation,
  useDeleteFaqMutation,
  useFaqListQuery,
  useUpdateFaqMutation,
} from "@/features/store/storeApiSlice";

import {
  StoreEditorErrorState,
  StoreEditorLoadingState,
} from "../shared/editor-states";

const EMPTY_FAQ = {
  id: null,
  question: "",
  answer: "",
  isNew: true,
};

const normalizeFaqResponse = (response) => {
  const raw = response?.data ?? response ?? [];

  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.results)) return raw.results;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
};

const toFaqDrafts = (items) =>
  items.map((faq) => ({
    id: faq?.id ?? null,
    question: faq?.question ?? "",
    answer: faq?.answer ?? "",
    isNew: false,
  }));

const isFaqChanged = (draft, original) =>
  (draft?.question ?? "") !== (original?.question ?? "") ||
  (draft?.answer ?? "") !== (original?.answer ?? "");

const FaqCard = ({
  faq,
  canReset,
  isSaving,
  isDeleting,
  onChange,
  onReset,
  onSave,
  onDelete,
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
          <CircleHelp className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-900">
            {faq.isNew ? "New FAQ" : "FAQ Entry"}
          </h2>
          <p className="text-sm text-slate-500">
            Add a concise question and a clear customer-facing answer.
          </p>
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        className="text-red-600 hover:bg-red-50 hover:text-red-700"
        onClick={onDelete}
        disabled={isSaving || isDeleting}
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </div>

    <div className="space-y-4">
      <FloatingInput
        name={`question-${faq.id ?? "new"}`}
        label="Question"
        value={faq.question}
        onChange={(event) => onChange("question", event.target.value)}
      />
      <FloatingTextarea
        name={`answer-${faq.id ?? "new"}`}
        label="Answer"
        rows={6}
        value={faq.answer}
        onChange={(event) => onChange("answer", event.target.value)}
      />
    </div>

    <div className="mt-6 flex flex-wrap justify-end gap-3">
      <Button type="button" variant="outline" onClick={onReset} disabled={!canReset || isSaving}>
        Reset
      </Button>
      <Button type="button" onClick={onSave} disabled={isSaving || isDeleting}>
        {isSaving ? "Saving..." : faq.isNew ? "Create FAQ" : "Save FAQ"}
      </Button>
    </div>
  </div>
);

const StoreFaqPage = () => {
  const { data, isLoading, isError, refetch } = useFaqListQuery();
  const [createFaqs] = useCreateFaqsMutation();
  const [updateFaq] = useUpdateFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();

  const [drafts, setDrafts] = React.useState([]);
  const [originalDrafts, setOriginalDrafts] = React.useState([]);
  const [savingIds, setSavingIds] = React.useState([]);
  const [deletingIds, setDeletingIds] = React.useState([]);

  const faqs = React.useMemo(() => toFaqDrafts(normalizeFaqResponse(data)), [data]);

  React.useEffect(() => {
    setDrafts(faqs);
    setOriginalDrafts(faqs);
  }, [faqs]);

  const updateDraft = React.useCallback((faqId, key, value) => {
    setDrafts((prev) =>
      prev.map((item) => (item.id === faqId ? { ...item, [key]: value } : item)),
    );
  }, []);

  const handleAddFaq = React.useCallback(() => {
    const tempId = `new-${Date.now()}`;
    const nextFaq = { ...EMPTY_FAQ, id: tempId };
    setDrafts((prev) => [nextFaq, ...prev]);
    setOriginalDrafts((prev) => [nextFaq, ...prev]);
  }, []);

  const handleReset = React.useCallback(
    (faqId) => {
      const original = originalDrafts.find((item) => item.id === faqId);
      if (!original) return;

      setDrafts((prev) => prev.map((item) => (item.id === faqId ? original : item)));
    },
    [originalDrafts],
  );

  const handleSave = React.useCallback(
    async (faq) => {
      if (!faq.question.trim() || !faq.answer.trim()) {
        toast.error("Question and answer are required.");
        return;
      }

      setSavingIds((prev) => [...prev, faq.id]);

      try {
        if (faq.isNew) {
          const response = await createFaqs({
            payload: { question: faq.question.trim(), answer: faq.answer.trim() },
          }).unwrap();
          toast.success(response?.message || response?.data?.message || "FAQ created.");
        } else {
          const response = await updateFaq({
            faqId: faq.id,
            payload: { question: faq.question.trim(), answer: faq.answer.trim() },
          }).unwrap();
          toast.success(response?.message || response?.data?.message || "FAQ updated.");
        }

        await refetch();
      } catch (error) {
        toast.error(error?.data?.message || "Failed to save FAQ.");
      } finally {
        setSavingIds((prev) => prev.filter((item) => item !== faq.id));
      }
    },
    [createFaqs, refetch, updateFaq],
  );

  const handleDelete = React.useCallback(
    async (faq) => {
      if (faq.isNew) {
        setDrafts((prev) => prev.filter((item) => item.id !== faq.id));
        setOriginalDrafts((prev) => prev.filter((item) => item.id !== faq.id));
        return;
      }

      setDeletingIds((prev) => [...prev, faq.id]);

      try {
        const response = await deleteFaq({ faqId: faq.id }).unwrap();
        toast.success(response?.message || response?.data?.message || "FAQ deleted.");
        await refetch();
      } catch (error) {
        toast.error(error?.data?.message || "Failed to delete FAQ.");
      } finally {
        setDeletingIds((prev) => prev.filter((item) => item !== faq.id));
      }
    },
    [deleteFaq, refetch],
  );

  if (isLoading) {
    return <StoreEditorLoadingState message="Loading FAQs..." />;
  }

  if (isError) {
    return <StoreEditorErrorState message="Failed to load FAQs." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-slate-900">FAQs</h1>
          <p className="text-sm text-slate-500">
            Maintain the storefront question and answer list one entry at a time.
          </p>
        </div>

        <Button type="button" onClick={handleAddFaq} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add FAQ
        </Button>
      </div>

      <div className="space-y-4">
        {drafts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 shadow-sm">
            <p className="text-sm text-slate-500">No FAQs yet. Create the first one.</p>
          </div>
        ) : null}

        {drafts.map((faq) => {
          const original = originalDrafts.find((item) => item.id === faq.id) ?? EMPTY_FAQ;
          const canReset = faq.isNew
            ? Boolean(faq.question || faq.answer)
            : isFaqChanged(faq, original);

          return (
            <FaqCard
              key={faq.id}
              faq={faq}
              canReset={canReset}
              isSaving={savingIds.includes(faq.id)}
              isDeleting={deletingIds.includes(faq.id)}
              onChange={(key, value) => updateDraft(faq.id, key, value)}
              onReset={() => handleReset(faq.id)}
              onSave={() => handleSave(faq)}
              onDelete={() => handleDelete(faq)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StoreFaqPage;
