/**
 * AdminChatApp.jsx
 * 한국가스기술공사 생성형 AI 플랫폼 — 관리자 채팅 시스템
 * (과업지시서 기반 SFR 요구사항 반영)
 */
import React, { useState, useEffect, useRef } from "react";
import {
  Shield, Lock, MessageSquare, FolderOpen, AlertTriangle, FileText, UploadCloud, Database,
  Globe, Sparkles, Search, ChevronRight, X, ArrowRight, SidebarOpen, SidebarClose,
  Library, Quote, CornerDownLeft, Plus, Users, Settings, Clock, User, Briefcase,
  Wrench, FileSearch, EyeOff, History, Trash2, AlertCircle, Send, CheckCircle2, Siren, Terminal,
  FileLock, Bot, BrainCircuit, Loader2, Workflow, Server, Cpu, Layers, Code2,
  GitBranch, PlayCircle, PlusCircle, Save, Network, Boxes, ExternalLink, RefreshCw, Key, ToggleLeft, ToggleRight,
  MoreHorizontal, Edit3, FileCheck, ZoomIn, ZoomOut, Download, Printer, ChevronLeft, PanelLeftClose, PanelLeftOpen,
  Paperclip, Mic, ThumbsUp, ThumbsDown, Copy, Check, ShieldCheck, ListChecks, Info, Languages, LineChart, FileAudio,
  Activity, ShieldAlert, FolderKanban, ChevronDown, LogOut
} from "lucide-react";

function cn(...classes) { return classes.filter(Boolean).join(" "); }

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-md border border-transparent",
    ghost: "hover:bg-slate-100 hover:text-slate-900 text-slate-600 transition-colors",
    securePrimary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-900/20 border border-blue-500",
    secureGhost: "hover:bg-slate-800 hover:text-blue-400 text-slate-400",
    agentPrimary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-900/20 border border-transparent",
    agentGhost: "hover:bg-indigo-50 text-indigo-700",
    outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm",
  };
  const sizes = { default: "h-10 px-4 py-2 text-[14px]", sm: "h-8 rounded-md px-3 text-[12px]", icon: "h-9 w-9" };
  return (
    <button
      className={cn("inline-flex items-center justify-center rounded-lg font-semibold transition-all focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]", variants[variant], sizes[size], className)}
      ref={ref} {...props}
    />
  );
});

const Badge = ({ className, variant = "default", children }) => {
  const variants = {
    default: "bg-slate-100 text-slate-700 border border-slate-200",
    outline: "border border-slate-200 text-slate-600",
    secure: "bg-blue-900/40 text-blue-400 border border-blue-800",
    agent: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    success: "bg-green-50 text-green-700 border border-green-200",
  };
  return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase", variants[variant], className)}>{children}</span>;
};

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={cn("fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-bold z-50 border backdrop-blur-md", type === "success" ? "bg-slate-900/90 text-white border-slate-700" : "bg-red-900/90 text-white border-red-700")}>
      {type === "success" ? <CheckCircle2 className="w-5 h-5 text-blue-400" /> : <AlertCircle className="w-5 h-5" />}
      {message}
    </div>
  );
};

/* ---------- MOCK DATA ---------- */
const fileContents = {
  f1: { title: "3. 과업지시서.pdf", date: "2026.01 업로드 | AI활용 초혁신 추진반", fullText: `한국가스기술공사 생성형 AI 플랫폼 구축 사업 과업지시서\nI 사업 개요\n1. 사업명: 한국가스기술공사 생성형 AI 플랫폼 구축 사업\n2. 사업기간 : 계약체결일 ~ '26. 7. 31.\n3. 사업금액 : 429,000천원(VAT별도)\nII 사업 범위\n1. 목표시스템 구성도\n- 내부 웹 UI(망분리, 인터넷 차단)\n- 통합 애플리케이션 서버: ① 로컬 LLM 서비스 ② 로컬 RAG & 데이터 ③ 에이전트 코어\nIII 세부 요구사항\n1. 기능 요구사항 (SFR-006)\n- 지능형 질의 응답 기능 제공: 사용자의 문장 형태 및 질의의 맥락을 파악하여 적절한 자료 요약 제공\n- 문서 사전 검토 기능 제공: 사용자가 업로드하는 문서의 내용을 관련 규정에 비추어 검토\n- 문서 생성 기능 제공: 문서 요약 기능 및 한국어/영어/중국어/일본어 등 번역 제공\n2. 다중 응답 모드 제공 (SFR-011)\n- 사용자 선택에 따른 여러 종류의 응답 모드 제공\n * 직접 응답 모드: 내부 LLM만 활용한 즉각적 응답 제공\n * 지식 참조 모드: RAG 파이프라인을 통한 내부 문서 참조 응답 제공`, highlights: ["사업금액 : 429,000천원(VAT별도)", "내부 웹 UI(망분리, 인터넷 차단)", "지능형 질의 응답 기능 제공", "문서 사전 검토 기능 제공"] },
  f2: { title: "[대외비] 평택기지_가스설비_유지보수_지침.pdf", date: "2025.11.20 업로드 | 정비기술처", fullText: `[평택 LNG 생산기지 설비 유지보수 표준 지침]\n제2장 주요 설비별 정비 주기\n2.1. 초저온 안전밸브 (PSV - Pressure Safety Valve)\n - 초저온 안전밸브(PSV)는 관계 법령 및 사내 규정에 따라 1년 주기로 분해 점검(Overhaul) 및 작동 시험(POP Test)을 실시하여야 한다.\n - BOG 벤팅 밸브는 3년 주기로 정밀 진단을 수행한다.\n제3장 안전 유의사항\n3.1. 작업 전 조치사항\n - LNG 저장탱크 상부는 -162℃의 초저온 가스가 상존할 우려가 있으므로, 작업자는 반드시 방열복 및 보안면 등 규정된 안전장구를 착용해야 한다.`, highlights: ["1년 주기로 분해 점검(Overhaul) 및 작동 시험(POP Test)을 실시하여야 한다."] }
};
const uploadedFiles = [
  { id: "f1", name: "3. 과업지시서.pdf", size: "1.4 MB", type: "업로드", date: "2026.01.15", tag: "문서", drm: true, ocr: true },
  { id: "f2", name: "[대외비] 평택기지_설비_지침.pdf", size: "3.2 MB", type: "업로드", date: "2025.11.20", tag: "문서", drm: true, ocr: false },
  { id: "f3", name: "KOGAS_취업규칙(2025개정).hwp", size: "2.1 MB", type: "내부망연동", date: "2026.02.10", tag: "규정", drm: false, ocr: false }
];
const mcpTools = [
  { id: "t1", name: "KOGAS_사내_지식_검색망", type: "벡터 DB", status: "활성", desc: "공사 내부 규정(사규, 지침 등) 시맨틱 검색 엔진", endpoint: "/api/rag/search", auth: "내부망" },
  { id: "t2", name: "DRM_자동_복호화_모듈", type: "보안 모듈", status: "활성", desc: "업로드 문서 파싱 전 암호화 해제 (공사 SSO/EAM 연동)", endpoint: "Local_DRM", auth: "인가됨" },
  { id: "t3", name: "Vision_OCR_엔진", type: "모듈", status: "활성", desc: "스캔된 PDF 및 이미지 내 텍스트/표 데이터 추출", endpoint: "Local_OCR", auth: "없음" },
];
const llmModels = [
  { id: "m1", name: "GPT-OSS 120B", type: "구축형(On-Premise)", status: "가동 중", desc: "고성능 내부망 전용 대형 오픈소스 모델 (기본값)", context: "128K", security: "보안 높음" },
  { id: "m2", name: "Llama-3-Korean 70B", type: "구축형(On-Premise)", status: "가동 중", desc: "빠른 추론 및 에이전트 워크플로우 제어용", context: "32K", security: "보안 높음" },
  { id: "m3", name: "EXAONE 3.0 78B", type: "구축형(On-Premise)", status: "가동 중", desc: "사내 규정 및 지식 검색(RAG) 특화 모델", context: "32K", security: "보안 높음" },
  { id: "m4", name: "Claude 3.5 Sonnet", type: "API (Cloud)", status: "외부망 차단", desc: "클라우드 기반 모델 (망분리 환경에서 접근 불가)", context: "200K", security: "보안 낮음" },
];
const finalAgentTeams = [
  { id: "agent-1", name: "사규 기반 문서 사전 검토 에이전트", desc: "사용자가 업로드한 보고서나 기안문을 사내 규정 및 법령에 비추어 검토하고, 보완이 필요한 부분을 발췌하여 답변합니다. (SFR-006 반영)", icon: <FileCheck className="w-5 h-5 text-indigo-600" />, color: "bg-indigo-50 border-indigo-100", workflow: [{ step: 1, role: "문서 파싱", name: "DRM & OCR 전처리기", action: "업로드 문서 텍스트화", tool: "DRM_자동_복호화_모듈", prompt: "사용자가 업로드한 파일의 DRM을 해제하고 표와 텍스트를 마크다운으로 추출하십시오." }, { step: 2, role: "규정 검색", name: "규정/지침 검색기", action: "문서 내용 관련 사규 검색", tool: "KOGAS_사내_지식_검색망", prompt: "추출된 문서의 핵심 키워드(예: 예산, 안전, 휴가)를 바탕으로 사내 지식망에서 관련 규정을 검색하십시오." }, { step: 3, role: "대조 검토", name: "위반사항 검토기", action: "업로드 문서와 사규 대조", tool: "해당 없음", prompt: "업로드된 문서의 내용과 검색된 사규를 대조하여, 규정 위반 소지가 있거나 보완이 필요한 부분을 찾아 링크와 함께 제안하십시오." }] },
  { id: "agent-2", name: "다국어 문서 번역 및 요약 에이전트", desc: "길고 복잡한 문서나 외국어(영/중/일 등) 기술 문서를 원하는 글자 수로 요약하거나 지정된 언어로 번역합니다. (SFR-006 반영)", icon: <Languages className="w-5 h-5 text-indigo-600" />, color: "bg-indigo-50 border-indigo-100", workflow: [{ step: 1, role: "문맥 파악", name: "의미단위 청킹기", action: "문서를 의미 단위로 분할", tool: "해당 없음", prompt: "번역/요약 전 문서를 문맥이 끊기지 않는 의미 단위(Semantic Chunking)로 분할하십시오." }, { step: 2, role: "요약/번역", name: "다국어 LLM 엔진", action: "지정된 언어로 번역 및 요약", tool: "해당 없음", prompt: "사용자가 요청한 언어와 글자 수 제약에 맞추어 분할된 텍스트를 정확하게 번역 및 요약하십시오." }, { step: 3, role: "포맷팅", name: "최종 검수기", action: "가독성 높은 형태로 출력", tool: "해당 없음", prompt: "결과물을 공기업 표준 문서체에 맞게 다듬고, 불릿 포인트 등을 활용해 가독성 높게 출력하십시오." }] },
  { id: "agent-3", name: "보고서 템플릿 자동 작성 에이전트", desc: "단순 텍스트나 데이터를 사내 표준 템플릿(주간 실적, 장애 보고 등) 양식에 맞춰 완결성 있는 문서로 자동 생성합니다. (SFR-013 반영)", icon: <FileText className="w-5 h-5 text-indigo-600" />, color: "bg-indigo-50 border-indigo-100", workflow: [{ step: 1, role: "양식 로드", name: "템플릿 검색기", action: "사내 양식 불러오기", tool: "KOGAS_사내_지식_검색망", prompt: "요청된 보고서 종류에 맞는 사내 표준 템플릿 구조를 불러오십시오." }, { step: 2, role: "정보 매핑", name: "데이터 정제기", action: "내용 분류 및 매핑", tool: "해당 없음", prompt: "주어진 데이터를 분석하여 템플릿의 각 목차에 알맞게 배치하십시오." }, { step: 3, role: "최종 생성", name: "보고서 포맷터", action: "공문서 스타일 완성", tool: "해당 없음", prompt: "매핑된 데이터를 공문서 개조식 문장으로 다듬어 출력하십시오." }] }
];
const suggestions = {
  GENERAL: [
    { icon: <Search className="w-4 h-4 text-blue-600" />, title: "과업지시서 사업비 조회", desc: "업로드된 '과업지시서.pdf'에서 이 사업의 총 예산과 사업 기간을 알려줘" },
    { icon: <Database className="w-4 h-4 text-blue-600" />, title: "RAG 기반 정비 주기 검색", desc: "지식망을 검색해서 평택기지 '초저온 안전밸브'의 점검 주기를 찾아줘" },
  ],
  SECURE: [
    { icon: <ShieldAlert className="w-4 h-4 text-red-400" />, title: "개인정보/비밀번호 스캔", desc: "업로드된 문서 내에 평문으로 노출된 패스워드나 개인 식별 정보가 있는지 검사해줘" },
    { icon: <Lock className="w-4 h-4 text-blue-400" />, title: "망분리 규정 확인", desc: "과업지시서 내용 중 '망분리' 및 외부 인터넷 차단과 관련된 보안 요건을 요약해줘" },
  ],
  AGENT: [
    { icon: <FileCheck className="w-4 h-4 text-indigo-500" />, title: "문서 사전 검토 (규정 대조)", desc: "업로드된 휴가 신청 기안문을 취업규칙(2025개정)에 비추어 위반 소지가 없는지 검토해줘" },
    { icon: <Languages className="w-4 h-4 text-indigo-500" />, title: "유지보수 지침 번역", desc: "평택기지 안전 유의사항 부분을 영문으로 번역하고 200자로 요약해줘" },
    { icon: <FileText className="w-4 h-4 text-indigo-500" />, title: "주간 실적 보고서 작성", desc: "현재의 과업지시서 분석 내역을 사내 주간보고 템플릿에 맞춰 작성해줘" },
  ]
};
const projectList = [
  { id: "p1", name: "AI활용 초혁신 추진반 (현재)", icon: <Briefcase className="w-4 h-4" /> },
  { id: "p2", name: "정비기술처 안전 매뉴얼", icon: <Wrench className="w-4 h-4" /> },
  { id: "p3", name: "정보보안 실태조사 TF", icon: <ShieldCheck className="w-4 h-4" /> }
];

/* ---------- MAIN ADMIN CHAT COMPONENT ---------- */
const AdminChatApp = ({ onSwitchToUser }) => {
  const [mode, setMode] = useState("GENERAL");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [toast, setToast] = useState(null);
  const [ragMode, setRagMode] = useState(true);
  const [activeProject, setActiveProject] = useState("p1");
  const [selectedAgent, setSelectedAgent] = useState(finalAgentTeams[0]);
  const [activeLLM, setActiveLLM] = useState(llmModels[0]);
  const [showLLMDropdown, setShowLLMDropdown] = useState(false);
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [builderTab, setBuilderTab] = useState("WORKFLOW");
  const [selectedNode, setSelectedNode] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [rightPanelView, setRightPanelView] = useState("DASHBOARD");
  const [activeCitation, setActiveCitation] = useState(null);

  const readerContentRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const llmDropdownRef = useRef(null);

  const isSecure = mode === "SECURE";
  const isAgent = mode === "AGENT";

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping, mode]);
  useEffect(() => { setMessages([]); setRightPanelOpen(true); setRightPanelView("DASHBOARD"); if (mode === "AGENT" && !selectedAgent) setSelectedAgent(finalAgentTeams[0]); }, [mode, activeProject]);
  useEffect(() => {
    if (isSecure && activeLLM.security === "보안 낮음") { setActiveLLM(llmModels[0]); setToast({ message: "보안 모드: 로컬 LLM으로 자동 전환되었습니다.", type: "error" }); }
  }, [isSecure, activeLLM]);
  useEffect(() => {
    if (rightPanelView === "READER" && activeCitation && readerContentRef.current) {
      setTimeout(() => { readerContentRef.current.querySelector("mark")?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 300);
    }
  }, [rightPanelView, activeCitation]);
  useEffect(() => {
    const h = (e) => { if (llmDropdownRef.current && !llmDropdownRef.current.contains(e.target)) setShowLLMDropdown(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleModeSwitch = (m) => { setMode(m); setToast({ message: `${m === "SECURE" ? "보안(망분리)" : m === "AGENT" ? "에이전트" : "일반"} 모드로 전환되었습니다.` }); };
  const handleProjectSwitch = (id) => { setActiveProject(id); setToast({ message: `[${projectList.find(p => p.id === id)?.name}] 프로젝트로 이동했습니다.` }); };
  const handleRagToggle = () => { const n = !ragMode; setRagMode(n); setToast({ message: `[SFR-011] ${n ? "지식 참조 모드(RAG)" : "직접 응답 모드(LLM Only)"}로 변경되었습니다.` }); };

  const processResponse = (text) => {
    setIsTyping(true);
    const q = text.toLowerCase();
    setTimeout(() => {
      let r = { id: Date.now() + 1, role: "assistant", createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), content: "", citations: [], agentSteps: [] };
      if (!ragMode && !isAgent && !isSecure) {
        r.content = `[직접 응답 모드]\n\n**${activeLLM.name}** 모델 자체 학습 정보로만 답변합니다.\n정확한 사내 근거를 원하시면 '지식 참조 모드(RAG)'를 켜주세요.`;
      } else if (!isAgent && !isSecure && ragMode && (q.includes("과업지시서") || q.includes("예산") || q.includes("기간") || q.includes("사업비"))) {
        r.content = `**[RAG 지식 기반 답변]**\n\n업로드된 **'3. 과업지시서.pdf'** 기준:\n\n- **사업명**: 한국가스기술공사 생성형 AI 플랫폼 구축 사업\n- **사업 기간**: 계약체결일 ~ 2026년 7월 31일\n- **사업 금액**: **429,000천원 (VAT별도)**`;
        r.citations = [{ id: "f1", name: "3. 과업지시서.pdf", type: "문서", page: 1, similarity: 99 }];
      } else if (!isAgent && !isSecure && ragMode && (q.includes("안전밸브") || q.includes("정비") || q.includes("주기"))) {
        r.content = `**[RAG 지식 기반 답변]**\n\n**'평택기지_가스설비_유지보수_지침.pdf'** 기준:\n- **초저온 안전밸브(PSV)**: **1년 주기** 분해 점검(Overhaul) 및 작동 시험(POP Test) 실시`;
        r.citations = [{ id: "f2", name: "가스설비_유지보수_지침.pdf", type: "대외비", page: 4, similarity: 96 }];
      } else if (isSecure && (q.includes("망분리") || q.includes("차단") || q.includes("보안"))) {
        r.content = `**[보안 규정 검토 완료]**\n\n과업지시서 스캔 결과: **내부 웹 UI(망분리, 인터넷 차단)** 환경 구축이 핵심 요건입니다. 외부와 격리된 로컬 LLM 서버 구축 필요.`;
        r.citations = [{ id: "f1", name: "3. 과업지시서.pdf", type: "문서", page: 2, similarity: 98 }];
      } else if (isSecure && (q.includes("개인정보") || q.includes("패스워드") || q.includes("스캔"))) {
        r.content = `**[보안 위험 탐지 및 마스킹 처리 완료]**\n\n현재 문서들에서 평문 노출 패스워드는 미발견. 향후 문서 업로드 시 주민등록번호, 연락처, 계정 정보를 자동 마스킹(***)하여 벡터 DB에 안전하게 적재합니다. (SFR-002, SFR-012)`;
      } else if (isAgent && selectedAgent.id === "agent-1") {
        r.content = `**[사규 기반 문서 사전 검토 결과]**\n\n✅ **준수 사항**: 내부 업무망 연동(DRM/SSO) 및 로컬 LLM 망분리 보안 규정 준수\n\n⚠️ **보완 권고**: 외주 인력 사내망 접근 시 보안서약서 징구 및 PC 물리적 통제 조항(사규 제42조) 추가 필요`;
        r.agentSteps = [{ status: "완료", label: "문서 파싱: DRM_자동_복호화_모듈 구동 - 과업지시서 텍스트 완전 추출" }, { status: "완료", label: "규정 검색: KOGAS_사내_지식_검색망 - 보안 규정 및 하도급 지침 검색" }, { status: "완료", label: "대조 검토: 규정 위반 소지 분석 및 보완점 발췌 완료" }];
      } else if (isAgent && selectedAgent.id === "agent-2") {
        r.content = `**[다국어 번역 및 요약 완료]**\n\n**[English Summary]**\nSafety Precaution (LNG Storage Tank):\nWorkers must wear prescribed safety gear (thermal suits, face shields) as ultra-low temperature gas (-162℃) exists at the top of the LNG tanks.`;
        r.agentSteps = [{ status: "완료", label: "문맥 파악: Semantic Chunking 적용" }, { status: "완료", label: "요약/번역: 로컬 LLM 호출 - 한영 번역 및 200자 요약" }, { status: "완료", label: "포맷팅: 마크다운 렌더링 완료" }];
      } else {
        r.content = isSecure ? `[망분리 보안 구역] ${activeLLM.name} 구동 중. 업로드 문서 보안 점검을 지시해 주세요.` : (isAgent ? `${selectedAgent.name}가 실행 대기 중입니다. 지시를 내려주세요.` : "한국가스기술공사 통합 지식 플랫폼입니다. 과업지시서나 정비 지침에 대해 질문해 주세요.");
      }
      setIsTyping(false);
      setMessages(prev => [...prev, r]);
      if (r.citations?.length > 0 && !isAgent && !rightPanelOpen) setRightPanelOpen(true);
    }, 1500);
  };

  const handleSend = (text = null) => {
    const t = text || input;
    if (!t.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), role: "user", content: t, createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setInput("");
    processResponse(t);
  };

  const handleCitationClick = (citation) => { setRightPanelOpen(true); setRightPanelView("READER"); setActiveCitation(citation); };

  const renderReaderContent = () => {
    if (!activeCitation) return null;
    const fd = fileContents[activeCitation.id];
    if (!fd) return <div className="flex flex-col items-center justify-center h-full text-slate-400"><FileText className="w-16 h-16 mb-4 opacity-30" /><p>미리보기 미지원 파일입니다.</p></div>;
    const parts = [], matches = [];
    const { fullText, highlights } = fd;
    let ci = 0;
    if (highlights) highlights.forEach(h => { const i = fullText.indexOf(h); if (i !== -1) matches.push({ start: i, end: i + h.length }); });
    matches.sort((a, b) => a.start - b.start);
    matches.forEach((m, i) => {
      if (m.start > ci) parts.push(<span key={`t${i}`}>{fullText.substring(ci, m.start)}</span>);
      parts.push(<mark key={`m${i}`} className={cn("px-1 rounded font-bold", isSecure ? "bg-blue-900/60 text-blue-300 border-b-2 border-blue-500" : "bg-yellow-200 text-slate-900 shadow-sm")}>{fullText.substring(m.start, m.end)}</mark>);
      ci = m.end;
    });
    if (ci < fullText.length) parts.push(<span key="end">{fullText.substring(ci)}</span>);
    return (
      <div className={cn("whitespace-pre-wrap leading-8 text-[15px] font-serif tracking-wide", isSecure ? "text-slate-300" : "text-slate-700")}>
        <h1 className={cn("text-2xl font-black mb-3 pb-3 border-b-2", isSecure ? "text-slate-100 border-slate-700" : "text-slate-900 border-slate-200")}>{fd.title}</h1>
        <div className={cn("text-xs mb-8 flex items-center gap-2", isSecure ? "text-slate-400" : "text-slate-500")}><Clock className="w-3.5 h-3.5" /> {fd.date}</div>
        {parts}
      </div>
    );
  };

  const th = {
    appBg: isSecure ? "bg-[#040814]" : "bg-slate-50/50",
    sidebarBg: isSecure ? "bg-[#0a0f1c] border-r border-slate-800/60" : "bg-white border-r border-slate-200 shadow-sm z-30",
    headerBg: isSecure ? "bg-[#0a0f1c]/90 backdrop-blur-md border-b border-slate-800 text-slate-100" : "bg-white/90 backdrop-blur-md border-b border-slate-200 text-slate-900",
    panelBg: isSecure ? "bg-[#0a0f1c] border-l border-slate-800/60" : "bg-white border-l border-slate-200 shadow-sm z-30",
    panelText: isSecure ? "text-slate-200" : "text-slate-900",
  };

  return (
    <div className={cn("flex flex-col h-screen w-full font-sans transition-all duration-500", th.appBg)}
      style={{ fontFamily: "'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif" }}
    >
      {isSecure && (
        <div className="w-full h-8 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 text-blue-200 flex items-center justify-center text-[11px] font-black tracking-[0.4em] uppercase z-50 shrink-0 border-b border-blue-800">
          <ShieldAlert className="w-4 h-4 mr-2 text-red-400 animate-pulse" /> 내부망 보안 구역 — 망분리 (인터넷 차단) 적용됨
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {/* LEFT SIDEBAR */}
        <aside className={cn("shrink-0 flex flex-col transition-all duration-300 relative", th.sidebarBg, sidebarOpen ? "w-[260px]" : "w-[76px]")}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={cn("absolute -right-3.5 top-20 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-md z-40 text-slate-500 hover:text-blue-600 transition-colors", isSecure && "bg-[#1e293b] border-slate-700 text-slate-300")}>
            {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>
          <div className={cn("h-16 flex items-center px-5 border-b shrink-0", isSecure ? "border-slate-800/60" : "border-slate-100")}>
            <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-inner", isSecure ? "bg-blue-600" : isAgent ? "bg-indigo-600" : "bg-blue-600", "text-white")}>
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M12 2L21.5 9.5H2.5L12 2Z" fill="white" fillOpacity="0.95"/>
                <rect x="2.5" y="9.5" width="19" height="12.5" rx="0.5" fill="white" fillOpacity="0.95"/>
                <line x1="2.5" y1="14" x2="21.5" y2="14" stroke="rgba(0,30,100,0.18)" strokeWidth="0.5"/>
                <rect x="4.5" y="10.5" width="3.5" height="2.8" rx="0.35" fill="rgba(0,30,100,0.38)"/>
                <rect x="10.25" y="10.5" width="3.5" height="2.8" rx="0.35" fill="rgba(0,30,100,0.38)"/>
                <rect x="16" y="10.5" width="3.5" height="2.8" rx="0.35" fill="rgba(0,30,100,0.38)"/>
                <rect x="4.5" y="15" width="3.5" height="2.8" rx="0.35" fill="rgba(0,30,100,0.38)"/>
                <rect x="16" y="15" width="3.5" height="2.8" rx="0.35" fill="rgba(0,30,100,0.38)"/>
                <rect x="10.25" y="15" width="3.5" height="7" rx="0.5" fill="rgba(0,30,100,0.42)"/>
              </svg>
            </div>
            {sidebarOpen && (
              <div className="ml-3 flex flex-col justify-center animate-in fade-in duration-300">
                <span className={cn("text-[15px] font-black tracking-tight", isSecure ? "text-slate-100" : "text-slate-900")}>한국부동산원 AI</span>
                <span className={cn("text-[10px] font-bold tracking-wide", isSecure ? "text-blue-400" : isAgent ? "text-indigo-600" : "text-blue-600")}>
                  {isSecure ? "보안 샌드박스" : isAgent ? "관리자 · Agent 포털" : "관리자 · 로컬 AI 플랫폼"}
                </span>
              </div>
            )}
          </div>

          <div className={cn("p-4 border-b", isSecure ? "border-slate-800/60" : "border-slate-100", !sidebarOpen && "flex justify-center")}>
            {sidebarOpen ? (
              <div className={cn("p-1 rounded-xl flex gap-1 shadow-inner", isSecure ? "bg-[#040814] border border-slate-800" : "bg-slate-100/80")}>
                {["GENERAL", "AGENT", "SECURE"].map(m => (
                  <button key={m} onClick={() => handleModeSwitch(m)} className={cn("flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-bold rounded-lg transition-all",
                    mode === m ? (m === "GENERAL" ? "bg-white text-blue-700 shadow-sm" : m === "AGENT" ? "bg-indigo-600 text-white shadow-sm" : "bg-blue-900/50 text-blue-400 border border-blue-800/50") : (isSecure ? "text-slate-500 hover:text-slate-300" : "text-slate-500 hover:text-slate-700"))}>
                    {m === "GENERAL" ? <MessageSquare className="w-4 h-4" /> : m === "AGENT" ? <Bot className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                    {m === "GENERAL" ? "일반" : m === "AGENT" ? "에이전트" : "보안"}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {["GENERAL", "AGENT", "SECURE"].map(m => (
                  <button key={m} onClick={() => handleModeSwitch(m)} title={m} className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                    mode === m ? (m === "GENERAL" ? "bg-blue-50 text-blue-600" : m === "AGENT" ? "bg-indigo-600 text-white" : "bg-blue-900/50 text-blue-400 border border-blue-800/50") : (isSecure ? "text-slate-500 hover:bg-slate-800" : "text-slate-400 hover:bg-slate-100"))}>
                    {m === "GENERAL" ? <MessageSquare className="w-5 h-5" /> : m === "AGENT" ? <Bot className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto py-2 custom-scrollbar flex flex-col">
            {sidebarOpen && (
              <div className="px-4 mt-3 mb-2">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">지식 영역(WorkSpace)</div>
                <div className="space-y-1">
                  {projectList.map(p => (
                    <button key={p.id} onClick={() => handleProjectSwitch(p.id)} className={cn("w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all border",
                      activeProject === p.id ? (isSecure ? "bg-blue-900/30 text-blue-400 border-blue-800/50 shadow-sm" : "bg-blue-50 text-blue-700 border-blue-100 shadow-sm") : (isSecure ? "text-slate-400 hover:bg-[#040814] border-transparent" : "text-slate-500 hover:bg-slate-100 border-transparent"))}>
                      {p.icon}<span className="truncate">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {sidebarOpen && <div className={cn("h-px mx-4 my-2", isSecure ? "bg-slate-800" : "bg-slate-200")} />}

            {isSecure ? (
              <div className="px-5 flex flex-col items-center justify-center flex-1 text-center space-y-4 mt-4">
                {sidebarOpen ? (
                  <>
                    <div className="w-16 h-16 bg-[#040814] rounded-full flex items-center justify-center text-blue-500 border-2 border-slate-800 shadow-lg relative">
                      <div className="absolute inset-0 rounded-full border border-blue-500/30 animate-ping"></div>
                      <Lock className="w-7 h-7 text-blue-400" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-[14px] font-black text-blue-400">망분리 보호 적용</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-medium">이 세션 데이터는 인터넷으로<br />절대 전송되지 않습니다.</p>
                    </div>
                  </>
                ) : <Lock className="w-6 h-6 text-blue-500 mt-4" />}
              </div>
            ) : (
              <div className="px-3 flex-1 overflow-y-auto custom-scrollbar">
                {sidebarOpen && <div className="mb-3 px-3 text-[11px] font-black text-slate-400 uppercase tracking-wider flex justify-between items-center mt-2"><span>최근 대화</span><button className="hover:text-blue-600 bg-slate-100 p-1 rounded-md transition-colors"><Plus className="w-3.5 h-3.5" /></button></div>}
                <div className="space-y-1">
                  {(isAgent ? ["다국어 번역 테스트", "사규 검토 에이전트 세션", "주간보고서 생성"] : ["과업지시서 사업 요건 질의", "초저온 밸브 정비주기", "망분리 환경 구축 방안"]).map((chat, i) => (
                    <button key={i} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all text-left group", isSecure ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-white hover:shadow-sm")}>
                      {isAgent ? <Workflow className="w-4 h-4 shrink-0 text-indigo-400" /> : <MessageSquare className="w-4 h-4 shrink-0 text-slate-400" />}
                      {sidebarOpen && <span className="truncate">{chat}</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User/Portal Switch */}
          <div className={cn("p-4 border-t space-y-2", isSecure ? "border-slate-800/60 bg-[#0a0f1c]" : "border-slate-100 bg-slate-50/50")}>
            {onSwitchToUser && sidebarOpen && (
              <button onClick={onSwitchToUser} className={cn("w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all border", isSecure ? "border-slate-700 bg-[#040814] text-blue-400 hover:bg-[#1e293b]" : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100")}>
                <LogOut className="w-4 h-4" /><span>사용자 포털로 전환</span>
              </button>
            )}
            <div className={cn("flex items-center gap-3 p-2.5 rounded-xl cursor-pointer border transition-colors", isSecure ? "border-slate-800 hover:bg-[#1e293b] bg-[#040814]" : "border-slate-200 bg-white hover:border-blue-300 shadow-sm")}>
              <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0 border", isSecure ? "bg-[#0a0f1c] border-slate-700 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-500")}>
                <User className="w-5 h-5" />
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <div className={cn("text-[13px] font-bold truncate", isSecure ? "text-slate-200" : "text-slate-800")}>관리자 (Admin)</div>
                  <div className={cn("text-[10px] font-medium truncate mt-0.5", isSecure ? "text-blue-400 font-mono" : "text-slate-500")}>{isSecure ? "접근 권한: 인가됨" : "AI활용 초혁신 추진반"}</div>
                </div>
              )}
              {sidebarOpen && <Settings className={cn("w-4 h-4", isSecure ? "text-slate-500" : "text-slate-400")} />}
            </div>
          </div>
        </aside>

        {/* CENTER */}
        <main className="flex-1 flex flex-col relative min-w-0 z-10 overflow-hidden bg-transparent">
          <header className={cn("shrink-0 h-16 flex items-center justify-between px-6 transition-colors z-20", th.headerBg)}>
            <div className="flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border", isSecure ? "bg-blue-900/30 text-blue-400 border-blue-800/50" : isAgent ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-blue-50 text-blue-600 border-blue-100")}>
                {isSecure ? <FileLock className="w-5 h-5" /> : isAgent ? <Bot className="w-5 h-5" /> : <Database className="w-5 h-5" />}
              </div>
              <div className="flex flex-col">
                <h2 className={cn("text-[15px] font-black flex items-center gap-2", isSecure ? "text-slate-100" : "text-slate-900")}>
                  {isSecure ? "보안 샌드박스 환경" : isAgent ? "생성형 AI 에이전트 포털" : "한국가스기술공사 사내 지식 검색망"}
                  {isSecure && <Badge variant="secure">망분리 구역</Badge>}
                  <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50 text-[9px]">관리자 모드</Badge>
                </h2>
                <span className={cn("text-[11px] font-medium", isSecure ? "text-slate-400 font-mono" : "text-slate-500")}>
                  {isAgent ? "문서 사전 검토, 요약/번역 자동화 워크플로우" : isSecure ? "로컬 LLM을 통한 기밀 데이터 유출 방지" : "사규, 매뉴얼 등 RAG 기반 지능형 질의응답"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={cn("hidden sm:flex items-center gap-4 px-4 py-1.5 rounded-full border text-[11px] font-bold", isSecure ? "bg-[#040814] border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-600 shadow-sm")}>
                <div className="flex items-center gap-1.5"><Activity className={cn("w-3.5 h-3.5", isSecure ? "text-blue-500" : "text-green-500")} /><span>Model: {activeLLM.name.split(" ")[0]}</span></div>
                <div className="w-px h-3 bg-slate-300 opacity-50"></div>
                <div className="flex items-center gap-1.5"><Network className={cn("w-3.5 h-3.5", isSecure ? "text-blue-500" : "text-green-500")} /><span>{isSecure ? "망분리 (로컬)" : "내부망 구축형"}</span></div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => setRightPanelOpen(!rightPanelOpen)} className={cn("rounded-xl border-2", isSecure ? "text-slate-400 hover:bg-[#1e293b] border-slate-700" : "text-slate-500 hover:bg-slate-100 border-slate-200 bg-white shadow-sm")}>
                {rightPanelOpen ? <SidebarClose className="w-5 h-5" /> : <SidebarOpen className="w-5 h-5" />}
              </Button>
            </div>
          </header>

          <div className="flex-1 flex flex-col overflow-hidden relative w-full h-full">
            {isSecure && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-[0.02] z-0 overflow-hidden select-none">
                <div className="text-[140px] font-black text-blue-400 transform -rotate-12 tracking-widest whitespace-nowrap">AIR GAPPED</div>
                <div className="text-[140px] font-black text-blue-400 transform -rotate-12 tracking-widest whitespace-nowrap mt-10">LOCAL RAG</div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-4 sm:px-12 py-8 custom-scrollbar relative z-10">
              <div className="max-w-4xl mx-auto pb-4 min-h-full flex flex-col justify-end">
                {messages.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center pb-20 animate-in fade-in duration-500">
                    <div className="mb-10 text-center space-y-4">
                      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-6 border-2", isSecure ? "bg-[#0a0f1c] border-slate-700/50 text-blue-400" : isAgent ? "bg-white border-indigo-100 text-indigo-600" : "bg-white border-blue-100 text-blue-600")}>
                        {isSecure ? <ShieldCheck className="w-8 h-8" /> : isAgent ? <BrainCircuit className="w-8 h-8" /> : <Sparkles className="w-8 h-8" />}
                      </div>
                      <h3 className={cn("text-3xl font-black tracking-tight", isSecure ? "text-slate-100" : "text-slate-800")}>
                        {isSecure ? "기밀 데이터 보안 및 마스킹" : isAgent ? "지능형 업무지원 에이전트" : "KOGAS-Tech 로컬 RAG 시스템"}
                      </h3>
                      <p className={cn("text-[15px] max-w-lg mx-auto leading-relaxed font-medium", isSecure ? "text-slate-400" : "text-slate-500")}>
                        {isSecure ? "개인정보나 비밀번호가 포함된 대외비 문서를 안전하게 필터링하고 분석합니다." : isAgent ? "과업지시서 기반으로 구성된 문서 검토, 요약/번역 특화 에이전트입니다." : "사내 규정, 정비 매뉴얼 등을 벡터 DB로 구축하여 정확한 출처와 함께 답변합니다."}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                      {(isSecure ? suggestions.SECURE : isAgent ? suggestions.AGENT : suggestions.GENERAL).map((card, i) => (
                        <button key={i} onClick={() => handleSend(card.desc)} className={cn("p-5 rounded-2xl text-left transition-all border-2 group relative overflow-hidden flex flex-col justify-between min-h-[120px]", isSecure ? "bg-[#0a0f1c]/50 border-slate-800 hover:border-blue-700" : "bg-white border-slate-100 hover:border-blue-400 hover:shadow-lg")}>
                          <div className="flex items-center gap-3 mb-3">
                            <div className={cn("p-2 rounded-xl shadow-sm", isSecure ? "bg-[#040814] text-blue-400 border border-slate-800" : isAgent ? "bg-indigo-50 text-indigo-600" : "bg-blue-50 text-blue-600")}>{card.icon}</div>
                            <span className={cn("font-bold text-[15px] group-hover:text-blue-700 tracking-tight", isSecure ? "text-slate-200 group-hover:text-blue-400" : "text-slate-800")}>{card.title}</span>
                          </div>
                          <div className={cn("text-[13px] pl-1 font-medium leading-relaxed", isSecure ? "text-slate-400" : "text-slate-500")}>{card.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m) => (
                  <div key={m.id} className={cn("flex w-full mb-8", m.role === "user" ? "justify-end" : "justify-start animate-in slide-in-from-bottom-2 fade-in duration-300")}>
                    <div className={cn("flex max-w-[85%] gap-4", m.role === "user" ? "flex-row-reverse" : "flex-row")}>
                      <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-1 shadow-md border-2", m.role === "user" ? (isSecure ? "bg-blue-900 text-blue-200 border-blue-800" : "bg-white border-slate-200 text-slate-500") : (isSecure ? "bg-[#0a0f1c] text-blue-400 border-slate-700" : isAgent ? "bg-indigo-600 text-white border-indigo-700" : "bg-blue-600 text-white border-blue-700"))}>
                        {m.role === "user" ? <User className="w-5 h-5" /> : isAgent ? <Bot className="w-6 h-6" /> : isSecure ? <ShieldCheck className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                      </div>
                      <div className="flex flex-col gap-2 min-w-0 flex-1 group">
                        {m.role !== "user" && m.agentSteps?.length > 0 && (
                          <div className={cn("mb-2 rounded-2xl border p-4 shadow-sm", isSecure ? "bg-[#0a0f1c]/80 border-slate-700" : "bg-indigo-50/50 border-indigo-100")}>
                            <div className={cn("flex items-center gap-2 mb-4 text-[13px] font-black uppercase tracking-wider", isSecure ? "text-blue-400" : "text-indigo-700")}><Workflow className="w-4 h-4" /><span>에이전트 코어 파이프라인 작동 (SFR-006)</span></div>
                            <div className="space-y-5 relative pl-3">
                              <div className={cn("absolute left-[19px] top-3 bottom-6 w-0.5", isSecure ? "bg-slate-700" : "bg-indigo-200")}></div>
                              {m.agentSteps.map((step, idx) => (
                                <div key={idx} className="flex items-start gap-4 relative z-10">
                                  <div className={cn("w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 shadow-sm", isSecure ? "bg-[#040814] border-slate-600" : "bg-white border-indigo-200")}>
                                    <CheckCircle2 className={cn("w-5 h-5", isSecure ? "text-blue-400" : "text-indigo-600")} />
                                  </div>
                                  <div className="mt-1 flex-1">
                                    <p className={cn("text-[13px] font-bold mb-0.5", isSecure ? "text-slate-200" : "text-slate-800")}>{step.label.split(":")[0]}</p>
                                    <p className={cn("text-[12px] font-medium leading-relaxed", isSecure ? "text-slate-400" : "text-slate-600")}>{step.label.includes(":") ? step.label.split(":")[1] : ""}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className={cn("px-6 py-4 text-[15px] leading-relaxed shadow-sm rounded-2xl whitespace-pre-wrap font-medium", m.role === "user" ? (isSecure ? "bg-slate-800 text-slate-100 rounded-tr-sm border border-slate-700" : "bg-blue-50 text-slate-900 rounded-tr-sm border border-blue-100") : (isSecure ? "bg-[#0a0f1c] border border-slate-700 text-slate-300 rounded-tl-sm shadow-lg" : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-md"))}>
                          {m.content}
                        </div>
                        {m.role !== "user" && (
                          <div className="flex items-center gap-2 mt-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className={cn("p-1.5 rounded-lg transition-colors", isSecure ? "text-slate-500 hover:text-blue-400 hover:bg-slate-800" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100")}><ThumbsUp className="w-4 h-4" /></button>
                            <button className={cn("p-1.5 rounded-lg transition-colors", isSecure ? "text-slate-500 hover:text-blue-400 hover:bg-slate-800" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100")}><ThumbsDown className="w-4 h-4" /></button>
                            <button className={cn("p-1.5 rounded-lg transition-colors", isSecure ? "text-slate-500 hover:text-blue-400 hover:bg-slate-800" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100")} onClick={() => { navigator.clipboard.writeText(m.content); setToast({ message: "클립보드에 복사되었습니다." }); }}><Copy className="w-4 h-4" /></button>
                          </div>
                        )}
                        {m.role !== "user" && m.citations?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {m.citations.map((cite, idx) => (
                              <button key={idx} onClick={() => handleCitationClick(cite)} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12px] font-bold border-2 transition-all hover:shadow-md", isSecure ? "bg-[#0a0f1c] border-slate-700 text-slate-300 hover:border-blue-500 hover:text-blue-400" : "bg-white border-slate-100 text-slate-600 hover:border-blue-400 hover:text-blue-700")}>
                                <div className={cn("w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black", isSecure ? "bg-[#040814] text-blue-400 border border-slate-700" : "bg-blue-50 text-blue-600 border border-blue-100")}>{idx + 1}</div>
                                <span className="truncate max-w-[180px]">{cite.name}</span>
                                {cite.page && <span className={cn("text-[10px]", isSecure ? "text-slate-500" : "text-slate-400")}>{cite.page}p</span>}
                                <span className={cn("text-[10px] px-1.5 rounded font-mono", isSecure ? "bg-slate-800 text-blue-400" : "bg-green-100 text-green-700")}>{cite.type} 연동</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center gap-3 ml-14 mb-4">
                    <Loader2 className={cn("w-5 h-5 animate-spin", isSecure ? "text-blue-500" : "text-slate-400")} />
                    <span className={cn("text-[13px] font-bold", isSecure ? "text-slate-400 font-mono" : "text-slate-500")}>{isAgent ? "에이전트가 단계를 수행하고 있습니다..." : "로컬 모델 추론 및 문서 검색 중..."}</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="shrink-0 px-6 pb-8 pt-2 z-40 min-h-0 relative">
              <div className="max-w-4xl mx-auto relative flex flex-col gap-3">
                {!isAgent && !isSecure && (
                  <div className="flex items-center justify-end gap-2 mb-1 px-2">
                    <span className="text-[12px] font-bold text-slate-500">SFR-011 지식 참조 (RAG) 모드</span>
                    <button onClick={handleRagToggle} className={cn("transition-colors", ragMode ? "text-blue-600" : "text-slate-400")}>
                      {ragMode ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                    </button>
                  </div>
                )}
                <div className="flex items-end gap-3 w-full">
                  <div className={cn("flex-1 relative rounded-2xl border-2 shadow-lg flex flex-col transition-colors", isSecure ? "bg-[#0a0f1c] border-slate-700 focus-within:border-blue-500" : "bg-white border-slate-200 focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-400")}>
                    <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                      placeholder={isSecure ? "보안 샌드박스: 업로드된 문서의 취약점이나 개인정보 마스킹을 지시하세요." : isAgent ? "선택된 에이전트에게 지시를 내려주세요 (문서 검토, 요약/번역 등)." : "사내 규정이나 업로드된 '과업지시서'에 대해 질문하세요."}
                      className={cn("w-full bg-transparent border-none p-5 pb-3 resize-none focus:ring-0 text-[15px] font-medium min-h-[72px] outline-none placeholder:text-slate-400 rounded-2xl", isSecure ? "text-slate-200" : "text-slate-900")} rows={1} />
                    <div className="flex justify-between items-center px-3 pb-3">
                      <div className="flex items-center gap-1.5">
                        <input type="file" className="hidden" ref={fileInputRef} onChange={() => setToast({ message: "파일 업로드 완료. (DRM 해제 및 OCR 처리 중)" })} />
                        <Button size="icon" variant="ghost" className={cn("h-10 w-10 rounded-xl", isSecure ? "text-slate-400 hover:text-blue-400 hover:bg-[#040814]" : "")} onClick={() => fileInputRef.current.click()}><Paperclip className="w-5 h-5" /></Button>
                        <Button size="icon" variant="ghost" className={cn("h-10 w-10 rounded-xl", isSecure ? "text-slate-400 hover:text-blue-400 hover:bg-[#040814]" : "")}><Mic className="w-5 h-5" /></Button>
                      </div>
                      <div className="flex items-center gap-2 mr-1" ref={llmDropdownRef}>
                        <div className="relative">
                          <button onClick={() => setShowLLMDropdown(!showLLMDropdown)} className={cn("flex items-center gap-2.5 px-4 py-2 rounded-xl border-2 text-[12px] font-bold transition-all shadow-sm h-10", isSecure ? "bg-[#040814] border-slate-700 text-blue-400 hover:border-blue-500" : "bg-white border-slate-200 text-indigo-700 hover:border-indigo-300")}>
                            <Cpu className="w-4 h-4" /><span className="hidden sm:inline">{activeLLM.name.split(" ")[0]}</span><ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", showLLMDropdown && "rotate-180")} />
                          </button>
                          {showLLMDropdown && (
                            <div className={cn("absolute bottom-full mb-3 right-0 w-[300px] rounded-2xl border-2 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95", isSecure ? "bg-[#0a0f1c] border-slate-700" : "bg-white border-slate-200")}>
                              <div className={cn("px-4 py-3 border-b-2 text-[11px] font-black tracking-wider uppercase", isSecure ? "border-slate-800 text-slate-500" : "border-slate-100 text-slate-500")}>로컬 오픈소스 모델 선택</div>
                              <div className="flex flex-col max-h-[300px] overflow-y-auto custom-scrollbar">
                                {llmModels.map(model => (
                                  <button key={model.id} onClick={() => { if (isSecure && model.security === "보안 낮음") { setToast({ message: "망분리 환경에서는 클라우드 모델 사용 불가.", type: "error" }); return; } setActiveLLM(model); setShowLLMDropdown(false); setToast({ message: `LLM 모델이 [${model.name}]으로 변경되었습니다.` }); }}
                                    className={cn("text-left px-4 py-3.5 flex items-start gap-3 transition-colors border-b last:border-0", isSecure ? "border-slate-800" : "border-slate-50", activeLLM.id === model.id ? (isSecure ? "bg-slate-800/80" : "bg-indigo-50/80") : (isSecure ? "hover:bg-slate-800/50" : "hover:bg-slate-50"), isSecure && model.security === "보안 낮음" && "opacity-50 cursor-not-allowed")}>
                                    <Cpu className={cn("w-4 h-4 mt-0.5", activeLLM.id === model.id ? (isSecure ? "text-blue-400" : "text-indigo-600") : (isSecure ? "text-slate-500" : "text-slate-400"))} />
                                    <div className="flex flex-col">
                                      <div className={cn("text-[13px] font-black flex items-center gap-2 mb-1", isSecure ? "text-slate-200" : "text-slate-700")}>{model.name}{activeLLM.id === model.id && <CheckCircle2 className={cn("w-3.5 h-3.5", isSecure ? "text-blue-400" : "text-indigo-600")} />}{isSecure && model.security === "보안 낮음" && <Lock className="w-3 h-3 text-red-500" />}</div>
                                      <div className={cn("text-[11px] font-medium leading-relaxed", isSecure ? "text-slate-400" : "text-slate-500")}>{model.desc}</div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => handleSend()} variant={isSecure ? "securePrimary" : isAgent ? "agentPrimary" : "default"} className="rounded-xl px-6 h-[72px] flex flex-col items-center gap-1 text-[13px]">
                    <Send className="w-5 h-5" /><span>전송</span>
                  </Button>
                </div>
              </div>
              <div className="text-center mt-3 max-w-4xl mx-auto">
                <p className={cn("text-[11px] font-bold tracking-wide", isSecure ? "text-slate-500 font-mono" : "text-slate-400")}>
                  {isSecure ? "✓ 외부망 연결 철저 차단됨. 입력된 기밀 데이터는 외부로 유출되지 않습니다." : "AI가 생성한 답변은 사규와 다를 수 있으므로 원문을 반드시 참조하시기 바랍니다."}
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT PANEL */}
        <aside className={cn("shrink-0 border-l transition-all duration-300 flex flex-col relative z-20 shadow-[-5px_0_15px_rgba(0,0,0,0.05)]", th.panelBg, rightPanelOpen ? "w-[420px]" : "w-0 overflow-hidden opacity-0")}>
          <div className={cn("h-16 flex items-center justify-between px-6 border-b shrink-0", isSecure ? "border-slate-800/60" : "border-slate-100")}>
            {rightPanelView === "READER" && activeCitation ? (
              <div className="flex items-center gap-3 w-full pr-4 animate-in fade-in">
                <button onClick={() => setRightPanelView("DASHBOARD")} className={cn("p-2 rounded-xl shrink-0 transition-colors", isSecure ? "hover:bg-[#1e293b] text-blue-400 bg-[#040814]" : "hover:bg-slate-200 text-slate-600 bg-slate-100")}><ChevronLeft className="w-5 h-5" /></button>
                <div className="flex-1 min-w-0">
                  <h3 className={cn("text-[14px] font-black truncate", th.panelText)}>{activeCitation.name}</h3>
                  <p className={cn("text-[11px] font-medium mt-0.5", isSecure ? "text-slate-400" : "text-slate-500")}>원본 문서 뷰어</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 animate-in fade-in">
                {isAgent ? <ListChecks className={cn("w-5 h-5", isSecure ? "text-blue-400" : "text-indigo-600")} /> : <FolderOpen className={cn("w-5 h-5", isSecure ? "text-blue-400" : "text-blue-600")} />}
                <h3 className={cn("text-[15px] font-black", th.panelText)}>{isAgent ? "과업지시서 요구 에이전트 (SFR-006)" : "RAG 연동 대상 문서 (SFR-005)"}</h3>
              </div>
            )}
            <button onClick={() => setRightPanelOpen(false)} className={cn("p-2 rounded-xl shrink-0 transition-colors", isSecure ? "hover:bg-[#1e293b] text-slate-400" : "hover:bg-slate-100 text-slate-500")}><X className="w-5 h-5" /></button>
          </div>

          <div className={cn("flex-1 overflow-y-auto custom-scrollbar relative", isSecure ? "bg-[#040814]" : "bg-slate-50/30")}>
            {rightPanelView === "READER" ? (
              <div className="flex flex-col h-full">
                <div className={cn("h-12 border-b flex items-center justify-end px-5 gap-3 shrink-0", isSecure ? "bg-[#0a0f1c] border-slate-800" : "bg-white border-slate-200 shadow-sm")}>
                  <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                    <button className={cn("p-1.5 rounded-md", isSecure ? "hover:bg-slate-800 text-slate-400" : "hover:bg-white text-slate-600")}><ZoomOut className="w-4 h-4" /></button>
                    <span className={cn("text-xs font-bold px-2 w-12 text-center", isSecure ? "text-slate-300" : "text-slate-600")}>100%</span>
                    <button className={cn("p-1.5 rounded-md", isSecure ? "hover:bg-slate-800 text-slate-400" : "hover:bg-white text-slate-600")}><ZoomIn className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar" ref={readerContentRef}>
                  <div className={cn("max-w-[210mm] mx-auto shadow-xl rounded-sm min-h-full p-[15mm] sm:p-[20mm] border", isSecure ? "bg-[#0a0f1c] border-slate-800" : "bg-white border-slate-200")}>
                    {renderReaderContent()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6">
                {isAgent ? (
                  <div className="space-y-6 animate-in fade-in">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className={cn("text-[12px] font-black uppercase tracking-wider", isSecure ? "text-slate-400" : "text-slate-500")}>적용 에이전트 목록</h4>
                        <Badge variant="agent">총 3개</Badge>
                      </div>
                      <div className="space-y-3">
                        {finalAgentTeams.map(agent => (
                          <div key={agent.id} onClick={() => setSelectedAgent(agent)} className={cn("p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-3 relative", selectedAgent?.id === agent.id ? (isSecure ? "bg-[#0a0f1c] border-blue-500 shadow-md" : "bg-white border-indigo-500 shadow-md") : (isSecure ? "bg-[#0a0f1c]/50 border-slate-800 hover:border-slate-600" : "bg-white border-slate-100 hover:border-indigo-200 hover:shadow-sm"))}>
                            {selectedAgent?.id === agent.id && <div className={cn("absolute right-4 top-4 w-2.5 h-2.5 rounded-full animate-pulse", isSecure ? "bg-blue-500" : "bg-indigo-500")}></div>}
                            <div className="flex items-start gap-3">
                              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 shadow-sm", selectedAgent?.id === agent.id ? (isSecure ? "bg-[#040814] border-blue-500/50" : agent.color) : (isSecure ? "bg-[#040814] border-slate-800" : "bg-slate-50 border-transparent"))}>{agent.icon}</div>
                              <div className="flex-1 mt-0.5">
                                <h4 className={cn("font-bold text-[14px] mb-1", isSecure ? "text-slate-100" : "text-slate-800")}>{agent.name}</h4>
                                <p className={cn("text-xs leading-relaxed line-clamp-2", isSecure ? "text-slate-400" : "text-slate-500")}>{agent.desc}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={cn("p-5 rounded-2xl border-2 shadow-sm relative overflow-hidden", isSecure ? "bg-[#0a0f1c] border-slate-800" : "bg-slate-50 border-slate-200")}>
                      <div className={cn("absolute top-0 left-0 w-1 h-full", isSecure ? "bg-blue-500" : "bg-indigo-500")}></div>
                      <div className="flex items-center gap-2 mb-3">
                        <Info className={cn("w-4 h-4", isSecure ? "text-blue-400" : "text-indigo-600")} />
                        <h4 className={cn("text-[13px] font-black", isSecure ? "text-slate-200" : "text-slate-800")}>선택된 에이전트 상세</h4>
                      </div>
                      <p className={cn("text-[12px] mb-5 leading-relaxed font-medium", isSecure ? "text-slate-400" : "text-slate-600")}>{selectedAgent?.desc}</p>
                      <Button onClick={() => setShowBuilderModal(true)} variant={isSecure ? "securePrimary" : "outline"} className={cn("w-full h-10 text-[13px]", !isSecure && "border-indigo-200 text-indigo-700 hover:bg-indigo-50")}>
                        <Workflow className="w-4 h-4 mr-2" /> 워크플로우 (내부 동작) 보기
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className={cn("text-[12px] font-black uppercase tracking-wider", isSecure ? "text-slate-400" : "text-slate-500")}>사내 문서 (RAG 적재 완료)</h4>
                        <span className="text-[10px] text-green-600 bg-green-100 px-2 py-1 rounded-md font-bold border border-green-200">VectorDB 연결됨</span>
                      </div>
                      <div className="space-y-3">
                        {uploadedFiles.map((file, i) => (
                          <div key={i} className={cn("flex flex-col gap-2 p-4 rounded-2xl border-2 cursor-pointer group transition-all", isSecure ? "bg-[#0a0f1c]/50 border-slate-800 hover:border-blue-700 shadow-sm" : "bg-white border-slate-100 hover:border-blue-300 shadow-md")}>
                            <div className="flex items-center gap-4">
                              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 shadow-sm", isSecure ? "bg-[#040814] text-blue-400 border-slate-700" : "bg-blue-50 text-blue-600 border-white")}>
                                {file.tag === "규정" ? <Library className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={cn("text-[13px] font-bold truncate mb-1 group-hover:text-blue-600 transition-colors", isSecure ? "text-slate-200 group-hover:text-blue-400" : "text-slate-800")}>{file.name}</div>
                                <div className="text-[11px] flex items-center gap-2 font-medium">
                                  <span className={isSecure ? "text-slate-500 font-mono" : "text-slate-400"}>{file.size}</span>
                                  <span className="text-slate-300">|</span>
                                  <span className={isSecure ? "text-slate-500" : "text-slate-400"}>{file.date}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 ml-14">
                              {file.drm && <span className="text-[9px] bg-blue-100 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-bold">DRM 자동해제</span>}
                              {file.ocr && <span className="text-[9px] bg-purple-100 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded font-bold">OCR 적용</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={cn("h-px", isSecure ? "bg-slate-800" : "bg-slate-200")} />
                    <div>
                      <h4 className={cn("text-[12px] font-black uppercase tracking-wider mb-4", isSecure ? "text-slate-400" : "text-slate-500")}>{isSecure ? "보안 스캔 지시" : "빠른 분석 질문"}</h4>
                      <div className="space-y-3">
                        {(isSecure ? suggestions.SECURE : suggestions.GENERAL).map((t, i) => (
                          <button key={i} onClick={() => handleSend(t.desc)} className={cn("w-full text-left p-4 rounded-xl text-[13px] font-bold transition-colors flex items-center justify-between group border-2 shadow-sm", isSecure ? "bg-[#0a0f1c] text-slate-300 border-slate-800 hover:border-blue-600 hover:text-blue-200" : "bg-white text-slate-700 border-slate-100 hover:border-blue-300 hover:text-blue-700")}>
                            <span>{t.title}</span>
                            <ArrowRight className={cn("w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity", isSecure ? "text-blue-400" : "text-blue-600")} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* AGENT MODAL */}
      {showBuilderModal && selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className={cn("w-full max-w-6xl h-[85%] rounded-3xl shadow-2xl flex flex-col overflow-hidden border-2", isSecure ? "bg-[#040814] border-slate-700" : "bg-slate-50 border-slate-200")}>
            <div className={cn("h-20 border-b flex items-center justify-between px-8 shrink-0", isSecure ? "bg-[#0a0f1c] border-slate-800" : "bg-white border-slate-200")}>
              <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-md border-2", isSecure ? "bg-[#040814] border-blue-800 text-blue-400" : "bg-indigo-50 border-indigo-100 text-indigo-600")}>{selectedAgent.icon}</div>
                <div>
                  <h3 className={cn("text-xl font-black", isSecure ? "text-slate-100" : "text-slate-800")}>{selectedAgent.name} 내부 로직 (읽기 전용)</h3>
                  <p className={cn("text-[13px] font-medium mt-1", isSecure ? "text-slate-400" : "text-slate-500")}>관리자가 사전 구성한 에이전트 내부 동작 단계입니다.</p>
                </div>
              </div>
              <button onClick={() => setShowBuilderModal(false)} className={cn("p-2.5 rounded-xl transition-colors border", isSecure ? "hover:bg-slate-800 text-slate-400 border-slate-700" : "hover:bg-slate-100 text-slate-500 border-slate-200")}><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-1 flex overflow-hidden">
              <div className={cn("w-64 border-r p-6 shrink-0 flex flex-col gap-2", isSecure ? "bg-[#0a0f1c]/50 border-slate-800" : "bg-white border-slate-200")}>
                {["WORKFLOW", "TOOLS"].map(tab => (
                  <button key={tab} onClick={() => setBuilderTab(tab)} className={cn("w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[14px] font-bold transition-all text-left border-2", builderTab === tab ? (isSecure ? "bg-[#040814] text-blue-400 border-blue-800 shadow-md" : "bg-indigo-50 text-indigo-700 shadow-sm border-indigo-200") : (isSecure ? "border-transparent text-slate-400 hover:bg-[#0a0f1c]" : "border-transparent text-slate-500 hover:bg-slate-50"))}>
                    {tab === "WORKFLOW" ? <Network className="w-5 h-5" /> : <Boxes className="w-5 h-5" />}
                    {tab === "WORKFLOW" ? "에이전트 파이프라인" : "연동 가능 사내 도구"}
                  </button>
                ))}
              </div>
              <div className={cn("flex-1 overflow-y-auto p-10 custom-scrollbar", isSecure ? "bg-[#040814]" : "bg-slate-50")}>
                {builderTab === "WORKFLOW" && (
                  <div className="max-w-5xl mx-auto animate-in fade-in">
                    <h4 className={cn("text-2xl font-black mb-8", isSecure ? "text-slate-100" : "text-slate-800")}>내부 처리 단계 (프롬프트 체인)</h4>
                    <div className="flex gap-8">
                      <div className={cn("flex-1 rounded-3xl border-2 p-10 shadow-sm", isSecure ? "bg-[#0a0f1c] border-slate-800" : "bg-white border-slate-200")}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                          {selectedAgent.workflow.map((node, i) => (
                            <div key={i} onClick={() => setSelectedNode(node)} className={cn("rounded-2xl border-2 shadow-md p-6 flex flex-col gap-4 relative cursor-pointer transition-all hover:-translate-y-1", selectedNode === node ? (isSecure ? "border-blue-500 ring-4 ring-blue-900/50 bg-[#040814]" : "border-indigo-500 ring-4 ring-indigo-100 bg-white") : (isSecure ? "border-slate-700 bg-[#0a0f1c] hover:border-blue-500/50" : "border-slate-200 bg-white hover:border-indigo-300"))}>
                              <span className={cn("text-[11px] font-black px-3 py-1.5 rounded-lg w-fit", isSecure ? "bg-slate-800 text-blue-400" : "bg-slate-100 text-indigo-600")}>{node.step}단계</span>
                              <div>
                                <div className={cn("text-[13px] font-bold mb-1", isSecure ? "text-blue-400" : "text-indigo-600")}>{node.role}</div>
                                <div className={cn("text-lg font-black", isSecure ? "text-slate-100" : "text-slate-800")}>{node.name}</div>
                              </div>
                              <div className={cn("text-[13px] p-3.5 rounded-xl border leading-relaxed line-clamp-3 font-medium", isSecure ? "bg-[#040814] border-slate-700 text-slate-400" : "bg-slate-50 border-slate-100 text-slate-600")}>{node.prompt}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {selectedNode && (
                        <div className={cn("w-[360px] rounded-3xl border-2 shadow-xl p-6 flex flex-col animate-in slide-in-from-right-8", isSecure ? "bg-[#0a0f1c] border-slate-700" : "bg-white border-slate-200")}>
                          <div className={cn("flex justify-between items-center mb-6 border-b pb-4", isSecure ? "border-slate-800" : "border-slate-100")}>
                            <h5 className={cn("text-lg font-black", isSecure ? "text-slate-100" : "text-slate-800")}>세부 단계 정보</h5>
                            <button onClick={() => setSelectedNode(null)} className="p-1.5 rounded-lg hover:bg-slate-100"><X className="w-5 h-5 text-slate-400" /></button>
                          </div>
                          <div className="space-y-6 flex-1 overflow-y-auto">
                            {[["하위 에이전트 역할", selectedNode.name], ["사전 지시어 (시스템 프롬프트)", selectedNode.prompt], ["호출하는 사내 시스템 연동 (MCP)", selectedNode.tool]].map(([label, val], ii) => (
                              <div key={ii}>
                                <span className={cn("text-[12px] font-bold uppercase tracking-wider block mb-2", isSecure ? "text-slate-500" : "text-slate-500")}>{label}</span>
                                <div className={cn("w-full border-2 rounded-xl p-3.5 text-[14px] font-medium whitespace-pre-wrap leading-relaxed", ii === 2 ? (isSecure ? "bg-[#040814] border-blue-900/50 text-blue-400" : "bg-indigo-50 border-indigo-100 text-indigo-700") : (isSecure ? "bg-[#040814] border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"))}>
                                  {ii === 2 && <Wrench className="w-4 h-4 inline mr-2" />}{val}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {builderTab === "TOOLS" && (
                  <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in">
                    <div>
                      <h4 className={cn("text-2xl font-black", isSecure ? "text-slate-100" : "text-slate-800")}>연동 가능한 사내 보안 도구</h4>
                      <p className={cn("text-[15px] font-medium mt-2", isSecure ? "text-slate-400" : "text-slate-500")}>관리자가 인가한 사내 시스템 연동(MCP) 목록입니다.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {mcpTools.map(tool => (
                        <div key={tool.id} className={cn("p-6 rounded-3xl border-2 shadow-sm", isSecure ? "bg-[#0a0f1c] border-slate-800" : "bg-white border-slate-200")}>
                          <div className="flex items-center gap-5">
                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 shadow-sm", isSecure ? "bg-[#040814] text-blue-400 border-slate-700" : "bg-indigo-50 text-indigo-600 border-indigo-100")}>
                              {tool.type === "벡터 DB" ? <Database className="w-6 h-6" /> : <Server className="w-6 h-6" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1.5">
                                <h4 className={cn("font-black text-lg", isSecure ? "text-slate-200" : "text-slate-800")}>{tool.name}</h4>
                                <Badge variant={isSecure ? "secure" : "outline"}>{tool.type}</Badge>
                              </div>
                              <p className={cn("text-[14px] font-medium", isSecure ? "text-slate-400" : "text-slate-500")}>{tool.desc}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChatApp;
