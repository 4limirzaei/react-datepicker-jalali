import { useEffect } from "react";

export function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        ref.current?.children[0] &&
        !ref.current.children[0].contains(event.target as Node)
      ) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}
