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
    search: (params: unknown) => [...queryKeys.customer.all, 'search', params] as const,
    details: () => [...queryKeys.customer.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.customer.details(), id] as const,
    features: (id: number) => [...queryKeys.customer.all, 'features', id] as const,
    timeline: (id: number) => [...queryKeys.customer.all, 'timeline', id] as const,
    rfm: (id: number) => [...queryKeys.customer.all, 'rfm', id] as const,
    ltv: (id: number) => [...queryKeys.customer.all, 'ltv', id] as const,
    subscriptions: (id: number) => [...queryKeys.customer.all, 'subscriptions', id] as const,
    filter: (params: unknown) => [...queryKeys.customer.all, 'filter', params] as const,
    memo: (id: number) => [...queryKeys.customer.all, 'memo', id] as const,
  },

  // Dashboard
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
    consultCategories: () => [...queryKeys.dashboard.all, 'consultCategories'] as const,
    consultTimeStats: () => [...queryKeys.dashboard.all, 'consultTimeStats'] as const,
    outboundStats: () => [...queryKeys.dashboard.all, 'outboundStats'] as const,
    satisfactionStats: () => [...queryKeys.dashboard.all, 'satisfactionStats'] as const,
  },

  // Analysis
  analysis: {
    all: ['analysis'] as const,
    rfm: () => [...queryKeys.analysis.all, 'rfm'] as const,
    cohort: () => [...queryKeys.analysis.all, 'cohort'] as const,
    regional: () => [...queryKeys.analysis.all, 'regional'] as const,
  },

  // Channel
  channel: {
    all: ['channel'] as const,
    lists: () => [...queryKeys.channel.all, 'list'] as const,
    detail: (id: number) => [...queryKeys.channel.all, 'detail', id] as const,
    members: (id: number) => [...queryKeys.channel.all, 'members', id] as const,
  },
} as const;
