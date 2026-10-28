import { QuizQuestion, ChecklistItem } from '../types/place';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '가루약은 봉지를 뜯어서 가루만 한 통에 털어 모은 후 배출해야 한다?',
    answer: false,
    explanation: '정답은 X입니다! 가루약은 뜯는 순간 미세 분말이 공기 중에 날려 호흡기로 흡입되거나 피부 알레르기를 일으킬 위험이 있습니다. 포장된 약포지(봉지) 그대로 모아 배출해야 합니다.',
    sourceRef: '환경부 생활계 유해폐기물 지침',
  },
  {
    id: 2,
    question: '남은 물약이나 감기 시럽은 싱크대에 물과 함께 흘려보내도 정수장에서 걸러진다?',
    answer: false,
    explanation: '정답은 X입니다! 일반 하수처리장 시설은 항생제, 소염진통제 등의 약물 성분을 완전히 분해하지 못합니다. 강과 바다로 흘러가 어류 생태계를 파괴하고 슈퍼박테리아를 유발하므로 반드시 뚜껑을 닫아 수거함에 배출해야 합니다.',
    sourceRef: '질병관리청 항생제 내성 예방 가이드',
  },
  {
    id: 3,
    question: '알약의 겉 종이상자와 사용설명서는 종이류로 따로 분리수거해야 한다?',
    answer: true,
    explanation: '정답은 O입니다! 종이 상자와 설명서까지 수거함에 넣으면 수거함이 금방 꽉 차서 다른 사람이 약을 넣지 못합니다. 종이류는 재활용 분리수거함에 배출해주세요.',
    sourceRef: '환경부 분리배출 가이드라인',
  },
  {
    id: 4,
    question: '우체통 폐의약품 회수함을 이용할 때 물약이나 시럽도 봉투에 넣어 보낼 수 있다?',
    answer: false,
    explanation: '정답은 X입니다! 우체통 투입 시 집배 과정에서 액체가 새어 다른 일반 우편물을 훼손할 수 있어 액체류는 우체통 투입이 엄격히 금지됩니다. 물약은 주민센터나 보건소 수거함을 이용해주세요.',
    sourceRef: '우정사업본부 우편회수 공고',
  },
  {
    id: 5,
    question: '수거함에 모인 폐의약품은 일반 쓰레기와 달리 850℃ 이상의 전문 고온소각 시설에서 전량 소각된다?',
    answer: true,
    explanation: '정답은 O입니다! 폐의약품은 환경오염을 방지하기 위해 일반 매립하지 않고, 전문 지정 소각시설에서 초고온으로 안전하게 완전 연소하여 소각 처리됩니다.',
    sourceRef: '자원순환기본법 및 폐기물관리법 시행규칙',
  },
];

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'chk-1',
    title: '유통기한 지난 약품 점검하기',
    description: '가정 내 구급함에서 유효기간이 지난 비상약, 증상이 호전되어 복용을 중단하고 남은 처방약을 모두 모읍니다.',
    category: 'sorting',
  },
  {
    id: 'chk-2',
    title: '겉포장 종이상자 & 설명서 분리',
    description: '개인정보가 적힌 라벨을 제거하고, 종이상자와 약품 설명서는 종이 재활용 수거함으로 분리배출합니다.',
    category: 'packaging',
  },
  {
    id: 'chk-3',
    title: '알약은 비닐봉투에 모으기 (가루약은 뜯지 않기)',
    description: 'PTP 은박 포장의 알약은 알약만 쏙쏙 까서 한 봉투에 모읍니다. 가루약은 뜯지 말고 봉지 채로 모읍니다.',
    category: 'packaging',
  },
  {
    id: 'chk-4',
    title: '물약·시럽 뚜껑 꼭 닫아 밀봉하기',
    description: '액체류는 남은 양을 한 병에 모으고 뚜껑을 꼭 닫아 이동 중 가방이나 옷에 새지 않도록 밀봉합니다.',
    category: 'packaging',
  },
  {
    id: 'chk-5',
    title: '수거함 위치 및 운영시간 확인 후 방문',
    description: '우리 동네 폐의약품 지도에서 주민센터나 보건소의 수거함 층수(민원실 등)와 운영시간을 확인하고 배출합니다.',
    category: 'dropoff',
  },
];
