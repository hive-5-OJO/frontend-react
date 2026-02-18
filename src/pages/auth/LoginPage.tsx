import mascotLogin from '/src/assets/images/mascot-login.png';

const LoginPage = () => {
  return (
    <div className="bg-content-bg flex min-h-screen flex-col md:flex-row">
      {/* 왼쪽 영역 */}
      <div className="flex w-full items-center justify-center px-6 py-12 md:w-1/2">
        <div className="relative w-full max-w-[420px]">
          {/* 캐릭터 */}
          <div className="absolute -top-15 left-1/2 z-10 -translate-x-1/2 sm:w-52 md:w-56">
            <img
              src={mascotLogin}
              alt="character"
              className="h-auto w-full drop-shadow-lg"
            />
          </div>

          {/* 로그인 박스 */}
          <div className="mt-16 rounded-2xl bg-white p-8 shadow-md sm:p-10">
            <h2 className="mb-6 text-center text-lg font-bold">로그인</h2>

            <input
              type="email"
              placeholder="이메일"
              className="mb-4 w-full rounded-lg border border-[#E2E8F0] px-4 py-2 text-sm focus:ring-2 focus:ring-[#5E72E4] focus:outline-none"
            />

            <input
              type="password"
              placeholder="비밀번호"
              className="mb-5 w-full rounded-lg border border-[#E2E8F0] px-4 py-2 text-sm focus:ring-2 focus:ring-[#5E72E4] focus:outline-none"
            />

            <button className="w-full rounded-lg bg-[#5E72E4] py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#4F63D9] hover:shadow active:translate-y-0">
              로그인
            </button>

            <div className="my-4 flex items-center">
              {/* 왼쪽 선 */}
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300/60 to-gray-300"></div>

              <span className="px-3 text-xs text-gray-400">or</span>

              {/* 오른쪽 선 */}
              <div className="h-px flex-1 bg-gradient-to-r from-gray-300 via-gray-300/60 to-transparent"></div>
            </div>

            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] py-2 text-sm font-semibold transition hover:bg-gray-50">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="h-4 w-4"
              />
              Google
            </button>

            <p className="mt-6 text-center text-sm text-gray-500">
              처음 오셨나요?{' '}
              <span className="cursor-pointer font-bold text-[#5E72E4] transition-colors duration-200 hover:text-[#4F63D9] hover:underline">
                회원가입
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 오른쪽 영역 */}
      <div className="hidden items-center justify-center rounded-tl-[80px] bg-gray-200 md:flex md:w-1/2">
        <span className="text-lg text-gray-500">이미지</span>
      </div>
    </div>
  );
};

export default LoginPage;
