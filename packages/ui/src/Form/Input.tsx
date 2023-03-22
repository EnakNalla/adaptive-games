import {type RegisterOptions, useController} from "react-hook-form";
import {Form} from "react-bootstrap";
import {type HTMLInputTypeAttribute} from "react";

export interface InputProps {
  name: string;
  validation?: RegisterOptions;
  label?: string;
  className?: string;
  type?: HTMLInputTypeAttribute;
  hint?: string;
}

export const Input = ({name, validation, label, className, type, hint}: InputProps) => {
  const {
    field,
    fieldState: {error, invalid}
  } = useController({name, rules: validation});

  return (
    <Form.Group controlId={name} className={className}>
      <Form.Label>{label}</Form.Label>
      <Form.Control {...field} isInvalid={invalid} type={type} />
      {hint && <Form.Text className="text-muted">{hint}</Form.Text>}
      <Form.Control.Feedback type="invalid">{error?.message}</Form.Control.Feedback>
    </Form.Group>
  );
};
