# GEMINI.md

이 파일은 MyLink 프로젝트의 개발 지침과 컨텍스트를 제공합니다.

## 1. 프로젝트 개요 (Project Overview)
**MyLink**는 사용자가 자신의 소셜 미디어, 포트폴리오, 웹사이트 링크를 하나의 통합된 페이지에서 관리하고 공유할 수 있는 심플한 링크 관리 플랫폼(Linktree 클론)입니다.

### 핵심 기술 스택
- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS 4, shadcn/ui (`base-nova` style)
- **Backend**: Firebase (Authentication, Firestore)
- **Language**: TypeScript

## 2. 빌드 및 실행 (Building and Running)
이 프로젝트는 표준 npm 스크립트를 사용합니다.

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드된 애플리케이션 실행
npm run start

# 린트 체크
npm run lint
```

## 3. 개발 컨벤션 및 아키텍처 (Development Conventions & Architecture)

### 프로젝트 구조
- `src/app/`: Next.js App Router 기반의 페이지 및 레이아웃
- `src/components/ui/`: shadcn/ui 기반의 재사용 가능한 컴포넌트
- `src/lib/`: 유틸리티 함수 및 설정 (예: `utils.ts`, Firebase 설정 등)
- `docs/`: 프로젝트 요구사항(PRD), 유저 시나리오, 와이어프레임 등 문서

### 주요 설계 원칙
- **인라인 편집(Inline Editing)**: 대시보드에서 링크 제목, URL, 프로필 정보를 즉시 수정할 수 있는 직관적인 UI 제공
- **자동 파비콘 추출**: Google Favicon API를 사용하여 링크 도메인에 따른 파비콘 자동 적용
- **데이터베이스 구조 (Firestore)**:
  - `users/{uid}`: 사용자 프로필 정보 (email, displayName, bio, photoURL 등)
  - `users/{uid}/links/{linkId}`: 사용자의 개별 링크 정보 (title, url, clickCount 등)

## 4. 주요 기능 (Core Features)
- **Google 소셜 로그인**: Firebase Auth를 통한 유일한 인증 수단
- **고유 URL 생성**: 지메일 아이디 기반의 고유 경로 제공 (`mylink.com/username`)
- **링크 관리 (CRUD)**: 링크 추가/수정/삭제 및 클릭수 통계 제공
- **반응형 랜딩 페이지**: 방문자에게 최적화된 링크 목록 뷰 제공

## 5. 참고 문서 (Key Documents)
- `docs/PRD.md`: 상세 제품 요구사항 정의서
- `docs/USER_SCENARIO.md`: 사용자 시나리오 및 흐름
- `docs/WIREFRAME.md`: UI/UX 설계를 위한 와이어프레임 정보
