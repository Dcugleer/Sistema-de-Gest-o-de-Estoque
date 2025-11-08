import { useState } from "react";

export type Toast = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  [key: string]: any;
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function addToast(toast: Toast) {
    setToasts((prev) => [...prev, { ...toast, id: toast.id || Date.now().toString() }]);
  }

  function removeToast(id: string) {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }

  return {
    toasts,
    addToast,
    removeToast,
  };
}
