import { createBrowserRouter, Navigate } from 'react-router-dom';
// import RootLayout from './components/layout/RootLayout';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/',
    // element: <RootLayout />, // 사이드바가 포함된 레이아웃
    children: [
      {
        index: true, // 기본 경로 (/) 일 때 대시보드 표시
        element: <Navigate to="/login" replace />,
        // element: <DashboardPage />,
      },
      {
        path: 'customers',
        children: [
          // { index: true, element: <CustomerListPage /> },
          // { path: ":id", element: <CustomerDetailPage /> },
        ],
      },
      {
        path: 'analysis',
        children: [
          // { path: "cohort", element: <CohortPage /> },
          // { path: "rfm", element: <RFMPage /> },
        ],
      },
    ],
  },
]);
