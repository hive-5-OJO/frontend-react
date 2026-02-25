import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface Props {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="bg-content-bg relative min-h-screen">
      {/* 상단 파랑 배경 */}
      <div className="bg-main-blue absolute top-0 left-0 h-[200px] w-full md:h-[280px]" />

      <div className="relative flex min-h-screen flex-col md:flex-row">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative md:my-6 md:ml-6 md:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>

        {/* Main 영역 */}
        <div className="flex min-h-0 flex-1 flex-col px-4 md:px-8">
          <Header onMenuClick={() => setIsSidebarOpen(true)} />
          <div className="scrollbar-hide flex-1 overflow-y-auto pt-4 pb-6">
            {/* 실제 메인 섹션 */}
            <main className="mx-2 md:mx-8">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;