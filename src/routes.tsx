import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import CustomersPage from '@/pages/customers/CustomersPage';
import AnalysisPage from '@/pages/analysis/AnalysisPage';
import UIShowcasePage from '@/pages/ui-showcase/UIShowcasePage';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { ROUTES } from '@/shared/constants/routes';

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.SIGNUP,
    element: <SignupPage />,
  },
  {
    path: '/ui',
    element: <UIShowcasePage />,
  },
  {
    path: ROUTES.HOME,
    element: (
      <ErrorBoundary>
        {/* <ProtectedRoute> */}
          <DashboardPage />
        {/* </ProtectedRoute> */}
      </ErrorBoundary>
    ),
  },
  {
    path: ROUTES.CUSTOMERS,
    element: (
      <ErrorBoundary>
        {/* <ProtectedRoute> */}
          <CustomersPage />
        {/* </ProtectedRoute> */}
      </ErrorBoundary>
    ),
  },
  {
    path: ROUTES.ANALYSIS,
    element: (
      <ErrorBoundary>
        {/* <ProtectedRoute> */}
          <AnalysisPage />
        {/* </ProtectedRoute> */}
      </ErrorBoundary>
    ),
  },
]);
