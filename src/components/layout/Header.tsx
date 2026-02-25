import headerMascot from '../../assets/images/header-mascot.png';
import adminIcon from '../../assets/icons/admin-icon.svg';
import logoutIcon from '../../assets/icons/logout-icon.svg';

interface Props {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: Props) => {
  return (
    <header className="bg-main-blue relative mr-10 flex h-20 items-center px-8 text-white">
      {/* 햄버거 메뉴 버튼 (모바일만) */}
      <button
        onClick={onMenuClick}
        className="mr-4 flex flex-col gap-1 md:hidden"
        aria-label="메뉴 열기"
      >
        <span className="h-0.5 w-6 bg-white"></span>
        <span className="h-0.5 w-6 bg-white"></span>
        <span className="h-0.5 w-6 bg-white"></span>
      </button>

      <div className="absolute left-1/2 -translate-x-1/2">
        <img src={headerMascot} alt="penguin" className="h-16" />
      </div>

      <div className="ml-auto flex items-center gap-2 text-sm">
        <img src={adminIcon} alt="admin" className="h-4 w-4" />
        <span>관리자님</span>
        <button className="rounded-md px-2 py-1 hover:bg-white/30">
          <img src={logoutIcon} alt="logout" className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;
