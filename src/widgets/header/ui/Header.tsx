import headerMascot from '@/assets/images/header-mascot.png';
import adminIcon from '@/assets/icons/admin-icon.svg';
import logoutIcon from '@/assets/icons/logout-icon.svg';
import { Icon, IconButton } from '@/shared/ui';
import { useLogoutMutation } from '@/features/auth/logout/useLogoutMutation';
import { useAuthStore } from '@/entities/user/model/store';

interface Props {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: Props) => {
  const { mutate: logout } = useLogoutMutation();
  const { user } = useAuthStore();

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
        <span>{user?.name || '관리자'}님</span>
        {user?.role === 'ADMIN' && (
          <IconButton
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            icon={
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            }
            tooltip="관리자 설정"
            tooltipPosition="bottom"
            aria-label="설정"
            onClick={() => {
              // TODO: 설정 페이지로 이동 또는 설정 모달 열기
              console.log('설정 클릭');
            }}
          />
        )}
        <IconButton
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20"
          icon={<Icon src={logoutIcon} alt="logout" size="sm" />}
          tooltip="로그아웃"
          tooltipPosition="bottom"
          aria-label="로그아웃"
          onClick={() => logout()}
        />
      </div>
    </header>
  );
};

export default Header;
