/**
 * 도메인 팩 — 공공행정 (한성시청, 가상 지자체)
 * 동일 플랫폼을 지방자치단체 민원·행정 도메인에 맞춰 재구성한 데모 프로파일.
 */
import { Landmark, Users, ShieldCheck, Search, ScrollText, BookOpen, Map } from "lucide-react";

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
    { icon: Map,        iconBg: "bg-emerald-50", iconColor: "text-emerald-700", title: "동별 민원 지도",  query: "이번 달 행정동별 민원 접수 현황을 지도로 분석해줘" },
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
  // 지도 인텔리전스 — 행정동별 민원 접수 히트맵 (시뮬레이션)
  mapIntel: {
    metricLabel: "민원 접수 건수",
    unit: "건",
    regionUnit: "행정동",
    periodLabel: "2026년 6월 월간 집계",
    sourceSystem: "새올행정시스템",
    sourceNote: "※ 출처: 새올행정시스템 민원 통계 월보 (시뮬레이션 데이터)",
    mapTitle: "한성시 행정동 히트맵",
    chartTitle: "월별 접수 추이",
    metricKeywords: ["민원", "접수 건수", "민원량"],
    wideKeywords: ["동별", "행정동별", "지역별", "전체 동", "지도"],
    heatLow: "#DCFCE7", heatHigh: "#14532D",
    avgLabel: "전체 동 평균",
    seriesLabels: ["1월", "2월", "3월", "4월", "5월", "6월"],
    avgSeries: [271, 265, 283, 290, 288, 297],
    grid: { cols: 4, rows: 3 },
    regions: [
      { id: "hosu",     name: "호수동",   keywords: ["호수동"],   x: 0, y: 0, value: 264, series: [201, 195, 228, 259, 248, 264], insight: "봄 관광 성수기 진입 후 호수공원 주변 불법 주정차 민원이 전월 대비 21% 증가했습니다." },
      { id: "bukmun",   name: "북문동",   keywords: ["북문동"],   x: 1, y: 0, value: 205, series: [212, 204, 210, 208, 201, 205], insight: "연중 안정적인 수준으로, 도로 보수 요청이 접수의 대부분을 차지합니다." },
      { id: "sanseong", name: "산성동",   keywords: ["산성동"],   x: 2, y: 0, value: 152, series: [168, 161, 158, 149, 155, 152], insight: "인구 감소 추세로 전체 동 중 접수가 가장 적으며, 고령층 방문 민원 비중이 높아 찾아가는 민원 서비스 시범 대상입니다." },
      { id: "hannae",   name: "한내동",   keywords: ["한내동"],   x: 3, y: 0, value: 187, series: [179, 172, 181, 190, 184, 187], insight: "농지 전용·건축 인허가 문의가 꾸준하며 계절 요인 외 특이 동향은 없습니다." },
      { id: "seomun",   name: "서문동",   keywords: ["서문동"],   x: 0, y: 1, value: 228, series: [235, 228, 231, 224, 230, 228], insight: "전통시장 주변 노점·위생 민원이 중심으로 월별 편차가 작습니다." },
      { id: "jungang",  name: "중앙동",   keywords: ["중앙동"],   x: 1, y: 1, value: 487, series: [452, 438, 465, 471, 469, 487], insight: "시청 소재지로 여권·전입 등 창구 민원이 전체의 38%를 차지합니다. 대기시간 단축을 위해 무인민원발급기 2대 증설을 검토 중입니다." },
      { id: "dongmun",  name: "동문동",   keywords: ["동문동"],   x: 2, y: 1, value: 289, series: [271, 266, 280, 285, 282, 289], insight: "재개발 조합 설립 추진에 따라 도시계획 열람·이주 문의가 증가 추세입니다." },
      { id: "daehak",   name: "대학동",   keywords: ["대학동"],   x: 3, y: 1, value: 342, series: [298, 285, 336, 349, 338, 342], insight: "원룸 밀집 지역으로 3월 개강 이후 전입신고·주정차·소음 민원이 집중됩니다." },
      { id: "gangbyeon",name: "강변동",   keywords: ["강변동"],   x: 0, y: 2, value: 315, series: [289, 284, 301, 312, 308, 315], insight: "하천 정비 공사 구간의 소음·분진 민원이 공정 진행에 따라 완만히 증가하고 있습니다." },
      { id: "nammun",   name: "남문동",   keywords: ["남문동"],   x: 1, y: 2, value: 241, series: [244, 239, 246, 238, 243, 241], insight: "생활 민원 중심으로 안정적이며, 쓰레기 무단투기 신고가 소폭 늘어 CCTV 증설을 협의 중입니다." },
      { id: "sinsigak", name: "신시가동", keywords: ["신시가동", "신시가"], x: 2, y: 2, value: 452, series: [385, 392, 421, 448, 439, 452], insight: "대규모 아파트 입주가 이어지며 전입신고·차량등록 민원이 6개월 새 17% 증가했습니다. 임시 창구 운영을 검토 중입니다." },
      { id: "gongdan",  name: "공단동",   keywords: ["공단동"],   x: 3, y: 2, value: 398, series: [372, 368, 384, 391, 389, 398], insight: "산업단지 특성상 소음·환경 민원 비중이 높으며, 야간 조업 관련 신고가 여름철에 증가하는 경향이 있습니다." },
    ],
  },
  // 복합 업무 오케스트레이션 — 요청 1건이 OCR→주소정제→행정DB조회→보고서 4개 에이전트를 릴레이 (시뮬레이션)
  orchestration: {
    title: "옥외광고물 허가 신청 일괄 처리",
    brief: "접수 서류 1묶음이 OCR → 주소 정제 → 새올 허가 이력 조회 → 검토 보고서로 자동 릴레이됩니다.",
    request: "이번 주 접수된 옥외광고물 허가 신청서 스캔본을 처리해줘. 설치 주소 표준화하고 새올에서 기존 허가 이력 확인해서 검토 보고서까지 만들어줘.",
    attachment: { name: "옥외광고물_허가신청_0302-0306.pdf", pages: 32, size: "18.2 MB" },
    stages: [
      {
        agentId: "agent-ocr", ms: 3200,
        task: "스캔 신청서에서 신청인·설치 위치·광고물 규격을 추출하고 개인정보를 자동 마스킹합니다.",
        logs: [
          "Vision_OCR_엔진 호출 — 32면 판독 (300dpi · 표 추출 모드)",
          "허가 신청서 8건 인식 완료 · 평균 신뢰도 97.5%",
          "개인정보 자동 마스킹 — 주민번호 8건 · 연락처 8건",
          "첨부 서류 분류 — 디자인 도안 8 · 구조 안전 확인서 3",
        ],
        output: {
          label: "OCR 추출 결과",
          items: [
            "허가 신청 8건 구조화 (신청인·설치 위치·광고물 규격)",
            "개인정보 16건 마스킹 처리 — 마스킹 로그 자동 기록",
          ],
        },
        handoff: "설치 위치 주소 8건을 주소 정제 에이전트로 전달",
      },
      {
        agentId: "agent-address", ms: 2400,
        task: "설치 위치 주소를 도로명주소로 표준화하고 행정동 코드를 부여합니다.",
        logs: [
          "도로명주소 일괄 매칭 — 8건 (fuzzy 모드)",
          "지번 표기 2건 도로명주소 변환",
          "행정동 코드 부여 — 중앙동 3 · 신시가동 2 · 공단동 3",
          "좌표 산출 — 안전점검 구역 중첩 검사용",
        ],
        output: {
          label: "주소 정제 결과",
          items: [
            "8건 전건 표준화 · 행정동 코드 매핑 완료",
            "새올 허가 이력 조회 키(도로명주소·좌표) 확보",
          ],
        },
        handoff: "표준화 주소 8건을 행정DB 조회 에이전트로 전달",
      },
      {
        agentId: "agent-dbquery", ms: 2800,
        task: "위치별 기존 허가 이력과 수수료 산정 기준을 새올행정시스템 DB에서 조회합니다.",
        logs: [
          "Text2SQL 변환 — 허가 이력·수수료 산정 쿼리 생성",
          "새올행정시스템 DB 조회 — 동일 위치 기존 허가 23건",
          "동일 위치 중복 신청 1건 탐지 (기존 허가 2025-114호)",
          "표시면적 기준 수수료 산정 — 8건 (조례 별표 2)",
        ],
        output: {
          label: "행정DB 조회 결과",
          items: [
            "기존 허가 이력 대조 완료 — 중복 1건 · 신규 7건",
            "규격 초과(한 변 10m 이상) 허가 심사 대상 2건 분류",
          ],
        },
        handoff: "건별 검토 근거 데이터를 보고서 작성 에이전트로 전달",
      },
      {
        agentId: "agent-report", ms: 3000,
        task: "검토 결과를 허가 검토 보고서 표준 양식으로 작성합니다.",
        logs: [
          "허가 검토 보고서 템플릿 로드 (옥외광고물 관리 조례 제7조 양식)",
          "건별 검토 의견 개조식 작성 — 8건",
          "문서번호 채번 — HSC-민원여권과-2026-052",
          "결재선 자동 지정 — 주무관 → 팀장 → 과장",
        ],
        output: {
          label: "보고서 생성",
          items: ["검토 보고서 1건 생성 (8건 · 수수료 산정표 첨부)"],
        },
        handoff: null,
      },
    ],
    result: {
      docNo: "HSC-민원여권과-2026-052",
      docTitle: "옥외광고물 표시 허가 신청(8건) 검토 보고서",
      summary: [
        "8건 중 7건은 조례 제7조 허가 요건 충족 — 허가 적정 의견",
        "동일 위치 중복 신청 1건은 기존 허가(2025-114호)와 병합 처리 안내 필요",
        "규격 초과 2건은 구조 안전 확인서 검토 후 7 근무일 내 처리 예정",
      ],
      metrics: [
        { label: "처리 신청", value: "8건" },
        { label: "개인정보 마스킹", value: "16건" },
        { label: "릴레이 에이전트", value: "4개" },
        { label: "총 소요", value: "약 12초" },
      ],
    },
  },
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
    "agent-translate":    { name: "다국어 민원 번역 에이전트", shortName: "민원 번역", desc: "외국인 민원 서류와 안내문을 한·영·중·일로 번역하고 행정 용어집을 적용합니다." },
    "agent-review":       { name: "공문 사전 검토 에이전트", shortName: "공문 검토", desc: "기안문·공문서를 조례·규칙 및 복무규정과 자동 대조하여 절차 하자를 검토합니다." },
    "agent-safety":       { name: "행사·점검 안전계획 에이전트", shortName: "안전계획", desc: "지역 행사와 현장점검의 위험 요소를 평가하고 재난안전법 기반 안전계획서를 생성합니다." },
  },
};

export default civic;
