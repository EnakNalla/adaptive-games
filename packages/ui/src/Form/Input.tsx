import {type RegisterOptions, useController} from "react-hook-form";
import {Form, InputGroup} from "react-bootstrap";
import {type HTMLInputTypeAttribute} from "react";

export interface InputProps {
  name: string;
  validation?: RegisterOptions;
  label?: string;
  className?: string;
  type?: HTMLInputTypeAttribute;
  hint?: string;
  inline?: boolean;
}

export const Input = ({name, validation, label, className, type, hint, inline}: InputProps) => {
  const {
    field,
    fieldState: {error, invalid}
  } = useController({name, rules: validation});

  if (inline)
    return (
      <>
        <InputGroup hasValidation={!!validation} className={className}>
          <InputGroup.Text id={`${label}-text`}>{label}</InputGroup.Text>
          <Form.Control
            {...field}
            isInvalid={invalid}
            type={type}
            aria-label={label}
            aria-describedby={`${label}-text`}
          />
          <Form.Control.Feedback type="invalid">{error?.message}</Form.Control.Feedback>
        </InputGroup>
        {hint && <Form.Text className="text-muted">{hint}</Form.Text>}
      </>
    );

  return (
    <Form.Group controlId={name} className={className}>
      <Form.Label>{label}</Form.Label>
      <Form.Control {...field} isInvalid={invalid} type={type} />
      {hint && <Form.Text className="text-muted">{hint}</Form.Text>}
      <Form.Control.Feedback type="invalid">{error?.message}</Form.Control.Feedback>
    </Form.Group>
  );
};
