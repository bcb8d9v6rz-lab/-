import React, { useState } from 'react';
import { QUIZ_QUESTIONS, CHECKLIST_ITEMS } from '../data/quizData';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Award,
  ListChecks,
  Check,
} from 'lucide-react';

export const QuizChecklistView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'quiz' | 'checklist'>('quiz');

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, boolean>>({});
  const [revealedQuestions, setRevealedQuestions] = useState<Record<number, boolean>>({});

  // Checklist State
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleSelectQuiz = (questionId: number, answer: boolean) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
    setRevealedQuestions((prev) => ({ ...prev, [questionId]: true }));
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setRevealedQuestions({});
  };

  const toggleChecklistItem = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetChecklist = () => {
    setCheckedItems({});
  };

  // Quiz score calculation
  const totalQuestions = QUIZ_QUESTIONS.length;
  const answeredCount = Object.keys(revealedQuestions).length;
  const correctCount = QUIZ_QUESTIONS.filter(
    (q) => revealedQuestions[q.id] && selectedAnswers[q.id] === q.answer
  ).length;

  // Checklist completion calculation
  const totalChecks = CHECKLIST_ITEMS.length;
  const completedChecks = CHECKLIST_ITEMS.filter((item) => checkedItems[item.id]).length;
  const completionPercent = Math.round((completedChecks / totalChecks) * 100);

  return (
    <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 space-y-6">
      {/* Sub-navigation Switcher */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1 bg-stone-100 rounded-xl border border-stone-200">
          <button
            onClick={() => setActiveSubTab('quiz')}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'quiz'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-emerald-800" />
            <span>폐의약품 상식 OX 퀴즈</span>
          </button>
          <button
            onClick={() => setActiveSubTab('checklist')}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'checklist'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ListChecks className="w-4 h-4 text-emerald-800" />
            <span>수거함 방문 전 체크리스트</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: OX QUIZ */}
      {activeSubTab === 'quiz' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Quiz Score Banner */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-0.5">
                <span className="font-semibold text-emerald-900">시민·학생 환경 상식 챌린지</span>
                <span>·</span>
                <span>진행: {answeredCount} / {totalQuestions} 문항</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900">
                폐의약품 올바른 배출 OX 퀴즈
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                알쏭달쏭한 약품 폐기 상식을 O/X로 풀고 정확한 이유를 확인해 보세요.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="block text-[11px] text-emerald-800 font-medium">현재 정답 수</span>
                <span className="text-lg font-bold text-emerald-950 tabular-nums">
                  {correctCount} / {totalQuestions}
                </span>
              </div>
              <button
                onClick={resetQuiz}
                className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
                title="퀴즈 다시 풀기"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>다시 풀기</span>
              </button>
            </div>
          </div>

          {/* Quiz Questions List */}
          <div className="space-y-4">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const isAnswered = revealedQuestions[q.id];
              const userAnswer = selectedAnswers[q.id];
              const isCorrect = isAnswered && userAnswer === q.answer;

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                      문제 {idx + 1}
                    </span>
                    {isAnswered && (
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                          isCorrect
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {isCorrect ? '정답입니다! 🎉' : '오답입니다 😅'}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm sm:text-base font-semibold text-stone-900 leading-relaxed">
                    {q.question}
                  </h4>

                  {/* O / X Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleSelectQuiz(q.id, true)}
                      className={`py-3 px-4 rounded-xl border font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        userAnswer === true
                          ? isAnswered
                            ? q.answer === true
                              ? 'bg-emerald-700 text-white border-emerald-800 ring-2 ring-emerald-300'
                              : 'bg-red-600 text-white border-red-700'
                            : 'bg-emerald-700 text-white'
                          : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
                      }`}
                    >
                      <span>O (그렇다)</span>
                    </button>
                    <button
                      onClick={() => handleSelectQuiz(q.id, false)}
                      className={`py-3 px-4 rounded-xl border font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        userAnswer === false
                          ? isAnswered
                            ? q.answer === false
                              ? 'bg-emerald-700 text-white border-emerald-800 ring-2 ring-emerald-300'
                              : 'bg-red-600 text-white border-red-700'
                            : 'bg-emerald-700 text-white'
                          : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
                      }`}
                    >
                      <span>X (아니다)</span>
                    </button>
                  </div>

                  {/* Explanation Section */}
                  {isAnswered && (
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-700 space-y-1.5 animate-in fade-in">
                      <p className="leading-relaxed">{q.explanation}</p>
                      <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-200/80">
                        출처 근거: {q.sourceRef}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Completion Celebration Message */}
          {answeredCount === totalQuestions && (
            <div className="p-6 rounded-2xl bg-emerald-900 text-white text-center space-y-2">
              <Award className="w-8 h-8 text-emerald-300 mx-auto" />
              <h4 className="text-lg font-bold">
                {correctCount === totalQuestions
                  ? '축하합니다! 5문항 만점을 기록하셨습니다! 🏆'
                  : `${totalQuestions}문항 중 ${correctCount}문항을 맞추셨습니다!`}
              </h4>
              <p className="text-xs text-emerald-200 max-w-md mx-auto">
                가족과 친구들에게도 올바른 폐의약품 배출 방법을 함께 알려 깨끗한 하천과 환경을 만들어 가요!
              </p>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: CHECKLIST */}
      {activeSubTab === 'checklist' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Progress Header */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-stone-900">
                  수거함 출발 전 준비 5단계 체크리스트
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  집을 나서기 전 확인하면 헛걸음 없이 깔끔하게 분리배출할 수 있습니다.
                </p>
              </div>
              <button
                onClick={resetChecklist}
                className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
              >
                초기화
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-emerald-900">
                  준비 완료율: {completedChecks} / {totalChecks} 단계
                </span>
                <span className="text-emerald-950 font-mono">{completionPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-800 transition-all duration-300"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-3">
            {CHECKLIST_ITEMS.map((item, idx) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isChecked
                      ? 'bg-emerald-50/60 border-emerald-400'
                      : 'bg-white border-stone-200 hover:border-emerald-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isChecked
                        ? 'bg-emerald-800 text-white'
                        : 'border-2 border-stone-300 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-900">
                        STEP {idx + 1}
                      </span>
                      <h4
                        className={`text-sm font-bold ${
                          isChecked ? 'line-through text-stone-500' : 'text-stone-900'
                        }`}
                      >
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checklist complete message */}
          {completionPercent === 100 && (
            <div className="p-5 rounded-2xl bg-emerald-100/70 border border-emerald-300 text-emerald-950 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-800 shrink-0" />
              <div className="text-xs sm:text-sm">
                <p className="font-bold">모든 배출 준비가 완료되었습니다!</p>
                <p className="text-emerald-900 mt-0.5">
                  [수거 장소 찾기] 메뉴에서 가까운 주민센터나 보건소를 확인하고 방문해 주세요.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
