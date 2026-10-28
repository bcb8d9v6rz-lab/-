import React, { useState } from 'react';
import { CollectionPlace } from '../types/place';
import { PLACE_TYPE_LABELS } from '../data/collectionPlaces';
import {
  X,
  MapPin,
  Clock,
  AlertTriangle,
  FileText,
  Calendar,
  Phone,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

interface PlaceDetailModalProps {
  isOpen: boolean;
  place: CollectionPlace | null;
  onClose: () => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({ isOpen, place, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);

  // Close on Escape key press
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !place) return null;

  const handleCopyAddress = async () => {
    try {
      const cleanAddress = place.address.replace(' (시연용 예시)', '');
      await navigator.clipboard.writeText(cleanAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy address', e);
    }
  };

  const cleanAddressForMap = encodeURIComponent(place.address.replace(' (시연용 예시)', ''));

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl border border-stone-200 shadow-xl overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4 duration-200"
      >
        {/* Mobile Drag Handle */}
        <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto my-3 sm:hidden" />

        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-start justify-between gap-4 bg-stone-50/70">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
              <span className={`font-semibold px-2 py-0.5 rounded text-xs inline-flex items-center gap-1 ${
                place.type === 'pharmacy'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : place.type === 'center'
                  ? 'bg-rose-100 text-rose-900 border border-rose-300'
                  : place.type === 'health_center'
                  ? 'bg-sky-100 text-sky-900 border border-sky-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                {place.type === 'pharmacy' && '💊'}
                {place.type === 'center' && '💖'}
                {place.type === 'health_center' && '🏥'}
                {place.type === 'other' && '📮'}
                <span>{PLACE_TYPE_LABELS[place.type]}</span>
              </span>
              <span>·</span>
              <span>수거 장소 상세 정보</span>
            </div>
            <h3 className="text-lg font-bold text-stone-900 tracking-tight leading-tight">
              {place.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="창 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm text-stone-700">
          {/* Example Data Honesty Disclaimer */}
          {place.isExampleData && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">시연용 예시 데이터 안내</p>
                <p className="mt-0.5 text-amber-800 leading-relaxed">
                  본 장소는 기능 테스트 및 시연 목적으로 등록된 가상 예시입니다. 실제 방문 전 관할 기관(주민센터, 보건소, 해당 약국)에 수거함 설치 여부를 확인하시기 바랍니다.
                </p>
              </div>
            </div>
          )}

          {/* 1. Address & Copy / External Map */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-800" />
              주소
            </span>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-2">
              <span className="text-stone-900 font-medium break-all">
                {place.address}
              </span>
              <button
                onClick={handleCopyAddress}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors shrink-0 cursor-pointer"
                title="주소 복사"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>복사됨</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>복사</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 2. Collection Box Specific Location */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-700" />
              수거함 세부 위치
            </span>
            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/60 text-emerald-950 font-medium">
              {place.collectionLocation || '확인 필요'}
            </div>
          </div>

          {/* 3. Operating Hours */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-600" />
              운영 및 이용 시간
            </span>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-800">
              {place.openingHours || '확인 필요'}
            </div>
          </div>

          {/* 4. Notes & Precautions */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              이용 시 주의사항
            </span>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-700 leading-relaxed text-xs sm:text-sm">
              {place.notes || '확인 필요'}
            </div>
          </div>

          {/* 5. Contact Phone */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-stone-600" />
              문의처 (전화번호)
            </span>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-800">
              {place.phone ? (
                place.phone === '확인 필요' ? (
                  <span className="text-stone-400">확인 필요</span>
                ) : (
                  <a
                    href={`tel:${place.phone.replace(/[^0-9]/g, '')}`}
                    className="text-emerald-800 font-medium underline"
                  >
                    {place.phone}
                  </a>
                )
              ) : (
                <span className="text-stone-400">확인 필요</span>
              )}
            </div>
          </div>

          {/* 6. Source & Verification Date */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-200 text-xs">
            <div>
              <span className="font-semibold text-stone-500 flex items-center gap-1 mb-1">
                <FileText className="w-3 h-3 text-stone-400" />
                정보 출처
              </span>
              <p className="text-stone-800">{place.source || '확인 필요'}</p>
            </div>
            <div>
              <span className="font-semibold text-stone-500 flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3 text-stone-400" />
                마지막 확인일
              </span>
              <p className="text-stone-800 font-mono">
                {place.lastVerified || '확인 필요'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="px-5 py-3.5 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <a
              href={`https://map.kakao.com/link/search/${cleanAddressForMap}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <span>카카오맵</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>
            <a
              href={`https://map.naver.com/v5/search/${cleanAddressForMap}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <span>네이버 지도</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
