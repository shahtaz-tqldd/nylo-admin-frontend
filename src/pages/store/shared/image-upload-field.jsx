import React from "react";
import { ImagePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/typography";

export const ImageUploadField = ({
  name,
  label,
  helper,
  previewUrl,
  onFileChange,
  className = "",
}) => {
  const inputRef = React.useRef(null);

  return (
    <div className={`rounded-2xl border border-slate-200 bg-slate-50 p-4 ${className}`}>
      <p className="text-sm font-medium text-slate-800">{label}</p>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white sm:w-32">
          {previewUrl ? (
            <img src={previewUrl} alt={label} className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-7 w-7 text-slate-400" />
          )}
        </div>

        <div className="space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => onFileChange(name, event.target.files?.[0])}
          />
          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
            {previewUrl ? "Change Image" : "Upload Image"}
          </Button>
          {helper ? <Text className="text-slate-500">{helper}</Text> : null}
        </div>
      </div>
    </div>
  );
};
