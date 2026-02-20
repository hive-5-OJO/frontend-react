import DashboardLayout from '../../components/layout/DashboardLayout';
import increaseIcon from '../../assets/icons/increase-icon.svg';
import decreaseIcon from '../../assets/icons/decrease-icon.svg';

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <div className="my-3 ml-5 flex flex-col gap-2">
        <h2 className="text-2xl font-bold">관리자님, 안녕하세요!</h2>
        <h3 className="text-white/60">
          CRM 및 마케팅 데이터 인사이트를 확인하세요.
        </h3>
      </div>

      {/* 첫 번째 보드 */}
      <div className="mb-8 grid grid-cols-4 gap-6">
        <div className="bg-section-bg shadow-card flex flex-col justify-center gap-1 rounded-xl p-6">
          <p className="text-md font-semibold text-gray-500">현재 고객</p>
          <p className="my-1 text-2xl font-bold">
            100,850 <span>명</span>
          </p>
          <div className="mt-1 flex items-center text-xs text-green-500">
            <img src={increaseIcon} alt="increase" className="h-5 w-5" />
            <p className="flex gap-3 text-base font-bold">
              5.2%{' '}
              <span className="font-medium text-gray-400">지난주 대비</span>
            </p>
          </div>
        </div>

        <div className="bg-section-bg shadow-card flex flex-col justify-center gap-1 rounded-xl p-6">
          <p className="text-md font-semibold text-gray-500">
            이 달 새 활성 고객
          </p>
          <p className="my-1 text-2xl font-bold">
            1,850 <span>명</span>
          </p>
          <div className="mt-1 flex items-center text-xs text-green-500">
            <img src={increaseIcon} alt="increase" className="h-5 w-5" />
            <p className="flex gap-3 text-base font-bold">
              5.2%{' '}
              <span className="font-medium text-gray-400">지난주 대비</span>
            </p>
          </div>
        </div>

        <div className="bg-section-bg shadow-card flex flex-col justify-center gap-1 rounded-xl p-6">
          <p className="text-md font-semibold text-gray-500">신규 고객</p>
          <p className="my-1 text-2xl font-bold">850 명</p>
          <div className="mt-1 flex items-center text-xs text-green-500">
            <img src={increaseIcon} alt="increase" className="h-5 w-5" />
            <p className="flex gap-3 text-base font-bold">
              5.2%{' '}
              <span className="font-medium text-gray-400">지난주 대비</span>
            </p>
          </div>
        </div>

        <div className="bg-section-bg shadow-card flex flex-col justify-center gap-1 rounded-xl p-6">
          <p className="text-md font-semibold text-gray-500">신규 고객</p>
          <p className="my-1 text-2xl font-bold">850 명</p>
          <div className="mt-1 flex items-center text-xs text-yellow-500">
            <img src={decreaseIcon} alt="increase" className="h-5 w-5" />
            <p className="flex gap-3 text-base font-bold">
              5.2%{' '}
              <span className="font-medium text-gray-400">지난주 대비</span>
            </p>
          </div>
        </div>
      </div>

      {/* 인사이트 영역 */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="mb-2 ml-3 text-xl font-bold">고객 인사이트</h2>
          <div className="bg-section-bg shadow-card h-80 rounded-xl p-6">
            최근 7일 트렌드, 고객 분포 현황 등
          </div>
        </div>

        <div>
          <h2 className="mb-2 ml-3 text-xl font-bold">상담 인사이트 요약</h2>
          <div className="bg-section-bg shadow-card h-80 rounded-xl p-6">
            상담 통계 차트 등
          </div>
        </div>

        <div>
          <h2 className="mb-2 ml-3 text-xl font-bold">상담 인사이트 요약</h2>
          <div className="bg-section-bg shadow-card h-80 rounded-xl p-6">
            차트 영역
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
