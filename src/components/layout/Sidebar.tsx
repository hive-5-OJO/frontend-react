import { NavLink } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import dashboardIcon from '../../assets/icons/dashboard-icon.svg';
import customerIcon from '../../assets/icons/customers-icon.svg';
import analysisIcon from '../../assets/icons/analysis-icon.svg';

const Sidebar = () => {
  const baseStyle =
    'flex items-center gap-3 font-md rounded-lg px-4 py-4 text-md transition-colors';

  const activeStyle = 'bg-gray-100 font-semibold';
  const hoverStyle = 'hover:bg-gray-100';

  return (
    <aside className="bg-section-bg flex h-full w-64 flex-col rounded-xl pb-6 shadow-sm">
      <div className="mb-3 flex h-20 flex-shrink-0 items-center justify-center pt-5">
        <img src={logo} alt="logo" className="h-15" />
      </div>

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
