import React from "react";
import { ShieldCheck, Bot, MessageCircle, HelpCircle, Bell, X } from "lucide-react";
import { cn } from "../../utils.jsx";
import { MOCK_NOTICES_USER } from "../../data/constants.js";

/* ================================================================== */
/* 중앙 헤더 + 공지 배너 — 현재 탭/모드 타이틀·상태 배지·퀵 버튼        */
/* ================================================================== */
const ChatHeader = ({
  th, isSecure, isAgent, mc, domain,
  activeAgentId, AGENT_TEAMS,
  setShowQnaModal, setShowTutorial,
  showNoticeBanner, setShowNoticeBanner,
}) => {
  const ModeIcon = mc.icon;
  return (
    <>
      {/* Header */}
      <header className={cn("h-16 shrink-0 flex items-center justify-between px-6 z-20 shadow-sm transition-colors", th.header)}>
        <div className="flex items-center gap-4">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border-2 shadow-sm transition-colors",
            isSecure ? "bg-blue-950/60 text-blue-400 border-blue-900/60" : isAgent ? "bg-indigo-50 text-indigo-600 border-indigo-100" : cn(mc.colors.light, "border-2"))}>
            {isSecure ? <ShieldCheck className="w-5 h-5" /> : isAgent ? <Bot className="w-5 h-5" /> : <ModeIcon className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <h2 className={cn("text-[15px] font-black flex items-center gap-2 leading-tight", th.text)}>
              <span className="truncate">{isSecure ? "보안 채팅" : isAgent ? (activeAgentId ? (AGENT_TEAMS.find(a=>a.id===activeAgentId)?.name ?? "AI 에이전트") : "AI 에이전트 허브") : mc.label}</span>
              <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-black shrink-0",
                isSecure ? "bg-blue-900/60 text-blue-300 border border-blue-800/50" : isAgent ? "bg-indigo-600 text-white" : mc.colors.badge + " text-white")}>
                {isSecure ? "보안 강화" : isAgent ? "에이전트" : "활성"}
              </span>
            </h2>
            <p className={cn("text-[12px] font-medium leading-tight truncate", th.subtext)}>
              {isSecure ? "무저장 · 로컬 LLM · 망분리 — 강화된 보안 환경에서 처리됩니다" : isAgent ? (activeAgentId ? (AGENT_TEAMS.find(a=>a.id===activeAgentId)?.desc ?? "") : `${domain.orgName} 멀티 에이전트 — SFR-006/011/013`) : mc.desc}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold", isSecure ? "bg-[#040814] border-blue-900/50 text-blue-400" : "bg-white border-slate-200 text-slate-600 shadow-sm")}>
            <div className={cn("w-2 h-2 rounded-full animate-pulse", isSecure ? "bg-blue-500" : "bg-green-500")}></div>
            <span>{isSecure ? "보안 모드" : "내부망 전용"}</span>
          </div>
          <button onClick={() => setShowQnaModal(true)} title="자주 묻는 질문" className={cn("h-9 w-9 rounded-xl border-2 flex items-center justify-center transition-colors", isSecure ? "border-slate-700 bg-[#040814] text-slate-400 hover:bg-[#1e293b]" : "border-slate-200 bg-white text-slate-500 hover:bg-slate-100 shadow-sm")}>
            <MessageCircle className="w-5 h-5" />
          </button>
          <button onClick={() => setShowTutorial(true)} title="사용 가이드" className={cn("h-9 w-9 rounded-xl border-2 flex items-center justify-center transition-colors", isSecure ? "border-slate-700 bg-[#040814] text-slate-400 hover:bg-[#1e293b]" : "border-slate-200 bg-white text-slate-500 hover:bg-slate-100 shadow-sm")}>
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Notice Banner */}
      {showNoticeBanner && !isSecure && (
        <div className="shrink-0 h-[44px] bg-gradient-to-r from-blue-50 to-indigo-50/40 border-b border-blue-100 border-l-4 border-l-blue-500 flex items-center gap-2.5 px-5 animate-in slide-in-from-top-1 duration-300">
          <Bell className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span className="text-[11px] font-black text-blue-700 shrink-0 bg-blue-100 px-1.5 py-0.5 rounded">공지</span>
          <span className="text-[12px] text-blue-700 flex-1 truncate font-medium">{MOCK_NOTICES_USER[0].title}</span>
          <span className="text-[10px] text-blue-400 font-mono shrink-0">{MOCK_NOTICES_USER[0].date}</span>
          <button onClick={() => setShowNoticeBanner(false)} className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-blue-400 hover:text-blue-600 hover:bg-blue-100 transition-colors ml-1">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </>
  );
};

export default ChatHeader;
