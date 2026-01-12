import { Modal, Button } from "react-bootstrap";
import "animate.css";

function ConfirmDeleteModal({
  show,
  onClose,
  onConfirm,
  loading,
  title = "Confirmar eliminación",
  message,
}) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      contentClassName="animate__animated animate__zoomIn"
    >
      <Modal.Header closeButton={!loading}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{message}</Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? "Borrando..." : "Borrar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmDeleteModal;
