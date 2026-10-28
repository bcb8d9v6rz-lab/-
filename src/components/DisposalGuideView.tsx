import React, { useState } from 'react';
import { DOSAGE_GUIDES, PACKAGING_RULES, FAQ_LIST, OFFICIAL_SOURCES } from '../data/disposalGuide';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  ExternalLink,
  ShieldCheck,
  Recycle,
  Sparkles,
} from 'lucide-react';

export const DisposalGuideView: React.FC = () => {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-4 px-4 sm:px-6">
      {/* 1. Header / Intro Banner */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-semibold text-emerald-300 tracking-wider uppercase mb-2 block">
            시민과 학생을 위한 환경 안전 지침
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3 text-balance">
            올바른 폐의약품 분리배출 방법
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            하수구나 종량제 쓰레기봉투에 무심코 버린 약품은 하천을 오염시키고 슈퍼박테리아를 번식시킵니다.
            제형별 포장 분리 원칙을 지켜 지정된 수거함에 안전하게 배출해 주세요.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-800/40 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 2. Dosage Form Guidance Cards Grid */}
      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-stone-900 tracking-tight">
            1. 제형별 맞춤 배출 요령
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            약의 형태에 따라 포장재 분리 및 보관 방법이 다릅니다. 아래 지침을 확인하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DOSAGE_GUIDES.map((guide) => (
            <div
              key={guide.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors"
            >
              <div>
                {/* Card Title & Category */}
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-stone-100">
                  <h4 className="text-base font-bold text-stone-900">
                    {guide.name}
                  </h4>
                  <span className="text-xs text-stone-500">
                    {guide.categoryName}
                  </span>
                </div>

                <p className="text-xs font-medium text-emerald-900 bg-emerald-50/70 p-2 rounded-lg border border-emerald-100 mb-3.5">
                  💡 {guide.summary}
                </p>

                {/* DO List */}
                <div className="space-y-1.5 mb-3">
                  <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1 uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    이렇게 배출하세요
                  </span>
                  <ul className="space-y-1 pl-4 text-xs text-stone-700 list-disc marker:text-emerald-500">
                    {guide.doList.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* DONT List */}
                <div className="space-y-1.5 mb-3">
                  <span className="text-[11px] font-bold text-red-800 flex items-center gap-1 uppercase tracking-wider">
                    <XCircle className="w-3.5 h-3.5 text-red-600" />
                    주의하세요 (금지 사항)
                  </span>
                  <ul className="space-y-1 pl-4 text-xs text-stone-700 list-disc marker:text-red-400">
                    {guide.dontList.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer: Packaging Tip */}
              <div className="pt-2.5 mt-2 border-t border-stone-100 text-[11px] text-stone-500 flex items-start gap-1.5">
                <Recycle className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <span>{guide.packagingTip}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Packaging & Container Disposal */}
      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-stone-900 tracking-tight">
            2. 포장재 및 약병 분리배출 방법
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            폐의약품 수거함의 공간을 낭비하지 않도록 포장재는 각 규격에 맞춰 재활용합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PACKAGING_RULES.map((rule, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-stone-50 border border-stone-200/90 text-left space-y-2"
            >
              <div className="text-xs font-semibold text-emerald-900">
                {rule.type}
              </div>
              <div className="text-sm font-bold text-stone-900 bg-white px-2 py-1 rounded border border-stone-200/70 inline-block">
                {rule.method}
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {rule.tip}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Frequently Asked Questions (FAQ) */}
      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-stone-900 tracking-tight">
            3. 자주 묻는 질문 (FAQ)
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            시민과 학생들이 가장 궁금해하는 폐의약품 처리 상식입니다.
          </p>
        </div>

        <div className="divide-y divide-stone-200 border border-stone-200 rounded-2xl bg-white overflow-hidden shadow-xs">
          {FAQ_LIST.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div key={idx} className="transition-colors">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 hover:bg-stone-50 cursor-pointer"
                >
                  <span className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <span className="text-emerald-800 font-mono text-xs font-semibold">
                      Q{idx + 1}.
                    </span>
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-stone-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed bg-stone-50/50 border-t border-stone-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Official Guidelines & Disclaimer Sources */}
      <section className="p-5 sm:p-6 rounded-2xl bg-stone-100 border border-stone-200 space-y-3">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-stone-900">
              정보 출처 및 지역별 지침 상이 안내
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              본 웹사이트의 안내는 대한민국 환경부, 보건복지부의 생활계 유해폐기물 관리지침을 기초로 작성되었습니다.
              다만 <strong>세부 수거함 비치 장소, 우체통 회수 사업 시행 여부 및 약국 참여 현황은 각 지방자치단체(시·군·구청)의 조례 및 협약 내용에 따라 다를 수 있습니다.</strong>
              확인되지 않은 내용은 임의로 확정하여 게시하지 않으며, 대량 배출 시 관할 동 주민센터 또는 구청 자원순환과에 유선 확인을 권장합니다.
            </p>
          </div>
        </div>

        {/* References Links */}
        <div className="pt-3 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {OFFICIAL_SOURCES.map((src, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-stone-600">
              <span className="font-semibold text-stone-800">{src.name}</span>
              <span aria-hidden="true">·</span>
              <span className="truncate text-stone-500">{src.doc}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
