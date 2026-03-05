# TanStack Query 사용 가이드

## 개요

이 프로젝트는 TanStack Query v5를 사용하여 서버 상태를 관리합니다.

## 설정

### QueryClient 설정
- 위치: `src/shared/lib/react-query/queryClient.ts`
- 기본 옵션:
  - `staleTime`: 5분 (데이터가 신선한 상태로 유지되는 시간)
  - `gcTime`: 10분 (캐시가 메모리에 유지되는 시간)
  - `refetchOnWindowFocus`: false (창 포커스 시 자동 리페치 비활성화)
  - `retry`: 쿼리 1회, 뮤테이션 0회

### Provider
`src/App.tsx`에서 `QueryClientProvider`로 앱을 감싸고 있습니다.

## Query Keys

Query Key는 `src/shared/constants/queryKeys.ts`에서 중앙 관리합니다.

```typescript
import { queryKeys } from '@/shared/constants';

// 사용 예시
queryKeys.customer.list({ page: 1, size: 10 });
queryKeys.customer.detail(123);
```

### Query Key 구조
- `customer.all`: ['customer']
- `customer.lists()`: ['customer', 'list']
- `customer.list(params)`: ['customer', 'list', params]
- `customer.detail(id)`: ['customer', 'detail', id]

## 사용 방법

### 1. Query (데이터 조회)

#### Entity 레벨에서 Query 훅 정의
```typescript
// src/entities/customer/model/useCustomerQueries.ts
import { useQuery } from '@tanstack/react-query';
import { customerApi } from '../api/customerApi';
import { queryKeys } from '@/shared/constants';

export const useCustomerList = (params) => {
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
```

#### 컴포넌트에서 사용
```typescript
import { useCustomerList } from '@/entities/customer';

const CustomersPage = () => {
  const { data, isLoading, error, refetch } = useCustomerList({
    page: 1,
    size: 10,
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;

  return (
    <div>
      {data?.items.map((customer) => (
        <div key={customer.id}>{customer.name}</div>
      ))}
    </div>
  );
};
```

### 2. Mutation (데이터 변경)

#### Feature 레벨에서 Mutation 훅 정의
```typescript
// src/features/auth/login/model/useLoginMutation.ts
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/shared/api/auth';

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: (response) => {
      setAuth(response);
      showToast({ message: '로그인 성공', type: 'success' });
      navigate('/dashboard');
    },
    onError: (error) => {
      showToast({ message: error.message, type: 'error' });
    },
  });
};
```

#### 컴포넌트에서 사용
```typescript
import { useLoginMutation } from '@/features/auth/login';

const LoginForm = () => {
  const { mutate, isPending } = useLoginMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" />
      <input type="password" />
      <button disabled={isPending}>
        {isPending ? '로그인 중...' : '로그인'}
      </button>
    </form>
  );
};
```

### 3. 캐시 무효화 (Invalidation)

데이터 변경 후 관련 쿼리를 다시 가져오려면:

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants';

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => customerApi.create(data),
    onSuccess: () => {
      // 고객 목록 쿼리 무효화 (자동 리페치)
      queryClient.invalidateQueries({
        queryKey: queryKeys.customer.lists(),
      });
    },
  });
};
```

### 4. 낙관적 업데이트 (Optimistic Update)

```typescript
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => customerApi.update(id, data),
    onMutate: async ({ id, data }) => {
      // 진행 중인 리페치 취소
      await queryClient.cancelQueries({
        queryKey: queryKeys.customer.detail(id),
      });

      // 이전 데이터 백업
      const previous = queryClient.getQueryData(queryKeys.customer.detail(id));

      // 낙관적 업데이트
      queryClient.setQueryData(queryKeys.customer.detail(id), (old) => ({
        ...old,
        ...data,
      }));

      return { previous };
    },
    onError: (err, variables, context) => {
      // 에러 시 롤백
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.customer.detail(variables.id),
          context.previous,
        );
      }
    },
    onSettled: (data, error, variables) => {
      // 성공/실패 관계없이 리페치
      queryClient.invalidateQueries({
        queryKey: queryKeys.customer.detail(variables.id),
      });
    },
  });
};
```

## 폴더 구조

```
src/
├── shared/
│   ├── lib/
│   │   └── react-query/
│   │       ├── queryClient.ts    # QueryClient 설정
│   │       └── index.ts
│   └── constants/
│       └── queryKeys.ts          # Query Key 관리
│
├── entities/
│   └── {domain}/
│       ├── api/                  # API 함수
│       └── model/
│           └── use{Domain}Queries.ts  # Query 훅
│
└── features/
    └── {domain}/
        └── {feature}/
            └── model/
                └── use{Feature}Mutation.ts  # Mutation 훅
```

## DevTools

개발 환경에서 React Query DevTools를 사용할 수 있습니다.
- 화면 왼쪽 하단의 TanStack 로고 클릭
- 쿼리 상태, 캐시 데이터, 리페치 등 확인 가능

## 마이그레이션 가이드

### 기존 useState 패턴 → TanStack Query

**Before:**
```typescript
const [data, setData] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await api.getData();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };
  fetchData();
}, []);
```

**After:**
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['data'],
  queryFn: () => api.getData(),
});
```

## 참고 자료

- [TanStack Query 공식 문서](https://tanstack.com/query/latest)
- [Query Keys 가이드](https://tanstack.com/query/latest/docs/react/guides/query-keys)
- [Mutations 가이드](https://tanstack.com/query/latest/docs/react/guides/mutations)
