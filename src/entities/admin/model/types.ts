export interface Admin {
  adminId: number;
  name: string;
  email: string;
  phone: string;
  google: boolean;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminListResponse {
  content: Admin[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    unpaged: boolean;
  };
  size: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  totalElements: number;
  totalPages: number;
}
