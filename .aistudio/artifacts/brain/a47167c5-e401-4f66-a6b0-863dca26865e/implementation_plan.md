# [우리 동네 폐의약품 지도] 구현 계획서

시민과 학생이 안전하고 올바르게 폐의약품을 배출할 수 있도록 검증된 수거 장소 안내, 대화형 지도, 제형별 분리배출 가이드, 그리고 친환경 실천 퀴즈 및 체크리스트를 제공하는 반응형 공공 웹 애플리케이션입니다.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> 사용자가 Phase 1 질문에서 확정한 핵심 설계 사항과 기본 원칙입니다:
> - **지도 표현 방식**: 외부 API 키 의존성 없이 즉각 부드럽게 동작하며 직관적으로 마커와 상세 위치를 탐색할 수 있는 **'대화형 인터랙티브 캔버스 지도'**를 1차 기본 탑재하고, 상용 지도 API(카카오/네이버) 연동 가이드 및 원클릭 외부 지도 길찾기 링크를 제공합니다.
> - **초기 데이터 및 확장성**: 명확히 '예시 테스트 데이터'로 표기된 3개 이상의 검증 스키마 기반 샘플 데이터를 별도 모듈로 격리하고, 사용자가 직접 테스트 장소를 등록·검증해볼 수 있는 **'수거함 데이터 관리 도구'**를 함께 제공합니다.
> - **시민·학생 맞춤 기능**: 수거함 위치 확인뿐만 아니라 올바른 약품 폐기 문화를 학습할 수 있도록 **'폐의약품 분리배출 OX 퀴즈'**와 **'방문 전 배출 준비 체크리스트'**를 통합 제공합니다.

---

### 1. Overview & Core Concept

- **What It Does**:
  - 지자체 주민센터·행정복지센터, 보건소, 약국, 기타 공공시설의 폐의약품 전용 수거함 위치와 상세 수거 조건(위치 층수, 운영시간, 주의사항, 확인일자, 정보 출처)을 검색 및 필터링하여 탐색.
  - 알약, 가루약, 물약, 연고/안약 등 약품 형태별 정확한 배출 절차 및 환경 오염 방지 가이드라인 안내.
  - 학생과 시민이 흥미롭게 학습할 수 있는 배출 상식 OX 퀴즈 및 준비물 점검 인터랙션.
- **Target Audience / Persona**:
  - **일반 시민/주부/직장인**: 가정 내 유효기간이 지난 비상약, 처방약을 안전하게 폐기하고자 가까운 수거함을 찾는 사용자.
  - **학생/청소년**: 학교 환경 동아리 활동, 봉사 과제, 일상 속 친환경 자원순환 습관을 실천하고자 하는 사용자.
- **Key Value**:
  - 하수구 및 종량제 봉투 배출로 인한 항생제 하천 유입, 슈퍼박테리아 발생 등 수생태계 파괴를 예방하고 정확한 공공정보 전달.

---

### 2. User Experience & Visual Design

- **Visual Identity & Theme**:
  - **Aesthetic Direction**: 공공기관 및 친환경 보건 서비스의 단정함과 신뢰감을 주는 모던 에코 미니멀리즘(Clean Environmental & Civic Identity).
  - **Color Palette (60-30-10 규칙 준수)**:
    - *Canvas (60%)*: 깨끗한 백색(`bg-white`, `#FFFFFF`) 및 연한 에코 페이퍼 틴트(`bg-stone-50`/`bg-emerald-50/20`).
    - *Structural Surfaces (30%)*: 소프트 슬레이트와 민트 서피스(`bg-emerald-50/40`, `border-stone-200`, `text-stone-700`).
    - *Accent Budget (10%)*: 짙은 딥 포레스트 그린(`text-emerald-900`, `bg-emerald-800`), 포인트 엑센트 민트(`emerald-600`, `teal-500`).
  - **Typography & Scale**:
    - 본문 및 레이블: 깔끔하고 가독성 높은 시스템 산세리프(Pretendard / Plus Jakarta Sans 기반).
    - 메타데이터 및 운영시간: 정밀한 숫자 정렬을 위한 `tabular-nums`.
    - 헤드라인 밸런스: `text-wrap: balance` 적용 및 제로-필(Zero-Pill) 규칙 준수.
- **Top Bar Contract**:
  - 1행 3구역 엄격 준수:
    - [Zone 1] 브랜드 로고타입: `우리 동네 폐의약품 지도` (원라인 단일 텍스트 워드마크)
    - [Zone 2] 네비게이션 탭: `수거 장소 찾기`, `올바른 배출 방법`, `배출 퀴즈&체크리스트`, `수거함 제보/관리` (단일 행 텍스트 링크)
    - [Zone 3] 주요 CTA: `내 주변 수거함 찾기` 버튼
- **Layout Architecture & Mobile Responsiveness**:
  - **데스크톱 (1440px 대응)**: 좌측 380px 장소 검색 및 목록 필터 패널 + 우측 대화형 캔버스 지도 영역의 2분할 스플릿 뷰. 장소 선택 시 부드러운 우측 슬라이드 상세 인포메이션 카드 오버레이.
  - **모바일 (375px~430px 대응)**:
    - 상단 컴팩트 검색 & 필터 바 + 지도/목록 탭 토글러.
    - 지도 터치 시 하단에서 부드럽게 올라오는 바텀 시트(Bottom Sheet) 형태의 장소 상세 카드.
    - 44px 이상의 터치 타겟과 엄격한 스티키 바 높이 제한(뷰포트 15% 이하 유지).

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: 지도 렌더링 엔진 (인터랙티브 캔버스 vs 외부 상용 지도)**
  - *선택*: SVG/HTML5 Canvas 기반의 대화형 로컬 맵 엔진 구축. 서울/수도권 및 동네 뷰 시뮬레이션, 줌인/줌아웃, 팬(Pan), 커스텀 카테고리 핀 마커, 클릭 인터랙션 제공.
  - *이유*: API 키 발급 없이도 즉시 안정적으로 실행되며 모바일 iframe 샌드박스에서도 무결점 작동 보장. 동시에 지도 상단에 "실제 공공 API 연결 가이드" 배너를 명시하여 확장성 확보.
- **Decision 2: 데이터 무결성 및 엄격한 검증 스키마**
  - *선택*: 임의의 가짜 주소나 운영시간을 사실처럼 날조하지 않고, `id`, `name`, `address`, `latitude`, `longitude`, `type`, `collectionLocation`, `openingHours`, `notes`, `source`, `lastVerified` 11개 표준 필드를 정의한 분리 모듈(`src/data/collectionPlaces.ts`) 생성.
  - *이유*: 사용자 요구사항의 "확인되지 않은 필드는 '확인 필요'로 표시" 규칙을 철저히 준수하여 공공정보 신뢰도를 확립.
- **Decision 3: 시민·학생 실천 강화 (OX 퀴즈 & 분리수거 체크리스트)**
  - *선택*: 단순 위치 조회를 넘어 약품을 폐기하러 가기 전 가루약 포장 그대로 두기, 비닐/종이 분리하기, 액체류 밀봉하기 등 실천 체크리스트와 즉석 채점 퀴즈 수록.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           우리 동네 폐의약품 지도                            │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
    ┌───────────────────────┐                     ┌───────────────────────┐
    │     Header TopBar     │                     │      Active View      │
    │  (Brand, Nav, LocBtn) │                     │  (Map, Guide, Quiz)   │
    └───────────────────────┘                     └───────────┬───────────┘
                                                              │
        ┌─────────────────────────────────────────────────────┼────────────────────────┐
        ▼                                                     ▼                        ▼
┌───────────────┐                                     ┌───────────────┐        ┌───────────────┐
│   Map & List  │                                     │  Waste Guide  │        │ Quiz & Check  │
│  Directory    │                                     │  (By Form)    │        │  (Interactive)│
└───────┬───────┘                                     └───────┬───────┘        └───────┬───────┘
        │                                                     │                        │
        ├─ Search & Category Filters (FilterTabs)             ├─ Dosage Forms Card     ├─ 5-Question OX
        ├─ Interactive Canvas/SVG Map (MapViewer)             ├─ Packaging Disposal    ├─ Score & Review
        ├─ Place List & Card Items (PlaceList)                ├─ Civic FAQ Accordion   └─ 5-Step Checklist
        ├─ Place Detail Sheet/Modal (PlaceDetail)             └─ Official Sources
        └─ Test Data Manager (AddPlaceModal)
```

#### Data Model (`src/types/place.ts`)

```typescript
export type PlaceType = 'community_center' | 'health_center' | 'pharmacy' | 'other';

export interface CollectionPlace {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: PlaceType;
  collectionLocation: string; // e.g., '1층 민원실 입구 우측'
  openingHours: string;       // e.g., '평일 09:00 - 18:00 (주말·공휴일 휴무)'
  notes: string;              // e.g., '알약만 모아 배출, PTP 포장재 분리 필수'
  source: string;             // e.g., '종로구청 환경과 공지'
  lastVerified: string;       // e.g., '2026-03-15' 또는 '확인 필요'
  isVerified: boolean;        // 현장 또는 공공데이터 실사 여부
  phone?: string;
}
```

#### Interactive Component & State Mapping

1. `activeTab`: `'map' | 'guide' | 'quiz' | 'manage'` 네비게이션 탭 상태.
2. `searchQuery` & `selectedType`: 장소명/주소 실시간 검색 필터와 장소 유형별 토글.
3. `selectedPlaceId`: 선택된 마커 및 목록 항목의 양방향 동기화 하이라이트.
4. `mobileViewMode`: 모바일 화면에서 지도(`map`)와 목록(`list`) 원터치 전환.
5. `quizAnswers`: 학생 및 시민 대상 퀴즈 상태와 결과 피드백.
6. `checklistState`: 폐의약품 배출 전 사전 준비 5단계 체크박스 완료율.
7. `customPlaces`: 사용자가 브라우저에서 직접 추가/시연해볼 수 있는 로컬 스토리지 연동 테스트 장소 데이터.
