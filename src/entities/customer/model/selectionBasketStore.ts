import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Customer } from './types';

interface SelectionBasketState {
  selectedCustomers: Customer[];
  activeChannelId: number | null;
  isPanelOpen: boolean;
  addCustomer: (customer: Customer) => void;
  removeCustomer: (customerId: number) => void;
  addMultiple: (customers: Customer[]) => void;
  clearBasket: () => void;
  isSelected: (customerId: number) => boolean;
  getCount: () => number;
  setActiveChannel: (channelId: number | null) => void;
  setIsPanelOpen: (open: boolean) => void;
}

export const useSelectionBasket = create<SelectionBasketState>()(
  persist(
    (set, get) => ({
      selectedCustomers: [],
      activeChannelId: null,
      isPanelOpen: false,
      
      addCustomer: (customer) =>
        set((state) => {
          if (state.selectedCustomers.some((c) => c.id === customer.id)) {
            return state;
          }
          return { selectedCustomers: [...state.selectedCustomers, customer] };
        }),
      
      removeCustomer: (customerId) =>
        set((state) => ({
          selectedCustomers: state.selectedCustomers.filter((c) => c.id !== customerId),
        })),
      
      addMultiple: (customers) =>
        set((state) => {
          const existingIds = new Set(state.selectedCustomers.map((c) => c.id));
          const newCustomers = customers.filter((c) => !existingIds.has(c.id));
          return { selectedCustomers: [...state.selectedCustomers, ...newCustomers] };
        }),
      
      clearBasket: () => set({ selectedCustomers: [], activeChannelId: null, isPanelOpen: false }),
      
      isSelected: (customerId) => {
        return get().selectedCustomers.some((c) => c.id === customerId);
      },
      
      getCount: () => get().selectedCustomers.length,

      setActiveChannel: (channelId) => set({ activeChannelId: channelId }),

      setIsPanelOpen: (open) => set({ isPanelOpen: open }),
    }),
    {
      name: 'customer-selection-basket',
      partialize: (state) => ({
        selectedCustomers: state.selectedCustomers,
        activeChannelId: state.activeChannelId,
        isPanelOpen: state.isPanelOpen,
      }),
    }
  )
);

