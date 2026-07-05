/**
 * 도메인 팩 — 공공행정 (한성시청, 가상 지자체)
 * 동일 플랫폼을 지방자치단체 민원·행정 도메인에 맞춰 재구성한 데모 프로파일.
 */
import { Landmark, Users, ShieldCheck, Search, ScrollText, BookOpen, FileText } from "lucide-react";

const civic = {
  id: "civic",
  orgName: "한성시청",
  orgShort: "HSC",
  platformTitle: "한성시 스마트행정 AI 플랫폼",
  brandColor: "#166534",
  welcome: "한성시 스마트행정 생성형 AI 플랫폼에 오신 것을 환영합니다.",
  statusBadge: "시스템 정상 가동 중 · 로컬 LLM · 행정망 전용 · 망분리 적용",
  footerNote: "한성시 지능형 행정혁신 사업 (온나라·새올 연계 데모)",
  userFeatures: [
    "조례·규칙·지침 질의 (RAG)",
    "민원 서류·공문서 OCR 판독",
    "행정 데이터 자연어 조회",
    "다국어 민원 번역 (한/영/중/일)",
  ],
  user: { name: "이서연", dept: "민원여권과", title: "주무관" },
  workspaces: [
    { id: "ws1", name: "민원혁신 TF", icon: Users, active: true },
    { id: "ws2", name: "기획예산과 시정분석반", icon: Landmark },
    { id: "ws3", name: "정보통신과 보안점검 TF", icon: ShieldCheck },
  ],
  llmModels: [
    { id: "m0", name: "Claude Fable 5", shortName: "Fable 5", type: "보안 게이트웨이", context: "400K", security: "high", status: "running", desc: "플래그십 최고 성능 모델 — 행정망 보안 게이트웨이 경유 (기본값)" },
    { id: "m1", name: "GPT-OSS 120B", shortName: "GPT-OSS", type: "구축형", context: "128K", security: "high", status: "running", desc: "행정망 내부 전용 대형 모델" },
    { id: "m2", name: "Llama-3-Korean 70B", shortName: "Llama-3", type: "구축형", context: "32K", security: "high", status: "running", desc: "민원 분류·에이전트 워크플로우 특화" },
    { id: "m3", name: "EXAONE 3.0 78B", shortName: "EXAONE", type: "구축형", context: "32K", security: "high", status: "running", desc: "조례·규정 검색(RAG) 특화" },
    { id: "m4", name: "Gemini 2.5 Pro", shortName: "Gemini", type: "API(Cloud)", context: "1M", security: "low", status: "blocked", desc: "미인증 클라우드 모델 — 행정망 보안 정책으로 차단" },
  ],
  suggestions: [
    { icon: Search,     iconBg: "bg-green-50",  iconColor: "text-green-700",  title: "여권 발급 안내",   query: "긴급 여권 발급 요건과 처리 기한, 필요한 구비서류를 알려줘" },
    { icon: ScrollText, iconBg: "bg-blue-50",   iconColor: "text-blue-600",   title: "조례 검색",       query: "옥외광고물 설치 허가 관련 조례 조항과 허가 절차를 요약해줘" },
    { icon: BookOpen,   iconBg: "bg-violet-50", iconColor: "text-violet-600", title: "복무규정 확인",   query: "지방공무원 복무규정상 유연근무 신청 요건을 정리해줘" },
    { icon: FileText,   iconBg: "bg-orange-50", iconColor: "text-orange-600", title: "민원 통계 조회",  query: "지난달 전입신고 민원 처리 건수와 평균 처리 시간을 알려줘" },
  ],
  modeDesc: {
    GENERAL: "조례·규칙, 민원 처리 절차, 행정 지침에 대해 자유롭게 질문하세요",
  },
  agentFeed: {
    recent: [
      { agentId: "agent-meeting",      agentName: "회의록 작성",  time: "오늘 14:32", result: "HSC-회의록-0312.hwp 생성" },
      { agentId: "agent-knowledge",    agentName: "지식 검색",    time: "오늘 10:15", result: "여권 발급 지침 5건 검색" },
      { agentId: "agent-dataanalysis", agentName: "시정 분석",    time: "어제 16:44", result: "민원 처리 현황 분석 완료" },
    ],
    recommendTitle: "자치법규 정기 정비 기한 12일 전",
    recommendBody: "지난 정비 결과와 현행 조례를 대조 검토하여 개정 필요 조항을 확인하시겠습니까?",
    pendingBody: "2026-03-17 민원여권과 정례회의 녹음이 미처리 상태입니다.",
  },
  history: [
    { id: "h1", title: "긴급 여권 발급 요건 문의", mode: "GENERAL", time: "14:30", isToday: true, starred: true },
    { id: "h2", title: "조례 개정문 영문 번역", mode: "TRANSLATE", time: "10:15", isToday: true, starred: false },
    { id: "h3", title: "보도자료 초안 규정 검토", mode: "REVIEW", time: "어제", isToday: false, starred: false },
    { id: "h4", title: "주간 시정 보고서 초안", mode: "REPORT", time: "02.20", isToday: false, starred: true },
    { id: "h5", title: "복무규정 유연근무 문의", mode: "GENERAL", time: "02.18", isToday: false, starred: false },
  ],
  docs: [
    { id: "d1", name: "민원사무편람_2026.pdf", size: "4.1 MB", date: "2026.01.05", tags: ["대외비", "DRM 자동해제"], secLevel: "C" },
    { id: "d2", name: "옥외광고물_관리조례.pdf", size: "1.2 MB", date: "2025.11.28", tags: ["OCR 적용"], secLevel: "S" },
    { id: "d3", name: "한성시_복무규정(2025개정).hwp", size: "1.8 MB", date: "2026.02.10", tags: ["규정"], secLevel: "O" },
  ],
  sampleAnswers: [
    {
      keywords: ["여권", "발급"],
      answer: {
        content: "**긴급 여권 발급 안내** (여권법 시행령 제14조, 민원편람 2026 기준)\n\n- **대상**: 친족 사망·위독 등 인도적 사유, 긴급 상용 출장 (증빙 필요)\n- **처리 기한**: 접수일 포함 **최대 48시간** (일반 여권은 4~5 근무일)\n- **구비서류**: 여권발급신청서, 여권용 사진 1매, 신분증, **긴급성 증빙서류** (사망진단서·출장명령서 등), 수수료 53,000원 (단수여권)\n- **접수처**: 시청 1층 민원여권과 3~5번 창구 (평일 09:00~18:00)\n\n※ 출처: 민원사무편람 2026 개정판 12페이지, 여권법 시행령 제14조",
        citations: [], steps: null,
      },
    },
    {
      keywords: ["옥외광고", "조례", "허가"],
      answer: {
        content: "**옥외광고물 설치 허가 절차** (한성시 옥외광고물 관리 조례 제7조~제11조)\n\n1. **허가 대상**: 벽면 이용 간판 중 한 변 10m 이상, 지주 이용 간판 4m 초과, 옥상간판 전체\n2. **신청 서류**: 허가신청서, 배치도·디자인 도안, 구조 안전 확인서 (4m 초과 시)\n3. **처리 기한**: 접수일부터 **7 근무일** (보완 요구 시 중단)\n4. **수수료**: 표시면적 기준 산정 (조례 별표 2)\n\n안전점검 대상 광고물은 매년 정기점검 보고 의무가 있습니다 (조례 제18조).\n\n※ 출처: 한성시 옥외광고물 관리 조례 (2025.11 개정), 제7조·별표 2",
        citations: [], steps: null,
      },
    },
  ],
  agentCatalog: {
    "agent-chatbot":      { name: "민원 응대 챗봇", shortName: "민원 응대", desc: "민원 처리 절차, 구비서류, 수수료 등을 법령·편람 근거와 함께 즉시 안내합니다." },
    "agent-report":       { name: "보고서·보도자료 에이전트", shortName: "보고서 작성", desc: "시정 실적과 통계를 집계해 내부 보고서와 보도자료 초안을 표준 서식으로 작성합니다." },
    "agent-meeting":      { name: "회의록 작성 에이전트", shortName: "회의록 작성", desc: "위원회·간담회 녹음을 발언자 구분과 함께 회의록으로 정리하고 의결사항을 추출합니다." },
    "agent-knowledge":    { name: "행정 지식 검색 에이전트", shortName: "지식 검색", desc: "조례, 예규, 업무편람, 감사 사례 등 행정 지식을 시맨틱 검색으로 찾아줍니다." },
    "agent-internalreg":  { name: "조례·규칙 조회 에이전트", shortName: "조례 조회", desc: "자치법규를 조항 단위로 검색하고 상위법 위임 관계와 개정 이력을 추적합니다." },
    "agent-ocr":          { name: "공문서 OCR 에이전트", shortName: "공문서 OCR", desc: "민원 신청서, 종이 공문서, 증빙서류를 인식하고 개인정보를 자동 마스킹합니다." },
    "agent-dbquery":      { name: "행정DB 조회 에이전트", shortName: "행정DB 조회", desc: "자연어로 질문하면 민원 통계, 예산 집행, 인허가 현황을 SQL로 변환해 조회합니다." },
    "agent-address":      { name: "주소 정제 에이전트", shortName: "주소 정제", desc: "민원 서류의 지번·도로명 주소를 표준화하고 행정동 코드와 좌표를 매핑합니다." },
    "agent-dataanalysis": { name: "시정 데이터 분석 에이전트", shortName: "시정 분석", desc: "민원·인구·예산 데이터를 업로드하면 추이 분석과 시각화 리포트를 생성합니다." },
    "agent-summary":      { name: "문서 요약 에이전트", shortName: "문서 요약", desc: "감사 보고서, 연구 용역 보고서, 국·과 업무보고를 유형별로 요약하고 개정본을 비교합니다." },
  },
};

export default civic;
