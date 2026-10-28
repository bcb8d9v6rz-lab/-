import React, { useState } from 'react';
import { CollectionPlace, PlaceType } from '../types/place';
import { PLACE_TYPE_LABELS } from '../data/collectionPlaces';
import { X, Plus, Sparkles, AlertCircle } from 'lucide-react';

interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlace: (newPlace: CollectionPlace) => void;
}

export const AddPlaceModal: React.FC<AddPlaceModalProps> = ({
  isOpen,
  onClose,
  onAddPlace,
}) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('35.2280');
  const [longitude, setLongitude] = useState('129.0900');
  const [type, setType] = useState<PlaceType>('pharmacy');
  const [collectionLocation, setCollectionLocation] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [notes, setNotes] = useState('');
  const [source, setSource] = useState('시민 제보 / 현장 실사');
  const [lastVerified, setLastVerified] = useState('2026-03-27');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  // Fill in quick preset for easy testing
  const handleFillPreset = () => {
    setName('[테스트] 부곡동 희망약국');
    setAddress('부산광역시 금정구 부곡로 88');
    setLatitude('35.2275');
    setLongitude('129.0902');
    setType('pharmacy');
    setCollectionLocation('약국 카운터 옆 전용 수거함');
    setOpeningHours('평일 09:00 - 19:30 (일요일 휴무)');
    setNotes('포장 박스는 분리 배출하고 알약만 모아 배출 요망');
    setSource('금정구 부곡동 현장 제보');
    setLastVerified('2026-03-27');
    setPhone('051-512-0000');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    const latNum = parseFloat(latitude) || 37.55;
    const lngNum = parseFloat(longitude) || 126.98;

    const newPlace: CollectionPlace = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      address: address.trim(),
      latitude: latNum,
      longitude: lngNum,
      type,
      collectionLocation: collectionLocation.trim() || '확인 필요',
      openingHours: openingHours.trim() || '확인 필요',
      notes: notes.trim() || '확인 필요',
      source: source.trim() || '확인 필요',
      lastVerified: lastVerified.trim() || '확인 필요',
      isExampleData: false,
      phone: phone.trim() || '확인 필요',
    };

    onAddPlace(newPlace);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              새 테스트 수거 장소 등록
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              확인되지 않은 필드는 자동으로 '확인 필요'로 저장됩니다
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-200 text-stone-500 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleFillPreset}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>테스트 샘플 자동 입력</span>
            </button>
          </div>

          {/* Place Name */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              장소명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 종로구 혜화동 주민센터"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 outline-none text-sm"
            />
          </div>

          {/* Place Type */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              장소 유형 <span className="text-red-500">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as PlaceType)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 outline-none text-sm bg-white"
            >
              <option value="pharmacy">💊 약국 (파스텔 민트)</option>
              <option value="center">💖 주민센터·복지센터 (파스텔 핑크)</option>
              <option value="health_center">🏥 보건소</option>
              <option value="other">📮 우체통·기타 수거 장소</option>
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              주소 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="예: 서울특별시 종로구 혜화로 12"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 outline-none text-sm"
            />
          </div>

          {/* Lat / Long */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">위도 (Latitude)</label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="37.5512"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">경도 (Longitude)</label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="126.9882"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none text-sm"
              />
            </div>
          </div>

          {/* Collection Location */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">수거함 위치</label>
            <input
              type="text"
              value={collectionLocation}
              onChange={(e) => setCollectionLocation(e.target.value)}
              placeholder="예: 1층 민원실 우측 녹색 전용 수거함 (미입력 시 '확인 필요')"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none text-sm"
            />
          </div>

          {/* Opening Hours */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">운영시간</label>
            <input
              type="text"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              placeholder="예: 평일 09:00 - 18:00 (미입력 시 '확인 필요')"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none text-sm"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">이용 시 주의사항</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="예: 알약만 모아 배출, 가루약 봉지 뜯지 말 것 (미입력 시 '확인 필요')"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none text-sm resize-none"
            />
          </div>

          {/* Source & Verified Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">정보 출처</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="지자체 공지 / 직접 확인"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">마지막 확인일</label>
              <input
                type="text"
                value={lastVerified}
                onChange={(e) => setLastVerified(e.target.value)}
                placeholder="2026-03-27"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none text-sm"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 border border-stone-300 rounded-lg hover:bg-stone-100 font-medium text-stone-700 cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-medium cursor-pointer"
            >
              테스트 장소 등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
