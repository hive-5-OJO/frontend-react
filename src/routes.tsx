import { createBrowserRouter } from 'react-router-dom';
// import RootLayout from './components/layout/RootLayout';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CustomersPage from './pages/customers/CustomersPage';
import AnalysisPage from './pages/analysis/AnalysisPage';

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
    children: [
      {
        index: true, // 기본 경로 (/) 일 때 대시보드 표시
        // element: <Navigate to="/login" replace />,
        element: <DashboardPage />,
      },
      {
        path: 'customers',
        children: [
          { index: true, element: <CustomersPage /> },
          // { path: ":id", element: <CustomerDetailPage /> },
        ],
      },
      {
        path: 'analysis',
        children: [
          { index: true, element: <AnalysisPage /> },
          // { path: "cohort", element: <CohortPage /> },
          // { path: "rfm", element: <RFMPage /> },
        ],
      },
    ],
  },
]);
