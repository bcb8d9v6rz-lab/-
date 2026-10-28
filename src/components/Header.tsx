import React from 'react';
import { MapPin, Navigation, BookOpen, CheckSquare, Database } from 'lucide-react';

interface HeaderProps {
  activeTab: 'map' | 'guide' | 'quiz' | 'manage';
  setActiveTab: (tab: 'map' | 'guide' | 'quiz' | 'manage') => void;
  onLocateMe: () => void;
  isLocating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onLocateMe,
  isLocating,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8 h-16">
          {/* Zone 1: Single-element Brand Wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-800 text-white flex items-center justify-center shadow-sm">
              <MapPin className="w-5 h-5 text-emerald-200" />
            </div>
            <button
              onClick={() => setActiveTab('map')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-emerald-950 whitespace-nowrap">
                우리 동네 폐의약품 지도
              </h1>
            </button>
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'map'
                  ? 'text-emerald-900 font-semibold border-b-2 border-emerald-800'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>수거 장소 찾기</span>
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'guide'
                  ? 'text-emerald-900 font-semibold border-b-2 border-emerald-800'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>올바른 배출 방법</span>
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'quiz'
                  ? 'text-emerald-900 font-semibold border-b-2 border-emerald-800'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <CheckSquare className="w-4 h-4 text-emerald-700" />
              <span>배출 퀴즈 & 체크리스트</span>
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'manage'
                  ? 'text-emerald-900 font-semibold border-b-2 border-emerald-800'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Database className="w-4 h-4 text-emerald-700" />
              <span>수거함 데이터 관리</span>
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onLocateMe}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-medium text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 active:scale-95 transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
              title="내 현재 위치 주변 수거함 확인"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? '위치 확인 중...' : '내 주변 수거함'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tab Strip */}
        <div className="flex md:hidden items-center justify-around border-t border-stone-100 py-2 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-2 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'map' ? 'text-emerald-900 font-bold bg-emerald-50' : 'text-stone-600'
            }`}
          >
            수거 장소
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-2 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'guide' ? 'text-emerald-900 font-bold bg-emerald-50' : 'text-stone-600'
            }`}
          >
            배출 방법
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-2 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'quiz' ? 'text-emerald-900 font-bold bg-emerald-50' : 'text-stone-600'
            }`}
          >
            퀴즈 & 체크리스트
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-2 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'manage' ? 'text-emerald-900 font-bold bg-emerald-50' : 'text-stone-600'
            }`}
          >
            데이터 관리
          </button>
        </div>
      </div>
    </header>
  );
};
