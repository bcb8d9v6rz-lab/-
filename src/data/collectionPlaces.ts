import { CollectionPlace, PlaceType } from '../types/place';

/**
 * 부산광역시 금정구 부곡동 및 인접 지역 폐의약품 수거 장소 데이터셋
 * 
 * - 부곡동 및 인근 약국: 김약국, 성신약국, 부곡약국, 초원약국, 큰보람약국, 영일약국, 중앙약국, 대도약국
 * - 행정복지센터/주민센터: 부곡1동, 부곡2동, 부곡3동, 부곡4동, 온천1동, 명륜동
 * - 보건소: 동래구 보건소
 * - 빨간 우체통: 금정우체국 앞 폐의약품 회수 우체통
 */
export const INITIAL_COLLECTION_PLACES: CollectionPlace[] = [
  // 1. 약국 (pharmacy)
  {
    id: 'pharmacy-kim',
    name: '김약국',
    address: '부산광역시 금정구 시실로 13 (부곡동 890-13)',
    latitude: 35.2250,
    longitude: 129.0890,
    type: 'pharmacy',
    collectionLocation: '약국 출입문 내부 수거함 비치대',
    openingHours: '평일 09:00 - 19:30, 토요일 09:00 - 15:00 (일요일 휴무)',
    notes: '폐의약품은 조제 약사님께 전달하시거나 비치된 전용 수거함에 배출하세요.',
    source: '금정구 부곡동 의약업소 등록 정보',
    lastVerified: '2026-03-25',
    isExampleData: false,
    phone: '051-512-6119',
  },
  {
    id: 'pharmacy-sungshin',
    name: '성신약국',
    address: '부산광역시 금정구 오시게로 22, 1층 (부곡동 873-5)',
    latitude: 35.2238,
    longitude: 129.0882,
    type: 'pharmacy',
    collectionLocation: '약국 카운터 옆 전용 수거함',
    openingHours: '평일 09:00 - 20:00, 토요일 09:00 - 16:00',
    notes: '알약은 비닐 및 PTP 포장재 분리 후 알약만 모아 배출 요망',
    source: '금정구 부곡동 의약업소 등록 정보',
    lastVerified: '2026-03-25',
    isExampleData: false,
    phone: '051-513-3392',
  },
  {
    id: 'pharmacy-bugok',
    name: '부곡약국',
    address: '부산광역시 금정구 부곡로 128, 1층',
    latitude: 35.2310,
    longitude: 129.0912,
    type: 'pharmacy',
    collectionLocation: '약국 출입문 내부 수거함 비치',
    openingHours: '평일 09:00 - 19:00, 토요일 09:00 - 14:00',
    notes: '물약과 시럽은 뚜껑을 꼭 닫아 새지 않게 밀봉 후 투입',
    source: '금정구 부곡동 의약업소 등록 정보',
    lastVerified: '2026-03-25',
    isExampleData: false,
    phone: '051-518-2088',
  },
  {
    id: 'pharmacy-chowon',
    name: '초원약국',
    address: '부산광역시 금정구 부곡로 38 (부곡동 395-1)',
    latitude: 35.2215,
    longitude: 129.0905,
    type: 'pharmacy',
    collectionLocation: '매장 출입문 측면 수거함',
    openingHours: '평일 09:00 - 19:30, 토요일 09:00 - 15:00',
    notes: '가루약은 약포지를 뜯지 말고 봉지 채로 배출',
    source: '금정구 부곡동 의약업소 등록 정보',
    lastVerified: '2026-03-25',
    isExampleData: false,
    phone: '051-582-8275',
  },
  {
    id: 'pharmacy-keunboram',
    name: '큰보람약국',
    address: '부산광역시 금정구 부곡로 120-1 (부곡동 257-21, 명성빌딩)',
    latitude: 35.2302,
    longitude: 129.0910,
    type: 'pharmacy',
    collectionLocation: '약국 접수대 인근 폐의약품 수거함',
    openingHours: '평일 09:00 - 20:00, 토요일 09:00 - 16:00',
    notes: '종이상자와 사용설명서는 분리수거하고 약품만 투입해주세요.',
    source: '금정구 부곡동 의약업소 등록 정보',
    lastVerified: '2026-03-25',
    isExampleData: false,
    phone: '051-515-3030',
  },
  {
    id: 'pharmacy-youngil',
    name: '영일약국',
    address: '부산광역시 동래구 금강공원로 11, 1층 (온천동)',
    latitude: 35.2200,
    longitude: 129.0820,
    type: 'pharmacy',
    collectionLocation: '약국 출입구 우측 수거 비치대',
    openingHours: '평일 09:00 - 19:00, 토요일 09:00 - 14:00',
    notes: '동래구 온천동 인접 약국, 약품 배출 전 문의 환영',
    source: '동래구 온천동 의약업소 등록 정보',
    lastVerified: '2026-03-25',
    isExampleData: false,
    phone: '051-555-0010',
  },
  {
    id: 'pharmacy-jungang',
    name: '중앙약국',
    address: '부산광역시 금정구 중앙대로 1719번길 16 일대 (부곡동/장전동 경계)',
    latitude: 35.2290,
    longitude: 129.0880,
    type: 'pharmacy',
    collectionLocation: '약국 내부 조제실 옆 수거함',
    openingHours: '평일 09:00 - 19:00',
    notes: '부산대역 인근 위치, 방문 전 수거함 설치 상태 확인 권장',
    source: '금정구 약사회 등록 정보',
    lastVerified: '2026-03-25',
    isExampleData: false,
    phone: '051-516-0021',
  },
  {
    id: 'pharmacy-daedo',
    name: '대도약국',
    address: '부산광역시 동래구 온천동 일대 (부곡동 인접 생활권)',
    latitude: 35.2160,
    longitude: 129.0810,
    type: 'pharmacy',
    collectionLocation: '약국 출입문 내부 수거함',
    openingHours: '평일 09:00 - 19:00',
    notes: '부곡동 인접 온천동 방면 약국, 방문 전 유선 확인 권장',
    source: '지역 약국 등록 정보',
    lastVerified: '2026-03-25',
    isExampleData: false,
    phone: '051-553-2415',
  },

  // 2. 주민센터 / 행정복지센터 (center)
  {
    id: 'center-bugok1',
    name: '부곡1동 주민센터',
    address: '부산광역시 금정구 동부곡로6번길 29 (부곡동 887-2)',
    latitude: 35.2255,
    longitude: 129.0903,
    type: 'center',
    collectionLocation: '1층 민원실 출입구 옆 폐의약품 전용 수거함',
    openingHours: '평일 09:00 - 18:00 (토·일·공휴일 휴무)',
    notes: '금정구청 자원순환과 정기 회수 거점. 알약, 가루약, 밀봉된 물약 상시 배출 가능',
    source: '금정구청 공공데이터 및 부곡1동 주민센터 안내',
    lastVerified: '2026-03-25',
    isExampleData: false,
    phone: '051-519-5140',
  },
  {
    id: 'center-bugok2',
    name: '부곡2동 행정복지센터',
    address: '부산광역시 금정구 부곡로156번길 7 (부곡동 267-3)',
    latitude: 35.2325,
    longitude: 129.0905,
    type: 'center',
    collectionLocation: '1층 민원실 안내데스크 우측 수거함',
    openingHours: '평일 09:00 - 18:00 (토·일·공휴일 휴무)',
    notes: '상시 수거함 비치 중. 비닐과 종이상자는 분리수거 후 약품만 투입',
    source: '금정구청 공공데이터 및 부곡2동 행정복지센터 안내',
    lastVerified: '2026-03-25',
    isExampleData: false,
    phone: '051-519-5160',
  },
  {
    id: 'center-bugok3',
    name: '부곡3동 행정복지센터',
    address: '부산광역시 금정구 기찰로 107 (부곡동 12-53)',
    latitude: 35.2395,
    longitude: 129.0920,
    type: 'center',
    collectionLocation: '행정복지센터 청사 로비 전용 수거함',
    openingHours: '평일 09:00 - 18:00 (토·일·공휴일 휴무)',
    notes: '부곡3동 및 금정구 주민 상시 이용 가능',
    source: '금정구청 공공데이터 및 부곡3동 행정복지센터 안내',
    lastVerified: '2026-03-25',
    isExampleData: false,
    phone: '051-519-5180',
  },
  {
    id: 'center-bugok4',
    name: '부곡4동 주민센터',
    address: '부산광역시 금정구 부곡로18번안길 37 (부곡동 425-1)',
    latitude: 35.2205,
    longitude: 129.0910,
    type: 'center',
    collectionLocation: '1층 종합민원실 입구 앞 전용 수거함',
    openingHours: '평일 09:00 - 18:00 (토·일·공휴일 휴무)',
    notes: '포장재 분리 후 알약만 봉투에 모아 배출',
    source: '금정구청 공공데이터 및 부곡4동 주민센터 안내',
    lastVerified: '2026-03-25',
    isExampleData: false,
    phone: '051-519-5200',
  },
  {
    id: 'center-oncheon1',
    name: '온천1동 행정복지센터',
    address: '부산광역시 동래구 금강로 127 (온천동 221-1)',
    latitude: 35.2185,
    longitude: 129.0815,
    type: 'center',
    collectionLocation: '1층 로비 민원안내창구 옆',
    openingHours: '평일 09:00 - 18:00 (토·일·공휴일 휴무)',
    notes: '동래구 온천1동 관할, 부곡동 인접 거점 주민센터',
    source: '동래구청 공공데이터 및 온천1동 행정복지센터 안내',
    lastVerified: '2026-03-25',
    isExampleData: false,
    phone: '051-550-6420',
  },
  {
    id: 'center-myeongnyun',
    name: '명륜동 행정복지센터',
    address: '부산광역시 동래구 명륜로207번길 26 (명륜동 594)',
    latitude: 35.2120,
    longitude: 129.0855,
    type: 'center',
    collectionLocation: '1층 민원봉사실 출입구 수거함',
    openingHours: '평일 09:00 - 18:00 (토·일·공휴일 휴무)',
    notes: '동래구 명륜동 행정복지센터 폐의약품 수거 거점',
    source: '동래구청 자원순환과 안내',
    lastVerified: '2026-03-25',
    isExampleData: false,
    phone: '051-550-6440',
  },

  // 3. 보건소 (health_center)
  {
    id: 'health-dongnae',
    name: '동래구 보건소',
    address: '부산광역시 동래구 명륜로187번길 56 (명륜동 595)',
    latitude: 35.2105,
    longitude: 129.0845,
    type: 'health_center',
    collectionLocation: '보건소 본관 1층 로비 종합안내데스크 옆',
    openingHours: '평일 09:00 - 18:00 (점심시간 12:00 - 13:00 상시 투입 가능)',
    notes: '전문 폐의약품 집중 수거 거점. 물약, 연고류 포함 전 제형 안전 수거',
    source: '동래구 보건소 의약과 공지',
    lastVerified: '2026-03-25',
    isExampleData: false,
    phone: '051-550-6700',
  },

  // 4. 기타 / 빨간 우체통 (other)
  {
    id: 'postbox-geumjeong',
    name: '금정우체국 앞 폐의약품 우체통',
    address: '부산광역시 금정구 중앙대로 1793 (부곡동 31-1)',
    latitude: 35.2340,
    longitude: 129.0895,
    type: 'other',
    collectionLocation: '금정우체국 정문 앞 붉은 우체통 투입구',
    openingHours: '24시간 상시 투입 가능 (우체국 집배원 정기 회수)',
    notes: '봉투 겉면에 [폐의약품]이라고 굵게 기재하여 밀봉 후 투입. 물약·시럽은 누수 위험으로 우체통 투입 불가.',
    source: '우정사업본부 부산지방우정청 우편회수 공고',
    lastVerified: '2026-03-25',
    isExampleData: false,
    phone: '051-580-0114',
  },
];

export const PLACE_TYPE_LABELS: Record<PlaceType, string> = {
  pharmacy: '약국',
  center: '주민센터·복지센터',
  health_center: '보건소',
  other: '우체통·기타 수거처',
};

// 파스텔톤 컬러 팔레트 (약국: 파스텔 민트/세이지, 복지센터: 파스텔 코랄/로즈 핑크)
export const PLACE_TYPE_COLORS: Record<PlaceType, {
  bg: string;
  text: string;
  badge: string;
  border: string;
  pinBg: string;
  pinStroke: string;
  iconColor: string;
}> = {
  pharmacy: {
    bg: 'bg-emerald-50/70 text-emerald-900 border-emerald-200',
    text: 'text-emerald-800',
    badge: 'bg-emerald-100/80 text-emerald-900',
    border: 'border-emerald-300',
    pinBg: '#A7F3D0', // 파스텔 민트/세이지
    pinStroke: '#059669',
    iconColor: '#065F46',
  },
  center: {
    bg: 'bg-rose-50/70 text-rose-900 border-rose-200',
    text: 'text-rose-800',
    badge: 'bg-rose-100/80 text-rose-900',
    border: 'border-rose-300',
    pinBg: '#FECDD3', // 파스텔 로즈/코랄 핑크
    pinStroke: '#E11D48',
    iconColor: '#9F1239',
  },
  health_center: {
    bg: 'bg-sky-50/70 text-sky-900 border-sky-200',
    text: 'text-sky-800',
    badge: 'bg-sky-100/80 text-sky-900',
    border: 'border-sky-300',
    pinBg: '#BAE6FD', // 파스텔 스카이 블루
    pinStroke: '#0284C7',
    iconColor: '#0369A1',
  },
  other: {
    bg: 'bg-amber-50/70 text-amber-900 border-amber-200',
    text: 'text-amber-800',
    badge: 'bg-amber-100/80 text-amber-900',
    border: 'border-amber-300',
    pinBg: '#FED7AA', // 파스텔 피치/오렌지
    pinStroke: '#D97706',
    iconColor: '#9A3412',
  },
};

const STORAGE_KEY = 'neighborhood_medicine_places_bugok_v2';

export function getStoredPlaces(): CollectionPlace[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_COLLECTION_PLACES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load places from storage', e);
  }
  return INITIAL_COLLECTION_PLACES;
}

export function saveStoredPlaces(places: CollectionPlace[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
  } catch (e) {
    console.error('Failed to save places to storage', e);
  }
}

export function resetStoredPlaces(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to reset places storage', e);
  }
}
