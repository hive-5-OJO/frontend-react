import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Customer } from './types';

interface SelectionBasketState {
  selectedCustomers: Customer[];
  addCustomer: (customer: Customer) => void;
  removeCustomer: (customerId: number) => void;
  addMultiple: (customers: Customer[]) => void;
  clearBasket: () => void;
  isSelected: (customerId: number) => boolean;
  getCount: () => number;
}

export const useSelectionBasket = create<SelectionBasketState>()(
  persist(
    (set, get) => ({
      selectedCustomers: [],
      
      addCustomer: (customer) =>
        set((state) => {
          // 중복 방지
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
      
      clearBasket: () => set({ selectedCustomers: [] }),
      
      isSelected: (customerId) => {
        return get().selectedCustomers.some((c) => c.id === customerId);
      },
      
      getCount: () => get().selectedCustomers.length,
    }),
    {
      name: 'customer-selection-basket', // localStorage 키 이름
      partialize: (state) => ({ selectedCustomers: state.selectedCustomers }), // 저장할 상태만 선택
    }
  )
);

