import {type RegisterOptions, useController} from "react-hook-form";
import {Form} from "react-bootstrap";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps {
  name: string;
  label: string;
  options: SelectOption[];
  validation?: RegisterOptions;
  className?: string;
}

export const Select = ({name, label, options, validation, className}: SelectProps) => {
  const {
    field,
    fieldState: {error, invalid}
  } = useController({name, rules: validation});

  return (
    <Form.Group controlId={name} className={className}>
      <Form.Label>{label}</Form.Label>
      <Form.Select {...field} isInvalid={invalid}>
        {options.map(({label, value}) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Form.Select>
      <Form.Control.Feedback type="invalid">{error?.message}</Form.Control.Feedback>
    </Form.Group>
  );
};
