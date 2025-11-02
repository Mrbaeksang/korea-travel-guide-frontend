# Frontend API Reference

프론트엔드 개발에 필요한 API 엔드포인트 정보만 간결하게 정리한 문서입니다.

## 기본 정보

- **Base URL**: `http://localhost:8080`
- **인증 방식**: Bearer Token (JWT)
- **응답 형식**: 모든 응답은 `ApiResponse` 래퍼로 감싸짐
  ```json
  {
    "msg": "응답 메시지",
    "data": { /* 실제 데이터 */ }
  }
  ```

---

## 1. Auth 도메인

### 1.1 Google OAuth 로그인 시작

```typescript
// 브라우저를 리다이렉트
window.location.href = 'http://localhost:8080/oauth2/authorization/google'
```

**자동 리다이렉트 (백엔드 처리)**:
- 신규 사용자: `/signup/role?token={registerToken}`
- 기존 사용자: `/oauth/callback` (쿠키에 refreshToken 자동 설정)

### 1.2 역할 선택 (신규 사용자만)

```http
POST /api/auth/role
```

**Headers**:
```json
{
  "Authorization": "Bearer {registerToken}"
}
```

**Request Body**:
```json
{
  "role": "USER" | "GUIDE"
}
```

**Response**:
```json
{
  "msg": "역할이 선택되었으며 로그인에 성공했습니다.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Note**:
- refreshToken은 쿠키(HttpOnly, Secure)로 자동 설정됨
- accessToken은 메모리 또는 localStorage에 저장

### 1.3 Access Token 갱신

```http
POST /api/auth/refresh
```

**Note**: refreshToken은 쿠키에서 자동 전송

**Response**:
```json
{
  "msg": "Access Token이 성공적으로 재발급되었습니다.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Handling**:
- 401 Unauthorized → 로그인 페이지로 리다이렉트

### 1.4 로그아웃

```http
POST /api/auth/logout
```

**Headers**:
```json
{
  "Authorization": "Bearer {accessToken}"
}
```

**Response**:
```json
{
  "msg": "로그아웃 되었습니다.",
  "data": null
}
```

---

## 2. User 도메인

### 2.1 내 정보 조회

```http
GET /api/users/me
```

**Headers**:
```json
{
  "Authorization": "Bearer {accessToken}"
}
```

**Response**:
```json
{
  "msg": "내 정보를 성공적으로 조회했습니다.",
  "data": {
    "id": 1,
    "email": "user@gmail.com",
    "nickname": "홍길동",
    "profileImageUrl": "https://...",
    "role": "USER" | "GUIDE" | "ADMIN" | "PENDING"
  }
}
```

### 2.2 프로필 수정

```http
PATCH /api/users/me
```

**Headers**:
```json
{
  "Authorization": "Bearer {accessToken}"
}
```

**Request Body**:
```json
{
  "nickname": "새닉네임",
  "profileImageUrl": "https://example.com/image.jpg"
}
```

**Note**:
- 두 필드 모두 optional
- profileImageUrl은 외부 URL만 가능 (별도 이미지 업로드 API 없음)

**Response**:
```json
{
  "msg": "정보가 성공적으로 수정되었습니다.",
  "data": {
    "id": 1,
    "email": "user@gmail.com",
    "nickname": "새닉네임",
    "profileImageUrl": "https://example.com/image.jpg",
    "role": "USER"
  }
}
```

### 2.3 회원 탈퇴

```http
DELETE /api/users/me
```

**Headers**:
```json
{
  "Authorization": "Bearer {accessToken}"
}
```

**Response**:
```json
{
  "msg": "회원 탈퇴가 완료되었습니다.",
  "data": null
}
```

---

## 3. AI Chat 도메인

### 3.1 세션 목록 조회

```http
GET /api/aichat/sessions
```

**Headers**:
```json
{
  "Authorization": "Bearer {accessToken}"
}
```

**Response**:
```json
{
  "msg": "세션 조회에 성공했습니다.",
  "data": [
    {
      "sessionId": 1,
      "sessionTitle": "서울 여행 추천"
    },
    {
      "sessionId": 2,
      "sessionTitle": "부산 맛집 추천"
    }
  ]
}
```

### 3.2 새 세션 생성

```http
POST /api/aichat/sessions
```

**Headers**:
```json
{
  "Authorization": "Bearer {accessToken}"
}
```

**Response**:
```json
{
  "msg": "세션 생성에 성공했습니다.",
  "data": {
    "sessionId": 3,
    "sessionTitle": "새 세션"
  }
}
```

**Note**: 새 세션은 기본 제목 "새 세션"으로 생성됨

### 3.3 세션 삭제

```http
DELETE /api/aichat/sessions/{sessionId}
```

**Headers**:
```json
{
  "Authorization": "Bearer {accessToken}"
}
```

**Response**:
```json
{
  "msg": "세션 삭제에 성공했습니다.",
  "data": null
}
```

### 3.4 세션 메시지 조회

```http
GET /api/aichat/sessions/{sessionId}/messages
```

**Headers**:
```json
{
  "Authorization": "Bearer {accessToken}"
}
```

**Response**:
```json
{
  "msg": "메시지 조회에 성공했습니다.",
  "data": [
    {
      "content": "안녕하세요",
      "senderType": "USER"
    },
    {
      "content": "안녕하세요! 한국 여행 가이드입니다. 어떤 여행지를 찾고 계신가요?",
      "senderType": "AI"
    }
  ]
}
```

**Note**:
- senderType은 "USER" 또는 "AI"
- 시간순 정렬 (오래된 메시지부터)

### 3.5 메시지 전송 (AI와 대화)

```http
POST /api/aichat/sessions/{sessionId}/messages
```

**Headers**:
```json
{
  "Authorization": "Bearer {accessToken}",
  "Content-Type": "application/json"
}
```

**Request Body**:
```json
{
  "userMessage": "서울 날씨 좋은 관광지 추천해줘"
}
```

**Response**:
```json
{
  "msg": "메시지가 성공적으로 전송되었습니다.",
  "data": {
    "userMessage": "서울 날씨 좋은 관광지 추천해줘",
    "aiMessage": "서울의 오늘 날씨는 맑고 기온은 20도입니다. 경복궁이나 남산타워 방문을 추천드립니다..."
  }
}
```

**Note**:
- AI가 자동으로 날씨 및 관광정보 API를 호출하여 응답
- 응답에는 사용자 메시지와 AI 응답이 모두 포함됨

### 3.6 세션 제목 수정

```http
PATCH /api/aichat/sessions/{sessionId}/title
```

**Headers**:
```json
{
  "Authorization": "Bearer {accessToken}",
  "Content-Type": "application/json"
}
```

**Request Body**:
```json
{
  "newTitle": "서울 여행 계획"
}
```

**Response**:
```json
{
  "msg": "세션 제목 수정에 성공했습니다.",
  "data": null
}
```

---

## 4. User Chat 도메인 (REST API)

### 4.1 채팅방 목록 조회 (페이지네이션)

```http
GET /api/userchat/rooms?limit=20&cursor={nextCursor}
```

**Headers**:
```json
{
  "Authorization": "Bearer {accessToken}"
}
```

**Query Parameters**:
- `limit` (optional): 조회할 채팅방 수 (기본값: 20, 최대: 100)
- `cursor` (optional): 페이지네이션 커서 (다음 페이지 조회시 사용)

**Response**:
```json
{
  "msg": "채팅방 목록 조회",
  "data": {
    "rooms": [
      {
        "id": 1,
        "title": "홍길동님과의 채팅",
        "displayTitle": "홍길동님과의 채팅",
        "guideId": 2,
        "userId": 3,
        "updatedAt": "2025-01-15T14:30:00+09:00[Asia/Seoul]",
        "lastMessageId": 123
      }
    ],
    "nextCursor": "eyJpZCI6MX0="
  }
}
```

**Note**:
- 커서 기반 페이지네이션 사용
- `nextCursor`가 null이면 마지막 페이지
- `updatedAt`은 Asia/Seoul 타임존의 ZonedDateTime

### 4.2 채팅방 생성/재사용

```http
POST /api/userchat/rooms/start
```

**Headers**:
```json
{
  "Authorization": "Bearer {accessToken}",
  "Content-Type": "application/json"
}
```

**Request Body**:
```json
{
  "guideId": 2,
  "userId": 3
}
```

**Response**:
```json
{
  "msg": "채팅방 시작",
  "data": {
    "id": 1,
    "title": "홍길동님과의 채팅",
    "displayTitle": "홍길동님과의 채팅",
    "guideId": 2,
    "userId": 3,
    "updatedAt": "2025-01-15T14:30:00+09:00[Asia/Seoul]",
    "lastMessageId": null
  }
}
```

**Note**:
- 동일한 가이드-유저 페어는 기존 채팅방 재사용
- 새 채팅방이면 `lastMessageId`는 null

### 4.3 채팅방 상세 조회

```http
GET /api/userchat/rooms/{roomId}
```

**Headers**:
```json
{
  "Authorization": "Bearer {accessToken}"
}
```

**Response**:
```json
{
  "msg": "채팅방 조회",
  "data": {
    "id": 1,
    "title": "홍길동님과의 채팅",
    "displayTitle": "홍길동님과의 채팅",
    "guideId": 2,
    "userId": 3,
    "updatedAt": "2025-01-15T14:30:00+09:00[Asia/Seoul]",
    "lastMessageId": 123
  }
}
```

### 4.4 채팅방 삭제

```http
DELETE /api/userchat/rooms/{roomId}
```

**Headers**:
```json
{
  "Authorization": "Bearer {accessToken}"
}
```

**Response**:
```json
{
  "msg": "채팅방 삭제 완료",
  "data": null
}
```

**Note**: 채팅방 소유자만 삭제 가능 (권한 검증)

### 4.5 메시지 목록 조회

```http
GET /api/userchat/rooms/{roomId}/messages?after={messageId}&limit=50
```

**Headers**:
```json
{
  "Authorization": "Bearer {accessToken}"
}
```

**Query Parameters**:
- `after` (optional): 특정 메시지 ID 이후의 메시지만 조회 (실시간 업데이트용)
- `limit` (optional): 조회할 메시지 수 (기본값: 50)

**Response**:
```json
{
  "msg": "메시지 조회",
  "data": [
    {
      "id": 123,
      "roomId": 1,
      "senderId": 3,
      "content": "안녕하세요",
      "createdAt": "2025-01-15T14:30:00+09:00[Asia/Seoul]"
    },
    {
      "id": 124,
      "roomId": 1,
      "senderId": 2,
      "content": "네 안녕하세요!",
      "createdAt": "2025-01-15T14:30:05+09:00[Asia/Seoul]"
    }
  ]
}
```

**Note**:
- `after` 없으면: 최근 메시지 limit개 조회
- `after` 있으면: 해당 메시지 이후의 모든 메시지 조회 (실시간 폴링용)

### 4.6 메시지 전송 (REST)

```http
POST /api/userchat/rooms/{roomId}/messages
```

**Headers**:
```json
{
  "Authorization": "Bearer {accessToken}",
  "Content-Type": "application/json"
}
```

**Request Body**:
```json
{
  "content": "안녕하세요"
}
```

**Response** (HTTP 201 Created):
```json
{
  "msg": "메시지 전송",
  "data": {
    "id": 125,
    "roomId": 1,
    "senderId": 3,
    "content": "안녕하세요",
    "createdAt": "2025-01-15T14:35:00+09:00[Asia/Seoul]"
  }
}
```

**Note**:
- REST API로 메시지 전송 후, WebSocket으로도 자동 발행됨
- WebSocket 연결 없이도 사용 가능
- HTTP 201 Created 상태 코드 반환

---

## 5. User Chat WebSocket (STOMP)

### 5.1 연결 설정

**WebSocket Endpoint**:
```
ws://localhost:8080/ws/userchat
```

**SockJS 지원**: 예 (브라우저 호환성)

**프로토콜**: STOMP over WebSocket/SockJS

**인증**: JWT 토큰을 STOMP CONNECT 헤더에 포함

```javascript
// SockJS + STOMP 클라이언트 예시
const socket = new SockJS('http://localhost:8080/ws/userchat');
const stompClient = Stomp.over(socket);

stompClient.connect(
  {
    Authorization: `Bearer ${accessToken}`
  },
  onConnected,
  onError
);
```

### 5.2 구독 (Subscribe)

**패턴**: `/topic/chat/{roomId}`

클라이언트는 참여 중인 채팅방을 구독하여 실시간 메시지를 수신합니다.

```javascript
stompClient.subscribe('/topic/chat/1', (message) => {
  const response = JSON.parse(message.body);
  console.log(response);
  // {
  //   "msg": "메시지 전송",
  //   "data": {
  //     "id": 125,
  //     "roomId": 1,
  //     "senderId": 3,
  //     "content": "안녕하세요",
  //     "createdAt": "2025-01-15T14:35:00+09:00[Asia/Seoul]"
  //   }
  // }
});
```

**Note**:
- `{roomId}`는 채팅방 ID (숫자)
- 구독 전에 `/api/userchat/rooms/start`로 채팅방 생성 필요
- 응답은 `ApiResponse<ChatMessageResponse>` 형식

### 5.3 발행 (Publish)

**패턴**: `/pub/userchat/{roomId}/messages`

클라이언트가 메시지를 전송합니다.

```javascript
stompClient.send(
  '/pub/userchat/1/messages',
  {},
  JSON.stringify({
    content: '안녕하세요'
  })
);
```

**Request Body**:
```json
{
  "content": "안녕하세요"
}
```

**브로드캐스트**:
- 메시지 전송 시, 같은 채팅방을 구독 중인 모든 클라이언트에게 브로드캐스트됨
- 발신자 본인도 `/topic/chat/{roomId}`를 통해 자신의 메시지를 수신함

### 5.4 연결 해제

```javascript
stompClient.disconnect(() => {
  console.log('Disconnected');
});
```

### 5.5 아키텍처 (Dev vs Prod)

**개발 환경 (dev)**:
- SimpleBroker 사용 (인메모리)
- 단일 서버에서만 작동
- RabbitMQ 불필요

**프로덕션 환경 (prod)**:
- RabbitMQ STOMP Relay 사용
- 다중 서버 인스턴스 지원
- RabbitMQ 필수 (host, port, username, password)

### 5.6 WebSocket vs REST API 선택 가이드

**WebSocket 사용 시나리오**:
- 실시간 채팅 기능 (양방향 즉시 전송/수신)
- 여러 사용자 간 동시 대화
- 낮은 레이턴시가 중요한 경우

**REST API 사용 시나리오**:
- 과거 메시지 조회 (페이지네이션)
- 채팅방 목록/생성/삭제
- WebSocket 연결 없이 메시지 전송 (예: 푸시 알림 트리거)

**권장 통합 패턴**:
1. REST API로 채팅방 생성 및 목록 조회
2. WebSocket으로 실시간 메시지 송수신
3. REST API로 과거 메시지 히스토리 로드

---

## 6. Rate 도메인

### 6.1 가이드 평가 (생성/수정)

```http
PUT /api/rate/guides/{guideId}
```

**Headers**:
```json
{
  "Authorization": "Bearer {accessToken}",
  "Content-Type": "application/json"
}
```

**Request Body**:
```json
{
  "rating": 5,
  "comment": "정말 친절하고 좋은 가이드였습니다!"
}
```

**Validation**:
- `rating`: 1~5 사이의 정수 (필수)
- `comment`: 코멘트 (선택)

**Response**:
```json
{
  "msg": "가이드 평가가 등록되었습니다.",
  "data": {
    "id": 1,
    "raterNickname": "홍길동",
    "rating": 5,
    "comment": "정말 친절하고 좋은 가이드였습니다!",
    "createdAt": "2025-01-15T14:30:00+09:00[Asia/Seoul]"
  }
}
```

**Note**:
- 동일한 사용자가 동일한 가이드 재평가 시 기존 평가 업데이트 (PUT)
- 같은 유저가 동일 가이드에 대해 평가는 1개만 존재

### 6.2 AI 채팅 세션 평가 (생성/수정)

```http
PUT /api/rate/aichat/sessions/{sessionId}
```

**Headers**:
```json
{
  "Authorization": "Bearer {accessToken}",
  "Content-Type": "application/json"
}
```

**Request Body**:
```json
{
  "rating": 4,
  "comment": "도움이 되었습니다"
}
```

**Validation**:
- `rating`: 1~5 사이의 정수 (필수)
- `comment`: 코멘트 (선택)

**Response**:
```json
{
  "msg": "AI 채팅 평가가 등록되었습니다.",
  "data": {
    "id": 2,
    "raterNickname": "홍길동",
    "rating": 4,
    "comment": "도움이 되었습니다",
    "createdAt": "2025-01-15T14:35:00+09:00[Asia/Seoul]"
  }
}
```

**Note**:
- 동일한 사용자가 동일한 세션 재평가 시 기존 평가 업데이트 (PUT)
- 같은 유저가 동일 세션에 대해 평가는 1개만 존재

### 6.3 내 가이드 평점 조회 (GUIDE 전용)

```http
GET /api/rate/guides/my
```

**Headers**:
```json
{
  "Authorization": "Bearer {accessToken}"
}
```

**권한**: GUIDE 역할 필요

**Response**:
```json
{
  "msg": "내 가이드 평점 정보를 조회했습니다.",
  "data": {
    "averageRating": 4.5,
    "totalRatings": 10,
    "ratings": [
      {
        "id": 1,
        "raterNickname": "홍길동",
        "rating": 5,
        "comment": "정말 친절하고 좋은 가이드였습니다!",
        "createdAt": "2025-01-15T14:30:00+09:00[Asia/Seoul]"
      },
      {
        "id": 3,
        "raterNickname": "김철수",
        "rating": 4,
        "comment": "좋았어요",
        "createdAt": "2025-01-14T10:20:00+09:00[Asia/Seoul]"
      }
    ]
  }
}
```

**Note**:
- 현재 로그인한 가이드가 받은 모든 평가 조회
- `averageRating`: 평균 평점 (소수점)
- `totalRatings`: 전체 평가 개수

### 6.4 전체 AI 채팅 평가 조회 (ADMIN 전용)

```http
GET /api/rate/admin/aichat/sessions?page=0&size=20&sort=createdAt,desc
```

**Headers**:
```json
{
  "Authorization": "Bearer {accessToken}"
}
```

**권한**: ADMIN 역할 필요

**Query Parameters** (Spring Data Pageable):
- `page` (optional): 페이지 번호 (0부터 시작, 기본값: 0)
- `size` (optional): 페이지 크기 (기본값: 20)
- `sort` (optional): 정렬 기준 (예: `createdAt,desc`)

**Response**:
```json
{
  "msg": "모든 AI 채팅 평가 목록을 조회했습니다.",
  "data": {
    "content": [
      {
        "id": 2,
        "raterNickname": "홍길동",
        "rating": 4,
        "comment": "도움이 되었습니다",
        "createdAt": "2025-01-15T14:35:00+09:00[Asia/Seoul]"
      },
      {
        "id": 5,
        "raterNickname": "김철수",
        "rating": 5,
        "comment": "매우 유용했습니다",
        "createdAt": "2025-01-14T09:10:00+09:00[Asia/Seoul]"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20,
      "sort": {
        "sorted": true,
        "unsorted": false,
        "empty": false
      }
    },
    "totalPages": 5,
    "totalElements": 95,
    "last": false,
    "size": 20,
    "number": 0,
    "numberOfElements": 20,
    "first": true,
    "empty": false
  }
}
```

**Note**:
- 관리자가 모든 사용자의 AI 세션 평가를 조회
- Spring Data Page 객체로 응답 (페이지네이션 메타데이터 포함)

---

## 7. Guide 도메인

### 7.1 가이드 목록 조회

```http
GET /api/guides
```

**Headers**: 인증 불필요 (누구나 조회 가능)

**Response**:
```json
{
  "msg": "전체 가이드 목록을 조회했습니다.",
  "data": [
    {
      "id": 1,
      "email": "guide@example.com",
      "nickname": "서울가이드",
      "profileImageUrl": "https://...",
      "role": "GUIDE",
      "location": "SEOUL",
      "description": "서울 투어 전문 가이드입니다"
    },
    {
      "id": 2,
      "email": "guide2@example.com",
      "nickname": "부산가이드",
      "profileImageUrl": null,
      "role": "GUIDE",
      "location": "BUSAN",
      "description": "부산 맛집 투어 전문"
    }
  ]
}
```

**Note**:
- location은 Region enum (SEOUL, BUSAN, JEJU 등 200+ 지역)
- description은 가이드 소개 (선택 필드)

### 7.2 가이드 상세 조회

```http
GET /api/guides/{guideId}
```

**Headers**: 인증 불필요

**Response**:
```json
{
  "msg": "가이드 정보를 성공적으로 조회했습니다.",
  "data": {
    "id": 1,
    "email": "guide@example.com",
    "nickname": "서울가이드",
    "profileImageUrl": "https://...",
    "role": "GUIDE",
    "location": "SEOUL",
    "description": "서울 투어 전문 가이드입니다"
  }
}
```

### 7.3 내 가이드 프로필 수정 (GUIDE 전용)

```http
PATCH /api/guides/me
```

**Headers**:
```json
{
  "Authorization": "Bearer {accessToken}",
  "Content-Type": "application/json"
}
```

**권한**: GUIDE 역할 필요

**Request Body**:
```json
{
  "location": "SEOUL",
  "description": "업데이트된 소개"
}
```

**Note**:
- 두 필드 모두 optional
- location은 Region enum 값 사용

**Response**:
```json
{
  "msg": "가이드 정보가 성공적으로 수정되었습니다.",
  "data": {
    "id": 1,
    "email": "guide@example.com",
    "nickname": "서울가이드",
    "profileImageUrl": "https://...",
    "role": "GUIDE",
    "location": "SEOUL",
    "description": "업데이트된 소개"
  }
}
```

---

## 공통 에러 응답

모든 API는 에러 시 다음 형식으로 응답합니다:

```json
{
  "msg": "에러 메시지",
  "data": null
}
```

**HTTP Status Codes**:
- 400 Bad Request: 잘못된 요청
- 401 Unauthorized: 인증 실패 (토큰 만료/없음)
- 403 Forbidden: 권한 없음
- 404 Not Found: 리소스 없음
- 500 Internal Server Error: 서버 에러
