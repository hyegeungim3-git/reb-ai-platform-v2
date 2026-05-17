import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import { createPortal } from "react-dom";
import {
  Send, Paperclip, Mic, MessageSquare, FileText, Languages, FileCheck,
  Shield, Lock, User, Settings, Plus, X, ArrowRight, CheckCircle2,
  AlertCircle, Loader2, Sparkles, Clock, Star, ChevronLeft, ThumbsUp,
  ThumbsDown, Copy, ShieldCheck, ShieldAlert, Bot, ToggleLeft,
  ToggleRight, Info, FolderOpen, ZoomIn, ZoomOut, SidebarClose, SidebarOpen,
  PanelLeftClose, PanelLeftOpen, History, Workflow, Database, Activity,
  Network, Cpu, ChevronDown, Briefcase, Wrench, AlertTriangle, HelpCircle,
  LogOut, UploadCloud, Boxes, Globe, Server, CheckSquare, Search,
  ExternalLink, PlusCircle, BookOpen, Library, ListChecks,
  Bell, MessageCircle, FileDown, Printer, Eye, EyeOff,
  Volume2, Download, RotateCcw, Play, ClipboardList, UserPlus, Trash2,
  HardHat, CheckCircle, Radio, ChevronRight, GitBranch
} from "lucide-react";

import { cn, SECURITY_LEVELS, SecurityBadge } from "./user/utils.jsx";
import Toast from "./user/components/Toast.jsx";
import {
  USER_INFO, MOCK_NOTICES_USER, MOCK_FAQ, WORKSPACES, LLM_MODELS, MODES,
  SECURE_SUGGESTIONS, HISTORY, DOCS, FILE_DATA, SUGGESTIONS, AGENT_TEAMS,
  MCP_TOOLS, MY_RAG_INIT, MY_RAG_DOCS_INIT,
} from "./user/data/constants.js";
import { AI_RESPONSES, generateDocHTML } from "./user/data/responses.js";
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
/* MAIN USER APP COMPONENT                                             */
/* ================================================================== */
const UserApp = ({ onSwitchToAdmin }) => {
  const [chatTab, setChatTab] = useState("GENERAL");   // GENERAL | AGENT | SECURE
  const [mode, setMode] = useState("GENERAL");          // GENERAL 탭 서브모드
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [messages, setMessages] = useState([]);
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
  const [panelTab, setPanelTab] = useState("DOCS");
  // 에이전트 탭 전용 state
  const [activeAgentId, setActiveAgentId] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(AGENT_TEAMS[0]);
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [builderTab, setBuilderTab] = useState("WORKFLOW");
  const [selectedNode, setSelectedNode] = useState(null);
  // 내 RAG 지식영역 state
  const [myRagAreas, setMyRagAreas] = useState(MY_RAG_INIT.map(a=>({...a})));
  const [selRagArea, setSelRagArea] = useState('mra-1');
  const [myRagDocs, setMyRagDocs] = useState(JSON.parse(JSON.stringify(MY_RAG_DOCS_INIT)));
  const [newAreaName, setNewAreaName] = useState('');
  const [showNewArea, setShowNewArea] = useState(false);
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

  // 시범 서비스
  const [pilotService, setPilotService] = useState(null); // null | 'meeting' | 'safety'

  /* 공지 배너 & Q&A 모달 */
  const [showNoticeBanner, setShowNoticeBanner] = useState(true);
  const [showQnaModal, setShowQnaModal] = useState(false);
  const [qnaOpenIdx, setQnaOpenIdx] = useState(null);
  const [showDocModal, setShowDocModal] = useState(false);
  const [docModalData, setDocModalData] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const readerRef = useRef(null);
  const userMenuRef = useRef(null);
  const llmDropdownRef = useRef(null);
  const llmButtonRef = useRef(null);
  const llmPortalRef = useRef(null);
  const [llmDropdownPos, setLlmDropdownPos] = useState(null);

  const isSecure = chatTab === "SECURE";
  const isAgent = chatTab === "AGENT";
  const mc = MODES[mode];
  const ModeIcon = mc.icon;

  /* ---------------------------------------------------------------- */
  /* EFFECTS                                                           */
  /* ---------------------------------------------------------------- */
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);
  useEffect(() => { setMessages([]); setPanelView("DOCS"); setActiveCitation(null); }, [mode, chatTab]);
  useEffect(() => {
    if (panelView === "READER" && activeCitation && readerRef.current) {
      setTimeout(() => { readerRef.current?.querySelector("mark")?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 300);
    }
  }, [panelView, activeCitation]);
  useEffect(() => {
    // 보안 탭 진입 시 클라우드 모델 자동 전환
    if (isSecure && activeLLM.security === "low") {
      setActiveLLM(LLM_MODELS[0]);
      setToast({ message: "보안 채팅: 로컬 LLM(GPT-OSS 120B)으로 자동 전환 — 외부 전송 없음" });
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
  /* GUARDRAIL ENGINE (관리자 필터링 → localStorage 브리지)           */
  /* ---------------------------------------------------------------- */

  /** localStorage에서 관리자 필터 규칙을 읽어 입력 텍스트를 검사합니다.
   *  returns: { blocked, warning, matchedRule } */
  const checkInputFilter = (text) => {
    try {
      const raw = localStorage.getItem('genos_filter_rules');
      if (!raw) return { blocked: false, warning: false, matchedRule: null };
      const rules = JSON.parse(raw);
      const q = text.toLowerCase();
      const matched = rules.filter(r => {
        if (!r.active) return false;
        return r.p.split(',').map(k => k.trim().toLowerCase()).some(k => k && q.includes(k));
      });
      const blockedRule  = matched.find(r => r.a === '차단');
      const warningRule  = matched.find(r => r.a === '경고');
      return {
        blocked:     !!blockedRule,
        warning:     !blockedRule && !!warningRule,
        matchedRule: blockedRule || warningRule || null,
      };
    } catch { return { blocked: false, warning: false, matchedRule: null }; }
  };

  /** localStorage에서 출력 가드레일 규칙을 읽어 AI 응답에 적용합니다. */
  const applyOutputGuardrails = (resp) => {
    try {
      const raw = localStorage.getItem('genos_output_guardrails');
      if (!raw) return resp;
      const rules = JSON.parse(raw);
      let content = resp.content || '';
      const applied = [];

      // og-003: 불확실 표현 감지 → 신뢰도 감점 배지
      const og003 = rules.find(r => r.id === 'og-003' && r.enabled);
      if (og003) {
        const uncertain = ['아마도','추정','잘 모르겠','확실하지 않','불분명','정확하지 않'];
        const hits = uncertain.filter(p => content.includes(p));
        if (hits.length) applied.push({ id:'og-003', rule:og003.name, action:og003.action, detail:`'${hits[0]}' 등 감지` });
      }

      // og-004: 응답 길이 제한 (2,000자)
      const og004 = rules.find(r => r.id === 'og-004' && r.enabled);
      if (og004 && content.length > 2000) {
        content = content.substring(0, 2000) + '\n\n*\\[자동 요약\\] 응답이 2,000자를 초과하여 잘렸습니다.*';
        applied.push({ id:'og-004', rule:og004.name, action:og004.action, detail:`${resp.content.length}자 → 2,000자로 요약` });
      }

      // og-005: 외부 URL 출력 차단
      const og005 = rules.find(r => r.id === 'og-005' && r.enabled);
      if (og005) {
        const urlRx = /https?:\/\/[^\s)>\]"']+|www\.[^\s)>\]"']+/g;
        if (urlRx.test(content)) {
          content = content.replace(/https?:\/\/[^\s)>\]"']+|www\.[^\s)>\]"']+/g, '`[URL 제거됨]`');
          applied.push({ id:'og-005', rule:og005.name, action:og005.action, detail:'외부 URL 자동 제거' });
        }
      }

      // og-006: PII 자동 마스킹 (전화번호·주민번호)
      const og006 = rules.find(r => r.id === 'og-006' && r.enabled);
      if (og006) {
        const before = content;
        content = content
          .replace(/\b01[016789]-?\d{3,4}-?\d{4}\b/g, '***-****-****')
          .replace(/\b\d{6}-[1-4]\d{6}\b/g, '******-*******');
        if (content !== before) applied.push({ id:'og-006', rule:og006.name, action:og006.action, detail:'전화번호·주민번호 마스킹' });
      }

      // og-007: 반복 루프 감지 (동일 문장 3회↑)
      const og007 = rules.find(r => r.id === 'og-007' && r.enabled);
      if (og007) {
        const sentences = content.split(/(?<=[.!?。])\s+/);
        const cnt = {};
        sentences.forEach(s => { const k=s.trim().toLowerCase(); if(k.length>10) cnt[k]=(cnt[k]||0)+1; });
        if (Object.values(cnt).some(c => c >= 3)) {
          content += '\n\n*\\[가드레일\\] 반복 패턴이 감지되어 응답이 중단되었습니다.*';
          applied.push({ id:'og-007', rule:og007.name, action:og007.action, detail:'동일 문장 3회 이상 반복' });
        }
      }

      return { ...resp, content, guardrailsApplied: applied.length ? applied : undefined };
    } catch { return resp; }
  };

  /* ---------------------------------------------------------------- */
  /* RESPONSE LOGIC                                                    */
  /* ---------------------------------------------------------------- */
  const getAIResponse = (query) => {
    const q = query.toLowerCase();
    if (isSecure) {
      if (q.includes("망분리") || q.includes("보안") || q.includes("차단")) return AI_RESPONSES.SECURE_AIRGAP;
      return AI_RESPONSES.SECURE_DEFAULT;
    }
    if (isAgent) {
      if (selectedAgent.id === "agent-1") return AI_RESPONSES.AGENT1;
      if (selectedAgent.id === "agent-2") return AI_RESPONSES.AGENT2;
      return AI_RESPONSES.AGENT3;
    }
    if (mode === "GENERAL") {
      if (q.includes("psv") || q.includes("안전밸브") || q.includes("점검") || q.includes("주기") || q.includes("정비")) return AI_RESPONSES.GENERAL_PSV;
      if (q.includes("예산") || q.includes("과업") || q.includes("사업비") || q.includes("금액") || q.includes("기간")) return AI_RESPONSES.GENERAL_BUDGET;
    }
    if (mode === "REVIEW") return AI_RESPONSES.REVIEW_DEFAULT;
    if (mode === "TRANSLATE") return AI_RESPONSES.TRANSLATE_DEFAULT;
    if (mode === "REPORT") return AI_RESPONSES.REPORT_DEFAULT;
    return { content: `**[${mc.label} 모드]**\n\n${ragMode ? "사내 지식망(RAG)에서 검색했으나 정확히 일치하는 항목을 찾지 못했습니다." : "직접 응답 모드(LLM Only)로 답변드립니다."}\n\n좀 더 구체적인 질문을 입력해 주세요.`, citations: [], steps: null };
  };

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
    setMessages([]);
    const ws = WORKSPACES.find(w => w.id === wsId);
    setToast({ message: `[${ws?.name}] 작업공간으로 전환되었습니다.` });
  };

  const handleTabSwitch = (tab) => {
    setChatTab(tab);
    setMessages([]);
    setPanelView("DOCS");
    if (tab === "AGENT") setActiveAgentId(null);
    if (tab === "SECURE") setToast({ message: "보안 채팅 활성화 — 대화 내용 무저장 · 로컬 LLM 전용 처리" });
    else if (tab === "AGENT") setToast({ message: "에이전트 모드 — AI 에이전트를 선택하세요." });
    else setToast({ message: "일반 채팅 모드로 전환되었습니다." });
  };

  const handleDocDownload = (doc) => {
    const html = generateDocHTML(doc);
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
  /* DOCUMENT TEXT RENDERER                                            */
  /* ---------------------------------------------------------------- */
  const renderDocText = () => {
    if (!activeCitation) return null;
    const fd = FILE_DATA[activeCitation.id];
    if (!fd) return <p className="text-slate-400 text-center py-10">미리보기를 지원하지 않는 파일입니다.</p>;
    const parts = [];
    let idx = 0;
    const { text, highlights = [] } = fd;
    const matches = highlights.map(h => ({ start: text.indexOf(h), end: text.indexOf(h) + h.length })).filter(m => m.start !== -1).sort((a, b) => a.start - b.start);
    matches.forEach((m, i) => {
      if (m.start > idx) parts.push(<span key={`t${i}`}>{text.slice(idx, m.start)}</span>);
      parts.push(
        <mark key={`m${i}`} className={cn("px-0.5 rounded font-semibold", isSecure ? "bg-blue-900/60 text-blue-300 border-b-2 border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]" : "bg-yellow-200 text-slate-900 shadow-sm")}>
          {text.slice(m.start, m.end)}
        </mark>
      );
      idx = m.end;
    });
    if (idx < text.length) parts.push(<span key="end">{text.slice(idx)}</span>);
    return (
      <div className="whitespace-pre-wrap leading-8">
        <h2 className={cn("text-lg font-black mb-2 pb-3 border-b-2", isSecure ? "text-slate-100 border-slate-700" : "text-slate-900 border-slate-200")}>{fd.title}</h2>
        <p className={cn("text-xs mb-8 flex items-center gap-1.5 font-medium", isSecure ? "text-slate-400" : "text-slate-400")}><Clock className="w-3.5 h-3.5" />{fd.date}</p>
        <div className={cn("font-serif text-[15px]", isSecure ? "text-slate-300" : "text-slate-700")}>{parts}</div>
      </div>
    );
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
  /* RENDER                                                            */
  /* ================================================================ */
  return (
    <div
      className={cn("flex flex-col h-screen w-full overflow-hidden transition-all duration-500", th.app)}
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
        {/* ====================== LEFT SIDEBAR ====================== */}
        <aside className={cn("shrink-0 flex flex-col transition-all duration-300 relative z-30", th.sidebar, sidebarOpen ? "w-[272px]" : "w-[68px]")}>
          {/* toggle */}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={cn("absolute -right-3.5 top-[72px] w-7 h-7 rounded-full flex items-center justify-center shadow-md z-40 text-slate-400 hover:text-slate-700 transition-colors border", isSecure ? "bg-[#0a0f1c] border-slate-700 hover:text-blue-400" : "bg-white border-slate-200")}>
            {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>

          {/* Logo */}
          <div className={cn("h-16 flex items-center px-4 border-b shrink-0", th.sidebarSection)}>
            <div className="w-9 h-9 rounded-xl bg-[#003087] flex items-center justify-center shrink-0 shadow-md overflow-hidden">
              {/* REB 스타일 로고 아이콘 */}
              <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6">
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
            {sidebarOpen && (
              <div className="ml-3 animate-in fade-in duration-200 min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className={cn("text-[13px] font-black tracking-[0.12em]", isSecure ? "text-white" : "text-[#003087]")}>REB</span>
                  <span className={cn("text-[12px] font-bold tracking-tight leading-tight truncate", th.text)}>한국부동산원</span>
                </div>
                <div className={cn("text-[10px] font-bold tracking-widest uppercase", isSecure ? "text-blue-400" : isAgent ? "text-indigo-500" : "text-[#003087]/70")}>
                  {isSecure ? "보안 채팅" : isAgent ? "에이전트 모드" : "AI 플랫폼"}
                </div>
              </div>
            )}
          </div>

          {/* Tab Switcher */}
          <div className={cn("px-3 py-3 border-b shrink-0", th.sidebarSection)}>
            {sidebarOpen ? (
              <div className={cn("p-1 rounded-xl flex gap-1", isSecure ? "bg-[#040814] border border-slate-800" : "bg-slate-200/60 border border-slate-200/80")}>
                {[{id:"GENERAL",label:"일반",Icon:MessageSquare},{id:"AGENT",label:"에이전트",Icon:Bot},{id:"SECURE",label:"보안",Icon:Shield}].map(({id,label,Icon})=>(
                  <button key={id} onClick={()=>handleTabSwitch(id)} className={cn("flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-bold rounded-lg transition-all",
                    chatTab===id?(id==="GENERAL"?"bg-white text-blue-700 shadow-sm":id==="AGENT"?"bg-indigo-600 text-white shadow-sm":"bg-[#0a0f1c] text-blue-400 border border-blue-800/50"):(isSecure?"text-slate-500 hover:text-slate-300":"text-slate-500 hover:text-slate-700 hover:bg-white/50"))}>
                    <Icon className="w-3.5 h-3.5"/>{label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 items-center">
                {[{id:"GENERAL",Icon:MessageSquare},{id:"AGENT",Icon:Bot},{id:"SECURE",Icon:Shield}].map(({id,Icon})=>(
                  <button key={id} onClick={()=>handleTabSwitch(id)} title={id} className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                    chatTab===id?(id==="GENERAL"?"bg-white text-blue-600 shadow-sm border border-slate-200":id==="AGENT"?"bg-indigo-600 text-white shadow-sm":"bg-[#0a0f1c] text-blue-400 border border-blue-800/50"):(isSecure?"text-slate-500 hover:bg-slate-800":"text-slate-400 hover:bg-white/70"))}>
                    <Icon className="w-5 h-5"/>
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* New Chat */}
          <div className={cn("px-3 pt-3 pb-2 shrink-0", !sidebarOpen && "flex justify-center px-0 py-3")}>
            {sidebarOpen ? (
              <button onClick={() => { setMessages([]); setInput(""); }} className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-[#003087] text-white font-bold text-[13px] hover:bg-[#002571] transition-colors shadow-md tracking-tight">
                <Plus className="w-3.5 h-3.5" /> 새 대화 시작
              </button>
            ) : (
              <button onClick={() => { setMessages([]); setInput(""); }} className="w-10 h-10 rounded-xl bg-[#003087] text-white flex items-center justify-center hover:bg-[#002571] transition-colors shadow-md">
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* ── 작업공간 스위처 / 보안 세션 카드 ─── */}
          <div className={cn("px-3 pb-3 border-b shrink-0", th.sidebarSection)}>
            {isSecure ? (
              sidebarOpen ? (
                /* 보안 채팅 전용 — 독립 세션 안내 */
                <div className="space-y-2">
                  <div className={cn("text-[10px] font-black uppercase tracking-wider mb-2 px-1", th.sidebarLabel)}>세션 정보</div>
                  <div className="bg-[#040814] border border-slate-800 rounded-xl px-3 py-3 space-y-2">
                    {[
                      { Icon: EyeOff,     label: "대화 기록",   value: "저장 안 됨" },
                      { Icon: Server,     label: "처리 환경",   value: "로컬 LLM" },
                      { Icon: ShieldCheck,label: "작업공간",    value: "독립 세션" },
                    ].map(({ Icon, label, value }) => (
                      <div key={label} className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Icon className="w-3 h-3 shrink-0" />
                          <span>{label}</span>
                        </div>
                        <span className="font-bold text-blue-400/80">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* 접힌 상태 — 보안 아이콘만 */
                <div className="flex justify-center">
                  <div className="w-10 h-10 rounded-xl bg-[#040814] border border-slate-800 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-blue-500/70" />
                  </div>
                </div>
              )
            ) : (
              /* 일반/에이전트 탭 — 기존 워크스페이스 스위처 */
              <>
                {sidebarOpen && <div className={cn("text-[10px] font-black uppercase tracking-wider mb-2 px-1", th.sidebarLabel)}>지식 영역 · WorkSpace</div>}
                <div className={cn("space-y-0.5", !sidebarOpen && "flex flex-col items-center gap-1")}>
                  {WORKSPACES.map(ws => {
                    const WsIcon = ws.icon;
                    const isActive = activeWorkspace === ws.id;
                    return (
                      <button
                        key={ws.id}
                        onClick={() => handleWorkspaceSwitch(ws.id)}
                        title={!sidebarOpen ? ws.name : undefined}
                        className={cn(
                          "rounded-xl flex items-center gap-2.5 font-semibold text-[13px] transition-all",
                          sidebarOpen ? "w-full px-3 py-2" : "w-10 h-10 justify-center",
                          isActive
                            ? "bg-white text-blue-700 shadow-sm border border-slate-200/80"
                            : "text-slate-500 hover:bg-white/60"
                        )}
                      >
                        <WsIcon className="w-4 h-4 shrink-0" />
                        {sidebarOpen && <span className="truncate">{ws.name}</span>}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Mode Selector — GENERAL 탭만 표시 */}
          {chatTab === "GENERAL" && (
            <div className={cn("px-3 pt-3 pb-3 border-b shrink-0", th.sidebarSection, !sidebarOpen && "flex flex-col items-center gap-1.5 px-0 pb-3")}>
              {sidebarOpen && <div className={cn("text-[10px] font-black uppercase tracking-wider mb-2 px-1", th.sidebarLabel)}>업무 모드</div>}
              <div className={cn("space-y-0.5", !sidebarOpen && "space-y-1.5")}>
                {Object.values(MODES).map(m => {
                  const Icon = m.icon;
                  return (
                    <button key={m.id} onClick={() => setMode(m.id)}
                      title={!sidebarOpen ? m.label : undefined}
                      className={cn("transition-all rounded-xl flex items-center gap-3 font-semibold text-[13px]",
                        sidebarOpen ? "w-full px-3 py-2.5" : "w-10 h-10 justify-center",
                        mode === m.id
                          ? (isSecure ? cn(m.colors.active, "shadow-sm") : "bg-white text-slate-900 shadow-sm border border-slate-200/80")
                          : (isSecure ? "text-slate-400 hover:bg-slate-800/50" : "text-slate-500 hover:bg-white/60"))}>
                      <Icon className={cn("w-4 h-4 shrink-0", mode === m.id && !isSecure ? m.colors.text : "")} />
                      {sidebarOpen && <span>{m.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Conversation History / Agent Info */}
          <div className="flex-1 overflow-y-auto py-3 custom-scrollbar">
            {isSecure ? (
              sidebarOpen ? (
                <div className="flex flex-col items-center text-center px-5 mt-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#040814] border-2 border-blue-900/60 flex items-center justify-center shadow-lg relative">
                    <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-pulse"/>
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-[12px] font-black text-blue-400">보안 채팅 모드</div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">대화 내용 무저장<br />로컬 LLM 전용</p>
                </div>
              ) : <ShieldCheck className="w-5 h-5 text-blue-500 mt-4 mx-auto" />
            ) : isAgent ? (
              sidebarOpen ? (
                <div className="px-3 mt-2 space-y-0.5">
                  <div className={cn("px-1 mb-2 text-[10px] font-black uppercase tracking-wider", th.sidebarLabel)}>AI 에이전트</div>
                  <button onClick={() => setActiveAgentId(null)}
                    className={cn("w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all",
                      activeAgentId === null ? "bg-white text-indigo-700 shadow-sm border border-slate-200/80" : "text-slate-500 hover:bg-white/60")}>
                    <Bot className="w-4 h-4 shrink-0" />
                    <span className="truncate">전체 허브</span>
                    {activeAgentId === null && <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse ml-auto" />}
                  </button>
                  {AGENT_TEAMS.map(ag => {
                    const AgIcon = ag.icon;
                    return (
                      <button key={ag.id} onClick={() => setActiveAgentId(ag.id)} className={cn("w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all",
                        activeAgentId === ag.id ? "bg-white text-indigo-700 shadow-sm border border-slate-200/80" : "text-slate-500 hover:bg-white/60")}>
                        <AgIcon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{ag.shortName}</span>
                        {activeAgentId === ag.id && <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 items-center py-2">
                  <button onClick={() => setActiveAgentId(null)} title="허브"
                    className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                      activeAgentId === null ? "bg-indigo-100 text-indigo-600 border border-indigo-200" : "text-slate-400 hover:bg-white/70")}>
                    <Bot className="w-5 h-5" />
                  </button>
                  {AGENT_TEAMS.map(ag => {
                    const AgIcon = ag.icon;
                    return (
                      <button key={ag.id} onClick={() => setActiveAgentId(ag.id)} title={ag.shortName}
                        className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                          activeAgentId === ag.id ? "bg-indigo-100 text-indigo-600 border border-indigo-200" : "text-slate-400 hover:bg-white/70")}>
                        <AgIcon className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>
              )
            ) : (
              sidebarOpen ? (
                <div className="px-2 space-y-0.5">
                  <div className={cn("px-3 mb-2 flex items-center justify-between", th.sidebarLabel)}>
                    <span className="text-[10px] font-black uppercase tracking-wider">최근 대화</span>
                    <button className="p-1 rounded-lg hover:bg-white/70 transition-colors"><History className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">오늘</div>
                  {HISTORY.filter(h => h.isToday).map(h => {
                    const HIcon = MODES[h.mode]?.icon || MessageSquare;
                    return (
                      <button key={h.id} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-slate-600 hover:bg-white/70 transition-colors text-left group">
                        <HIcon className={cn("w-4 h-4 shrink-0", MODES[h.mode]?.colors?.text)} />
                        <span className="flex-1 truncate font-medium">{h.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{h.time}</span>
                        {h.starred && <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />}
                      </button>
                    );
                  })}
                  <div className="px-3 py-1 mt-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">이전 대화</div>
                  {HISTORY.filter(h => !h.isToday).map(h => {
                    const HIcon = MODES[h.mode]?.icon || MessageSquare;
                    return (
                      <button key={h.id} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-slate-500 hover:bg-white/70 transition-colors text-left group">
                        <HIcon className={cn("w-4 h-4 shrink-0 opacity-60", MODES[h.mode]?.colors?.text)} />
                        <span className="flex-1 truncate font-medium">{h.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{h.time}</span>
                        {h.starred && <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              ) : null
            )}
          </div>

          {/* Sidebar Bottom: 공지/FAQ + User Profile */}
          <div className={cn("border-t shrink-0", isSecure ? "border-slate-800/60 bg-[#0a0f1c]" : "border-slate-200/70 bg-[#F2F5FB]")} ref={userMenuRef}>
            {/* Quick Links */}
            {sidebarOpen && (
              <div className="flex gap-2 px-3 pt-3 pb-1">
                <button
                  onClick={() => setShowNoticeBanner(true)}
                  className={cn("flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors", isSecure ? "text-slate-400 hover:bg-[#1e293b] hover:text-slate-200" : "text-slate-500 bg-white/60 hover:bg-white hover:text-slate-700 border border-slate-200/80")}>
                  <Bell className="w-3 h-3 shrink-0" />
                  <span>공지사항</span>
                </button>
                <button
                  onClick={() => setShowQnaModal(true)}
                  className={cn("flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors", isSecure ? "text-slate-400 hover:bg-[#1e293b] hover:text-slate-200" : "text-slate-500 bg-white/60 hover:bg-white hover:text-slate-700 border border-slate-200/80")}>
                  <HelpCircle className="w-3 h-3 shrink-0" />
                  <span>FAQ</span>
                </button>
              </div>
            )}
            {/* User Profile */}
            <div className="p-3 relative">
              <button onClick={() => setShowUserMenu(!showUserMenu)} className={cn("w-full flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors border", isSecure ? "bg-[#040814] border-slate-800 hover:bg-[#1e293b]" : "bg-white border-slate-200/80 hover:border-slate-300 shadow-sm", !sidebarOpen && "justify-center")}>
                <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2", isSecure ? "bg-[#0a0f1c] border-slate-700 text-slate-400" : "bg-[#003087] border-[#002571] text-white")}>
                  <User className="w-4 h-4" />
                </div>
                {sidebarOpen && (
                  <div className="flex-1 min-w-0 text-left animate-in fade-in">
                    <div className={cn("text-[13px] font-bold truncate flex items-center gap-1.5", th.text)}>
                      {USER_INFO.name} {USER_INFO.title}
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-black tracking-wide shrink-0">SSO</span>
                    </div>
                    <div className={cn("text-[11px] truncate", isSecure ? "text-blue-500/80" : "text-slate-500")}>{isSecure ? "보안 채팅 진행 중" : USER_INFO.dept}</div>
                  </div>
                )}
                {sidebarOpen && <ChevronDown className={cn("w-4 h-4 shrink-0", th.subtext)} />}
              </button>
              {showUserMenu && sidebarOpen && (
                <div className={cn("absolute bottom-full left-0 right-0 mb-2 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 border", isSecure ? "bg-[#0a0f1c] border-slate-700" : "bg-white border-slate-200")}>
                  <div className={cn("px-4 py-3 border-b", isSecure ? "border-slate-800" : "border-slate-100")}>
                    <div className={cn("text-[13px] font-bold", th.text)}>{USER_INFO.name} {USER_INFO.title}</div>
                    <div className={cn("text-[11px] mt-0.5", th.subtext)}>{USER_INFO.dept} · 일반 사용자</div>
                  </div>
                  <div className="py-1">
                    {[{ icon: Settings, label: "환경설정" }, { icon: HelpCircle, label: "도움말 & 사용 가이드" }].map((item, i) => (
                      <button key={i} className={cn("w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-colors", isSecure ? "text-slate-300 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-50")}>
                        <item.icon className="w-4 h-4 text-slate-400" /> {item.label}
                      </button>
                    ))}
                    {onSwitchToAdmin && (
                      <button onClick={() => { setShowUserMenu(false); onSwitchToAdmin(); }} className={cn("w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium border-t transition-colors mt-1", isSecure ? "text-blue-400 hover:bg-slate-800 border-slate-700" : "text-indigo-700 hover:bg-indigo-50 border-slate-100")}>
                        <Shield className="w-4 h-4 text-indigo-500" /> 관리자 시스템 (GenOS)
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* ======================== CENTER ========================== */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* 보안 채팅 배경 워터마크 */}
          {isSecure && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-[0.025] z-0 overflow-hidden select-none">
              <div className="text-[120px] font-black text-blue-400 transform -rotate-12 tracking-widest whitespace-nowrap">SECURE</div>
              <div className="text-[120px] font-black text-blue-400 transform -rotate-12 tracking-widest whitespace-nowrap mt-8">NOT SAVED</div>
            </div>
          )}

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
                  {isSecure ? "무저장 · 로컬 LLM · 망분리 — 강화된 보안 환경에서 처리됩니다" : isAgent ? (activeAgentId ? (AGENT_TEAMS.find(a=>a.id===activeAgentId)?.desc ?? "") : "한국부동산원 멀티 에이전트 — SFR-006/011/013") : mc.desc}
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

          {/* ── AGENT 탭: 허브 & 개별 에이전트 (lazy loading) ── */}
          {chatTab === "AGENT" && (
            <Suspense fallback={<AgentLoadingFallback />}>
              {activeAgentId === null               ? <AgentHub onLaunch={setActiveAgentId} /> :
               activeAgentId === "agent-chatbot"      ? <ChatbotAgent      onBack={() => setActiveAgentId(null)} /> :
               activeAgentId === "agent-report"       ? <ReportAgent       onBack={() => setActiveAgentId(null)} /> :
               activeAgentId === "agent-meeting"      ? <MeetingMinutesAgent onBack={() => setActiveAgentId(null)} /> :
               activeAgentId === "agent-internalreg"  ? <InternalRegAgent  onBack={() => setActiveAgentId(null)} /> :
               activeAgentId === "agent-ocr"          ? <OCRAgent          onBack={() => setActiveAgentId(null)} /> :
               activeAgentId === "agent-knowledge"    ? <KnowledgeAgent    onBack={() => setActiveAgentId(null)} /> :
               activeAgentId === "agent-dbquery"      ? <DBQueryAgent      onBack={() => setActiveAgentId(null)} /> :
               activeAgentId === "agent-address"      ? <AddressAgent      onBack={() => setActiveAgentId(null)} /> :
               activeAgentId === "agent-dataanalysis" ? <DataAnalysisAgent onBack={() => setActiveAgentId(null)} /> :
               activeAgentId === "agent-summary"      ? <SummaryAgent      onBack={() => setActiveAgentId(null)} /> :
               <AgentHub onLaunch={setActiveAgentId} />}
            </Suspense>
          )}

          {/* Chat Messages */}
          {chatTab !== "AGENT" && <div className={cn("flex-1 overflow-y-auto px-4 sm:px-12 pt-12 pb-8 custom-scrollbar relative z-10", isSecure ? "" : "bg-white")}>
            <div className="max-w-3xl mx-auto min-h-full flex flex-col justify-end">

              {/* Empty State */}
              {messages.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-start py-8 animate-in fade-in duration-500">
                  {isSecure ? (
                    /* ── 임시 채팅 빈 상태 (Claude/Gemini/GPT 스타일) ── */
                    <div className="w-full max-w-xl mx-auto space-y-5 py-4">
                      {/* 아이콘 + 제목 */}
                      <div className="flex flex-col items-center text-center gap-3 pb-1">
                        <div className="w-14 h-14 rounded-2xl bg-[#0a1428] border border-blue-900/60 flex items-center justify-center shadow-xl relative">
                          <div className="absolute inset-0 rounded-2xl border border-blue-500/20 animate-pulse"/>
                          <ShieldCheck className="w-7 h-7 text-blue-400"/>
                        </div>
                        <div>
                          <h3 className="text-[22px] font-black text-slate-100 tracking-tight mb-1">보안 채팅</h3>
                          <p className="text-slate-500 text-[13px] font-medium leading-relaxed">
                            강화된 보안 환경에서 대화합니다.
                          </p>
                        </div>
                      </div>
                      {/* 보안 기능 안내 카드 */}
                      <div className="bg-[#0a0f1c] border border-slate-800 rounded-2xl divide-y divide-slate-800/60">
                        {[
                          { Icon: EyeOff,    text: "대화 내용이 서버에 저장되지 않습니다",         badge: "무저장" },
                          { Icon: Server,    text: "모든 처리는 내부망 로컬 LLM에서만 이루어집니다", badge: "로컬 전용" },
                          { Icon: ShieldAlert, text: "외부 인터넷망 접근이 차단된 환경입니다",       badge: "망분리" },
                          { Icon: History,   text: "AI 학습 데이터로 활용되지 않습니다",            badge: "학습 미활용" },
                        ].map(({ Icon, text, badge }, i) => (
                          <div key={i} className="flex items-center gap-3 px-4 py-3 text-[12px] text-slate-400 font-medium">
                            <Icon className="w-3.5 h-3.5 text-blue-600/60 shrink-0"/>
                            <span className="flex-1">{text}</span>
                            <span className="text-[9px] px-1.5 py-0.5 bg-blue-950/60 border border-blue-900/50 rounded text-blue-500/80 font-bold shrink-0 whitespace-nowrap">{badge}</span>
                          </div>
                        ))}
                      </div>
                      {/* 구분선 */}
                      <div className="text-[10px] font-black text-slate-700 uppercase tracking-wider pt-1">시작해 보기</div>
                      {/* 제안 카드 */}
                      <div className="grid grid-cols-2 gap-3">
                        {SECURE_SUGGESTIONS.map((s, i) => {
                          const SIcon = s.icon;
                          return (
                            <button key={i} onClick={() => handleSend(s.query)}
                              className="group p-4 rounded-2xl border border-slate-800 bg-[#0a0f1c]/60 text-left hover:border-blue-900/60 hover:bg-[#0a1428] transition-all duration-200 shadow-sm">
                              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", s.iconBg)}>
                                <SIcon className={cn("w-4 h-4", s.iconColor)} />
                              </div>
                              <div className="text-[13px] font-bold text-slate-300 mb-1 leading-snug">{s.title}</div>
                              <div className="text-[11px] text-slate-500 line-clamp-2 font-medium leading-relaxed">{s.query}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : isAgent ? (
                    /* ── 에이전트 탭 빈 상태 ── */
                    <>
                      <div className="w-16 h-16 rounded-3xl bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center mb-5 shadow-md">
                        <Bot className="w-8 h-8 text-indigo-600" />
                      </div>
                      <h3 className="text-[26px] font-black text-slate-900 mb-2 tracking-tight text-center">
                        안녕하세요, <span className="text-indigo-600">{USER_INFO.name}님!</span>
                      </h3>
                      <p className="text-slate-400 text-center max-w-sm mb-4 font-medium leading-relaxed text-[14px]">{selectedAgent?.desc}</p>
                      <button onClick={() => setShowBuilderModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 text-[13px] font-bold mb-8 hover:bg-indigo-100 transition-all shadow-sm">
                        <Workflow className="w-4 h-4" /> AI 처리 파이프라인 보기
                      </button>
                      <div className="grid grid-cols-2 gap-3 w-full max-w-2xl">
                        {[{ icon: FileCheck, iconBg:"bg-indigo-50", iconColor:"text-indigo-600", title: "문서 사전 검토 (규정 대조)", query: "업로드된 출장 신청 기안문을 취업규칙(2025개정)에 비추어 위반 소지가 없는지 검토해줘" },
                          { icon: Languages, iconBg:"bg-violet-50", iconColor:"text-violet-600", title: "기술 지침 번역·요약",       query: "평택기지 안전 유의사항 부분을 영문으로 번역하고 200자로 요약해줘" },
                          { icon: FileText,  iconBg:"bg-emerald-50",iconColor:"text-emerald-600",title: "주간 실적 보고서 작성",      query: "이번 주 PSV 점검 5건 완료, 배관 누설 탐지 2건 처리 완료를 주간 실적 보고서로 작성해줘" },
                          { icon: Search,   iconBg:"bg-blue-50",   iconColor:"text-blue-600",   title: "사내 규정 검색",             query: "취업규칙 2025년 개정 내용 중 출장 및 출장비 관련 주요 변경 사항을 알려줘" },
                        ].map((s, i) => {
                          const SIcon = s.icon;
                          return (
                            <button key={i} onClick={() => handleSend(s.query)} className="group p-4 rounded-2xl border border-slate-200 text-left bg-white hover:border-indigo-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 shadow-sm">
                              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", s.iconBg)}>
                                <SIcon className={cn("w-4 h-4", s.iconColor)} />
                              </div>
                              <div className="text-[13px] font-bold text-slate-800 mb-1 leading-snug">{s.title}</div>
                              <div className="text-[11px] text-slate-400 line-clamp-2 font-medium leading-relaxed">{s.query}</div>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    /* ── 일반 채팅 빈 상태 ── */
                    <>
                      {/* ── 인사 헤더 ── */}
                      <div className="flex items-center gap-4 mb-5 w-full max-w-2xl">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#003087] to-blue-400 flex items-center justify-center shadow-lg shrink-0">
                          <span className="text-[22px] font-black text-white">K</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[20px] font-black text-slate-900 tracking-tight leading-tight">
                            안녕하세요, <span className={mc.colors.text}>{USER_INFO.name} {USER_INFO.title}</span>님!
                          </h3>
                          <p className="text-slate-400 font-medium text-[12px] mt-0.5">{USER_INFO.dept}</p>
                        </div>
                      </div>
                      {/* ── 워크스페이스 컨텍스트 카드 ── */}
                      <div className="w-full max-w-2xl mb-4">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100 rounded-2xl px-4 py-3">
                          <div className="flex items-center gap-2 mb-2.5">
                            {React.createElement(activeWs?.icon || Briefcase, {className:"w-3.5 h-3.5 text-blue-600"})}
                            <span className="text-[12px] font-black text-blue-900">{activeWs?.name}</span>
                            <div className="ml-auto flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
                              <span className="text-[10px] font-bold text-blue-600">문서 {DOCS.length}개 로드됨</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {DOCS.map(doc => (
                              <div key={doc.id} className="flex items-center gap-1.5 bg-white/90 border border-blue-100 rounded-lg px-2.5 py-1 text-[10px] font-medium text-slate-600 shadow-sm">
                                <FileText className="w-3 h-3 text-blue-400 shrink-0" />
                                <span className="max-w-[160px] truncate">{doc.name}</span>
                                <span className={cn("text-[9px] font-black shrink-0",
                                  doc.secLevel === 'C' ? 'text-amber-600' :
                                  doc.secLevel === 'S' ? 'text-rose-600' : 'text-slate-400'
                                )}>{doc.secLevel}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* TRANSLATE 모드 전용: 언어 선택 + 요약 길이 */}
                      {mode === "TRANSLATE" && (
                        <div className="flex flex-col items-center gap-3 mb-4 w-full max-w-2xl">
                          <div className="flex flex-wrap gap-2 justify-center">
                            {["한→영","영→한","한→중","한→일"].map(lang => (
                              <button key={lang} onClick={() => setTranslateLang(lang)} className={cn("px-4 py-2 rounded-xl border text-sm font-bold transition-all", translateLang === lang ? "border-violet-400 bg-violet-50 text-violet-700 shadow-sm" : "border-slate-200 text-slate-500 hover:border-violet-300 bg-white")}>
                                {lang}
                              </button>
                            ))}
                          </div>
                          <div className="w-full bg-violet-50 rounded-xl p-4 border border-violet-100">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-bold text-violet-700">요약 길이</span>
                              <span className="text-sm font-black text-violet-600">{summaryLen.toLocaleString()}자 이내</span>
                            </div>
                            <input type="range" min={100} max={2000} step={100} value={summaryLen} onChange={e => setSummaryLen(+e.target.value)} className="w-full accent-violet-600"/>
                            <div className="flex justify-between text-[10px] text-violet-400 mt-1"><span>100자</span><span>2,000자</span></div>
                          </div>
                        </div>
                      )}
                      {/* ── 추천 질문 ── */}
                      <div className="w-full max-w-2xl mb-3">
                        <div className="flex items-center gap-2 mb-2.5">
                          <Sparkles className="w-3 h-3 text-slate-400" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">추천 질문</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {SUGGESTIONS[mode]?.map((s, i) => {
                            const SIcon = s.icon;
                            return (
                              <button key={i} onClick={() => handleSend(s.query)} className="group p-4 rounded-2xl border border-slate-200 text-left bg-white hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 shadow-sm">
                                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", s.iconBg)}>
                                  <SIcon className={cn("w-4 h-4", s.iconColor)} />
                                </div>
                                <div className="text-[13px] font-bold text-slate-800 mb-1 leading-snug">{s.title}</div>
                                <div className="text-[11px] text-slate-400 line-clamp-2 font-medium leading-relaxed">{s.query}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      {/* ── 최근 대화 ── */}
                      <div className="w-full max-w-2xl">
                        <div className="flex items-center gap-2 mb-2.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">최근 대화</span>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100">
                          {HISTORY.slice(0, 4).map((h) => {
                            const dotColor = ({
                              GENERAL:   'bg-blue-400',
                              TRANSLATE: 'bg-violet-400',
                              REPORT:    'bg-emerald-400',
                              REVIEW:    'bg-amber-400',
                            })[h.mode] || 'bg-slate-300';
                            return (
                              <button key={h.id} onClick={() => handleSend(h.title)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left">
                                <div className={cn("w-2 h-2 rounded-full shrink-0", dotColor)} />
                                <div className="flex-1 min-w-0">
                                  <div className="text-[12px] font-bold text-slate-800 truncate">{h.title}</div>
                                </div>
                                {h.starred && <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
                                <span className="text-[10px] text-slate-400 shrink-0">{h.isToday ? h.time : h.time}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* 보안 채팅 진행 중 안내 배너 */}
              {isSecure && messages.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 mb-4 bg-[#0a1428] border border-blue-900/50 rounded-xl text-[11px] text-blue-400/70 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-blue-600/60"/>
                  <span>보안 채팅 — 이 대화는 저장되지 않으며 외부로 전송되지 않습니다</span>
                </div>
              )}

              {/* Messages */}
              {messages.map(msg => {
                /* ── 차단 메시지: 가드레일이 완전 차단한 요청 ── */
                if (msg.role === "blocked") return (
                  <div key={msg.id} className="flex justify-center mb-5 animate-in slide-in-from-bottom-2 fade-in duration-300">
                    <div className="w-full max-w-[88%]">
                      <div className={cn("flex items-start gap-3 p-4 rounded-2xl border-2 shadow-sm",
                        isSecure ? "bg-red-950/40 border-red-800/60" : "bg-red-50 border-red-200")}>
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border-2",
                          isSecure ? "bg-red-900/30 border-red-800/60 text-red-400" : "bg-red-100 border-red-200 text-red-600")}>
                          <Shield className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={cn("text-[13px] font-black", isSecure ? "text-red-300" : "text-red-700")}>보안 필터링 — 요청이 차단되었습니다</span>
                            <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-black border", isSecure ? "bg-red-900/40 text-red-400 border-red-800/60" : "bg-red-100 text-red-700 border-red-200")}>차단</span>
                            <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium", isSecure ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500")}>{msg.ruleCategory}</span>
                          </div>
                          <div className={cn("text-[12px] font-medium", isSecure ? "text-red-400" : "text-red-600")}>
                            <span className="font-black">[{msg.ruleName}]</span> 규칙에 의해 이 요청이 차단되었습니다. 질문을 변경하거나 관리자에게 문의하세요.
                          </div>
                          <div className={cn("text-[11px] mt-0.5 font-mono", isSecure ? "text-slate-500" : "text-slate-400")}>감지 키워드: {msg.keywords}</div>
                        </div>
                        <span className={cn("text-[11px] shrink-0", isSecure ? "text-slate-500" : "text-red-400")}>{msg.time}</span>
                      </div>
                    </div>
                  </div>
                );

                return (
                <div key={msg.id} className={cn("flex mb-5", msg.role === "user" ? "justify-end" : "justify-start animate-in slide-in-from-bottom-2 fade-in duration-300")}>
                  <div className={cn("flex max-w-[88%] gap-4", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                    <div className={cn("w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 mt-1 border-2 shadow-sm",
                      msg.role === "user" ? (isSecure ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-500")
                      : isSecure ? "bg-[#0a0f1c] text-blue-400 border-slate-700" : isAgent ? "bg-indigo-600 text-white border-transparent" : cn(mc.colors.active, "border-transparent"))}>
                      {msg.role === "user" ? <User className="w-5 h-5" /> : isSecure ? <ShieldCheck className="w-5 h-5" /> : isAgent ? <Bot className="w-5 h-5" /> : <ModeIcon className="w-5 h-5" />}
                    </div>
                    <div className="flex flex-col gap-2 min-w-0 flex-1 group">
                      {/* 에이전트 처리 단계 (steps — GENERAL 탭 서브모드) */}
                      {msg.role === "assistant" && msg.steps && (
                        <div className={cn("mb-2 p-4 rounded-2xl border-2 shadow-sm", isSecure ? "bg-[#0a0f1c]/80 border-slate-700" : "bg-slate-50/80 border-slate-100")}>
                          <div className={cn("flex items-center gap-2 mb-3 text-[12px] font-black uppercase tracking-wider", isSecure ? "text-blue-400" : mc.colors.text)}>
                            <Workflow className="w-4 h-4" /> 처리 단계 완료
                          </div>
                          <div className="space-y-3 relative pl-3">
                            <div className={cn("absolute left-[19px] top-3 bottom-3 w-0.5", isSecure ? "bg-slate-700" : "bg-slate-200")}></div>
                            {msg.steps.map((step, idx) => (
                              <div key={idx} className="flex items-start gap-3 relative z-10">
                                <div className={cn("w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 shadow-sm", isSecure ? "bg-[#040814] border-slate-700" : "bg-white border-slate-200")}>
                                  <CheckCircle2 className={cn("w-5 h-5", isSecure ? "text-blue-400" : mc.colors.text)} />
                                </div>
                                <div className="mt-1">
                                  <div className={cn("text-[13px] font-bold", isSecure ? "text-slate-200" : "text-slate-700")}>{step.label}</div>
                                  <div className={cn("text-[12px] font-medium", isSecure ? "text-slate-400" : "text-slate-500")}>{step.detail}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* 에이전트 처리 단계 (agentSteps — AGENT 탭) */}
                      {msg.role === "assistant" && msg.agentSteps?.length > 0 && (
                        <div className="mb-2 p-4 rounded-2xl border-2 bg-indigo-50/60 border-indigo-100 shadow-sm">
                          <div className="flex items-center gap-2 mb-3 text-[12px] font-black uppercase tracking-wider text-indigo-600">
                            <Workflow className="w-4 h-4" /> 에이전트 파이프라인 실행 완료
                          </div>
                          <div className="space-y-3 relative pl-3">
                            <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-indigo-200"></div>
                            {msg.agentSteps.map((step, idx) => {
                              const [role, detail] = step.label.split(": ");
                              return (
                                <div key={idx} className="flex items-start gap-3 relative z-10">
                                  <div className="w-8 h-8 rounded-full border-2 border-indigo-200 bg-white flex items-center justify-center shrink-0 shadow-sm">
                                    <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                                  </div>
                                  <div className="mt-1">
                                    <div className="text-[13px] font-bold text-indigo-700">{role}</div>
                                    <div className="text-[12px] font-medium text-slate-500">{detail}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {/* 경고 배너 (입력 필터링 경고 감지 시) */}
                      {msg.role === "user" && msg.warningRule && (
                        <div className={cn("flex items-center gap-2 px-3 py-2 rounded-xl border text-[12px] font-bold self-end",
                          isSecure ? "bg-amber-900/30 border-amber-700/50 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-700")}>
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span><span className="font-black">[{msg.warningRule}]</span> 경고 규칙이 감지되었습니다. 내용을 확인하세요.</span>
                        </div>
                      )}
                      {/* 말풍선 */}
                      <div className={cn("rounded-2xl text-[15px] leading-relaxed whitespace-pre-wrap font-medium shadow-sm",
                        msg.role === "user"
                          ? cn("px-5 py-3.5", isSecure ? "bg-slate-800 text-slate-100 rounded-tr-sm border border-slate-700" : "bg-slate-100 text-slate-900 rounded-tr-sm border border-slate-200")
                          : cn("px-5 py-4", th.chatBg))}>
                        {msg.content}
                      </div>
                      {/* 액션 버튼 */}
                      {msg.role === "assistant" && (
                        <div className="flex items-center gap-1.5 mt-0.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className={cn("p-1.5 rounded-lg transition-colors", isSecure ? "text-slate-500 hover:text-blue-400 hover:bg-slate-800" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100")} onClick={() => { navigator.clipboard.writeText(msg.content); setToast({ message: "클립보드에 복사되었습니다." }); }}><Copy className="w-4 h-4" /></button>
                          <button className={cn("p-1.5 rounded-lg transition-colors", isSecure ? "text-slate-500 hover:text-blue-400 hover:bg-slate-800" : "text-slate-400 hover:text-green-600 hover:bg-green-50")}><ThumbsUp className="w-4 h-4" /></button>
                          <button className={cn("p-1.5 rounded-lg transition-colors", isSecure ? "text-slate-500 hover:text-blue-400 hover:bg-slate-800" : "text-slate-400 hover:text-red-500 hover:bg-red-50")}><ThumbsDown className="w-4 h-4" /></button>
                          <button onClick={() => { setErrReportMsgId(msg.id); setErrReportText(''); setShowErrReport(true); }} title="오류 신고" className={cn("p-1.5 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold", isSecure ? "text-slate-500 hover:text-red-400 hover:bg-slate-800" : "text-slate-400 hover:text-red-500 hover:bg-red-50")}><AlertTriangle className="w-3.5 h-3.5" /><span className="hidden sm:inline">신고</span></button>
                          <span className={cn("text-[11px] ml-1", th.subtext)}>{msg.time}</span>
                        </div>
                      )}
                      {/* ── 출처 인용 카드 ── */}
                      {msg.role === "assistant" && msg.citations?.length > 0 && (
                        <div className="mt-2 space-y-2">
                          <div className={cn("flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider",
                            isSecure ? "text-slate-500" : "text-slate-400")}>
                            <BookOpen className="w-3 h-3"/>참조 출처 ({msg.citations.length}건)
                          </div>
                          {msg.citations.map((cite, idx) => (
                            <button key={idx} onClick={() => handleCitationClick(cite)}
                              className={cn("w-full flex items-start gap-3 p-3 rounded-xl border-2 transition-all text-left group/cite shadow-sm hover:shadow-md",
                                isSecure ? "bg-[#0a0f1c] border-slate-700 hover:border-blue-500" : "bg-white border-slate-200 hover:border-blue-300")}>
                              <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black border shrink-0 mt-0.5",
                                isSecure ? "bg-slate-800 border-slate-600 text-blue-400" : cn(mc.colors.light, "border"))}>
                                {idx + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                  <span className={cn("text-[12px] font-black truncate", isSecure ? "text-slate-200" : "text-slate-800")}>{cite.name}</span>
                                  {cite.page && <span className={cn("text-[10px] font-mono shrink-0", isSecure ? "text-slate-500" : "text-slate-400")}>{cite.page}p</span>}
                                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0", isSecure ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500")}>{cite.tag}</span>
                                  {cite.secLevel && <SecurityBadge level={cite.secLevel} size="xs"/>}
                                </div>
                                {cite.excerpt && (
                                  <div className={cn("text-[11px] leading-relaxed line-clamp-2 mb-1.5 italic",
                                    isSecure ? "text-slate-500" : "text-slate-500")}>
                                    &ldquo;{cite.excerpt}&rdquo;
                                  </div>
                                )}
                                <div className="flex items-center gap-2 mt-1">
                                  <div className={cn("flex-1 h-1 rounded-full", isSecure ? "bg-slate-700" : "bg-slate-200")}>
                                    <div style={{width:`${cite.similarity}%`}}
                                      className={cn("h-full rounded-full",
                                        cite.similarity >= 95 ? "bg-emerald-500" : cite.similarity >= 80 ? "bg-blue-400" : "bg-amber-400")}/>
                                  </div>
                                  <span className={cn("text-[10px] font-black font-mono shrink-0",
                                    cite.similarity >= 95 ? (isSecure ? "text-emerald-400" : "text-emerald-600") : (isSecure ? "text-slate-400" : "text-slate-500"))}>
                                    {cite.similarity}%
                                  </span>
                                </div>
                              </div>
                              <ExternalLink className={cn("w-3.5 h-3.5 shrink-0 mt-1 opacity-0 group-hover/cite:opacity-100 transition-opacity", isSecure ? "text-blue-400" : "text-blue-400")}/>
                            </button>
                          ))}
                        </div>
                      )}
                      {/* ── 출력 가드레일 적용 배지 ── */}
                      {msg.role === "assistant" && msg.guardrailsApplied?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {msg.guardrailsApplied.map((g, i) => (
                            <div key={i} className={cn("flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-bold",
                              isSecure ? "bg-orange-900/20 border-orange-800/40 text-orange-400" : "bg-orange-50 border-orange-200 text-orange-700")}>
                              <Shield className="w-3 h-3 shrink-0" />
                              <span>{g.rule}</span>
                              <span className={cn("font-medium", isSecure ? "text-orange-500" : "text-orange-500")}>· {g.action}</span>
                              {g.detail && <span className={cn("font-normal", isSecure ? "text-slate-500" : "text-slate-400")}>({g.detail})</span>}
                            </div>
                          ))}
                        </div>
                      )}
                      {/* ── 문서 생성 카드 ── */}
                      {msg.role === "assistant" && msg.document && (
                        <div className="mt-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
                          <div className={cn("p-4 rounded-2xl border-2 shadow-sm",
                            isAgent ? "border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-white" : "border-emerald-100 bg-gradient-to-br from-emerald-50/70 to-white")}>
                            {/* 카드 헤더 */}
                            <div className="flex items-start gap-3 mb-3">
                              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border-2 shrink-0",
                                isAgent ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-emerald-50 border-emerald-200 text-emerald-600")}>
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-black text-slate-800 leading-snug">{msg.document.title}</div>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{msg.document.docNo}</span>
                                  <span className="text-[10px] text-slate-400">{msg.document.issueDate}</span>
                                  {msg.document.secLevel && <SecurityBadge level={msg.document.secLevel} size="xs" />}
                                </div>
                                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                  {[`수신: ${msg.document.to}`, `발신: ${msg.document.from.split(" ").slice(-2).join(" ")}`].map((t, i) => (
                                    <span key={i} className={cn("text-[10px] px-1.5 py-0.5 rounded font-semibold",
                                      isAgent ? "bg-indigo-100/70 text-indigo-700" : "bg-emerald-100/70 text-emerald-700")}>{t}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {/* 첨부 목록 */}
                            <div className={cn("text-[11px] font-medium px-3 py-2 rounded-xl mb-3 flex items-center gap-1.5 min-w-0",
                              isAgent ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600")}>
                              <Paperclip className="w-3 h-3 shrink-0" />
                              <span className="truncate">{msg.document.attachments.join(" · ")}</span>
                            </div>
                            {/* 버튼 */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => { setDocModalData(msg.document); setShowDocModal(true); }}
                                className={cn("flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-[12px] font-bold transition-all hover:shadow-sm",
                                  isAgent ? "border-indigo-200 text-indigo-700 hover:bg-indigo-50" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50")}>
                                <Eye className="w-3.5 h-3.5" /> 문서 미리보기
                              </button>
                              <button
                                onClick={() => handleDocDownload(msg.document)}
                                className={cn("flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold text-white shadow-sm transition-all active:scale-95",
                                  isAgent ? "bg-indigo-600 hover:bg-indigo-700" : "bg-emerald-600 hover:bg-emerald-700")}>
                                <FileDown className="w-3.5 h-3.5" /> 다운로드
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-3 ml-14 mb-6 animate-in fade-in duration-200">
                  <Loader2 className={cn("w-5 h-5 animate-spin", isSecure ? "text-blue-500" : mc.colors.text)} />
                  <span className={cn("text-[13px] font-medium", th.subtext)}>
                    {isSecure ? "보안 환경에서 분석 중..." : mode === "GENERAL" ? `지식망 검색 및 ${activeLLM.shortName} 추론 중...` : `${mc.label} 에이전트 처리 중...`}
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>}

          {/* Input Area — 통합 단일 박스 (PILOT 탭에서는 숨김) */}
          {chatTab !== "AGENT" && <div className={cn("shrink-0 px-4 sm:px-12 pb-7 pt-5 border-t transition-colors", isSecure ? "bg-[#0a0f1c]/85 backdrop-blur-sm border-slate-800" : "bg-white/85 backdrop-blur-sm border-slate-200")}>
            <div className="max-w-3xl mx-auto">
              {/* Unified Input Box */}
              <div className={cn("rounded-2xl border-2 shadow-lg transition-all", th.inputBg, !isSecure && "ring-1 ring-gray-100")}>
                {/* Textarea */}
                <div className="px-4 pt-4 pb-1">
                  <textarea
                    value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder={isSecure ? "보안 문서의 개인정보 마스킹, 보안 규정 준수 여부 등을 지시하세요." : mc.placeholder}
                    className={cn("w-full bg-transparent border-none resize-none outline-none text-[15px] placeholder:text-slate-400 min-h-[56px] max-h-[160px] py-1 font-medium leading-relaxed", isSecure ? "text-slate-200" : "text-slate-900")}
                    rows={1}
                  />
                </div>
                {/* Bottom Row: 첨부·마이크 | 구분 | RAG·LLM·파이프라인 | 전송 */}
                <div className="flex items-center gap-1.5 px-3 pb-3 pt-0.5">
                  <input type="file" className="hidden" ref={fileInputRef} onChange={e => { const f = e.target.files?.[0]; if (f) setToast({ message: `'${f.name}' 업로드 중. DRM 해제 및 OCR 처리가 시작됩니다.` }); }} />
                  <button onClick={() => fileInputRef.current?.click()} title="파일 첨부" className={cn("h-8 w-8 rounded-lg flex items-center justify-center transition-colors", isSecure ? "text-slate-500 hover:text-blue-400 hover:bg-slate-800" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100")}>
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button title="음성 입력" className={cn("h-8 w-8 rounded-lg flex items-center justify-center transition-colors", isSecure ? "text-slate-500 hover:text-blue-400 hover:bg-slate-800" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100")}>
                    <Mic className="w-4 h-4" />
                  </button>

                  <div className="flex-1" />

                  {/* RAG 토글 pill */}
                  <button
                    onClick={() => { setRagMode(!ragMode); setToast({ message: `${!ragMode ? "지식 참조(RAG)" : "직접 응답(LLM Only)"} 모드로 전환되었습니다.` }); }}
                    className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-bold border transition-colors",
                      ragMode
                        ? (isSecure ? "bg-blue-900/40 text-blue-400 border-blue-800" : "bg-blue-50 text-blue-600 border-blue-200")
                        : (isSecure ? "text-slate-500 border-slate-700 hover:border-slate-600" : "text-slate-400 border-slate-200 hover:border-slate-300"))}>
                    <Database className="w-3 h-3" />
                    <span>{ragMode ? "지식참조" : "직접응답"}</span>
                  </button>

                  {/* LLM 선택기 (입력바로 이동) */}
                  {/* LLM 선택기 — 드롭다운은 createPortal로 body에 직접 렌더링 (overflow-hidden 우회) */}
                  <div ref={llmDropdownRef}>
                    <button
                      ref={llmButtonRef}
                      onClick={() => {
                        if (!showLLMDropdown && llmButtonRef.current) {
                          const r = llmButtonRef.current.getBoundingClientRect();
                          setLlmDropdownPos({ bottom: window.innerHeight - r.top + 8, right: window.innerWidth - r.right });
                        }
                        setShowLLMDropdown(!showLLMDropdown);
                      }}
                      className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-bold border transition-colors",
                        isSecure ? "bg-[#040814] border-slate-700 text-blue-400 hover:border-blue-600" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300")}>
                      <Cpu className="w-3 h-3" />
                      <span>{activeLLM.shortName}</span>
                      <div className={cn("w-1.5 h-1.5 rounded-full", activeLLM.status === "running" ? "bg-green-500" : "bg-red-400")} />
                      <ChevronDown className={cn("w-3 h-3 opacity-70 transition-transform", showLLMDropdown && "rotate-180")} />
                    </button>
                  </div>

                  {/* 에이전트 파이프라인 버튼 */}
                  {isAgent && (
                    <button onClick={() => setShowBuilderModal(true)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-bold border bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 transition-colors">
                      <Workflow className="w-3 h-3" /> 파이프라인
                    </button>
                  )}

                  {/* 전송 버튼 */}
                  <button onClick={() => handleSend()} className={cn("h-9 w-9 rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-95 ml-0.5", isSecure ? "bg-blue-600 hover:bg-blue-700 text-white" : cn(mc.colors.active, "hover:opacity-90 text-white"))}>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className={cn("text-center text-[11px] mt-3 font-medium", isSecure ? "text-slate-500 font-mono" : "text-slate-400")}>
                {isSecure ? "✓ 외부망 연결 차단됨 · 입력 데이터 외부 전송 없음" : "AI 답변은 참고용입니다. 중요한 사항은 원문 및 담당 부서를 통해 확인하세요."}
              </p>
            </div>
          </div>}
        </main>

        {/* ====================== RIGHT PANEL ======================= */}
        <aside className={cn("shrink-0 flex flex-col border-l transition-all duration-300 z-20 shadow-sm relative", th.panel, rightOpen ? "w-[380px]" : "w-7")}>
          {/* Toggle handle — mirrors left sidebar pattern */}
          <button onClick={() => setRightOpen(!rightOpen)}
            title={rightOpen ? "패널 닫기" : "RAG 패널 열기"}
            className={cn("absolute -left-3.5 top-[72px] w-7 h-7 rounded-full flex items-center justify-center shadow-md z-40 transition-colors border",
              isSecure ? "bg-[#0a0f1c] border-slate-700 text-slate-400 hover:text-blue-400" : "bg-white border-slate-200 text-slate-400 hover:text-slate-700")}>
            {rightOpen ? <SidebarClose className="w-4 h-4" /> : <SidebarOpen className="w-4 h-4" />}
          </button>

          {/* Inner wrapper — hides content when panel is collapsed */}
          <div className={cn("flex flex-col flex-1 min-h-0 transition-opacity duration-200", rightOpen ? "opacity-100" : "opacity-0 overflow-hidden pointer-events-none invisible")}>

          {/* Panel Header */}
          <div className={cn("border-b flex items-start justify-between px-5 pt-[17px] pb-3 shrink-0", isSecure ? "border-slate-800/60" : "border-slate-100")}>
            {panelView === "READER" && activeCitation ? (
              <div className="flex items-center gap-3 w-full pr-3 animate-in fade-in">
                <button onClick={() => setPanelView("DOCS")} className={cn("p-2 rounded-xl transition-colors shrink-0", isSecure ? "hover:bg-[#1e293b] text-blue-400" : "hover:bg-slate-100 text-slate-500")}>
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <h3 className={cn("text-[13px] font-black truncate min-w-0 flex-1", th.text)}>{activeCitation.name}</h3>
                    {activeCitation.secLevel && <SecurityBadge level={activeCitation.secLevel} size="xs" />}
                  </div>
                  <p className={cn("text-[13px] font-medium", th.subtext)}>원문 뷰어 · 관련 구절 강조</p>
                </div>
              </div>
            ) : isAgent ? (
              <div className="flex items-center gap-2.5 animate-in fade-in">
                <Activity className="w-5 h-5 text-indigo-600" />
                <h3 className={cn("text-[15px] font-black", th.text)}>내 에이전트 활동</h3>
                <span className="text-[13px] px-2 py-0.5 rounded-full font-black border bg-indigo-50 text-indigo-700 border-indigo-200">이번 주 8회</span>
              </div>
            ) : (
              <div className="flex flex-col w-full animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <FolderOpen className={cn("w-5 h-5", isSecure ? "text-blue-400/70" : "text-slate-500")} />
                  <h3 className={cn("text-[15px] font-black", th.text)}>
                    {isSecure ? "참조 문서" : "RAG 연동 문서"}
                  </h3>
                  {!isSecure && <span className="text-[13px] px-2 py-0.5 rounded-full font-black border bg-green-100 text-green-700 border-green-200">VectorDB 연결됨</span>}
                </div>
                <div className={cn("flex gap-1 mt-3 p-1 rounded-xl", isSecure ? "bg-[#040814]" : "bg-slate-200/70")}>
                  {(isSecure ? ["DOCS", "TOOLS"] : ["DOCS", "TOOLS", "MYRAG"]).map(tab => (
                    <button key={tab} onClick={() => setPanelTab(tab)} className={cn("flex-1 py-1.5 text-[13px] font-black rounded-lg transition-all", panelTab === tab ? (isSecure ? "bg-slate-800 text-blue-400 shadow-sm" : "bg-blue-600 text-white shadow-sm") : (isSecure ? "text-slate-500 hover:text-slate-300" : "text-slate-500 hover:text-slate-700"))}>
                      {tab === "DOCS" ? "문서 목록" : tab === "TOOLS" ? "연동 도구" : "내 RAG"}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => setRightOpen(false)} className={cn("p-2 rounded-xl shrink-0 transition-colors ml-2 -mt-0.5", isSecure ? "hover:bg-[#1e293b] text-slate-400" : "hover:bg-slate-100 text-slate-400")}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Panel Content */}
          <div className={cn("flex-1 overflow-y-auto custom-scrollbar", th.panelInner)}>
            {/* 보안 채팅 지식 영역 안내 */}
            {isSecure && panelView !== "READER" && (
              <div className="mx-4 mt-4 px-3 py-2.5 bg-[#0a1428] border border-blue-900/40 rounded-xl flex items-start gap-2.5 text-[13px] text-blue-400/70 font-medium leading-relaxed">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600/60 shrink-0 mt-0.5"/>
                <span>문서·지식 영역은 내부망에 저장된 자료입니다. <span className="text-slate-500">무저장</span>은 <span className="text-slate-400">대화 내용</span>에만 적용됩니다.</span>
              </div>
            )}
            {panelView === "READER" && !isAgent ? (
              /* ── 문서 뷰어 ── */
              <div className="flex flex-col h-full">
                <div className={cn("h-11 border-b flex items-center justify-end px-4 gap-2 shrink-0", isSecure ? "bg-[#0a0f1c] border-slate-800" : "bg-white border-slate-100 shadow-sm")}>
                  <div className={cn("flex items-center rounded-lg border p-0.5 shadow-sm", isSecure ? "bg-[#040814] border-slate-700" : "bg-white border-slate-200")}>
                    <button className={cn("p-1.5 rounded-md transition-colors", isSecure ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500")}><ZoomOut className="w-3.5 h-3.5" /></button>
                    <span className={cn("text-[13px] font-bold px-2 w-10 text-center", isSecure ? "text-slate-300" : "text-slate-600")}>100%</span>
                    <button className={cn("p-1.5 rounded-md transition-colors", isSecure ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500")}><ZoomIn className="w-3.5 h-3.5" /></button>
                  </div>
                  <span className={cn("text-[13px] px-2 py-0.5 rounded font-bold border", isSecure ? "bg-slate-800 text-blue-400 border-slate-700" : "bg-yellow-50 text-yellow-700 border-yellow-200")}>관련 구절 강조됨</span>
                </div>
                <div className="flex-1 overflow-y-auto p-5 custom-scrollbar" ref={readerRef}>
                  <div className={cn("rounded-xl shadow-md border p-6 sm:p-8 min-h-full", isSecure ? "bg-[#0a0f1c] border-slate-800" : "bg-white border-slate-200")}>
                    {renderDocText()}
                  </div>
                </div>
              </div>
            ) : isAgent ? (
              /* ── 내 에이전트 활동 ── */
              <div className="p-4 space-y-4 animate-in fade-in">

                {/* 빠른 실행 */}
                <div>
                  <div className={cn("text-[11px] font-black uppercase tracking-wider mb-2", th.subtext)}>빠른 실행</div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'agent-chatbot',   label: '챗봇' },
                      { id: 'agent-meeting',   label: '회의록' },
                      { id: 'agent-knowledge', label: '지식 검색' },
                      { id: 'agent-summary',   label: '문서 요약' },
                    ].map(a => (
                      <button key={a.id} onClick={() => setActiveAgentId(a.id)}
                        className={cn("px-3 py-1.5 rounded-full text-[13px] font-bold border-2 transition-all",
                          isSecure ? "bg-[#0a0f1c] border-slate-700 text-slate-300 hover:border-indigo-600 hover:text-indigo-300"
                                   : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-700 shadow-sm")}>
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={cn("h-px", th.divider)} />

                {/* 최근 작업 이력 */}
                <div>
                  <div className={cn("text-[11px] font-black uppercase tracking-wider mb-2 flex items-center justify-between", th.subtext)}>
                    <span>최근 작업</span>
                    <span className="font-medium normal-case">이번 주 8회 실행</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { agentId: 'agent-meeting',      agentName: '회의록 작성',  time: '오늘 14:32', result: 'KREA-2026-031.hwp 생성' },
                      { agentId: 'agent-knowledge',    agentName: '지식 검색',    time: '오늘 10:15', result: '표준지 조사 기준 5건 검색' },
                      { agentId: 'agent-dataanalysis', agentName: '데이터 분석',  time: '어제 16:44', result: '공시지가 변동현황 분석 완료' },
                    ].map((task, i) => (
                      <div key={i} className={cn("p-3 rounded-xl border cursor-pointer transition-all group",
                        isSecure ? "bg-[#0a0f1c]/80 border-slate-800 hover:border-slate-600"
                                 : "bg-white border-slate-100 shadow-sm hover:border-indigo-200")}>
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className={cn("text-[13px] font-black truncate", th.text)}>{task.agentName}</span>
                              <span className={cn("text-[13px] font-medium shrink-0", th.subtext)}>{task.time}</span>
                            </div>
                            <div className={cn("text-[13px] font-medium truncate mt-0.5", th.subtext)}>{task.result}</div>
                          </div>
                        </div>
                        <button onClick={() => setActiveAgentId(task.agentId)}
                          className={cn("mt-2 w-full text-[13px] font-bold py-1 rounded-lg transition-all opacity-0 group-hover:opacity-100",
                            isSecure ? "bg-slate-800 text-indigo-400" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100")}>
                          이어하기 →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={cn("h-px", th.divider)} />

                {/* AI 추천 다음 작업 */}
                <div>
                  <div className={cn("text-[11px] font-black uppercase tracking-wider mb-2 flex items-center gap-1.5", th.subtext)}>
                    <Sparkles className="w-3 h-3" /><span>AI 추천</span>
                  </div>
                  <div className={cn("p-3 rounded-xl border-2 mb-2",
                    isSecure ? "bg-indigo-900/20 border-indigo-800/40" : "bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-100")}>
                    <div className={cn("text-[13px] font-black mb-1", isSecure ? "text-indigo-300" : "text-indigo-800")}>
                      표준지공시지가 조사 마감 12일 전
                    </div>
                    <p className={cn("text-[13px] leading-relaxed mb-2.5", isSecure ? "text-indigo-400" : "text-indigo-700")}>
                      지난 조사 보고서와 현행 지침을 대조 검토하여 변경사항을 확인하시겠습니까?
                    </p>
                    <button onClick={() => setActiveAgentId('agent-knowledge')}
                      className={cn("w-full flex items-center justify-center gap-1.5 h-7 rounded-lg text-[13px] font-bold transition-all",
                        isSecure ? "bg-indigo-800 text-indigo-200 hover:bg-indigo-700" : "bg-indigo-600 text-white hover:bg-indigo-700")}>
                      <Bot className="w-3 h-3" /> 지식 검색 에이전트 시작 →
                    </button>
                  </div>
                  <div className={cn("p-3 rounded-xl border",
                    isSecure ? "bg-[#0a0f1c]/80 border-slate-800" : "bg-white border-slate-100 shadow-sm")}>
                    <div className={cn("text-[13px] font-black mb-1", th.text)}>미처리 회의 녹음 파일</div>
                    <p className={cn("text-[13px] leading-relaxed mb-2", th.subtext)}>
                      2026-03-17 부동산공시처 정례회의 녹음이 미처리 상태입니다.
                    </p>
                    <button onClick={() => setActiveAgentId('agent-meeting')}
                      className={cn("text-[13px] font-bold flex items-center gap-1 transition-colors",
                        isSecure ? "text-violet-400 hover:text-violet-300" : "text-violet-600 hover:text-violet-800")}>
                      <Mic className="w-3 h-3" /> 회의록 작성 시작 →
                    </button>
                  </div>
                </div>

                <div className={cn("h-px", th.divider)} />

                {/* 이번 주 성과 */}
                <div className={cn("p-3 rounded-xl border grid grid-cols-3 gap-2 text-center",
                  isSecure ? "bg-[#0a0f1c] border-slate-800" : "bg-slate-50 border-slate-200")}>
                  <div>
                    <div className={cn("text-[18px] font-black leading-tight", isSecure ? "text-blue-400" : "text-indigo-700")}>8회</div>
                    <div className={cn("text-[13px] font-bold mt-0.5", th.subtext)}>이번 주 실행</div>
                  </div>
                  <div>
                    <div className={cn("text-[18px] font-black leading-tight", isSecure ? "text-emerald-400" : "text-emerald-700")}>2.4h</div>
                    <div className={cn("text-[13px] font-bold mt-0.5", th.subtext)}>절감 시간</div>
                  </div>
                  <div>
                    <div className={cn("text-[18px] font-black leading-tight", isSecure ? "text-amber-400" : "text-amber-700")}>5건</div>
                    <div className={cn("text-[13px] font-bold mt-0.5", th.subtext)}>생성 산출물</div>
                  </div>
                </div>

              </div>
            ) : panelTab === "TOOLS" ? (
              /* ── 연동 도구 탭 ── */
              <div className="p-6 space-y-5 animate-in fade-in">
                <div>
                  <h4 className={cn("text-[13px] font-black uppercase tracking-wider mb-1", th.subtext)}>사내 시스템 연동 (MCP)</h4>
                  <p className={cn("text-[13px] font-medium mb-4", th.subtext)}>관리자가 인가한 사내 도구 목록입니다.</p>
                </div>
                <div className="space-y-3">
                  {MCP_TOOLS.map(tool => (
                    <div key={tool.id} className={cn("p-4 rounded-2xl border-2 transition-all", isSecure ? "bg-[#0a0f1c]/80 border-slate-800" : "bg-white border-slate-100 shadow-sm")}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center border shrink-0", isSecure ? "bg-[#040814] text-blue-400 border-slate-700" : "bg-blue-50 text-blue-600 border-blue-100")}>
                          {tool.type === "벡터 DB" ? <Database className="w-4 h-4" /> : tool.type === "보안 모듈" ? <Shield className="w-4 h-4" /> : <Server className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={cn("text-[13px] font-bold truncate", th.text)}>{tool.name}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={cn("text-[13px] px-1.5 py-0.5 rounded font-black border", isSecure ? "bg-slate-800 text-blue-400 border-slate-700" : "bg-slate-100 text-slate-600 border-slate-200")}>{tool.type}</span>
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                              <span className={cn("text-[13px] font-bold text-green-600")}>{tool.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className={cn("text-[13px] font-medium leading-relaxed", th.subtext)}>{tool.desc}</p>
                    </div>
                  ))}
                </div>

                {/* ── 현재 사용 모델 카드 (NEW) ── */}
                <div className={cn("h-px", th.divider)}></div>
                <div>
                  <h4 className={cn("text-[13px] font-black uppercase tracking-wider mb-3", th.subtext)}>현재 사용 AI 모델</h4>
                  <div className={cn("p-4 rounded-2xl border-2", isSecure ? "bg-[#0a0f1c] border-slate-800" : "bg-white border-slate-100 shadow-sm")}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border shrink-0", isSecure ? "bg-[#040814] text-blue-400 border-blue-900/50" : "bg-blue-50 text-blue-600 border-blue-100")}>
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={cn("text-[14px] font-black", th.text)}>{activeLLM.name}</div>
                        <div className={cn("text-[13px] font-medium", th.subtext)}>{activeLLM.type} · Context {activeLLM.context}</div>
                      </div>
                    </div>
                    <p className={cn("text-[13px] font-medium", th.subtext)}>{activeLLM.desc}</p>
                    <div className={cn("flex items-center gap-2 mt-3 p-2 rounded-lg", isSecure ? "bg-[#040814]" : "bg-slate-50")}>
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className={cn("text-[13px] font-bold", isSecure ? "text-green-400" : "text-green-700")}>온프레미스 · 내부망 전용 · 외부 전송 없음</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : panelTab === "MYRAG" ? (
              /* ── 내 RAG 지식영역 탭 ── */
              <div className="p-6 space-y-5 animate-in fade-in">
                {/* 영역 헤더 */}
                <div className="flex items-center justify-between">
                  <h4 className={cn("text-[13px] font-black uppercase tracking-wider", th.subtext)}>내 지식 영역</h4>
                  <button onClick={() => setShowNewArea(v => !v)} className={cn("flex items-center gap-1 text-[13px] px-2.5 py-1 rounded-lg border font-bold transition-colors", isSecure ? "border-slate-700 text-blue-400 hover:bg-slate-800" : "border-slate-200 text-blue-600 hover:bg-blue-50")}>
                    <Plus className="w-3 h-3"/> 영역 추가
                  </button>
                </div>
                {/* 신규 영역 입력 */}
                {showNewArea && (
                  <div className={cn("flex gap-2 p-3 rounded-xl border-2", isSecure ? "border-slate-700 bg-[#0a0f1c]" : "border-blue-100 bg-blue-50")}>
                    <input value={newAreaName} onChange={e => setNewAreaName(e.target.value)} placeholder="영역 이름 입력" className={cn("flex-1 px-3 py-1.5 rounded-lg text-[13px] border outline-none", isSecure ? "bg-[#040814] border-slate-700 text-slate-200 placeholder:text-slate-600" : "bg-white border-slate-200 text-slate-800")}/>
                    <button onClick={() => { if(newAreaName.trim()){setMyRagAreas(p=>[...p,{id:'mra-'+Date.now(),name:newAreaName.trim(),docs:0,active:true}]);setNewAreaName('');setShowNewArea(false);} }} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[13px] font-bold hover:bg-blue-700">생성</button>
                  </div>
                )}
                {/* 영역 칩 목록 */}
                <div className="flex flex-wrap gap-2">
                  {myRagAreas.map(a => (
                    <button key={a.id} onClick={() => setSelRagArea(a.id)} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 text-[13px] font-bold transition-all", selRagArea === a.id ? (isSecure ? "border-blue-500 bg-blue-900/30 text-blue-300" : "border-blue-500 bg-blue-50 text-blue-700") : (isSecure ? "border-slate-800 text-slate-400 hover:border-slate-700" : "border-slate-200 text-slate-600 hover:border-slate-300"))}>
                      <FolderOpen className="w-3.5 h-3.5"/>
                      {a.name}
                      <span className={cn("text-[13px]", isSecure ? "text-slate-500" : "text-slate-400")}>{(myRagDocs[a.id]||[]).length}개</span>
                    </button>
                  ))}
                </div>
                <div className={cn("h-px", th.divider)}/>
                {/* 선택 영역 문서 목록 헤더 */}
                <div className="flex items-center justify-between">
                  <h4 className={cn("text-[13px] font-black uppercase tracking-wider truncate max-w-[180px]", th.subtext)}>
                    {myRagAreas.find(a => a.id === selRagArea)?.name || '영역 선택'} 문서
                  </h4>
                  <button onClick={() => fileInputRef.current?.click()} className={cn("flex items-center gap-1 text-[13px] px-2.5 py-1 rounded-lg border font-bold transition-colors shrink-0", isSecure ? "border-slate-700 text-blue-400 hover:bg-slate-800" : "border-slate-200 text-blue-600 hover:bg-blue-50")}>
                    <UploadCloud className="w-3 h-3"/> 업로드
                  </button>
                </div>
                {/* 문서 목록 (체크박스로 범위 설정) */}
                <div className="space-y-2">
                  {(myRagDocs[selRagArea] || []).map(d => (
                    <div key={d.id} className={cn("flex items-center gap-2 p-3 rounded-xl border-2 transition-all", isSecure ? "border-slate-800 bg-[#0a0f1c]" : "border-slate-100 bg-white shadow-sm")}>
                      <input type="checkbox" checked={d.inScope} onChange={() => setMyRagDocs(p => ({...p, [selRagArea]: p[selRagArea].map(x => x.id === d.id ? {...x, inScope: !x.inScope} : x)}))} className="w-4 h-4 rounded accent-blue-600 shrink-0"/>
                      <FileText className={cn("w-4 h-4 shrink-0", isSecure ? "text-blue-400" : "text-blue-500")}/>
                      <div className="flex-1 min-w-0">
                        <div className={cn("text-[13px] font-bold truncate", th.text)}>{d.name}</div>
                        <div className={cn("flex items-center gap-1.5 text-[13px] font-medium mt-0.5 flex-wrap", th.subtext)}>
                          <span>{d.size}</span>
                          {d.pii && <span className={cn("px-1.5 py-0.5 rounded font-bold", isSecure ? "bg-orange-900/30 text-orange-400" : "bg-orange-100 text-orange-600")}>PII</span>}
                          {d.secLevel && <SecurityBadge level={d.secLevel} size="xs" />}
                        </div>
                      </div>
                      <button onClick={() => setMyRagDocs(p => ({...p, [selRagArea]: p[selRagArea].filter(x => x.id !== d.id)}))} className={cn("p-1 rounded-lg transition-colors shrink-0", isSecure ? "hover:bg-slate-800 text-slate-600 hover:text-slate-400" : "hover:bg-red-50 text-slate-300 hover:text-red-500")}>
                        <X className="w-3.5 h-3.5"/>
                      </button>
                    </div>
                  ))}
                  {(myRagDocs[selRagArea] || []).length === 0 && (
                    <div className={cn("text-center py-8 text-[13px] font-medium", th.subtext)}>
                      문서를 업로드하여 개인 RAG 영역을 구성하세요
                    </div>
                  )}
                </div>
                {/* 안내 박스 */}
                <div className={cn("p-3 rounded-xl border text-[13px] font-medium leading-relaxed", isSecure ? "border-slate-800 bg-[#0a0f1c] text-slate-400" : "border-blue-100 bg-blue-50 text-blue-600")}>
                  <div className="flex items-center gap-1.5 font-bold mb-1"><Shield className="w-3 h-3"/>개인 영역 격리 보장</div>
                  체크된 문서만 질의 범위에 포함됩니다. 타 사용자와 격리된 개인 전용 벡터 공간에 저장됩니다.
                </div>
              </div>
            ) : (
              /* ── 문서 목록 탭 ── */
              <div className="p-6 space-y-6 animate-in fade-in">
                {/* ── 보안 등급 범례 ── */}
                <div className={cn("rounded-xl border overflow-hidden mb-1", isSecure ? "border-slate-800" : "border-slate-200")}>
                  <div className={cn("px-3 py-2 text-[12px] font-black uppercase tracking-wider border-b", isSecure ? "bg-[#040814] border-slate-800 text-slate-500" : "bg-slate-100 border-slate-200 text-slate-500")}>데이터 보안 등급 기준</div>
                  <div className={cn("divide-y", isSecure ? "divide-slate-800 bg-[#0a0f1c]" : "divide-slate-100 bg-white")}>
                    {(["C","S","O"]).map(lvl => {
                      const sl = SECURITY_LEVELS[lvl];
                      return (
                        <div key={lvl} className="flex items-center gap-2.5 px-3 py-2">
                          <SecurityBadge level={lvl} size="xs" />
                          <span className={cn("text-[13px] font-medium truncate", th.subtext)}>{sl.desc}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  {DOCS.map(doc => {
                    const sl = SECURITY_LEVELS[doc.secLevel] || SECURITY_LEVELS.O;
                    return (
                    <div key={doc.id} className={cn("p-4 rounded-2xl border-2 cursor-default group transition-all",
                      isSecure ? "bg-[#0a0f1c]/50 border-slate-800 hover:border-blue-700"
                      : doc.secLevel === "C" ? "bg-white border-red-100 hover:border-red-300 hover:shadow-md"
                      : doc.secLevel === "S" ? "bg-white border-orange-100 hover:border-orange-300 hover:shadow-md"
                      : "bg-white border-slate-100 hover:border-green-200 hover:shadow-md")}>
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                          isSecure ? "bg-[#040814] text-blue-400 border-slate-700"
                          : doc.secLevel === "C" ? "bg-red-50 text-red-600 border-red-100"
                          : doc.secLevel === "S" ? "bg-orange-50 text-orange-600 border-orange-100"
                          : "bg-green-50 text-green-600 border-green-100")}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={cn("text-[13px] font-bold truncate mb-0.5", th.text)}>{doc.name}</div>
                          <div className={cn("flex items-center gap-2 text-[13px] font-medium", th.subtext)}>
                            <span>{doc.size}</span><span className="opacity-50">|</span><span>{doc.date}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <SecurityBadge level={doc.secLevel} size="xs" />
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            <span className="text-[13px] text-green-600 font-bold">적재됨</span>
                          </div>
                        </div>
                      </div>
                      {doc.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2 ml-[52px]">
                          {doc.tags.map(tag => (
                            <span key={tag} className={cn("text-[13px] px-1.5 py-0.5 rounded font-bold border", isSecure ? "bg-slate-800 text-slate-400 border-slate-700" : "bg-slate-100 text-slate-600 border-slate-200")}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    );
                  })}
                  <button onClick={() => fileInputRef.current?.click()} className={cn("w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 border-dashed font-bold text-[13px] transition-all", isSecure ? "border-slate-700 text-slate-500 hover:border-blue-600 hover:text-blue-400" : "border-slate-300 text-slate-500 hover:border-blue-400 hover:text-blue-600")}>
                    <UploadCloud className="w-4 h-4" /> 문서 추가 업로드
                  </button>
                </div>

                <div className={cn("h-px", th.divider)}></div>

                {/* 빠른 질문 */}
                <div>
                  <h4 className={cn("text-[13px] font-black uppercase tracking-wider mb-4", th.subtext)}>
                    {isSecure ? "보안 스캔 지시" : "빠른 질문"}
                  </h4>
                  <div className="space-y-2">
                    {(isSecure ? SECURE_SUGGESTIONS : SUGGESTIONS[mode])?.map((s, i) => (
                      <button key={i} onClick={() => handleSend(s.query)} className={cn("w-full text-left p-3.5 rounded-xl border-2 text-[13px] font-bold transition-all flex items-center justify-between group shadow-sm", isSecure ? "bg-[#0a0f1c] border-slate-800 text-slate-300 hover:border-blue-600 hover:text-blue-300" : "bg-white border-slate-100 text-slate-700 hover:border-slate-300 hover:text-blue-700")}>
                        <span>{s.title}</span>
                        <ArrowRight className={cn("w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all", isSecure ? "text-blue-400" : "text-blue-500")} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className={cn("h-px", th.divider)}></div>

                {/* 보안 정보 */}
                <div className={cn("p-4 rounded-2xl border", isSecure ? "bg-blue-900/20 border-blue-800/50" : "bg-blue-50 border-blue-100")}>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className={cn("w-5 h-5 mt-0.5 shrink-0", isSecure ? "text-blue-400" : "text-blue-600")} />
                    <div>
                      <div className={cn("text-[13px] font-black mb-1", isSecure ? "text-blue-300" : "text-blue-800")}>망분리 보안 환경 적용</div>
                      <div className={cn("text-[13px] font-medium leading-relaxed", isSecure ? "text-blue-400" : "text-blue-700")}>
                        입력하신 정보는 외부로 절대 전송되지 않으며, 사내 로컬 서버에서만 처리됩니다. (SFR-002 적용)
                      </div>
                    </div>
                  </div>
                </div>

                {/* 관리자 전환 */}
                {onSwitchToAdmin && (
                  <div className={cn("p-4 rounded-2xl border", isSecure ? "bg-[#0a0f1c] border-slate-800" : "bg-slate-50 border-slate-200")}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className={cn("w-4 h-4", isSecure ? "text-blue-400" : "text-indigo-600")} />
                        <span className={cn("text-[13px] font-black", th.text)}>GenOS 관리자 시스템</span>
                      </div>
                      <button onClick={onSwitchToAdmin} className={cn("flex items-center gap-1.5 text-[13px] font-bold transition-colors", isSecure ? "text-blue-400 hover:text-blue-300" : "text-indigo-600 hover:text-indigo-800")}>
                        전환 <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className={cn("text-[13px] mt-1 font-medium", th.subtext)}>에이전트 편집, LLM 관리, 보안 대시보드</p>
                  </div>
                )}
              </div>
            )}
          </div>
          </div>{/* /inner wrapper */}
        </aside>
      </div>

      {/* ====================== 에이전트 빌더 모달 ====================== */}
      {showBuilderModal && selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-6xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border-2 bg-slate-50 border-slate-200">
            {/* Header */}
            <div className="h-20 border-b border-slate-200 flex items-center justify-between px-8 shrink-0 bg-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center text-indigo-600">
                  {React.createElement(selectedAgent.icon, { className: "w-6 h-6" })}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{selectedAgent.name} 내부 로직 (읽기 전용)</h3>
                  <p className="text-[13px] font-medium text-slate-500 mt-0.5">관리자가 사전 구성한 에이전트 내부 동작 단계입니다.</p>
                </div>
              </div>
              <button onClick={() => { setShowBuilderModal(false); setSelectedNode(null); }} className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 border border-slate-200 transition-colors"><X className="w-6 h-6" /></button>
            </div>
            {/* Body */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left nav */}
              <div className="w-60 border-r border-slate-200 p-5 shrink-0 flex flex-col gap-2 bg-white">
                {[{id:"WORKFLOW",label:"에이전트 파이프라인",Icon:Network},{id:"TOOLS",label:"연동 가능 사내 도구",Icon:Boxes}].map(({id,label,Icon})=>(
                  <button key={id} onClick={()=>setBuilderTab(id)} className={cn("w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[13px] font-bold transition-all text-left border-2",
                    builderTab===id?"bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm":"border-transparent text-slate-500 hover:bg-slate-50")}>
                    <Icon className="w-5 h-5"/>{label}
                  </button>
                ))}
              </div>
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-slate-50">
                {builderTab === "WORKFLOW" ? (
                  <div className="max-w-5xl mx-auto animate-in fade-in">
                    <h4 className="text-2xl font-black text-slate-800 mb-8">내부 처리 단계 (프롬프트 체인)</h4>
                    <div className="flex gap-8">
                      <div className="flex-1 rounded-3xl border-2 border-slate-200 p-10 shadow-sm bg-white">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                          {selectedAgent.workflow.map((node, i) => (
                            <div key={i} onClick={() => setSelectedNode(selectedNode === node ? null : node)}
                              className={cn("rounded-2xl border-2 shadow-md p-6 flex flex-col gap-4 relative cursor-pointer transition-all hover:-translate-y-1",
                                selectedNode === node ? "border-indigo-500 ring-4 ring-indigo-100 bg-white" : "border-slate-200 bg-white hover:border-indigo-300")}>
                              <span className="text-[11px] font-black px-3 py-1.5 rounded-lg w-fit bg-slate-100 text-indigo-600">{node.step}단계</span>
                              <div>
                                <div className="text-[13px] font-bold text-indigo-600 mb-1">{node.role}</div>
                                <div className="text-lg font-black text-slate-800">{node.name}</div>
                              </div>
                              <div className="text-[13px] p-3.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-600 leading-relaxed line-clamp-3 font-medium">{node.prompt}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {selectedNode && (
                        <div className="w-[340px] shrink-0 rounded-3xl border-2 border-slate-200 shadow-xl p-6 flex flex-col bg-white animate-in slide-in-from-right-8">
                          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                            <h5 className="text-lg font-black text-slate-800">세부 단계 정보</h5>
                            <button onClick={() => setSelectedNode(null)} className="p-1.5 rounded-lg hover:bg-slate-100"><X className="w-5 h-5 text-slate-400" /></button>
                          </div>
                          <div className="space-y-5">
                            {[["하위 에이전트 역할", selectedNode.name], ["사전 지시어 (시스템 프롬프트)", selectedNode.prompt], ["호출하는 사내 시스템 연동 (MCP)", selectedNode.tool]].map(([label, val], ii) => (
                              <div key={ii}>
                                <span className="text-[12px] font-bold uppercase tracking-wider text-slate-400 block mb-2">{label}</span>
                                <div className={cn("w-full border-2 rounded-xl p-3.5 text-[13px] font-medium whitespace-pre-wrap leading-relaxed",
                                  ii===2 ? "bg-indigo-50 border-indigo-100 text-indigo-700" : "bg-slate-50 border-slate-200 text-slate-700")}>
                                  {ii===2 && <Wrench className="w-4 h-4 inline mr-2 mb-0.5"/>}{val}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="max-w-5xl mx-auto animate-in fade-in">
                    <h4 className="text-2xl font-black text-slate-800 mb-2">연동 가능한 사내 보안 도구</h4>
                    <p className="text-[15px] font-medium text-slate-500 mb-8">관리자가 인가한 사내 시스템 연동(MCP) 목록입니다.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {MCP_TOOLS.map(tool => (
                        <div key={tool.id} className="p-6 rounded-3xl border-2 border-slate-200 bg-white shadow-sm">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border-2 border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                              {tool.type === "벡터 DB" ? <Database className="w-6 h-6"/> : <Server className="w-6 h-6"/>}
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1.5">
                                <h4 className="font-black text-lg text-slate-800">{tool.name}</h4>
                                <span className="text-[10px] px-2 py-0.5 rounded-md font-bold border bg-indigo-50 text-indigo-700 border-indigo-200">{tool.type}</span>
                              </div>
                              <p className="text-[14px] font-medium text-slate-500">{tool.desc}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Footer */}
            <div className="h-14 border-t border-slate-200 flex items-center justify-between px-8 shrink-0 bg-white">
              <p className="text-[12px] text-slate-400 font-medium">관리자가 사전에 구성한 에이전트 파이프라인입니다 (읽기 전용)</p>
              <button onClick={() => { setShowBuilderModal(false); setSelectedNode(null); }} className="px-5 py-2 rounded-xl font-bold text-[13px] text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md">확인</button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* 이용만족도 평가 모달                                    */}
      {/* ══════════════════════════════════════════════════════ */}
      {showSatisfaction && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 mx-4 animate-in zoom-in-90 duration-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-yellow-50 border-2 border-yellow-200 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-1">이용 만족도 평가</h3>
              <p className="text-[14px] text-slate-500 font-medium">서비스 개선에 소중한 의견을 주세요.</p>
            </div>
            {/* 별점 */}
            <div className="flex justify-center gap-3 mb-6">
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setSatRating(s)} className="transition-transform hover:scale-125">
                  <Star className={cn("w-10 h-10", s <= satRating ? "text-yellow-400 fill-yellow-400" : "text-slate-300")} />
                </button>
              ))}
            </div>
            {satRating > 0 && (
              <div className="mb-2 text-center text-[13px] font-bold text-slate-600">
                {["","매우 불만족","불만족","보통","만족","매우 만족"][satRating]}
              </div>
            )}
            {/* 의견 */}
            <textarea
              value={satComment}
              onChange={e => setSatComment(e.target.value)}
              placeholder="자유롭게 의견을 남겨주세요. (선택)"
              rows={3}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium text-slate-700 focus:outline-none focus:border-blue-400 resize-none mb-5"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowSatisfaction(false)} className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-[14px] hover:bg-slate-50 transition-colors">나중에</button>
              <button onClick={() => { setShowSatisfaction(false); setToast({ message: satRating > 0 ? `${satRating}점 평가가 제출되었습니다. 감사합니다!` : "평가 없이 닫혔습니다." }); }} className="flex-1 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white font-black text-[14px] transition-colors shadow-md">제출</button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* 튜토리얼 모달                                          */}
      {/* ══════════════════════════════════════════════════════ */}
      {showTutorial && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowTutorial(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 mx-4 animate-in zoom-in-90 duration-200 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border-2 border-blue-200 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">사용 가이드</h3>
                  <p className="text-[13px] text-slate-500 font-medium">GeNOS AI 플랫폼 주요 기능 안내</p>
                </div>
              </div>
              <button onClick={() => setShowTutorial(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            {/* 기능 카드 2열 그리드 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { icon: MessageSquare, color: "bg-blue-50 border-blue-100 text-blue-600", title: "일반 질의", desc: "사내 규정·지식 기반 자연어 Q&A. 출처 문서와 유사도 점수를 함께 제공합니다." },
                { icon: FileCheck, color: "bg-purple-50 border-purple-100 text-purple-600", title: "문서 검토", desc: "업로드 문서를 사내 규정과 대조하여 보완 사항 및 위반 소지를 발췌합니다." },
                { icon: Languages, color: "bg-violet-50 border-violet-100 text-violet-600", title: "번역·요약", desc: "한↔영·중·일 번역 및 요약 길이(100~2,000자) 조절 기능을 제공합니다." },
                { icon: FileText, color: "bg-green-50 border-green-100 text-green-600", title: "보고서 작성", desc: "구두 지시 또는 데이터 입력으로 보고서 초안을 자동 생성합니다." },
                { icon: Bot, color: "bg-indigo-50 border-indigo-100 text-indigo-600", title: "에이전트 모드", desc: "다단계 파이프라인 에이전트가 복잡한 업무를 단계별로 자동 처리합니다." },
                { icon: ShieldCheck, color: "bg-slate-100 border-slate-200 text-slate-700", title: "보안 채팅", desc: "망분리·개인정보 마스킹 적용 구역. 대외비 문서를 안전하게 처리합니다." },
                { icon: Star, color: "bg-yellow-50 border-yellow-100 text-yellow-600", title: "만족도 평가", desc: "AI 답변 3회 후 자동으로 만족도 평가 요청이 팝업됩니다." },
                { icon: AlertTriangle, color: "bg-red-50 border-red-100 text-red-600", title: "오류 신고", desc: "AI 답변의 환각·부정확 내용을 즉시 신고하여 품질 개선에 기여합니다." },
              ].map(({ icon: Icon, color, title, desc }) => (
                <div key={title} className={cn("p-4 rounded-2xl border-2", color.split(' ').slice(0,2).join(' '))}>
                  <div className={cn("w-9 h-9 rounded-xl border flex items-center justify-center mb-3", color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-black text-[14px] text-slate-800 mb-1">{title}</div>
                  <div className="text-[12px] text-slate-500 font-medium leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
            {/* TIP 박스 */}
            <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-100">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-black text-[13px] text-blue-800 mb-1">TIP</div>
                  <ul className="text-[12px] text-blue-700 font-medium space-y-1 list-disc list-inside">
                    <li>좌측 사이드바에서 대화 모드(탭)를 전환할 수 있습니다.</li>
                    <li>우측 패널 "내 RAG" 탭에서 개인 지식 영역을 관리할 수 있습니다.</li>
                    <li>질문 입력창에 파일을 첨부하거나 마이크로 음성 입력도 가능합니다.</li>
                    <li>AI 답변에 마우스를 올리면 복사·평가·오류신고 버튼이 나타납니다.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* 오류 신고 모달                                         */}
      {/* ══════════════════════════════════════════════════════ */}
      {showErrReport && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 mx-4 animate-in zoom-in-90 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-50 border-2 border-red-200 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">AI 응답 오류 신고</h3>
                  <p className="text-[12px] text-slate-500 font-medium">어떤 유형의 오류인지 선택해 주세요.</p>
                </div>
              </div>
              <button onClick={() => setShowErrReport(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            {/* 오류 유형 라디오 */}
            <div className="space-y-3 mb-5">
              {[
                { val: "환각현상", label: "환각 현상 (Hallucination)", desc: "존재하지 않는 사실·수치를 만들어낸 경우" },
                { val: "부정확한정보", label: "부정확한 정보", desc: "사실과 다르거나 오래된 정보를 제공한 경우" },
                { val: "출처오류", label: "출처 오류", desc: "잘못된 문서·페이지를 출처로 인용한 경우" },
                { val: "답변누락", label: "답변 누락", desc: "핵심 내용이 빠진 불완전한 답변인 경우" },
                { val: "기타", label: "기타", desc: "위 항목에 해당하지 않는 기타 오류" },
              ].map(({ val, label, desc }) => (
                <label key={val} className={cn("flex items-start gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all", errReportText === val ? "border-red-400 bg-red-50" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50")}>
                  <input type="radio" name="errType" value={val} checked={errReportText === val} onChange={() => setErrReportText(val)} className="mt-0.5 accent-red-500" />
                  <div>
                    <div className="font-bold text-[14px] text-slate-800">{label}</div>
                    <div className="text-[12px] text-slate-500 font-medium">{desc}</div>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowErrReport(false)} className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-[14px] hover:bg-slate-50 transition-colors">취소</button>
              <button
                disabled={!errReportText}
                onClick={() => { setShowErrReport(false); setToast({ message: `오류 신고가 접수되었습니다. (${errReportText})` }); setErrReportText(''); }}
                className={cn("flex-1 py-3 rounded-xl font-black text-[14px] transition-colors shadow-md", errReportText ? "bg-red-500 hover:bg-red-600 text-white" : "bg-slate-200 text-slate-400 cursor-not-allowed")}
              >신고 제출</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Q&A / FAQ 모달 ─── */}
      {showQnaModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-[520px] max-h-[80vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600">
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-5 h-5 text-white" />
                <span className="font-black text-[16px] text-white">자주 묻는 질문 (FAQ)</span>
              </div>
              <button onClick={() => { setShowQnaModal(false); setQnaOpenIdx(null); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* FAQ List */}
            <div className="overflow-y-auto flex-1 p-4 space-y-2.5">
              {MOCK_FAQ.map((item, i) => (
                <div key={i} className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <button
                    onClick={() => setQnaOpenIdx(qnaOpenIdx === i ? null : i)}
                    className="w-full flex items-start gap-3 p-4 bg-slate-50 hover:bg-blue-50 text-left transition-colors"
                  >
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">Q</span>
                    <span className="text-[13px] font-bold text-slate-800 flex-1 leading-snug">{item.q}</span>
                    <ChevronDown className={cn("w-4 h-4 text-slate-400 shrink-0 mt-0.5 transition-transform", qnaOpenIdx === i && "rotate-180")} />
                  </button>
                  {qnaOpenIdx === i && (
                    <div className="flex items-start gap-3 p-4 bg-white border-t border-slate-100 animate-in fade-in duration-150">
                      <span className="w-5 h-5 rounded-full bg-green-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">A</span>
                      <span className="text-[12px] text-slate-600 leading-relaxed">{item.a}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Footer */}
            <div className="px-6 py-3.5 border-t bg-slate-50 flex items-center justify-between">
              <p className="text-[11px] text-slate-500">추가 문의: <span className="font-bold text-blue-600">정보기술팀 (내선 5050)</span></p>
              <button onClick={() => { setShowQnaModal(false); setQnaOpenIdx(null); }} className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-[12px] font-bold hover:bg-blue-700 transition-colors">닫기</button>
            </div>
          </div>
        </div>
      )}
      {/* ─── 공문서 미리보기 모달 ─── */}
      {showDocModal && docModalData && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-3xl h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border-2 border-slate-200 animate-in zoom-in-95 duration-200">
            {/* 모달 헤더 */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-[15px] font-black text-slate-800 leading-tight truncate">{docModalData.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-mono truncate">{docModalData.docNo} · {docModalData.issueDate}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <button
                  onClick={() => { const w = window.open("", "_blank"); w.document.write(generateDocHTML(docModalData)); w.document.close(); setTimeout(() => w.print(), 500); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-[12px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                  <Printer className="w-4 h-4" /> 인쇄 / PDF
                </button>
                <button
                  onClick={() => handleDocDownload(docModalData)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 text-white text-[12px] font-bold hover:bg-emerald-700 transition-colors shadow-sm">
                  <FileDown className="w-4 h-4" /> 다운로드
                </button>
                <button onClick={() => setShowDocModal(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors ml-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            {/* iframe 문서 렌더링 */}
            <iframe
              srcDoc={generateDocHTML(docModalData)}
              className="flex-1 w-full border-none"
              title="공문서 미리보기"
              sandbox="allow-same-origin allow-scripts allow-popups"
            />
          </div>
        </div>
      )}

      {/* ── LLM 드롭다운 Portal: overflow-hidden 상위 컨테이너를 우회하여 body에 직접 렌더링 ── */}
      {showLLMDropdown && llmDropdownPos && createPortal(
        <div
          ref={llmPortalRef}
          style={{ position: "fixed", bottom: llmDropdownPos.bottom, right: llmDropdownPos.right, width: 280, zIndex: 9999 }}
          className={cn("rounded-2xl border-2 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150",
            isSecure ? "bg-[#0a0f1c] border-slate-700" : "bg-white border-slate-200")}>
          <div className={cn("px-4 py-2.5 border-b text-[11px] font-black uppercase tracking-wider",
            isSecure ? "border-slate-800 text-slate-500" : "border-slate-100 text-slate-500")}>
            AI 모델 선택 (로컬 온프레미스)
          </div>
          {LLM_MODELS.map(model => {
            const blocked = (isSecure || model.status === "blocked") && model.security === "low";
            return (
              <button key={model.id}
                onClick={() => {
                  if (blocked) { setToast({ message: "망분리 환경에서는 클라우드 모델을 사용할 수 없습니다.", type: "error" }); return; }
                  setActiveLLM(model); setShowLLMDropdown(false);
                  setToast({ message: `[${model.name}] 모델로 변경되었습니다.` });
                }}
                className={cn("w-full text-left px-4 py-3 flex items-start gap-3 border-b last:border-0 transition-colors",
                  isSecure ? "border-slate-800" : "border-slate-50",
                  activeLLM.id === model.id ? (isSecure ? "bg-slate-800/80" : "bg-blue-50/80") : (isSecure ? "hover:bg-slate-800/50" : "hover:bg-slate-50"),
                  blocked && "opacity-40 cursor-not-allowed")}>
                <Cpu className={cn("w-4 h-4 mt-0.5 shrink-0", activeLLM.id === model.id ? (isSecure ? "text-blue-400" : "text-blue-600") : "text-slate-400")} />
                <div className="flex-1 min-w-0">
                  <div className={cn("text-[13px] font-black flex items-center gap-2", isSecure ? "text-slate-200" : "text-slate-800")}>
                    {model.name}
                    {activeLLM.id === model.id && <CheckCircle2 className={cn("w-3.5 h-3.5", isSecure ? "text-blue-400" : "text-blue-600")} />}
                    {blocked && <Lock className="w-3 h-3 text-red-500" />}
                    <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-black",
                      model.type === "구축형" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700")}>{model.type}</span>
                  </div>
                  <div className={cn("text-[11px] mt-0.5 font-medium", isSecure ? "text-slate-400" : "text-slate-500")}>{model.desc}</div>
                  <div className={cn("text-[10px] mt-0.5 font-mono", isSecure ? "text-slate-500" : "text-slate-400")}>Context: {model.context}</div>
                </div>
              </button>
            );
          })}
        </div>,
        document.body
      )}

    </div>
  );
};

export default UserApp;
