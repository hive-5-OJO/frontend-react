import GoogleIcon from '../../assets/icons/google.svg';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="로그인"
      footer={
        <p className="mt-6 text-center text-sm text-gray-500">
          처음 오셨나요?{'  '}
          <span
            onClick={() => navigate('/signup')}
            className="text-main-blue cursor-pointer font-bold transition-colors duration-200 hover:text-[#4F63D9] hover:underline"
          >
            회원가입
          </span>
        </p>
      }
    >
      <input type="email" placeholder="이메일" className="input" />

      <input type="password" placeholder="비밀번호" className="input" />

      <button className="bg-main-blue w-full rounded-lg py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#4F63D9] hover:shadow active:translate-y-0">
        로그인
      </button>

      {/* 구분선 */}
      <div className="my-4 flex items-center">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300/60 to-gray-300"></div>
        <span className="px-3 text-xs text-gray-400">or</span>
        <div className="h-px flex-1 bg-gradient-to-r from-gray-300 via-gray-300/60 to-transparent"></div>
      </div>

      <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] py-2 text-sm font-semibold transition hover:bg-gray-50">
        <img src={GoogleIcon} alt="google" className="h-4 w-4" />
        Google
      </button>
    </AuthLayout>
  );
};

export default LoginPage;
