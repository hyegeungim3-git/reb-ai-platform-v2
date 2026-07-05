/**
 * 도메인 팩 — 제조 (한빛정밀 스마트팩토리, 가상 기업)
 * 동일 플랫폼을 제조 도메인에 맞춰 재구성한 데모 프로파일.
 */
import { Factory, ClipboardCheck, Wrench, Search, Gauge, BookOpen, Map } from "lucide-react";

const manufacturing = {
  id: "manufacturing",
  orgName: "한빛정밀",
  orgShort: "HBP",
  platformTitle: "한빛정밀 스마트팩토리 AI 플랫폼",
  brandColor: "#0F766E",
  welcome: "한빛정밀 스마트팩토리 생성형 AI 플랫폼에 오신 것을 환영합니다.",
  statusBadge: "시스템 정상 가동 중 · 로컬 LLM · 공장 OT망 분리 적용",
  footerNote: "한빛정밀 스마트팩토리 AI 전환 사업 (MES·PLM 연계 데모)",
  userFeatures: [
    "작업표준(SOP)·기술문서 질의 (RAG)",
    "도면·검사성적서 OCR 판독",
    "MES 생산 데이터 자연어 조회",
    "수출 문서 번역 (한/영/중/일)",
  ],
  user: { name: "박태윤", dept: "생산기술팀", title: "책임" },
  workspaces: [
    { id: "ws1", name: "스마트팩토리 혁신 TF", icon: Factory, active: true },
    { id: "ws2", name: "품질관리부 공정분석반", icon: ClipboardCheck },
    { id: "ws3", name: "설비보전팀 예지보전 TF", icon: Wrench },
  ],
  llmModels: [
    { id: "m0", name: "Claude Fable 5", shortName: "Fable 5", type: "보안 게이트웨이", context: "400K", security: "high", status: "running", desc: "플래그십 최고 성능 모델 — 전용회선 보안 게이트웨이 경유 (기본값)" },
    { id: "m1", name: "GPT-OSS 120B", shortName: "GPT-OSS", type: "구축형", context: "128K", security: "high", status: "running", desc: "공장 내부망 전용 대형 모델" },
    { id: "m2", name: "Llama-3-Korean 70B", shortName: "Llama-3", type: "구축형", context: "32K", security: "high", status: "running", desc: "설비 이상 감지·에이전트 워크플로우 특화" },
    { id: "m3", name: "EXAONE 3.0 78B", shortName: "EXAONE", type: "구축형", context: "32K", security: "high", status: "running", desc: "작업표준·기술문서 검색(RAG) 특화" },
    { id: "m4", name: "Gemini 2.5 Pro", shortName: "Gemini", type: "API(Cloud)", context: "1M", security: "low", status: "blocked", desc: "미인증 클라우드 모델 — OT망 보안 정책으로 차단" },
  ],
  suggestions: [
    { icon: Search,   iconBg: "bg-teal-50",   iconColor: "text-teal-600",   title: "작업표준 검색",     query: "CNC 3라인 가공 공정의 작업표준(SOP) 개정본에서 절삭유 교체 주기를 알려줘" },
    { icon: Gauge,    iconBg: "bg-blue-50",   iconColor: "text-blue-600",   title: "불량률 조회",       query: "이번 주 2공장 프레스 라인 불량률과 전주 대비 변동을 알려줘" },
    { icon: BookOpen, iconBg: "bg-violet-50", iconColor: "text-violet-600", title: "안전규정 확인",     query: "지게차 운행 구역의 산업안전 규정과 보호구 착용 기준을 요약해줘" },
    { icon: Map,      iconBg: "bg-emerald-50", iconColor: "text-emerald-600", title: "사업장 가동률 지도", query: "전국 사업장별 설비 가동률 현황을 지도로 분석해줘" },
  ],
  modeDesc: {
    GENERAL: "작업표준(SOP), 품질·안전 규정, 기술 문서에 대해 자유롭게 질문하세요",
  },
  agentFeed: {
    recent: [
      { agentId: "agent-meeting",      agentName: "공정회의록",  time: "오늘 14:32", result: "HBP-회의록-0312.hwp 생성" },
      { agentId: "agent-knowledge",    agentName: "기술 검색",   time: "오늘 10:15", result: "가공 조건 표준 5건 검색" },
      { agentId: "agent-dataanalysis", agentName: "공정 분석",   time: "어제 16:44", result: "프레스 불량률 추이 분석 완료" },
    ],
    recommendTitle: "2공장 설비 정기 PM 5일 전",
    recommendBody: "지난 점검 보고서와 현행 작업표준을 대조 검토하여 변경사항을 확인하시겠습니까?",
    pendingBody: "2026-03-17 생산기술팀 공정회의 녹음이 미처리 상태입니다.",
  },
  history: [
    { id: "h1", title: "작업표준 절삭유 기준 문의", mode: "GENERAL", time: "14:30", isToday: true, starred: true },
    { id: "h2", title: "수출 사양서 영문 번역", mode: "TRANSLATE", time: "10:15", isToday: true, starred: false },
    { id: "h3", title: "설비 점검 기안문 검토", mode: "REVIEW", time: "어제", isToday: false, starred: false },
    { id: "h4", title: "주간 생산 보고서 초안", mode: "REPORT", time: "02.20", isToday: false, starred: true },
    { id: "h5", title: "안전규정 보호구 조항 문의", mode: "GENERAL", time: "02.18", isToday: false, starred: false },
  ],
  docs: [
    { id: "d1", name: "CNC_가공_작업표준서_SOP-003.pdf", size: "2.8 MB", date: "2026.01.12", tags: ["대외비", "DRM 자동해제"], secLevel: "C" },
    { id: "d2", name: "2공장_프레스_설비제원.pdf", size: "1.6 MB", date: "2026.01.20", tags: ["OCR 적용"], secLevel: "S" },
    { id: "d3", name: "한빛정밀_취업규칙(2025개정).hwp", size: "2.1 MB", date: "2026.02.10", tags: ["사규"], secLevel: "O" },
  ],
  sampleAnswers: [
    {
      keywords: ["절삭유", "작업표준", "sop", "cnc"],
      answer: {
        content: "**CNC 3라인 절삭유 교체 주기** (작업표준 SOP-CNC-003 v4.2 기준)\n\n- **수용성 절삭유**: 농도 8±1% 유지, **3개월 주기** 전량 교체\n- **일일 점검**: 매 교대 시 농도·pH 측정 (pH 8.5~9.3 유지)\n- **즉시 교체 조건**: 부패취 발생, pH 8.0 미만, 부유 슬러지 과다\n\n교체 작업은 설비보전팀 입회 하에 실시하며, 폐액은 지정 폐기물 절차(ENV-07)를 따릅니다.\n\n※ 출처: 작업표준서 SOP-CNC-003 (2026.01 개정), 4페이지",
        citations: [], steps: null,
      },
    },
    {
      keywords: ["불량률", "프레스", "공장"],
      answer: {
        content: "**2공장 프레스 라인 주간 불량률** (MES 집계, 02.17~02.21)\n\n| 구분 | 금주 | 전주 | 변동 |\n|---|---|---|---|\n| 전체 불량률 | **0.42%** | 0.55% | ▼ 0.13%p |\n| 치수 불량 | 0.18% | 0.31% | ▼ 0.13%p |\n| 표면 결함 | 0.15% | 0.14% | ▲ 0.01%p |\n| 기타 | 0.09% | 0.10% | ▼ 0.01%p |\n\n치수 불량 개선은 2/18 금형 교체(M-204) 효과로 분석됩니다. 표면 결함은 소폭 상승 — 3번 프레스 윤활 상태 점검을 권장합니다.\n\n※ 출처: MES 품질 리포트 QR-W08, 스마트팩토리 통합 대시보드",
        citations: [], steps: null,
      },
    },
  ],
  // 지도 인텔리전스 — 사업장별 설비 가동률 히트맵 (시뮬레이션)
  mapIntel: {
    metricLabel: "사업장 설비 가동률",
    unit: "%",
    regionUnit: "사업장",
    periodLabel: "2026년 7월 1주차 기준",
    sourceSystem: "MES 실적 DB",
    sourceNote: "※ 출처: MES 주간 가동 실적 집계 · 스마트팩토리 통합 대시보드 (시뮬레이션 데이터)",
    mapTitle: "전국 사업장 히트맵",
    chartTitle: "월별 가동률 추이",
    metricKeywords: ["가동률", "가동 현황", "oee", "설비종합효율"],
    wideKeywords: ["사업장별", "공장별", "전 사업장", "전국", "지도"],
    heatLow: "#CCFBF1", heatHigh: "#134E4A",
    avgLabel: "전사 평균",
    seriesLabels: ["2월", "3월", "4월", "5월", "6월", "7월"],
    avgSeries: [84.1, 84.9, 85.4, 84.2, 85.8, 86.6],
    grid: { cols: 4, rows: 5 },
    regions: [
      { id: "hwaseong", name: "화성공장",   keywords: ["화성"],            x: 1, y: 1, value: 91.2, series: [88.4, 89.0, 90.1, 89.6, 90.8, 91.2], insight: "신규 CNC 라인 안정화가 완료되어 목표 가동률(90%)을 2개월 연속 초과 달성했습니다." },
      { id: "asan",     name: "아산공장",   keywords: ["아산"],            x: 0, y: 2, value: 87.6, series: [85.2, 85.9, 86.4, 85.1, 86.8, 87.6], insight: "5월 정기 PM 이후 프레스 라인 사이클타임이 단축되어 회복세가 뚜렷합니다." },
      { id: "gumi",     name: "구미공장",   keywords: ["구미"],            x: 3, y: 2, value: 88.9, series: [86.0, 86.8, 87.5, 86.9, 88.1, 88.9], insight: "금형 교체 표준시간 단축(SMED) 활동으로 셋업 손실이 전분기 대비 18% 감소했습니다." },
      { id: "gunsan",   name: "군산공장",   keywords: ["군산"],            x: 0, y: 3, value: 79.4, series: [76.5, 77.2, 78.4, 77.8, 78.9, 79.4], insight: "신규 수주 물량 램프업 구간으로 가동률이 꾸준히 상승 중이며 9월 85% 도달이 목표입니다." },
      { id: "ulsan",    name: "울산공장",   keywords: ["울산"],            x: 3, y: 3, value: 84.7, series: [83.9, 84.5, 85.2, 82.4, 83.8, 84.7], insight: "5월 프레스 금형 크랙으로 일시 하락했으나 예비 금형 투입으로 정상 수준을 회복했습니다." },
      { id: "changwon2",name: "창원2공장",  keywords: ["창원2", "2공장"],  x: 1, y: 4, value: 81.3, series: [80.1, 81.0, 82.2, 80.6, 80.9, 81.3], insight: "노후 사출기 6대 교체가 진행 중으로, 설비 입고가 완료되는 4분기부터 개선이 전망됩니다." },
      { id: "changwon1",name: "창원본사공장",keywords: ["창원", "본사"],   x: 2, y: 4, value: 93.1, series: [90.2, 91.5, 92.0, 91.1, 92.4, 93.1], insight: "3월 예지보전 시스템 도입 후 비계획 정지가 42% 감소해 전 사업장 최고 가동률을 유지하고 있습니다." },
    ],
  },
  agentCatalog: {
    "agent-chatbot":      { name: "현장 Q&A 챗봇", shortName: "현장 Q&A", desc: "작업표준(SOP), 품질 기준, 안전 수칙 등 현장 궁금증을 RAG 기반으로 근거와 함께 즉시 답변합니다." },
    "agent-report":       { name: "생산일보 작성 에이전트", shortName: "생산일보", desc: "MES 실적 데이터를 집계해 생산일보·주간 생산 보고서를 표준 양식으로 자동 작성합니다." },
    "agent-meeting":      { name: "공정회의록 에이전트", shortName: "공정회의록", desc: "생산·품질 회의 녹음을 발언자 구분과 함께 회의록으로 자동 정리하고 액션 아이템을 추출합니다." },
    "agent-knowledge":    { name: "기술 지식 검색 에이전트", shortName: "기술 검색", desc: "도면, 기술표준, 트러블슈팅 사례 등 사내 기술 지식을 시맨틱 검색으로 찾아줍니다." },
    "agent-internalreg":  { name: "사규·안전규정 조회 에이전트", shortName: "규정 조회", desc: "취업규칙, 산업안전 규정, 품질 매뉴얼을 조항 단위로 검색하고 개정 이력을 추적합니다." },
    "agent-ocr":          { name: "도면·성적서 OCR 에이전트", shortName: "도면 OCR", desc: "스캔 도면, 검사성적서, 수입검사 서류를 인식해 편집 가능한 데이터로 변환합니다." },
    "agent-dbquery":      { name: "MES 데이터 조회 에이전트", shortName: "MES 조회", desc: "자연어로 질문하면 MES·ERP의 생산 실적, 설비 가동률, 재고를 SQL로 변환해 조회합니다." },
    "agent-address":      { name: "자재코드 표준화 에이전트", shortName: "자재코드", desc: "비정형 자재 명칭을 표준 품목코드로 매핑하고 중복·오기 코드를 정비합니다." },
    "agent-dataanalysis": { name: "공정 데이터 분석 에이전트", shortName: "공정 분석", desc: "공정 센서·품질 데이터를 업로드하면 통계 분석과 이상 원인 후보를 시각화합니다." },
    "agent-summary":      { name: "기술문서 요약 에이전트", shortName: "문서 요약", desc: "사양서, 감사 보고서, 고객 클레임 문서를 유형·길이별로 요약하고 개정본을 비교합니다." },
    "agent-translate":    { name: "수출문서 번역 에이전트", shortName: "수출 번역", desc: "수출 사양서, 계약서, 기술 매뉴얼을 용어집 기반으로 번역하고 역번역으로 검증합니다." },
    "agent-review":       { name: "기안문 사전 검토 에이전트", shortName: "기안 검토", desc: "기안문·품의서를 사규 및 품질·안전 규정과 자동 대조하여 위반 소지를 검토합니다." },
    "agent-safety":       { name: "작업 위험성평가 에이전트", shortName: "위험성평가", desc: "공정·설비 작업의 위험 요소를 평가하고 산업안전보건법 기반 안전관리계획서를 생성합니다." },
  },
};

export default manufacturing;
