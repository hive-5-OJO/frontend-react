export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('ko-KR').format(num);
};

export const getCategoryLabel = (category: string) => {
  const map: { [key: string]: string } = {
    PAYMENT: '결제/청구',
    TECHNICAL: '기술 지원',
    CONTRACT: '계약',
    FEATURE: '기능 요청',
    COMPLAINT: '불만',
  };
  return map[category] || category;
};

export const getStatusColor = (
  isTerminated: boolean,
  isDormant: boolean,
) => {
  if (isTerminated) return 'bg-gray-100 text-gray-700';
  if (isDormant) return 'bg-orange-100 text-orange-700';
  return 'bg-green-100 text-green-700';
};

export const getStatusLabel = (
  isTerminated: boolean,
  isDormant: boolean,
) => {
  if (isTerminated) return '해지';
  if (isDormant) return '휴면';
  return '활성';
};

export const getAlertLevel = (count: number) => {
  if (count >= 5) return 'high';
  if (count >= 3) return 'medium';
  return 'low';
};

export const getRecencyScore = (recencyDate: string) => {
  const recency = new Date(recencyDate);
  const now = new Date('2026-02-10');
  const daysDiff = Math.floor(
    (now.getTime() - recency.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (daysDiff <= 7) return 5;
  if (daysDiff <= 30) return 4;
  if (daysDiff <= 60) return 3;
  if (daysDiff <= 90) return 2;
  return 1;
};

export const getFrequencyScore = (frequency: number) => {
  return Math.min(5, Math.ceil(frequency / 2));
};

export const getMonetaryScore = (monetary: number) => {
  return Math.min(5, Math.ceil(monetary / 20000));
};

export const getRFMSegment = (totalScore: number) => {
  if (totalScore >= 13)
    return { label: 'Champions', color: 'text-green-600' };
  if (totalScore >= 10)
    return { label: 'Loyal Customers', color: 'text-blue-600' };
  if (totalScore >= 7)
    return { label: 'Potential Loyalists', color: 'text-indigo-600' };
  if (totalScore >= 5) return { label: 'At Risk', color: 'text-orange-600' };
  return { label: 'Lost', color: 'text-red-600' };
};

export const getLTVGradeInfo = (grade: string) => {
  const gradeMap: {
    [key: string]: { label: string; color: string; bgColor: string };
  } = {
    TOP_10: {
      label: 'TOP 10%',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    TOP_20: {
      label: 'TOP 20%',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    TOP_30: {
      label: 'TOP 30%',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    MIDDLE: {
      label: 'MIDDLE',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    LOW: { label: 'LOW', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  };
  return (
    gradeMap[grade] || {
      label: grade,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    }
  );
};

export const getDaysUntilChurn = (churnDate: string) => {
  const churn = new Date(churnDate);
  const now = new Date('2026-02-10');
  return Math.floor((churn.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};
