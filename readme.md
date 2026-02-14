Frontend-react

npm create vite@latest . -- --template react-ts로 파일 생성함
이후, 아래 2가지 설치 진행함

1. npm install axios zod @tanstack/react-query zustand chart.js react-chartjs-2 mapbox-gl
2. npm install -D tailwindcss @tailwindcss/vite
   vite.congig.ts에 tailwindcss 추가함

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

## 📁 Project Structure

```
src/
├── api/              # Axios 인스턴스 및 공통 API 호출 로직
├── assets/           # 이미지, 아이콘, 폰트 등 정적 자원
├── components/       # 재사용 가능한 UI 컴포넌트
│   ├── common/       # Button, Input, Modal 등 (Atomic 디자인)
│   └── layout/       # Sidebar, Header, RootLayout 등 공통 레이아웃
├── constants/        # 환경변수, API 경로, 고정 메시지
├── hooks/            # 커스텀 훅 (useAuth, useCustomerQuery 등)
├── pages/            # 각 도메인별 페이지 컴포넌트
│   ├── auth/         # 로그인, 회원가입 (Full-page)
│   ├── dashboard/    # 메인 대시보드 (통계/인사이트)
│   ├── customers/    # 고객 관리 (목록, 검색, 상세)
│   └── analysis/     # 데이터 분석 (코호트, RFM 등)
├── store/            # Zustand를 이용한 전역 상태 관리
├── types/            # TypeScript 인터페이스 및 타입 정의
├── utils/            # 날짜 포맷팅, 수치 계산 등 공통 유틸리티
├── routes.tsx        # React Router를 이용한 경로 설정
├── App.tsx           # RouterProvider 및 Provider 설정
└── main.tsx          # 앱 엔트리 포인트
```
