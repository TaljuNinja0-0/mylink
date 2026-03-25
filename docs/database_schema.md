# 마이링크 (MyLink) 데이터베이스 스키마

## 1. 데이터 모델링 개요
본 프로젝트의 데이터베이스는 **Firebase Firestore (NoSQL)**를 기반으로 설계됩니다.
빠른 읽기 성능과 유저별 데이터 격리를 고려하여, 최상위 컬렉션에 사용자 데이터를 저장하고 각 유저가 소유한 링크 아이템들은 **서브 컬렉션(Subcollection)** 구조 안에 담아 구축합니다.

## 2. 스키마 (Collection & Subcollection) 명세

### 2-1. 최상위 컬렉션: `users`
회원가입 절차(Google OAuth)를 마친 회원의 프로필 및 기본 데이터가 저장됩니다.

- **Document ID**: `uid` (Firebase Auth에서 발급된 고유 고유번호)
- **Fields**:
  - `displayName` (string): 회원 고유 접속 URL 슬러그(`/[displayName]`)로 사용되는 고유 식별자. **최초 가입 시 구글 지메일(Gmail) 계정의 앞부분(`@` 이전 문자열)**을 기본값으로 파싱하여 자동 저장함. (이후 인라인 편집으로 변경 가능하며, 중복 불가능한 URL 파라미터이므로 고유성(Unique) 무결성 검사가 필요함)
  - `username` (string): 접속 페이지 내에서 실제 명함처럼 화면 상단에 렌더링되어 보여질 사용자의 **진짜 실명 (Real Name)** 혹은 활동명. 인라인 직접 편집(Inline Editing) 대상 필드.
  - `bio` (string, optional): 사용자가 인라인 편집을 통해 가볍게 수정할 수 있는 자기소개 문구.
  - `totalPageViews` (number): 프로필 전체 페이지 누적 방문 조회수
  - `createdAt` (timestamp): 생성 일시

*(주의: 기획 요구사항에 맞춰 시각적 아바타 업로드를 위한 `photoURL` 필드 스키마는 전면 배제됨)*

---

### 2-2. 유저별 서브 컬렉션: `links`
회원이 생성한 멀티링크 URL 아이템 개체들을 격리하여 저장합니다.
- **Reference Path**: `users/{uid}/links/{linkId}`

- **Document ID**: 자동 생성된 Firestore ID (`linkId`)
- **Fields**:
  - `title` (string): 버튼에 노출될 링크 제목 (인라인 편집 지원)
  - `url` (string): 방문자가 이동할 목적지 링크 주소 (인라인 편집 지원)
  - `faviconUrl` (string): Google Favicon API를 통해 추출된 목적지 웹사이트 공식 아이콘 주소
  - `clickCount` (number): 이 개별 링크의 누적 클릭 통계 조회수
  - `createdAt` (timestamp): 생성 일시 (기본 정렬 순서 보장용)
