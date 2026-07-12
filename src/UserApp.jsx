import React, { useState, useEffect, useMemo, useRef, Suspense, lazy } from "react";
import { ShieldCheck } from "lucide-react";

import { cn, orchList } from "./user/utils.jsx";
import Toast from "./user/components/Toast.jsx";
import {
  MODES as BASE_MODES, HISTORY as BASE_HISTORY, DOCS as BASE_DOCS,
  SUGGESTIONS as BASE_SUGGESTIONS, AGENT_TEAMS as BASE_AGENT_TEAMS,
  SECURE_SUGGESTIONS as BASE_SECURE_SUGGESTIONS,
} from "./user/data/constants.js";
import { AI_RESPONSES, generateDocHTML } from "./user/data/responses.js";
import { checkInputFilter, applyOutputGuardrails } from "./user/guardrails.js";
import { matchMapIntel, buildMapIntelResponse } from "./user/mapIntel.js";
import rebDomain from "./domains/reb.js";
import { mergeAgentTeams } from "./domains/index.js";

/* 레이아웃 컴포넌트 (2-C 분해: 탭·패널 단위) */
import Sidebar from "./user/components/layout/Sidebar.jsx";
import ChatHeader from "./user/components/layout/ChatHeader.jsx";
import ChatMessages from "./user/components/layout/ChatMessages.jsx";
import ChatInput from "./user/components/layout/ChatInput.jsx";
import RightPanel from "./user/components/layout/RightPanel.jsx";

/* 모달 컴포넌트 */
import AgentBuilderModal from "./user/components/modals/AgentBuilderModal.jsx";
import SatisfactionModal from "./user/components/modals/SatisfactionModal.jsx";
import TutorialModal from "./user/components/modals/TutorialModal.jsx";
import ErrorReportModal from "./user/components/modals/ErrorReportModal.jsx";
import QnaModal from "./user/components/modals/QnaModal.jsx";
import DocPreviewModal from "./user/components/modals/DocPreviewModal.jsx";
import LLMDropdownPortal from "./user/components/modals/LLMDropdownPortal.jsx";

import AgentHub from "./user/components/agents/AgentHub.jsx";
// 에이전트 코드 스플리팅: 각 에이전트는 클릭 시점에 로드되어 초기 번들 크기를 줄임
const ChatbotAgent = lazy(() => import("./user/components/agents/ChatbotAgent.jsx"));
const ReportAgent = lazy(() => import("./user/components/agents/ReportAgent.jsx"));
const MeetingMinutesAgent = lazy(() => import("./user/components/agents/MeetingMinutesAgent.jsx"));
const InternalRegAgent = lazy(() => import("./user/components/agents/InternalRegAgent.jsx"));
const OCRAgent = lazy(() => import("./user/components/agents/OCRAgent.jsx"));
const KnowledgeAgent = lazy(() => import("./user/components/agents/KnowledgeAgent.jsx"));
const DBQueryAgent = lazy(() => import("./user/components/agents/DBQueryAgent.jsx"));
const AddressAgent = lazy(() => import("./user/components/agents/AddressAgent.jsx"));
const DataAnalysisAgent = lazy(() => import("./user/components/agents/DataAnalysisAgent.jsx"));
const SummaryAgent = lazy(() => import("./user/components/agents/SummaryAgent.jsx"));
const TranslateAgent = lazy(() => import("./user/components/agents/TranslateAgent.jsx"));
const DocReviewAgent = lazy(() => import("./user/components/agents/DocReviewAgent.jsx"));
const SafetyPlanAgent = lazy(() => import("./user/components/agents/SafetyPlanAgent.jsx"));
const OrchestrationScenario = lazy(() => import("./user/components/agents/OrchestrationScenario.jsx"));

/* 4단계: 새로고침 대화 유지 — localStorage에서 대화 목록·활성 대화 복원 */
const VALID_MODES = ["GENERAL", "REVIEW", "TRANSLATE", "REPORT"];
const loadInitialConvoState = (domainId) => {
  try {
    const list = JSON.parse(localStorage.getItem(`genos.convos.${domainId}`)) || [];
    const id = localStorage.getItem(`genos.activeConvo.${domainId}`);
    const c = list.find((x) => x.id === id) || null;
    return {
      list,
      id: c ? id : null,
      messages: c?.messages || [],
      mode: c && VALID_MODES.includes(c.mode) ? c.mode : "GENERAL",
    };
  } catch {
    return { list: [], id: null, messages: [], mode: "GENERAL" };
  }
};

// 에이전트 로딩 폴백
const AgentLoadingFallback = () => (
  <div className="flex-1 flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-3 border-[#003087] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-bold text-slate-600">에이전트 로딩 중…</p>
    </div>
  </div>
);


/* ================================================================== */
/* MAIN USER APP COMPONENT — 상태·핸들러·조립만 담당 (2-C 분해 후)      */
/* ================================================================== */
const UserApp = ({ onSwitchToAdmin, domain = rebDomain }) => {
  // ── 도메인 팩 주입: 조직·사용자·워크스페이스·LLM·에이전트 카탈로그는 팩에서 공급 ──
  const USER_INFO = domain.user;
  const WORKSPACES = domain.workspaces;
  const LLM_MODELS = domain.llmModels;
  const AGENT_TEAMS = useMemo(() => mergeAgentTeams(BASE_AGENT_TEAMS, domain), [domain]);
  const HISTORY = domain.history || BASE_HISTORY;
  const DOCS = domain.docs || BASE_DOCS;
  const MODES = useMemo(() => {
    if (!domain.modeDesc) return BASE_MODES;
    const merged = { ...BASE_MODES };
    for (const k of Object.keys(domain.modeDesc)) merged[k] = { ...merged[k], desc: domain.modeDesc[k] };
    return merged;
  }, [domain]);
  const SUGGESTIONS = useMemo(
    () => (domain.suggestions ? { ...BASE_SUGGESTIONS, GENERAL: domain.suggestions } : BASE_SUGGESTIONS),
    [domain]
  );
  const SECURE_SUGG = domain.secureSuggestions || BASE_SECURE_SUGGESTIONS;

  // 새로고침 복원: 컴포넌트 최초 렌더 시 1회만 localStorage에서 읽음
  const initConvoRef = useRef(null);
  if (initConvoRef.current === null) initConvoRef.current = loadInitialConvoState(domain.id);

  const [chatTab, setChatTab] = useState("GENERAL");   // GENERAL | AGENT | SECURE
  const [mode, setMode] = useState(initConvoRef.current.mode);   // GENERAL 탭 서브모드
  // 반응형 초기값: 모바일(<768)은 사이드바 접힘, <1280은 우측 패널 접힘
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window === "undefined" || window.matchMedia("(min-width: 768px)").matches);
  const [rightOpen, setRightOpen] = useState(() => typeof window === "undefined" || window.matchMedia("(min-width: 1280px)").matches);
  const [messages, setMessages] = useState(initConvoRef.current.messages);
  // 대화 이력(4단계): 사용자 대화는 localStorage에 지속, 팩 HISTORY는 시드로 병합 표시
  const [convos, setConvos] = useState(initConvoRef.current.list);
  const [activeConvoId, setActiveConvoId] = useState(initConvoRef.current.id);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [ragMode, setRagMode] = useState(true);
  const [panelView, setPanelView] = useState("DOCS");
  const [activeCitation, setActiveCitation] = useState(null);
  const [toast, setToast] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState("ws1");
  const [activeLLM, setActiveLLM] = useState(LLM_MODELS[0]);
  const [showLLMDropdown, setShowLLMDropdown] = useState(false);
  // 에이전트 탭 전용 state
  const [activeAgentId, setActiveAgentId] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(AGENT_TEAMS[0]);
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [builderTab, setBuilderTab] = useState("WORKFLOW");
  const [selectedNode, setSelectedNode] = useState(null);
  // 번역·요약 컨트롤
  const [translateLang, setTranslateLang] = useState("한→영");
  const [summaryLen, setSummaryLen] = useState(500);
  // 이용만족도 평가
  const [showSatisfaction, setShowSatisfaction] = useState(false);
  const [satRating, setSatRating] = useState(0);
  const [satComment, setSatComment] = useState('');
  // 튜토리얼
  const [showTutorial, setShowTutorial] = useState(false);
  // 오류 신고
  const [showErrReport, setShowErrReport] = useState(false);
  const [errReportMsgId, setErrReportMsgId] = useState(null);
  const [errReportText, setErrReportText] = useState('');

  /* 공지 배너 & Q&A 모달 */
  const [showNoticeBanner, setShowNoticeBanner] = useState(true);
  const [showQnaModal, setShowQnaModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [docModalData, setDocModalData] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const userMenuRef = useRef(null);
  const llmDropdownRef = useRef(null);
  const llmButtonRef = useRef(null);
  const llmPortalRef = useRef(null);
  const [llmDropdownPos, setLlmDropdownPos] = useState(null);

  const isSecure = chatTab === "SECURE";
  const isAgent = chatTab === "AGENT";
  const mc = MODES[mode];

  /* ---------------------------------------------------------------- */
  /* EFFECTS                                                           */
  /* ---------------------------------------------------------------- */
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  /* ── 대화 지속(4단계): GENERAL 탭 대화만 저장 — SECURE는 무저장 서사 유지 ── */
  useEffect(() => {
    try { localStorage.setItem(`genos.convos.${domain.id}`, JSON.stringify(convos.slice(0, 20))); } catch { /* 저장 실패 무시 */ }
  }, [convos, domain.id]);
  useEffect(() => {
    try {
      if (activeConvoId) localStorage.setItem(`genos.activeConvo.${domain.id}`, activeConvoId);
      else localStorage.removeItem(`genos.activeConvo.${domain.id}`);
    } catch { /* 무시 */ }
  }, [activeConvoId, domain.id]);
  useEffect(() => {
    if (chatTab !== "GENERAL" || messages.length === 0) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (!activeConvoId) {
      const firstUser = messages.find((m) => m.role === "user");
      if (!firstUser) return;
      const id = `c${Date.now()}`;
      setActiveConvoId(id);
      setConvos((prev) => [{ id, title: firstUser.content.slice(0, 26), mode, time: now, isToday: true, starred: false, messages }, ...prev]);
    } else {
      setConvos((prev) => prev.map((c) => (c.id === activeConvoId ? { ...c, messages, mode, time: now } : c)));
    }
  }, [messages, chatTab, activeConvoId, mode]);

  /* ── 접근성(4단계): Esc로 최상위 모달·드롭다운 닫기 ── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (showDocModal) setShowDocModal(false);
      else if (showQnaModal) setShowQnaModal(false);
      else if (showErrReport) setShowErrReport(false);
      else if (showTutorial) setShowTutorial(false);
      else if (showSatisfaction) setShowSatisfaction(false);
      else if (showBuilderModal) { setShowBuilderModal(false); setSelectedNode(null); }
      else if (showLLMDropdown) setShowLLMDropdown(false);
      else if (showUserMenu) setShowUserMenu(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showDocModal, showQnaModal, showErrReport, showTutorial, showSatisfaction, showBuilderModal, showLLMDropdown, showUserMenu]);
  useEffect(() => {
    // 보안 탭 진입 시 클라우드·게이트웨이 모델 → 구축형(로컬) 모델 자동 전환
    if (isSecure && activeLLM.type !== "구축형") {
      const localModel = LLM_MODELS.find(m => m.type === "구축형" && m.status === "running") || LLM_MODELS[0];
      setActiveLLM(localModel);
      setToast({ message: `보안 채팅: 로컬 LLM(${localModel.name})으로 자동 전환 — 외부 전송 없음` });
    }
  }, [isSecure]);
  useEffect(() => {
    const h = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
      if (llmDropdownRef.current && !llmDropdownRef.current.contains(e.target) &&
          (!llmPortalRef.current || !llmPortalRef.current.contains(e.target))) setShowLLMDropdown(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* ---------------------------------------------------------------- */
  /* RESPONSE LOGIC                                                    */
  /* ---------------------------------------------------------------- */
  // modeOverride/tabOverride: 이력 복원처럼 상태 반영 전에 호출할 때 사용
  const getAIResponse = (query, modeOverride, tabOverride) => {
    const q = query.toLowerCase();
    const curMode = modeOverride || mode;
    const curTab = tabOverride || chatTab;
    const secure = curTab === "SECURE";
    const agent = curTab === "AGENT";
    const MA = domain.modeAnswers || {};   // 팩 오버라이드: SECURE_AIRGAP/SECURE_DEFAULT/REVIEW/TRANSLATE/REPORT
    if (secure) {
      if (q.includes("망분리") || q.includes("보안") || q.includes("차단")) return MA.SECURE_AIRGAP || AI_RESPONSES.SECURE_AIRGAP;
      return MA.SECURE_DEFAULT || AI_RESPONSES.SECURE_DEFAULT;
    }
    if (agent) {
      if (selectedAgent.id === "agent-1") return AI_RESPONSES.AGENT1;
      if (selectedAgent.id === "agent-2") return AI_RESPONSES.AGENT2;
      return AI_RESPONSES.AGENT3;
    }
    if (curMode === "GENERAL") {
      // 지도 인텔리전스: 지역 질의 감지 시 히트맵+시계열 응답 (팩 mapIntel 공급, 샘플 응답보다 우선)
      const mapHit = matchMapIntel(q, domain.mapIntel);
      if (mapHit) return buildMapIntelResponse(domain.mapIntel, mapHit.region);
      // 도메인 팩이 자체 샘플 응답을 제공하면 우선 매칭
      if (domain.sampleAnswers) {
        const hit = domain.sampleAnswers.find(sa => sa.keywords.some(k => q.includes(k)));
        if (hit) return { ...hit.answer };
      }
      if (domain.id === "reb") {
        if (q.includes("표준지") || q.includes("공시") || q.includes("기준일") || q.includes("조사") || q.includes("주기")) return AI_RESPONSES.GENERAL_PSV;
        if (q.includes("예산") || q.includes("과업") || q.includes("사업비") || q.includes("금액") || q.includes("기간")) return AI_RESPONSES.GENERAL_BUDGET;
      }
    }
    if (curMode === "REVIEW") return MA.REVIEW || AI_RESPONSES.REVIEW_DEFAULT;
    if (curMode === "TRANSLATE") return MA.TRANSLATE || AI_RESPONSES.TRANSLATE_DEFAULT;
    if (curMode === "REPORT") return MA.REPORT || AI_RESPONSES.REPORT_DEFAULT;
    return { content: `**[${MODES[curMode]?.label || curMode} 모드]**\n\n${ragMode ? "사내 지식망(RAG)에서 검색했으나 정확히 일치하는 항목을 찾지 못했습니다." : "직접 응답 모드(LLM Only)로 답변드립니다."}\n\n좀 더 구체적인 질문을 입력해 주세요.`, citations: [], steps: null };
  };

  /* ── 대화 전환·이력(4단계) ── */
  const newConversation = () => {
    setMessages([]); setInput(""); setPanelView("DOCS"); setActiveCitation(null); setActiveConvoId(null);
  };
  const handleModeChange = (m) => {
    if (m === mode) return;
    setMode(m);
    newConversation();
  };
  const loadHistoryItem = (h) => {
    const m = VALID_MODES.includes(h.mode) ? h.mode : "GENERAL";
    setChatTab("GENERAL"); setPanelView("DOCS"); setActiveCitation(null); setMode(m);
    if (h.messages) {
      // 저장된 실제 대화 복원
      setMessages(h.messages);
      setActiveConvoId(h.id);
    } else {
      // 팩 시드 이력 — 제목 질의로 당시 대화를 재구성
      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const resp = applyOutputGuardrails(getAIResponse(h.title, m, "GENERAL"));
      setActiveConvoId(null);
      setMessages([
        { id: Date.now(), role: "user", content: h.title, time: now },
        { id: Date.now() + 1, role: "assistant", time: now, ...resp },
      ]);
    }
    // 모바일: 이력 선택 후 오버레이 사이드바 닫기
    if (window.matchMedia("(max-width: 767px)").matches) setSidebarOpen(false);
  };
  // 사이드바·빈 화면에 표시할 이력: 사용자 대화(최신순) + 팩 시드(제목 중복 시 시드 숨김)
  const displayHistory = useMemo(
    () => [...convos, ...HISTORY.filter((h) => !convos.some((c) => c.title === h.title || h.title.startsWith(c.title)))],
    [convos, HISTORY]
  );

  const handleSend = (text = null) => {
    const msgText = (text || input).trim();
    if (!msgText) return;

    // ── 입력 필터링 검사 (관리자 가드레일) ──
    const { blocked, warning, matchedRule } = checkInputFilter(msgText);
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (blocked) {
      // 차단: 사용자 메시지 + 시스템 차단 안내 메시지 추가 후 종료
      setMessages(prev => [...prev,
        { id: Date.now(), role: "user", content: msgText, time: now, filtered: true },
        { id: Date.now() + 1, role: "blocked", time: now, ruleName: matchedRule.n, ruleCategory: matchedRule.category, keywords: matchedRule.p },
      ]);
      setInput("");
      return;
    }

    // 경고: 사용자 메시지에 경고 플래그 부착
    setMessages(prev => [...prev, {
      id: Date.now(), role: "user", content: msgText, time: now,
      ...(warning ? { warningRule: matchedRule.n, warningKeywords: matchedRule.p } : {}),
    }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const resp = applyOutputGuardrails(getAIResponse(msgText));
      setIsTyping(false);
      setMessages(prev => {
        const newMsgs = [...prev, { id: Date.now() + 1, role: "assistant", time: now, ...resp }];
        const aiCount = newMsgs.filter(m => m.role === "assistant").length;
        if (aiCount === 3) setTimeout(() => setShowSatisfaction(true), 1200);
        return newMsgs;
      });
    }, 1800);
  };

  const handleCitationClick = (cite) => { setRightOpen(true); setPanelView("READER"); setActiveCitation(cite); };

  const handleWorkspaceSwitch = (wsId) => {
    setActiveWorkspace(wsId);
    newConversation();
    const ws = WORKSPACES.find(w => w.id === wsId);
    setToast({ message: `[${ws?.name}] 작업공간으로 전환되었습니다.` });
  };

  const handleTabSwitch = (tab) => {
    setChatTab(tab);
    newConversation();
    if (tab === "AGENT") setActiveAgentId(null);
    if (tab === "SECURE") setToast({ message: "보안 채팅 활성화 — 대화 내용 무저장 · 로컬 LLM 전용 처리" });
    else if (tab === "AGENT") setToast({ message: "에이전트 모드 — AI 에이전트를 선택하세요." });
    else setToast({ message: "일반 채팅 모드로 전환되었습니다." });
  };

  const handleDocDownload = (doc) => {
    const html = generateDocHTML(doc, { name: domain.orgName, short: domain.orgShort, color: domain.brandColor, en: domain.orgEn });
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.type || "보고서"}_${doc.docNo.replace(/[/\\:*?"<>|]/g, "_")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setToast({ message: "다운로드 완료 — 브라우저에서 열어 인쇄(PDF 저장) 가능합니다." });
  };

  /* ---------------------------------------------------------------- */
  /* SECURE / NORMAL THEME TOKENS                                      */
  /* ---------------------------------------------------------------- */
  const th = {
    app: isSecure ? "bg-[#040814]" : "bg-white",
    sidebar: isSecure ? "bg-[#0a0f1c] border-r border-slate-800/60" : "bg-[#F2F5FB] border-r border-slate-200",
    header: isSecure ? "bg-[#0a0f1c]/90 backdrop-blur-md border-b border-slate-800" : "bg-white/90 backdrop-blur-md border-b border-slate-200",
    panel: isSecure ? "bg-[#0a0f1c] border-l border-slate-800/60" : "bg-[#F2F5FB] border-l border-slate-200",
    panelInner: isSecure ? "bg-[#040814]" : "bg-white/60",
    card: isSecure ? "bg-[#0a0f1c]/80 border-slate-800" : "bg-white border-slate-200",
    text: isSecure ? "text-slate-100" : "text-slate-900",
    subtext: isSecure ? "text-slate-400" : "text-slate-500",
    divider: isSecure ? "bg-slate-800" : "bg-slate-200",
    inputBg: isSecure ? "bg-[#0a0f1c] border-slate-700 focus-within:border-blue-500" : `bg-white border-slate-200 ${mc.colors.inputFocus}`,
    chatBg: isSecure ? "bg-[#0a0f1c] border border-slate-700 text-slate-300 rounded-tl-sm shadow-lg" : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-md",
    modeActive: isSecure ? "bg-blue-900/40 text-blue-400 border border-blue-800/50" : mc.colors.active,
    /* sidebar-specific tokens */
    sidebarSection: isSecure ? "border-slate-800/60" : "border-slate-200/70",
    sidebarLabel: isSecure ? "text-slate-500" : "text-slate-400",
    sidebarItem: isSecure ? "text-slate-300 hover:bg-[#1e293b]" : "text-slate-600 hover:bg-white/80",
    sidebarItemActive: isSecure ? "bg-blue-900/40 text-blue-400 border border-blue-800/50" : "bg-white text-slate-900 shadow-sm border border-slate-200/80",
  };

  const activeWs = WORKSPACES.find(w => w.id === activeWorkspace);

  /* ================================================================ */
  /* RENDER — 분해된 레이아웃·모달 컴포넌트 조립                       */
  /* ================================================================ */
  return (
    <div
      className={cn("flex flex-col h-dvh w-full overflow-hidden transition-all duration-500", th.app)}
      style={{ fontFamily: "'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif" }}
    >
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── 보안 채팅 배너 ─────────────────────────────────────── */}
      {isSecure && (
        <div className="w-full h-8 bg-gradient-to-r from-[#050c1a] via-[#091428] to-[#050c1a] text-blue-400/80 flex items-center justify-center text-[11px] font-bold tracking-wide shrink-0 border-b border-blue-950 overflow-hidden px-4 gap-2">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-blue-500" />
          <span className="truncate">보안 채팅 — 대화 내용 무저장 · 로컬 LLM 전용 처리 · 외부망 차단 · AI 학습 미활용</span>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* 모바일: 사이드바 오버레이 배경 */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 bg-black/40 z-20" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
        )}
        {/* ====================== LEFT SIDEBAR ====================== */}
        <Sidebar
          domain={domain} th={th} isSecure={isSecure} isAgent={isAgent} chatTab={chatTab}
          sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
          onTabSwitch={handleTabSwitch} onNewChat={newConversation}
          WORKSPACES={WORKSPACES} activeWorkspace={activeWorkspace} onWorkspaceSwitch={handleWorkspaceSwitch}
          MODES={MODES} mode={mode} setMode={handleModeChange}
          AGENT_TEAMS={AGENT_TEAMS} activeAgentId={activeAgentId} setActiveAgentId={setActiveAgentId}
          HISTORY={displayHistory} onLoadHistory={loadHistoryItem} USER_INFO={USER_INFO}
          showUserMenu={showUserMenu} setShowUserMenu={setShowUserMenu} userMenuRef={userMenuRef}
          setShowNoticeBanner={setShowNoticeBanner} setShowQnaModal={setShowQnaModal}
          onSwitchToAdmin={onSwitchToAdmin}
        />

        {/* ======================== CENTER ========================== */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* 보안 채팅 배경 워터마크 */}
          {isSecure && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-[0.025] z-0 overflow-hidden select-none">
              <div className="text-[120px] font-black text-blue-400 transform -rotate-12 tracking-widest whitespace-nowrap">SECURE</div>
              <div className="text-[120px] font-black text-blue-400 transform -rotate-12 tracking-widest whitespace-nowrap mt-8">NOT SAVED</div>
            </div>
          )}

          {/* Header + Notice Banner */}
          <ChatHeader
            th={th} isSecure={isSecure} isAgent={isAgent} mc={mc} domain={domain}
            sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
            activeAgentId={activeAgentId} AGENT_TEAMS={AGENT_TEAMS}
            setShowQnaModal={setShowQnaModal} setShowTutorial={setShowTutorial}
            showNoticeBanner={showNoticeBanner} setShowNoticeBanner={setShowNoticeBanner}
          />

          {/* ── AGENT 탭: 허브 & 개별 에이전트 (lazy loading) ── */}
          {chatTab === "AGENT" && (
            <Suspense fallback={<AgentLoadingFallback />}>
              {activeAgentId === null               ? <AgentHub onLaunch={setActiveAgentId} agents={AGENT_TEAMS} orgName={domain.orgName} orchestration={domain.orchestration} /> :
               activeAgentId.startsWith("orchestration") && orchList(domain.orchestration).length > 0
                                                      ? <OrchestrationScenario key={activeAgentId} scenario={orchList(domain.orchestration)[Number(activeAgentId.split(":")[1]) || 0] ?? orchList(domain.orchestration)[0]} agents={AGENT_TEAMS} user={USER_INFO} onBack={() => setActiveAgentId(null)} /> :
               activeAgentId === "agent-chatbot"      ? <ChatbotAgent      domain={domain} onBack={() => setActiveAgentId(null)} /> :
               activeAgentId === "agent-report"       ? <ReportAgent       domain={domain} onBack={() => setActiveAgentId(null)} /> :
               activeAgentId === "agent-meeting"      ? <MeetingMinutesAgent domain={domain} onBack={() => setActiveAgentId(null)} /> :
               activeAgentId === "agent-internalreg"  ? <InternalRegAgent  domain={domain} onBack={() => setActiveAgentId(null)} /> :
               activeAgentId === "agent-ocr"          ? <OCRAgent          domain={domain} onBack={() => setActiveAgentId(null)} /> :
               activeAgentId === "agent-knowledge"    ? <KnowledgeAgent    domain={domain} onBack={() => setActiveAgentId(null)} /> :
               activeAgentId === "agent-dbquery"      ? <DBQueryAgent      domain={domain} onBack={() => setActiveAgentId(null)} /> :
               activeAgentId === "agent-address"      ? <AddressAgent      domain={domain} onBack={() => setActiveAgentId(null)} /> :
               activeAgentId === "agent-dataanalysis" ? <DataAnalysisAgent domain={domain} onBack={() => setActiveAgentId(null)} /> :
               activeAgentId === "agent-summary"      ? <SummaryAgent      domain={domain} onBack={() => setActiveAgentId(null)} /> :
               activeAgentId === "agent-translate"    ? <TranslateAgent    domain={domain} onBack={() => setActiveAgentId(null)} /> :
               activeAgentId === "agent-review"       ? <DocReviewAgent    domain={domain} onBack={() => setActiveAgentId(null)} /> :
               activeAgentId === "agent-safety"       ? <SafetyPlanAgent   domain={domain} onBack={() => setActiveAgentId(null)} /> :
               <AgentHub onLaunch={setActiveAgentId} agents={AGENT_TEAMS} orgName={domain.orgName} orchestration={domain.orchestration} />}
            </Suspense>
          )}

          {/* Chat Messages */}
          {chatTab !== "AGENT" && (
            <ChatMessages
              th={th} isSecure={isSecure} isAgent={isAgent} mc={mc} mode={mode}
              messages={messages} isTyping={isTyping} messagesEndRef={messagesEndRef}
              USER_INFO={USER_INFO} selectedAgent={selectedAgent} activeWs={activeWs}
              DOCS={DOCS} HISTORY={displayHistory} onLoadHistory={loadHistoryItem}
              SUGGESTIONS={SUGGESTIONS} SECURE_SUGGESTIONS={SECURE_SUGG}
              translateLang={translateLang} setTranslateLang={setTranslateLang}
              summaryLen={summaryLen} setSummaryLen={setSummaryLen}
              activeLLM={activeLLM}
              handleSend={handleSend} handleCitationClick={handleCitationClick} handleDocDownload={handleDocDownload}
              setShowBuilderModal={setShowBuilderModal} setToast={setToast}
              onErrReport={(msg) => { setErrReportMsgId(msg.id); setErrReportText(''); setShowErrReport(true); }}
              onDocPreview={(doc) => { setDocModalData(doc); setShowDocModal(true); }}
            />
          )}

          {/* Input Area — 통합 단일 박스 (AGENT 탭에서는 숨김) */}
          {chatTab !== "AGENT" && (
            <ChatInput
              th={th} isSecure={isSecure} isAgent={isAgent} mc={mc}
              input={input} setInput={setInput} handleSend={handleSend}
              fileInputRef={fileInputRef} setToast={setToast}
              ragMode={ragMode} setRagMode={setRagMode}
              llmDropdownRef={llmDropdownRef} llmButtonRef={llmButtonRef}
              showLLMDropdown={showLLMDropdown} setShowLLMDropdown={setShowLLMDropdown}
              setLlmDropdownPos={setLlmDropdownPos}
              activeLLM={activeLLM} setShowBuilderModal={setShowBuilderModal}
            />
          )}
        </main>

        {/* ====================== RIGHT PANEL ======================= */}
        <RightPanel
          th={th} isSecure={isSecure} isAgent={isAgent}
          rightOpen={rightOpen} setRightOpen={setRightOpen}
          panelView={panelView} setPanelView={setPanelView} activeCitation={activeCitation}
          domain={domain} setActiveAgentId={setActiveAgentId} activeLLM={activeLLM}
          DOCS={DOCS} SUGGESTIONS={SUGGESTIONS} SECURE_SUGGESTIONS={SECURE_SUGG} mode={mode} handleSend={handleSend}
          fileInputRef={fileInputRef} onSwitchToAdmin={onSwitchToAdmin}
        />
      </div>

      {/* ====================== MODALS ====================== */}
      {showBuilderModal && selectedAgent && (
        <AgentBuilderModal
          selectedAgent={selectedAgent}
          builderTab={builderTab} setBuilderTab={setBuilderTab}
          selectedNode={selectedNode} setSelectedNode={setSelectedNode}
          onClose={() => { setShowBuilderModal(false); setSelectedNode(null); }}
        />
      )}
      {showSatisfaction && (
        <SatisfactionModal
          satRating={satRating} setSatRating={setSatRating}
          satComment={satComment} setSatComment={setSatComment}
          onClose={() => setShowSatisfaction(false)} setToast={setToast}
        />
      )}
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
      {showErrReport && (
        <ErrorReportModal
          errReportText={errReportText} setErrReportText={setErrReportText}
          onClose={() => setShowErrReport(false)} setToast={setToast}
        />
      )}
      {showQnaModal && <QnaModal onClose={() => setShowQnaModal(false)} />}
      {showDocModal && docModalData && (
        <DocPreviewModal
          docModalData={docModalData}
          onClose={() => setShowDocModal(false)}
          onDownload={handleDocDownload}
          org={{ name: domain.orgName, short: domain.orgShort, color: domain.brandColor, en: domain.orgEn }}
        />
      )}

      {/* ── LLM 드롭다운 Portal: overflow-hidden 상위 컨테이너를 우회하여 body에 직접 렌더링 ── */}
      {showLLMDropdown && llmDropdownPos && (
        <LLMDropdownPortal
          llmPortalRef={llmPortalRef} llmDropdownPos={llmDropdownPos} isSecure={isSecure}
          llmModels={LLM_MODELS} activeLLM={activeLLM} setActiveLLM={setActiveLLM}
          setShowLLMDropdown={setShowLLMDropdown} setToast={setToast}
        />
      )}

    </div>
  );
};

export default UserApp;
