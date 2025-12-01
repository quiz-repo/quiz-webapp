import React from "react";
import { Modal } from "antd";

interface ConfirmModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  title,
  message,
}) => {
  return (
    <Modal
      width={300}
      title={<span className="text-white items-center flex flex-col">{title}</span>}
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Yes"
      cancelText="Cancel"
      centered
      className="custom-dark-modal"

      // 🔥 React 19 Fix
      // motion={false}
    >
      <p className="text-white flex flex-col items-center">{message}</p>
    </Modal>
  );
};

export default ConfirmModal;
