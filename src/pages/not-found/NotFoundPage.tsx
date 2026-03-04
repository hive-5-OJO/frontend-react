import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui';
import mascot from '@/assets/images/404-mascot.png';
import { ROUTES } from '@/shared/constants/routes';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <img src={mascot} alt="404" className="mb-8 w-64" />
      <h1 className="mb-2 text-6xl font-bold text-gray-900">404</h1>
      <p className="mb-1 text-xl font-semibold text-gray-700">페이지를 찾을 수 없습니다</p>
      <p className="mb-8 text-sm text-gray-500">
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>
          이전 페이지
        </Button>
        <Button variant="primary" onClick={() => navigate(ROUTES.HOME)}>
          홈으로 이동
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
