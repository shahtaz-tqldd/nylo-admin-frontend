import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Text, Title } from "@/components/ui/typography";

export const StoreEditorHeader = ({
  title,
  description,
  hasChanges,
  isSaving,
  onReset,
  onSave,
  saveLabel = "Save Changes",
}) => (
  <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-start lg:justify-between">
    <div className="space-y-2">
      <Title variant="md">{title}</Title>
      <Text>{description}</Text>
    </div>

    <div className="flex flex-wrap items-center gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        disabled={!hasChanges || isSaving}
      >
        Reset
      </Button>
      <Button
        type="button"
        onClick={onSave}
        disabled={!hasChanges || isSaving}
        className="flex items-center gap-2"
      >
        <Save className="h-4 w-4" />
        {isSaving ? "Saving..." : saveLabel}
      </Button>
    </div>
  </div>
);
