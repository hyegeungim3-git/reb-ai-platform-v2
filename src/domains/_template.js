/**
 * 도메인 팩 템플릿 — 새 도메인 추가 시 이 파일을 복사해 <도메인id>.js 로 저장하고 전 필드를 채운다.
 * 작성 규칙·품질 기준: docs/DOMAIN-PACK-GUIDE.md  /  검수: docs/QUALITY-CHECKLIST.md §B
 * 완성 후 반드시 src/domains/index.js 에 등록할 것 (import + DOMAINS + DOMAIN_LIST 3곳).
 * 이 템플릿 파일 자체는 레지스트리에 등록하지 않는다.
 */
import { Briefcase, Database, ShieldCheck, Search, Globe, BookOpen, FileText } from "lucide-react";

const template = {
  /* ===== 필수 (누락 시 화면 깨짐) ===== */
  id: "template",                       // 영소문자 고유값. localStorage·React key
  orgName: "조직명",
  orgShort: "ORG",                      // 영문 약칭 2~4자
  platformTitle: "조직명 AI 플랫폼",
  brandColor: "#334155",                // 기존 팩(#003087/#0F766E/#166534)과 다르게
  welcome: "조직명 생성형 AI 플랫폼에 오신 것을 환영합니다.",
  statusBadge: "시스템 정상 가동 중 · 로컬 LLM · 내부망 전용 · 망분리 적용",
  footerNote: "조직명 생성형 AI 전환 사업 (연계시스템 데모)",
  userFeatures: [
    "도메인 핵심업무 질의 (RAG)",
    "도메인 문서 OCR 판독",
    "도메인 데이터 자연어 조회",
    "다국어 번역 (한/영/중/일)",
  ],
  user: { name: "홍길동", dept: "핵심부서명", title: "직급" },
  workspaces: [
    { id: "ws1", name: "AI 혁신 TF", icon: Briefcase, active: true },
    { id: "ws2", name: "핵심부서 분석반", icon: Database },
    { id: "ws3", name: "보안점검 TF", icon: ShieldCheck },
  ],
  llmModels: [
    // [0]은 반드시 Claude Fable 5 (플래그십, 기본 선택). 구축형 running ≥1 필수. blocked 1개 관례.
    { id: "m0", name: "Claude Fable 5", shortName: "Fable 5", type: "보안 게이트웨이", context: "400K", security: "high", status: "running", desc: "플래그십 최고 성능 모델 — 보안 게이트웨이 경유 (기본값)" },
    { id: "m1", name: "GPT-OSS 120B", shortName: "GPT-OSS", type: "구축형", context: "128K", security: "high", status: "running", desc: "내부망 전용 대형 모델" },
    { id: "m2", name: "Llama-3-Korean 70B", shortName: "Llama-3", type: "구축형", context: "32K", security: "high", status: "running", desc: "에이전트 워크플로우 특화" },
    { id: "m3", name: "EXAONE 3.0 78B", shortName: "EXAONE", type: "구축형", context: "32K", security: "high", status: "running", desc: "규정·지식 검색(RAG) 특화" },
    { id: "m4", name: "Gemini 2.5 Pro", shortName: "Gemini", type: "API(Cloud)", context: "1M", security: "low", status: "blocked", desc: "미인증 클라우드 모델 — 보안 정책으로 차단" },
  ],

  /* ===== 선택 (생략 시 REB 기본값 노출 — 데모용 팩은 전부 작성) ===== */
  suggestions: [
    // 4개. 이 중 2개 이상은 아래 sampleAnswers.keywords와 매칭되게 query를 구성
    { icon: Search,   iconBg: "bg-slate-50",  iconColor: "text-slate-600",  title: "핵심규정 검색", query: "핵심 규정의 ○○ 기준을 알려줘" },
    { icon: Globe,    iconBg: "bg-blue-50",   iconColor: "text-blue-600",   title: "데이터 조회",   query: "지난달 ○○ 실적과 전월 대비 변동을 알려줘" },
    { icon: BookOpen, iconBg: "bg-violet-50", iconColor: "text-violet-600", title: "내규 확인",     query: "취업규칙상 ○○ 요건을 정리해줘" },
    { icon: FileText, iconBg: "bg-orange-50", iconColor: "text-orange-600", title: "이력 조회",     query: "최근 ○○ 처리 이력을 정리해줘" },
  ],
  sampleAnswers: [
    // 최소 2개 — suggestions 4개 중 2개 이상의 query와 keywords가 매칭돼야 한다.
    // keywords는 소문자·핵심 명사만 (질의가 toLowerCase()로 비교됨). citations는 빈 배열 유지.
    // ○○는 반드시 도메인 실제 용어로 교체할 것 (아래 keywords는 위 suggestions의 query 단어와 이미 짝이 맞춰져 있음).
    {
      keywords: ["기준", "규정"],   // ← suggestions[0] "핵심 규정의 ○○ 기준을 알려줘"와 매칭
      answer: {
        content: "**○○ 기준** (○○규정 제N조, 2026.01 개정 기준)\n\n- 항목 1: 구체 수치\n- 항목 2: 구체 기한\n\n※ 출처: ○○규정 제N조, N페이지",
        citations: [], steps: null,
      },
    },
    {
      keywords: ["실적", "변동"],   // ← suggestions[1] "지난달 ○○ 실적과 전월 대비 변동…"과 매칭
      answer: {
        content: "**○○ 실적 요약** (내부 시스템 집계, 기간 명시)\n\n| 구분 | 이번 달 | 지난달 | 변동 |\n|---|---|---|---|\n| 항목 A | 수치 | 수치 | ▲/▼ |\n\n변동 원인 한 줄 분석.\n\n※ 출처: ○○ 시스템 월간 리포트",
        citations: [], steps: null,
      },
    },
  ],
  modeDesc: {
    GENERAL: "도메인 규정, 업무 절차, 지침에 대해 자유롭게 질문하세요",
  },
  // 지도 인텔리전스 — GENERAL 채팅에서 지역 질의 시 히트맵+시계열 카드 삽입 (생략 시 기능 비활성).
  // 매칭 규칙: metricKeywords 중 1개 + (regions[].keywords 또는 wideKeywords 중 1개) 동시 포함.
  // suggestions 4번째를 지도 질의로 구성하는 것이 관례 (클릭 시 바로 시연 가능해야 함).
  mapIntel: {
    metricLabel: "○○ 지표명",           // 예: "표준지 공시지가 변동률"
    unit: "%",                           // 값 단위 (%, 건 등)
    regionUnit: "지역",                  // 지역 단위 명칭 (시도/사업장/행정동)
    periodLabel: "2026년 ○월 기준",
    sourceSystem: "○○ 시스템",          // 처리 단계에 표기될 집계 시스템명 (도메인 시스템 재사용)
    sourceNote: "※ 출처: ○○ 통계 (시뮬레이션 데이터)",   // '시뮬레이션' 표기는 유지할 것
    mapTitle: "○○ 히트맵",
    chartTitle: "월별 추이",
    metricKeywords: ["지표어1", "지표어2"],          // 소문자 (질의가 toLowerCase()로 비교됨)
    wideKeywords: ["지역별", "전체", "지도"],        // 전체(광역) 질의 트리거
    heatLow: "#E2E8F0", heatHigh: "#0F172A",         // 밝은색→어두운색 (어두운 타일엔 흰 글자 자동 적용)
    avgLabel: "전체 평균",
    seriesLabels: ["1월", "2월", "3월"],             // 시계열 X축 라벨 (모든 series와 길이 일치)
    avgSeries: [0, 0, 0],                            // 평균선 — 마지막 값 ≈ regions value 평균이어야 자연스럽다
    grid: { cols: 4, rows: 3 },                      // 타일 좌표계 크기
    regions: [
      // 7~17개. x/y는 실제 지리 배치를 근사한 타일 좌표 (0-based, grid 범위 내)
      { id: "r1", name: "지역명", keywords: ["지역명"], x: 0, y: 0, value: 0,
        series: [0, 0, 0], insight: "이 지역의 수치를 설명하는 도메인 언어 1~2문장 (원인·전망 포함)." },
    ],
  },
  agentCatalog: {
    // 10개 전부 작성. key 오타는 조용히 무시되므로 아래 목록에서 복사할 것.
    "agent-chatbot":      { name: "업무 Q&A 챗봇", shortName: "업무 Q&A", desc: "…을 RAG 기반으로 근거와 함께 즉시 답변합니다." },
    "agent-report":       { name: "보고서 작성 에이전트", shortName: "보고서 작성", desc: "…" },
    "agent-meeting":      { name: "회의록 작성 에이전트", shortName: "회의록 작성", desc: "…" },
    "agent-knowledge":    { name: "지식 검색 에이전트", shortName: "지식 검색", desc: "…" },
    "agent-internalreg":  { name: "내규 조회 에이전트", shortName: "내규 조회", desc: "…" },
    "agent-ocr":          { name: "문서 OCR 에이전트", shortName: "OCR", desc: "…" },
    "agent-dbquery":      { name: "데이터 조회 에이전트", shortName: "DB 조회", desc: "…" },
    "agent-address":      { name: "기준정보 표준화 에이전트", shortName: "표준화", desc: "…" },
    "agent-dataanalysis": { name: "데이터 분석 에이전트", shortName: "데이터 분석", desc: "…" },
    "agent-summary":      { name: "문서 요약 에이전트", shortName: "문서 요약", desc: "…" },
    "agent-translate":    { name: "번역·요약 에이전트", shortName: "번역·요약", desc: "…" },
    "agent-review":       { name: "문서 사전 검토 에이전트", shortName: "문서 검토", desc: "…" },
    "agent-safety":       { name: "안전관리계획 에이전트", shortName: "안전계획", desc: "…" },
  },
  docs: [
    // 3개. secLevel은 C/S/O 하나씩, 3번째는 내규 hwp 관례
    { id: "d1", name: "핵심업무_기준서.pdf", size: "3.0 MB", date: "2026.01.10", tags: ["대외비", "DRM 자동해제"], secLevel: "C" },
    { id: "d2", name: "업무_처리지침.pdf", size: "1.5 MB", date: "2026.01.20", tags: ["OCR 적용"], secLevel: "S" },
    { id: "d3", name: "조직명_취업규칙(2025개정).hwp", size: "2.0 MB", date: "2026.02.10", tags: ["사규"], secLevel: "O" },
  ],
  history: [
    // 5개. mode는 GENERAL/TRANSLATE/REVIEW/REPORT 골고루
    { id: "h1", title: "○○ 기준 문의", mode: "GENERAL", time: "14:30", isToday: true, starred: true },
    { id: "h2", title: "○○ 문서 영문 번역", mode: "TRANSLATE", time: "10:15", isToday: true, starred: false },
    { id: "h3", title: "○○ 기안문 검토", mode: "REVIEW", time: "어제", isToday: false, starred: false },
    { id: "h4", title: "주간 실적 보고서 초안", mode: "REPORT", time: "02.20", isToday: false, starred: true },
    { id: "h5", title: "내규 ○○ 조항 문의", mode: "GENERAL", time: "02.18", isToday: false, starred: false },
  ],
  agentFeed: {
    recent: [
      { agentId: "agent-meeting",      agentName: "회의록 작성", time: "오늘 14:32", result: "ORG-회의록-0312.hwp 생성" },
      { agentId: "agent-knowledge",    agentName: "지식 검색",   time: "오늘 10:15", result: "○○ 기준 5건 검색" },
      { agentId: "agent-dataanalysis", agentName: "데이터 분석", time: "어제 16:44", result: "○○ 현황 분석 완료" },
    ],
    recommendTitle: "○○ 기한 N일 전",
    recommendBody: "지난 ○○와 현행 ○○을 대조 검토하여 변경사항을 확인하시겠습니까?",
    pendingBody: "2026-03-17 ○○부서 정례회의 녹음이 미처리 상태입니다.",
  },
};

export default template;
