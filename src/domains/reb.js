/**
 * 도메인 팩 — 한국부동산원 (기본)
 * 코어 플랫폼은 이 파일의 스키마만 알고, 조직·업무 내용은 전부 여기서 공급한다.
 */
import { Briefcase, Database, ShieldCheck, Search, Globe, BookOpen, Map } from "lucide-react";

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
    { icon: Map,      iconBg: "bg-sky-50",    iconColor: "text-sky-600",    title: "지역별 공시가 분석", query: "전국 시도별 표준지 공시지가 변동률을 지도로 분석해줘" },
  ],
  // REB는 기존 AI_RESPONSES 로직을 그대로 사용
  sampleAnswers: null,
  // 지도 인텔리전스 — GENERAL 채팅에서 지역 질의 시 히트맵+시계열 삽입 (시뮬레이션)
  mapIntel: {
    metricLabel: "표준지 공시지가 변동률",
    unit: "%",
    regionUnit: "시도",
    periodLabel: "2026년 정기공시 기준",
    sourceSystem: "부동산통계정보시스템(R-ONE)",
    sourceNote: "※ 출처: 2026년 표준지공시지가 정기공시 · R-ONE 통계 연계 (시뮬레이션 데이터)",
    mapTitle: "전국 시도별 히트맵",
    chartTitle: "연도별 변동률 추이",
    metricKeywords: ["공시지가", "공시가", "변동률", "지가 변동"],
    wideKeywords: ["시도별", "지역별", "전국", "지도"],
    heatLow: "#DBEAFE", heatHigh: "#1E3A8A",
    avgLabel: "전국 평균",
    seriesLabels: ["'22", "'23", "'24", "'25", "'26"],
    avgSeries: [10.17, -5.92, 1.10, 1.42, 1.65],
    grid: { cols: 4, rows: 6 },
    regions: [
      { id: "seoul",   name: "서울", keywords: ["서울"],           x: 1, y: 0, value: 3.92, series: [11.21, -5.86, 1.87, 3.10, 3.92], insight: "국제교류복합지구 조성과 GTX 역세권 수요로 3년 연속 상승 폭이 확대됐습니다. 강남·서초 상업지 표준지가 상승을 견인했습니다." },
      { id: "gangwon", name: "강원", keywords: ["강원"],           x: 3, y: 0, value: 1.74, series: [7.86, -4.55, 0.92, 1.38, 1.74], insight: "동서고속화철도 착공과 강릉권 관광 수요 회복으로 전국 평균을 상회하는 상승률을 기록했습니다." },
      { id: "incheon", name: "인천", keywords: ["인천"],           x: 0, y: 1, value: 2.34, series: [7.44, -6.33, 0.86, 1.75, 2.34], insight: "검단신도시 성숙과 송도 바이오클러스터 확장으로 주거·산업용지 동반 상승세입니다." },
      { id: "gyeonggi",name: "경기", keywords: ["경기"],           x: 1, y: 1, value: 2.87, series: [9.58, -5.51, 1.24, 2.21, 2.87], insight: "용인·평택 반도체 클러스터 배후 주거지 수요와 GTX-A 개통 효과가 반영되어 수도권 상승을 주도했습니다." },
      { id: "chungbuk",name: "충북", keywords: ["충북", "충청북도"], x: 2, y: 1, value: 1.52, series: [7.34, -4.28, 0.88, 1.21, 1.52], insight: "청주 오송 바이오 산업단지 확장으로 산업용지 중심의 완만한 상승세를 유지하고 있습니다." },
      { id: "gyeongbuk",name:"경북", keywords: ["경북", "경상북도"], x: 3, y: 1, value: 0.88, series: [7.06, -4.24, 0.44, 0.65, 0.88], insight: "포항 이차전지 소재 단지 외 지역은 보합세로, 회복 속도가 전국 평균을 하회합니다." },
      { id: "chungnam",name: "충남", keywords: ["충남", "충청남도"], x: 0, y: 2, value: 1.96, series: [7.02, -4.42, 1.19, 1.62, 1.96], insight: "아산 디스플레이 산단 증설과 천안 성장으로 비수도권 중 상위권 상승률을 기록했습니다." },
      { id: "sejong",  name: "세종", keywords: ["세종"],           x: 1, y: 2, value: 2.19, series: [10.52, -7.06, 1.05, 1.68, 2.19], insight: "'23년 큰 폭 하락 이후 행정기능 이전 기대가 재부상하며 뚜렷한 반등 흐름을 보이고 있습니다." },
      { id: "daejeon", name: "대전", keywords: ["대전"],           x: 2, y: 2, value: 1.87, series: [8.16, -4.84, 1.01, 1.44, 1.87], insight: "원도심 재개발 진척과 대덕특구 연구시설 수요로 상업·업무용지가 상승을 이끌었습니다." },
      { id: "daegu",   name: "대구", keywords: ["대구"],           x: 3, y: 2, value: 0.94, series: [8.53, -5.87, 0.42, 0.68, 0.94], insight: "미분양 해소 지연으로 주거지 회복이 완만하나, 수성구 상업지는 반등이 시작됐습니다." },
      { id: "jeonbuk", name: "전북", keywords: ["전북", "전라북도"], x: 0, y: 3, value: 1.21, series: [7.45, -4.17, 0.71, 0.96, 1.21], insight: "새만금 이차전지 투자 유치 효과가 군산·김제 산업용지에 반영되기 시작했습니다." },
      { id: "gyeongnam",name:"경남", keywords: ["경남", "경상남도"], x: 2, y: 3, value: 1.13, series: [7.68, -4.61, 0.58, 0.87, 1.13], insight: "창원 방산·원전 수주 회복으로 산업용지 중심의 점진적 회복세를 보이고 있습니다." },
      { id: "ulsan",   name: "울산", keywords: ["울산"],           x: 3, y: 3, value: 1.08, series: [7.76, -5.05, 0.55, 0.82, 1.08], insight: "조선업 수주 잔량 증가로 동구 주거지 하락세가 멈추고 상승 전환했습니다." },
      { id: "gwangju", name: "광주", keywords: ["광주"],           x: 0, y: 4, value: 1.15, series: [7.78, -4.79, 0.62, 0.91, 1.15], insight: "AI 집적단지 2단계 착공으로 첨단지구 산업용지가 상승을 견인하고 있습니다." },
      { id: "jeonnam", name: "전남", keywords: ["전남", "전라남도"], x: 1, y: 4, value: 1.05, series: [7.32, -4.36, 0.53, 0.80, 1.05], insight: "여수·광양 산단은 보합세이나 무안 공항권 개발 기대로 소폭 상승했습니다." },
      { id: "busan",   name: "부산", keywords: ["부산"],           x: 2, y: 4, value: 1.62, series: [8.96, -6.10, 0.75, 1.20, 1.62], insight: "가덕도신공항 착공과 북항 재개발 2단계 효과로 강서·중구 일대가 상승을 주도했습니다." },
      { id: "jeju",    name: "제주", keywords: ["제주"],           x: 0, y: 5, value: 0.65, series: [9.32, -7.14, 0.28, 0.45, 0.65], insight: "관광 회복 지연으로 전국 최저 상승률이나, 하락세는 멈추고 소폭 반등했습니다." },
    ],
  },
  // 에이전트 카탈로그 오버라이드 없음 (constants.js의 AGENT_TEAMS 원본 사용)
  agentCatalog: {},
};

export default reb;
