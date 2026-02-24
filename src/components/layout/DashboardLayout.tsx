import Sidebar from './Sidebar';
import Header from './Header';

interface Props {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  return (
    <div className="bg-content-bg relative h-screen">
      {/* 상단 파랑 배경 */}
      <div className="bg-main-blue absolute top-0 left-0 h-[280px] w-full" />

      <div className="relative flex h-full">
        {/* Sidebar */}
        <div className="my-6 ml-6 flex">
          <Sidebar />
        </div>

        {/* Main 영역 */}
        <div className="flex min-h-0 flex-1 flex-col px-8">
          <Header />
          <div className="scrollbar-hide flex-1 overflow-y-auto pt-4 pb-6">
            {/* 실제 메인 섹션 */}
            <main className="mx-8">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
