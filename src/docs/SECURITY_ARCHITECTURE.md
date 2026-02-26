# 보안 강화 인증 시스템 아키텍처

## 개요
JWT 기반 인증 시스템을 XSS, CSRF 공격으로부터 보호하기 위한 보안 강화 구조입니다.

## 핵심 보안 전략

### 1. 토큰 저장 방식

#### AccessToken (단기 토큰)
- **저장 위치**: 메모리 (JavaScript 클로저)
- **저장 방법**: `axios.ts`의 `accessTokenMemory` 변수
- **장점**: 
  - XSS 공격으로부터 안전 (DOM/localStorage 접근 불가)
  - 페이지 새로고침 시 자동 삭제
- **단점**: 
  - 새로고침 시 재로그인 필요 (refreshToken으로 자동 갱신)

#### RefreshToken (장기 토큰)
- **저장 위치**: httpOnly 쿠키 (백엔드에서 설정)
- **설정 방법**: 백엔드에서 `Set-Cookie` 헤더로 전송
- **쿠키 옵션**:
  ```
  httpOnly: true    // JavaScript 접근 차단
  secure: true      // HTTPS만 전송
  sameSite: 'strict' // CSRF 방어
  ```
- **장점**:
  - XSS 공격으로부터 완전히 안전
  - 자동으로 요청에 포함됨

### 2. 토큰 갱신 플로우

```
1. 사용자 로그인
   ↓
2. 백엔드: accessToken 반환 + refreshToken을 httpOnly 쿠키로 설정
   ↓
3. 프론트: accessToken을 메모리에 저장
   ↓
4. API 요청 시 accessToken을 Authorization 헤더에 포함
   ↓
5. accessToken 만료 (401 에러)
   ↓
6. Axios Interceptor가 자동으로 /api/auth/refresh 호출
   (refreshToken은 쿠키로 자동 전송)
   ↓
7. 새 accessToken 받아서 메모리에 저장
   ↓
8. 실패한 요청 자동 재시도
```

### 3. 동시 요청 처리

여러 API가 동시에 401 에러를 받을 때:
- **문제**: 모든 요청이 동시에 토큰 갱신 시도
- **해결**: 
  - `isRefreshing` 플래그로 갱신 중 상태 관리
  - `failedQueue`에 대기 중인 요청 저장
  - 토큰 갱신 완료 후 대기 요청 일괄 처리

### 4. Zustand 상태 관리

```typescript
// persist에 저장되는 것 (localStorage)
{
  user: { adminId, email, role },
  isAuthenticated: true
}

// persist에서 제외되는 것 (메모리만)
{
  accessToken,  // axios.ts에서 관리
  refreshToken  // httpOnly 쿠키
}
```

## 보안 이점

### XSS (Cross-Site Scripting) 방어
- **문제**: 악성 스크립트가 localStorage/sessionStorage 접근
- **해결**: 
  - accessToken은 메모리에만 존재
  - refreshToken은 httpOnly 쿠키 (JavaScript 접근 불가)

### CSRF (Cross-Site Request Forgery) 방어
- **문제**: 다른 사이트에서 인증된 요청 위조
- **해결**:
  - `sameSite: 'strict'` 쿠키 옵션
  - `withCredentials: true` 설정으로 명시적 쿠키 전송

### 토큰 탈취 시 피해 최소화
- accessToken 수명 짧음 (예: 15분)
- refreshToken은 httpOnly로 보호
- 로그아웃 시 백엔드에서 refreshToken 무효화

## 백엔드 요구사항

### 1. 로그인 API (`POST /api/auth/login`)
```typescript
// Response Body
{
  accessToken: string,
  tokenType: "Bearer",
  adminId: string,
  email: string,
  role: string
}

// Response Headers
Set-Cookie: refreshToken=xxx; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800
```

### 2. 토큰 갱신 API (`POST /api/auth/refresh`)
```typescript
// Request: refreshToken은 쿠키로 자동 전송
// Response Body
{
  accessToken: string
}

// Response Headers (선택적으로 refreshToken 갱신)
Set-Cookie: refreshToken=xxx; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800
```

### 3. 로그아웃 API (`POST /api/auth/logout`)
```typescript
// Request: refreshToken은 쿠키로 자동 전송
// Response Headers
Set-Cookie: refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0
```

## 환경 설정

### 개발 환경
```env
VITE_API_URL=http://localhost:8080
```

### 프로덕션 환경
```env
VITE_API_URL=https://api.yourdomain.com
```

**중요**: 프로덕션에서는 반드시 HTTPS 사용

## 추가 보안 권장사항

1. **Content Security Policy (CSP)**
   - 인라인 스크립트 차단
   - 신뢰할 수 있는 소스만 허용

2. **Rate Limiting**
   - 로그인 시도 제한
   - 토큰 갱신 요청 제한

3. **토큰 수명 설정**
   - accessToken: 15분
   - refreshToken: 7일

4. **HTTPS 필수**
   - 모든 통신 암호화
   - Secure 쿠키 사용

5. **로그아웃 시 토큰 블랙리스트**
   - 백엔드에서 refreshToken 무효화
   - Redis 등으로 블랙리스트 관리
