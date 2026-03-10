import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import { useLoginMutation } from '@/features/auth/login/model/useLoginMutation';
import { redirectToGoogleAuth } from '@/features/auth/google-auth/utils/googleAuthUrl';
import { useToast } from '@/shared/hooks';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Divider } from '@/shared/ui/divider';
import { Icon } from '@/shared/ui/icon';
import GoogleIcon from '@/assets/icons/google.svg';
import { ROUTES } from '@/shared/constants/routes';

const LoginPage = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending: isLoading } = useLoginMutation();
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
        <p className="mt-6 text-center text-sm text-gray-500">
          처음 오셨나요?{'  '}
          <span
            onClick={() => navigate(ROUTES.SIGNUP)}
            className="text-main-blue cursor-pointer font-bold transition-colors duration-200 hover:text-[#4F63D9] hover:underline"
          >
            회원가입
          </span>
        </p>
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

      <Button
        type="button"
        variant="secondary"
        fullWidth
        onClick={redirectToGoogleAuth}
        leftIcon={<Icon src={GoogleIcon} alt="google" size="sm" />}
      >
        Google
      </Button>
    </AuthLayout>
  );
};

export default LoginPage;
