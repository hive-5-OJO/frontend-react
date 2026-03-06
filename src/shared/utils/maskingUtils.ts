/**
 * 휴대폰 번호 마스킹
 * 예: 010-1234-5678 -> 010-****-5678
 */
export const maskPhone = (phone: string): string => {
  if (!phone) return '';
  
  // 하이픈이 있는 경우
  if (phone.includes('-')) {
    const parts = phone.split('-');
    if (parts.length === 3) {
      return `${parts[0]}-****-${parts[2]}`;
    }
  }
  
  // 하이픈이 없는 경우 (01012345678)
  if (phone.length === 11) {
    return `${phone.slice(0, 3)}-****-${phone.slice(7)}`;
  }
  
  return phone;
};

/**
 * 이메일 마스킹
 * 예: example@domain.com -> ex***le@domain.com
 */
export const maskEmail = (email: string): string => {
  if (!email) return '';
  
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) return email;
  
  // 로컬 파트가 3자 이하면 첫 글자만 보여주고 나머지 마스킹
  if (localPart.length <= 3) {
    return `${localPart[0]}***@${domain}`;
  }
  
  // 로컬 파트가 4자 이상이면 앞 2자, 뒤 2자만 보여주고 중간 마스킹
  const visibleStart = localPart.slice(0, 2);
  const visibleEnd = localPart.slice(-2);
  const maskedLength = Math.min(localPart.length - 4, 4); // 최대 4개의 별표
  const masked = '*'.repeat(maskedLength);
  
  return `${visibleStart}${masked}${visibleEnd}@${domain}`;
};

/**
 * 마스킹 해제 (원본 데이터 표시)
 */
export const unmask = (value: string): string => {
  return value;
};
