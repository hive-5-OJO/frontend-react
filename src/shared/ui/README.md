# 📦 UI Components (shadcn/ui 기반)

이 폴더는 프로젝트의 **실제 UI 컴포넌트**가 위치한 곳입니다.
shadcn/ui를 기반으로 하되, 프로젝트 요구사항에 맞게 커스터마이징되어 있습니다.

## 🎯 사용 방법

### Import 방법

```tsx
// ✅ 권장: index.ts를 통한 import
import { Button, Input, Badge, Card } from '@/shared/ui';

// ✅ 개별 import도 가능
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
```

### 기본 사용 예시

```tsx
import { Button, Input, Badge } from '@/shared/ui';

function MyComponent() {
  return (
    <div>
      <Input placeholder="이메일 입력" />
      <Button variant="primary">로그인</Button>
      <Badge variant="vip">VIP</Badge>
    </div>
  );
}
```

---

## 🆕 새 shadcn/ui 컴포넌트 추가하기

### 1. shadcn CLI로 추가

```bash
npx shadcn@latest add dropdown-menu
```

⚠️ **주의**: `components.json` 설정에 따라 `src/components/ui/`에 생성될 수 있습니다.

### 2. shared/ui로 이동

```bash
# 생성된 파일을 shared/ui로 이동
mv src/components/ui/dropdown-menu.tsx src/shared/ui/

# components/ui 폴더 삭제 (선택)
rm -rf src/components/ui
```

### 3. index.ts에 export 추가

```tsx
// src/shared/ui/index.ts
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './dropdown-menu';
```

### 4. 필요시 커스터마이징

```tsx
// src/shared/ui/dropdown-menu.tsx
// 프로젝트 색상, variant 등 추가
```

---

## ✏️ 기존 컴포넌트 수정하기

### Variant 추가 예시

```tsx
// src/shared/ui/button.tsx

const buttonVariants = cva(
  "...",
  {
    variants: {
      variant: {
        primary: "bg-main-blue text-white ...",
        secondary: "border border-gray-300 ...",
        danger: "bg-error-600 text-white ...",
        // ✅ 새 variant 추가
        success: "bg-success-600 text-white hover:bg-success-700",
      },
    },
  }
)
```

### Props 추가 예시

```tsx
// src/shared/ui/input.tsx

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;           // ✅ 추가
  leftIcon?: React.ReactNode;   // ✅ 추가
  rightIcon?: React.ReactNode;  // ✅ 추가
}
```

---

## 📚 컴포넌트 목록

### shadcn/ui 기반 (Radix UI)
- `button.tsx` - 버튼 (primary, secondary, danger, outline, ghost)
- `input.tsx` - 입력 필드 (leftIcon, rightIcon, error 지원)
- `dialog.tsx` - 모달/다이얼로그 (Modal 대체)
- `select.tsx` - 드롭다운 선택 (Radix UI 기반)
- `checkbox.tsx` - 체크박스 (label prop 지원)
- `label.tsx` - 레이블
- `card.tsx` - 카드
- `badge.tsx` - 뱃지 (vip, high, medium, low variant 추가)
- `alert.tsx` - 알림 (success, warning, error, info variant 추가)

### 커스텀 컴포넌트
- `native-select.tsx` - 네이티브 select (호환용)
- `form-field.tsx` - 폼 필드 래퍼
- `search-input.tsx` - 검색 입력
- `metric-card.tsx` - 지표 카드
- `status-badge.tsx` - 상태 뱃지
- `trend-indicator.tsx` - 트렌드 표시
- `pagination.tsx` - 페이지네이션
- `loading-overlay.tsx` - 로딩 오버레이
- `toast.tsx` - 토스트 알림
- `toaster.tsx` - 토스트 컨테이너

### 레거시 컴포넌트
- `icon.tsx` - 아이콘
- `icon-button.tsx` - 아이콘 버튼
- `logo.tsx` - 로고
- `avatar.tsx` - 아바타
- `spinner.tsx` - 스피너
- `divider.tsx` - 구분선
- `tooltip.tsx` - 툴팁
- `radio.tsx` - 라디오 버튼
- `page-header.tsx` - 페이지 헤더
- `modal.tsx` - 레거시 모달 (dialog 사용 권장)

---

## 🎨 프로젝트 커스터마이징

### 추가된 Variant

#### Button
- `primary` - 메인 블루 (프로젝트 색상)
- `danger` - 위험한 작업 (삭제 등)

#### Badge
- `vip` - VIP 고객
- `high`, `medium`, `low` - 우선순위/빈도

#### Alert
- `success`, `warning`, `error`, `info` - 상태별 알림

### 추가된 Props

#### Input
- `leftIcon` - 왼쪽 아이콘
- `rightIcon` - 오른쪽 아이콘
- `error` - 에러 메시지

#### Checkbox
- `label` - 레이블 텍스트

---

## ⚠️ 주의사항

### ✅ 해도 되는 것
- variant 추가/변경
- size 추가/변경
- 새로운 prop 추가
- 스타일 커스터마이징
- 프로젝트 색상 적용

### ❌ 하지 말아야 할 것
- Radix UI 기본 동작 변경
- ARIA 속성 제거
- 접근성 기능 제거
- 기존 API 호환성 깨뜨리기

---

## 🔗 참고 자료

- [shadcn/ui 공식 문서](https://ui.shadcn.com)
- [Radix UI 문서](https://www.radix-ui.com)
- [Tailwind CSS 문서](https://tailwindcss.com)

---

## 📝 변경 이력

### 2024-03-03
- shadcn/ui 전환 완료
- Modal → Dialog 마이그레이션
- Select → Radix UI Select 마이그레이션
- Checkbox → Radix UI Checkbox 마이그레이션
- 프로젝트 색상 및 variant 추가
- `src/components/ui` 폴더 삭제, `src/shared/ui`로 통합
