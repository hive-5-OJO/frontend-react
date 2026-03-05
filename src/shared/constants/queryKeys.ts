/**
 * Query Key Factory
 * TanStack Query의 쿼리 키를 중앙에서 관리
 */

export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },

  // Customer
  customer: {
    all: ['customer'] as const,
    lists: () => [...queryKeys.customer.all, 'list'] as const,
    list: (params: unknown) => [...queryKeys.customer.lists(), params] as const,
    details: () => [...queryKeys.customer.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.customer.details(), id] as const,
  },

  // Dashboard
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
  },

  // Analysis
  analysis: {
    all: ['analysis'] as const,
    rfm: () => [...queryKeys.analysis.all, 'rfm'] as const,
    cohort: () => [...queryKeys.analysis.all, 'cohort'] as const,
    regional: () => [...queryKeys.analysis.all, 'regional'] as const,
  },
} as const;
