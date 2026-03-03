import { create } from 'zustand';

export interface ToastType {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastStore {
  toasts: ToastType[];
  addToast: (toast: Omit<ToastType, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // 자동 제거
    const duration = toast.duration ?? 3000;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
}));

export const useToast = () => {
  const { addToast, removeToast, clearToasts } = useToastStore();

  const toast = {
    success: (title: string, description?: string, duration?: number) =>
      addToast({ title, description, variant: 'success', duration }),
    error: (title: string, description?: string, duration?: number) =>
      addToast({ title, description, variant: 'error', duration }),
    warning: (title: string, description?: string, duration?: number) =>
      addToast({ title, description, variant: 'warning', duration }),
    info: (title: string, description?: string, duration?: number) =>
      addToast({ title, description, variant: 'info', duration }),
    default: (title: string, description?: string, duration?: number) =>
      addToast({ title, description, variant: 'default', duration }),
  };

  return { toast, removeToast, clearToasts };
};
