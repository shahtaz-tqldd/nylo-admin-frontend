import { Text } from "@/components/ui/typography";

export const StoreEditorLoadingState = ({ message }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 shadow-sm">
    <Text>{message}</Text>
  </div>
);

export const StoreEditorErrorState = ({ message }) => (
  <div className="rounded-2xl border border-red-200 bg-red-50 p-8 shadow-sm">
    <Text className="text-red-700">{message}</Text>
  </div>
);
