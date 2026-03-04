import { useState } from 'react';
import { DashboardLayout } from '@/widgets/dashboard-layout';
import { Card, CardContent, PageHeader, Button, SearchInput, FormSelect } from '@/shared/ui';

const RFMAnalysisPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 pb-6">
        {/* 필터 섹션 */}
        <div className="flex-shrink-0 rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="p-6 pb-4">
            <PageHeader
              title="RFM 분석"
              description="Recency, Frequency, Monetary 기반 고객 세분화 분석"
              actions={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  leftIcon={
                    <svg
                      className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  }
                >
                  {isFilterOpen ? '필터 접기' : '필터 펼치기'}
                </Button>
              }
            />

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <h3 className="text-sm font-semibold text-gray-700">필터 & 검색</h3>
              </div>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="text-right">
                  <p className="text-xl font-bold text-primary-600 md:text-2xl">100,850</p>
                  <p className="text-xs text-gray-500">분석 대상 고객</p>
                </div>
              </div>
            </div>
          </div>

          {isFilterOpen && (
            <div className="space-y-4 px-6 pb-6">
              <div className="flex flex-wrap gap-3">
                <FormSelect
                  label="분석 기간"
                  placeholder="기간 선택"
                  value="3months"
                  options={[
                    { value: '3months', label: '최근 3개월' },
                    { value: '6months', label: '최근 6개월' },
                    { value: '1year', label: '최근 1년' },
                    { value: 'all', label: '전체 기간' },
                  ]}
                />
                <FormSelect
                  label="고객 세그먼트"
                  placeholder="세그먼트 선택"
                  value="all"
                  options={[
                    { value: 'all', label: '전체' },
                    { value: 'vip', label: 'VIP' },
                    { value: 'normal', label: '일반' },
                  ]}
                />
                <FormSelect
                  label="서비스"
                  placeholder="서비스 선택"
                  value="all"
                  options={[
                    { value: 'all', label: '전체' },
                    { value: '5g', label: '5G 프리미엄' },
                    { value: 'lte', label: 'LTE 스탠다드' },
                    { value: 'bundle', label: '결합상품' },
                  ]}
                />
              </div>
              <SearchInput
                placeholder="고객 이름 또는 세그먼트 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm('')}
              />
            </div>
          )}
        </div>

        {/* RFM 지표 요약 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-2 text-sm font-semibold text-gray-500">Recency (최근성)</h3>
              <p className="text-3xl font-bold text-gray-900">평균 15일</p>
              <p className="mt-1 text-xs text-gray-500">마지막 구매 후 경과 일수</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-2 text-sm font-semibold text-gray-500">Frequency (빈도)</h3>
              <p className="text-3xl font-bold text-gray-900">평균 8.5회</p>
              <p className="mt-1 text-xs text-gray-500">기간 내 구매 횟수</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-2 text-sm font-semibold text-gray-500">Monetary (금액)</h3>
              <p className="text-3xl font-bold text-gray-900">평균 450만원</p>
              <p className="mt-1 text-xs text-gray-500">기간 내 총 구매 금액</p>
            </CardContent>
          </Card>
        </div>

        {/* RFM 세그먼트 테이블 */}
        <div className="flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900">RFM 세그먼트 분포</h3>
            <p className="mt-1 text-sm text-gray-500">고객을 RFM 점수에 따라 세분화한 결과</p>
          </div>
          <div className="overflow-x-auto">
            <div className="table-scroll overflow-y-auto scroll-smooth" style={{ height: '589px', minWidth: '800px' }}>
              <table className="w-full">
                <thead className="sticky top-0 z-10 border-y border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      세그먼트
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      고객 수
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      비율
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      평균 구매액
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      R 점수
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      F 점수
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      M 점수
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      특징
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Champions</td>
                    <td className="px-6 py-4 text-sm text-gray-600">15,200명</td>
                    <td className="px-6 py-4 text-sm text-gray-600">15.1%</td>
                    <td className="px-6 py-4 text-sm text-gray-600">850만원</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block rounded bg-green-100 px-2 py-1 text-green-700">5</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block rounded bg-green-100 px-2 py-1 text-green-700">5</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block rounded bg-green-100 px-2 py-1 text-green-700">5</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">최근 구매, 높은 빈도, 높은 금액</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Loyal Customers</td>
                    <td className="px-6 py-4 text-sm text-gray-600">22,400명</td>
                    <td className="px-6 py-4 text-sm text-gray-600">22.2%</td>
                    <td className="px-6 py-4 text-sm text-gray-600">620만원</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block rounded bg-green-100 px-2 py-1 text-green-700">4</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block rounded bg-green-100 px-2 py-1 text-green-700">5</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block rounded bg-yellow-100 px-2 py-1 text-yellow-700">4</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">정기적 구매, 중간 금액</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Potential Loyalists</td>
                    <td className="px-6 py-4 text-sm text-gray-600">18,600명</td>
                    <td className="px-6 py-4 text-sm text-gray-600">18.4%</td>
                    <td className="px-6 py-4 text-sm text-gray-600">480만원</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block rounded bg-green-100 px-2 py-1 text-green-700">5</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block rounded bg-yellow-100 px-2 py-1 text-yellow-700">3</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block rounded bg-yellow-100 px-2 py-1 text-yellow-700">3</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">최근 구매, 성장 가능성</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">At Risk</td>
                    <td className="px-6 py-4 text-sm text-gray-600">12,800명</td>
                    <td className="px-6 py-4 text-sm text-gray-600">12.7%</td>
                    <td className="px-6 py-4 text-sm text-gray-600">320만원</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block rounded bg-orange-100 px-2 py-1 text-orange-700">2</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block rounded bg-yellow-100 px-2 py-1 text-yellow-700">3</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block rounded bg-yellow-100 px-2 py-1 text-yellow-700">3</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">이탈 위험, 재참여 필요</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Hibernating</td>
                    <td className="px-6 py-4 text-sm text-gray-600">31,850명</td>
                    <td className="px-6 py-4 text-sm text-gray-600">31.6%</td>
                    <td className="px-6 py-4 text-sm text-gray-600">180만원</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block rounded bg-red-100 px-2 py-1 text-red-700">1</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block rounded bg-orange-100 px-2 py-1 text-orange-700">2</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block rounded bg-orange-100 px-2 py-1 text-orange-700">2</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">장기 미구매, 재활성화 필요</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RFMAnalysisPage;
