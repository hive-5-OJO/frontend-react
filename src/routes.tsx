import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ErrorBoundary from '@/components/common/ErrorBoundary';
// import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { ROUTES } from '@/shared/constants/routes';

// 로그인은 초기 진입점이므로 정적 import
import LoginPage from '@/pages/auth/LoginPage';

// 나머지 페이지는 lazy import → 해당 라우트 접근 시에만 로드
const GoogleCallbackPage = lazy(() => import('@/pages/auth/GoogleCallbackPage'));
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const CustomersPage = lazy(() => import('@/pages/customers/CustomersPage'));
const ChannelsPage = lazy(() => import('@/pages/channels/ChannelsPage'));
const ChannelDetailPage = lazy(() => import('@/pages/channels/ChannelDetailPage'));
const RFMAnalysisPage = lazy(() => import('@/pages/analysis/RFMAnalysisPage'));
const CohortAnalysisPage = lazy(() => import('@/pages/analysis/CohortAnalysisPage'));
const RegionalAnalysisPage = lazy(() => import('@/pages/analysis/RegionalAnalysisPage'));
const AdminManagementPage = lazy(() => import('@/pages/admin/AdminManagementPage'));
const NotFoundPage = lazy(() => import('@/pages/not-found/NotFoundPage'));
const UIShowcasePage = lazy(() => import('@/pages/ui-showcase/UIShowcasePage'));

/** 페이지 로딩 중 표시되는 폴백 UI */
const PageLoader = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="text-center">
      <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      <p className="text-sm text-gray-500">페이지를 불러오는 중...</p>
    </div>
  </div>
);

/** Suspense + ErrorBoundary 래퍼 */
const LazyPage = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={ROUTES.LOGIN} replace />,
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.GOOGLE_CALLBACK,
    element: (
      <Suspense fallback={<PageLoader />}>
        <GoogleCallbackPage />
      </Suspense>
    ),
  },
  {
    path: '/ui',
    element: (
      <Suspense fallback={<PageLoader />}>
        <UIShowcasePage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.HOME,
    element: (
      <LazyPage>
        {/* <ProtectedRoute> */}
          <DashboardPage />
        {/* </ProtectedRoute> */}
      </LazyPage>
    ),
  },
  {
    path: ROUTES.CUSTOMERS,
    element: (
      <LazyPage>
        {/* <ProtectedRoute> */}
          <CustomersPage />
        {/* </ProtectedRoute> */}
      </LazyPage>
    ),
  },
  {
    path: ROUTES.CHANNELS,
    element: (
      <LazyPage>
        {/* <ProtectedRoute> */}
          <ChannelsPage />
        {/* </ProtectedRoute> */}
      </LazyPage>
    ),
  },
  {
    path: `${ROUTES.CHANNELS}/:id`,
    element: (
      <LazyPage>
        {/* <ProtectedRoute> */}
          <ChannelDetailPage />
        {/* </ProtectedRoute> */}
      </LazyPage>
    ),
  },
  {
    path: ROUTES.ANALYSIS_RFM,
    element: (
      <LazyPage>
        {/* <ProtectedRoute> */}
          <RFMAnalysisPage />
        {/* </ProtectedRoute> */}
      </LazyPage>
    ),
  },
  {
    path: ROUTES.ANALYSIS_COHORT,
    element: (
      <LazyPage>
        {/* <ProtectedRoute> */}
          <CohortAnalysisPage />
        {/* </ProtectedRoute> */}
      </LazyPage>
    ),
  },
  {
    path: ROUTES.ANALYSIS_REGIONAL,
    element: (
      <LazyPage>
        {/* <ProtectedRoute> */}
          <RegionalAnalysisPage />
        {/* </ProtectedRoute> */}
      </LazyPage>
    ),
  },
  {
    path: ROUTES.ADMIN_MANAGEMENT,
    element: (
      <LazyPage>
        {/* <ProtectedRoute requiredRole="ADMIN"> */}
          <AdminManagementPage />
        {/* </ProtectedRoute> */}
      </LazyPage>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);
