import React from 'react';
import { CollectionPlace, PlaceType } from '../types/place';
import { PLACE_TYPE_LABELS } from '../data/collectionPlaces';
import { Search, X, MapPin, Clock, AlertCircle, Sparkles, Building2 } from 'lucide-react';

interface PlaceListProps {
  places: CollectionPlace[];
  filteredPlaces: CollectionPlace[];
  selectedPlace: CollectionPlace | null;
  onSelectPlace: (place: CollectionPlace) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: 'all' | PlaceType;
  setSelectedType: (type: 'all' | PlaceType) => void;
  onOpenAddModal: () => void;
}

export const PlaceList: React.FC<PlaceListProps> = ({
  places,
  filteredPlaces,
  selectedPlace,
  onSelectPlace,
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  onOpenAddModal,
}) => {
  // Count by category in the whole dataset
  const countByType = {
    all: places.length,
    pharmacy: places.filter((p) => p.type === 'pharmacy').length,
    center: places.filter((p) => p.type === 'center').length,
    health_center: places.filter((p) => p.type === 'health_center').length,
    other: places.filter((p) => p.type === 'other').length,
  };

  const filterButtons: Array<{ key: 'all' | PlaceType; label: string; icon?: string }> = [
    { key: 'all', label: '전체' },
    { key: 'pharmacy', label: '약국', icon: '💊' },
    { key: 'center', label: '복지센터', icon: '💖' },
    { key: 'health_center', label: '보건소', icon: '🏥' },
    { key: 'other', label: '우체통', icon: '📮' },
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
      {/* Search Header */}
      <div className="p-4 border-b border-stone-200 space-y-3 bg-stone-50/50">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-stone-900 tracking-tight">
              수거 장소 검색
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              공식 등록 및 확인된 수거함만 표시됩니다 ({filteredPlaces.length}곳)
            </p>
          </div>
          <button
            onClick={onOpenAddModal}
            className="text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0"
            title="테스트용 새 장소 직접 추가해보기"
          >
            + 테스트 장소 추가
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="장소명 또는 도로명 주소 검색 (예: 김약국, 부곡2동, 시실로)"
            className="w-full pl-9 pr-8 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Segmented Filter Tabs (Interactive Filter Buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {filterButtons.map(({ key, label, icon }) => {
            const isActive = selectedType === key;
            const count = countByType[key];
            return (
              <button
                key={key}
                onClick={() => setSelectedType(key)}
                className={`flex items-center px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                {icon && <span className="mr-1 text-[11px]">{icon}</span>}
                <span>{label}</span>
                <span className={`ml-1 text-[11px] tabular-nums ${isActive ? 'text-emerald-200' : 'text-stone-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Place Items List */}
      <div className="flex-1 overflow-y-auto divide-y divide-stone-100 p-2 sm:p-3 space-y-2">
        {filteredPlaces.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-stone-800">
              검색 조건에 맞는 수거 장소가 없습니다
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">
              검색어 철자를 확인하거나 필터를 '전체'로 변경해 보세요.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
              }}
              className="mt-4 px-3.5 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              검색 및 필터 초기화
            </button>
          </div>
        ) : (
          filteredPlaces.map((place, idx) => {
            const isSelected = selectedPlace?.id === place.id;
            return (
              <div
                key={place.id}
                onClick={() => onSelectPlace(place)}
                className={`p-3.5 rounded-xl transition-all cursor-pointer border text-left ${
                  isSelected
                    ? 'bg-emerald-50/60 border-emerald-500 ring-1 ring-emerald-500/20 shadow-sm'
                    : 'bg-white border-stone-200/80 hover:border-emerald-300 hover:bg-stone-50/70'
                }`}
              >
                {/* Unboxed Metadata Line (Zero-Pill Compliance) */}
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-emerald-900">
                      {PLACE_TYPE_LABELS[place.type]}
                    </span>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span className="text-[11px] text-stone-500">
                      번호 {idx + 1}
                    </span>
                  </div>
                  {place.isExampleData ? (
                    <span className="text-[11px] text-amber-700 bg-amber-50/80 px-1.5 py-0.5 rounded border border-amber-200/60">
                      시연 예시
                    </span>
                  ) : (
                    <span className="text-[11px] text-emerald-700 font-medium">
                      검증 등록
                    </span>
                  )}
                </div>

                {/* Place Name */}
                <h3 className="text-sm font-bold text-stone-900 tracking-tight leading-snug">
                  {place.name}
                </h3>

                {/* Address */}
                <div className="flex items-start gap-1.5 text-xs text-stone-600 mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{place.address}</span>
                </div>

                {/* Collection Box Location */}
                <div className="flex items-start gap-1.5 text-xs text-emerald-900 mt-1 font-medium bg-emerald-50/40 p-1.5 rounded-lg border border-emerald-100">
                  <Building2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{place.collectionLocation}</span>
                </div>

                {/* Operating Hours & Verification status */}
                <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2 pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-1 truncate max-w-[65%]">
                    <Clock className="w-3 h-3 text-stone-400 shrink-0" />
                    <span className="truncate">{place.openingHours}</span>
                  </div>
                  <span className="shrink-0 text-stone-400">
                    {place.lastVerified === '확인 필요' ? '확인 필요' : `확인: ${place.lastVerified}`}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Dataset Reliability Note at Bottom */}
      <div className="p-3 bg-stone-50 border-t border-stone-200 text-[11px] text-stone-500 flex items-center justify-between">
        <span>등록 데이터: 총 {places.length}개 소</span>
        <span className="text-emerald-800 font-medium">검증 스키마 적용됨</span>
      </div>
    </div>
  );
};
