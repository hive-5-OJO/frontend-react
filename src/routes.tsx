import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import GoogleCallbackPage from './pages/auth/GoogleCallbackPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CustomersPage from './pages/customers/CustomersPage';
import AnalysisPage from './pages/analysis/AnalysisPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

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
    path: '/oauth/google/callback',
    element: <GoogleCallbackPage />,
  },
  {
    path: '/',
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'customers',
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <CustomersPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: 'analysis',
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <AnalysisPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
]);
