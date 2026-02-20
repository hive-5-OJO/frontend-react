import headerMascot from '../../assets/images/header-mascot.png';
import adminIcon from '../../assets/icons/admin-icon.svg';
import logoutIcon from '../../assets/icons/logout-icon.svg';

const Header = () => {
  return (
    <header className="bg-main-blue relative mr-8 flex h-6 items-center px-8 text-white">
      <div className="absolute left-1/2 -translate-x-1/2">
        <img src={headerMascot} alt="penguin" className="h-18" />
      </div>

      <div className="ml-auto flex items-center gap-3 text-sm">
        <img src={adminIcon} alt="admin" className="h-4 w-4" />
        <span>관리자님</span>
        <button className="rounded-md px-2 py-1 hover:bg-white/30">
          <img src={logoutIcon} alt="logout" className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
