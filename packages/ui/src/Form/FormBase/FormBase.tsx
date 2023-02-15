import {DeepPartial, FormProvider, useForm} from "react-hook-form";
import {ReactNode, useState} from "react";
import {Form, Spinner} from "react-bootstrap";

export interface FormProps<T> {
  defaultValues: T;
  onSubmit: (data: T) => void | Promise<void>;
  children: ReactNode;
  className?: string;
}

export const FormBase = <T,>({defaultValues, onSubmit, children, className}: FormProps<T>) => {
  const [error, setError] = useState<string | null>(null);
  const methods = useForm({defaultValues: defaultValues as DeepPartial<T>});

  const handleSubmit = methods.handleSubmit(async data => {
    try {
      setError(null);
      await onSubmit(data as T);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(message);
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="d-grid">
        <Form
          onSubmit={e => void handleSubmit(e)}
          style={{
            gridArea: "1/1",
            opacity: methods.formState.isSubmitting ? 0.5 : 1
          }}
          className={className}
        >
          {error && <div className="alert alert-danger">{error}</div>}
          {children}
        </Form>
        {methods.formState.isSubmitting && (
          <div
            style={{
              gridArea: "1/1",
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Spinner animation="border" role="status" style={{width: "3rem", height: "3rem"}}>
              <span className="visually-hidden">Submitting...</span>
            </Spinner>
          </div>
        )}
      </div>
    </FormProvider>
  );
};
