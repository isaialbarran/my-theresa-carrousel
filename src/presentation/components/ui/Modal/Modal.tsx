import type { ReactNode } from "react";
import { useEffect } from "react";
import { cn } from "../../../utils/classNames";
import "./Modal.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  size?: "small" | "medium" | "large" | "fullscreen";
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

const Modal = ({
  isOpen,
  onClose,
  children,
  className = "",
  size = "medium",
  closeOnBackdropClick = true,
  closeOnEscape = true,
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };

  return (
    <div
      className={cn("modal", `modal--${size}`, className)}
      onClick={handleBackdropClick}
    >
      <div className="modal__backdrop" />
      <div className="modal__content">
        {children}
      </div>
    </div>
  );
};

export default Modal;
