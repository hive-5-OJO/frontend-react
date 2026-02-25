import { NavLink } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import dashboardIcon from '../../assets/icons/dashboard-icon.svg';
import customerIcon from '../../assets/icons/customers-icon.svg';
import analysisIcon from '../../assets/icons/analysis-icon.svg';

interface Props {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: Props) => {
  const baseStyle =
    'flex items-center gap-3 font-md rounded-lg px-4 py-4 text-md transition-colors';

  const activeStyle = 'bg-gray-100 font-semibold';
  const hoverStyle = 'hover:bg-gray-100';

  return (
    <aside className="bg-section-bg relative flex h-full w-64 flex-col pb-6 shadow-lg md:rounded-xl">
      {/* 로고 영역 */}
      <div className="mb-3 flex h-20 flex-shrink-0 items-center justify-center pt-5">
        <img src={logo} alt="logo" className="h-12 md:h-15" />
      </div>

      {/* 닫기 버튼 (모바일만) - 절대 위치 */}
      <button
        onClick={onClose}
        className="absolute right-4 top-6 text-gray-500 transition-colors hover:text-gray-700 md:hidden"
        aria-label="메뉴 닫기"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* 구분선 */}
      <div className="flex flex-shrink-0 items-center">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300/60 to-gray-300"></div>
        <div className="h-px flex-1 bg-gradient-to-r from-gray-300 via-gray-300/60 to-transparent"></div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {/* 대시보드 */}
        <NavLink
          to="/"
          end
          onClick={onClose}
          className={({ isActive }) =>
            `${baseStyle} ${isActive ? activeStyle : hoverStyle}`
          }
        >
          <img src={dashboardIcon} alt="dashboard" className="h-4 w-4" />
          <span>대시보드</span>
        </NavLink>

        {/* 고객 관리 */}
        <NavLink
          to="/customers"
          onClick={onClose}
          className={({ isActive }) =>
            `${baseStyle} ${isActive ? activeStyle : hoverStyle}`
          }
        >
          <img src={customerIcon} alt="customers" className="h-5 w-5" />
          <span>고객 관리</span>
        </NavLink>

        {/* 분석 */}
        <NavLink
          to="/analysis"
          onClick={onClose}
          className={({ isActive }) =>
            `${baseStyle} ${isActive ? activeStyle : hoverStyle}`
          }
        >
          <img src={analysisIcon} alt="analysis" className="h-4 w-4" />
          <span>분석 및 통계</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
