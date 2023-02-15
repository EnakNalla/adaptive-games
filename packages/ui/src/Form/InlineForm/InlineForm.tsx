import {RegisterOptions, useForm} from "react-hook-form";
import {Button, ButtonProps, Form, InputGroup} from "react-bootstrap";

export interface InlineFormProps {
  id: string;
  label: string;
  showLabel?: boolean;
  onSubmit: (value: string) => void | Promise<void>;
  initialValue: string;
  validation?: RegisterOptions;
  className?: string;
  placeholder?: string;
  btnProps?: ButtonProps;
}

export const InlineForm = ({
  id,
  label,
  showLabel,
  onSubmit,
  initialValue,
  validation,
  className,
  placeholder,
  btnProps = {children: "Submit"}
}: InlineFormProps) => {
  const {
    register,
    handleSubmit,
    formState: {errors},
    setError,
    reset
  } = useForm({defaultValues: {value: initialValue}});

  const submitHandler = handleSubmit(async ({value}) => {
    try {
      await onSubmit(value);
      reset();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError("value", {type: "manual", message});
    }
  });

  return (
    <Form onSubmit={e => void submitHandler(e)} className={className}>
      <Form.Group controlId={id}>
        <Form.Label className={`${showLabel ? "" : "visually-hidden-focusable"}`}>
          {label}
        </Form.Label>
        <InputGroup hasValidation>
          <Form.Control
            {...register("value", validation)}
            isInvalid={!!errors?.value}
            placeholder={placeholder}
          />
          <Button {...btnProps} type="submit" />

          <Form.Control.Feedback type="invalid">{errors?.value?.message}</Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
    </Form>
  );
};
