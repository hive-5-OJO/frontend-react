import type {
  CohortAnalysisRequest,
  CohortAnalysisResponse,
  CohortRow,
  RFMAnalysisResponse,
  RFMKpiResponse,
  RegionalAnalysisResponse,
} from '../model/types';

/**
 * 코호트 분석 목 데이터
 */
export const getMockCohortAnalysis = (params: CohortAnalysisRequest): CohortAnalysisResponse => {
  const months = [
    '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12',
    '2026-01', '2026-02',
  ];

  const rows: CohortRow[] = months.map((month) => {
    const base = params.segment === 'vip' ? 0.85 : params.segment === 'big_spender' ? 0.75 : 0.70;
    const row: CohortRow = {
      join_month: month,
      segment_type: params.segment,
    };
    for (let i = 0; i <= 12; i++) {
      const decay = Math.max(0, base - i * (0.03 + Math.random() * 0.04));
      row[String(i)] = i === 0 ? 1.0 : parseFloat(decay.toFixed(4));
    }
    return row;
  });

  return { data: rows };
};

/**
 * RFM 분석 목 데이터
 */
export const getMockRFMAnalysis = (baseMonth: string): RFMAnalysisResponse => ({
  status: 'success',
  data: {
    totalCount: 96978,
    segmentDetailList: [
      { type: 'VIP', count: 4850, ratio: 5.0, avgR: 4.5, avgF: 4.8, avgM: 4.7 },
      { type: 'LOYAL', count: 14540, ratio: 15.0, avgR: 3.8, avgF: 3.5, avgM: 3.9 },
      { type: 'COMMON', count: 58190, ratio: 60.0, avgR: 3.0, avgF: 2.5, avgM: 2.8 },
      { type: 'RISK', count: 14550, ratio: 15.0, avgR: 1.8, avgF: 1.5, avgM: 2.0 },
      { type: 'LOST', count: 4848, ratio: 5.0, avgR: 1.0, avgF: 1.0, avgM: 1.2 },
    ],
  },
  message: `${baseMonth} 기준 RFM 분석 결과`,
});

/**
 * RFM KPI 목 데이터
 */
export const getMockRFMKpi = (baseMonth: string): RFMKpiResponse => ({
  status: 'success',
  data: {
    baseMonth,
    crr: 0.875,
    nrr: 1.052,
    churnRate: 0.048,
    crrStatus: 'HEALTHY',
    nrrStatus: 'HEALTHY',
    churnStatus: 'WARNING',
  },
  message: null,
});

/**
 * 지역 분석 목 데이터
 */
export const getMockRegionalAnalysis = (): RegionalAnalysisResponse => ({
  status: 'success',
  data: [
    { region: '서울', count: 27520, totalRevenue: 82560000000, totalMonthlyRevenue: 6880000000, avgRevenue: 3000000, avgMonthlyRevenue: 250000, vipCount: 1376, churnRiskCount: 2752, ratio: 28.38, churnRiskRatio: 10.0 },
    { region: '경기', count: 21030, totalRevenue: 52575000000, totalMonthlyRevenue: 4381250000, avgRevenue: 2500000, avgMonthlyRevenue: 208333, vipCount: 841, churnRiskCount: 2524, ratio: 21.68, churnRiskRatio: 12.0 },
    { region: '부산', count: 9700, totalRevenue: 21340000000, totalMonthlyRevenue: 1778333333, avgRevenue: 2200000, avgMonthlyRevenue: 183333, vipCount: 388, churnRiskCount: 1164, ratio: 10.00, churnRiskRatio: 12.0 },
    { region: '대구', count: 6800, totalRevenue: 13600000000, totalMonthlyRevenue: 1133333333, avgRevenue: 2000000, avgMonthlyRevenue: 166667, vipCount: 272, churnRiskCount: 952, ratio: 7.01, churnRiskRatio: 14.0 },
    { region: '인천', count: 6300, totalRevenue: 13860000000, totalMonthlyRevenue: 1155000000, avgRevenue: 2200000, avgMonthlyRevenue: 183333, vipCount: 252, churnRiskCount: 756, ratio: 6.50, churnRiskRatio: 12.0 },
    { region: '광주', count: 4200, totalRevenue: 7560000000, totalMonthlyRevenue: 630000000, avgRevenue: 1800000, avgMonthlyRevenue: 150000, vipCount: 168, churnRiskCount: 546, ratio: 4.33, churnRiskRatio: 13.0 },
    { region: '대전', count: 4100, totalRevenue: 7790000000, totalMonthlyRevenue: 649166667, avgRevenue: 1900000, avgMonthlyRevenue: 158333, vipCount: 164, churnRiskCount: 492, ratio: 4.23, churnRiskRatio: 12.0 },
    { region: '울산', count: 3200, totalRevenue: 6720000000, totalMonthlyRevenue: 560000000, avgRevenue: 2100000, avgMonthlyRevenue: 175000, vipCount: 128, churnRiskCount: 384, ratio: 3.30, churnRiskRatio: 12.0 },
    { region: '세종', count: 1500, totalRevenue: 3300000000, totalMonthlyRevenue: 275000000, avgRevenue: 2200000, avgMonthlyRevenue: 183333, vipCount: 75, churnRiskCount: 150, ratio: 1.55, churnRiskRatio: 10.0 },
    { region: '제주', count: 2800, totalRevenue: 5040000000, totalMonthlyRevenue: 420000000, avgRevenue: 1800000, avgMonthlyRevenue: 150000, vipCount: 112, churnRiskCount: 392, ratio: 2.89, churnRiskRatio: 14.0 },
    { region: '강원', count: 2500, totalRevenue: 4250000000, totalMonthlyRevenue: 354166667, avgRevenue: 1700000, avgMonthlyRevenue: 141667, vipCount: 100, churnRiskCount: 375, ratio: 2.58, churnRiskRatio: 15.0 },
    { region: '충북', count: 1800, totalRevenue: 3060000000, totalMonthlyRevenue: 255000000, avgRevenue: 1700000, avgMonthlyRevenue: 141667, vipCount: 72, churnRiskCount: 252, ratio: 1.86, churnRiskRatio: 14.0 },
    { region: '충남', count: 1700, totalRevenue: 2890000000, totalMonthlyRevenue: 240833333, avgRevenue: 1700000, avgMonthlyRevenue: 141667, vipCount: 68, churnRiskCount: 255, ratio: 1.75, churnRiskRatio: 15.0 },
    { region: '전북', count: 1200, totalRevenue: 1920000000, totalMonthlyRevenue: 160000000, avgRevenue: 1600000, avgMonthlyRevenue: 133333, vipCount: 48, churnRiskCount: 192, ratio: 1.24, churnRiskRatio: 16.0 },
    { region: '전남', count: 1100, totalRevenue: 1760000000, totalMonthlyRevenue: 146666667, avgRevenue: 1600000, avgMonthlyRevenue: 133333, vipCount: 44, churnRiskCount: 176, ratio: 1.13, churnRiskRatio: 16.0 },
    { region: '경북', count: 970, totalRevenue: 1552000000, totalMonthlyRevenue: 129333333, avgRevenue: 1600000, avgMonthlyRevenue: 133333, vipCount: 39, churnRiskCount: 155, ratio: 1.00, churnRiskRatio: 16.0 },
    { region: '경남', count: 558, totalRevenue: 836000000, totalMonthlyRevenue: 69666667, avgRevenue: 1498000, avgMonthlyRevenue: 124833, vipCount: 22, churnRiskCount: 95, ratio: 0.58, churnRiskRatio: 17.0 },
  ],
});
