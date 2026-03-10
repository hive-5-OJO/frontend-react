import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import GoogleCallbackPage from '@/pages/auth/GoogleCallbackPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import CustomersPage from '@/pages/customers/CustomersPage';
import RFMAnalysisPage from '@/pages/analysis/RFMAnalysisPage';
import CohortAnalysisPage from '@/pages/analysis/CohortAnalysisPage';
import RegionalAnalysisPage from '@/pages/analysis/RegionalAnalysisPage';
import NotFoundPage from '@/pages/not-found/NotFoundPage';
import UIShowcasePage from '@/pages/ui-showcase/UIShowcasePage';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
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
    path: ROUTES.GOOGLE_CALLBACK,
    element: <GoogleCallbackPage />,
  },
  {
    path: '/ui',
    element: <UIShowcasePage />,
  },
  {
    path: ROUTES.HOME,
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </ErrorBoundary>
    ),
  },
  {
    path: ROUTES.CUSTOMERS,
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <CustomersPage />
        </ProtectedRoute>
      </ErrorBoundary>
    ),
  },
  {
    path: ROUTES.ANALYSIS_RFM,
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <RFMAnalysisPage />
        </ProtectedRoute>
      </ErrorBoundary>
    ),
  },
  {
    path: ROUTES.ANALYSIS_COHORT,
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <CohortAnalysisPage />
        </ProtectedRoute>
      </ErrorBoundary>
    ),
  },
  {
    path: ROUTES.ANALYSIS_REGIONAL,
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <RegionalAnalysisPage />
        </ProtectedRoute>
      </ErrorBoundary>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
