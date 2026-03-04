---
inclusion: auto
priority: high
description: "CRM 대시보드 프로젝트의 FSD 아키텍처, import 경로, UI 컴포넌트 사용법 등 핵심 규칙과 컨벤션"
---

# 프로젝트 컨텍스트

이 문서는 프로젝트의 전반적인 구조와 규칙을 설명합니다. 모든 작업 시 이 가이드를 참조하세요.

## 프로젝트 정보

**프로젝트**: CRM 어드민 대시보드  
**아키텍처**: Feature-Sliced Design (FSD)  
**기술 스택**: React 18 + TypeScript + Vite + TailwindCSS + shadcn/ui  
**상태 관리**: Zustand  
**UI 라이브러리**: shadcn/ui (Radix UI 기반)

## 핵심 규칙

### Import 경로 규칙

```typescript
// ✅ 올바른 경로
import { Button } from '@/shared/ui';
import { useAuthStore } from '@/entities/user';
import { useLogin } from '@/features/auth/login';
import { CustomerTable } from '@/widgets/customer-table';
import { cn } from '@/shared/lib/utils';
import { useToast } from '@/shared/hooks';

// ❌ 삭제된 경로 (사용 금지)
import { Button } from '@/components/ui';  // ❌
import { useToast } from '@/hooks/useToast';  // ❌
import { cn } from '@/lib/utils';  // ❌
```

### 폴더 구조 (간략)

```
src/
├── pages/          # 페이지 컴포넌트 (라우트별)
├── widgets/        # 복합 컴포넌트 (재사용 가능)
├── features/       # 비즈니스 기능 (사용자 시나리오)
├── entities/       # 비즈니스 엔티티 (도메인 모델)
├── shared/         # 공통 리소스
│   ├── ui/        # shadcn/ui 컴포넌트
│   ├── hooks/     # 공통 훅
│   ├── lib/       # 유틸리티
│   ├── api/       # API 클라이언트
│   ├── constants/ # 상수
│   ├── types/     # 공통 타입
│   └── utils/     # 유틸리티 함수
├── components/     # 레거시 (auth, common만 유지)
└── assets/         # 정적 리소스
```

### UI 컴포넌트 사용

- **위치**: `src/shared/ui/`
- **Import**: `@/shared/ui`
- **shadcn/ui 추가 시**: CLI로 생성 후 `shared/ui`로 수동 이동

```typescript
// Select 컴포넌트 (Radix UI 기반)
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/shared/ui';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="선택" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">옵션 1</SelectItem>
  </SelectContent>
</Select>
```

### 스타일링

- **TailwindCSS** 사용
- **색상 시스템**: primary, secondary, error, success, warning, info (50~900)
- **cn() 함수**: `@/shared/lib/utils`에서 import

```typescript
import { cn } from '@/shared/lib/utils';

<div className={cn("base-class", isActive && "active-class")}>
```

### 상태 관리

- **Zustand** 사용
- **위치**: `entities/{domain}/model/store.ts`

```typescript
import { useAuthStore } from '@/entities/user';
```

### 삭제된 컴포넌트

- `modal.tsx` → `Dialog` 사용
- `native-select.tsx` → `Select` (Radix UI) 사용

## 상세 가이드

전체 가이드는 프로젝트 루트의 `PROJECT_GUIDE.md` 파일을 참조하세요.


