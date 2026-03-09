# 프로젝트 가이드

## 프로젝트 개요

**프로젝트명**: CRM 어드민 대시보드  
**기술 스택**: React 18 + TypeScript + Vite + TailwindCSS + shadcn/ui  
**아키텍처**: Feature-Sliced Design (FSD)  
**상태 관리**: Zustand  
**라우팅**: React Router v6  
**UI 라이브러리**: shadcn/ui (Radix UI 기반)

## 프로젝트 특징

- **내부 관리자용 대시보드**: 로그인 후에만 접근 가능한 백오피스
- **SEO 불필요**: 검색 엔진 최적화가 필요 없는 내부 시스템
- **백엔드 분리**: API 서버가 별도로 존재하며 REST API로 통신
- **반응형 디자인**: 다양한 화면 크기 지원
- **접근성 준수**: ARIA 속성 및 키보드 네비게이션 지원

---

## 폴더 구조 (Feature-Sliced Design)

```
src/
├── app/                    # 앱 진입점 및 전역 설정
│   ├── App.tsx            # 루트 컴포넌트
│   ├── main.tsx           # 앱 진입점
│   ├── routes.tsx         # 라우팅 설정
│   └── index.css          # 전역 스타일
│
├── pages/                  # 페이지 컴포넌트 (라우트별)
│   ├── auth/              # 인증 페이지
│   │   ├── LoginPage.tsx
│   │   └── SignupPage.tsx
│   ├── dashboard/         # 대시보드 페이지
│   ├── customers/         # 고객 관리 페이지
│   │   ├── CustomersPage.tsx
│   │   └── components/    # 페이지 전용 컴포넌트
│   │       ├── CustomerFilter.tsx
│   │       └── mockCustomers.ts
│   ├── analysis/          # 분석 페이지
│   └── ui-showcase/       # UI 컴포넌트 쇼케이스
│
├── widgets/                # 복합 컴포넌트 (여러 features 조합)
│   ├── dashboard-layout/  # 대시보드 레이아웃
│   ├── header/            # 헤더
│   ├── sidebar/           # 사이드바
│   ├── customer-table/    # 고객 테이블
│   └── customer-detail/   # 고객 상세 슬라이드
│
├── features/               # 비즈니스 기능 (사용자 시나리오)
│   ├── auth/
│   │   ├── login/         # 로그인 기능
│   │   │   ├── model/     # 비즈니스 로직 (useLogin.ts)
│   │   │   └── index.ts
│   │   ├── google-auth/   # 구글 로그인
│   │   └── logout/        # 로그아웃
│   └── customer/
│       └── filter-customers/  # 고객 필터링
│           └── model/
│
├── entities/               # 비즈니스 엔티티 (도메인 모델)
│   ├── user/
│   │   ├── model/
│   │   │   ├── store.ts   # Zustand 스토어
│   │   │   └── types.ts   # 타입 정의
│   │   └── index.ts
│   └── customer/
│       ├── api/           # API 호출
│       ├── model/         # 타입 정의
│       └── index.ts
│
├── shared/                 # 공통 리소스 (재사용 가능)
│   ├── ui/                # UI 컴포넌트 (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   ├── badge.tsx
│   │   ├── alert.tsx
│   │   └── ... (30+ 컴포넌트)
│   ├── hooks/             # 공통 훅
│   │   └── useToast.ts
│   ├── lib/               # 유틸리티 라이브러리
│   │   ├── utils.ts       # cn() 함수 등
│   │   └── axios/         # Axios 인스턴스
│   ├── api/               # API 클라이언트
│   ├── constants/         # 상수
│   ├── types/             # 공통 타입
│   └── utils/             # 유틸리티 함수
│
├── components/             # 레거시 컴포넌트 (마이그레이션 중)
│   ├── auth/              # 인증 관련
│   │   ├── AuthLayout.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── SignupForm.tsx
│   └── common/
│       └── ErrorBoundary.tsx
│
└── assets/                 # 정적 리소스
    ├── icons/             # SVG 아이콘
    └── images/            # 이미지 파일
```

---

## 주요 규칙 및 컨벤션

### 1. Import 경로

```typescript
// ✅ 올바른 import
import { Button } from '@/shared/ui';
import { useAuthStore } from '@/entities/user';
import { useLogin } from '@/features/auth/login';
import { CustomerTable } from '@/widgets/customer-table';

// ❌ 잘못된 import (삭제된 경로)
import { Button } from '@/components/ui';  // ❌
import { useToast } from '@/hooks/useToast';  // ❌
import { cn } from '@/lib/utils';  // ❌
```

### 2. UI 컴포넌트 사용

**shadcn/ui 컴포넌트 위치**: `src/shared/ui/`

- 모든 UI 컴포넌트는 `@/shared/ui`에서 import
- shadcn CLI로 생성된 컴포넌트는 수동으로 `shared/ui`로 이동
- 프로젝트 디자인 시스템에 맞게 커스터마이징됨

```typescript
// Button 사용 예시
import { Button } from '@/shared/ui';

<Button variant="primary" size="md" isLoading={loading}>
  저장
</Button>

// Select 사용 예시 (Radix UI 기반)
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/shared/ui';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="선택하세요" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">옵션 1</SelectItem>
    <SelectItem value="option2">옵션 2</SelectItem>
  </SelectContent>
</Select>
```

### 3. 스타일링

- **TailwindCSS** 사용
- **프로젝트 색상 시스템**:
  - Primary: `primary-50` ~ `primary-900`
  - Secondary: `secondary-50` ~ `secondary-900`
  - Error: `error-50` ~ `error-900`
  - Success: `success-50` ~ `success-900`
  - Warning: `warning-50` ~ `warning-900`
  - Info: `info-50` ~ `info-900`

```typescript
// ✅ 올바른 스타일링
<div className="rounded-lg border border-gray-200 bg-white p-4">
  <h2 className="text-lg font-semibold text-gray-900">제목</h2>
</div>

// ✅ cn() 함수 사용 (조건부 스타일)
import { cn } from '@/shared/lib/utils';

<div className={cn(
  "base-class",
  isActive && "active-class",
  className
)}>
```

### 4. 상태 관리

- **Zustand** 사용
- Store는 `entities/{domain}/model/store.ts`에 위치

```typescript
// entities/user/model/store.ts
import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setAuth: (auth: { accessToken: string; user: User }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAuth: (auth) => set(auth),
  clearAuth: () => set({ accessToken: null, user: null }),
}));
```

### 5. API 호출

- API 클라이언트: `src/shared/lib/axios/instance.ts`
- API 함수: `src/shared/api/` 또는 `src/entities/{domain}/api/`

```typescript
// shared/api/auth.ts
import { apiClient } from '@/shared/lib/axios/instance';

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
};
```

### 6. 타입 정의

- 공통 타입: `src/shared/types/`
- 도메인 타입: `src/entities/{domain}/model/types.ts`

```typescript
// entities/customer/model/types.ts
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  isVip: boolean;
  service: string;
  // ...
}

export type TabType = 'info' | 'rfm' | 'ltv';
```

---

## 컴포넌트 작성 가이드

### 페이지 컴포넌트 (pages/)

```typescript
// pages/customers/CustomersPage.tsx
import { DashboardLayout } from '@/widgets/dashboard-layout';
import { CustomerTable } from '@/widgets/customer-table';
import { Button } from '@/shared/ui';

const CustomersPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1>고객 목록</h1>
        <CustomerTable />
      </div>
    </DashboardLayout>
  );
};

export default CustomersPage;
```

### 위젯 컴포넌트 (widgets/)

```typescript
// widgets/customer-table/ui/CustomerTable.tsx
import { Button, Badge } from '@/shared/ui';
import type { Customer } from '@/entities/customer';

interface Props {
  data: Customer[];
  onCustomerClick: (customer: Customer) => void;
}

export const CustomerTable = ({ data, onCustomerClick }: Props) => {
  return (
    <table>
      {/* 테이블 구현 */}
    </table>
  );
};
```

### Feature 훅 (features/)

```typescript
// features/auth/login/model/useLogin.ts
import { useState } from 'react';
import { useAuthStore } from '@/entities/user';
import { authApi } from '@/shared/api/auth';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      setAuth(response);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};
```

---

## 삭제된 경로 (사용 금지)

다음 경로들은 정리 과정에서 삭제되었으므로 사용하지 마세요:

```
❌ src/hooks/          → src/shared/hooks/
❌ src/api/            → src/shared/api/
❌ src/store/          → src/entities/{domain}/model/store.ts
❌ src/lib/            → src/shared/lib/
❌ src/constants/      → src/shared/constants/
❌ src/utils/          → src/shared/utils/
❌ src/components/layout/  → src/widgets/
❌ src/components/ui/  → src/shared/ui/
❌ src/shared/ui/modal.tsx  → Dialog 사용
❌ src/shared/ui/native-select.tsx  → Select (Radix UI) 사용
```

---

## 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 타입 체크
npm run type-check

# 린트
npm run lint

# 프리뷰 (빌드 결과 확인)
npm run preview
```

---

## shadcn/ui 컴포넌트 추가

```bash
# 새 컴포넌트 추가
npx shadcn@latest add [component-name]

# 예: Table 컴포넌트 추가
npx shadcn@latest add table

# ⚠️ 주의: 생성된 파일을 components/ui에서 shared/ui로 수동 이동 필요
```

---

## 주요 의존성

```json
{
  "react": "^18.3.1",
  "react-router-dom": "^6.x",
  "zustand": "^5.x",
  "tailwindcss": "^3.x",
  "@radix-ui/react-*": "^1.x",
  "class-variance-authority": "^0.7.x",
  "clsx": "^2.x",
  "tailwind-merge": "^2.x",
  "axios": "^1.x",
  "chart.js": "^4.x",
  "react-chartjs-2": "^5.x"
}
```

---

## 문제 해결

### Import 에러 발생 시

1. 경로가 `@/shared/ui`인지 확인
2. `@/lib/utils` → `@/shared/lib/utils`로 변경
3. `@/hooks/useToast` → `@/shared/hooks`로 변경

### 빌드 에러 발생 시

```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install

# 타입 체크
npm run type-check
```

### shadcn/ui 컴포넌트 스타일 커스터마이징

`src/shared/ui/[component].tsx` 파일을 직접 수정하여 프로젝트 디자인 시스템에 맞게 조정

---

## 참고 문서

- [Feature-Sliced Design](https://feature-sliced.design/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)

---

**마지막 업데이트**: 2024-03-03  
**작성자**: AI Assistant
