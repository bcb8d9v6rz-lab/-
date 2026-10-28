import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CollectionPlace } from '../types/place';
import { PLACE_TYPE_LABELS, PLACE_TYPE_COLORS } from '../data/collectionPlaces';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
  MapPin,
  ExternalLink,
  Heart,
  Pill,
  Compass,
} from 'lucide-react';

interface MapViewProps {
  places: CollectionPlace[];
  selectedPlace: CollectionPlace | null;
  onSelectPlace: (place: CollectionPlace) => void;
  userLocation: { lat: number; lng: number } | null;
}

export const MapView: React.FC<MapViewProps> = ({
  places,
  selectedPlace,
  onSelectPlace,
  userLocation,
}) => {
  // Map viewport states
  const [zoom, setZoom] = useState<number>(1.2);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredPlace, setHoveredPlace] = useState<CollectionPlace | null>(null);
  const [showApiBanner, setShowApiBanner] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Pinch-to-zoom tracking ref
  const touchStateRef = useRef<{
    initialDist: number;
    initialZoom: number;
    initialPan: { x: number; y: number };
    midpoint: { x: number; y: number };
  } | null>(null);

  // Geographic bounds around Busan Geumjeong-gu Bugok-dong & neighboring Oncheon/Myeongnyun
  const REF_MIN_LAT = 35.205; // South (Myeongnyun / Dongnae)
  const REF_MAX_LAT = 35.245; // North (Bugok 3-dong / Guseo)
  const REF_MIN_LNG = 129.075; // West (Oncheon-dong / Geumgang)
  const REF_MAX_LNG = 129.102; // East (Bugok 1,4-dong hillside)

  // Convert (lat, lng) to canvas percentage coordinates
  const projectCoordinates = (lat: number, lng: number) => {
    const xRatio = (lng - REF_MIN_LNG) / (REF_MAX_LNG - REF_MIN_LNG);
    const yRatio = 1 - (lat - REF_MIN_LAT) / (REF_MAX_LAT - REF_MIN_LAT);

    const baseX = Math.max(70, Math.min(930, xRatio * 840 + 80));
    const baseY = Math.max(70, Math.min(630, yRatio * 540 + 80));

    return { x: baseX, y: baseY };
  };

  // Center on selected place when selection changes
  useEffect(() => {
    if (selectedPlace) {
      const { x, y } = projectCoordinates(selectedPlace.latitude, selectedPlace.longitude);
      setPan({
        x: (500 - x) * zoom,
        y: (350 - y) * zoom,
      });
    }
  }, [selectedPlace?.id]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    setZoom((prev) => Math.max(0.65, Math.min(3.5, prev * zoomFactor)));
  };

  // Multi-touch gestures: Pinch-to-zoom (양손 드래그 확대/축소) & Single-touch pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch-to-zoom initial calculation
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const midX = (t1.clientX + t2.clientX) / 2;
      const midY = (t1.clientY + t2.clientY) / 2;

      touchStateRef.current = {
        initialDist: dist,
        initialZoom: zoom,
        initialPan: { ...pan },
        midpoint: { x: midX, y: midY },
      };
      setIsDragging(false);
    } else if (e.touches.length === 1) {
      // Single finger drag
      touchStateRef.current = null;
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStateRef.current) {
      // Two-finger pinch-to-zoom in action
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const scale = currentDist / touchStateRef.current.initialDist;

      const newZoom = Math.max(0.65, Math.min(3.5, touchStateRef.current.initialZoom * scale));
      setZoom(newZoom);

      // Also adjust pan based on midpoint movement
      const currentMidX = (t1.clientX + t2.clientX) / 2;
      const currentMidY = (t1.clientY + t2.clientY) / 2;
      const deltaX = currentMidX - touchStateRef.current.midpoint.x;
      const deltaY = currentMidY - touchStateRef.current.midpoint.y;

      setPan({
        x: touchStateRef.current.initialPan.x + deltaX,
        y: touchStateRef.current.initialPan.y + deltaY,
      });
    } else if (e.touches.length === 1 && isDragging) {
      // Single finger panning
      setPan({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      touchStateRef.current = null;
    }
    if (e.touches.length === 0) {
      setIsDragging(false);
    } else if (e.touches.length === 1) {
      // Switch back to single drag smoothly
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  };

  const resetView = () => {
    setZoom(1.2);
    setPan({ x: 0, y: 0 });
  };

  // Dynamic pin scale calculation:
  // As the user zooms in, the map geography enlarges.
  // We counter-scale the pins slightly so they maintain a comfortable, non-cluttering size on screen!
  // At zoom 0.7 (zoomed out): markerScale is ~0.85
  // At zoom 1.2 (default): markerScale is ~1.0
  // At zoom 2.5+ (zoomed in): markerScale is ~0.72 (keeps pin sharp, clean and compact so multiple pins in the same block don't collide)
  const pinDynamicScale = Math.max(0.65, Math.min(1.2, 1.05 / Math.pow(zoom, 0.45)));

  return (
    <div className="relative w-full h-[480px] md:h-full min-h-[460px] bg-stone-100/90 rounded-2xl overflow-hidden border border-stone-200 shadow-inner flex flex-col select-none touch-none">
      {/* Top Civic Status Banner */}
      {showApiBanner && (
        <div className="absolute top-3 left-3 right-3 z-20 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-stone-200 shadow-sm flex items-start justify-between gap-3 text-xs text-stone-700">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-stone-900">
                부산 금정구 부곡동 생활권 지도 (양손 핀치 줌 지원)
              </p>
              <p className="text-stone-500 mt-0.5 leading-relaxed">
                모바일 화면에서 두 손가락으로 드래그하여 지도를 자유롭게 확대·축소할 수 있으며, 배율에 맞춰 아이콘 크기가 최적화됩니다.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowApiBanner(false)}
            className="text-stone-400 hover:text-stone-700 text-xs px-2 py-1 rounded hover:bg-stone-100 shrink-0 cursor-pointer"
          >
            닫기
          </button>
        </div>
      )}

      {/* Floating Map Controls */}
      <div className="absolute top-20 md:top-24 right-3 z-20 flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-stone-200 shadow-md">
        <button
          onClick={() => setZoom((prev) => Math.min(prev + 0.35, 3.5))}
          aria-label="지도 확대"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-700 hover:bg-stone-100 active:scale-95 transition-all cursor-pointer"
          title="확대 (마우스 휠 가능)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((prev) => Math.max(prev - 0.35, 0.65))}
          aria-label="지도 축소"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-700 hover:bg-stone-100 active:scale-95 transition-all cursor-pointer"
          title="축소"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          aria-label="지도 시점 초기화"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-700 hover:bg-stone-100 active:scale-95 transition-all cursor-pointer"
          title="부곡동 기본 시점으로 복귀"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <div className="text-[10px] text-center font-mono text-stone-500 py-0.5 border-t border-stone-100">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Map Legend: Pastel icons */}
      <div className="absolute bottom-3 left-3 z-20 hidden sm:flex items-center gap-3 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-stone-200 shadow-sm text-xs text-stone-700">
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-md bg-[#A7F3D0] border border-[#059669] flex items-center justify-center text-[10px]">
            💊
          </span>
          <span className="font-medium text-emerald-900">약국 (파스텔 민트)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-md bg-[#FECDD3] border border-[#E11D48] flex items-center justify-center text-[10px]">
            💖
          </span>
          <span className="font-medium text-rose-900">복지센터 (파스텔 핑크)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-md bg-[#BAE6FD] border border-[#0284C7] flex items-center justify-center text-[10px]">
            🏥
          </span>
          <span className="font-medium text-sky-900">보건소</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-md bg-[#FED7AA] border border-[#D97706] flex items-center justify-center text-[10px]">
            📮
          </span>
          <span className="font-medium text-amber-900">우체통</span>
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`w-full h-full relative cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
      >
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '500px 350px',
            transition: isDragging || touchStateRef.current ? 'none' : 'transform 0.12s ease-out',
          }}
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.6" />
            </pattern>
            <pattern id="subgrid" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#CBD5E1" strokeWidth="1" />
            </pattern>
            <filter id="pinShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="2" floodOpacity="0.2" />
            </filter>
            {/* Mountain Contour Gradient */}
            <linearGradient id="geumjeongGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D1FAE5" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ECFDF5" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="yoonGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#F0FDF4" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* 1. Base Ground */}
          <rect width="1000" height="700" fill="#F8FAF8" />
          <rect width="1000" height="700" fill="url(#grid)" />
          <rect width="1000" height="700" fill="url(#subgrid)" />

          {/* 2. Topographical Mountain Ridges (금정산 서측 & 윤산 동측) */}
          {/* West: 금정산(Geumjeongsan) foothills & Geumgang Park */}
          <path
            d="M 0,0 L 220,0 C 260,140 240,260 210,380 C 180,480 150,580 80,700 L 0,700 Z"
            fill="url(#geumjeongGrad)"
            stroke="#A7F3D0"
            strokeWidth="1.5"
            strokeDasharray="5 3"
          />
          <path
            d="M 0,40 C 140,80 160,200 130,340 C 100,440 90,540 0,640 Z"
            fill="#BBF7D0"
            opacity="0.25"
          />
          <text x="70" y="100" fill="#047857" fontSize="13" fontWeight="bold" opacity="0.7">
            ⛰️ 금정산 자락
          </text>
          <text x="80" y="440" fill="#047857" fontSize="11" fontWeight="600" opacity="0.6">
            금강공원 방면
          </text>

          {/* East: 윤산(Yoon-san) / 구월산 foothills */}
          <path
            d="M 1000,0 L 820,0 C 780,160 810,300 840,420 C 870,540 890,620 1000,700 Z"
            fill="url(#yoonGrad)"
            stroke="#BAE6FD"
            strokeWidth="1.5"
            strokeDasharray="5 3"
          />
          <text x="880" y="140" fill="#0369A1" fontSize="13" fontWeight="bold" opacity="0.7">
            ⛰️ 윤산 (구월산)
          </text>
          <text x="880" y="420" fill="#0369A1" fontSize="11" fontWeight="600" opacity="0.6">
            윤산 생태공원
          </text>

          {/* 3. Waterway: 온천천 (Oncheoncheon Stream) with bridges and walking trails */}
          {/* Wide river basin */}
          <path
            d="M 520,0 C 510,120 480,240 450,340 C 420,440 380,540 360,700"
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="38"
            strokeLinecap="square"
          />
          {/* Central flowing water */}
          <path
            d="M 520,0 C 510,120 480,240 450,340 C 420,440 380,540 360,700"
            fill="none"
            stroke="#7DD3FC"
            strokeWidth="18"
            strokeLinecap="square"
          />
          {/* Riverside pedestrian & bicycle walking trail */}
          <path
            d="M 506,0 C 496,120 466,240 436,340 C 406,440 366,540 346,700"
            fill="none"
            stroke="#A7F3D0"
            strokeWidth="4"
            strokeDasharray="4 4"
            opacity="0.8"
          />
          <text x="475" y="160" fill="#0284C7" fontSize="12" fontWeight="bold" opacity="0.7">
            온천천
          </text>
          <text x="420" y="460" fill="#0284C7" fontSize="11" fontWeight="600" opacity="0.7">
            온천천 시민공원
          </text>

          {/* Bridges across Oncheoncheon (온천천 교량) */}
          {/* 구서교 (Guseo Bridge) */}
          <line x1="495" y1="65" x2="540" y2="70" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />
          <text x="548" y="72" fontSize="9" fill="#475569" fontWeight="bold">구서교</text>

          {/* 장전교 (Jangjeon Bridge) */}
          <line x1="465" y1="205" x2="510" y2="210" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />
          <text x="518" y="212" fontSize="9" fill="#475569" fontWeight="bold">장전교</text>

          {/* 부산대 앞 온천교 (Oncheon Bridge) */}
          <line x1="435" y1="345" x2="480" y2="350" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />
          <text x="488" y="352" fontSize="9" fill="#475569" fontWeight="bold">온천교</text>

          {/* 온천장교 (Oncheonjang Bridge) */}
          <line x1="395" y1="500" x2="440" y2="505" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />
          <text x="448" y="507" fontSize="9" fill="#475569" fontWeight="bold">온천장교</text>

          {/* 4. Primary Road Network (부곡동 및 주변 간선 도로망) */}
          {/* A. 중앙대로 (Jungang-daero) - Subway Line 1 main boulevard */}
          <path
            d="M 480,0 L 440,160 L 410,290 L 370,450 L 330,700"
            fill="none"
            stroke="#FED7AA"
            strokeWidth="14"
            opacity="0.7"
          />
          <path
            d="M 480,0 L 440,160 L 410,290 L 370,450 L 330,700"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="10"
          />
          <text x="390" y="260" fill="#C2410C" fontSize="10" fontWeight="bold" opacity="0.8">
            중앙대로
          </text>

          {/* B. 부곡로 (Bugok-ro) - Central spine through Bugok 1~4 dong */}
          <path
            d="M 680,20 C 650,150 630,280 610,420 C 590,540 560,650 540,700"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 680,20 C 650,150 630,280 610,420 C 590,540 560,650 540,700"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <text x="640" y="270" fill="#475569" fontSize="10" fontWeight="bold" opacity="0.85">
            부곡로 (부곡동 중심 도로)
          </text>

          {/* C. 금강로 (Geumgang-ro) - Oncheon-dong side */}
          <path
            d="M 280,220 L 260,380 L 230,550 L 210,700"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="8"
          />
          <path
            d="M 280,220 L 260,380 L 230,550 L 210,700"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="5"
          />
          <text x="235" y="360" fill="#64748B" fontSize="9" fontWeight="bold">
            금강로
          </text>

          {/* D. 가로 연결 도로들 (Connecting Cross Streets) */}
          {/* 시실로 (Sisil-ro - 김약국 인근) */}
          <path
            d="M 400,430 L 730,450"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="7"
          />
          <path
            d="M 400,430 L 730,450"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="4"
          />
          <text x="510" y="443" fill="#64748B" fontSize="9" fontWeight="600">
            시실로
          </text>

          {/* 기찰로 (Gichal-ro - 부곡3동 행정복지센터 인근) */}
          <path
            d="M 480,90 L 780,105"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="6"
          />
          <path
            d="M 480,90 L 780,105"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.5"
          />
          <text x="560" y="102" fill="#64748B" fontSize="9" fontWeight="600">
            기찰로
          </text>

          {/* 동부곡로 (Dongbugok-ro - 부곡1동 주민센터 앞) */}
          <path
            d="M 520,380 L 760,400"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="6"
          />
          <path
            d="M 520,380 L 760,400"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.5"
          />
          <text x="640" y="394" fill="#64748B" fontSize="9" fontWeight="600">
            동부곡로
          </text>

          {/* 오시게로 (성신약국 인근) */}
          <path
            d="M 400,490 L 640,510"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="5"
          />
          <path
            d="M 400,490 L 640,510"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
          />
          <text x="480" y="504" fill="#64748B" fontSize="8.5" fontWeight="600">
            오시게로
          </text>

          {/* 5. Subway Line 1 track and stations (부산 지하철 1호선) */}
          <path
            d="M 480,0 L 440,160 L 410,290 L 370,450 L 330,700"
            fill="none"
            stroke="#EA580C"
            strokeWidth="2.5"
            strokeDasharray="7 4"
            opacity="0.8"
          />

          {/* Subway Station Nodes */}
          {/* 구서역 */}
          <g transform="translate(480, 50)">
            <rect x="-24" y="-10" width="48" height="20" rx="10" fill="#EA580C" />
            <text x="0" y="3" textAnchor="middle" fontSize="10" fill="#FFFFFF" fontWeight="bold">구서역</text>
          </g>
          {/* 장전역 */}
          <g transform="translate(440, 180)">
            <rect x="-24" y="-10" width="48" height="20" rx="10" fill="#EA580C" />
            <text x="0" y="3" textAnchor="middle" fontSize="10" fill="#FFFFFF" fontWeight="bold">장전역</text>
          </g>
          {/* 부산대역 */}
          <g transform="translate(410, 310)">
            <rect x="-28" y="-10" width="56" height="20" rx="10" fill="#EA580C" />
            <text x="0" y="3" textAnchor="middle" fontSize="10" fill="#FFFFFF" fontWeight="bold">부산대역</text>
          </g>
          {/* 온천장역 */}
          <g transform="translate(370, 470)">
            <rect x="-28" y="-10" width="56" height="20" rx="10" fill="#EA580C" />
            <text x="0" y="3" textAnchor="middle" fontSize="10" fill="#FFFFFF" fontWeight="bold">온천장역</text>
          </g>
          {/* 명륜역 */}
          <g transform="translate(330, 620)">
            <rect x="-24" y="-10" width="48" height="20" rx="10" fill="#EA580C" />
            <text x="0" y="3" textAnchor="middle" fontSize="10" fill="#FFFFFF" fontWeight="bold">명륜역</text>
          </g>

          {/* 6. Neighborhood Sector Outlines & Public Landmarks */}
          {/* 부산대학교 캠퍼스 구역 */}
          <g transform="translate(240, 240)">
            <rect width="130" height="90" rx="8" fill="#F1F5F9" stroke="#CBD5E1" strokeDasharray="3 3" opacity="0.8" />
            <text x="65" y="45" textAnchor="middle" fontSize="11" fill="#334155" fontWeight="bold">
              🎓 부산대학교
            </text>
            <text x="65" y="62" textAnchor="middle" fontSize="9" fill="#64748B">
              부산캠퍼스
            </text>
          </g>

          {/* 부곡3동 영역 레이블 */}
          <g transform="translate(680, 100)">
            <rect x="-55" y="-14" width="110" height="22" rx="6" fill="#ECFDF5" stroke="#A7F3D0" opacity="0.9" />
            <text x="0" y="2" textAnchor="middle" fill="#065F46" fontSize="11.5" fontWeight="bold">
              금정구 부곡3동
            </text>
          </g>

          {/* 부곡2동 영역 레이블 */}
          <g transform="translate(710, 260)">
            <rect x="-55" y="-14" width="110" height="22" rx="6" fill="#FDF2F8" stroke="#FBCFE8" opacity="0.9" />
            <text x="0" y="2" textAnchor="middle" fill="#9D174D" fontSize="11.5" fontWeight="bold">
              금정구 부곡2동
            </text>
          </g>

          {/* 부곡1동 & 부곡4동 영역 레이블 */}
          <g transform="translate(690, 480)">
            <rect x="-65" y="-14" width="130" height="22" rx="6" fill="#FFFBEB" stroke="#FDE68A" opacity="0.9" />
            <text x="0" y="2" textAnchor="middle" fill="#92400E" fontSize="11.5" fontWeight="bold">
              금정구 부곡1·4동
            </text>
          </g>

          {/* 동래구 온천1동 / 명륜동 영역 레이블 */}
          <g transform="translate(180, 520)">
            <rect x="-65" y="-14" width="130" height="22" rx="6" fill="#F0F9FF" stroke="#BAE6FD" opacity="0.9" />
            <text x="0" y="2" textAnchor="middle" fill="#0369A1" fontSize="11.5" fontWeight="bold">
              동래구 온천·명륜동
            </text>
          </g>

          {/* User Location Pulse (if available) */}
          {userLocation && (
            <g
              transform={`translate(${projectCoordinates(userLocation.lat, userLocation.lng).x}, ${
                projectCoordinates(userLocation.lat, userLocation.lng).y
              })`}
            >
              <circle r="18" fill="#3B82F6" opacity="0.25" className="animate-ping" />
              <circle r="8" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
              <text y="-12" textAnchor="middle" fill="#1D4ED8" fontSize="11" fontWeight="bold">
                내 위치
              </text>
            </g>
          )}

          {/* 7. Collection Place Pin Markers with Dynamic Zoom Scaling */}
          {places.map((place) => {
            const { x, y } = projectCoordinates(place.latitude, place.longitude);
            const isSelected = selectedPlace?.id === place.id;
            const isHovered = hoveredPlace?.id === place.id;
            const colors = PLACE_TYPE_COLORS[place.type] || PLACE_TYPE_COLORS.pharmacy;

            return (
              <g
                key={place.id}
                transform={`translate(${x}, ${y}) scale(${pinDynamicScale})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPlace(place);
                }}
                onMouseEnter={() => setHoveredPlace(place)}
                onMouseLeave={() => setHoveredPlace(null)}
                className="cursor-pointer transition-transform"
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: 'bottom center',
                }}
              >
                {/* Active Selection Ring */}
                {isSelected && (
                  <>
                    <circle r="26" fill={colors.pinStroke} opacity="0.25" className="animate-pulse" />
                    <circle r="18" fill="none" stroke={colors.pinStroke} strokeWidth="2.5" strokeDasharray="3 3" />
                  </>
                )}

                {/* Pin Shadow */}
                <ellipse cx="0" cy="2" rx="9" ry="4" fill="#000000" opacity="0.22" />

                {/* Pastel Marker Pin Body */}
                <path
                  d="M 0,-38 C -14,-38 -20,-27 -20,-17 C -20,-4 0,0 0,0 C 0,0 20,-4 20,-17 C 20,-27 14,-38 0,-38 Z"
                  fill={colors.pinBg}
                  stroke={isSelected ? '#0F172A' : colors.pinStroke}
                  strokeWidth={isSelected ? '2.8' : '1.8'}
                  filter="url(#pinShadow)"
                />

                {/* Pin Inner Icon Circle */}
                <circle cx="0" cy="-20" r="9" fill="#FFFFFF" />

                {/* Custom Icon: Pill for Pharmacy, Heart for Welfare Center */}
                {place.type === 'pharmacy' && (
                  // Pill / Medicine Capsule Icon
                  <g transform="translate(-6, -26) scale(0.75)">
                    <rect x="2" y="2" width="12" height="12" rx="6" transform="rotate(-45 8 8)" fill="#059669" />
                    <path d="M 4 4 L 12 12" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                  </g>
                )}

                {place.type === 'center' && (
                  // Heart Icon for Welfare Center
                  <g transform="translate(-6.5, -26.5) scale(0.7)">
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="#E11D48"
                    />
                  </g>
                )}

                {place.type === 'health_center' && (
                  // Medical Cross for Health Center
                  <g transform="translate(-5.5, -25.5) scale(0.75)">
                    <path d="M4 1h4v3h3v4H8v4H4V8H1V4h3z" fill="#0284C7" />
                  </g>
                )}

                {place.type === 'other' && (
                  // Postbox / Mail Icon
                  <g transform="translate(-5.5, -25.5) scale(0.7)">
                    <rect x="1" y="2" width="14" height="11" rx="2" fill="#D97706" />
                    <path d="M1 4 L8 9 L15 4" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
                  </g>
                )}

                {/* Place Name Tag on Canvas */}
                <g transform="translate(0, -47)">
                  <rect
                    x="-55"
                    y="-16"
                    width="110"
                    height="19"
                    rx="4.5"
                    fill={isSelected ? '#0F172A' : '#FFFFFF'}
                    stroke={isSelected ? '#0F172A' : colors.pinStroke}
                    strokeWidth="1.2"
                    opacity={isSelected || isHovered ? '1' : '0.94'}
                  />
                  <text
                    x="0"
                    y="-3"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="700"
                    fill={isSelected ? '#FFFFFF' : '#1E293B'}
                  >
                    {place.name}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Location Bottom Quick Bar */}
      {selectedPlace && (
        <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:max-w-md z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-stone-200 shadow-lg flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2">
          <div
            className="min-w-0 cursor-pointer group"
            onClick={() => onSelectPlace(selectedPlace)}
            title="클릭하여 상세 정보 열기"
          >
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-0.5">
              <span className={`font-bold ${selectedPlace.type === 'pharmacy' ? 'text-emerald-800' : 'text-rose-800'}`}>
                {PLACE_TYPE_LABELS[selectedPlace.type]}
              </span>
              <span>·</span>
              <span>{selectedPlace.lastVerified === '확인 필요' ? '확인 필요' : `확인: ${selectedPlace.lastVerified}`}</span>
            </div>
            <h4 className="text-sm font-bold text-stone-900 group-hover:text-emerald-900 transition-colors truncate">
              {selectedPlace.name}
            </h4>
            <p className="text-xs text-stone-600 truncate mt-0.5">
              {selectedPlace.collectionLocation}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onSelectPlace(selectedPlace)}
              className="px-2.5 py-1.5 text-xs font-medium text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            >
              상세보기
            </button>
            <a
              href={`https://map.kakao.com/link/search/${encodeURIComponent(selectedPlace.address)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-900 bg-emerald-50 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors whitespace-nowrap"
              title="카카오맵 길찾기 검색 새창으로 열기"
            >
              <span>길찾기</span>
              <ExternalLink className="w-3 h-3 text-emerald-700" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
