import { useEffect, useRef } from "react";
import { useClickOutside } from "../options/click-outside";

type PropsType = {
  show: boolean;
  onClose: () => void;
  dialogClassName?: string;
  children?: React.ReactNode;
};

export default function Dialog({
  show,
  onClose,
  dialogClassName,
  children,
}: PropsType) {
  const datePickerModal = useRef<HTMLDialogElement>(null);

  useClickOutside(datePickerModal, () => {
    onClose();
  });

  useEffect(() => {
    if (show) {
      datePickerModal.current?.showModal();
    } else {
      datePickerModal.current?.close();
    }
  }, [show]);

  return (
    <dialog
      ref={datePickerModal}
      className={dialogClassName || "datepicker-dialog"}
    >
      {children}
    </dialog>
  );
}
