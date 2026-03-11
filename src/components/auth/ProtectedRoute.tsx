import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/entities/user/model/store';
import { ROUTES } from '@/shared/constants/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'ROLE_ADMIN' | 'MARKETING' | 'CS' | 'GUEST';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { accessToken, user } = useAuthStore();

  if (!accessToken) {
    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // 특정 역할이 필요한 경우 체크
  if (requiredRole) {
    const userRole = user?.role;
    const isAdmin = userRole === 'ADMIN' || userRole === 'ROLE_ADMIN';
    const requiredIsAdmin = requiredRole === 'ADMIN' || requiredRole === 'ROLE_ADMIN';

    // ADMIN 역할이 필요한데 사용자가 ADMIN이 아닌 경우
    if (requiredIsAdmin && !isAdmin) {
      return <Navigate to={ROUTES.HOME} replace />;
    }

    // 다른 역할이 필요한데 일치하지 않는 경우
    if (!requiredIsAdmin && userRole !== requiredRole) {
      return <Navigate to={ROUTES.HOME} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
