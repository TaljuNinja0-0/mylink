# 마이링크 (MyLink) 모바일 UI 와이어프레임

본 문서는 `shadcn/ui` 모던 프레임워크와 인라인 편집(Inline Editing) UX가 적용된 마이링크 서비스의 화면 구조를 **Mermaid 차트**와 **ASCII 아트**를 활용하여 시각적으로 명세합니다.

---

## 1. 컴포넌트 아키텍처 (Mermaid Flow)

애플리케이션 전반의 컴포넌트 트리 및 페이지별 계층 구조를 나타냅니다.

```mermaid
graph TD
    A[Next.js App Router Root] --> B(Auth View: /login)
    A --> C(Admin Dashboard: /dashboard)
    A --> D(Public Profile View: /[displayName])

    %% Admin Dashboard Component Tree
    C --> C1[DashboardHeader: Logout, Public Link]
    C --> C2[ProfileEditor: Inline Fields]
    C2 -.->|Click to Edit| C2_1[Text Input]
    C --> C3[LinkManager: Add Btn]
    C3 --> C4[LinkCard List]
    
    C4 --> C4_1[Favicon Image Area]
    C4 --> C4_2[Inline Title / URL Input]
    C4 --> C4_3[Delete Button 🗑️]
    C4 --> C4_4[ClickCount Badge 👁️]

    %% Public View Component Tree
    D --> D1[PublicProfile: ReadOnly Name/Bio]
    D --> D2[PublicLinkList: Link Buttons]
    D2 -.->|Click Request| D2_1[Firestore API: Increment View]
```

---

## 2. 화면별 와이어프레임 (ASCII Art)

모바일 화면(모바일 디바이스 뷰포트) 비율을 기준으로 작성된 직관적인 사이트 초안 와이어프레임입니다.

### 2-1. 소유자 대시보드 (Admin Dashboard)
로그인한 소유자에게만 노출되며, 모든 텍스트 요소를 실시간으로 직접 덮어쓰는(인라인 편집) 링크트리형 관리자 화면입니다.

```text
+-----------------------------------+
|                                   |
|  [🏠 퍼블릭 보기]     [로그아웃 🚪] |
|                                   |
|  +-----------------------------+  |
|  |       [ 📈 total views: 1k] |  |
|  |                             |  |
|  |  ✏️ subin_dev               |  |
|  |  ✏️ 박수빈                  |  |
|  |  ✏️ AI 리서처 / 백엔드 개발    |  |
|  +-----------------------------+  |
|                                   |
|  [ + 새 링크 추가하기 ]             |
|                                   |
|  +-----------------------------+  |
|  | O  ✏️ GitHub Repository     |  |
|  | 🌐 ✏️ https://github.com/.. |  |
|  |  (👁️32)               [🗑️] |  |
|  +-----------------------------+  |
|  +-----------------------------+  |
|  | O  ✏️ Tistory Tech Blog     |  |
|  | 🌐 ✏️ https://tistory.com.. |  |
|  |  (👁️15)               [🗑️] |  |
|  +-----------------------------+  |
|                                   |
+-----------------------------------+
```
*기능 설명*: 
- `✏️` 아이콘이 붙어있는 구역들은 마우스나 터치로 누르는 그 순간 곧바로 인풋(Input) 상자로 포맷이 변경되어, 글자를 즉시 타이핑하고 엔터를 쳐서 저장할 수 있습니다.
- `O 🌐` 영역은 URL 주소가 정상 입력될 경우 구글 파비콘 API가 서버로 통신을 보내 실제 대상 웹사이트의 아이콘 이미지를 렌더링하는 구역입니다.

---

### 2-2. 방문자 랜딩 페이지 (Public View)
일반 방문자 유저가 `mylink.app/[displayName]` URL로 접속했을 때 나타나는 순수 100% 읽기 전용 뷰입니다.

```text
+-----------------------------------+
|                                   |
|             박수빈                |
|       AI 리서처 / 백엔드 개발        |
|                                   |
|                                   |
|  +-----------------------------+  |
|  | (G)   GitHub Repository     |  |
|  +-----------------------------+  |
|                                   |
|  +-----------------------------+  |
|  | (T)   Tistory Tech Blog     |  |
|  +-----------------------------+  |
|                                   |
|                                   |
|                                   |
|        ⚡ powered by MyLink       |
+-----------------------------------+
```
*기능 설명*: 
- 괄호 처리된 `(G)`, `(T)`는 대상 도메인 주소에서 실제로 추출되어 보여지는 이미지 파비콘의 위치 예시입니다.
- 사용자가 버튼(박스 영역)을 클릭하면 대상 URL 주소로 링크가 즉각 이동되며(`target="_blank"`), 동시에 데이터베이스(Firestore) 단에서 `clickCount` 클릭 수를 1만큼 증가시키는 API 조용 호출이 병행됩니다.

---

### 2-3. 소셜 로그인 화면 (Auth View)

```text
+-----------------------------------+
|                                   |
|                                   |
|                                   |
|             M y L i n k           |
|                                   |
|    당신의 모든 링크를 텍스트로,        |
|      가장 미니멀하게 통합하세요.       |
|                                   |
|  +-----------------------------+  |
|  | [G] Google 계정으로 계속하기   |  |
|  +-----------------------------+  |
|                                   |
|                                   |
+-----------------------------------+
```
