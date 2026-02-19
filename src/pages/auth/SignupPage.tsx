import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import SignupForm from '../../components/auth/SignupForm';

const SignupPage = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="회원가입"
      footer={
        <p className="mt-6 text-center text-sm text-gray-500">
          이미 계정이 있으신가요?{' '}
          <span
            onClick={() => navigate('/login')}
            className="cursor-pointer font-bold text-[#5E72E4] transition-colors duration-200 hover:text-[#4F63D9] hover:underline"
          >
            로그인
          </span>
        </p>
      }
    >
      <SignupForm />
    </AuthLayout>
  );
};

export default SignupPage;
