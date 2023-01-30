import {Button, ButtonProps, Modal} from "react-bootstrap";
import React from "react";
import {Trash3Fill} from "react-bootstrap-icons";

export interface ConfirmModalProps {
  title?: string;
  message?: string;
  onConfirm: () => void | Promise<void>;
  btnProps?: ButtonProps;
}

export const ConfirmModal = ({
  title = "Are you sure?",
  message = "This cannot be undone.",
  onConfirm,
  btnProps = {
    variant: "danger",
    children: <Trash3Fill aria-hidden="true" />,
    "aria-label": "Delete"
  }
}: ConfirmModalProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleClose = () => setIsOpen(false);
  const handleConfirm = async () => {
    await onConfirm();
    handleClose();
  };

  return (
    <>
      <Button {...btnProps} onClick={() => setIsOpen(true)} />

      <Modal show={isOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => void handleConfirm()}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
