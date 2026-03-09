import mascotLogin from '/src/assets/images/landing-mascot.png';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  footer: React.ReactNode;
}

const AuthLayout = ({ children, title, footer }: AuthLayoutProps) => {
  return (
    <div className="bg-content-bg flex min-h-screen flex-col md:flex-row">
      {/* 왼쪽 영역 */}
      <div className="mt-16 flex w-full items-center justify-center px-6 py-8 md:mt-0 md:w-1/2 md:py-12">
        <div className="relative w-full max-w-[420px]">
          {/* 마스코트 */}
          <div className="absolute -top-16 left-1/2 z-10 w-48 -translate-x-1/2 sm:w-52 md:-top-18 md:w-56">
            <img
              src={mascotLogin}
              alt="character"
              className="h-auto w-full drop-shadow-lg"
            />
          </div>

          {/* 박스 영역 */}
          <div className="mt-14 flex min-h-[580px] flex-col justify-center rounded-2xl bg-white p-8 shadow-md sm:p-10 md:mt-16 md:min-h-[640px]">
            <h2 className="mb-6 text-center text-lg font-bold">{title}</h2>

            {children}

            {footer}
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

export default AuthLayout;
