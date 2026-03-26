import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import { useLoginMutation } from '@/features/auth/login/model/useLoginMutation';
import { redirectToGoogleAuth } from '@/features/auth/google-auth/utils/googleAuthUrl';
import { useAuthStore } from '@/entities/user/model/store';
import { useToast } from '@/shared/hooks';
import { ROUTES } from '@/shared/constants/routes';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Divider } from '@/shared/ui/divider';
import { Icon } from '@/shared/ui/icon';
import GoogleIcon from '@/assets/icons/google.svg';
import { MonitorSmartphone } from 'lucide-react';

const LoginPage = () => {
  const { mutate: login, isPending: isLoading } = useLoginMutation();
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warning('입력 오류', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    login({ email, password });
  };

  return (
    <AuthLayout
      title="로그인"
      footer={
        <></>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />

        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />

        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          {isLoading ? '로그인 중...' : '로그인'}
        </Button>
      </form>

      <Divider text="or" variant="gradient" className="my-4" />

      <div className='flex flex-col gap-4'>
        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={redirectToGoogleAuth}
          leftIcon={<Icon src={GoogleIcon} alt="google" size="sm" />}
          >
          Google
        </Button>
        <Button
          type="button"
          variant="default"
          fullWidth
          onClick={() => {
            setAuth({
              accessToken: 'guest-token',
              refreshToken: 'guest-refresh',
              user: {
                adminId: 0,
                name: '게스트',
                email: 'guest@demo.com',
                role: 'GUEST',
                status: 'ACTIVE',
              },
            });
            navigate(ROUTES.HOME);
          }}
          leftIcon={<MonitorSmartphone size={16} />}
          >
          로그인 없이 메인페이지 이동
        </Button> 
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
