/**
 * RootApp.jsx
 * 한국가스기술공사 생성형 AI 플랫폼 — 최상위 진입점
 * 사용자 포털(UserApp) ↔ GenOS 관리자 시스템(App) 전환 관리
 */
import React, { useState } from "react";
import UserApp from "./UserApp";
import GenOSAdmin from "./App";
import { Shield, User, ArrowRight, Lock, CheckCircle2 } from "lucide-react";

function cn(...classes) { return classes.filter(Boolean).join(" "); }

/* ------------------------------------------------------------------ */
/* PORTAL SELECTOR (최초 진입 화면)                                    */
/* ------------------------------------------------------------------ */
const PortalSelector = ({ onSelectUser, onSelectAdmin }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 relative overflow-hidden"
      style={{ fontFamily: "'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif" }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-slate-100/60 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-3xl px-6 flex flex-col items-center">
        {/* Logo & Title */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="w-20 h-20 rounded-3xl bg-[#003087] flex items-center justify-center shadow-2xl mb-6 border-4 border-[#003087]/20">
            {/* REB 스타일 지구본 로고 */}
            <svg viewBox="0 0 28 28" fill="none" className="w-12 h-12">
              {/* 외부 원 */}
              <circle cx="14" cy="14" r="10.5" stroke="white" strokeWidth="1.8" fill="none"/>
              {/* 수직 경선 */}
              <path d="M14 3.5 Q10 14 14 24.5" stroke="white" strokeWidth="1.1" fill="none" opacity="0.65"/>
              <path d="M14 3.5 Q18 14 14 24.5" stroke="white" strokeWidth="1.1" fill="none" opacity="0.65"/>
              {/* 적도 */}
              <path d="M3.5 14 Q14 11 24.5 14" stroke="white" strokeWidth="1.1" fill="none" opacity="0.65"/>
              {/* 상위 위선 */}
              <path d="M6 9 Q14 7 22 9" stroke="white" strokeWidth="0.7" fill="none" opacity="0.4"/>
              {/* 하위 위선 */}
              <path d="M6 19 Q14 21 22 19" stroke="white" strokeWidth="0.7" fill="none" opacity="0.4"/>
            </svg>
          </div>
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-4xl font-black text-[#003087] tracking-[0.15em]">REB</span>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">한국부동산원 AI 플랫폼</h1>
          </div>
          <p className="text-[16px] text-slate-500 font-medium max-w-md leading-relaxed">
            한국부동산원 생성형 AI 플랫폼에 오신 것을 환영합니다.<br />
            접속 유형을 선택해 주세요.
          </p>
          <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-green-50 border border-green-200">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[12px] font-bold text-green-700">시스템 정상 가동 중 · 로컬 LLM · 내부망 전용 · 망분리 적용</span>
          </div>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* User Portal */}
          <button
            onClick={onSelectUser}
            onMouseEnter={() => setHovered("user")}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              "group p-8 rounded-3xl border-2 text-left transition-all duration-300 relative overflow-hidden",
              hovered === "user"
                ? "border-blue-400 shadow-2xl shadow-blue-100 -translate-y-1 bg-white"
                : "border-slate-200 bg-white shadow-md hover:shadow-xl"
            )}
          >
            {/* Accent bar */}
            <div className={cn("absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl transition-all duration-300", hovered === "user" ? "bg-blue-600" : "bg-blue-300")}></div>

            <div className="flex items-center gap-4 mb-5">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 shadow-sm", hovered === "user" ? "bg-blue-600 border-blue-700 text-white" : "bg-blue-50 border-blue-100 text-blue-600")}>
                <User className="w-7 h-7" />
              </div>
              <div>
                <div className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-1">일반 직원</div>
                <h2 className="text-[22px] font-black text-slate-900 tracking-tight leading-tight">사용자 포털</h2>
              </div>
            </div>

            <p className="text-[14px] text-slate-600 font-medium leading-relaxed mb-6">
              업무 질의응답, 문서 검토, 번역·요약, 보고서 작성 등<br />
              일상 업무를 AI로 간편하게 처리하세요.
            </p>

            <div className="space-y-2 mb-6">
              {["일반 질의 (RAG 기반 지식 검색)", "문서 사전 검토 (사규 자동 대조)", "번역·요약 (한/영/중/일 지원)", "보고서 자동 작성 (표준 양식)"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[13px] text-slate-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className={cn("flex items-center justify-between pt-4 border-t transition-colors", hovered === "user" ? "border-blue-100" : "border-slate-100")}>
              <span className={cn("text-[13px] font-black transition-colors", hovered === "user" ? "text-blue-600" : "text-slate-500")}>사용자 포털 입장</span>
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300", hovered === "user" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500")}>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </button>

          {/* Admin Portal */}
          <button
            onClick={onSelectAdmin}
            onMouseEnter={() => setHovered("admin")}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              "group p-8 rounded-3xl border-2 text-left transition-all duration-300 relative overflow-hidden",
              hovered === "admin"
                ? "border-indigo-400 shadow-2xl shadow-indigo-100 -translate-y-1 bg-white"
                : "border-slate-200 bg-white shadow-md hover:shadow-xl"
            )}
          >
            {/* Accent bar */}
            <div className={cn("absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl transition-all duration-300", hovered === "admin" ? "bg-indigo-600" : "bg-indigo-300")}></div>

            <div className="flex items-center gap-4 mb-5">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 shadow-sm", hovered === "admin" ? "bg-indigo-600 border-indigo-700 text-white" : "bg-indigo-50 border-indigo-100 text-indigo-600")}>
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <div className="text-[11px] font-black text-indigo-600 uppercase tracking-widest mb-1">시스템 관리자</div>
                <h2 className="text-[22px] font-black text-slate-900 tracking-tight leading-tight">관리자 시스템</h2>
              </div>
            </div>

            <p className="text-[14px] text-slate-600 font-medium leading-relaxed mb-6">
              GPU·서빙 인프라, LLM 학습·배포, 에이전트 빌더,<br />
              데이터셋·벡터DB 및 사용자 운영을 통합 관리합니다.
            </p>

            <div className="space-y-2 mb-6">
              {["대시보드 (시스템·GPU·서비스 현황)", "모델 학습·배포·서빙 파이프라인 관리", "에이전트 태스크플로우 빌더 & 워크플로우", "사용자 관리 · 승인 · 이용 통계 · 접근 로그"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[13px] text-slate-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className={cn("flex items-center justify-between pt-4 border-t transition-colors", hovered === "admin" ? "border-indigo-100" : "border-slate-100")}>
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span className={cn("text-[13px] font-black transition-colors", hovered === "admin" ? "text-indigo-600" : "text-slate-500")}>관리자 시스템 입장</span>
              </div>
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300", hovered === "admin" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500")}>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </button>
        </div>

        {/* Footer note */}
        <div className="mt-10 text-center">
          <p className="text-[12px] text-slate-400 font-medium">
            한국부동산원 생성형 AI 플랫폼 구축 사업 (SFR-006, SFR-011, SFR-013 반영)<br />
            모든 데이터는 내부망에서만 처리되며 외부로 전송되지 않습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* ROOT APP (View Router)                                              */
/* ------------------------------------------------------------------ */
const RootApp = () => {
  // "SELECTOR" | "USER" | "ADMIN"
  const [view, setView] = useState("SELECTOR");

  if (view === "USER") {
    return <UserApp onSwitchToAdmin={() => setView("ADMIN")} />;
  }

  if (view === "ADMIN") {
    return <GenOSAdmin onSwitchToUser={() => setView("USER")} />;
  }

  return (
    <PortalSelector
      onSelectUser={() => setView("USER")}
      onSelectAdmin={() => setView("ADMIN")}
    />
  );
};

export default RootApp;
