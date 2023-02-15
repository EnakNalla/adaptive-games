import {FormProps} from "../FormBase";
import {DeepPartial, FormProvider, useForm} from "react-hook-form";
import {useState} from "react";
import {Button, ButtonProps, Form, Modal, Spinner} from "react-bootstrap";

interface ModalFormProps<T> extends FormProps<T> {
  btnProps: ButtonProps;
  title: string;
}

export const ModalForm = <T,>({
  defaultValues,
  onSubmit,
  children,
  className,
  btnProps,
  title
}: ModalFormProps<T>) => {
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const methods = useForm({defaultValues: defaultValues as DeepPartial<T>});

  const handleSubmit = methods.handleSubmit(async data => {
    try {
      await onSubmit(data as T);
      setIsOpen(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  });

  return (
    <>
      <Button {...btnProps} type="button" onClick={() => setIsOpen(true)} />

      <FormProvider {...methods}>
        <Modal show={isOpen} onHide={() => setIsOpen(false)}>
          <Modal.Header closeButton>{title}</Modal.Header>
          <div className="d-grid">
            <Form
              style={{
                gridArea: "1/1",
                opacity: methods.formState.isSubmitting ? 0.5 : 1
              }}
              className={className}
              onSubmit={e => void handleSubmit(e)}
            >
              <Modal.Body>
                {error && <div className="alert alert-danger">{error}</div>}
                {children}

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
                    <Spinner
                      animation="border"
                      role="status"
                      style={{width: "3rem", height: "3rem"}}
                    >
                      <span className="visually-hidden">Submitting...</span>
                    </Spinner>
                  </div>
                )}
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" type="button" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </Modal.Footer>
            </Form>
          </div>
        </Modal>
      </FormProvider>
    </>
  );
};
