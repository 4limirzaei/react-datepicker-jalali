import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "../options/click-outside";

type PropsType = {
  show: boolean;
  onClose: () => void;
  popperClassName?: string;
  triggerRef?: React.RefObject<HTMLElement>;
  children?: React.ReactNode;
};

export default function Popper({
  show,
  onClose,
  popperClassName,
  triggerRef,
  children,
}: PropsType) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => {
    onClose();
  });

  if (!show) return null;

  return (
    <div
      ref={dropdownRef}
      className={popperClassName || "datepicker-popper"}
      // style={{
      //   position: "absolute",
      //   top: 0,
      //   left: position.left,
      //   zIndex: 1000,
      // }}
    >
      {children}
    </div>
  );
}
