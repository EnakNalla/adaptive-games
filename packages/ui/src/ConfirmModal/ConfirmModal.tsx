import {Alert, Button, type ButtonProps, Modal} from "react-bootstrap";
import React from "react";
import {Trash3Fill} from "react-bootstrap-icons";

export interface ConfirmModalProps {
  title?: string;
  message?: string;
  onConfirm: () => void | Promise<void>;
  btnProps?: ButtonProps;
}

const btnPropDefaults: ButtonProps = {
  variant: "danger",
  children: <Trash3Fill aria-hidden="true" />,
  "aria-label": "Delete"
};

export const ConfirmModal = ({
  title = "Are you sure?",
  message = "This cannot be undone.",
  onConfirm,
  btnProps
}: ConfirmModalProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const handleClose = () => setIsOpen(false);
  const handleConfirm = async () => {
    try {
      await onConfirm();
      handleClose();
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  return (
    <>
      <Button {...{...btnPropDefaults, ...btnProps}} onClick={() => setIsOpen(true)} />

      <Modal show={isOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger mb-2">{error}</Alert>}
          {message}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" onClick={() => void handleConfirm()} type="button">
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
