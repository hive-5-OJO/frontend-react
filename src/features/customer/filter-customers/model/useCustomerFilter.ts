import { useState } from 'react';

export interface CustomerFilters {
  isVip?: boolean | null;
  service?: string | null;
  consultCategory?: string | null;
  consultFrequency?: string | null;
}

export const useCustomerFilter = () => {
  const [filters, setFilters] = useState<CustomerFilters>({});

  const updateFilter = (key: keyof CustomerFilters, value: CustomerFilters[typeof key]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== null && v !== undefined);

  return { filters, setFilters, updateFilter, clearFilters, hasActiveFilters };
};
