import React from "react";
import { Modal } from "antd";

interface AdminModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}

const AdminModal: React.FC<AdminModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  title,
  message,
}) => {
  return (
    <Modal
      width={340}
      title={<div className="logout-modal-title">{title}</div>}
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Yes"
      cancelText="Cancel"
      centered
      className="logout-confirm-modal"
    >
      <p className="logout-modal-message">{message}</p>
    </Modal>
  );
};

export default AdminModal;
