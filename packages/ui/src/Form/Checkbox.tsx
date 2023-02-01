import {useController} from "react-hook-form";
import {Form} from "react-bootstrap";

export interface CheckboxProps {
  name: string;
  label: string;
  className?: string;
}

export const Checkbox = ({name, label, className}: CheckboxProps) => {
  const {field} = useController({name});

  return (
    <Form.Group controlId={name} className={className}>
      <Form.Check {...field} label={label} checked={field.value as boolean} />
    </Form.Group>
  );
};
