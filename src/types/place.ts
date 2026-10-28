/**
 * 폐의약품 수거 장소 데이터 모델 및 관련 타입 정의
 */

export type PlaceType = 'pharmacy' | 'center' | 'health_center' | 'other';

export interface CollectionPlace {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: PlaceType;
  collectionLocation: string; // 수거함 위치 (예: '1층 민원실 입구 우측')
  openingHours: string;       // 운영시간 (예: '평일 09:00 - 18:00 (주말 휴무)')
  notes: string;              // 이용 시 주의사항 (예: '포장재 분리 후 알약만 봉투에 모아 배출')
  source: string;             // 정보 출처 (예: '종로구청 청소행정과 공지 (공식)')
  lastVerified: string;       // 마지막 확인일 (예: '2026-03-15' 또는 '확인 필요')
  isExampleData: boolean;     // 예시 테스트 데이터 여부
  phone?: string;             // 문의 전화번호 (확인된 경우에만)
}

export interface PlaceFilterState {
  searchQuery: string;
  selectedType: 'all' | PlaceType;
  verifiedOnly: boolean;
}

export interface DosageGuide {
  id: string;
  name: string;
  categoryName: string;
  badgeColor: string;
  summary: string;
  doList: string[];
  dontList: string[];
  packagingTip: string;
  caution: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  answer: boolean; // true = O, false = X
  explanation: string;
  sourceRef: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'packaging' | 'sorting' | 'dropoff';
}
