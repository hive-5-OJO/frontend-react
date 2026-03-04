import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Logo, Icon, IconButton, Divider } from '@/shared/ui';
import dashboardIcon from '@/assets/icons/dashboard-icon.svg';
import customerIcon from '@/assets/icons/customers-icon.svg';
import analysisIcon from '@/assets/icons/analysis-icon.svg';
import { ROUTES } from '@/shared/constants/routes';

interface Props {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: Props) => {
  const location = useLocation();
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(
    location.pathname.startsWith('/analysis')
  );

  const baseStyle =
    'flex items-center gap-3 font-md rounded-lg px-4 py-4 text-md transition-colors';
  const activeStyle = 'bg-gray-100 font-semibold';
  const hoverStyle = 'hover:bg-gray-100';
  const subItemStyle = 'flex items-center gap-3 rounded-lg pl-10 pr-4 py-3 text-sm transition-colors';

  const toggleAnalysis = () => {
    setIsAnalysisOpen(!isAnalysisOpen);
  };

  return (
    <aside className="bg-section-bg relative flex h-full w-64 flex-col pb-6 shadow-lg md:rounded-xl">
      {/* 로고 영역 */}
      <div className="mb-3 flex h-20 flex-shrink-0 items-center justify-center pt-5">
        <Logo size="lg" />
      </div>

      {/* 닫기 버튼 (모바일만) */}
      <IconButton
        onClick={onClose}
        variant="ghost"
        size="sm"
        className="absolute right-4 top-6 text-gray-500 hover:bg-gray-100 md:hidden"
        icon={
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        }
        aria-label="메뉴 닫기"
      />

      <Divider variant="gradient" />

      <nav className="flex-1 space-y-2 p-4">
        <NavLink
          to={ROUTES.HOME}
          end
          onClick={onClose}
          className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : hoverStyle}`}
        >
          <Icon src={dashboardIcon} alt="dashboard" size="sm" />
          <span>대시보드</span>
        </NavLink>

        <NavLink
          to={ROUTES.CUSTOMERS}
          onClick={onClose}
          className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : hoverStyle}`}
        >
          <Icon src={customerIcon} alt="customers" size="md" />
          <span>고객 관리</span>
        </NavLink>

        {/* 분석 및 통계 - 토글 가능 */}
        <div>
          <button
            onClick={toggleAnalysis}
            className={`${baseStyle} ${hoverStyle} w-full justify-between`}
          >
            <div className="flex items-center gap-3">
              <Icon src={analysisIcon} alt="analysis" size="sm" />
              <span>분석 및 통계</span>
            </div>
            <svg
              className={`h-5 w-5 transition-transform ${isAnalysisOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* 하위 메뉴 */}
          {isAnalysisOpen && (
            <div className="mt-1 space-y-1">
              <NavLink
                to={ROUTES.ANALYSIS_RFM}
                onClick={onClose}
                className={({ isActive }) =>
                  `${subItemStyle} ${isActive ? activeStyle : hoverStyle}`
                }
              >
                <span>RFM 분석</span>
              </NavLink>
              <NavLink
                to={ROUTES.ANALYSIS_COHORT}
                onClick={onClose}
                className={({ isActive }) =>
                  `${subItemStyle} ${isActive ? activeStyle : hoverStyle}`
                }
              >
                <span>코호트 분석</span>
              </NavLink>
              <NavLink
                to={ROUTES.ANALYSIS_REGIONAL}
                onClick={onClose}
                className={({ isActive }) =>
                  `${subItemStyle} ${isActive ? activeStyle : hoverStyle}`
                }
              >
                <span>지역 기반 분석</span>
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
