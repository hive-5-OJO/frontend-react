export interface User {
  adminId: string;
  email: string;
  role: string;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  joinedAt: string;
  service?: string;
  period?: string;
  consultFrequency?: 'high' | 'medium' | 'low' | number | string;
  consultCategory?: string;
  isVip?: boolean;
  isNewCustomer?: boolean;
}
