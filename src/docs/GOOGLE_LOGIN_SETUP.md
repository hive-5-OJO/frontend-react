# Google 로그인 설정 가이드

## 1. Google Cloud Console 설정

### 1.1 프로젝트 생성
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택

### 1.2 OAuth 2.0 클라이언트 ID 생성
1. 좌측 메뉴에서 "API 및 서비스" > "사용자 인증 정보" 선택
2. "사용자 인증 정보 만들기" > "OAuth 클라이언트 ID" 클릭
3. 애플리케이션 유형: "웹 애플리케이션" 선택
4. 이름 입력 (예: "OJO Admin")
5. 승인된 리디렉션 URI 추가:
   - 로컬: `http://localhost:5173/auth/google/callback`
   - 프로덕션: `https://yourdomain.com/auth/google/callback`
6. "만들기" 클릭
7. 생성된 클라이언트 ID 복사

### 1.3 OAuth 동의 화면 설정
1. "OAuth 동의 화면" 메뉴 선택
2. 사용자 유형 선택 (내부 또는 외부)
3. 앱 정보 입력:
   - 앱 이름
   - 사용자 지원 이메일
   - 개발자 연락처 정보
4. 범위 추가:
   - `email`
   - `profile`
5. 저장 및 계속

## 2. 프론트엔드 설정

### 2.1 환경 변수 설정
`.env` 파일에 Google Client ID 추가:

```env
VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
```

### 2.2 구현된 기능
- Google OAuth 2.0 인증 플로우
- Authorization Code 방식 사용
- 백엔드에서 토큰 교환 처리

## 3. 백엔드 API 요구사항

### 3.1 Google 로그인 엔드포인트
```
POST /api/auth/google
Content-Type: application/json

Request Body:
{
  "code": "authorization_code_from_google"
}

Response:
{
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "tokenType": "Bearer",
  "adminId": "user_id",
  "email": "user@example.com",
  "role": "ADMIN"
}

Response Headers:
Set-Cookie: refreshToken=xxx; HttpOnly; Secure; SameSite=Strict
```

### 3.2 백엔드 처리 로직
1. 프론트엔드에서 받은 authorization code 검증
2. Google OAuth API로 code를 access token으로 교환
3. Google API로 사용자 정보 조회
4. 사용자 DB 확인/생성
5. JWT 토큰 생성 및 반환

### 3.3 Google API 토큰 교환 예시 (백엔드)
```javascript
// Node.js 예시
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:8080/api/auth/google/callback'
);

// 토큰 교환
const { tokens } = await oauth2Client.getToken(code);
oauth2Client.setCredentials(tokens);

// 사용자 정보 조회
const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
const { data } = await oauth2.userinfo.get();

// data.email, data.name 등 사용
```

## 4. 인증 플로우

```
1. 사용자가 "Google" 버튼 클릭
   ↓
2. Google 로그인 페이지로 리다이렉트
   URL: https://accounts.google.com/o/oauth2/v2/auth
   ↓
3. 사용자가 Google 계정으로 로그인 및 권한 승인
   ↓
4. Google이 /auth/google/callback으로 리다이렉트
   Query: ?code=authorization_code
   ↓
5. 프론트엔드가 code를 백엔드로 전송
   POST /api/auth/google { code }
   ↓
6. 백엔드가 Google API로 토큰 교환 및 사용자 정보 조회
   ↓
7. 백엔드가 JWT 토큰 생성 및 반환
   ↓
8. 프론트엔드가 토큰 저장 및 대시보드로 이동
```

## 5. 보안 고려사항

### 5.1 HTTPS 필수
- 프로덕션 환경에서는 반드시 HTTPS 사용
- Google OAuth는 HTTPS 리다이렉트 URI만 허용 (localhost 제외)

### 5.2 State 파라미터 (선택사항)
CSRF 공격 방지를 위해 state 파라미터 사용 권장:
```typescript
const state = crypto.randomUUID();
sessionStorage.setItem('oauth_state', state);

const googleAuthUrl = `...&state=${state}`;

// 콜백에서 검증
const receivedState = searchParams.get('state');
const savedState = sessionStorage.getItem('oauth_state');
if (receivedState !== savedState) {
  // 에러 처리
}
```

### 5.3 Client Secret 보호
- Client Secret은 절대 프론트엔드에 노출하지 않음
- 백엔드에서만 사용

## 6. 에러 처리

### 6.1 사용자가 권한 거부
```
/login?error=google_auth_cancelled
```

### 6.2 인증 코드 없음
```
/login?error=no_code
```

### 6.3 백엔드 인증 실패
```
/login?error=google_auth_failed
```

## 7. 테스트

### 7.1 로컬 테스트
1. `.env` 파일에 실제 Google Client ID 입력
2. `npm run dev` 실행
3. 로그인 페이지에서 Google 버튼 클릭
4. Google 계정으로 로그인

### 7.2 프로덕션 배포
1. Google Cloud Console에서 프로덕션 리다이렉트 URI 추가
2. 환경 변수 설정
3. HTTPS 인증서 설정 확인

## 8. 참고 자료
- [Google OAuth 2.0 문서](https://developers.google.com/identity/protocols/oauth2)
- [Google Sign-In 가이드](https://developers.google.com/identity/sign-in/web/sign-in)
