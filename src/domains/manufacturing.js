/**
 * 도메인 팩 — 제조 (한빛정밀 스마트팩토리, 가상 기업)
 * 동일 플랫폼을 제조 도메인에 맞춰 재구성한 데모 프로파일.
 */
import {
  Factory, ClipboardCheck, Wrench, Search, Gauge, BookOpen, Map,
  FileText, ShieldCheck, Lock, Database, CheckSquare, ClipboardList, BookMarked,
} from "lucide-react";

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
  // 복합 업무 오케스트레이션 — 요청 1건이 OCR→자재코드→MES조회→보고서 4개 에이전트를 릴레이 (시뮬레이션)
  orchestration: {
    title: "협력사 검사성적서 일괄 처리",
    brief: "입고 서류 1묶음이 OCR → 자재코드 표준화 → MES 조회 → 수입검사 판정 보고서로 자동 릴레이됩니다.",
    request: "오늘 입고된 협력사 검사성적서 스캔본을 처리해줘. 자재코드 표준화하고 MES에서 로트별 입고 이력과 불량률 확인해서 수입검사 판정 보고서까지 만들어줘.",
    attachment: { name: "수입검사_성적서_0305.pdf", pages: 24, size: "15.8 MB" },
    stages: [
      {
        agentId: "agent-ocr", ms: 3200,
        task: "스캔 성적서에서 로트번호·측정값·판정 결과를 추출합니다.",
        logs: [
          "Vision_OCR_엔진 호출 — 24면 판독 (표 추출 모드)",
          "검사성적서 9건 인식 · 측정값 테이블 27개 추출",
          "치수 측정값 312개 정형화 · 평균 신뢰도 96.8%",
          "로트번호 9건 · 협력사 코드 4건 식별",
        ],
        output: {
          label: "OCR 추출 결과",
          items: [
            "성적서 9건 구조화 (로트번호·측정값·자체 판정)",
            "규격 하한 근접 측정값 5건 플래그 지정",
          ],
        },
        handoff: "비정형 자재 명칭 9건을 자재코드 표준화 에이전트로 전달",
      },
      {
        agentId: "agent-address", ms: 2400,
        task: "비정형 자재 명칭을 표준 품목코드로 매핑합니다.",
        logs: [
          "품목마스터 일괄 매칭 — 9건 (유사도 검색)",
          "비정형 표기 3건 자동 보정 (구코드 1 · 오기 2)",
          "표준 품목코드 매핑 9건 완료",
          "협력사-품목 매핑 테이블 갱신",
        ],
        output: {
          label: "자재코드 표준화 결과",
          items: [
            "9건 전건 표준 품목코드 매핑 (자동 보정 3건 포함)",
            "MES 조회 키(품목코드·로트번호) 확보",
          ],
        },
        handoff: "품목코드 9건을 MES 데이터 조회 에이전트로 전달",
      },
      {
        agentId: "agent-dbquery", ms: 2800,
        task: "품목별 입고 이력과 수입검사 불량률을 MES 실적 DB에서 조회합니다.",
        logs: [
          "Text2SQL 변환 — 입고 이력·불량률 집계 쿼리 생성",
          "MES 실적 DB 조회 — 최근 6개월 입고 142로트",
          "품목별 수입검사 불량률 산출 — 평균 0.38%",
          "SUS304 브래킷 로트 불량률 1.2% — 관리 한계 초과",
        ],
        output: {
          label: "MES 조회 결과",
          items: [
            "9개 품목 입고 이력·불량률 집계 완료",
            "관리 한계 초과 1개 품목 식별 — 특별 검사 대상",
          ],
        },
        handoff: "로트별 판정 근거 데이터를 생산일보 작성 에이전트로 전달",
      },
      {
        agentId: "agent-report", ms: 3000,
        task: "판정 근거를 수입검사 판정 보고서 표준 양식으로 작성합니다.",
        logs: [
          "수입검사 판정 보고서 템플릿 로드 (QP-07 양식)",
          "로트별 판정 의견 작성 — 합격 8 · 조건부 1",
          "문서번호 채번 — HBP-품질-2026-088",
          "품질관리부 결재선 자동 지정",
        ],
        output: {
          label: "보고서 생성",
          items: ["판정 보고서 1건 생성 (9로트 · 측정값 대조표 첨부)"],
        },
        handoff: null,
      },
    ],
    result: {
      docNo: "HBP-품질-2026-088",
      docTitle: "수입검사 성적서(9로트) 판정 보고서",
      summary: [
        "9로트 중 8로트 합격 판정 — 표준 입고 처리",
        "SUS304 브래킷 1로트는 불량률 관리 한계 초과로 조건부 합격 — 전수 검사 후 투입",
        "해당 협력사를 4월 정기 품질 감사 대상으로 등재 제안",
      ],
      metrics: [
        { label: "처리 로트", value: "9건" },
        { label: "측정값 정형화", value: "312개" },
        { label: "릴레이 에이전트", value: "4개" },
        { label: "총 소요", value: "약 12초" },
      ],
    },
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
  /* ================================================================
   * 에이전트 내부 콘텐츠 오버라이드 (agentContent)
   * - 키 단위 병합: 제공한 키만 교체, 나머지는 REB 기본값(CONTENT_DEFAULTS)
   * - logoSrc/logo(data URI) 키는 의도적으로 생략 — REB 로고 fallback (용량 절약, 이미지라 금칙어 스캔 비대상)
   * ================================================================ */
  agentContent: {
    /* ── 수출문서 번역 에이전트 ── */
    "agent-translate": {
      sourceText: `CNC 정밀가공 부품 수출 사양서(HBP-EXP-2026-014)에 따라 2026년 2분기 북미향 브래킷 어셈블리 24,000EA의 공급 조건을 다음과 같이 확정하였습니다.

주요 관리 치수는 전장 84.50±0.10mm, 홀 피치 42.00±0.05mm이며, 전 로트에 대해 공정능력지수(Cpk) 1.33 이상을 보증합니다. 검사성적서는 KS Q ISO 2859-1 발췌 기준에 따라 로트별로 첨부합니다.

납기는 선적 기준 매월 25일이며, 부적합품 발생 시 수령 후 14일 이내 서면 통보 조건으로 무상 교환합니다. 포장은 방청유 도포 후 VCI 방청 포장을 적용합니다.`,
      translatedText: `In accordance with the Precision CNC Machined Parts Export Specification (HBP-EXP-2026-014), the supply terms for 24,000 EA of bracket assemblies bound for North America in Q2 2026 have been finalized as follows.

The critical dimensions are overall length 84.50±0.10mm and hole pitch 42.00±0.05mm, and a process capability index (Cpk) of 1.33 or higher is guaranteed for all lots. Inspection certificates are attached per lot in accordance with the KS Q ISO 2859-1 sampling standard.

Delivery is due on the 25th of each month on a shipment basis, and nonconforming products are replaced free of charge upon written notice within 14 days of receipt. Packaging applies VCI anti-corrosion wrapping after rust-preventive oil coating.`,
      chunks: [
        { id: 1, text: 'CNC 정밀가공 부품 수출 사양서(HBP-EXP-2026-014)에 따라 2026년 2분기 북미향 브래킷 어셈블리 24,000EA의 공급 조건을 확정하였습니다.' },
        { id: 2, text: '주요 관리 치수는 전장 84.50±0.10mm, 홀 피치 42.00±0.05mm이며, 전 로트에 대해 공정능력지수(Cpk) 1.33 이상을 보증합니다.' },
        { id: 3, text: '검사성적서는 KS Q ISO 2859-1 발췌 기준에 따라 로트별로 첨부합니다.' },
        { id: 4, text: '납기는 선적 기준 매월 25일이며, 부적합품 발생 시 수령 후 14일 이내 서면 통보 조건으로 무상 교환합니다.' },
        { id: 5, text: '포장은 방청유 도포 후 VCI 방청 포장을 적용합니다.' },
      ],
      summaryKo: `2026년 2분기 북미향 브래킷 어셈블리 24,000EA 공급 조건 확정. 관리 치수 전장 84.50±0.10mm·홀 피치 42.00±0.05mm, 전 로트 Cpk 1.33 이상 보증. 납기 매월 25일 선적, 부적합품 14일 이내 통보 시 무상 교환, VCI 방청 포장 적용.`,
      summaryEn: `Supply terms finalized for 24,000 EA of bracket assemblies for North America in Q2 2026. Critical dimensions: length 84.50±0.10mm, hole pitch 42.00±0.05mm; Cpk ≥ 1.33 guaranteed for all lots. Shipment by the 25th monthly; free replacement of nonconformities notified within 14 days; VCI anti-corrosion packaging.`,
      backTranslated: `CNC 정밀가공 부품 수출 사양서(HBP-EXP-2026-014)에 의거하여 2026년 2분기 북미 지역향 브래킷 어셈블리 24,000EA에 대한 공급 조건이 다음과 같이 확정되었습니다.

핵심 관리 치수는 전체 길이 84.50±0.10mm와 홀 간격 42.00±0.05mm이며, 모든 로트에 대하여 공정능력지수(Cpk) 1.33 이상이 보증됩니다. 검사성적서는 KS Q ISO 2859-1 발췌 검사 표준에 따라 로트 단위로 첨부됩니다.

납품 기한은 선적 기준으로 매월 25일이며, 부적합품은 수령 후 14일 이내 서면 통보를 조건으로 무상 교환됩니다. 포장은 방청유 도포 후 VCI 방청 포장을 적용합니다.`,
      glossary: [
        { ko: '검사성적서',    en: 'Inspection Certificate',              category: '품질' },
        { ko: '공정능력지수',  en: 'Process Capability Index (Cpk)',      category: '품질' },
        { ko: '치수공차',      en: 'Dimensional Tolerance',               category: '가공' },
        { ko: '작업표준서',    en: 'Standard Operating Procedure (SOP)',  category: '표준' },
        { ko: '발췌 검사',     en: 'Sampling Inspection',                 category: '품질' },
        { ko: '방청 포장',     en: 'Anti-corrosion (VCI) Packaging',      category: '물류' },
        { ko: '금형',          en: 'Die / Mold',                          category: '설비' },
        { ko: '예지보전',      en: 'Predictive Maintenance',              category: '설비' },
      ],
    },
    /* ── 기안문 사전 검토 에이전트 ── */
    "agent-review": {
      apvLine: [
        { name: '박태윤', dept: '생산기술팀', title: '책임',   role: '작성자' },
        { name: '정재호', dept: '생산기술팀', title: '팀장',   role: '검토자' },
        { name: '오세창', dept: '생산본부',   title: '본부장', role: '승인자' },
      ],
      ragDocs: [
        '구매·계약 규정 제19조 (수의계약 한도)',
        '안전보건관리규정 제18조 (비정형 작업 위험성평가)',
        '취업규칙 제23조 (출장 여비 기준)',
        '품질경영매뉴얼 제7조 (부적합품 관리)',
        '보안정책 제15조 (개인정보 처리 기준)',
        '설비관리규정 제12조 (금형·치공구 관리)',
        '업무처리지침 제9조 (외주 용역 발주 절차)',
      ],
      violations: [
        {
          clause: '구매·계약 규정 제19조 제1항',
          type: '수의계약 한도 초과',
          severity: 'high',
          content: '금형 교체 외주 용역비 32,400천원이 수의계약 한도(20,000천원)를 62% 초과 계상. 경쟁입찰 또는 분할 발주 검토 필요.',
          action: '경쟁입찰 전환 또는 구매심의위원회 사전 심의 후 재상신 요망.',
        },
        {
          clause: '안전보건관리규정 제18조 제2항',
          type: '위험성평가 결과서 누락',
          severity: 'medium',
          content: '금형 교체는 비정형 위험 작업으로 작업 전 위험성평가 결과서 첨부가 의무이나 기안문에 미포함.',
          action: '위험성평가 결과서(별지 제3호 서식) 첨부 후 재제출.',
        },
        {
          clause: '보안정책 제15조 제3항',
          type: '개인정보 처리 미고지',
          severity: 'low',
          content: '협력사 담당자 연락처 수집 시 개인정보 수집·이용 동의서 미첨부. 경미한 절차적 하자.',
          action: '개인정보 동의서(별지 제15호) 사후 징구 및 파일 첨부.',
        },
      ],
      regs: [
        { id: 'r1', label: '취업규칙·복무규정' },
        { id: 'r2', label: '구매·계약 규정' },
        { id: 'r3', label: '안전보건관리규정' },
        { id: 'r4', label: '품질경영매뉴얼' },
        { id: 'r5', label: '보안정책·개인정보' },
      ],
      highlightSegs: [
        { text: '2공장 프레스 금형 교체 외주 품의서\n\n작업 기간: 2026. 03. 16. ~ 03. 27. (2주)\n작업 장소: 아산공장 2공장 프레스동 PR-01~03 베이\n작업 책임자: 박태윤 책임 (생산기술팀)\n\n━━ 용역비 내역 ━━\n금형 분해·세척: 8,400,000원\n습합·시타 조정: 12,600,000원\n', type: null },
        { text: '운반·크레인 사용료: 11,400,000원\n합  계: 32,400,000원 — 수의계약 한도 20,000,000원 대비 62% 초과 계상', type: 'high' },
        { text: '\n\n━━ 첨부 서류 ━━\n✔ 외주 용역 견적서 (2개사)\n✔ 금형 이력 카드 (M-201~206)\n✔ 작업표준서 SOP-PR-011 발췌본\n', type: null },
        { text: '✘ 작업 위험성평가 결과서 (별지 제3호) — 미첨부', type: 'medium' },
        { text: '\n\n━━ 협력사 정보 ━━\n업체명: 대성금속(주)\n담당자: 정 우 성\n', type: null },
        { text: '연락처: 010-5521-8890 (개인정보 수집·이용 동의서 미첨부)', type: 'low' },
        { text: '\n\n━━ 품 의 ━━\n위와 같이 금형 교체 외주 용역을 실시하고자 품의합니다.\n\n2026년 3월 12일\n생산기술팀 박태윤 책임 (인)', type: null },
      ],
      highlightLegendLabels: { high: '높음 — 계약 한도 초과', medium: '중간 — 서류 누락', low: '낮음 — 절차 미비' },
      highlightDocTitle: '2공장 프레스 금형 교체 외주 품의서',
      reviewNum: '검토-2026-084',
      dept: '생산기술팀',
      docNum: 'HBP-생산기술팀-2026-084',
      apvDocNum: 'HBP-생산기술팀-2026-085',
      logoAlt: 'HBP 한빛정밀',
    },
    /* ── 작업 위험성평가 에이전트 ── */
    "agent-safety": {
      agents: [
        { icon: FileText,      label: '작업 분석 에이전트',   sub: '작업 특성 파악 및 위험 유형 분류',          color: 'bg-orange-600',  ms: 2400 },
        { icon: Database,      label: 'RAG 검색 에이전트',    sub: '관련 법령·사내 규정·재해 사례 벡터 검색',   color: 'bg-blue-600',    ms: 3500 },
        { icon: CheckSquare,   label: '법규 검토 에이전트',   sub: '적용 법령 매핑 및 준수 체크리스트 생성',    color: 'bg-purple-600',  ms: 2800 },
        { icon: ClipboardList, label: '계획서 작성 에이전트', sub: '작업 안전관리계획서 초안 자동 생성',        color: 'bg-emerald-600', ms: 3000 },
      ],
      riskOptions: ['끼임·협착','프레스 협착','지게차 충돌','감전','절단·베임','화상·고온 접촉','소음성 난청','유해물질 흡입','추락(고소작업)','중량물 취급 요통'],
      riskData: {
        '끼임·협착':      { level: '매우 높음', freq: '보통', sev: 5, lkl: 3, lvlColor: 'bg-red-100 text-red-700 border-red-200',          measure: 'LOTO(잠금·표지) 절차 이행, 방호덮개 부착 상태 확인 후 작업' },
        '프레스 협착':    { level: '매우 높음', freq: '낮음', sev: 5, lkl: 2, lvlColor: 'bg-red-100 text-red-700 border-red-200',          measure: '양수조작식 방호장치 작동 확인, 금형 사이 신체 진입 절대 금지, 안전블록 설치' },
        '지게차 충돌':    { level: '높음',     freq: '보통', sev: 4, lkl: 3, lvlColor: 'bg-orange-100 text-orange-700 border-orange-200', measure: '지게차 전용 통로 구분선 준수, 후진 경보음·경광등 확인, 유도자 배치' },
        '감전':          { level: '높음',     freq: '낮음', sev: 4, lkl: 2, lvlColor: 'bg-orange-100 text-orange-700 border-orange-200', measure: '정전 작업 전 검전기 확인, 절연 보호구 착용, 분전반 시건 관리' },
        '절단·베임':      { level: '보통',     freq: '보통', sev: 3, lkl: 3, lvlColor: 'bg-yellow-100 text-yellow-700 border-yellow-200', measure: '방검 장갑 착용, 칩 제거 시 전용 브러시 사용(맨손 금지)' },
        '화상·고온 접촉': { level: '보통',     freq: '낮음', sev: 3, lkl: 2, lvlColor: 'bg-yellow-100 text-yellow-700 border-yellow-200', measure: '내열 장갑 착용, 고온부 경고 표지 부착, 냉각 완료 후 접촉' },
        '소음성 난청':    { level: '높음',     freq: '높음', sev: 3, lkl: 4, lvlColor: 'bg-orange-100 text-orange-700 border-orange-200', measure: '귀마개 상시 착용, 90dB 초과 구역 노출 시간 관리' },
        '유해물질 흡입':  { level: '높음',     freq: '낮음', sev: 4, lkl: 2, lvlColor: 'bg-orange-100 text-orange-700 border-orange-200', measure: '국소배기장치 가동 확인, 방독마스크 착용, MSDS 비치' },
        '추락(고소작업)': { level: '매우 높음', freq: '낮음', sev: 5, lkl: 2, lvlColor: 'bg-red-100 text-red-700 border-red-200',          measure: '안전대 체결, 고소작업대 사용 전 점검, 2인 1조 작업' },
        '중량물 취급 요통': { level: '보통',   freq: '보통', sev: 3, lkl: 3, lvlColor: 'bg-yellow-100 text-yellow-700 border-yellow-200', measure: '25kg 초과 시 2인 취급 원칙, 크레인·리프트 적극 활용' },
      },
      resultText: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        작 업 안 전 관 리 계 획 서
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 작업 개요
   ─────────────────────────────────────
   ▸ 작  업  명 : 2공장 프레스 라인 금형 교체 작업
   ▸ 작업 기간 : 2026. 03. 16. ~ 2026. 03. 27. (2주)
   ▸ 작업 장소 : 아산공장 2공장 프레스동 PR-01~03 베이
   ▸ 주관 부서 : 한빛정밀 생산기술팀
   ▸ 작업 규모 : 금형 6벌 교체 (작업자 4명, 협력사 2명)

2. 안전 관리 조직
   ─────────────────────────────────────
   [안전보건관리책임자] 오세창 본부장 (생산본부)
       └─ [안전관리담당] 김도연 대리 (안전환경팀)
              ├─ [작업책임자] 박태윤 책임 (생산기술팀)
              └─ [설비담당] 유강민 책임 (설비보전팀)

3. 위험 요인 분석 (위험성 평가)
   ─────────────────────────────────────
   ┌────────────┬─────────┬──────┬───────────────────────────────┐
   │ 위험 요인  │ 위험도  │ 빈도 │ 안전 대책                    │
   ├────────────┼─────────┼──────┼───────────────────────────────┤
   │ 끼임·협착  │ 매우높음│ 보통 │ LOTO 절차, 방호덮개 확인     │
   │ 프레스협착 │ 매우높음│ 낮음 │ 양수조작 방호장치, 안전블록  │
   │ 지게차충돌 │ 높음    │ 보통 │ 전용 통로 구분, 유도자 배치  │
   │ 중량물취급 │ 보통    │ 보통 │ 25kg 초과 2인 취급, 크레인   │
   │ 감전       │ 높음    │ 낮음 │ 정전 작업 검전, 절연 보호구  │
   └────────────┴─────────┴──────┴───────────────────────────────┘

4. 안전관리 계획 (단계별)
   ─────────────────────────────────────
   4.1 작업 전 안전 관리
   ▸ 작업 전일 TBM(작업 전 안전회의) 실시 및 위험성평가 공유
   ▸ LOTO(잠금·표지) 절차 이행 — 주전원 차단 및 개인 자물쇠 시건
   ▸ 개인보호구(안전화, 방검 장갑, 귀마개) 지급 확인

   4.2 작업 중 안전
   ▸ 금형 사이 신체 진입 절대 금지 — 안전블록 설치 상태 유지
   ▸ 크레인 인양 시 하부 출입 통제 및 유도자 신호 준수
   ▸ 30분 간격 작업책임자 순회 점검 (이상 시 즉시 작업 중지)

5. 비상 연락 체계
   ─────────────────────────────────────
   사고 발생 → 설비 비상정지(E-Stop) 및 119 신고
   ↓
   안전환경팀 연락 (김도연 010-XXXX-XXXX)
   ↓
   안전보건관리책임자 보고 → 원인 조사 및 재발 방지 조치

6. 관련 법령 및 규정
   ─────────────────────────────────────
   ① 산업안전보건법 제36조 (위험성평가)
   ② 산업안전보건기준에 관한 규칙 제103조 (프레스 방호장치)
   ③ 한빛정밀 안전보건관리규정 제18조 (비정형 작업)
   ④ 프레스 작업표준서 SOP-PR-011 제5절 (금형 교체 안전)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
작성: GENOS 안전관리 에이전트 v1.0 | 검토자: _______
참조 법령 수: 4건 | RAG 검색 문서 수: 9건
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      apvLine: [
        { name: '박태윤', dept: '생산기술팀', title: '책임',   role: '작성자' },
        { name: '김도연', dept: '안전환경팀', title: '대리',   role: '검토자' },
        { name: '오세창', dept: '생산본부',   title: '본부장', role: '승인자' },
      ],
      defaultProjName: '2공장 프레스 라인 금형 교체 작업',
      defaultProjType: '비정형 작업 (금형 교체)',
      defaultProjLoc: '아산공장 2공장 프레스동',
      defaultDuration: '2주',
      defaultRisks: ['끼임·협착','프레스 협착','지게차 충돌'],
      projTypePlaceholder: '작업 유형 (금형 교체, 정기 PM, 고소작업 등)',
      uploadHint: '작업 절차서, 설비 도면, 이전 위험성평가 결과서, 재해 사례 등을 업로드하세요 (선택)',
      ragDocs: [
        { name: '프레스_작업표준서_SOP-PR-011.pdf', hits: 9 },
        { name: '한빛정밀 안전보건관리규정.pdf',    hits: 6 },
        { name: '산업안전보건법 제36조.pdf',        hits: 4 },
        { name: '금형 교체(SMED) 작업 매뉴얼.pdf',  hits: 3 },
        { name: '위험성평가 실시 매뉴얼.pdf',       hits: 2 },
      ],
      ragTags: ['산업안전보건법','산업안전보건기준규칙','안전보건관리규정','프레스 작업표준','LOTO 절차','중대재해처벌법'],
      checklist: [
        '작업 전 TBM(안전회의) 실시 및 위험성평가 결과 공유',
        'LOTO(잠금·표지) 절차 이행 — 주전원 차단·개인 자물쇠 시건',
        '양수조작식 방호장치·안전블록 작동 상태 확인',
        '개인보호구(안전화·방검 장갑·귀마개) 착용 여부',
        '크레인·지게차 이동 경로 통제 및 유도자 배치',
        '금형 체결 볼트 규정 토크 확인 (시타 전 재확인)',
        '비상 연락처(119, 안전환경팀) 작업 구역 게시 확인',
      ],
      laws: [
        '산업안전보건법 제36조 (위험성평가 의무)',
        '산업안전보건기준에 관한 규칙 제103조 (프레스 등의 위험 방지)',
        '산업안전보건법 제63조 (도급인의 안전조치)',
        '한빛정밀 안전보건관리규정 제18조 (비정형 작업 위험성평가)',
        '프레스 작업표준서 SOP-PR-011 제5절 (금형 교체 안전)',
      ],
      orgLeader: '[안전보건관리책임자] 오세창 본부장 (생산본부)',
      orgManager: '[안전관리담당] 김도연 대리 (안전환경팀)',
      orgMembers: ['[작업책임자] 박태윤 책임 (생산기술팀)','[비상연락담당] 유강민 책임 (설비보전팀)'],
      emergencySteps: [
        { label: '위험 상황 발생',         sub: '설비 비상정지 후 즉시 대피',        color: 'bg-red-600' },
        { label: '관리자 연락',            sub: '김도연 대리 010-XXXX-XXXX',        color: 'bg-orange-500' },
        { label: '119·고용노동부 신고',    sub: '중대재해 시 관할 지청 즉시 신고',   color: 'bg-orange-500' },
        { label: '안전보건관리책임자 보고', sub: '원인 조사 및 재발 방지',           color: 'bg-slate-700' },
      ],
      planSections: [
        { sub: '3.1  작업 전 안전 관리', items: ['작업 전일 TBM 실시 및 위험성평가 결과 공유','LOTO 절차 이행 — 주전원 차단 및 개인 자물쇠 시건','개인보호구(안전화·방검 장갑·귀마개) 지급 확인'] },
        { sub: '3.2  작업 중 안전',      items: ['금형 사이 신체 진입 금지 — 안전블록 설치 상태 유지','크레인 인양 시 하부 출입 통제 및 유도자 신호 준수','30분 간격 작업책임자 순회 점검, 이상 시 즉시 작업 중지'] },
        { sub: '3.3  설비·환경 안전',    items: ['방호덮개·양수조작 장치 임의 해제 금지','절삭유·유압유 누유 발견 시 즉시 방지턱 설치 및 제거','작업 종료 후 시운전(시타)은 방호장치 복원 확인 후 실시'] },
      ],
      dept: '생산기술팀',
      docNum: 'HBP-생산기술팀-2026-072',
      brandLine: 'HBP · 한빛정밀',
      logoAlt: 'HBP 한빛정밀',
      apvRef: 'APV-2026-0312-072',
      periodRange: '2026. 03. 16. ~ 2026. 03. 27.',
    },
    /* ── 공정회의록 에이전트 ── */
    "agent-meeting": {
      defaultTitle: '프레스 라인 표면 결함 개선 대책 회의',
      defaultDate: '2026-03-14',
      defaultPlace: '아산공장 2층 회의실 (201호)',
      defaultAttendees: [
        { name: '백승호', dept: '품질관리부', role: '주재(부장)' },
        { name: '박태윤', dept: '생산기술팀', role: '책임' },
        { name: '한지원', dept: '품질관리부', role: '선임' },
        { name: '유강민', dept: '설비보전팀', role: '책임' },
      ],
      defaultAgenda: ['3번 프레스 표면 결함 증가 원인 분석 및 대책','예지보전 알람 임계치 조정안 검토'],
      sttSampleText: '안녕하십니까 오늘 회의를 시작하겠습니다 주요 안건은 3번 프레스 표면 결함 대책과 예지보전 알람 임계치 조정입니다 품질관리부에서 분석한 표면 결함 데이터를 공유하겠습니다 결함 발생률이 2월 0.14퍼센트에서 3월 0.19퍼센트로 상승했습니다 윤활유 도포량 편차가 주요 원인 후보로 확인됐습니다 설비보전팀 진동 데이터에서도 슬라이드 가이드 마모 징후가 관측됩니다 윤활 자동화 장치를 3번 프레스에 우선 적용하는 안을 제안드립니다 진동 임계치는 4.5에서 3.5로 하향 조정을 검토했습니다',
      diarization: [
        { time: '00:00:12', speaker: '박태윤', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200',
          text: '안녕하십니까. 오늘 회의를 시작하겠습니다. 주요 안건은 3번 프레스 표면 결함 대책과 예지보전 알람 임계치 조정 두 가지입니다.',
          docKey: 'open',
          meetingText: '품질관리부장 주재로 회의 개최. 참석 인원 확인 및 회의 목적 공유.' },
        { time: '00:01:05', speaker: '한지원', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200',
          text: '품질관리부에서 분석한 3번 프레스 표면 결함 데이터를 공유하겠습니다. 결함 발생률이 2월 0.14%에서 3월 0.19%로 상승했습니다.',
          docKey: 'agenda1',
          meetingText: '한지원 선임: 표면 결함률 0.14% → 0.19% 상승, 윤활유 도포량 편차 원인 후보.' },
        { time: '00:02:33', speaker: '유강민', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200',
          text: '진동 센서 데이터에서도 슬라이드 가이드 마모 징후가 관측됩니다. 윤활유 도포량 편차와 복합 요인으로 판단됩니다.',
          docKey: 'agenda1',
          meetingText: '유강민 책임: 슬라이드 가이드 마모 징후 관측 — 복합 요인 의견.' },
        { time: '00:04:12', speaker: '백승호', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200',
          text: '고객 클레임으로 이어지기 전에 윤활 관리 기준을 작업표준(SOP)에 반영해야 합니다. 한도견본 재검토도 병행하겠습니다.',
          docKey: 'agenda1',
          meetingText: '백승호 부장: 윤활 관리 기준 SOP 반영 및 한도견본 재검토 지시.' },
        { time: '00:06:48', speaker: '박태윤', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200',
          text: '윤활 자동화 장치를 3번 프레스에 우선 적용하고, 효과 확인 후 전 라인으로 확대하는 방식으로 진행하면 어떨까요?',
          docKey: 'agenda1_conc',
          meetingText: '[결론] 윤활 자동화 장치 3번 프레스 우선 적용 — 4월 말 효과 검증.' },
        { time: '00:07:30', speaker: '한지원', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200',
          text: '동의합니다. 4월 말까지 효과를 검증하고 전 라인 확대 여부를 결정하는 것을 제안드립니다. 검증 지표는 표면 결함률 0.12% 이하입니다.',
          docKey: 'decision',
          meetingText: '[결정①] 윤활 자동화 장치 시범 적용 — 4월 말 효과 검증 후 전 라인 확대 결정.' },
        { time: '00:09:15', speaker: '유강민', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200',
          text: '예지보전 알람 임계치 관련하여, 진동 4.5mm/s에서 3.5mm/s로 하향 조정하는 안을 검토했습니다. 오탐 증가는 주 2건 이내로 예상됩니다.',
          docKey: 'agenda2',
          meetingText: '유강민 책임: 진동 임계치 4.5 → 3.5mm/s 하향안 — 오탐 주 2건 이내 예상.' },
        { time: '00:10:44', speaker: '박태윤', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200',
          text: '오늘 논의된 내용을 바탕으로 각자 담당 사항을 기한 내 이행해 주시기 바랍니다. 이상으로 회의를 마치겠습니다.',
          docKey: 'close',
          meetingText: '차기 회의: 2026년 3월 27일(금) 14:00 예정. 임계치 조정 결과는 서면 공람 예정.' },
      ],
      docSections: [
        { key: 'open',         num: '§1',    label: '개회',                        brief: '품질관리부장 주재로 회의 개최. 참석 인원 확인 및 목적 공유.', color: 'slate' },
        { key: 'agenda1',      num: '§2-①',  label: '안건 1 · 프레스 표면 결함 대책', brief: '결함률 0.14%→0.19% · 윤활 편차 + 가이드 마모 복합 요인.', color: 'violet' },
        { key: 'agenda1_conc', num: '  └결론', label: '안건 1 결론',                brief: '윤활 자동화 장치 3번 프레스 우선 적용, 4월 말 효과 검증.', color: 'violet' },
        { key: 'agenda2',      num: '§2-②',  label: '안건 2 · 예지보전 임계치 조정', brief: '진동 임계치 4.5 → 3.5mm/s 하향, 오탐 주 2건 이내 예상.', color: 'blue' },
        { key: 'decision',     num: '§3',    label: '결정 사항',                   brief: '① 윤활 자동화 시범 적용  ② 임계치 하향 확정  ③ SOP 개정안 4/15 완료.', color: 'emerald' },
        { key: 'action',       num: '§4',    label: '조치 사항',                   brief: '4개 항목 · 담당자 배정 · 기한 2026.03.25~04.30.', color: 'amber' },
        { key: 'close',        num: '§5',    label: '폐회',                        brief: '차기 회의: 2026.03.27(금) 14:00 예정.', color: 'slate' },
      ],
      speakerLegend: [
        { name: '박태윤', color: 'text-indigo-700',  bg: 'bg-indigo-100',  border: 'border-indigo-200' },
        { name: '한지원', color: 'text-violet-700',  bg: 'bg-violet-100',  border: 'border-violet-200' },
        { name: '유강민', color: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-emerald-200' },
        { name: '백승호', color: 'text-rose-700',    bg: 'bg-rose-100',    border: 'border-rose-200' },
      ],
      actions: [
        { label: '윤활 자동화 장치 사양 검토 및 발주',        person: '유강민', dept: '설비보전팀', due: '2026.03.31' },
        { label: '표면 결함 한도견본 재검토',                 person: '한지원', dept: '품질관리부', due: '2026.03.25' },
        { label: 'SOP-PR-011 윤활 관리 조항 개정안 작성',     person: '박태윤', dept: '생산기술팀', due: '2026.04.15' },
        { label: '임계치 조정 후 오탐률 모니터링 결과 보고',   person: '유강민', dept: '설비보전팀', due: '2026.04.30' },
      ],
      deptName: '생산기술팀',
      docNum: 'HBP-생산기술팀-2026-041',
      openingLines: ['품질관리부장 주재로 회의 개최','참석 인원 확인 및 회의 목적 공유'],
      agendaDiscussions: [
        { lines: ['한지원 선임: 표면 결함률 2월 0.14% → 3월 0.19% 상승, 윤활유 도포량 편차가 주요 원인 후보.','유강민 책임: 진동 데이터상 슬라이드 가이드 마모 징후 — 복합 요인 판단.','백승호 부장: 윤활 관리 기준 SOP 반영 및 한도견본 재검토 병행 지시.'],
          conclusion: '윤활 자동화 장치 3번 프레스 우선 적용 — 4월 말 효과 검증 후 전 라인 확대' },
        { lines: ['유강민 책임: 진동 알람 임계치 4.5 → 3.5mm/s 하향안 검토 완료, 오탐 증가 주 2건 이내 예상.','박태윤 책임: 임계치 하향과 함께 알람 대응 절차(1시간 이내 점검 착수) 표준화 제안.'],
          conclusion: '예지보전 진동 임계치 3.5mm/s 하향 확정, 4월 오탐률 모니터링' },
      ],
      decisions: [
        '윤활 자동화 장치 3번 프레스 시범 적용 — 4월 말 표면 결함률 0.12% 이하 검증 후 전 라인 확대',
        '예지보전 진동 알람 임계치 4.5 → 3.5mm/s 하향 확정 (3/20 적용)',
        'SOP-PR-011 윤활 관리 조항 개정안 2026.04.15. 이전 완료 후 교육 실시',
      ],
      specialNotes: ['차기 회의: 2026년 3월 27일(금) 14:00 예정','임계치 조정 오탐률 모니터링 결과는 서면으로 공람 예정'],
      footerText: '본 회의록은 한빛정밀 GENOS AI 회의록 에이전트 v1.0에 의해 자동 생성되었으며, 담당자 검토 후 확정됩니다.',
      logoAlt: 'HBP 한빛정밀',
      resultText: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                      회   의   록
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ 회  의  명 : 프레스 라인 표면 결함 개선 대책 회의
□ 일      시 : 2026년 3월 14일 (토) 14:00 ~ 15:30
□ 장      소 : 아산공장 2층 회의실 (201호)
□ 주      재 : 품질관리부장 백승호
□ 참 석 자  : 생산기술팀 책임 박태윤, 품질관리부 선임 한지원,
               설비보전팀 책임 유강민

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 개회 (14:00)
   - 품질관리부장 주재로 회의 개최
   - 참석 인원 확인 및 회의 목적 공유

2. 안건 토의

   [안건 1] 3번 프레스 표면 결함 증가 원인 분석 및 대책
   ─────────────────────────────────────
   ▸ 한지원 선임 : 표면 결함 발생률이 2월 0.14%에서 3월 0.19%로
     상승. 윤활유 도포량 편차가 주요 원인 후보로 확인됨.
   ▸ 유강민 책임 : 진동 센서 데이터상 슬라이드 가이드 마모 징후
     관측. 윤활 편차와 복합 요인으로 판단됨.
   ▸ 백승호 부장 : 고객 클레임 전 단계에서 윤활 관리 기준을
     작업표준(SOP)에 반영하고 한도견본 재검토 병행 지시.
   ▸ 결 론 : 윤활 자동화 장치 3번 프레스 우선 적용 추진.

   [안건 2] 예지보전 알람 임계치 조정안 검토
   ─────────────────────────────────────
   ▸ 유강민 책임 : 진동 알람 임계치 4.5mm/s → 3.5mm/s 하향안
     검토 완료. 오탐 증가는 주 2건 이내로 예상됨.
   ▸ 박태윤 책임 : 알람 발생 시 1시간 이내 점검 착수 절차를
     함께 표준화할 것을 제안함.
   ▸ 결 론 : 임계치 3.5mm/s 하향 확정, 3월 20일 적용.

3. 결정 사항
   ① 윤활 자동화 장치 시범 적용 : 3번 프레스, 4월 말 효과 검증
   ② 예지보전 진동 임계치 하향 : 3.5mm/s (2026. 03. 20. 적용)
   ③ SOP-PR-011 윤활 관리 조항 개정 : 4월 15일까지 완료

4. 조치 사항
   ┌──┬──────────────────────────────┬──────────┬───────────┐
   │번호│ 내              용           │ 담 당 자 │ 완료 기한 │
   ├──┼──────────────────────────────┼──────────┼───────────┤
   │ 1 │ 윤활 자동화 장치 사양·발주    │ 유강민   │ 03. 31.  │
   │ 2 │ 표면 결함 한도견본 재검토     │ 한지원   │ 03. 25.  │
   │ 3 │ SOP 윤활 관리 조항 개정안     │ 박태윤   │ 04. 15.  │
   │ 4 │ 오탐률 모니터링 결과 보고     │ 유강민   │ 04. 30.  │
   └──┴──────────────────────────────┴──────────┴───────────┘

5. 특이사항
   - 차기 회의 : 2026년 3월 27일 (금) 14:00 예정
   - 임계치 조정 오탐률 모니터링 결과 서면 공람 예정

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
작성자 : GENOS AI 회의록 에이전트 v1.0
검토자 : ___________________  (서명)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      apvLine: [
        { name: '박태윤', dept: '생산기술팀', title: '책임',   role: '작성자' },
        { name: '정재호', dept: '생산기술팀', title: '팀장',   role: '검토자' },
        { name: '오세창', dept: '생산본부',   title: '본부장', role: '승인자' },
      ],
    },
    /* ── 도면·성적서 OCR 에이전트 ── */
    "agent-ocr": {
      sampleFiles: [
        { name: '수입검사_성적서_스캔.pdf', size: '2.1MB', pages: 3, type: 'pdf' },
        { name: '부품_도면_HB-4521.jpg',    size: '1.3MB', pages: 1, type: 'img' },
      ],
      docModeOptions: [
        { value: 'standard',     label: '표준 모드',       desc: '범용 문서 인식' },
        { value: 'compensation', label: '검사성적서 특화', desc: 'KS 검사 양식 최적화' },
      ],
      specialModeKeyword: 'KS Q ISO 2859-1',
      specialModeDesc: '검사 양식 자동 적용 · 측정값 테이블 구조화 · 공차 판정 연동',
      specialModeBadge: '검사성적서 모드',
      extractedText: `수입검사 성적서

문서번호: 품질관리부-2026-검사-0112
작성일자: 2026년 3월 5일
담당자: 한지원 선임 (품질관리부 수입검사파트)
협력사: 대성금속(주) — 담당 정우성 (010-3924-7716)
사업자번호: 613-81-24578

1. 검사 개요

본 성적서는 2026년 3월 5일 입고된 SUS304 브래킷(품목코드 MAT-BRK-2041) 로트 LOT-260305-A의 수입검사 결과를 기록한 문서입니다. 검사 수량은 총 120EA 중 발췌 13EA(KS Q ISO 2859-1, G-II, AQL 1.0)입니다.

2. 검사 항목 및 기준

주요 관리 치수는 도면 HB-4521 Rev.C 기준이며, 전장 84.50±0.10mm, 홀 피치 42.00±0.05mm, 두께 2.00±0.02mm를 적용합니다.

3. 측정 결과

(1) 치수 검사
- 전장: 84.47~84.53mm (13EA 전수 합격)
- 홀 피치: 41.97~42.03mm (13EA 전수 합격)
- 두께: 1.99~2.01mm (13EA 전수 합격)

(2) 외관 검사
- 표면 스크래치 경미 1건 — 한도견본 이내 판정

4. 판정 의견

치수·외관 전 항목 합격 기준을 충족하여 로트 합격으로 판정합니다. 두께 측정값이 하한에 근접(Cpk 1.12)하므로 차기 3개 로트 연속 전수 확인을 권고합니다.

5. 첨부 자료

붙임 1. 치수 측정 데이터 시트
붙임 2. 도면 HB-4521 Rev.C (별지)
붙임 3. 협력사 자체 검사 성적서`,
      maskedText: `수입검사 성적서

문서번호: 품질관리부-2026-검사-0112
작성일자: 2026년 3월 5일
담당자: ■■■ 선임 (품질관리부 수입검사파트)
협력사: ■■금속(주) — 담당 ■■■ (010-****-****)
사업자번호: ***-**-*****

1. 검사 개요

본 성적서는 2026년 3월 5일 입고된 SUS304 브래킷(품목코드 MAT-BRK-2041) 로트 LOT-260305-A의 수입검사 결과를 기록한 문서입니다. 검사 수량은 총 120EA 중 발췌 13EA(KS Q ISO 2859-1, G-II, AQL 1.0)입니다.

2. 검사 항목 및 기준

주요 관리 치수는 도면 HB-4521 Rev.C 기준이며, 전장 84.50±0.10mm, 홀 피치 42.00±0.05mm, 두께 2.00±0.02mm를 적용합니다.

3. 측정 결과

(1) 치수 검사
- 전장: 84.47~84.53mm (13EA 전수 합격)
- 홀 피치: 41.97~42.03mm (13EA 전수 합격)
- 두께: 1.99~2.01mm (13EA 전수 합격)

(2) 외관 검사
- 표면 스크래치 경미 1건 — 한도견본 이내 판정

4. 판정 의견

치수·외관 전 항목 합격 기준을 충족하여 로트 합격으로 판정합니다. 두께 측정값이 하한에 근접(Cpk 1.12)하므로 차기 3개 로트 연속 전수 확인을 권고합니다.

5. 첨부 자료

붙임 1. 치수 측정 데이터 시트
붙임 2. 도면 HB-4521 Rev.C (별지)
붙임 3. 협력사 자체 검사 성적서`,
      maskLog: [
        { type: '성명',       original: '한지원 · 정우성',  masked: '■■■',          pos: '담당자·협력사 담당 필드' },
        { type: '연락처',     original: '010-3924-7716',   masked: '010-****-****', pos: '협력사 담당' },
        { type: '사업자번호', original: '613-81-24578',    masked: '***-**-*****',  pos: '협력사 정보' },
        { type: '협력사명',   original: '대성금속(주)',     masked: '■■금속(주)',    pos: '협력사 필드' },
      ],
      tableData: {
        headers: ['항목','도면 치수','공차','측정 평균','판정','측정기'],
        rows: [
          ['전장',   '84.50',     '±0.10', '84.50', '합격', '디지털 캘리퍼스'],
          ['홀 피치','42.00',     '±0.05', '42.00', '합격', '3차원 측정기(CMM)'],
          ['두께',   '2.00',      '±0.02', '1.995', '합격', '마이크로미터'],
          ['홀 직경','6.50',      '±0.03', '6.51',  '합격', '핀 게이지'],
          ['평면도', '0.05 이하', '—',     '0.03',  '합격', '3차원 측정기(CMM)'],
        ],
      },
      tableCaption: '감지된 표 — 치수 측정 결과',
      confidenceMap: [
        { line: '수입검사 성적서',                      score: 99.8, level: 'high' },
        { line: '문서번호: 품질관리부-2026-검사-0112',  score: 99.1, level: 'high' },
        { line: '작성일자: 2026년 3월 5일',             score: 98.7, level: 'high' },
        { line: '담당자: 한지원 선임',                  score: 99.2, level: 'high' },
        { line: '1. 검사 개요',                        score: 99.5, level: 'high' },
        { line: '로트 LOT-260305-A의 수입검사 결과',    score: 97.8, level: 'high' },
        { line: '전장 84.50±0.10mm, 홀 피치 42.00±0.05mm', score: 96.4, level: 'high' },
        { line: '두께: 1.99~2.01mm (13EA 전수 합격)',   score: 94.2, level: 'med' },
        { line: '4. 판정 의견',                        score: 99.3, level: 'high' },
        { line: '붙임 1. 치수 측정 데이터 시트',        score: 98.6, level: 'high' },
      ],
    },
    /* ── MES 데이터 조회 에이전트 (key 계약: building=설비 / land=자재 / lup=라인 배치) ── */
    "agent-dbquery": {
      headerTitle: 'MES 설비·생산 데이터 조회',
      headerSubtitle: '설비 대장 · 자재 대장 · 라인 배치 현황 자연어 검색',
      dbStatusLabel: 'MES DB 연결됨',
      emptyTitle: 'MES 생산 데이터를 자연어로 조회하세요',
      dbSources: [
        { key: 'building', label: '설비 대장',      desc: '설비명·형식·가동시간·도입연도' },
        { key: 'land',     label: '자재 대장',      desc: '품목코드·재질·규격·현재고' },
        { key: 'lup',      label: '라인 배치 현황', desc: '라인·공정 구분·작업 제한사항' },
      ],
      permissionLevels: [
        { id: 'general',   label: '일반',       desc: '공개 데이터 + 설비 기본 정보',      badge: 'bg-slate-100 text-slate-600' },
        { id: 'manager',   label: '관리자',     desc: '협력사 단가 + 구매 이력 포함',      badge: 'bg-blue-100 text-blue-700' },
        { id: 'evaluator', label: '품질책임자', desc: '전체 데이터 + 원가 정보 포함',      badge: 'bg-violet-100 text-violet-700' },
      ],
      permissionNotices: {
        general:   '공개 정보(설비번호·설비명·공정·가동시간)에 한해 조회 가능합니다.',
        manager:   '협력사 단가 및 구매 이력이 포함됩니다.',
        evaluator: '전체 데이터(단가·원가·수율·검사 이력) 조회 가능 — 영업비밀보호지침 준수 필요.',
      },
      queryHistory: [
        { id: 1, query: '화성공장 CNC 라인 2018년 이후 도입 설비 현황',   date: '2026-03-31 16:42', rows: 12, ms: '0.31초' },
        { id: 2, query: 'SUS304 계열 자재 현재고 및 협력사 단가',          date: '2026-03-30 11:18', rows: 8,  ms: '0.55초' },
        { id: 3, query: '2공장 프레스 라인 배치 및 작업 제한사항',         date: '2026-03-28 09:05', rows: 23, ms: '0.22초' },
        { id: 4, query: '법정 안전검사 기한 초과 설비 현황',               date: '2026-03-25 14:30', rows: 5,  ms: '0.18초' },
      ],
      quickQueries: [
        '화성공장 CNC 머시닝센터 가동 현황',
        'SUS304 자재 현재고 및 협력사 단가',
        '2공장 프레스 라인 배치 현황',
        '안전검사 기한 초과 설비 조회',
      ],
      buildingRows: [
        { jibun: 'PRS-108', buildingName: '프레스 100t #8',       structure: '크랭크 프레스', yongdo: '프레스 성형', area: 61050, floor: '군산 프레스동',  year: 2009, status: '위반' },
        { jibun: 'PRS-201', buildingName: '프레스 200t #1',       structure: '크랭크 프레스', yongdo: '프레스 성형', area: 52180, floor: '아산 프레스동',  year: 2014, status: '정상' },
        { jibun: 'INJ-105', buildingName: '사출성형기 350t #5',   structure: '전동식',        yongdo: '사출 성형',   area: 44510, floor: '창원2 사출동',   year: 2016, status: '정상' },
        { jibun: 'CNC-M09', buildingName: 'CNC 머시닝센터 #9',    structure: '수직형 3축',    yongdo: '정밀 가공',   area: 38420, floor: '화성 A베이',     year: 2018, status: '정상' },
        { jibun: 'WLD-310', buildingName: '로봇 용접기 #10',      structure: '6축 다관절',    yongdo: '용접',        area: 33260, floor: '울산 조립동',    year: 2020, status: '정상' },
        { jibun: 'GRD-042', buildingName: '평면연삭기 #2',        structure: '왕복대형',      yongdo: '연삭',        area: 29840, floor: '구미 B베이',     year: 2017, status: '정상' },
        { jibun: 'CNC-M12', buildingName: 'CNC 머시닝센터 #12',   structure: '수평형 5축',    yongdo: '정밀 가공',   area: 21730, floor: '화성 A베이',     year: 2021, status: '정상' },
        { jibun: 'PRS-203', buildingName: '프레스 400t #3',       structure: '서보 프레스',   yongdo: '프레스 성형', area: 18920, floor: '아산 프레스동',  year: 2022, status: '정상' },
      ],
      landRows: [
        { jibun: 'MAT-SUS304-T2',  jimok: 'SUS304', area: 1240, ownership: '법인',   zoning: '판재 2.0T',     pnu: 'M-2026-104120', landPrice: 8450 },
        { jibun: 'MAT-AL6061-R30', jimok: 'AL6061', area: 860,  ownership: '법인',   zoning: '환봉 Ø30',      pnu: 'M-2026-104121', landPrice: 6120 },
        { jibun: 'MAT-S45C-T5',    jimok: 'S45C',   area: 2210, ownership: '법인',   zoning: '판재 5.0T',     pnu: 'M-2026-104122', landPrice: 3980 },
        { jibun: 'MAT-POM-R20',    jimok: 'POM',    area: 430,  ownership: '사업장', zoning: '환봉 Ø20',      pnu: 'M-2026-104123', landPrice: 5240 },
        { jibun: 'MAT-BRK-2041',   jimok: 'SUS304', area: 120,  ownership: '사업장', zoning: '브래킷 반제품', pnu: 'M-2026-104124', landPrice: 12800 },
      ],
      lupRows: [
        { jibun: 'L2-PR-01', zoning: '프레스 성형', district: '고소음 관리구역', restrictions: ['귀마개 착용 의무','금형 교체 시 LOTO 절차'],        fireZone: '' },
        { jibun: 'L2-PR-03', zoning: '프레스 성형', district: '',               restrictions: ['최대 하중 400t','양수조작 방호장치 확인'],           fireZone: '' },
        { jibun: 'L1-CN-02', zoning: '정밀 가공',   district: '',               restrictions: ['절삭유 비산 방호커버','칩 컨베이어 가동 확인'],       fireZone: '' },
        { jibun: 'L3-WL-01', zoning: '용접',        district: '방폭 관리구역',   restrictions: ['용접 흄 국소배기 가동','가연물 5m 이격'],            fireZone: '화기작업 허가구역' },
        { jibun: 'L3-AS-04', zoning: '조립',        district: '',               restrictions: ['지게차 통행 구분선 준수'],                           fireZone: '' },
      ],
      sqlMap: {
        building: `SELECT e.equip_no, e.equip_name, e.equip_type,
       e.process_code, e.run_hours, e.location,
       e.install_year, e.inspect_status
FROM equipment_master e
  JOIN plant_info p ON e.plant_cd = p.plant_cd
WHERE p.plant_nm = '화성공장'
  AND e.install_year >= 2014
ORDER BY e.run_hours DESC
LIMIT 50;`,
        land: `SELECT m.item_cd, m.material, m.stock_qty,
       m.purchase_type, m.spec,
       m.master_no, m.vendor_price
FROM material_master m
WHERE m.material LIKE 'SUS%'
  AND m.stock_qty <= 2500
ORDER BY m.stock_qty ASC
LIMIT 50;`,
        lup: `SELECT l.line_cd, l.process_type, l.special_zone,
       l.restriction_list, l.hot_work_zone
FROM line_layout l
WHERE l.plant_cd = 'P2'
  AND l.process_type IS NOT NULL
ORDER BY l.line_cd ASC
LIMIT 50;`,
      },
      statsBySource: {
        building: [
          { label: '총 설비',       value: '8대',      icon: 'table',  color: 'text-blue-600' },
          { label: '검사기한 초과', value: '1대',      icon: 'filter', color: 'text-red-500' },
          { label: '평균 가동시간', value: '37,489h',  icon: 'trend',  color: 'text-teal-600' },
          { label: '조회시간',      value: '0.31초',   icon: 'clock',  color: 'text-slate-500' },
        ],
        land: [
          { label: '총 품목',       value: '5건',      icon: 'table',  color: 'text-blue-600' },
          { label: '법인 일괄구매', value: '3건',      icon: 'shield', color: 'text-violet-600' },
          { label: '평균 재고',     value: '972EA',    icon: 'trend',  color: 'text-teal-600' },
          { label: '조회시간',      value: '0.55초',   icon: 'clock',  color: 'text-slate-500' },
        ],
        lup: [
          { label: '총 라인',       value: '5개',      icon: 'table',  color: 'text-blue-600' },
          { label: '공정 구분',     value: '4종',      icon: 'filter', color: 'text-amber-600' },
          { label: '특별관리구역',  value: '2건',      icon: 'trend',  color: 'text-teal-600' },
          { label: '조회시간',      value: '0.22초',   icon: 'clock',  color: 'text-slate-500' },
        ],
      },
      buildingColumns: [
        { key: 'jibun',        label: '설비번호' },
        { key: 'buildingName', label: '설비명' },
        { key: 'structure',    label: '형식' },
        { key: 'yongdo',       label: '담당 공정' },
        { key: 'area',         label: '누적 가동시간(h)' },
        { key: 'floor',        label: '설치 위치' },
        { key: 'year',         label: '도입연도' },
        { key: 'status',       label: '검사 상태' },
      ],
      landColumns: ['품목코드','재질','현재고(EA)','구매 주체','규격','자재마스터 번호','협력사 단가(원/EA)'],
      lupColumns: ['라인코드','공정 구분','특별관리구역','작업 제한사항','화기작업 구역'],
      restrictedNotice: '협력사 단가 정보는 관리자 이상 권한에서 조회 가능합니다.',
    },
    /* ── 자재코드 표준화 에이전트 (제조 재해석: 사업장·협력사 주소/기준정보 표준화. modeTypes.m 키 고정) ── */
    "agent-address": {
      defaultAddress: '경남 창원시 성산구 외동 853-4',
      addressPlaceholder: '예: 경남 창원시 성산구 외동 853-4',
      quickExamples: ['충남 아산시 둔포면 아산밸리로 177','경북 구미시 공단동 249-3','전북 군산시 소룡동 1578-2'],
      defaultAptQuery: '창원본사공장 프레스동',
      aptPlaceholder: '예: 창원본사공장 프레스동',
      aptQuickExamples: ['창원본사공장 프레스동','아산공장 가공 1동','구미공장 조립동'],
      aptLookupResult: {
        query: '창원본사공장 프레스동',
        complexName: '한빛정밀 창원본사공장',
        complexCode: 'HBP-1100',
        address: '경상남도 창원시 성산구 외동 853-4',
        roadAddress: '경상남도 창원시 성산구 공단로474번길 36',
        legalDong: '외동',
        legalCode: '4812510300',
        totalHouseholds: 86,
        totalBuildings: 4,
        buildings: [
          { dongName: '가공 1동', dongCode: 'HBP-1100-MC1', floors: 2, households: 32 },
          { dongName: '가공 2동', dongCode: 'HBP-1100-MC2', floors: 2, households: 24 },
          { dongName: '프레스동', dongCode: 'HBP-1100-PRS', floors: 1, households: 14 },
          { dongName: '조립동',   dongCode: 'HBP-1100-ASM', floors: 2, households: 16 },
        ],
        units: [
          { floor: 1, hoName: 'PR-01베이', hoCode: 'HBP-1100-PRS-0101', area: 420.0, type: '400t 서보' },
          { floor: 1, hoName: 'PR-02베이', hoCode: 'HBP-1100-PRS-0102', area: 420.0, type: '200t 크랭크' },
          { floor: 1, hoName: 'PR-03베이', hoCode: 'HBP-1100-PRS-0103', area: 360.0, type: '200t 크랭크' },
          { floor: 1, hoName: 'PR-04베이', hoCode: 'HBP-1100-PRS-0104', area: 360.0, type: '100t 크랭크' },
          { floor: 1, hoName: 'QC-01실',   hoCode: 'HBP-1100-PRS-0105', area: 120.0, type: '검사실' },
          { floor: 1, hoName: 'DIE-01실',  hoCode: 'HBP-1100-PRS-0106', area: 240.0, type: '금형 보관' },
        ],
      },
      singleResult: {
        road: '경상남도 창원시 성산구 공단로474번길 36',
        jibun: '경상남도 창원시 성산구 외동 853-4',
        zip: '51574',
        lat: '35.1932',
        lng: '128.7015',
        buildType: '공장',
        adminDong: '성주동',
        legalDong: '외동',
        legalCode: '4812510300',
        adminCode: '4812556000',
        status: '완전매칭',
        complexName: '한빛정밀 창원본사공장',
        complexCode: 'HBP-1100',
      },
      sampleBatch: `경기 화성시 우정읍 화성공장길 88
충남 아산시 둔포면 아산밸리로 177
경북 구미시 공단동 249-3
전북 군산시 소룡동 1578-2
울산 북구 효암로 339`,
      batchResults: [
        { input: '경기 화성시 우정읍 화성공장길 88',   road: '경기도 화성시 우정읍 화성공장길 88',        jibun: '경기도 화성시 우정읍 조암리 1122-7',       zip: '18315', legalCode: '4159034021', adminCode: '4159034000', legalDong: '조암리',  adminDong: '우정읍',  conf: 98.9, status: '완전매칭' },
        { input: '충남 아산시 둔포면 아산밸리로 177',  road: '충청남도 아산시 둔포면 아산밸리로 177',      jibun: '충청남도 아산시 둔포면 석곡리 1451',       zip: '31409', legalCode: '4420031024', adminCode: '4420031000', legalDong: '석곡리',  adminDong: '둔포면',  conf: 99.0, status: '완전매칭' },
        { input: '경북 구미시 공단동 249-3',           road: '경상북도 구미시 수출대로 152',               jibun: '경상북도 구미시 공단동 249-3',             zip: '39368', legalCode: '4719012600', adminCode: '4719059000', legalDong: '공단동',  adminDong: '공단동',  conf: 97.6, status: '완전매칭' },
        { input: '전북 군산시 소룡동 1578-2',          road: '전북특별자치도 군산시 외항로 385',           jibun: '전북특별자치도 군산시 소룡동 1578-2',      zip: '54002', legalCode: '5213012400', adminCode: '5213059500', legalDong: '소룡동',  adminDong: '소룡동',  conf: 95.8, status: '부분매칭' },
        { input: '울산 북구 효암로 339',               road: '울산광역시 북구 효암로 339',                 jibun: '울산광역시 북구 효문동 641-5',             zip: '44252', legalCode: '3120010500', adminCode: '3120052000', legalDong: '효문동',  adminDong: '효문동',  conf: 98.4, status: '완전매칭' },
      ],
      modeTypes: [
        { m: 'single',  icon: '📍', label: '단일 주소',   desc: '협력사·사업장 비정형 주소 1건을 도로명·우편번호·좌표로 변환', color: 'rose' },
        { m: 'batch',   icon: '📋', label: '일괄 처리',   desc: '협력사 주소 목록을 한 번에 붙여넣거나 파일로 일괄 표준화',     color: 'orange' },
        { m: 'ocr',     icon: '🔍', label: 'OCR 파일',    desc: '검사성적서·거래명세서에서 협력사 주소 자동 추출',              color: 'teal' },
        { m: 'reverse', icon: '🔢', label: '코드 역조회', desc: '법정동·행정동코드로 사업장 정식 주소를 역방향 조회',           color: 'purple' },
      ],
      ocrDocText: `[협력사 실사 보고서]
문서번호: 구매조달팀-2026-실사-0027
실사일자: 2026.03.12  담당: 박태윤(생산기술팀)

1. 실사 개요
실사 대상: 1차 협력사 신규 등록 심사
본사 기준지: 경남 창원시 성산구 외동 853-4

2. 실사 대상 협력사
(1) 대성금속(주): 경기 화성시 우정읍 화성공장길 88
    품목: SUS 판재 | 등급 후보 A
(2) 진영테크: 경북 구미시 공단동 249-3
    품목: 정밀 절삭 부품 | 등급 후보 B

3. 물류 거점 확인
   거점 A: 전북 군산시 소룡동 1578-2
   거점 B: 울산 북구 효암로 339

4. 비고
   주소 표준화 후 협력사 마스터 일괄 등록 예정`,
      ocrAddrResults: [
        { raw: '경남 창원시 성산구 외동 853-4',      ctx: '본사 기준지', ocrConf: 98.3, road: '경상남도 창원시 성산구 공단로474번길 36', jibun: '경상남도 창원시 성산구 외동 853-4',   zip: '51574', lat: '35.1932', lng: '128.7015', legalCode: '4812510300', legalDong: '외동',   adminCode: '4812556000', adminDong: '성주동', matchConf: 98.7, status: '완전매칭' },
        { raw: '경기 화성시 우정읍 화성공장길 88',    ctx: '협력사 (1)',  ocrConf: 97.1, road: '경기도 화성시 우정읍 화성공장길 88',      jibun: '경기도 화성시 우정읍 조암리 1122-7',  zip: '18315', lat: '37.0762', lng: '126.8114', legalCode: '4159034021', legalDong: '조암리', adminCode: '4159034000', adminDong: '우정읍', matchConf: 98.9, status: '완전매칭' },
        { raw: '경북 구미시 공단동 249-3',            ctx: '협력사 (2)',  ocrConf: 96.8, road: '경상북도 구미시 수출대로 152',            jibun: '경상북도 구미시 공단동 249-3',        zip: '39368', lat: '36.1044', lng: '128.3812', legalCode: '4719012600', legalDong: '공단동', adminCode: '4719059000', adminDong: '공단동', matchConf: 97.6, status: '완전매칭' },
        { raw: '전북 군산시 소룡동 1578-2',           ctx: '물류 거점 A', ocrConf: 94.2, road: '전북특별자치도 군산시 외항로 385',        jibun: '전북특별자치도 군산시 소룡동 1578-2', zip: '54002', lat: '35.9884', lng: '126.6274', legalCode: '5213012400', legalDong: '소룡동', adminCode: '5213059500', adminDong: '소룡동', matchConf: 95.8, status: '부분매칭' },
        { raw: '울산 북구 효암로 339',                ctx: '물류 거점 B', ocrConf: 99.1, road: '울산광역시 북구 효암로 339',              jibun: '울산광역시 북구 효문동 641-5',        zip: '44252', lat: '35.5934', lng: '129.3621', legalCode: '3120010500', legalDong: '효문동', adminCode: '3120052000', adminDong: '효문동', matchConf: 98.4, status: '완전매칭' },
      ],
      ocrFeatureLabel: '검사성적서·거래명세서 특화',
      codeLookup: {
        '4812510300': { type: '법정동', dong: '외동',   road: '경상남도 창원시 성산구 공단로474번길 36', jibun: '경상남도 창원시 성산구 외동 853-4', zip: '51574', legalCode: '4812510300', adminCode: '4812556000', adminDong: '성주동', region: '경상남도 > 창원시 성산구 > 외동' },
        '4812556000': { type: '행정동', dong: '성주동', road: '경상남도 창원시 성산구 공단로474번길 36', jibun: '경상남도 창원시 성산구 외동 853-4', zip: '51574', legalCode: '4812510300', adminCode: '4812556000', legalDong: '외동',   region: '경상남도 > 창원시 성산구 > 성주동' },
        '4159034021': { type: '법정동', dong: '조암리', road: '경기도 화성시 우정읍 화성공장길 88',      jibun: '경기도 화성시 우정읍 조암리 1122-7', zip: '18315', legalCode: '4159034021', adminCode: '4159034000', adminDong: '우정읍', region: '경기도 > 화성시 > 우정읍 조암리' },
        '4159034000': { type: '행정동', dong: '우정읍', road: '경기도 화성시 우정읍 화성공장길 88',      jibun: '경기도 화성시 우정읍 조암리 1122-7', zip: '18315', legalCode: '4159034021', adminCode: '4159034000', legalDong: '조암리', region: '경기도 > 화성시 > 우정읍' },
        '4719012600': { type: '법정동', dong: '공단동', road: '경상북도 구미시 수출대로 152',            jibun: '경상북도 구미시 공단동 249-3',       zip: '39368', legalCode: '4719012600', adminCode: '4719059000', adminDong: '공단동', region: '경상북도 > 구미시 > 공단동' },
        '4719059000': { type: '행정동', dong: '공단동', road: '경상북도 구미시 수출대로 152',            jibun: '경상북도 구미시 공단동 249-3',       zip: '39368', legalCode: '4719012600', adminCode: '4719059000', legalDong: '공단동', region: '경상북도 > 구미시 > 공단동(행정)' },
      },
      codeQuickExamples: [
        { code: '4812510300', label: '창원 외동 (법정)' },
        { code: '4812556000', label: '창원 성주동 (행정)' },
        { code: '4719012600', label: '구미 공단동 (법정)' },
      ],
    },
    /* ── 기술문서 요약 에이전트 ── */
    "agent-summary": {
      docAName: '프레스_작업표준서_SOP-PR-011.pdf',
      docBName: '프레스_작업표준서_SOP-PR-011_개정안.pdf',
      resultDocLabel: '프레스_작업표준서_SOP-PR-011.pdf',
      resultCompareLabel: 'SOP-PR-011.pdf  vs  SOP-PR-011_개정안.pdf',
      structureHints: ['제1장 총칙','제2장 작업 준비','제3장 운전 및 점검','제4장 금형 교체...'],
      summaryStats: [
        { label: '원문',   val: '15,820자' },
        { label: '요약',   val: '780자' },
        { label: '압축률', val: '95.1%' },
        { label: '섹션',   val: '5개' },
      ],
      compareStats: [
        { label: '비교 항목', val: '8개' },
        { label: '변경 항목', val: '6개' },
        { label: '동일 항목', val: '2개' },
        { label: '주요 차이', val: '기준 강화' },
      ],
      compareRows: [
        { category: '적용 범위',     docA: '2공장 프레스 라인 전체 (6호기)',  docB: '전 사업장 프레스 라인 (14호기)',        diff: '범위 확대' },
        { category: '금형 교체 기준', docA: '타수 50만 타 도달 시',           docB: '타수 50만 타 도달 시 (동일)',            diff: '동일' },
        { category: '일상점검 항목', docA: '8개 항목',                        docB: '12개 항목 (4개 추가: 센서 진단)',        diff: '항목 증가' },
        { category: '방호장치 점검', docA: '주 1회 작동 확인',                docB: '매 교대 시 작동 확인',                   diff: '기준 강화' },
        { category: '이상 진동 임계', docA: '4.5mm/s 초과 시 정지',           docB: '3.5mm/s 초과 시 알람 + 정지',            diff: '임계치 하향' },
        { category: '셋업 표준시간', docA: '금형 교체 45분',                  docB: '25분 (SMED 표준 적용)',                  diff: '시간 단축' },
        { category: '기록 보존',     docA: '점검표 3년 보존',                 docB: 'MES 전자기록 5년 보존',                  diff: '기간 연장' },
        { category: '승인 절차',     docA: '생산기술팀장 승인',               docB: '생산기술팀장 승인 (동일)',               diff: '동일' },
      ],
      docALabel: '문서 A (현행)',
      docBLabel: '문서 B (개정안)',
      compareFootnote: 'Llama-3-Korean 70B 분석 · 주요 변경: 점검 항목 확대, 방호장치 점검 주기 강화, 진동 임계치 하향',
      tableSummaryRows: [
        { ch: '제1장 총칙',        content: '프레스 작업 안전·품질 확보를 위한 표준 절차 및 적용 범위 규정', key: '적용: 프레스 6호기' },
        { ch: '제2장 작업 준비',   content: '작업 전 TBM · 방호장치 점검 · 재료 이물 확인 8개 항목',         key: '방호장치 매 교대 점검' },
        { ch: '제3장 운전·점검',   content: '슬라이드·클러치 이상 감시, 진동 임계 초과 시 정지',             key: '임계 3.5mm/s' },
        { ch: '제4장 금형 교체',   content: 'LOTO 절차 · 안전블록 설치 · SMED 표준시간 25분',                key: '타수 50만 타 기준' },
        { ch: '제5장 이상·기록',   content: '부적합 발생 시 라인 정지 · MES 전자기록 5년 보존',              key: '5년 보존' },
      ],
      keywords: [
        { word: '프레스',     pct: 94 }, { word: '금형 교체',  pct: 88 }, { word: '방호장치',   pct: 81 },
        { word: '작업표준',   pct: 76 }, { word: 'SMED',       pct: 72 }, { word: '일상점검',   pct: 68 },
        { word: 'LOTO',       pct: 64 }, { word: '안전블록',   pct: 59 }, { word: '슬라이드',   pct: 54 },
        { word: '타수 관리',  pct: 49 }, { word: '위험성평가', pct: 45 }, { word: '예지보전',   pct: 41 },
      ],
      sections: [
        { id: '1', title: '제1장 총칙',        children: ['제1조 목적','제2조 용어 정의','제3조 적용 범위'] },
        { id: '2', title: '제2장 작업 준비',   children: ['제4조 작업 전 안전회의(TBM)','제5조 방호장치 점검','제6조 재료·금형 확인'] },
        { id: '3', title: '제3장 운전 및 점검', children: ['제7조 운전 조건','제8조 일상점검 항목','제9조 이상 진동 관리'] },
        { id: '4', title: '제4장 금형 교체',   children: ['제10조 LOTO 절차','제11조 안전블록 설치','제12조 셋업(SMED) 표준'] },
        { id: '5', title: '제5장 이상 조치 및 기록', children: ['제13조 부적합 발생 시 조치','제14조 기록 관리'] },
      ],
      summaryContent: `**제1장 총칙**
본 작업표준서는 프레스 작업의 안전과 품질 확보를 위한 표준 절차를 규정한다. 적용 대상은 2공장 프레스 라인 **6호기 전체**이며, 개정안은 전 사업장 **14호기**로 확대 적용을 예정한다.

**제2장 작업 준비**
작업 전 TBM(안전회의)을 실시하고 위험성평가 결과를 공유한다. 방호장치(양수조작식·광전자식)는 **매 교대 시** 작동을 확인하며, 재료 이물·금형 체결 상태 등 **12개 항목**을 점검한다. 점검 누락 시 라인 가동을 금지한다.

**제3장 운전 및 점검**
운전 중 슬라이드·클러치 이상음을 감시하고, 진동이 **3.5mm/s를 초과**하면 알람과 함께 설비를 정지한다. 일상점검 결과는 MES에 실시간 등록하며, 이상 발생 시 설비보전팀에 즉시 통보한다.

**제4장 금형 교체**
금형 교체는 **타수 50만 타** 도달 또는 품질 이상 시 실시한다. 교체 전 LOTO(잠금·표지) 절차를 이행하고 안전블록을 설치하며, 셋업 표준시간은 SMED 기법 적용 기준 **25분**으로 한다. 체결 볼트는 규정 토크를 준수한다.

**제5장 이상 조치 및 기록**
부적합 발생 시 라인을 정지하고 부적합품 관리 지침에 따라 식별·격리한다. 점검·교체 기록은 MES 전자기록으로 **5년간 보존**하며, 기록 관리 부실 시 관련 규정에 따라 조치한다.`,
    },
    /* ── 기술 지식 검색 에이전트 ── */
    "agent-knowledge": {
      defaultQuery: '절삭유 농도 관리 기준 및 교체 주기',
      quickQueries: ['금형 교체 안전 절차','부적합품 처리 절차','프레스 방호장치 점검 주기','출장비 정산 기준'],
      knowledgeBases: [
        { id: 'kb1', name: 'CNC 가공 작업표준(SOP)',      docs: 38, updated: '2026.01.12', icon: BookOpen,   color: 'violet' },
        { id: 'kb2', name: '한빛정밀 취업규칙',            docs: 12, updated: '2026.02.10', icon: FileText,   color: 'blue' },
        { id: 'kb3', name: '품질경영매뉴얼(ISO 9001)',     docs: 54, updated: '2025.12.01', icon: BookMarked, color: 'indigo' },
        { id: 'kb4', name: '설비 유지보수 매뉴얼',         docs: 41, updated: '2026.01.20', icon: BookOpen,   color: 'teal' },
        { id: 'kb5', name: '부적합품 관리 지침',           docs: 9,  updated: '2026.03.05', icon: FileText,   color: 'emerald' },
        { id: 'kb6', name: '안전보건관리규정',             docs: 22, updated: '2026.01.10', icon: BookOpen,   color: 'emerald' },
        { id: 'kb7', name: '수입검사 기준서',              docs: 17, updated: '2026.02.01', icon: BookOpen,   color: 'cyan' },
      ],
      defaultSelectedKbIds: ['kb1','kb2','kb3'],
      recentSearches: [
        { id: 1, query: '프레스 방호장치 점검 주기', date: '2026-03-31 16:20', results: 5 },
        { id: 2, query: '수입검사 발췌 기준',        date: '2026-03-30 10:12', results: 3 },
        { id: 3, query: 'LOTO 절차 적용 대상',       date: '2026-03-28 14:55', results: 7 },
      ],
      results: [
        {
          id: 1, title: '절삭유 농도·pH 관리 기준', source: 'CNC_가공_작업표준서_SOP-003.pdf',
          page: 4, score: 97.6, secLevel: 'C', line: 'p.4 · 2번째 문단',
          excerpt: `수용성 절삭유는 농도 8±1%, pH 8.5~9.3을 유지하여야 하며, 매 교대 시 굴절계와 pH 미터로 측정하여 점검표에 기록한다. 기준 이탈 시 원액 보충 또는 희석으로 즉시 보정한다.`,
          keywords: ['절삭유','농도 8±1%','pH','매 교대 측정'],
        },
        {
          id: 2, title: '절삭유 전량 교체 절차', source: 'CNC_가공_작업표준서_SOP-003.pdf',
          page: 6, score: 90.2, secLevel: 'C', line: 'p.6 · 1번째 문단',
          excerpt: `절삭유는 3개월 주기로 전량 교체하며, 부패취 발생·pH 8.0 미만·부유 슬러지 과다 시에는 주기와 관계없이 즉시 교체한다. 교체 작업은 설비보전팀 입회 하에 실시한다.`,
          keywords: ['전량 교체','3개월 주기','즉시 교체 조건'],
        },
        {
          id: 3, title: '폐절삭유 처리 절차 (ENV-07)', source: '환경관리지침.pdf',
          page: 12, score: 81.4, secLevel: 'S', line: 'p.12 · 3번째 문단',
          excerpt: `폐절삭유는 지정 폐기물로 분류하여 전용 보관 용기에 밀폐 보관하고, 위탁 처리 업체 인계 시 폐기물 인계서를 작성한다. 보관 기간은 45일을 초과할 수 없다.`,
          keywords: ['지정 폐기물','ENV-07','45일 보관 한도'],
        },
        {
          id: 4, title: '금속가공유 취급 시 보건조치', source: '산업안전보건기준에 관한 규칙',
          page: 3, score: 73.5, secLevel: 'O', line: 'p.3 · 제420조 본문',
          excerpt: `사업주는 금속가공유를 취급하는 작업장에 국소배기장치를 설치하고, 근로자에게 불침투성 보호장갑을 지급하여야 한다. 미스트 발생 설비에는 방호덮개를 설치한다.`,
          keywords: ['금속가공유','국소배기','보호장갑'],
        },
        {
          id: 5, title: '설비 일상점검 체크시트 작성 요령', source: '설비관리규정.pdf',
          page: 5, score: 62.4, secLevel: 'O', line: 'p.5 · 4번째 문단',
          excerpt: `일상점검 체크시트는 설비별 관리 항목을 기준으로 매 교대 작성하며, 절삭유·윤활유 상태 확인 항목을 포함한다. 작성 결과는 MES에 등록하여 이력을 관리한다.`,
          keywords: ['일상점검','체크시트','MES 등록'],
        },
      ],
      aiSummaries: {
        '절삭유 농도 관리 기준 및 교체 주기': `검색 결과 5건에 따르면, 수용성 절삭유는 농도 8±1%·pH 8.5~9.3을 유지하며 매 교대 시 측정·기록해야 합니다. 전량 교체 주기는 3개월이나 부패취·pH 8.0 미만·슬러지 과다 시 즉시 교체합니다. 폐액은 지정 폐기물 절차(ENV-07)에 따라 45일 이내 위탁 처리합니다.`,
        DEFAULT: `검색 결과를 분석한 결과, 관련 문서 5건에서 연관 내용을 찾았습니다. 상세 내용은 아래 검색 결과를 확인하세요.`,
      },
      similarDocs: [
        { title: '폐절삭유 처리 절차(ENV-07)',       source: '환경관리지침.pdf',     relevance: 84 },
        { title: '금속가공유 보건 관리 가이드',       source: '안전보건관리규정.pdf', relevance: 79 },
        { title: 'CNC 일상점검 체크시트 작성 요령',   source: '설비관리규정.pdf',     relevance: 71 },
      ],
    },
    /* ── 사규·안전규정 조회 에이전트 ── */
    "agent-internalreg": {
      regCategories: ['취업규칙','복무규정','안전보건관리규정','품질경영매뉴얼','설비관리규정','구매·계약 규정','보안정책','회계규정'],
      defaultCategories: ['취업규칙','안전보건관리규정'],
      suggestions: ['연차 사용 기준','출장비 정산','보호구 지급 기준','부적합품 처리 절차','교대근무 수당'],
      ragDocs: [
        { name: '취업규칙(2025개정).hwp',    hits: 12 },
        { name: '안전보건관리규정_2025.pdf', hits: 9 },
        { name: '출장업무처리지침.pdf',      hits: 7 },
        { name: '설비관리규정.pdf',          hits: 6 },
        { name: '품질경영매뉴얼_v4.pdf',     hits: 3 },
      ],
      apvLine: [
        { role: '작성자', name: '박태윤', dept: '생산기술팀', title: '책임' },
        { role: '검토자', name: '정재호', dept: '생산기술팀', title: '팀장' },
        { role: '승인자', name: '오세창', dept: '생산본부',   title: '본부장' },
      ],
      answerText: `설비 점검 중 산업재해가 발생한 경우, 한빛정밀 취업규칙 및 안전보건관리규정에 따라 다음 절차를 이행하여야 합니다.

1. 즉시 조치: 설비 비상정지(E-Stop) 및 LOTO(잠금·표지) 조치 후 부상자 구호조치를 하고 119(소방·구급)에 신고합니다. 부상이 경미한 경우에도 사내 의무실 진료 기록을 반드시 남겨야 합니다.

2. 기관 보고: 사고 발생 후 1시간 이내에 소속 팀장에게 유선 보고하고, 익일 업무 시작 전까지 "재해 발생 보고서"를 전자결재시스템(HBWorks)에 등록합니다. 중대재해에 해당하는 경우 고용노동부 관할 지청에 지체 없이 보고합니다.

3. 산재 처리: 업무상 재해로 인정되는 경우, 취업규칙 제44조 및 산업재해보상보험법에 따라 산재 신청을 진행합니다. 인사총무팀 복무담당에게 관련 서류(사고경위서, 진단서, 목격자 확인서)를 제출합니다.

4. 설비 처리: 재해 관련 설비에는 작업중지 표지를 부착하고, 설비보전팀·안전환경팀 합동 원인 조사가 완료되기 전까지 재가동을 금지합니다(설비관리규정 제9조). 조사 결과는 위험성평가에 반영합니다.

5. 후속 조치: 치료 종료 후 30일 이내에 결과 보고서를 제출하며, 해당 작업의 위험성평가를 재실시하고 재발 방지 대책을 수립하여 안전환경팀에 공유합니다.`,
      citations: [
        { doc: '취업규칙 제44조',           title: '산업재해 처리',       excerpt: '"업무 수행 중 재해가 발생한 경우 즉시 소속 팀장에게 보고하고 산업재해보상보험법에 따른 절차를 이행한다."' },
        { doc: '안전보건관리규정 제18조',   title: '재해 보고 및 조사',   excerpt: '"재해 발생 시 1시간 이내 팀장 보고, 익일까지 전자결재시스템(HBWorks) 등록을 원칙으로 하며, 중대재해는 관할 지청에 지체 없이 보고한다."' },
        { doc: '설비관리규정 제9조',        title: '재해 설비 재가동 제한', excerpt: '"재해와 관련된 설비는 작업중지 표지를 부착하고, 합동 원인 조사 완료 및 안전 조치 확인 전까지 재가동할 수 없다."' },
      ],
      relatedRegs: [
        { title: '취업규칙 제45조',          desc: '업무상 재해 산재보험 신청 절차 및 지원 범위' },
        { title: '안전보건관리규정 제21조',  desc: '중대재해 발생 시 작업중지 및 보고 체계' },
        { title: '출장업무처리지침 제5조',   desc: '출장비 정산 기준 및 영수증 처리 방법' },
      ],
      regHistory: [
        {
          reg: '취업규칙',
          changes: [
            { ver: '2025.03 개정', date: '2025-03-01', type: '개정',     badge: 'bg-blue-100 text-blue-700',   content: '제44조(산업재해 처리): 보고 기한 「3시간 이내」→「1시간 이내」로 단축', reason: '중대재해처벌법 대응 신속 보고 강화' },
            { ver: '2024.01 개정', date: '2024-01-01', type: '일부개정', badge: 'bg-slate-100 text-slate-600', content: '제40~45조 산재 관련 조항 전면 개정 — 근골격계 질환 업무상 재해 인정 범위 확대', reason: '산업재해보상보험법 개정 반영' },
            { ver: '2022.07 개정', date: '2022-07-01', type: '일부개정', badge: 'bg-slate-100 text-slate-600', content: '제44조 신설 — 재해 발생 시 전자결재시스템(HBWorks) 등록 의무화', reason: '디지털 문서화 체계 구축' },
          ],
        },
        {
          reg: '안전보건관리규정',
          changes: [
            { ver: '2025.09 개정', date: '2025-09-01', type: '개정',     badge: 'bg-blue-100 text-blue-700',   content: '제18조(비정형 작업): 금형 교체·정기 PM 등 비정형 작업 위험성평가 사전 실시 의무화', reason: '프레스 협착 사고 예방 강화' },
            { ver: '2024.01 개정', date: '2024-01-01', type: '일부개정', badge: 'bg-slate-100 text-slate-600', content: '제18조 개정 — 협력사 상주 작업자를 자체 인원과 동일 기준으로 관리', reason: '도급인 안전조치 의무(산안법 제63조) 반영' },
          ],
        },
        {
          reg: '설비관리규정',
          changes: [
            { ver: '2026.01 개정', date: '2026-01-01', type: '개정',     badge: 'bg-emerald-100 text-emerald-700', content: '제9조 개정 — 예지보전 알람 발생 설비의 점검 착수 기한(1시간 이내) 신설', reason: '스마트팩토리 예지보전 시스템 도입 대응' },
            { ver: '2025.01 개정', date: '2025-01-01', type: '일부개정', badge: 'bg-slate-100 text-slate-600',     content: '제12조: 금형·치공구 수리 한도 상향 (500만 → 1,000만 원)', reason: '자재·공임 단가 상승 반영' },
          ],
        },
      ],
      emptyDesc: ['취업규칙, 안전보건관리규정, 품질경영매뉴얼 등','한빛정밀 사내 규정을 검색합니다'],
      inputPlaceholder: '취업규칙, 안전규정, 품질 매뉴얼 등 내규에 대해 질문하세요 (Enter로 전송)',
      regSystemFooter: '한빛정밀 규정 관리 시스템 연동 · 최신 개정 기준 자동 반영',
      apvDocTitle: '내규 조회 결과 — 설비 점검 중 산업재해 처리 절차',
      apvDocNum: 'HBP-생산기술팀-2026-019',
    },
    /* ── 공정 데이터 분석 에이전트 ── */
    "agent-dataanalysis": {
      sampleFiles: [
        { id: 'f1', name: '프레스_불량률_2026Q1.xlsx', rows: 1248, cols: 12, size: '2.4MB' },
        { id: 'f2', name: '설비_가동실적_2025.csv',    rows: 8760, cols: 9,  size: '1.6MB' },
        { id: 'f3', name: '수입검사_측정치_2026.xlsx', rows: 312,  cols: 15, size: '0.5MB' },
      ],
      trendCaption: '설비종합효율(OEE) 구성 지표 추이 (2025.7 ~ 2026.3) · 단위: %',
      trendData: [
        { month: '2025.7',  가동률: 84.2, 성능: 90.1, 양품률: 99.42 },
        { month: '2025.8',  가동률: 83.8, 성능: 90.4, 양품률: 99.45 },
        { month: '2025.9',  가동률: 84.6, 성능: 90.8, 양품률: 99.48 },
        { month: '2025.10', 가동률: 85.1, 성능: 91.2, 양품률: 99.51 },
        { month: '2025.11', 가동률: 84.7, 성능: 91.0, 양품률: 99.49 },
        { month: '2025.12', 가동률: 85.4, 성능: 91.5, 양품률: 99.53 },
        { month: '2026.1',  가동률: 85.8, 성능: 91.8, 양품률: 99.55 },
        { month: '2026.2',  가동률: 86.2, 성능: 92.1, 양품률: 99.56 },
        { month: '2026.3',  가동률: 86.6, 성능: 92.4, 양품률: 99.58 },
      ],
      trendSeries: [{ key: '가동률', color: '#f97316' }, { key: '성능', color: '#3b82f6' }, { key: '양품률', color: '#10b981' }],
      trendDomain: [80, 102], trendRef: 85, trendRefLabel: '목표(85)',
      barTabLabel: '사업장별',
      barCaption: '사업장별 공정 불량률 (2026.3 기준) · 단위: %',
      barData: [
        { region: '화성',     불량률: 0.31 },
        { region: '아산',     불량률: 0.44 },
        { region: '구미',     불량률: 0.35 },
        { region: '군산',     불량률: 0.71 },
        { region: '울산',     불량률: 0.47 },
        { region: '창원본사', 불량률: 0.28 },
        { region: '창원2',    불량률: 0.52 },
        { region: '전사',     불량률: 0.42 },
      ],
      barXKey: 'region', barValueKey: '불량률', barUnit: '%',
      stackTabLabel: '클레임',
      stackCaption: '고객 클레임 접수·처리·미결 현황 (2026년 분기) · 단위: 건',
      stackData: [
        { month: '1월', 접수: 9,  처리: 8, 미결: 1 },
        { month: '2월', 접수: 7,  처리: 6, 미결: 2 },
        { month: '3월', 접수: 11, 처리: 9, 미결: 4 },
      ],
      stackSeries: [{ key: '접수', color: '#f97316' }, { key: '처리', color: '#10b981' }, { key: '미결', color: '#ef4444' }],
      statsTable: [
        { metric: '평균 불량률',         value: '0.42%',        change: '-0.06%p', status: 'normal' },
        { metric: '공정능력지수(Cpk)',   value: '1.38',         change: '+0.05',   status: 'normal' },
        { metric: '최대 불량률(사업장)', value: '0.71% (군산)', change: '+0.09%p', status: 'high' },
        { metric: '평균 사이클타임',     value: '42.3초',       change: '-1.2초',  status: 'normal' },
        { metric: '이상치 건수',         value: '17건',         change: '+2건',    status: 'warning' },
        { metric: '결측치',              value: '0건',          change: '유지',    status: 'normal' },
      ],
      outlierSummary: '17건 (1.4%)',
      docStandard: 'HBP 표준 형식',
      docStandardNote: '리포트 형식을 선택하면 HBP 표준 양식으로 자동 생성됩니다',
    },
    /* ── 현장 Q&A 챗봇 ── */
    "agent-chatbot": {
      welcomeText: `안녕하세요! 한빛정밀 AI 어시스턴트입니다.\n\n작업표준(SOP), 품질·안전 규정, 설비 관리 등에 관해 자유롭게 질문해 주세요. 내부 지식베이스와 규정집을 기반으로 정확한 답변을 제공합니다.\n\n**자주 묻는 주제:**\n- 절삭유 관리 기준 및 교체 주기\n- 부적합품 발생 시 처리 절차\n- 출장비 정산 절차\n- 금형 교체(SMED) 작업 안전 수칙`,
      welcomeSources: ['한빛정밀 AI 플랫폼 운영지침'],
      sourcePreviews: {
        'CNC_가공_작업표준서_SOP-003.pdf': {
          title: 'CNC 가공 작업표준서 SOP-003', type: 'PDF', pages: 42, page: 4, section: '제4절',
          excerpt: [
            { text: '제4절(절삭유 관리)\n', hl: false },
            { text: '수용성 절삭유는 농도 8±1%, pH 8.5~9.3을 유지하며, 3개월 주기로 전량 교체한다. 매 교대 시 농도와 pH를 측정하여 점검표에 기록한다.', hl: true },
            { text: '\n부패취 발생, pH 8.0 미만, 부유 슬러지 과다 시에는 주기와 관계없이 즉시 교체한다. 폐액은 환경관리지침 ENV-07 절차에 따라 처리한다.', hl: false },
          ],
        },
        '산업안전보건기준에 관한 규칙 제103조': {
          title: '산업안전보건기준에 관한 규칙', type: 'LAW', article: '제103조',
          excerpt: [
            { text: '제103조(프레스 등의 위험 방지)\n① 사업주는 ', hl: false },
            { text: '프레스 또는 전단기를 사용하여 작업하는 근로자의 신체 일부가 위험한계에 들어가지 않도록 해당 부위에 덮개를 설치하는 등 필요한 방호 조치를 하여야 한다.', hl: true },
            { text: '\n② 작업의 성질상 제1항의 조치가 곤란한 경우에는 안전블록 등 필요한 방호 장치를 사용하도록 하여야 한다.', hl: false },
          ],
        },
        '취업규칙 제42조': {
          title: '한빛정밀 취업규칙', type: 'HWP', page: 18, section: '제42조',
          excerpt: [
            { text: '제42조(출장비 지급)\n① ', hl: false },
            { text: '직원이 업무 출장을 하는 경우에는 소정의 출장비를 지급한다. 출장비는 교통비, 숙박비 및 일비로 구분하며, 각 항목별 지급 기준은 별표에 따른다.', hl: true },
            { text: '\n② 출장비는 출장 종료 후 7일 이내에 정산서를 제출하여야 하며, 정산 후 잔액이 발생한 경우 즉시 반환하여야 한다.', hl: false },
          ],
        },
        '출장업무처리지침.pdf': {
          title: '출장업무처리지침', type: 'PDF', pages: 22, page: 7, section: '4.1절',
          excerpt: [
            { text: '4. 출장비 정산 절차\n\n4.1 사전 신청\n', hl: false },
            { text: '출장 3일 전까지 HBWorks 시스템에서 출장신청서를 작성하고 팀장의 승인을 받아야 한다. 긴급 출장의 경우 출발 전까지 유선 보고 후 사후 승인을 받을 수 있다.', hl: true },
            { text: '\n\n4.2 일비 기준\n- 식비: 1일 2만원 이내 (영수증 제출)\n- 숙박비: 1박 8만원 이내 (수도권 10만원)\n- 교통비: 실비 지급', hl: false },
          ],
        },
        '품질경영매뉴얼 제7조': {
          title: '품질경영매뉴얼(ISO 9001)', type: 'PDF', pages: 96, page: 31, section: '제7조',
          excerpt: [
            { text: '제7조(부적합품 관리)\n① ', hl: false },
            { text: '부적합품이 발생한 경우 즉시 식별 태그를 부착하고 격리 구역으로 이동하여 양품과 혼입을 방지한다. 처리 방법은 재작업·특채·폐기 중 MRB(부적합품 심의회) 심의로 결정한다.', hl: true },
            { text: '\n② 특채 처리 시에는 고객 승인 여부를 확인하고, 처리 이력을 MES에 등록하여 추적성을 확보한다.', hl: false },
          ],
        },
        '부적합품 관리 지침': {
          title: '부적합품 관리 지침', type: 'PDF', section: '제3·4조',
          excerpt: [
            { text: '제3조(식별 및 격리)\n', hl: false },
            { text: '부적합품은 발생 후 4시간 이내에 식별 태그(적색)를 부착하고 지정 격리 구역으로 이동하며, MES에 부적합 등록을 완료하여야 한다.', hl: true },
            { text: '\n\n제4조(처리 기한)\nMRB 심의는 등록일로부터 3영업일 이내에 개최하며, 처리 결과를 발생 부서와 품질관리부에 통보한다.', hl: false },
          ],
        },
        '개인정보처리방침 제5조': {
          title: '개인정보처리방침', type: 'PDF', section: '제5조',
          excerpt: [
            { text: '제5조(개인정보의 보유 기간)\n', hl: false },
            { text: 'AI 플랫폼 이용 기록(채팅 내용, 접속 로그)은 보안 정책에 따라 최대 90일간 내부 서버에 보관되며, 이후 자동 파기된다.', hl: true },
            { text: '\n단, 법령에 따라 보존이 필요한 경우 해당 기간 동안 별도 보관한다. 이용 기록은 감사·컴플라이언스 목적의 관리자 열람 외에는 제3자에게 제공되지 않는다.', hl: false },
          ],
        },
        '보안정책 3장': {
          title: '정보보안 운영 정책', type: 'PDF', section: '제12·13조',
          excerpt: [
            { text: '제3장 AI 시스템 보안\n\n제12조(사용 이력 관리)\n', hl: false },
            { text: 'AI 플랫폼의 모든 대화 이력은 공장 내부망(OT망 분리) 전용 서버에 암호화하여 저장된다. 보안 채팅(SECURE 탭) 이용 시에는 세션 종료와 함께 해당 세션의 대화 내용이 즉시 삭제된다.', hl: true },
            { text: '\n\n제13조(접근 제어)\n관리자는 감사 목적으로만 이용 이력을 열람할 수 있으며, 무단 열람 시 징계 처분을 받는다.', hl: false },
          ],
        },
        '보안정책 제7조': {
          title: '정보보안 운영 정책', type: 'PDF', section: '제7조',
          excerpt: [
            { text: '제7조(기밀 등급 문서 처리)\n', hl: false },
            { text: '도면·공정 조건 등 기밀 등급 기술자료를 AI 플랫폼에서 처리할 경우, 반드시 SECURE 탭(보안 채팅)을 이용하여야 한다. SECURE 탭에서는 내부망 전용 모델만 사용되며, 클라우드 모델로의 데이터 전송이 차단된다.', hl: true },
            { text: '\n\n대외비(C) 등급 이상의 도면 처리 시에는 보안관리관의 사전 승인이 필요하다.', hl: false },
          ],
        },
        '영업비밀보호지침': {
          title: '영업비밀보호 업무지침', type: 'PDF', section: '제8조',
          excerpt: [
            { text: '제8조(AI 시스템 이용 시 준수 사항)\n', hl: false },
            { text: 'AI 플랫폼에서 도면·공정 조건·단가 등 영업비밀을 처리한 결과물은 외부 저장 매체에 저장하거나 출력할 수 없다. 처리 결과는 업무 목적으로만 활용하며, 세션 종료 시 자동 삭제된다.', hl: true },
            { text: '\n\n위반 시 영업비밀보호법 및 사내 보안 규정에 따른 징계 절차가 진행된다.', hl: false },
          ],
        },
        '업무매뉴얼_v3.2.pdf': {
          title: '한빛정밀 업무 매뉴얼 v3.2', type: 'PDF', pages: 134, page: 52, section: '6.1절',
          excerpt: [
            { text: '제6장 AI 플랫폼 활용 업무\n\n6.1 챗봇 에이전트 활용\n', hl: false },
            { text: 'AI 챗봇은 내부 지식베이스를 기반으로 업무 관련 질의응답을 제공한다. 작업표준(SOP), 품질·안전 규정, 업무 절차 등의 질문에 RAG(검색 증강 생성) 방식으로 정확한 답변을 생성한다.', hl: true },
            { text: '\n\n6.2 이용 시 주의 사항\n- 답변은 참고용이며 최종 판단은 담당자가 확인 후 결정\n- 기밀 도면·기술자료는 SECURE 탭 사용', hl: false },
          ],
        },
        '한빛정밀 AI 플랫폼 운영지침': {
          title: 'AI 플랫폼 운영지침', type: 'PDF', section: '제1·2조',
          excerpt: [
            { text: '제1조(목적)\n이 지침은 ', hl: false },
            { text: '한빛정밀 스마트팩토리 생성형 AI 플랫폼의 안전하고 효율적인 운영을 위한 기준과 절차를 정함을 목적으로 한다.', hl: true },
            { text: '\n\n제2조(적용 범위)\n이 지침은 한빛정밀 임직원 전원에게 적용되며, AI 플랫폼의 모든 기능(챗봇, 생산일보, 회의록, OCR 등)에 적용된다.', hl: false },
          ],
        },
      },
      faqItems: [
        {
          id: 'f1', q: '절삭유 교체 주기는 어떻게 되나요?', category: '작업표준',
          a: `**절삭유 전량 교체 주기**는 **3개월**입니다. (작업표준서 SOP-CNC-003 제4절)\n\n**관리 기준:**\n- 농도: 8±1% 유지 (매 교대 굴절계 측정)\n- pH: 8.5~9.3 유지\n\n**즉시 교체 조건:**\n- 부패취 발생\n- pH 8.0 미만\n- 부유 슬러지 과다\n\n교체 작업은 설비보전팀 입회 하에 실시하며, 폐액은 지정 폐기물 절차(ENV-07)를 따릅니다.`,
          sources: ['CNC_가공_작업표준서_SOP-003.pdf'],
        },
        {
          id: 'f2', q: '출장비 정산 절차를 알려주세요.', category: '복무규정',
          a: `출장비 정산 절차는 다음과 같습니다.\n\n**1. 출장 전**\n- 출장 3일 전 출장신청서 제출 (HBWorks 시스템)\n- 팀장 사전 승인 필수\n\n**2. 출장 중**\n- 영수증 원본 수취 (숙박·식비·교통)\n- 1일 식대 한도: 2만원 / 숙박비: 8만원 (수도권 10만원)\n\n**3. 출장 후 (7일 이내)**\n- 출장비 정산서 + 영수증 제출\n- 실비 지급 처리`,
          sources: ['취업규칙 제42조', '출장업무처리지침.pdf'],
        },
        {
          id: 'f3', q: '부적합품 발생 시 처리 절차는?', category: '품질',
          a: `**부적합품 처리 절차:**\n\n**1. 식별·격리 (4시간 이내)**\n- 적색 식별 태그 부착\n- 지정 격리 구역 이동 (양품 혼입 방지)\n- MES 부적합 등록\n\n**2. MRB 심의 (3영업일 이내)**\n- 처리 방법 결정: 재작업 / 특채 / 폐기\n- 특채는 고객 승인 여부 확인 필수\n\n**3. 이력 관리**\n- 처리 결과 MES 등록으로 추적성 확보\n- 재발 방지 대책 수립 후 발생 부서 공유`,
          sources: ['품질경영매뉴얼 제7조', '부적합품 관리 지침'],
        },
        {
          id: 'f4', q: '작업표준서(SOP)와 QC공정도의 차이는?', category: '작업표준',
          a: `**작업표준서(SOP)**와 **QC공정도**의 주요 차이:\n\n| 구분 | 작업표준서(SOP) | QC공정도 |\n|------|--------------|------------|\n| 목적 | 작업 방법·순서 표준화 | 공정별 품질 관리 항목 정의 |\n| 대상 | 작업자 (현장 수행) | 검사원·관리자 (품질 관리) |\n| 내용 | 절차·조건·안전 수칙 | 관리 항목·규격·검사 주기 |`,
          sources: ['CNC_가공_작업표준서_SOP-003.pdf', '품질경영매뉴얼 제7조'],
        },
        {
          id: 'f5', q: 'AI 플랫폼 사용 이력은 저장되나요?', category: '시스템',
          a: `사용 이력은 보안 정책에 따라 **최대 90일**간 내부 서버에 보관됩니다.\n\n- 타 부서·상급자에 자동 공유되지 않습니다\n- 감사·컴플라이언스 목적으로만 관리자 열람 가능\n- 보안 채팅(SECURE 탭) 이용 시 세션 종료와 함께 즉시 삭제`,
          sources: ['개인정보처리방침 제5조', '보안정책 3장'],
        },
        {
          id: 'f6', q: '도면 등 기밀 기술자료는 어떻게 처리하나요?', category: '보안',
          a: `기밀 기술자료 처리 절차:\n\n**1. 접근 권한 확인**\n- 대외비(C): 해당 부서원 이상\n- 기밀 도면: 보안관리관 사전 승인 필요\n\n**2. 처리 원칙**\n- 반드시 SECURE 탭(보안 채팅) 사용\n- 내부망 전용 모델만 사용 (클라우드 모델 차단)\n- 처리 결과 세션 종료 시 자동 삭제\n\n**3. 출력·저장 금지**\n- 도면·공정 조건·단가 결과물 외부 저장·출력 금지`,
          sources: ['보안정책 제7조', '영업비밀보호지침'],
        },
      ],
      faqCategories: ['작업표준', '복무규정', '품질', '보안', '시스템'],
      faqCategoryColors: {
        '작업표준': 'bg-blue-100 text-blue-700',
        '복무규정': 'bg-emerald-100 text-emerald-700',
        '품질':     'bg-amber-100 text-amber-700',
        '보안':     'bg-rose-100 text-rose-700',
        '시스템':   'bg-violet-100 text-violet-700',
      },
      delegateRules: [
        { keywords: ['보고서', '작성', '생산일보'],  agentId: 'agent-report',       agentName: '생산일보 작성 에이전트',     reason: '생산 실적 보고서 자동 작성 전문 에이전트입니다.' },
        { keywords: ['회의', '녹음', '회의록'],       agentId: 'agent-meeting',      agentName: '공정회의록 에이전트',        reason: '음성 기반 회의록 작성 전문입니다.' },
        { keywords: ['내규', '규정', '취업규칙'],     agentId: 'agent-internalreg',  agentName: '사규·안전규정 조회 에이전트', reason: '사내 규정 조항 근거 제시 전문입니다.' },
        { keywords: ['OCR', '스캔', '도면'],          agentId: 'agent-ocr',          agentName: '도면·성적서 OCR 에이전트',   reason: '스캔 도면·성적서 텍스트 추출 전문입니다.' },
        { keywords: ['요약', '정리', '줄여'],          agentId: 'agent-summary',      agentName: '기술문서 요약 에이전트',     reason: '기술문서 요약 전문 에이전트입니다.' },
        { keywords: ['데이터', '엑셀', '분석'],       agentId: 'agent-dataanalysis', agentName: '공정 데이터 분석 에이전트',  reason: '공정·품질 데이터 분석·시각화 전문입니다.' },
      ],
      correctionExample: '예: "절삭유 교체 주기가 어떻게 되나요?"',
      suggestQuestions: [
        '절삭유 교체 주기는 어떻게 되나요?',
        '출장비 정산 절차를 알려주세요.',
        '부적합품 발생 시 처리 절차는?',
      ],
      fallbackAnswerBody: `한빛정밀 내부 지식베이스 및 규정을 검토한 결과, 관련 내용을 정리해 드립니다.\n\n현재 질문하신 내용과 관련하여 작업표준서(SOP), 품질경영매뉴얼, 안전보건관리규정 등을 검색하였습니다. 보다 정확한 답변을 위해 구체적인 설비명·공정명이나 관련 문서명을 함께 알려주시면 더 상세한 안내가 가능합니다.\n\n**참고 자료:**\n- CNC 가공 작업표준서 SOP-003 (2026년 개정본)\n- 한빛정밀 업무 매뉴얼 v3.2\n- 품질경영매뉴얼(ISO 9001)`,
      fallbackSources: ['CNC_가공_작업표준서_SOP-003.pdf', '업무매뉴얼_v3.2.pdf'],
      headerSubtitle: '내부 지식베이스 · 규정집 · 작업표준(SOP) 기반 응답',
      inputPlaceholder: '작업표준이나 품질·안전 규정에 대해 자유롭게 질문하세요...',
      quickAgents: [
        { label: '공정회의록 에이전트',        id: 'agent-meeting',     color: 'bg-purple-100 text-purple-700' },
        { label: '생산일보 작성 에이전트',     id: 'agent-report',      color: 'bg-emerald-100 text-emerald-700' },
        { label: '사규·안전규정 조회 에이전트', id: 'agent-internalreg', color: 'bg-amber-100 text-amber-700' },
      ],
    },
    /* ── 생산일보 작성 에이전트 ──
     * ⚠️ buildPressHtml/buildReportHtml 키는 의도적으로 생략(함수 통째 교체 계약이라 유지보수 부담 큼).
     *    이 때문에 '인쇄 미리보기(다운로드 HTML)'에는 REB 기본 레이아웃(기본 조직 로고·브랜드색·기관명)이 남는다.
     *    화면(문서 뷰·차트·결재)은 아래 텍스트 키로 전부 교체됨. 추후 필요 시 함수 2종을 팩에서 교체할 것. */
    "agent-report": {
      apvLine: [
        { name: '박태윤', dept: '생산기술팀', title: '책임',   role: '작성자' },
        { name: '정재호', dept: '생산기술팀', title: '팀장',   role: '검토자' },
        { name: '오세창', dept: '생산본부',   title: '본부장', role: '승인자' },
      ],
      reportTypes: [
        { id: 'weekly',    label: '주간생산보고',   icon: '📊', desc: '주간 생산 실적 및 차주 계획' },
        { id: 'field',     label: '설비점검보고',   icon: '🔧', desc: '설비 정기 PM 점검 결과 보고' },
        { id: 'monthly',   label: '월간생산보고',   icon: '📈', desc: '월간 종합 생산 실적 보고' },
        { id: 'officetel', label: '품질동향조사',   icon: '🏭', desc: '분기별 품질지표 동향 통계 보고' },
        { id: 'market',    label: '수주동향보고',   icon: '📉', desc: '수주·납품 동향 및 전망 보고' },
      ],
      docNums: {
        weekly:    'HBP-생산기술팀-2026-027',
        field:     'HBP-설비보전팀-2026-028',
        monthly:   'HBP-생산기술팀-2026-030',
        officetel: 'HBP-품질관리부-2026-034',
        market:    'HBP-영업관리팀-2026-035',
      },
      docNumFallback: 'HBP-생산기술팀-2026-027',
      reportDefaults: {
        weekly: {
          dept: '생산기술팀',
          period: '2026. 03. 09. ~ 03. 13.',
          mainWork: '- CNC 3라인 브래킷 가공 12,400EA 생산 (계획 대비 103%)\n- 프레스 2라인 금형 교체(SMED) 2회 — 평균 27분 (표준 25분)\n- 수입검사 9로트 처리 (합격 8 · 조건부 1)',
          nextPlan: '- 프레스 400t #3 정기 PM 실시 (03. 17.)\n- 북미향 수출 로트 선적 검사 및 검사성적서 발행\n- CNC 1~3라인 절삭유 전량 교체 (SOP-CNC-003 기준)',
          special: '- 군산공장 프레스 100t #8 법정 안전검사 기한 초과 — 03. 20. 수검 예정',
        },
        field: {
          dept: '설비보전팀',
          period: '2026. 03. 11. (수)',
          mainWork: '- 아산공장 프레스 200t #1 정기 PM 완료 (기어박스 오일 교체)\n- 진동 센서 데이터 분석 — 베어링 이상 징후 1건 조기 감지\n- 크랭크축 백래시 측정 0.08mm (관리 기준 0.12mm 이내)',
          nextPlan: '- 예비 베어링 발주 및 교체 일정 협의 (03. 24. 예정)\n- 예지보전 알람 임계치 재설정 (진동 3.5mm/s)',
          special: '- PM 중 방호덮개 고정 볼트 풀림 발견 — 즉시 조치 완료',
        },
        monthly: {
          dept: '생산기술팀',
          period: '2026. 02.',
          mainWork: '- 전사 생산량 218,400EA (계획 대비 101.2%)\n- 전사 평균 가동률 86.6% · 공정 불량률 0.42%\n- 고객 클레임 3건 접수 · 시정조치 완료 2건',
          nextPlan: '- 3월 생산 계획 수립 및 라인별 부하 조정\n- 1분기 품질 실적 취합 및 생산본부장 보고',
          special: '- 2월 납기 준수율 98.7% — 전월(97.4%) 대비 개선',
        },
        officetel: {
          dept: '품질관리부',
          period: '2026. 01. ~ 03. (1분기)',
          mainWork: "- '26년 1분기 품질동향조사 완료 (7개 사업장, 214개 관리 항목)\n- 전사 불량률 0.42% (전분기 대비 0.06%p 개선), 공정능력지수 Cpk 평균 1.38\n- 가공 부문 치수 불량 0.04%p 감소 — 금형·치공구 표준화 효과\n- 프레스 부문 표면 결함 소폭 증가 (0.01%p) — 윤활 관리 점검 착수\n- 수입검사 불량률 0.38%, 협력사 4개사 특별 관리 대상 지정",
          nextPlan: "- '26년 2분기 품질동향조사 준비 (4월 조사 개시)\n- 사업장별 관리 항목 재정비 및 검사원 배정\n- 조사 결과 검증 및 ISO 9001 사후심사 대응 (6월 예정)\n- 공정별 Cpk 하위 항목 개선 과제 등록",
          special: "- 군산공장 불량률 0.71% — 전사 평균 상회, 신규 라인 램프업 영향\n- SUS304 브래킷 협력사 로트 불량 1.2% — 관리 한계 초과, 전수검사 전환\n- 전사 Cpk 1.38 — 목표(1.33) 상회 유지, 하위 5개 항목 집중 관리 필요",
        },
        market: {
          dept: '영업관리팀',
          period: '2026. 03. (2026년 1분기)',
          mainWork: '- 1분기 신규 수주 142억 원 (전분기 대비 +8.4%)\n- 북미향 브래킷 어셈블리 장기 공급 계약 체결 (연 28만EA)\n- 전장 부품 신규 고객 2개사 시제품 승인 완료',
          nextPlan: '- 2분기 수주 목표 155억 원 — 라인 증설 검토\n- 신규 고객 양산 이관 일정 협의',
          special: '- 원자재(SUS) 단가 상승 지속 — 판가 연동 조항 협의 필요',
        },
      },
      reportDate: '2026. 03. 13.',
      approvalSystem: 'HBWorks',
      apvRefNo: 'APV-2026-0313-027',
      logoAlt: 'HBP 한빛정밀',
      perfCharts: {
        weekly:  { label: '주간',     data: [{ item: '생산 로트', 완료: 18, 목표: 20 }, { item: '금형 교체', 완료: 2, 목표: 2 }, { item: '수입검사', 완료: 9, 목표: 10 }] },
        monthly: { label: '월간',     data: [{ item: '생산 로트', 완료: 74, 목표: 72 }, { item: '정기 PM', 완료: 6, 목표: 8 }, { item: '클레임 처리', 완료: 2, 목표: 3 }] },
        field:   { label: '설비점검', data: [{ item: '점검 항목', 완료: 24, 목표: 24 }, { item: '센서 진단', 완료: 12, 목표: 12 }, { item: '조치 완료', 완료: 3, 목표: 3 }] },
      },
      perfDoneKey: '완료', perfGoalKey: '목표',
      pressTypeId: 'officetel',
      pressDistDate: '2026년 4월 14일 (화)',
      pressDate: '2026. 04. 14.',
      pressKpiTitle: '▪ 2026년 1분기 품질동향 핵심 지표 (전분기 대비)',
      pressKpiCards: [
        { label: '전사 불량률',   value: '▼ 0.42%',  sub: '전분기 0.48%',   color: '#16a34a' },
        { label: '공정능력지수', value: 'Cpk 1.38', sub: '목표 1.33 이상', color: '#1e40af' },
        { label: '클레임 건수',   value: '▼ 7건',    sub: '전분기 11건',    color: '#16a34a' },
        { label: '납기 준수율',   value: '98.7%',    sub: '전분기 97.4%',   color: '#1e40af' },
      ],
      pressKpiStats: [
        { label: '전사 평균 가동률',      value: '86.6%' },
        { label: '수입검사 불량률',       value: '0.38%' },
        { label: '백만 개당 결함(PPM)',   value: '4,200' },
      ],
      pressTrendTitle: '▪ 부문별 불량률 월별 추이 (단위: %)',
      pressTrendData: [
        { month: '2026.1월', 가공: 0.21, 프레스: 0.19, 조립: 0.11 },
        { month: '2026.2월', 가공: 0.18, 프레스: 0.15, 조립: 0.09 },
        { month: '2026.3월', 가공: 0.13, 프레스: 0.16, 조립: 0.08 },
      ],
      pressTrendSeries: [{ key: '가공', color: '#dc2626' }, { key: '프레스', color: '#2563eb' }, { key: '조립', color: '#16a34a' }],
      pressTrendDomain: [0, 0.3],
      pressBarTitle: '▪ 사업장별 불량률 변동 (전분기 대비, %p)',
      pressBarData: [
        { area: '전사', 가공: -0.04, 프레스: 0.01,  조립: -0.03 },
        { area: '화성', 가공: -0.06, 프레스: -0.02, 조립: -0.01 },
        { area: '아산', 가공: -0.02, 프레스: 0.03,  조립: -0.02 },
        { area: '구미', 가공: -0.05, 프레스: -0.01, 조립: -0.04 },
        { area: '군산', 가공: 0.06,  프레스: 0.04,  조립: 0.02 },
      ],
      pressBarSeries: [
        { key: '가공',   color: '#86efac', posColor: '#fca5a5' },
        { key: '프레스', color: '#6ee7b7', posColor: '#f87171' },
        { key: '조립',   color: '#a7f3d0', posColor: '#fda4af' },
      ],
      pressSections: [
        { num: '1', title: '가공 부문 품질동향',
          regions: [{ area: '전사', rate: '0.13%', prev: '0.17%' }, { area: '국내향', rate: '0.12%', prev: '0.16%' }, { area: '수출향', rate: '0.15%', prev: '0.19%' }],
          details: [
            { area: '화성', rate: '0.09%', note: '신규 5축 라인 안정화로 치수 불량 감소. 금형·치공구 표준화 효과 지속 (0.15%→0.09%)' },
            { area: '구미', rate: '0.11%', note: 'SMED 활동으로 셋업 직후 초물 불량 감소. 초물 검사 자동 판정 도입 효과 (0.16%→0.11%)' },
            { area: '군산', rate: '0.24%', note: '신규 수주 램프업 구간 — 작업자 숙련도 편차로 전사 평균 상회 (0.18%→0.24%)' },
          ],
        },
        { num: '2', title: '프레스 부문 품질동향',
          regions: [{ area: '전사', rate: '0.16%', prev: '0.15%' }, { area: '국내향', rate: '0.15%', prev: '0.14%' }, { area: '수출향', rate: '0.18%', prev: '0.17%' }],
          details: [
            { area: '아산', rate: '0.19%', note: '3번 프레스 표면 결함 증가 — 윤활유 도포량 편차 원인, 윤활 자동화 시범 적용 착수 (0.14%→0.19%)' },
            { area: '울산', rate: '0.14%', note: '예비 금형 투입 후 안정화. 금형 크랙 재발 방지 위한 타수 관리 강화 (0.21%→0.14%)' },
            { area: '창원2', rate: '0.17%', note: '노후 설비 교체 진행 중 — 신규 서보 프레스 입고 완료 시 개선 전망 (0.18%→0.17%)' },
          ],
        },
        { num: '3', title: '조립 부문 품질동향',
          regions: [{ area: '전사', rate: '0.08%', prev: '0.11%' }, { area: '국내향', rate: '0.07%', prev: '0.10%' }, { area: '수출향', rate: '0.09%', prev: '0.12%' }],
          details: [
            { area: '울산', rate: '0.06%', note: '토크 관리 전산화(스마트 툴 연동)로 체결 불량 감소 (0.10%→0.06%)' },
            { area: '창원본사', rate: '0.05%', note: '비전 검사 도입 라인 오조립 결함 제로 달성 — 2개 라인 추가 확대 예정 (0.08%→0.05%)' },
            { area: '군산', rate: '0.15%', note: '램프업 구간 검사 강화로 유출 방지 중 — 자주검사 정착 교육 진행 (0.17%→0.15%)' },
          ],
        },
      ],
      pressIndexTitle: '2026년 1~3월 부문별 불량률 및 변동',
      pressIndexHead: ['구분', '2026.1', '2026.2', '2026.3', '전분기 변동(%p)'],
      pressIndexGroups: [
        { label: '가공 불량률 (%)',   rows: [{ a: '전사', v1: '0.21', v2: '0.18', v3: '0.13', c: '-0.04' }, { a: '국내향', v1: '0.20', v2: '0.17', v3: '0.12', c: '-0.04' }, { a: '수출향', v1: '0.23', v2: '0.19', v3: '0.15', c: '-0.04' }] },
        { label: '프레스 불량률 (%)', rows: [{ a: '전사', v1: '0.19', v2: '0.15', v3: '0.16', c: '+0.01' }, { a: '국내향', v1: '0.18', v2: '0.14', v3: '0.15', c: '+0.01' }, { a: '수출향', v1: '0.21', v2: '0.17', v3: '0.18', c: '+0.01' }] },
        { label: '조립 불량률 (%)',   rows: [{ a: '전사', v1: '0.11', v2: '0.09', v3: '0.08', c: '-0.03' }, { a: '국내향', v1: '0.10', v2: '0.08', v3: '0.07', c: '-0.03' }, { a: '수출향', v1: '0.12', v2: '0.10', v3: '0.09', c: '-0.03' }] },
      ],
      pressIndexNote: '* 지표 산정: MES 품질 실적 집계 | ISO 9001:2015 품질경영시스템 인증 사업장 기준',
      pressRatioTitle: '사업장별 설비부하율 및 불량률',
      pressRatioData: [
        { area: '화성', 설비부하율: 96.2, 불량률: 0.31 },
        { area: '아산', 설비부하율: 91.4, 불량률: 0.44 },
        { area: '구미', 설비부하율: 93.8, 불량률: 0.35 },
        { area: '군산', 설비부하율: 88.1, 불량률: 0.71 },
        { area: '전사', 설비부하율: 92.6, 불량률: 0.42 },
      ],
      pressRatioLeftKey: '설비부하율', pressRatioRightKey: '불량률',
      pressRatioLeftDomain: [80, 100], pressRatioRightDomain: [0, 1.0],
      pressRatioThreshold: 95,
      pressRatioRefLabel: '과부하 기준 95%',
      pressRatioNote: '* 설비부하율 95% 이상(빨간 막대): 예지보전 지연·품질 저하 고위험 임계치 | 불량률: 공정 불량 기준',
      pressContact: '품질관리부장 백승호 ☎ (055)280-4120 | 담당 선임 한지원 ☎ (055)280-4121　｜　자료확인: MES 통합 대시보드 · 스마트팩토리 포털',
    },
  },
  /* ── SECURE 탭 제안 4종 ── */
  secureSuggestions: [
    { icon: FileText,    iconBg: "bg-blue-950/50", iconColor: "text-blue-400", title: "핵심 공정 기술자료 분석",  query: "외부 공유 전 검토가 필요한 핵심 공정 기술자료의 핵심 내용을 정리해줘. 결과는 저장되지 않아" },
    { icon: ShieldCheck, iconBg: "bg-blue-950/50", iconColor: "text-blue-400", title: "협력사 단가 자료 검토",    query: "협력사 단가나 계약 조건이 포함될 수 있는 내부 검토 초안을 작성해줘" },
    { icon: Search,      iconBg: "bg-blue-950/50", iconColor: "text-blue-400", title: "내부 규정 비공개 검토",    query: "취업규칙·사규 관련 내용을 보안 환경에서 확인하고 싶어. 대화는 저장되지 않아야 해" },
    { icon: Lock,        iconBg: "bg-blue-950/50", iconColor: "text-blue-400", title: "신제품 개발 아이디어 정리", query: "아직 공유하기 전인 신제품 개발 아이디어를 보안 환경에서 문서화해줘" },
  ],
  /* ── 모드별 응답 오버라이드 (REVIEW/TRANSLATE/REPORT + SECURE 2종) — citations는 반드시 [] (인용 뷰어는 REB fileData 전용) ── */
  modeAnswers: {
    REVIEW: {
      confidence: 91,
      content: "**[에이전트 문서 검토 결과]**\n\n취업규칙(2025개정) 및 안전보건관리규정 대조 결과입니다.\n\n**✅ 준수 사항**\n- 설비 점검 출장 사전 승인 절차 준수\n- 결재 라인 설정이 사내 규정에 부합\n\n**⚠️ 보완 권고 사항**\n- 출장 기간 5박 초과 시 **임원 별도 승인** 필요 (취업규칙 제42조②)\n- 프레스동 출입 작업은 **위험성평가 결과서 첨부** 필요 (안전보건관리규정 제18조)",
      citations: [],
      steps: [
        { label: "DRM 해제 및 OCR 추출", detail: "업로드 문서 텍스트 완전 추출 완료" },
        { label: "사규 지식망 검색", detail: "취업규칙·안전보건관리규정 조항 검색 완료 (제42조·제18조)" },
        { label: "규정 대조 및 검토", detail: "위반 소지 분석 및 보완 사항 발췌 완료" },
      ],
    },
    TRANSLATE: {
      content: "**[번역 완료]** — 영어 → 한국어\n\n---\n**[번역 결과]**\n\n**정밀부품 검사 표준 (Precision Parts Inspection Standards)**\n\n공급자는 전 로트에 대해 공정능력지수(Cpk) 1.33 이상을 보증하여야 하며, 로트별 검사성적서에 치수 측정값과 사용 측정기 정보를 명시하여야 합니다. 규격 하한 근접 측정값이 발견된 로트는 선적 전 전수검사로 전환합니다.\n\n---\n*번역 엔진: 로컬 LLM (Llama-3-Korean 70B) | 글자수: 약 140자*",
      citations: [],
      steps: [
        { label: "의미 단위 분할 (Semantic Chunking)", detail: "문서를 문맥 기준으로 분할 완료" },
        { label: "영한 번역 (로컬 LLM 처리)", detail: "Llama-3-Korean 70B 모델 번역 완료" },
        { label: "제조 표준 문체 포맷팅", detail: "가독성 높은 형태로 최종 정제 완료" },
      ],
    },
    REPORT: {
      content: "**[주간 생산 보고서 초안 생성 완료]**\n\n---\n\n**생산기술팀 주간 생산 실적 보고**\n\n| 구분 | 내용 |\n|------|------|\n| **보고 기간** | 2026. 02. 17.(월) ~ 02. 21.(금) |\n| **작성 부서** | 생산기술팀 |\n| **작성자** | 박태윤 책임 |\n\n**가. 주요 실적**\n1. CNC 3라인 브래킷 가공: **12,400EA** (계획 대비 103%)\n2. 프레스 2라인 불량률: **0.42%** (전주 대비 0.13%p 개선)\n\n**나. 차주 계획**\n- 프레스 400t #3 정기 PM 및 수출 로트 선적 검사\n\n---\n⚠️ *AI 생성 초안입니다. 반드시 확인 후 사용하세요.*",
      citations: [],
      steps: [
        { label: "표준 양식 불러오기", detail: "주간 생산 보고서 사내 표준 템플릿 로드 완료" },
        { label: "정보 항목 매핑", detail: "MES 실적 데이터를 목차별로 자동 분류 완료" },
        { label: "공문서 개조식 포맷팅", detail: "보고서 양식에 맞게 최종 작성 완료" },
      ],
      document: {
        docNo: "HBP-생산기술팀-2026-026",
        issueDate: "2026. 02. 26.",
        retention: "5년",
        type: "주간업무보고",
        to: "생산본부장",
        cc: "품질관리부장",
        from: "생산기술팀 박태윤 책임",
        title: "2026년 2월 4주차 주간 생산 실적 보고",
        sealText: "한빛정밀 대표이사",
        body: [
          {
            num: "1", heading: "보고 개요",
            rows: [
              ["보고 기간", "2026. 02. 17.(월) ~ 02. 21.(금)"],
              ["작성 부서", "생산기술팀"],
              ["작성자", "박태윤 책임"],
            ],
          },
          {
            num: "2", heading: "주요 실적",
            sub: [
              {
                label: "가. 생산 실적",
                bullets: [
                  "CNC 3라인 브래킷 가공 <b>12,400EA</b> 생산 (계획 대비 103%)",
                  "프레스 2라인 성형 8,200EA — 불량률 0.42% (전주 0.55%)",
                  "금형 교체(SMED) 2회 실시 — 평균 27분 소요 (표준 25분)",
                ],
              },
              {
                label: "나. 품질·설비",
                bullets: [
                  "수입검사 <b>9로트</b> 처리 완료 (합격 8 · 조건부 1)",
                  "프레스 200t #1 베어링 이상 징후 조기 감지 — 예지보전 알람 (2026.02.18)",
                  "치수 불량 개선: 금형 교체(M-204) 효과 확인 (2026.02.20)",
                ],
              },
            ],
          },
          {
            num: "3", heading: "차주 계획",
            bullets: [
              "프레스 400t #3 정기 PM 실시 (2026. 02. 24. ~ 02. 25.)",
              "북미향 수출 로트 선적 검사 및 검사성적서 발행",
              "CNC 1~3라인 절삭유 전량 교체 (SOP-CNC-003 기준)",
            ],
          },
        ],
        attachments: [
          "주간 생산 실적 집계표 1부",
          "수입검사 성적서 사본 9부",
        ],
        secLevel: "S",
        approval: [
          { role: "기안자", name: "박태윤", dept: "생산기술팀", date: "2026.02.26", signed: true },
          { role: "검토자", name: "", dept: "", date: "", signed: false },
          { role: "결재자", name: "", dept: "", date: "", signed: false },
        ],
      },
    },
    SECURE_DEFAULT: {
      confidence: 88,
      content: "**[보안 문서 스캔 완료]**\n\n업로드된 문서 전체를 대상으로 보안 취약점을 점검했습니다.\n\n**✅ 안전 항목**\n- 평문 노출 패스워드: 미발견\n- 사번·주민등록번호 등 식별정보: 미발견\n\n**🔐 자동 처리 내역**\n- 협력사 담당자 연락처 형식 데이터 2건 → 자동 마스킹(***) 처리\n- 협력사 단가 항목 1건 → 벡터 DB 적재 전 마스킹 완료\n\n본 세션의 모든 처리는 공장 내부망(OT망 분리) 로컬 서버에서만 이루어지며 외부 네트워크로 전송되지 않습니다.",
      citations: [],
      steps: null,
    },
    SECURE_AIRGAP: {
      confidence: 97,
      content: "**[보안 규정 검토 완료]**\n\n한빛정밀 정보보안 운영 정책 내 망분리 관련 핵심 요건입니다.\n\n- **내부 웹 UI**: 공장 OT망 분리, 인터넷 차단 환경 구축 필수\n- **LLM 서비스**: 외부 클라우드 API 연결 금지, 로컬 온프레미스만 허용\n- **벡터 DB**: 내부망 전용 구축, 도면·공정 조건 외부 전송 금지 (보안정책 제7조)\n\n✅ 현재 세션: 모든 처리가 공장 내부망에서만 이루어지고 있습니다.",
      citations: [],
      steps: null,
    },
  },
};

export default manufacturing;
