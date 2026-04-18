import { FloatingInput } from "@/components/ui/input";
import { FloatingTextarea } from "@/components/ui/textarea";
import { FloatingSelect, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const InputField = ({ field, value, onChange }) => (
  <FloatingInput
    name={field.key}
    label={field.label}
    type={field.type ?? "text"}
    value={value}
    onChange={(e) => onChange(field.key, e.target.value)}
  />
);

export const TextareaField = ({ field, value, onChange }) => (
  <FloatingTextarea
    name={field.key}
    label={field.label}
    value={value}
    onChange={(e) => onChange(field.key, e.target.value)}
  />
);

export const SelectField = ({ field, value, onChange }) => (
  <FloatingSelect
    label={field.label}
    value={value}
    onValueChange={(next) => onChange(field.key, next)}
    placeholder={`Select ${field.label}`}
  >
    {field.options.map((option) => (
      <SelectItem key={option.value} value={option.value}>
        {option.label}
      </SelectItem>
    ))}
  </FloatingSelect>
);

const FIELD_RENDERERS = {
  input: InputField,
  textarea: TextareaField,
  select: SelectField,
};

export const SectionFields = ({
  fields,
  formValues,
  onInputChange,
  className,
}) => (
  <div className={cn("space-y-4", className)}>
    {fields.map((field) => {
      const Renderer = FIELD_RENDERERS[field.component] ?? InputField;
      return (
        <Renderer
          key={field.key}
          field={field}
          value={formValues[field.key] ?? ""}
          onChange={onInputChange}
        />
      );
    })}
  </div>
);
