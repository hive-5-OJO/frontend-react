import headerMascot from '@/assets/images/header-mascot.png';
import adminIcon from '@/assets/icons/admin-icon.svg';
import logoutIcon from '@/assets/icons/logout-icon.svg';
import { Icon, IconButton } from '@/shared/ui';
import { useLogoutMutation } from '@/features/auth/logout/useLogoutMutation';

interface Props {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: Props) => {
  const { mutate: logout } = useLogoutMutation();

  return (
    <header className="bg-main-blue relative flex h-20 items-center px-8 text-white">
      {/* 햄버거 메뉴 버튼 (모바일만) */}
      <IconButton
        variant="ghost"
        size="md"
        onClick={onMenuClick}
        className="mr-4 text-white hover:bg-white/20 md:hidden"
        icon={
          <div className="flex flex-col gap-1">
            <span className="h-0.5 w-6 bg-white"></span>
            <span className="h-0.5 w-6 bg-white"></span>
            <span className="h-0.5 w-6 bg-white"></span>
          </div>
        }
        aria-label="메뉴 열기"
      />

      <div className="absolute left-1/2 -translate-x-1/2">
        <img src={headerMascot} alt="penguin" className="h-16" />
      </div>

      <div className="ml-auto flex items-center gap-2 text-sm">
        <Icon src={adminIcon} alt="admin" size="sm" />
        <span>관리자님</span>
        <IconButton
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20"
          icon={<Icon src={logoutIcon} alt="logout" size="sm" />}
          tooltip="로그아웃"
          tooltipPosition="bottom"
          aria-label="로그아웃"
          onClick={logout}
        />
      </div>
    </header>
  );
};

export default Header;
