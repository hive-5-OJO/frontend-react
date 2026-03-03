import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/entities/user/model/store';
import { ROUTES } from '@/shared/constants/routes';

export const useLogout = () => {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  const logout = () => {
    clearAuth();
    navigate(ROUTES.LOGIN);
  };

  return { logout };
};
