/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { CollectionPlace, PlaceType } from './types/place';
import {
  getStoredPlaces,
  saveStoredPlaces,
  resetStoredPlaces,
  INITIAL_COLLECTION_PLACES,
} from './data/collectionPlaces';
import { Header } from './components/Header';
import { MapView } from './components/MapView';
import { PlaceList } from './components/PlaceList';
import { PlaceDetailModal } from './components/PlaceDetailModal';
import { DisposalGuideView } from './components/DisposalGuideView';
import { QuizChecklistView } from './components/QuizChecklistView';
import { AddPlaceModal } from './components/AddPlaceModal';
import { DataManagerView } from './components/DataManagerView';
import { Map, List, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function App() {
  const [places, setPlaces] = useState<CollectionPlace[]>(() => getStoredPlaces());
  const [activeTab, setActiveTab] = useState<'map' | 'guide' | 'quiz' | 'manage'>('map');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'all' | PlaceType>('all');
  const [selectedPlace, setSelectedPlace] = useState<CollectionPlace | null>(() => places[0] || null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage on changes
  useEffect(() => {
    saveStoredPlaces(places);
  }, [places]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Filter places based on search query and category type
  const filteredPlaces = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return places.filter((place) => {
      const matchesSearch =
        !q ||
        place.name.toLowerCase().includes(q) ||
        place.address.toLowerCase().includes(q) ||
        place.collectionLocation.toLowerCase().includes(q);

      const matchesType = selectedType === 'all' || place.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [places, searchQuery, selectedType]);

  const handleSelectPlace = (place: CollectionPlace) => {
    setSelectedPlace(place);
    setIsDetailModalOpen(true);
  };

  const handleAddPlace = (newPlace: CollectionPlace) => {
    setPlaces((prev) => [newPlace, ...prev]);
    setSelectedPlace(newPlace);
    showToast(`새 수거 장소 '${newPlace.name}'이(가) 등록되었습니다.`);
  };

  const handleDeletePlace = (id: string) => {
    setPlaces((prev) => prev.filter((p) => p.id !== id));
    if (selectedPlace?.id === id) {
      setSelectedPlace(places.find((p) => p.id !== id) || null);
    }
    showToast('장소 데이터가 삭제되었습니다.');
  };

  const handleResetPlaces = () => {
    resetStoredPlaces();
    setPlaces(INITIAL_COLLECTION_PLACES);
    setSelectedPlace(INITIAL_COLLECTION_PLACES[0]);
    showToast('기본 예시 데이터 4개로 초기화되었습니다.');
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      showToast('이 브라우저에서는 위치 서비스를 지원하지 않습니다.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(coords);
        setIsLocating(false);
        setActiveTab('map');
        showToast('내 위치가 지도에 표시되었습니다.');

        // Find closest place
        let closest: CollectionPlace | null = null;
        let minDist = Infinity;
        places.forEach((p) => {
          const d = Math.hypot(p.latitude - coords.lat, p.longitude - coords.lng);
          if (d < minDist) {
            minDist = d;
            closest = p;
          }
        });
        if (closest) {
          setSelectedPlace(closest);
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error', err);
        // Fallback default Busan Geumjeong-gu Bugok-dong center
        setUserLocation({ lat: 35.2280, lng: 129.0895 });
        showToast('위치 권한을 확인할 수 없어 부산 금정구 부곡동 기준으로 안내합니다.');
        setActiveTab('map');
      },
      { timeout: 7000 }
    );
  };

  return (
    <div className="min-h-screen bg-stone-50/50 flex flex-col font-sans text-stone-900 antialiased selection:bg-emerald-200 selection:text-emerald-950">
      {/* 1. Header (Top Bar Contract 3-zone) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLocateMe={handleLocateMe}
        isLocating={isLocating}
      />

      {/* 2. Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. Main Views Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* VIEW 1: MAP & PLACE DIRECTORY */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            {/* Mobile View Toggle Switcher */}
            <div className="flex md:hidden items-center justify-between bg-white p-2 rounded-xl border border-stone-200">
              <span className="text-xs font-semibold text-stone-700 pl-1">
                화면 모드 선택:
              </span>
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
                <button
                  onClick={() => setMobileView('map')}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    mobileView === 'map'
                      ? 'bg-white text-emerald-950 shadow-xs'
                      : 'text-stone-600'
                  }`}
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>지도</span>
                </button>
                <button
                  onClick={() => setMobileView('list')}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    mobileView === 'list'
                      ? 'bg-white text-emerald-950 shadow-xs'
                      : 'text-stone-600'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>목록 ({filteredPlaces.length})</span>
                </button>
              </div>
            </div>

            {/* Desktop 2-Column Split / Mobile Controlled View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-160px)] min-h-[580px]">
              {/* Left Column: Place List (Hidden on mobile if map is active) */}
              <div
                className={`lg:col-span-5 h-full ${
                  mobileView === 'map' ? 'hidden lg:block' : 'block'
                }`}
              >
                <PlaceList
                  places={places}
                  filteredPlaces={filteredPlaces}
                  selectedPlace={selectedPlace}
                  onSelectPlace={handleSelectPlace}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                />
              </div>

              {/* Right Column: Interactive Map (Hidden on mobile if list is active) */}
              <div
                className={`lg:col-span-7 h-full ${
                  mobileView === 'list' ? 'hidden lg:block' : 'block'
                }`}
              >
                <MapView
                  places={filteredPlaces}
                  selectedPlace={selectedPlace}
                  onSelectPlace={handleSelectPlace}
                  userLocation={userLocation}
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: DISPOSAL GUIDE */}
        {activeTab === 'guide' && <DisposalGuideView />}

        {/* VIEW 3: QUIZ & CHECKLIST */}
        {activeTab === 'quiz' && <QuizChecklistView />}

        {/* VIEW 4: DATASET MANAGER */}
        {activeTab === 'manage' && (
          <DataManagerView
            places={places}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onResetPlaces={handleResetPlaces}
            onDeletePlace={handleDeletePlace}
          />
        )}
      </main>

      {/* 4. Place Detail Modal / Sheet */}
      <PlaceDetailModal
        isOpen={isDetailModalOpen}
        place={selectedPlace}
        onClose={() => setIsDetailModalOpen(false)}
      />

      {/* 5. Add Test Place Modal */}
      <AddPlaceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPlace={handleAddPlace}
      />

      {/* 6. Footer */}
      <footer className="mt-12 bg-white border-t border-stone-200 text-stone-500 py-6 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">우리 동네 폐의약품 지도</span>
            <span>·</span>
            <span>시민과 학생을 위한 친환경 자원순환 공공 웹서비스</span>
          </div>

          <div className="flex items-center gap-4 text-stone-500">
            <button
              onClick={() => setActiveTab('guide')}
              className="hover:text-stone-800 transition-colors cursor-pointer"
            >
              올바른 배출 안내
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('quiz')}
              className="hover:text-stone-800 transition-colors cursor-pointer"
            >
              분리수거 퀴즈
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('manage')}
              className="hover:text-stone-800 transition-colors cursor-pointer"
            >
              데이터 검증 기준
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
