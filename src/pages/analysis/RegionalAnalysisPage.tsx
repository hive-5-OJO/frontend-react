import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { DashboardLayout } from '@/widgets/dashboard-layout';
import { Card, CardContent, PageHeader, FilterToggleButton } from '@/shared/ui';

// Mapbox Access Token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example';

const mockRegionalData = [
  { region: '서울', lat: 37.5665, lng: 126.978, customers: 8420, percentage: 32.5, avgConsult: 4.2, utilization: 72 },
  { region: '경기', lat: 37.4138, lng: 127.5183, customers: 6850, percentage: 26.4, avgConsult: 3.8, utilization: 68 },
  { region: '부산', lat: 35.1796, lng: 129.0756, customers: 3120, percentage: 12.0, avgConsult: 3.5, utilization: 65 },
  { region: '인천', lat: 37.4563, lng: 126.7052, customers: 2450, percentage: 9.4, avgConsult: 3.3, utilization: 63 },
  { region: '대구', lat: 35.8714, lng: 128.6014, customers: 1890, percentage: 7.3, avgConsult: 3.1, utilization: 60 },
  { region: '대전', lat: 36.3504, lng: 127.3845, customers: 1520, percentage: 5.9, avgConsult: 2.9, utilization: 58 },
  { region: '광주', lat: 35.1595, lng: 126.8526, customers: 1180, percentage: 4.5, avgConsult: 2.7, utilization: 55 },
  { region: '울산', lat: 35.5384, lng: 129.3114, customers: 520, percentage: 2.0, avgConsult: 2.5, utilization: 52 },
];

const getUtilizationColor = (value: number) => {
  if (value >= 65) return 'bg-green-100 text-green-700';
  if (value >= 55) return 'bg-yellow-100 text-yellow-700';
  return 'bg-orange-100 text-orange-700';
};

const getMarkerColor = (customers: number) => {
  if (customers >= 5000) return '#ef4444';
  if (customers >= 2000) return '#f59e0b';
  return '#3b82f6';
};

const getMarkerSize = (customers: number) => {
  if (customers >= 5000) return 1.5;
  if (customers >= 2000) return 1.2;
  return 1;
};

const RegionalAnalysisPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [isFloatingEnabled, setIsFloatingEnabled] = useState(true);
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [headerPosition, setHeaderPosition] = useState({ left: 0, width: 'auto' as string | number });
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerPlaceholderRef = useRef<HTMLDivElement>(null);

  // 헤더 위치와 크기 업데이트
  useEffect(() => {
    const updateHeaderDimensions = () => {
      if (headerRef.current && headerPlaceholderRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
        const rect = headerPlaceholderRef.current.getBoundingClientRect();
        setHeaderPosition({
          left: rect.left,
          width: headerPlaceholderRef.current.offsetWidth
        });
      }
    };

    updateHeaderDimensions();
    window.addEventListener('resize', updateHeaderDimensions);
    return () => window.removeEventListener('resize', updateHeaderDimensions);
  }, [isFilterOpen]);

  // 스크롤 이벤트로 헤더 고정 처리 (플로팅이 활성화된 경우에만)
  useEffect(() => {
    const handleScroll = () => {
      if (!isFloatingEnabled) {
        setIsHeaderFixed(false);
        return;
      }
      
      if (headerPlaceholderRef.current) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const headerTop = headerPlaceholderRef.current.offsetTop;
        
        if (scrollTop > headerTop - 80) { // Header 높이 고려
          setIsHeaderFixed(true);
        } else {
          setIsHeaderFixed(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFloatingEnabled]);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRegionDropdownOpen(false);
      }
    };

    if (isRegionDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isRegionDropdownOpen]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12', // 컬러풀한 스타일로 변경
      center: [127.5, 36.5],
      zoom: 6.5,
      attributionControl: false,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // 맵 로드 후 한글 레이블로 변경
    map.current.on('load', () => {
      const style = map.current!.getStyle();
      if (style?.layers) {
        style.layers.forEach((layer) => {
          if (layer.type === 'symbol' && (layer.layout as Record<string, unknown>)?.['text-field']) {
            map.current!.setLayoutProperty(layer.id, 'text-field', ['coalesce', ['get', 'name_ko'], ['get', 'name']]);
          }
        });
      }
    });

    mockRegionalData.forEach((data) => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = `${30 * getMarkerSize(data.customers)}px`;
      el.style.height = `${30 * getMarkerSize(data.customers)}px`;
      el.style.borderRadius = '50%';
      el.style.backgroundColor = getMarkerColor(data.customers);
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';

      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`
        <div style="padding: 12px; min-width: 200px;">
          <h4 style="font-weight: bold; font-size: 15px; margin-bottom: 10px; color: #111827;">${data.region}</h4>
          <div style="font-size: 13px; color: #6b7280; line-height: 1.7;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span>고객 수:</span>
              <span style="font-weight: 600; color: #111827;">${data.customers.toLocaleString()}명</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span>비율:</span>
              <span style="font-weight: 600; color: #111827;">${data.percentage}%</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span>평균 상담:</span>
              <span style="font-weight: 600; color: #111827;">${data.avgConsult}회</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>이용률:</span>
              <span style="font-weight: 600; color: #10b981;">${data.utilization}%</span>
            </div>
          </div>
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([data.lng, data.lat])
        .setPopup(popup)
        .addTo(map.current!);

      markers.current.push(marker);

      el.addEventListener('mouseenter', () => {
        popup.addTo(map.current!);
      });

      el.addEventListener('mouseleave', () => {
        popup.remove();
      });
    });

    return () => {
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    const filteredData = selectedRegions.length === 0
      ? mockRegionalData 
      : mockRegionalData.filter((d) => selectedRegions.includes(d.region));

    if (filteredData.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      filteredData.forEach((data) => {
        bounds.extend([data.lng, data.lat]);
      });
      map.current.fitBounds(bounds, { padding: 100, maxZoom: 10 });
    }
  }, [selectedRegions]);

  const handleRegionToggle = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    );
  };

  const handleSelectAll = () => {
    if (selectedRegions.length === mockRegionalData.length) {
      setSelectedRegions([]);
    } else {
      setSelectedRegions(mockRegionalData.map((d) => d.region));
    }
  };

  const handleClearSelection = () => {
    setSelectedRegions([]);
  };

  const totalCustomers = mockRegionalData.reduce((sum, d) => sum + d.customers, 0);
  const avgUtilization = (mockRegionalData.reduce((sum, d) => sum + d.utilization, 0) / mockRegionalData.length).toFixed(1);
  const topRegion = mockRegionalData[0];

  return (
    <DashboardLayout>
      {/* Placeholder for fixed header */}
      <div ref={headerPlaceholderRef} style={{ height: isHeaderFixed && isFloatingEnabled ? headerHeight : 0 }} />
      
      {/* 필터 섹션 */}
      <div 
        ref={headerRef}
        className={`flex-shrink-0 rounded-xl border border-gray-100 bg-white shadow-sm transition-all ${
          isHeaderFixed && isFloatingEnabled
            ? 'fixed top-[80px] z-30' 
            : 'mb-6'
        }`}
        style={isHeaderFixed && isFloatingEnabled ? {
          left: headerPosition.left,
          width: headerPosition.width
        } : undefined}
      >
        <div className="p-6 pb-4">
          <PageHeader
            title="지역 기반 분석"
            description="지역별 고객 분포 및 서비스 이용 현황 분석"
            actions={
              <div className="flex items-center gap-3">
                {/* 플로팅 토글 버튼 */}
                <button
                  onClick={() => setIsFloatingEnabled(!isFloatingEnabled)}
                  className="flex w-[110px] items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-colors hover:border-gray-300 hover:bg-gray-50"
                  title={isFloatingEnabled ? '필터 고정 해제' : '필터 고정 활성화'}
                >
                  {isFloatingEnabled ? (
                    <>
                      <svg className="h-4 w-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                      </svg>
                      <span className="text-gray-700">고정됨</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                      </svg>
                      <span className="text-gray-500">고정 해제</span>
                    </>
                  )}
                </button>
                <FilterToggleButton isOpen={isFilterOpen} onToggle={() => setIsFilterOpen(!isFilterOpen)} />
              </div>
            }
          />
        </div>

        {isFilterOpen && (
          <div className="space-y-4 px-6 pb-6">
            <div className="flex items-start gap-4">
              {/* 지역 선택 드롭다운 */}
              <div ref={dropdownRef} className="relative w-[240px]">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">지역 선택</label>
                <button
                  onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
                  className="flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-colors hover:border-gray-300 focus-visible:border-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  <span className="text-gray-700">
                    {selectedRegions.length === 0
                      ? '전체'
                      : `${selectedRegions.length}개 지역 선택됨`}
                  </span>
                  <svg
                    className={`h-4 w-4 text-gray-400 transition-transform ${isRegionDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isRegionDropdownOpen && (
                  <div className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                    <div className="border-b border-gray-100 p-3">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={handleSelectAll}
                          className="text-sm font-medium text-primary-600 hover:text-primary-700"
                        >
                          {selectedRegions.length === mockRegionalData.length ? '전체 해제' : '전체 선택'}
                        </button>
                        {selectedRegions.length > 0 && (
                          <button
                            onClick={handleClearSelection}
                            className="text-sm text-gray-500 hover:text-gray-700"
                          >
                            초기화
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-[280px] overflow-y-auto p-2">
                      {mockRegionalData.map((data) => (
                        <label
                          key={data.region}
                          className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedRegions.includes(data.region)}
                            onChange={() => handleRegionToggle(data.region)}
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
                          />
                          <span className="flex-1 text-sm text-gray-700">{data.region}</span>
                          <span className="text-xs text-gray-500">{data.customers.toLocaleString()}명</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 선택된 지역 태그 + 초기화 버튼 */}
              {selectedRegions.length > 0 && (
                <div className="flex flex-1 items-center gap-3 pt-7">
                  <div className="flex flex-1 flex-wrap items-center gap-2">
                    {selectedRegions.map((region) => (
                      <button
                        key={region}
                        onClick={() => handleRegionToggle(region)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-primary-300 bg-primary-50 px-3 py-1 text-sm text-primary-700 transition hover:bg-primary-100"
                      >
                        <span>{region}</span>
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleClearSelection}
                    className="shrink-0 text-sm font-medium text-gray-500 transition hover:text-error-600"
                  >
                    초기화
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 pb-6">

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-2 text-sm font-semibold text-gray-500">총 고객 수</h3>
              <p className="text-3xl font-bold text-gray-900">{totalCustomers.toLocaleString()}</p>
              <p className="mt-1 text-xs text-gray-500">전국 기준</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-2 text-sm font-semibold text-gray-500">최다 고객 지역</h3>
              <p className="text-3xl font-bold text-gray-900">{topRegion.region}</p>
              <p className="mt-1 text-xs text-gray-500">전체의 {topRegion.percentage}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-2 text-sm font-semibold text-gray-500">평균 서비스 이용률</h3>
              <p className="text-3xl font-bold text-gray-900">{avgUtilization}%</p>
              <p className="mt-1 text-xs text-gray-500">지역별 평균</p>
            </CardContent>
          </Card>
        </div>

        {/* 지역별 테이블 */}
        <div className="flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900">지역별 고객 현황</h3>
            <p className="mt-1 text-sm text-gray-500">시/도별 고객 수 및 서비스 이용 현황</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-y border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">지역</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">고객 수</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">비율</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                    평균 상담 횟수
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                    서비스 이용률
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockRegionalData
                  .filter((d) => selectedRegions.length === 0 || selectedRegions.includes(d.region))
                  .map((data) => (
                    <tr key={data.region} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{data.region}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {data.customers.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{data.percentage}%</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{data.avgConsult}</td>
                      <td className="px-6 py-4 text-center text-sm">
                        <span className={`inline-block rounded px-2 py-1 ${getUtilizationColor(data.utilization)}`}>
                          {data.utilization}%
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 지도 */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-gray-900">지역별 고객 분포 지도</h4>
                <p className="mt-1 text-sm text-gray-500">마커 크기와 색상은 고객 수를 나타냅니다</p>
              </div>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <span className="text-gray-600">5,000명 이상</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                  <span className="text-gray-600">2,000-5,000명</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-gray-600">2,000명 미만</span>
                </div>
              </div>
            </div>
            <div ref={mapContainer} className="h-[500px] w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RegionalAnalysisPage;