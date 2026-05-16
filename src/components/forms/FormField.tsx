import { cloneElement, isValidElement, useId, type ReactNode, type ReactElement } from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
}

export function FormField({ label, error, required, htmlFor, children }: FormFieldProps) {
  const autoId = useId();
  const fieldId = htmlFor ?? autoId;

  // Inject id onto first valid child if it doesn't already have one
  let renderedChildren: ReactNode = children;
  if (isValidElement(children)) {
    const child = children as ReactElement<{ id?: string }>;
    if (!child.props.id) {
      renderedChildren = cloneElement(child, { id: fieldId });
    }
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {renderedChildren}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}