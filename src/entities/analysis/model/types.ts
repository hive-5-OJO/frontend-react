// 코호트 분석 타입 정의

export type SegmentType = 'all' | 'high_consult' | 'big_spender' | 'vip';

export interface CohortRow {
  join_month: string;
  segment_type: string;
  [key: string]: number | null | string; // 0, 1, 2, ... 12 등의 개월 수 키
}

export interface CohortAnalysisRequest {
  segment: SegmentType;
}

export interface CohortAnalysisResponse {
  data: CohortRow[];
}

// RFM 분석 타입 정의

export type RFMSegmentType = 'VIP' | 'POTENTIAL_VIP' | 'NORMAL' | 'CHURN_RISK' | 'CHURNED';
export type KpiStatus = 'HEALTHY' | 'WARNING' | 'DANGER';

export interface RFMSegmentDetail {
  type: RFMSegmentType;
  count: number;
  ratio: number;
  avgR: number;
  avgF: number;
  avgM: number;
}

export interface RFMAnalysisRequest {
  baseMonth: string; // YYYY-MM 형식
}

export interface RFMAnalysisResponse {
  status: string;
  data: {
    totalCount: number;
    segmentsDetail: RFMSegmentDetail[];
  };
  message: string;
}

export interface RFMKpiRequest {
  baseMonth: string; // YYYY-MM 형식
}

export interface RFMKpiResponse {
  status: string;
  data: {
    baseMonth: string;
    crr: number;
    nrr: number;
    churnRate: number;
    crrStatus: KpiStatus;
    nrrStatus: KpiStatus;
    churnStatus: KpiStatus;
  };
  message: string | null;
}

// 지역 분석 타입 정의

export interface RegionDistribution {
  region: string;
  count: number;
  vipCount: number;
  churnRiskCount: number;
  ratio: number;
  avgMonetary: number;
  churnRiskRatio: number;
}

export interface RegionalAnalysisRequest {
  baseDate?: string; // YYYY-MM-DD 형식 (선택사항)
}

export interface RegionalAnalysisResponse {
  status: string;
  data: {
    baseDate: string;
    distribution: RegionDistribution[];
  };
  message: string;
}
