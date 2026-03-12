import { useState, useEffect, useRef, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { DashboardLayout } from '@/widgets/dashboard-layout';
import { Card, CardContent, PageHeader, FilterToggleButton } from '@/shared/ui';
import { useRegionalAnalysis } from '@/entities/analysis';
import type { RegionDistribution } from '@/entities/analysis';

// Mapbox Access Token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example';

// 지역별 좌표 매핑
const REGION_COORDINATES: Record<string, { lat: number; lng: number }> = {
  '서울': { lat: 37.5665, lng: 126.978 },
  '경기': { lat: 37.4138, lng: 127.5183 },
  '부산': { lat: 35.1796, lng: 129.0756 },
  '인천': { lat: 37.4563, lng: 126.7052 },
  '대구': { lat: 35.8714, lng: 128.6014 },
  '대전': { lat: 36.3504, lng: 127.3845 },
  '광주': { lat: 35.1595, lng: 126.8526 },
  '울산': { lat: 35.5384, lng: 129.3114 },
  '세종': { lat: 36.4800, lng: 127.2890 },
  '강원': { lat: 37.8228, lng: 128.1555 },
  '충북': { lat: 36.8000, lng: 127.7000 },
  '충남': { lat: 36.5184, lng: 126.8000 },
  '전북': { lat: 35.7175, lng: 127.1530 },
  '전남': { lat: 34.8679, lng: 126.9910 },
  '경북': { lat: 36.4919, lng: 128.8889 },
  '경남': { lat: 35.4606, lng: 128.2132 },
  '제주': { lat: 33.4890, lng: 126.4983 },
};

const getUtilizationColor = (value: number) => {
  if (value >= 0.65) return 'bg-green-100 text-green-700';
  if (value >= 0.55) return 'bg-yellow-100 text-yellow-700';
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

  // API 호출
  const { data: apiResponse, isLoading, error } = useRegionalAnalysis();

  // API 응답 데이터 가공
  const regionalData = useMemo(() => {
    if (!apiResponse?.data?.distribution) return [];
    
    return apiResponse.data.distribution.map((region) => {
      const coords = REGION_COORDINATES[region.region] || { lat: 37.5665, lng: 126.978 };
      return {
        region: region.region,
        lat: coords.lat,
        lng: coords.lng,
        customers: region.count,
        percentage: region.ratio,
        vipCount: region.vipCount,
        churnRiskCount: region.churnRiskCount,
        avgMonetary: region.avgMonetary,
        churnRiskRatio: region.churnRiskRatio,
      };
    });
  }, [apiResponse]);

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
    if (!mapContainer.current || map.current || regionalData.length === 0) return;

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

    regionalData.forEach((data) => {
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
              <span style="font-weight: 600; color: #111827;">${data.percentage.toFixed(1)}%</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span>VIP 고객:</span>
              <span style="font-weight: 600; color: #111827;">${data.vipCount.toLocaleString()}명</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span>이탈 우려:</span>
              <span style="font-weight: 600; color: #f97316;">${data.churnRiskCount.toLocaleString()}명</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>평균 결제액:</span>
              <span style="font-weight: 600; color: #10b981;">₩${data.avgMonetary.toLocaleString()}</span>
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
  }, [regionalData]);

  useEffect(() => {
    if (!map.current || regionalData.length === 0) return;

    const filteredData = selectedRegions.length === 0
      ? regionalData 
      : regionalData.filter((d) => selectedRegions.includes(d.region));

    if (filteredData.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      filteredData.forEach((data) => {
        bounds.extend([data.lng, data.lat]);
      });
      map.current.fitBounds(bounds, { padding: 100, maxZoom: 10 });
    }
  }, [selectedRegions, regionalData]);

  const handleRegionToggle = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    );
  };

  const handleSelectAll = () => {
    if (selectedRegions.length === regionalData.length) {
      setSelectedRegions([]);
    } else {
      setSelectedRegions(regionalData.map((d) => d.region));
    }
  };

  const handleClearSelection = () => {
    setSelectedRegions([]);
  };

  const totalCustomers = regionalData.reduce((sum, d) => sum + d.customers, 0);
  const avgChurnRiskRatio = regionalData.length > 0 
    ? (regionalData.reduce((sum, d) => sum + d.churnRiskRatio, 0) / regionalData.length * 100).toFixed(1)
    : '0.0';
  const topRegion = regionalData.length > 0 ? regionalData[0] : null;

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
                      {regionalData.map((data) => (
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
        {isLoading && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white py-20 shadow-sm">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
            <p className="text-lg font-medium text-gray-600">지역 분석 데이터를 불러오는 중...</p>
            <p className="mt-1 text-sm text-gray-400">잠시만 기다려주세요</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white py-20 shadow-sm">
            <div className="mb-4 flex justify-center">
              <svg className="h-16 w-16 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="mb-2 text-lg font-semibold text-error-600">데이터를 불러오는데 실패했습니다</p>
            <p className="mb-4 text-sm text-gray-600">잠시 후 다시 시도해주세요</p>
          </div>
        )}

        {!isLoading && !error && regionalData.length > 0 && (
          <>
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
                  <p className="text-3xl font-bold text-gray-900">{topRegion?.region || '-'}</p>
                  <p className="mt-1 text-xs text-gray-500">전체의 {topRegion?.percentage.toFixed(1) || '0'}%</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-2 text-sm font-semibold text-gray-500">평균 이탈 우려율</h3>
                  <p className="text-3xl font-bold text-gray-900">{avgChurnRiskRatio}%</p>
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
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">VIP 고객</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">이탈 우려</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">평균 결제액</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">이탈 우려율</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {regionalData
                  .filter((d) => selectedRegions.length === 0 || selectedRegions.includes(d.region))
                  .map((data) => (
                    <tr key={data.region} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{data.region}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {data.customers.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{data.percentage.toFixed(1)}%</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{data.vipCount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{data.churnRiskCount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">₩{data.avgMonetary.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center text-sm">
                        <span className={`inline-block rounded px-2 py-1 ${getUtilizationColor(data.churnRiskRatio)}`}>
                          {(data.churnRiskRatio * 100).toFixed(1)}%
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
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RegionalAnalysisPage;