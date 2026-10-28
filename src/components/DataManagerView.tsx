import React from 'react';
import { CollectionPlace } from '../types/place';
import { PLACE_TYPE_LABELS } from '../data/collectionPlaces';
import {
  Database,
  Plus,
  RotateCcw,
  Download,
  Trash2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface DataManagerViewProps {
  places: CollectionPlace[];
  onOpenAddModal: () => void;
  onResetPlaces: () => void;
  onDeletePlace: (id: string) => void;
}

export const DataManagerView: React.FC<DataManagerViewProps> = ({
  places,
  onOpenAddModal,
  onResetPlaces,
  onDeletePlace,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(places, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `collection_places_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(places, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy JSON', e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4 px-4 sm:px-6 space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <Database className="w-4 h-4 text-emerald-800" />
            <span className="font-semibold text-emerald-950">공공데이터 & 테스트 데이터셋 관리</span>
            <span>·</span>
            <span className="tabular-nums">총 {places.length}개 소 등록됨</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            수거함 데이터 세트 관리
          </h2>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
            지자체 공공데이터포털(data.go.kr) 폐의약품 수거함 API나 지자체 CSV 파일을 손쉽게 연동할 수 있도록
            표준 11개 스키마로 분리되어 관리됩니다.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>테스트 장소 추가</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            title="JSON 파일로 다운로드"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span>JSON 내보내기</span>
          </button>
          <button
            onClick={handleCopyJSON}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
            <span>{copied ? '복사됨' : '클립보드 복사'}</span>
          </button>
          <button
            onClick={() => {
              if (window.confirm('기본 예시 데이터 4개로 초기화하시겠습니까?')) {
                onResetPlaces();
              }
            }}
            className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
            title="초기 예시 데이터로 리셋"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>기본값 리셋</span>
          </button>
        </div>
      </div>

      {/* Dataset Schema Notice */}
      <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
        <p className="font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-800" />
          데이터 무결성 원칙 준수
        </p>
        <p className="text-emerald-900 leading-relaxed">
          실제 수거 장소를 확인하지 않은 상태에서 주소, 좌표, 운영시간, 전화번호를 무단 날조하지 않습니다.
          미확인 정보는 반드시 <code>'확인 필요'</code>로 저장되며, 시연용 데이터는 <code>isExampleData: true</code>로 투명하게 표시됩니다.
        </p>
      </div>

      {/* Places Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                <th className="py-3 px-4">장소명</th>
                <th className="py-3 px-3">유형</th>
                <th className="py-3 px-4">주소</th>
                <th className="py-3 px-3">수거함 위치</th>
                <th className="py-3 px-3">운영시간</th>
                <th className="py-3 px-3">정보 출처</th>
                <th className="py-3 px-3">마지막 확인일</th>
                <th className="py-3 px-3 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {places.map((place) => (
                <tr key={place.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-stone-900 max-w-[180px]">
                    <div className="truncate">{place.name}</div>
                    {place.isExampleData ? (
                      <span className="text-[10px] text-amber-700 font-normal">
                        시연용 예시
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-700 font-normal">
                        사용자 등록
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-medium text-emerald-900">
                      {PLACE_TYPE_LABELS[place.type]}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-[200px] truncate" title={place.address}>
                    {place.address}
                  </td>
                  <td className="py-3 px-3 max-w-[160px] truncate" title={place.collectionLocation}>
                    {place.collectionLocation}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {place.openingHours}
                  </td>
                  <td className="py-3 px-3 max-w-[120px] truncate" title={place.source}>
                    {place.source}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] whitespace-nowrap">
                    {place.lastVerified === '확인 필요' ? (
                      <span className="text-stone-400">확인 필요</span>
                    ) : (
                      place.lastVerified
                    )}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => onDeletePlace(place.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded hover:bg-stone-100 transition-colors cursor-pointer"
                      title="데이터 항목 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
