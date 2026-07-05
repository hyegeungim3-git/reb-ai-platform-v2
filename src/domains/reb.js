/**
 * 도메인 팩 — 한국부동산원 (기본)
 * 코어 플랫폼은 이 파일의 스키마만 알고, 조직·업무 내용은 전부 여기서 공급한다.
 */
import { Briefcase, Database, ShieldCheck, Search, Globe, BookOpen, FileText } from "lucide-react";

const reb = {
  id: "reb",
  orgName: "한국부동산원",
  orgShort: "REB",
  platformTitle: "한국부동산원 AI 플랫폼",
  brandColor: "#003087",
  welcome: "한국부동산원 생성형 AI 플랫폼에 오신 것을 환영합니다.",
  statusBadge: "시스템 정상 가동 중 · 로컬 LLM · 내부망 전용 · 망분리 적용",
  footerNote: "한국부동산원 생성형 AI 플랫폼 구축 사업 (SFR-006, SFR-011, SFR-013 반영)",
  userFeatures: [
    "일반 질의 (RAG 기반 지식 검색)",
    "문서 사전 검토 (사규 자동 대조)",
    "번역·요약 (한/영/중/일 지원)",
    "보고서 자동 작성 (표준 양식)",
  ],
  user: { name: "김민준", dept: "부동산공시처", title: "과장" },
  workspaces: [
    { id: "ws1", name: "AX센터 AI업무혁신 TF", icon: Briefcase, active: true },
    { id: "ws2", name: "부동산공시처 조사업무반", icon: Database },
    { id: "ws3", name: "정보보안부 보안실태조사 TF", icon: ShieldCheck },
  ],
  llmModels: [
    { id: "m0", name: "Claude Fable 5", shortName: "Fable 5", type: "보안 게이트웨이", context: "400K", security: "high", status: "running", desc: "플래그십 최고 성능 모델 — CSAP 인증 보안 게이트웨이 경유 (기본값)" },
    { id: "m1", name: "GPT-OSS 120B", shortName: "GPT-OSS", type: "구축형", context: "128K", security: "high", status: "running", desc: "고성능 내부망 전용 대형 모델" },
    { id: "m2", name: "Llama-3-Korean 70B", shortName: "Llama-3", type: "구축형", context: "32K", security: "high", status: "running", desc: "빠른 추론 및 에이전트 워크플로우 특화" },
    { id: "m3", name: "EXAONE 3.0 78B", shortName: "EXAONE", type: "구축형", context: "32K", security: "high", status: "running", desc: "사내 규정 및 지식 검색(RAG) 특화" },
    { id: "m4", name: "Gemini 2.5 Pro", shortName: "Gemini", type: "API(Cloud)", context: "1M", security: "low", status: "blocked", desc: "미인증 클라우드 모델 — 망분리 정책으로 차단" },
  ],
  // GENERAL 탭 제안 질의 — null이면 constants.js의 기본 SUGGESTIONS 사용
  suggestions: [
    { icon: Search,   iconBg: "bg-blue-50",   iconColor: "text-blue-600",   title: "공시지가 조사 기준",    query: "표준지공시지가 조사·산정 기준일과 정기 조사 주기가 어떻게 되나요?" },
    { icon: Globe,    iconBg: "bg-green-50",  iconColor: "text-green-600",  title: "AI 사업 예산 조회",    query: "생성형 AI 플랫폼 구축 사업의 총 예산과 사업 기간을 알려주세요." },
    { icon: BookOpen, iconBg: "bg-violet-50", iconColor: "text-violet-600", title: "취업규칙 개정사항",    query: "취업규칙 2025년 개정 내용 중 주요 변경 사항을 요약해줘" },
    { icon: FileText, iconBg: "bg-orange-50", iconColor: "text-orange-600", title: "현장조사 출장비 기준", query: "사내 현장조사 출장비 정산 시 1일 식대·교통비·숙박비 한도 기준이 어떻게 되나요?" },
  ],
  // REB는 기존 AI_RESPONSES 로직을 그대로 사용
  sampleAnswers: null,
  // 에이전트 카탈로그 오버라이드 없음 (constants.js의 AGENT_TEAMS 원본 사용)
  agentCatalog: {},
};

export default reb;
