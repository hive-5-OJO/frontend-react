# 디자인 시스템

이 문서는 프로젝트의 디자인 시스템을 정의합니다. 모든 스타일은 `src/index.css`에 정의되어 있습니다.

## 색상 (Colors)

### Primary (Indigo)
주요 액션, 링크, 강조 요소에 사용

- `primary-50`: #eef2ff - 배경, 호버 상태
- `primary-100`: #e0e7ff - 배경, 뱃지
- `primary-600`: #4f46e5 - 버튼, 링크
- `primary-700`: #4338ca - 버튼 호버

**사용 예시:**
- 버튼: `bg-primary-600 hover:bg-primary-700`
- 뱃지: `bg-primary-100 text-primary-700`
- 링크: `text-primary-600`

### 상태 컬러

#### Success (Green)
성공, 활성, 긍정적 상태

- `success-100`: #d1fae5
- `success-600`: #10b981
- `success-700`: #059669

**사용 예시:**
- 활성 상태: `bg-success-100 text-success-700`

#### Warning (Orange)
경고, 주의, 휴면 상태

- `warning-100`: #fef3c7
- `warning-600`: #f59e0b
- `warning-700`: #d97706

**사용 예시:**
- 휴면 상태: `bg-warning-100 text-warning-700`

#### Error (Red)
오류, 위험, 불만

- `error-100`: #fee2e2
- `error-600`: #ef4444
- `error-700`: #dc2626

**사용 예시:**
- 높은 상담 빈도: `bg-error-100 text-error-600`

#### Info (Blue)
정보, 일반 상태

- `info-100`: #dbeafe
- `info-600`: #3b82f6
- `info-700`: #2563eb

**사용 예시:**
- 낮은 상담 빈도: `bg-info-100 text-info-600`

### 특수 상태

#### VIP (Purple)
VIP 고객 표시

- `vip-100`: #f3e8ff
- `vip-600`: #9333ea

**사용 예시:**
- VIP 뱃지: `bg-vip-100 text-vip-600`

#### New (Blue)
신규 고객 표시

- `new-100`: #dbeafe
- `new-700`: #1d4ed8

**사용 예시:**
- 신규 가입 뱃지: `bg-new-100 text-new-700`

### Gray Scale
텍스트, 배경, 테두리

- `gray-50`: #f9fafb - 배경
- `gray-100`: #f3f4f6 - 카드 배경
- `gray-200`: #e5e7eb - 테두리
- `gray-300`: #d1d5db - 비활성 테두리
- `gray-500`: #6b7280 - 보조 텍스트
- `gray-600`: #4b5563 - 레이블
- `gray-700`: #374151 - 본문 텍스트
- `gray-900`: #111827 - 제목

## 컴포넌트 클래스

### 버튼 (Buttons)

```tsx
// Primary 버튼
<button className="btn-primary">저장</button>

// Secondary 버튼
<button className="btn-secondary">취소</button>

// 크기 변형
<button className="btn-primary btn-sm">작은 버튼</button>
<button className="btn-primary btn-lg">큰 버튼</button>
```

### 뱃지 (Badges)

```tsx
// Primary 뱃지
<span className="badge-primary">일반</span>

// 상태별 뱃지
<span className="badge-success">활성</span>
<span className="badge-warning">휴면</span>
<span className="badge-error">긴급</span>

// 특수 뱃지
<span className="badge-vip">VIP</span>
<span className="badge-new">신규 가입</span>
```

### 카드 (Cards)

```tsx
<div className="card">
  <h3 className="card-header">제목</h3>
  <div>내용</div>
</div>
```

### 섹션 아이템 (Section Items)

```tsx
<div className="section-item">
  <span className="section-bullet"></span>
  <div className="flex-1">
    <span className="section-label">레이블:</span>
    <span className="section-value">값</span>
  </div>
</div>
```

### 인사이트 박스 (Insight Box)

```tsx
<div className="insight-box">
  <h3 className="insight-title">
    <span>💡</span>
    <span>AI 인사이트</span>
  </h3>
  <div className="insight-content">
    <p>• 인사이트 내용</p>
  </div>
</div>
```

### 테이블 (Tables)

```tsx
<table>
  <thead className="table-header">
    <tr>
      <th className="table-header-cell">헤더</th>
    </tr>
  </thead>
  <tbody>
    <tr className="table-row">
      <td className="table-cell">데이터</td>
    </tr>
  </tbody>
</table>
```

### 상태 클래스 (Status Classes)

```tsx
// 고객 상태
<span className="badge status-active">활성</span>
<span className="badge status-dormant">휴면</span>
<span className="badge status-terminated">해지</span>

// 상담 빈도
<span className="badge consult-high">HIGH</span>
<span className="badge consult-medium">MEDIUM</span>
<span className="badge consult-low">LOW</span>
```

## Spacing

- `xs`: 4px - 아주 작은 간격
- `sm`: 8px - 작은 간격
- `md`: 16px - 기본 간격
- `lg`: 24px - 큰 간격
- `xl`: 32px - 아주 큰 간격
- `2xl`: 48px - 섹션 간격

## Typography

### Font Sizes

- `xs`: 12px - 캡션, 보조 정보
- `sm`: 14px - 본문, 레이블
- `base`: 16px - 기본 본문
- `lg`: 18px - 부제목
- `xl`: 20px - 소제목
- `2xl`: 24px - 제목
- `3xl`: 30px - 큰 제목
- `4xl`: 36px - 페이지 제목

### Font Weights

- `font-medium`: 500 - 강조
- `font-semibold`: 600 - 레이블, 버튼
- `font-bold`: 700 - 제목

## Transitions

- `fast`: 150ms - 호버, 포커스
- `base`: 300ms - 기본 전환
- `slow`: 500ms - 슬라이드, 페이드

**사용 예시:**
```tsx
<div className="transition-all duration-300">
  애니메이션 요소
</div>
```

## 사용 가이드라인

### 1. 일관성 유지
- 동일한 기능에는 동일한 스타일 사용
- 정의된 컴포넌트 클래스 우선 사용

### 2. 시멘틱 네이밍
- 색상은 용도에 따라 선택 (primary, success, error 등)
- 직접적인 색상 이름(red, blue) 대신 의미 있는 이름 사용

### 3. 접근성
- 충분한 색상 대비 유지
- 색상만으로 정보 전달하지 않기

### 4. 반응형
- 모바일 우선 접근
- 필요시 `sm:`, `md:`, `lg:` 브레이크포인트 사용

## 예시

### 고객 상세 정보 카드
```tsx
<div className="card">
  <h3 className="card-header">이용 서비스</h3>
  <div className="space-y-3">
    <div className="section-item">
      <span className="section-bullet"></span>
      <div className="flex-1">
        <span className="section-label">현재 요금제:</span>
        <span className="section-value">Pro</span>
      </div>
    </div>
  </div>
</div>
```

### 상태 뱃지
```tsx
<div className="flex items-center gap-2">
  <span className="badge-vip">VIP</span>
  <span className="badge status-active">활성</span>
  <span className="badge-new">신규 가입</span>
</div>
```

### 버튼 그룹
```tsx
<div className="flex gap-3">
  <button className="btn-primary btn-lg">
    <svg>...</svg>
    메모 작성
  </button>
  <button className="btn-secondary">취소</button>
</div>
```
