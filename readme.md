# OJO - CRM 어드민 대시보드

통신사 고객 관리를 위한 어드민 대시보드 프론트엔드 프로젝트입니다.
고객 데이터 조회, 분석, 채널 관리, 인사이트 제공 등 내부 운영팀을 위한 백오피스 시스템입니다.

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 + shadcn/ui (Radix UI) |
| 상태 관리 | Zustand 5 (UI 상태), TanStack Query v5 (서버 상태) |
| 차트 | Chart.js 4 + react-chartjs-2 |
| 지도 | Mapbox GL JS 3 |
| HTTP | Axios |
| 라우팅 | React Router v7 |
| 아이콘 | Lucide React |

---

## 아키텍처

[Feature-Sliced Design (FSD)](https://feature-sliced.design/) 기반으로 구성되어 있습니다.

```
src/
├── pages/          # 라우트별 페이지
├── widgets/        # 복합 UI 컴포넌트 (레이아웃, 차트, 테이블, 모달 등)
├── features/       # 비즈니스 기능 단위 (로그인, 필터링, 역할/상태 변경 등)
├── entities/       # 도메인 모델 (user, customer, channel, dashboard, analysis, admin)
├── shared/         # 공통 UI, 훅, 유틸리티, 상수, API 클라이언트
└── components/     # 레거시 컴포넌트 (인증 레이아웃, ErrorBoundary)
```

### 엔티티 구조

| 엔티티 | 설명 |
|--------|------|
| `user` | 인증 사용자 정보 (Zustand 스토어) |
| `customer` | 고객 데이터, 메모, 선택 바구니 |
| `channel` | 고객 채널 (그룹) 관리 |
| `dashboard` | 대시보드 요약, 상담 통계 |
| `analysis` | 코호트, RFM, 지역별 분석 |
| `admin` | 관리자 계정 관리 |

### 위젯 구조

| 위젯 | 설명 |
|------|------|
| `dashboard-layout` | 사이드바 + 헤더 포함 공통 레이아웃 |
| `sidebar` | 네비게이션 사이드바 |
| `header` | 상단 헤더 |
| `customer-table` | 고객 목록 테이블 |
| `customer-detail` | 고객 상세 슬라이드 패널 + 메모 모달 |
| `customer-trend-chart` | 최근 7일 고객 트렌드 차트 |
| `customer-composition-chart` | 고객 구성 도넛 차트 |
| `consult-category-card` | 상담 카테고리별 분포 카드 |
| `consult-time-card` | 시간대별 상담 현황 카드 |
| `outbound-card` | 아웃바운드 현황 카드 |
| `satisfaction-card` | 고객 만족도 카드 |
| `selection-basket` | 고객 선택 바구니 (드래그 가능 패널) |
| `create-channel-modal` | 채널 생성 모달 |
| `add-member-modal` | 채널 멤버 추가 모달 |
| `bulk-email-modal` | 단체 메일 발송 모달 |

---

## 주요 기능

### 인증
- 이메일/비밀번호 로그인
- Google OAuth 소셜 로그인
- JWT 토큰 기반 인증 (자동 갱신)
- 인증 상태 기반 라우트 보호 (ProtectedRoute)
- 역할 기반 접근 제어 (ADMIN 전용 페이지)

### 대시보드
- 핵심 지표 메트릭 카드 (현재 고객, 신규 활성 고객, 신규 고객, 위험 고객 + 전월 대비 증감률)
- 최근 7일 고객 트렌드 차트 (신규/이탈/활성 고객)
- 고객 구성 도넛 차트 (VIP, 잠재VIP, 일반, 이탈우려, 이탈)
- 상담 카테고리별 분포
- 시간대별 상담 현황
- 아웃바운드 현황
- 고객 만족도 카드
- API 연동: `GET /api/analysis/dashboard`

### 고객 관리
- 고객 목록 테이블 (이름, 가입일, 고객분류, 상담빈도, 휴대폰번호, 이메일)
- 다중 컬럼 정렬 (테이블 헤더 클릭, 클릭 순서대로 우선순위 적용)
- 필터링 (고객분류 5단계, 상담빈도, 상담카테고리 대분류/소분류 2단계 선택, 가입기간)
- 검색 (이름 기반)
- 개인정보 마스킹 (휴대폰번호: `010-****-5678`, 이메일: `ex**le@domain.com`)
- 고객 상세 슬라이드 패널 (4개 탭)
  - **기본 정보** — 인적정보, 연락처, 동의정보
  - **특성 정보** — 서비스/생애주기/결제/이용/상담 데이터 + AI 인사이트
  - **RFM 분석** — Recency/Frequency/Monetary 점수, 레이더/바 차트, 세그먼트 분류, 마케팅 전략 추천
  - **LTV 분석** — 고객 생애 가치, 예상 수익 추이 차트, 이탈 위험도, 가치 등급, LTV 향상 전략
- 고객 메모 작성/수정/삭제 (확인 모달 포함)

### 고객 채널
- 채널 목록 조회 (카드 형태)
- 채널 생성 (선택된 고객으로 채널 만들기)
- 채널 상세 페이지 (멤버 목록, 체크박스 선택)
- 채널 멤버 추가/삭제
- 채널 삭제 (확인 모달 + 완료 알림)
- 선택 바구니 패널 (채널 목록 + 고객 목록 2컬럼, 드래그 이동 가능)
- 단체 메일 발송

### 분석
- **RFM 분석** — 고객 세분화 분석, 필터 및 검색 기능
- **코호트 분석** — 가입 시기별 리텐션 히트맵, 분석 기준/기간/가입 월 필터, 조회 버튼 기반 실행
- **지역별 분석** — Mapbox 지도 기반 지역별 고객 분포 시각화 (한글 레이블), 지역 필터링, 플로팅 헤더

### 관리자
- 관리자 계정 목록 조회
- 역할 변경 (ADMIN 권한 필요)
- 상태 변경 (활성/비활성)

### UI 시스템
- shadcn/ui 기반 커스텀 디자인 시스템
- 프로젝트 전용 색상 체계 (primary, secondary, error, success, warning, info)
- 고객분류 전용 Badge variant (VIP, 잠재VIP, 일반, 이탈우려, 이탈)
- 상담빈도 Badge (높음, 중간, 낮음)
- 공통 모달 컴포넌트 (ConfirmModal, DeleteConfirmModal)
- MonthPicker (년/월 선택 컴포넌트, placeholder 지원)
- UI 쇼케이스 페이지 (`/ui`)에서 전체 컴포넌트 확인 가능

---

## 시작하기

### 사전 요구사항
- Node.js 18+
- npm

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 환경 변수 설정
# .env 파일에서 API URL, Mapbox 토큰, Google OAuth 클라이언트 ID 설정

# 개발 서버 실행
npm run dev
```

### 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 (TypeScript 체크 + Vite 빌드) |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | ESLint 실행 |

### 환경 변수

| 변수 | 설명 |
|------|------|
| `VITE_API_URL` | Java 백엔드 API 서버 주소 |
| `VITE_API_URL_PY` | Python 백엔드 API 서버 주소 (분석 API) |
| `VITE_MAPBOX_ACCESS_TOKEN` | Mapbox GL 액세스 토큰 |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 클라이언트 ID |

---

## API 구조

| 백엔드 | 용도 | Axios 인스턴스 |
|--------|------|----------------|
| Java (Spring Boot) | 인증, 고객, 채널, 대시보드, 상담, 관리자 | `axiosInstance` |
| Python (FastAPI) | 코호트 분석, RFM 분석, 지역별 분석 | `axiosInstancePy` |

---

## 배포

### CI/CD
- **GitHub Actions** 기반 자동 배포 파이프라인 구성
- `main` 브랜치에 push 또는 PR 시 자동으로 빌드 및 배포 실행

### 인프라
- **호스팅**: AWS S3 정적 웹 호스팅
- **백엔드**: AWS EC2 인스턴스에서 API 서버 운영
- **배포 흐름**: `npm run build` → `dist/` 디렉토리를 S3 버킷에 동기화

### 배포 파이프라인 요약

```
코드 Push/PR (main) → GitHub Actions 트리거
  → npm install & npm run build
  → dist/ → AWS S3 버킷 동기화 (public-read)
```

---

## 협업

### 브랜치 전략
- `main` 브랜치를 기준으로 PR 기반 협업

### 템플릿
- **PR 템플릿** — 연관 이슈, 작업 내용, 테스트 결과, 변경사항 체크리스트
- **이슈 템플릿** — 버그 리포트, 기능 요청, 유지보수 이슈

---

## 페이지 라우트

| 경로 | 페이지 | 인증 |
|------|--------|------|
| `/login` | 로그인 | - |
| `/oauth/google/callback` | Google OAuth 콜백 | - |
| `/` | 대시보드 | ✅ |
| `/customers` | 고객 관리 | ✅ |
| `/channels` | 고객 채널 목록 | ✅ |
| `/channels/:id` | 채널 상세 | ✅ |
| `/analysis/rfm` | RFM 분석 | ✅ |
| `/analysis/cohort` | 코호트 분석 | ✅ |
| `/analysis/regional` | 지역별 분석 | ✅ |
| `/admin/management` | 관리자 관리 | ✅ (ADMIN) |
| `/ui` | UI 쇼케이스 | - |
