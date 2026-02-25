import GoogleIcon from '../../assets/icons/google.svg';
import { useState } from 'react';

const SignupForm = () => {
  const [authType, setAuthType] = useState<'phone' | 'email'>('phone');
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);

  return (
    <div className="space-y-3.5">
      <input type="text" placeholder="이름" className="input" />

      <input type="text" placeholder="부서" className="input" />

      <input type="password" placeholder="비밀번호" className="input" />

      <input type="password" placeholder="비밀번호 확인" className="input" />

      <input
        type="text"
        placeholder={authType === 'phone' ? '휴대폰 번호' : '이메일'}
        className="input"
      />

      {/* 인증 방식 선택 */}
      <div className="mx-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <label className="flex cursor-pointer items-center gap-1">
            <input
              type="radio"
              name="auth"
              checked={authType === 'phone'}
              onChange={() => setAuthType('phone')}
              className="accent-main-blue"
            />
            휴대폰 인증
          </label>

          <label className="flex cursor-pointer items-center gap-1">
            <input
              type="radio"
              name="auth"
              checked={authType === 'email'}
              onChange={() => setAuthType('email')}
              className="accent-main-blue"
            />
            이메일 인증
          </label>
        </div>

        <button
          type="button"
          onClick={() => setIsVerificationOpen(true)}
          className="bg-main-blue rounded-lg px-4 py-1.5 text-xs font-medium text-white shadow transition hover:bg-[#4F63D9]"
        >
          {authType === 'phone' ? '휴대폰 인증' : '이메일 인증'}
        </button>
      </div>

      {/* 인증번호 입력칸 (조건부 렌더링) */}
      {isVerificationOpen && (
        <input
          type="text"
          placeholder="인증번호를 입력해주세요"
          className="input"
        />
      )}

      <button className="bg-main-blue w-full rounded-lg py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#4F63D9] hover:shadow active:translate-y-0">
        회원가입
      </button>

      {/* 구분선 */}
      <div className="flex items-center py-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300/60 to-gray-300"></div>
        <span className="px-3 text-xs text-gray-400">or</span>
        <div className="h-px flex-1 bg-gradient-to-r from-gray-300 via-gray-300/60 to-transparent"></div>
      </div>

      {/* 구글 로그인 */}
      <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] py-2 text-sm font-semibold transition hover:bg-gray-50">
        <img src={GoogleIcon} alt="google" className="h-4 w-4" />
        구글 계정으로 시작하기
      </button>
    </div>
  );
};

export default SignupForm;
