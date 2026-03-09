---
description: "CRM 대시보드 프로젝트에서 자주 사용되는 작업 패턴: 페이지/위젯 추가, API 연동, 차트/폼/테이블 구현 등"
---

# CRM 대시보드 프로젝트 스킬

이 문서는 CRM 어드민 대시보드 프로젝트에서 자주 사용되는 작업 패턴과 스킬을 정의합니다.

---

## 1. 새 페이지 추가하기

새로운 페이지를 추가할 때는 다음 단계를 따릅니다:

### 단계:
1. `src/pages/[페이지명]/` 폴더 생성
2. `[페이지명]Page.tsx` 파일 생성
3. `DashboardLayout`으로 감싸기
4. `src/routes.tsx`에 라우트 추가
5. 필요시 `src/shared/constants/routes.ts`에 경로 상수 추가

### 예시:
```typescript
// src/pages/reports/ReportsPage.tsx
import { DashboardLayout } from '@/widgets/dashboard-layout';

const ReportsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">리포트</h1>
        {/* 페이지 콘텐츠 */}
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
```

```typescript
// src/routes.tsx에 추가
import ReportsPage from '@/pages/reports/ReportsPage';

{
  path: '/reports',
  element: <ProtectedRoute><ReportsPage /></ProtectedRoute>,
}
```

---

## 2. 새 위젯 컴포넌트 추가하기

재사용 가능한 복합 컴포넌트를 추가할 때:

### 구조:
```
src/widgets/
└── [위젯명]/
    ├── ui/
    │   └── [위젯명].tsx
    └── index.ts (선택사항)
```

### 규칙:
- 위젯은 여러 페이지에서 재사용 가능해야 함
- props로 데이터를 받아서 렌더링
- 비즈니스 로직은 최소화 (표시 로직만)
- `@/shared/ui` 컴포넌트 활용

### 예시:
```typescript
// src/widgets/stats-card/ui/StatsCard.tsx
import { Card, CardContent } from '@/shared/ui';

interface Props {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatsCard = ({ title, value, trend }: Props) => {
  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
        {trend && (
          <span className={trend.isPositive ? 'text-green-600' : 'text-red-600'}>
            {trend.value}%
          </span>
        )}
      </CardContent>
    </Card>
  );
};
```

---

## 3. shadcn/ui 컴포넌트 추가 및 커스터마이징

### 새 컴포넌트 추가:
```bash
# 1. shadcn CLI로 생성
npx shadcn@latest add [component-name]

# 2. 생성된 파일을 shared/ui로 이동
# components/ui/[component].tsx → src/shared/ui/[component].tsx

# 3. 프로젝트 스타일에 맞게 커스터마이징
```

### 커스터마이징 가이드:
- 색상: 프로젝트 색상 시스템 사용 (primary, secondary 등)
- 크기: 프로젝트 일관성 유지
- 애니메이션: 기존 컴포넌트와 동일한 transition 사용

### 예시:
```typescript
// src/shared/ui/switch.tsx 커스터마이징
const switchVariants = cva(
  "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "data-[state=checked]:bg-primary-600 data-[state=unchecked]:bg-gray-200",
        success: "data-[state=checked]:bg-success-600 data-[state=unchecked]:bg-gray-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
```

---

## 4. API 연동하기 (TanStack Query 사용)

### 구조:
```
src/entities/[도메인]/
├── api/
│   └── [도메인]Api.ts          # API 함수
└── model/
    ├── types.ts                # 타입 정의
    └── use[도메인]Queries.ts   # Query 훅
```

### 단계:
1. 타입 정의 (`model/types.ts`)
2. API 함수 작성 (`api/[도메인]Api.ts`)
3. Query 훅 작성 (`model/use[도메인]Queries.ts`)
4. Feature에서 Mutation 훅 작성 (필요시)

### 예시 - Query (데이터 조회):
```typescript
// entities/customer/model/types.ts
export interface Customer {
  id: number;
  name: string;
  email: string;
}

// entities/customer/api/customerApi.ts
import axiosInstance from '@/shared/lib/axios/instance';
import type { Customer } from '../model/types';

export const customerApi = {
  getList: async (params: { page: number; size: number }): Promise<Customer[]> => {
    const response = await axiosInstance.get('/api/customers', { params });
    return response.data;
  },
  
  getById: async (id: number): Promise<Customer> => {
    const response = await axiosInstance.get(`/api/customers/${id}`);
    return response.data;
  },
};

// entities/customer/model/useCustomerQueries.ts
import { useQuery } from '@tanstack/react-query';
import { customerApi } from '../api/customerApi';
import { queryKeys } from '@/shared/constants';

export const useCustomerList = (params: { page: number; size: number }) => {
  return useQuery({
    queryKey: queryKeys.customer.list(params),
    queryFn: () => customerApi.getList(params),
  });
};

export const useCustomer = (id: number, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.customer.detail(id),
    queryFn: () => customerApi.getById(id),
    enabled, // 조건부 실행
  });
};

// 컴포넌트에서 사용
import { useCustomerList } from '@/entities/customer';

const CustomersPage = () => {
  const { data, isLoading, error } = useCustomerList({ page: 1, size: 10 });

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생</div>;

  return <div>{data?.map(customer => ...)}</div>;
};
```

### 예시 - Mutation (데이터 변경):
```typescript
// features/customer/create-customer/model/useCreateCustomer.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerApi } from '@/entities/customer/api/customerApi';
import { queryKeys } from '@/shared/constants';
import { useToast } from '@/shared/hooks';

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateCustomerRequest) => customerApi.create(data),
    onSuccess: () => {
      // 고객 목록 쿼리 무효화 (자동 리페치)
      queryClient.invalidateQueries({
        queryKey: queryKeys.customer.lists(),
      });
      toast.success('고객이 추가되었습니다.');
    },
    onError: (error) => {
      toast.error('고객 추가에 실패했습니다.');
    },
  });
};

// 컴포넌트에서 사용
import { useCreateCustomer } from '@/features/customer/create-customer';

const CreateCustomerForm = () => {
  const { mutate, isPending } = useCreateCustomer();

  const handleSubmit = (data) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 폼 필드 */}
      <Button type="submit" disabled={isPending}>
        {isPending ? '추가 중...' : '추가'}
      </Button>
    </form>
  );
};
```

### Query Key 관리:
```typescript
// shared/constants/queryKeys.ts에서 중앙 관리
export const queryKeys = {
  customer: {
    all: ['customer'] as const,
    lists: () => [...queryKeys.customer.all, 'list'] as const,
    list: (params: Record<string, unknown>) => [...queryKeys.customer.lists(), params] as const,
    detail: (id: number) => [...queryKeys.customer.all, 'detail', id] as const,
  },
};
```

### TanStack Query 장점:
- 자동 캐싱 및 리페칭
- 로딩/에러 상태 자동 관리
- 낙관적 업데이트 지원
- DevTools로 디버깅 용이
- 서버 상태와 클라이언트 상태 분리

---

## 5. Zustand 스토어 추가하기

**주의**: Zustand는 UI 상태 관리에만 사용하세요. 서버 데이터는 TanStack Query를 사용합니다.

### 위치:
```
src/entities/[도메인]/model/store.ts
```

### 사용 사례:
- UI 상태 (모달 열림/닫힘, 탭 선택 등)
- 폼 상태 (임시 저장)
- 전역 UI 설정 (테마, 언어 등)
- 인증 상태 (토큰, 사용자 정보)

### 패턴:
```typescript
// entities/filter/model/store.ts
import { create } from 'zustand';

interface FilterState {
  searchTerm: string;
  status: string | null;
  dateRange: { start: Date; end: Date } | null;
  setSearchTerm: (term: string) => void;
  setStatus: (status: string | null) => void;
  setDateRange: (range: { start: Date; end: Date } | null) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchTerm: '',
  status: null,
  dateRange: null,
  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatus: (status) => set({ status }),
  setDateRange: (range) => set({ dateRange: range }),
  resetFilters: () => set({ searchTerm: '', status: null, dateRange: null }),
}));
```

---

## 6. 차트 컴포넌트 추가하기

### 라이브러리:
- Chart.js + react-chartjs-2

### 패턴:
```typescript
// widgets/revenue-chart/ui/RevenueChart.tsx
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card, CardContent } from '@/shared/ui';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface Props {
  data: {
    labels: string[];
    values: number[];
  };
}

export const RevenueChart = ({ data }: Props) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: '매출',
        data: data.values,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
      tooltip: {
        callbacks: {
          label: (ctx: { parsed: { y: number } }) => `${ctx.parsed.y.toLocaleString()}원`,
        },
      },
    },
  };

  return (
    <Card>
      <CardContent className="p-5">
        <h4 className="mb-3 text-base font-bold">매출 추이</h4>
        <div style={{ height: '220px' }}>
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};
```

---

## 7. 폼 처리하기

### 패턴:
```typescript
// features/customer/create-customer/ui/CreateCustomerForm.tsx
import { useState } from 'react';
import { Button, Input, FormField, Label } from '@/shared/ui';
import { useToast } from '@/shared/hooks';

interface FormData {
  name: string;
  email: string;
  phone: string;
}

export const CreateCustomerForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // API 호출
      await customerApi.create(formData);
      showToast({ message: '고객이 추가되었습니다.', type: 'success' });
      onSuccess();
    } catch (error) {
      showToast({ message: '고객 추가에 실패했습니다.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField>
        <Label htmlFor="name">이름</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </FormField>
      
      <FormField>
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </FormField>
      
      <Button type="submit" isLoading={isLoading}>
        추가
      </Button>
    </form>
  );
};
```

---

## 8. 모달/다이얼로그 사용하기

### 패턴:
```typescript
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button } from '@/shared/ui';

export const CustomerActions = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        고객 추가
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 고객 추가</DialogTitle>
          </DialogHeader>
          <CreateCustomerForm onSuccess={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};
```

---

## 9. 테이블 구현하기

### 패턴:
```typescript
// widgets/data-table/ui/DataTable.tsx
import { Badge, Button } from '@/shared/ui';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends { id: string }>({ data, columns, onRowClick }: Props<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-4 py-3 text-left text-sm font-semibold">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className="cursor-pointer border-b border-gray-100 hover:bg-gray-50"
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-sm">
                  {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 10. 반응형 레이아웃 구현하기

### Tailwind 브레이크포인트:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### 패턴:
```typescript
// 모바일: 1열, 태블릿: 2열, 데스크톱: 4열
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
  <MetricCard />
  <MetricCard />
  <MetricCard />
  <MetricCard />
</div>

// 모바일: 세로 스택, 데스크톱: 가로 배치
<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
  <h1>제목</h1>
  <Button>액션</Button>
</div>
```

---

## 체크리스트

새 기능 추가 시 확인사항:

- [ ] FSD 아키텍처 규칙 준수
- [ ] Import 경로가 `@/shared/ui`, `@/entities`, `@/features`, `@/widgets` 사용
- [ ] TypeScript 타입 정의 완료
- [ ] 에러 처리 구현 (try-catch, toast 메시지)
- [ ] 로딩 상태 처리
- [ ] 서버 데이터는 TanStack Query 사용 (useQuery/useMutation)
- [ ] UI 상태는 Zustand 사용
- [ ] Query Key는 `queryKeys.ts`에서 관리
- [ ] 반응형 디자인 적용
- [ ] 접근성 고려 (ARIA 속성, 키보드 네비게이션)
- [ ] 프로젝트 색상 시스템 사용
- [ ] 빌드 에러 없음 (`npm run build`)
- [ ] 타입 체크 통과 (`npm run type-check`)

---

**마지막 업데이트**: 2024-03-05
