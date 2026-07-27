import { useEffect } from "react";

// Sets document.title while a component is mounted and restores it after.
export function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} · Lumen` : "Lumen — Considered goods";
    return () => {
      document.title = previous;
    };
  }, [title]);
}

export default useDocumentTitle;
