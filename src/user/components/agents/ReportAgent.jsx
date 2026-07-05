import React, { useState, useEffect } from "react";
import {
  FileText, Search, Filter, Cpu, Radio, Loader2, CheckCircle,
  ChevronRight, Network, Play, RotateCcw, Download, FileCheck,
  ExternalLink, Clock, Edit3, Eye, Printer
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine, ResponsiveContainer, Cell, LabelList
} from "recharts";
import ApprovalModal from "../ApprovalModal.jsx";
import SelfCheckModal from "../SelfCheckModal.jsx";
import AgentWorkflowPanel from "./AgentWorkflowPanel.jsx";
import { AGENT_TEAMS } from "../../data/constants.js";
import { REB_LOGO } from "../../data/logos.js";
import { useAgentSimulation } from "../../hooks/useAgentSimulation.js";
import { cn } from "../../utils.jsx";


const APV_LINE=[
  {name:'김민준',dept:'부동산공시처',title:'과장',role:'작성자'},
  {name:'박지현',dept:'부동산공시처',title:'공시관리부장',role:'검토자'},
  {name:'이상호',dept:'부동산공시처',title:'처장',role:'승인자'},
];

const AGENTS=[
  {icon:Search, label:'템플릿 검색기',  sub:'표준 보고서 양식 불러오는 중',    color:'bg-emerald-600', ms:1600},
  {icon:Filter, label:'데이터 정제기',  sub:'입력 정보 매핑 및 정제 중',       color:'bg-green-600',   ms:2200},
  {icon:Cpu,    label:'보고서 포맷터', sub:'GPT-OSS 120B 문서 생성 중',      color:'bg-teal-600',    ms:2500},
];

const REPORT_TYPES=[
  {id:'weekly',    label:'주간실적보고',     icon:'📊', desc:'주간 업무 실적 및 차주 계획'},
  {id:'field',     label:'현장조사보고',     icon:'🏗️', desc:'현장 방문 조사 결과 보고'},
  {id:'monthly',   label:'월간실적보고',     icon:'📈', desc:'월간 종합 업무 실적 보고'},
  {id:'officetel', label:'주택가격동향조사', icon:'🏢', desc:'분기별 주택가격동향 통계 보고'},
  {id:'market',    label:'시황보고서',       icon:'📉', desc:'주택시장 동향 및 전망 보고'},
];

const TONES=[
  {id:'formal',   label:'공식체',  desc:'공문서 개조식 문체'},
  {id:'summary',  label:'요약체',  desc:'핵심만 간결하게'},
  {id:'detailed', label:'상세체',  desc:'배경·근거 포함 상세'},
];

const LENGTHS_REPORT=[
  {id:'short',  label:'단문 (1~2p)', desc:'핵심 위주'},
  {id:'medium', label:'표준 (3~5p)', desc:'일반 업무 보고'},
  {id:'long',   label:'장문 (6p+)',  desc:'종합 분석 보고'},
];

const EXPORT_FORMATS=[
  {label:'Word (.docx)', icon:'📄', ext:'docx', color:'text-blue-600'},
  {label:'한글 (.hwpx)', icon:'📋', ext:'hwpx', color:'text-green-600'},
  {label:'PDF (.pdf)',   icon:'📕', ext:'pdf',  color:'text-red-600'},
];

const DOC_NUMS={
  weekly:    'KREA-부동산공시처-2026-027',
  field:     'KREA-부동산공시처-2026-028',
  monthly:   'KREA-부동산공시처-2026-030',
  officetel: 'KREA-부동산통계처-2025-034',
  market:    'KREA-부동산통계처-2026-035',
};

const REPORT_DEFAULTS={
  market:{
    dept:'부동산통계처 상업자산통계부',
    period:'2026. 03. (2026년 1분기)',
    mainWork:'- 전국 주택매매가격지수 96.74 (전월 대비 -0.09%)\n- 수도권 매매가격 -0.08%, 서울 -0.04% (하락폭 축소 추세)\n- 전세가격 전국 -0.06%, 월세가격 전국 +0.04%\n- 전세수급지수 94.3 (공급 우위 지속)',
    nextPlan:'- 2분기 주택시장 동향 조사 계획 수립\n- 4월 주택가격동향 속보치 산출 및 검증\n- 부동산 시장 전문가 패널 동향 조사 실시',
    special:'- 서울 일부 지역(강남·서초) 상승 압력 증가 — 모니터링 강화\n- 미분양 주택 전국 69,214호 (2월 말 기준), 준공 후 미분양 1만5천호 초과',
  },
  weekly:{
    dept:'부동산공시처',
    period:'2026. 03. 09. ~ 03. 13.',
    mainWork:'- 표준지공시지가 현장조사 8건 완료 (서울 노원구·강북구)\n- 비교표준지 가격 검토 3건 처리\n- 이의신청 검토 의견서 작성 2건',
    nextPlan:'- 표준지공시지가 현장조사 12건 예정 (서울 도봉구·중랑구)\n- 분기 실적 집계 및 보고서 작성\n- 이의신청 처리 결과 통보 3건',
    special:'- 노원구 일부 표준지 현황 변동 사항 발생 (재조사 필요 2건)',
  },
  field:{
    dept:'부동산공시처',
    period:'2026. 03. 11. (화)',
    mainWork:'- 서울 노원구 표준지 5필지 현장 방문 조사 완료\n- 인근 거래 사례 수집 및 비교 분석 완료\n- 현황 변동(용도지역 변경) 2건 확인 및 기록',
    nextPlan:'- 조사 결과 시스템 입력 및 상급자 검토 제출\n- 도봉구 잔여 필지 현장조사 일정 협의',
    special:'- 조사 대상 필지 중 1건 무단 형질변경 의심 — 관계 기관 통보 예정',
  },
  monthly:{
    dept:'부동산공시처',
    period:'2026. 02.',
    mainWork:'- 표준지공시지가 현장조사 총 47건 완료\n- 비교표준지 가격 검토 18건 처리\n- 이의신청 처리 결과 통보 11건',
    nextPlan:'- 3월 현장조사 계획 수립 및 조사원 배정\n- 1분기 실적 취합 및 처장 보고',
    special:'- 2월 조사 완료율 94.0% — 전월(91.2%) 대비 개선',
  },
  officetel:{
    dept:'부동산통계처 상업자산통계부',
    period:'2025. 04. ~ 06. (2분기)',
    mainWork:"- '25년 2분기 주택가격동향조사 완료 (9개 시도, 표본 2,300호)\n- 매매가격 전국 0.39% 하락 (수도권 -0.34%, 지방 -0.56%), 서울 보합(0.00%)\n- 전세가격 전국 0.25% 하락, 전세기피 현상 심화에 따른 월세전환 증가 추세 확인\n- 월세가격 전국 0.20% 상승, 역세권 주택 중심 수도권 수요 견조\n- 전국 전월세전환율 6.35%, 매매 대비 전세가율 85.18%, 수익률 5.55% 산출 완료",
    nextPlan:"- '25년 3분기 주택가격동향조사 준비 (7월 조사 개시)\n- 시도별 표본 유지·교체 현황 점검 및 조사원 배정\n- 조사 결과 검증 및 통계청 보고 (10월 예정)\n- 규모별(4구간: 40㎡ 이하 등) 지수 이상치 검증 작업",
    special:"- 서울 매매 보합(0.00%) 전환: 중대형 상승·초소형 하락 상쇄 (전분기 +0.03%)\n- 인천 전세 하락폭 확대(-0.47%→-0.64%): 전세사기 우려 지속\n- 전국 매매가 대비 전세가율 85.18% — 고위험 임계치 근접, 모니터링 강화 필요",
  },
};

/* ── 차트 데이터 ── */
// 주택가격동향조사 — 가격지수 월별 추이
const INDEX_TREND=[
  {month:'2025.4월', 매매:97.82, 전세:98.67, 월세:101.79},
  {month:'2025.5월', 매매:97.71, 전세:98.58, 월세:101.85},
  {month:'2025.6월', 매매:97.57, 전세:98.49, 월세:101.92},
];
// 지역별 전분기 변동률
const REGION_RATE=[
  {area:'전국',  매매:-0.39, 전세:-0.25, 월세:0.20},
  {area:'수도권',매매:-0.34, 전세:-0.23, 월세:0.25},
  {area:'서울',  매매:0.00,  전세:-0.02, 월세:0.28},
  {area:'인천',  매매:-0.91, 전세:-0.64, 월세:0.08},
  {area:'경기',  매매:-0.47, 전세:-0.31, 월세:0.28},
];
// 주간/월간 실적 차트 데이터
const WEEKLY_CHART=[
  {item:'현장조사', 완료:8, 목표:10},
  {item:'가격검토', 완료:3, 목표:5},
  {item:'의견서',   완료:2, 목표:2},
];
const MONTHLY_CHART=[
  {item:'현장조사', 완료:47, 목표:50},
  {item:'가격검토', 완료:18, 목표:20},
  {item:'이의신청', 완료:11, 목표:15},
];
const FIELD_CHART=[
  {item:'대상 필지', 완료:5, 목표:5},
  {item:'사례 수집', 완료:8, 목표:10},
  {item:'현황 기록', 완료:3, 목표:3},
];

const CustomTooltip=({active,payload,label})=>{
  if(!active||!payload?.length) return null;
  return(
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-[11px]">
      <div className="font-black text-slate-700 mb-1">{label}</div>
      {payload.map(p=>(
        <div key={p.name} className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{background:p.color}}/>
          <span className="text-slate-600">{p.name}:</span>
          <span className="font-bold" style={{color:p.color}}>{p.value}{typeof p.value==='number'&&p.value<=10?'건':''}</span>
        </div>
      ))}
    </div>
  );
};

const ReportAgent=({onBack})=>{
  const {step,setStep,agentIdx,doneIdx,start:startSim,resetSim}=useAgentSimulation(AGENTS,{
    onComplete:()=>setEditResult(buildRawText()),
  });
  const [reportType,setReportType]=useState('weekly');
  const [dept,setDept]=useState('부동산공시처');
  const [period,setPeriod]=useState('2026. 03. 09. ~ 03. 13.');
  const [mainWork,setMainWork]=useState(
    '- 표준지공시지가 현장조사 8건 완료 (서울 노원구·강북구)\n- 비교표준지 가격 검토 3건 처리\n- 이의신청 검토 의견서 작성 2건'
  );
  const [nextPlan,setNextPlan]=useState(
    '- 표준지공시지가 현장조사 12건 예정 (서울 도봉구·중랑구)\n- 분기 실적 집계 및 보고서 작성\n- 이의신청 처리 결과 통보 3건'
  );
  const [special,setSpecial]=useState('- 노원구 일부 표준지 현황 변동 사항 발생 (재조사 필요 2건)');
  const [viewMode,setViewMode]=useState('doc');
  const [apvState,setApvState]=useState(null);
  const [apvMsg,setApvMsg]=useState('검토 요청드립니다.');
  const [editResult,setEditResult]=useState('');
  const [tone,setTone]=useState('formal');
  const [length,setLength]=useState('medium');
  const [showExportMenu,setShowExportMenu]=useState(false);

  const DOC_NUM=DOC_NUMS[reportType]||'KREA-부동산공시처-2026-027';

  /* 보고서 유형 변경 시 기본값 자동 세팅 */
  useEffect(()=>{
    const d=REPORT_DEFAULTS[reportType];
    if(!d) return;
    setDept(d.dept);
    setPeriod(d.period);
    setMainWork(d.mainWork);
    setNextPlan(d.nextPlan);
    setSpecial(d.special);
  },[reportType]);

  const startProcess=()=>startSim();

  const reset=()=>{resetSim();setApvState(null);setApvMsg('검토 요청드립니다.');setShowExportMenu(false);};
  const submitApv=()=>{setApvState('submitting');setTimeout(()=>{setApvState('done');},1600);};

  const buildRawText=()=>`[${REPORT_TYPES.find(t=>t.id===reportType)?.label||'주간실적보고'}]

부서: ${dept}
기간: ${period}
문서번호: ${DOC_NUM}

1. 주요 실적
${mainWork}

2. 차주 계획
${nextPlan}

3. 특이 사항
${special||'(해당 없음)'}

작성자: 김민준 (부동산공시처 과장)
작성일: 2026. 03. 13.`;

  const selectedType=REPORT_TYPES.find(t=>t.id===reportType);

  const downloadDoc=()=>{
    if(reportType==='officetel'){
      const officetelHtml=`<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8">
<title>주택가격동향조사 — ${DOC_NUM}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;900&display=swap');
  @page{size:A4;margin:12mm 15mm}
  *{-webkit-print-color-adjust:exact;print-color-adjust:exact;box-sizing:border-box}
  body{font-family:'Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif;margin:0;color:#1a202c;font-size:12px;line-height:1.75;word-break:keep-all;letter-spacing:-0.01em}
  .hd{border:1px solid #003087;display:grid;grid-template-columns:150px 1fr;grid-template-rows:auto auto;margin-bottom:14px}
  .hd-logo{grid-column:1;grid-row:1/3;display:flex;align-items:center;justify-content:center;padding:14px 12px;background:#fff;border-right:1px solid #003087}
  .hd-logo img{width:120px;height:auto}
  .hd-title{grid-column:2;grid-row:1;display:flex;align-items:center;justify-content:center;padding:14px 12px;background:#e6e6e6;border-bottom:1px solid #003087}
  .hd-h1{font-size:28px;font-weight:900;letter-spacing:.4em;padding-right:.4em;color:#003087;line-height:1.2}
  .hd-meta{grid-column:2;grid-row:2;display:grid;grid-template-columns:64px 1fr 64px 1fr}
  .hd-ml{display:flex;align-items:center;justify-content:center;padding:6px 8px;background:#dbeafe;border-right:1px solid #003087;font-size:10px;font-weight:700;color:#003087}
  .hd-mv{display:flex;align-items:center;padding:6px 10px;border-right:1px solid #003087;font-size:11px;color:#1a202c;font-weight:600}
  .hd-mv-last{display:flex;flex-direction:column;justify-content:center;gap:2px;padding:6px 10px;font-size:10px;color:#1a202c}
  .kpi{background:#eef2ff;border:1px solid #c7d2fe;border-radius:8px;padding:12px 16px;margin-bottom:12px}
  .kpi-title{font-size:10px;font-weight:800;color:#003087;margin-bottom:10px}
  .kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:8px}
  .kpi-card{background:#fff;border:1px solid #e0e7ff;border-radius:6px;padding:8px 10px;text-align:center}
  .kpi-lbl{font-size:9px;color:#6b7280;font-weight:700;margin-bottom:3px}
  .kpi-val{font-size:16px;font-weight:900;line-height:1.2}
  .kpi-sub{font-size:9px;color:#9ca3af;margin-top:2px}
  .kpi-stat{background:#f8fafc;border:1px solid #e2e8f0;border-radius:5px;padding:5px 8px;display:flex;justify-content:space-between;align-items:center}
  .kpi-sl{font-size:9px;color:#6b7280;font-weight:600}
  .kpi-sv{font-size:11px;color:#1e3a8a;font-weight:800}
  .sh{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:900;color:#1a202c;margin:14px 0 7px}
  .sn{width:20px;height:20px;background:#003087;color:white;border-radius:3px;display:inline-flex;align-items:center;justify-content:center;font-size:9px;font-weight:900;flex-shrink:0}
  .ml{margin-left:27px}
  .rcard-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:8px}
  .rcard{background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:6px 10px}
  .rcard-area{font-size:9px;color:#94a3b8;font-weight:700;margin-bottom:1px}
  .rcard-rate{font-size:14px;font-weight:900;line-height:1.2}
  .rcard-prev{font-size:9px;color:#cbd5e1;margin-top:2px}
  .drow{display:flex;gap:6px;font-size:11px;line-height:1.6;align-items:flex-start;margin-bottom:5px}
  .drow-area{font-weight:800;color:#003087;width:36px;flex-shrink:0}
  .drow-rate{font-weight:700;flex-shrink:0;width:52px}
  .drow-note{color:#475569}
  table.idx{width:100%;border-collapse:collapse;font-size:10px;border:1px solid #e2e8f0}
  table.idx th{background:#003087;color:#fff;padding:5px 7px;font-weight:700;text-align:left}
  table.idx td{padding:4px 7px;border-bottom:1px solid #f1f5f9}
  table.idx tr.cat td{background:#dbeafe;font-weight:800;color:#003087}
  .note{font-size:9px;color:#9ca3af;margin-top:4px}
  table.jw{width:100%;border-collapse:collapse;font-size:10px;border:1px solid #e2e8f0}
  table.jw th{background:#003087;color:#fff;padding:5px 7px;font-weight:700;text-align:center}
  table.jw td{padding:4px 7px;border-bottom:1px solid #f1f5f9;text-align:center}
  .contact{background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:8px 12px;font-size:10px;color:#64748b;margin-top:14px}
  .sig-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:14px;border-top:2px solid #003087;padding-top:12px}
  .sig-box{border:1px solid #cbd5e0;border-radius:5px;overflow:hidden}
  .sig-lbl{background:#003087;color:white;text-align:center;padding:5px;font-size:10px;font-weight:700}
  .sig-sp{height:48px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:6px;gap:2px}
  .sig-name{font-size:12px;font-weight:700;color:#334155}
  .sig-dept{font-size:10px;color:#94a3b8}
  .footer{text-align:center;font-size:9px;color:#9ca3af;margin-top:10px}
  .red{color:#dc2626}.green{color:#16a34a}.blue{color:#1e40af}.gray{color:#475569}
</style></head><body>
<script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};};</script>
<div class="hd">
  <div class="hd-logo"><img src="${REB_LOGO}" alt="한국부동산원"/></div>
  <div class="hd-title"><div class="hd-h1">주택가격동향조사</div></div>
  <div class="hd-meta">
    <div class="hd-ml">담당부서</div><div class="hd-mv">${dept}</div>
    <div class="hd-ml">문서번호</div>
    <div class="hd-mv-last"><span style="font-family:monospace;font-weight:700">${DOC_NUM}</span><span style="color:#6b7280;font-size:9px">수신: 내부결재</span></div>
  </div>
</div>

<table style="width:100%;border-collapse:collapse;font-size:11px;border-top:2px solid #003087;margin-bottom:12px">
  <tr style="border-bottom:1px solid #e2e8f0"><td style="padding:5px 8px;font-weight:700;color:#003087;width:80px">담당 부서</td><td style="padding:5px 8px;font-weight:600" colspan="3">${dept}</td></tr>
  <tr style="border-bottom:1px solid #e2e8f0"><td style="padding:5px 8px;font-weight:700;color:#003087">조사 기간</td><td style="padding:5px 8px">${period}</td><td style="padding:5px 8px;font-weight:700;color:#003087;width:70px">배포 일시</td><td style="padding:5px 8px">2025년 7월 15일 (화)</td></tr>
  <tr style="border-bottom:1px solid #e2e8f0"><td style="padding:5px 8px;font-weight:700;color:#003087">주요 내용</td><td style="padding:5px 8px;font-size:10px" colspan="3">${mainWork.replace(/\n/g,'<br/>')}</td></tr>
</table>

<div class="kpi">
  <div class="kpi-title">▪ 2025년 2분기 주택가격동향 핵심 지표 (전분기 대비)</div>
  <div class="kpi-grid">
    <div class="kpi-card"><div class="kpi-lbl">매매가격</div><div class="kpi-val red">▼ 0.39%</div><div class="kpi-sub">전분기 -0.39%</div></div>
    <div class="kpi-card"><div class="kpi-lbl">전세가격</div><div class="kpi-val red">▼ 0.25%</div><div class="kpi-sub">전분기 -0.22%</div></div>
    <div class="kpi-card"><div class="kpi-lbl">월세가격</div><div class="kpi-val green">▲ 0.20%</div><div class="kpi-sub">전분기 +0.49%</div></div>
    <div class="kpi-card"><div class="kpi-lbl">전월세전환율</div><div class="kpi-val blue">6.35%</div><div class="kpi-sub">수익률 5.55%</div></div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">
    <div class="kpi-stat"><span class="kpi-sl">전국 매매 평균가격</span><span class="kpi-sv">221,662천원</span></div>
    <div class="kpi-stat"><span class="kpi-sl">전국 전세가율</span><span class="kpi-sv">85.18%</span></div>
    <div class="kpi-stat"><span class="kpi-sl">서울 월세 평균</span><span class="kpi-sv">914천원/월</span></div>
  </div>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 14px">
    <div style="font-size:10px;font-weight:800;color:#003087;margin-bottom:6px;letter-spacing:0.03em">▪ 가격지수 월별 추이 (2023.12=100.0)</div>
    <svg viewBox="0 0 310 155" width="100%" style="display:block;margin-bottom:6px">
      <defs><linearGradient id="gBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f0f9ff"/><stop offset="100%" stop-color="#f8fafc"/></linearGradient></defs>
      <rect x="40" y="10" width="250" height="110" fill="url(#gBg)" rx="3"/>
      <line x1="40" y1="37" x2="290" y2="37" stroke="#e2e8f0" stroke-dasharray="3,3"/>
      <line x1="40" y1="64" x2="290" y2="64" stroke="#e2e8f0" stroke-dasharray="3,3"/>
      <line x1="40" y1="91" x2="290" y2="91" stroke="#e2e8f0" stroke-dasharray="3,3"/>
      <text x="36" y="14" text-anchor="end" font-size="7" fill="#94a3b8">102</text>
      <text x="36" y="41" text-anchor="end" font-size="7" fill="#94a3b8">100</text>
      <text x="36" y="68" text-anchor="end" font-size="7" fill="#94a3b8">98</text>
      <text x="36" y="95" text-anchor="end" font-size="7" fill="#94a3b8">96</text>
      <text x="75" y="132" text-anchor="middle" font-size="8" fill="#64748b">4월</text>
      <text x="165" y="132" text-anchor="middle" font-size="8" fill="#64748b">5월</text>
      <text x="255" y="132" text-anchor="middle" font-size="8" fill="#64748b">6월</text>
      <polyline points="75,87 165,89 255,92" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="75" cy="87" r="3.5" fill="#dc2626"/><circle cx="165" cy="89" r="3.5" fill="#dc2626"/><circle cx="255" cy="92" r="3.5" fill="#dc2626"/>
      <text x="72" y="83" text-anchor="end" font-size="7" fill="#dc2626" font-weight="700">97.82</text>
      <text x="258" y="100" font-size="7" fill="#dc2626" font-weight="700">97.57</text>
      <polyline points="75,73 165,76 255,78" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="75" cy="73" r="3.5" fill="#2563eb"/><circle cx="165" cy="76" r="3.5" fill="#2563eb"/><circle cx="255" cy="78" r="3.5" fill="#2563eb"/>
      <text x="72" y="70" text-anchor="end" font-size="7" fill="#2563eb" font-weight="700">98.67</text>
      <text x="258" y="75" font-size="7" fill="#2563eb" font-weight="700">98.49</text>
      <polyline points="75,24 165,23 255,22" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="75" cy="24" r="3.5" fill="#16a34a"/><circle cx="165" cy="23" r="3.5" fill="#16a34a"/><circle cx="255" cy="22" r="3.5" fill="#16a34a"/>
      <text x="72" y="20" text-anchor="end" font-size="7" fill="#16a34a" font-weight="700">101.79</text>
      <text x="258" y="19" font-size="7" fill="#16a34a" font-weight="700">101.92</text>
      <rect x="60" y="140" width="16" height="3" rx="1" fill="#dc2626"/><text x="80" y="143" font-size="7" fill="#64748b">매매</text>
      <rect x="110" y="140" width="16" height="3" rx="1" fill="#2563eb"/><text x="130" y="143" font-size="7" fill="#64748b">전세</text>
      <rect x="160" y="140" width="16" height="3" rx="1" fill="#16a34a"/><text x="180" y="143" font-size="7" fill="#64748b">월세</text>
    </svg>
    <div style="font-size:9px;color:#94a3b8">매매·전세 하락 지속, 월세 상승 추세</div>
  </div>
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 14px">
    <div style="font-size:10px;font-weight:800;color:#003087;margin-bottom:6px;letter-spacing:0.03em">▪ 지역별 전분기 변동률 (%)</div>
    <svg viewBox="0 0 310 155" width="100%" style="display:block;margin-bottom:6px">
      <rect x="40" y="10" width="250" height="110" fill="#fafbfd" rx="3"/>
      <line x1="40" y1="37" x2="290" y2="37" stroke="#e2e8f0" stroke-dasharray="3,3"/>
      <line x1="40" y1="64" x2="290" y2="64" stroke="#94a3b8" stroke-width="1.2"/>
      <line x1="40" y1="91" x2="290" y2="91" stroke="#e2e8f0" stroke-dasharray="3,3"/>
      <text x="36" y="41" text-anchor="end" font-size="7" fill="#94a3b8">+0.5</text>
      <text x="36" y="68" text-anchor="end" font-size="7" fill="#94a3b8">0</text>
      <text x="36" y="95" text-anchor="end" font-size="7" fill="#94a3b8">-0.5</text>
      <text x="36" y="122" text-anchor="end" font-size="7" fill="#94a3b8">-1.0</text>
      <g transform="translate(58,0)">
        <rect x="0" y="64" width="10" height="21" rx="2" fill="#fca5a5"/>
        <rect x="13" y="64" width="10" height="14" rx="2" fill="#93c5fd"/>
        <rect x="26" y="53" width="10" height="11" rx="2" fill="#86efac"/>
        <text x="18" y="132" text-anchor="middle" font-size="7.5" fill="#334155" font-weight="700">전국</text>
      </g>
      <g transform="translate(108,0)">
        <rect x="0" y="64" width="10" height="18" rx="2" fill="#fca5a5"/>
        <rect x="13" y="64" width="10" height="12" rx="2" fill="#93c5fd"/>
        <rect x="26" y="50" width="10" height="14" rx="2" fill="#86efac"/>
        <text x="18" y="132" text-anchor="middle" font-size="7.5" fill="#334155" font-weight="700">수도권</text>
      </g>
      <g transform="translate(158,0)">
        <rect x="0" y="63" width="10" height="1" rx="0.5" fill="#cbd5e1"/>
        <rect x="13" y="64" width="10" height="1" rx="0.5" fill="#93c5fd"/>
        <rect x="26" y="49" width="10" height="15" rx="2" fill="#86efac"/>
        <text x="18" y="132" text-anchor="middle" font-size="7.5" fill="#334155" font-weight="700">서울</text>
      </g>
      <g transform="translate(208,0)">
        <rect x="0" y="64" width="10" height="49" rx="2" fill="#fca5a5"/>
        <rect x="13" y="64" width="10" height="35" rx="2" fill="#93c5fd"/>
        <rect x="26" y="59" width="10" height="5" rx="2" fill="#86efac"/>
        <text x="18" y="132" text-anchor="middle" font-size="7.5" fill="#334155" font-weight="700">인천</text>
      </g>
      <g transform="translate(258,0)">
        <rect x="0" y="64" width="10" height="25" rx="2" fill="#fca5a5"/>
        <rect x="13" y="64" width="10" height="17" rx="2" fill="#93c5fd"/>
        <rect x="26" y="49" width="10" height="15" rx="2" fill="#86efac"/>
        <text x="18" y="132" text-anchor="middle" font-size="7.5" fill="#334155" font-weight="700">경기</text>
      </g>
      <rect x="60" y="140" width="10" height="5" rx="1" fill="#fca5a5"/><text x="74" y="145" font-size="7" fill="#64748b">매매</text>
      <rect x="110" y="140" width="10" height="5" rx="1" fill="#93c5fd"/><text x="124" y="145" font-size="7" fill="#64748b">전세</text>
      <rect x="160" y="140" width="10" height="5" rx="1" fill="#86efac"/><text x="174" y="145" font-size="7" fill="#64748b">월세</text>
    </svg>
    <div style="font-size:9px;color:#94a3b8">인천 매매 -0.91% 최대 하락 | 서울 매매 보합 전환</div>
  </div>
</div>

<div class="sh"><span class="sn">1</span> 매매가격동향</div>
<div class="ml">
  <div class="rcard-grid">
    <div class="rcard"><div class="rcard-area">전국</div><div class="rcard-rate red">-0.39%</div><div class="rcard-prev">전분기 -0.39%</div></div>
    <div class="rcard"><div class="rcard-area">수도권</div><div class="rcard-rate red">-0.34%</div><div class="rcard-prev">전분기 -0.31%</div></div>
    <div class="rcard"><div class="rcard-area">지방</div><div class="rcard-rate red">-0.56%</div><div class="rcard-prev">전분기 -0.72%</div></div>
  </div>
  <div class="drow"><span class="drow-area">서울</span><span class="drow-rate gray">(0.00%)</span><span class="drow-note">중대형 주택 상승 + 초소형 하락 상쇄 → 보합 전환 (전분기 0.03%→0.00%)</span></div>
  <div class="drow"><span class="drow-area">인천</span><span class="drow-rate red">(-0.91%)</span><span class="drow-note">입주예정 매물 누적 하락세 지속. 역세권 신축 매수 문의 증가로 하락폭 소폭 축소 (-0.96%→-0.91%)</span></div>
  <div class="drow"><span class="drow-area">경기</span><span class="drow-rate red">(-0.47%)</span><span class="drow-note">신도시 신축 공급 과잉이 하락 주도. 노후 단지 투자 수요 감소로 하락폭 확대 (-0.40%→-0.47%)</span></div>
</div>

<div class="sh"><span class="sn">2</span> 전세가격동향</div>
<div class="ml">
  <div class="rcard-grid">
    <div class="rcard"><div class="rcard-area">전국</div><div class="rcard-rate red">-0.25%</div><div class="rcard-prev">전분기 -0.22%</div></div>
    <div class="rcard"><div class="rcard-area">수도권</div><div class="rcard-rate red">-0.23%</div><div class="rcard-prev">전분기 -0.16%</div></div>
    <div class="rcard"><div class="rcard-area">지방</div><div class="rcard-rate red">-0.30%</div><div class="rcard-prev">전분기 -0.44%</div></div>
  </div>
  <div class="drow"><span class="drow-area">서울</span><span class="drow-rate red">(-0.02%)</span><span class="drow-note">이사철 마무리로 이주 수요 감소. 전세기피·월세전환 증가로 상승→하락 전환 (0.01%→-0.02%)</span></div>
  <div class="drow"><span class="drow-area">인천</span><span class="drow-rate red">(-0.64%)</span><span class="drow-note">전세사기·역전세 우려로 전세기피 지속. 노후 주택 중심 하락폭 확대 (-0.47%→-0.64%)</span></div>
  <div class="drow"><span class="drow-area">경기</span><span class="drow-rate red">(-0.31%)</span><span class="drow-note">매매가 하락에 따른 보증금 미반환 불안 확산. 공급 과잉 지역 중심 하락폭 확대 (-0.22%→-0.31%)</span></div>
</div>

<div class="sh"><span class="sn">3</span> 월세가격동향</div>
<div class="ml">
  <div class="rcard-grid">
    <div class="rcard"><div class="rcard-area">전국</div><div class="rcard-rate green">+0.20%</div><div class="rcard-prev">전분기 +0.49%</div></div>
    <div class="rcard"><div class="rcard-area">수도권</div><div class="rcard-rate green">+0.25%</div><div class="rcard-prev">전분기 +0.56%</div></div>
    <div class="rcard"><div class="rcard-area">지방</div><div class="rcard-rate green">+0.04%</div><div class="rcard-prev">전분기 +0.20%</div></div>
  </div>
  <div class="drow"><span class="drow-area">서울</span><span class="drow-rate green">(+0.28%)</span><span class="drow-note">역세권 입주여건 양호 지역 중심 상승. 이사철 마무리로 상승폭 축소 (0.44%→0.28%)</span></div>
  <div class="drow"><span class="drow-area">인천</span><span class="drow-rate green">(+0.08%)</span><span class="drow-note">공급 과잉·노후 주택 하락으로 상승폭 대폭 축소 (1.30%→0.08%)</span></div>
  <div class="drow"><span class="drow-area">경기</span><span class="drow-rate green">(+0.28%)</span><span class="drow-note">교통 양호 지역 월세선호 증가로 상승. 신도시 공급 과잉 지역은 하락 (0.43%→0.28%)</span></div>
</div>

<div class="sh"><span class="sn">4</span> 2025년 4~6월 가격지수 및 변동률 (2023.12=100.0)</div>
<div class="ml">
  <table class="idx">
    <thead><tr><th>구분</th><th>지역</th><th>2025.4</th><th>2025.5</th><th>2025.6</th><th>전분기 변동률(%)</th></tr></thead>
    <tbody>
      <tr class="cat"><td colspan="6">매매가격</td></tr>
      <tr><td></td><td>전국</td><td>97.82</td><td>97.71</td><td>97.57</td><td class="red">-0.39</td></tr>
      <tr><td></td><td>수도권</td><td>98.24</td><td>98.13</td><td>98.02</td><td class="red">-0.34</td></tr>
      <tr><td></td><td>서울</td><td>99.70</td><td>99.71</td><td>99.70</td><td class="gray">0.00</td></tr>
      <tr class="cat"><td colspan="6">전세가격</td></tr>
      <tr><td></td><td>전국</td><td>98.67</td><td>98.58</td><td>98.49</td><td class="red">-0.25</td></tr>
      <tr><td></td><td>수도권</td><td>99.03</td><td>98.95</td><td>98.87</td><td class="red">-0.23</td></tr>
      <tr><td></td><td>서울</td><td>99.81</td><td>99.79</td><td>99.80</td><td class="red">-0.02</td></tr>
      <tr class="cat"><td colspan="6">월세가격</td></tr>
      <tr><td></td><td>전국</td><td>101.79</td><td>101.85</td><td>101.92</td><td class="green">+0.20</td></tr>
      <tr><td></td><td>수도권</td><td>102.31</td><td>102.38</td><td>102.47</td><td class="green">+0.25</td></tr>
      <tr><td></td><td>서울</td><td>102.24</td><td>102.33</td><td>102.42</td><td class="green">+0.28</td></tr>
    </tbody>
  </table>
  <p class="note">* 지수산정: 제본스지수 | 통계청 국가통계 승인번호 408002</p>
</div>

<div class="sh"><span class="sn">5</span> 지역별 전세가율 및 수익률</div>
<div class="ml">
  <svg viewBox="0 0 340 155" width="100%" style="display:block;margin-bottom:8px">
    <rect x="50" y="10" width="270" height="105" fill="#fafbfd" rx="3"/>
    <line x1="50" y1="10" x2="320" y2="10" stroke="#e2e8f0" stroke-dasharray="3,3"/>
    <line x1="50" y1="36" x2="320" y2="36" stroke="#e2e8f0" stroke-dasharray="3,3"/>
    <line x1="50" y1="62" x2="320" y2="62" stroke="#ef4444" stroke-dasharray="4,3" stroke-width="1"/>
    <line x1="50" y1="88" x2="320" y2="88" stroke="#e2e8f0" stroke-dasharray="3,3"/>
    <text x="46" y="14" text-anchor="end" font-size="7" fill="#94a3b8">92%</text>
    <text x="46" y="40" text-anchor="end" font-size="7" fill="#94a3b8">88%</text>
    <text x="46" y="66" text-anchor="end" font-size="7" fill="#94a3b8">85%</text>
    <text x="46" y="92" text-anchor="end" font-size="7" fill="#94a3b8">82%</text>
    <text x="46" y="118" text-anchor="end" font-size="7" fill="#94a3b8">78%</text>
    <text x="275" y="59" font-size="7" fill="#ef4444" font-weight="700">위험선 85%</text>
    <g transform="translate(75,0)">
      <rect x="0" y="17" width="22" height="98" rx="3" fill="#fca5a5"/>
      <rect x="25" y="78" width="22" height="37" rx="3" fill="#6ee7b7"/>
      <text x="11" y="13" text-anchor="middle" font-size="7" fill="#3b82f6" font-weight="700">88.3%</text>
      <text x="36" y="74" text-anchor="middle" font-size="7" fill="#16a34a" font-weight="700">4.8%</text>
      <text x="23" y="130" text-anchor="middle" font-size="8" fill="#334155" font-weight="700">서울</text>
    </g>
    <g transform="translate(135,0)">
      <rect x="0" y="25" width="22" height="90" rx="3" fill="#fca5a5"/>
      <rect x="25" y="68" width="22" height="47" rx="3" fill="#6ee7b7"/>
      <text x="11" y="21" text-anchor="middle" font-size="7" fill="#3b82f6" font-weight="700">87.2%</text>
      <text x="36" y="64" text-anchor="middle" font-size="7" fill="#16a34a" font-weight="700">5.4%</text>
      <text x="23" y="130" text-anchor="middle" font-size="8" fill="#334155" font-weight="700">인천</text>
    </g>
    <g transform="translate(195,0)">
      <rect x="0" y="29" width="22" height="86" rx="3" fill="#fca5a5"/>
      <rect x="25" y="72" width="22" height="43" rx="3" fill="#6ee7b7"/>
      <text x="11" y="25" text-anchor="middle" font-size="7" fill="#3b82f6" font-weight="700">86.7%</text>
      <text x="36" y="68" text-anchor="middle" font-size="7" fill="#16a34a" font-weight="700">5.1%</text>
      <text x="23" y="130" text-anchor="middle" font-size="8" fill="#334155" font-weight="700">경기</text>
    </g>
    <g transform="translate(255,0)">
      <rect x="0" y="52" width="22" height="63" rx="3" fill="#bfdbfe"/>
      <rect x="25" y="62" width="22" height="53" rx="3" fill="#6ee7b7"/>
      <text x="11" y="48" text-anchor="middle" font-size="7" fill="#3b82f6" font-weight="700">83.5%</text>
      <text x="36" y="58" text-anchor="middle" font-size="7" fill="#16a34a" font-weight="700">5.8%</text>
      <text x="23" y="130" text-anchor="middle" font-size="8" fill="#334155" font-weight="700">부산</text>
    </g>
    <rect x="65" y="142" width="12" height="5" rx="1" fill="#fca5a5"/><text x="81" y="147" font-size="7" fill="#64748b">전세가율(≥85%)</text>
    <rect x="145" y="142" width="12" height="5" rx="1" fill="#bfdbfe"/><text x="161" y="147" font-size="7" fill="#64748b">전세가율(&lt;85%)</text>
    <rect x="225" y="142" width="12" height="5" rx="1" fill="#6ee7b7"/><text x="241" y="147" font-size="7" fill="#64748b">수익률</text>
  </svg>
  <table class="jw">
    <thead><tr><th>지역</th><th>전세가율(%)</th><th>수익률(%)</th><th>고위험 여부</th></tr></thead>
    <tbody>
      <tr><td>서울</td><td class="blue">88.34</td><td class="green">4.82</td><td class="red" style="font-weight:700">고위험</td></tr>
      <tr><td>인천</td><td class="blue">87.20</td><td class="green">5.41</td><td class="red" style="font-weight:700">고위험</td></tr>
      <tr><td>경기</td><td class="blue">86.72</td><td class="green">5.13</td><td class="red" style="font-weight:700">고위험</td></tr>
      <tr><td>부산</td><td class="blue">83.45</td><td class="green">5.77</td><td class="gray">정상</td></tr>
      <tr style="background:#f0f9ff;font-weight:700"><td>전국</td><td class="blue">85.18</td><td class="green">5.55</td><td class="red" style="font-weight:700">고위험 임계</td></tr>
    </tbody>
  </table>
  <p class="note">* 전세가율 85% 이상(빨간 막대): 전세사기·깡통전세 고위험 임계치 | 수익률: 월세 연환산 ÷ 전세보증금</p>
</div>

<div class="sh"><span class="sn">6</span> 향후 계획</div>
<div class="ml" style="font-size:11px;color:#374151;line-height:1.9">${nextPlan.replace(/\n/g,'<br/>')}</div>

<div class="sh"><span class="sn">7</span> 특이 사항</div>
<div class="ml" style="font-size:11px;color:#374151;line-height:1.9">${(special||'(해당 없음)').replace(/\n/g,'<br/>')}</div>

<div class="contact">
  <span style="font-weight:700;color:#003087">문의</span>　부동산통계처 상업자산통계부장 최윤주 ☎ (053)663-8531 | 담당 차장 박병희 ☎ (053)663-8532　｜　자료확인: R-ONE 부동산통계정보시스템 www.reb.or.kr/r-one
</div>

<div class="sig-grid">
  ${APV_LINE.map(p=>`<div class="sig-box"><div class="sig-lbl">${p.role}</div><div class="sig-sp"><div class="sig-name">${p.name}</div><div class="sig-dept">${p.dept}</div></div></div>`).join('')}
</div>
<p class="footer">본 보고서는 GENOS AI 보고서 작성 에이전트에 의해 자동 생성되었으며, 담당자 검토 후 확정됩니다.</p>
</body></html>`;
      const w=window.open('','_blank','width=900,height=1200');
      w.document.write(officetelHtml);
      w.document.close();
      w.focus();
      return;
    }

    const html=`<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>${selectedType?.label} — ${DOC_NUM}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;900&display=swap');
      @page{size:A4;margin:15mm 18mm}
      *{-webkit-print-color-adjust:exact;print-color-adjust:exact;box-sizing:border-box}
      body{font-family:'Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif;margin:0;color:#1a202c;font-size:14px;line-height:1.9;word-break:keep-all;letter-spacing:-0.01em}
      .hd{border:1px solid #091D58}
      .hd-grid{display:grid;grid-template-columns:170px 1fr;grid-template-rows:auto auto}
      .hd-logo{grid-column:1;grid-row:1/3;display:flex;align-items:center;justify-content:center;padding:16px 14px;background:#fff;border-right:1px solid #091D58}
      .hd-logo img{width:130px;height:auto}
      .hd-title{grid-column:2;grid-row:1;display:flex;align-items:center;justify-content:center;padding:16px 12px;background:#e6e6e6;border-bottom:1px solid #091D58}
      .hd-meta{grid-column:2;grid-row:2;display:grid;grid-template-columns:72px 1fr 72px 1fr}
      .hd-h1{font-size:34px;font-weight:900;letter-spacing:.4em;padding-right:.4em;white-space:nowrap;font-family:'HY견고딕','돋움','맑은 고딕',sans-serif;color:#041E54;line-height:1.2}
      .hd-meta-lbl{display:flex;align-items:center;justify-content:center;padding:7px 10px;background:#dfeaf5;border-right:1px solid #091D58;font-size:12px;font-weight:700;color:#091D58}
      .hd-meta-val{display:flex;align-items:center;padding:7px 12px;border-right:1px solid #091D58;font-size:13.5px;color:#1a202c;font-weight:600}
      .hd-meta-val-last{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:2px;padding:7px 12px;font-size:12px;color:#1a202c}
      .body{background:white;padding:24px 30px}
      .info-tbl{width:100%;border-collapse:collapse;border-top:2px solid #064e3b;margin-bottom:18px}
      .info-tbl td{padding:9px 11px;border-bottom:1px solid #e2e8f0;font-size:13.5px;line-height:1.7}
      .lbl{font-weight:700;color:#064e3b;width:72px;white-space:nowrap}
      .sh{display:flex;align-items:center;gap:8px;font-size:15.5px;font-weight:900;color:#1a202c;margin:20px 0 9px}
      .sn{width:22px;height:22px;background:#064e3b;color:white;border-radius:3px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:900;flex-shrink:0}
      .sc{margin-left:30px;font-size:14px;color:#374151;line-height:2.0;word-break:keep-all}
      .sig-area{border-top:2px solid #064e3b;padding-top:14px;margin-top:20px}
      .sig-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
      .sig-box{border:1px solid #cbd5e0;border-radius:5px;overflow:hidden}
      .sig-lbl{background:#064e3b;color:white;text-align:center;padding:6px;font-size:12px;font-weight:700}
      .sig-sp{height:54px}
      .footer{text-align:center;font-size:11px;color:#a0aec0;margin-top:12px}
    </style></head><body>
    <script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};};</script>
    <div class="hd">
      <div class="hd-grid">
        <div class="hd-logo"><img src="${REB_LOGO}" alt="REB 한국부동산원"/></div>
        <div class="hd-title"><div class="hd-h1">${selectedType?.label||'주간실적보고'}</div></div>
        <div class="hd-meta">
          <div class="hd-meta-lbl">담당부서</div>
          <div class="hd-meta-val">${dept}</div>
          <div class="hd-meta-lbl">문서번호</div>
          <div class="hd-meta-val-last"><span style="font-family:monospace;font-weight:700">${DOC_NUM}</span><span style="color:#6b7280;font-size:9px">수신: 내부결재</span></div>
        </div>
      </div>
    </div>
    <div class="body">
      <table class="info-tbl">
        <tr><td class="lbl">보고 부서</td><td><strong>${dept}</strong></td><td class="lbl">문서번호</td><td><strong>${DOC_NUM}</strong></td></tr>
        <tr><td class="lbl">보고 기간</td><td colspan="3">${period}</td></tr>
      </table>
      <div class="sh"><span class="sn">1</span> 주요 실적</div>
      <div class="sc">${mainWork.split('\n').map(l=>`<p>${l}</p>`).join('')}</div>
      <div class="sh"><span class="sn">2</span> 차주 계획</div>
      <div class="sc">${nextPlan.split('\n').map(l=>`<p>${l}</p>`).join('')}</div>
      <div class="sh"><span class="sn">3</span> 특이 사항</div>
      <div class="sc">${(special||'(해당 없음)').split('\n').map(l=>`<p>${l}</p>`).join('')}</div>
      <div class="sig-area">
        <div class="sig-grid">${['작  성  자','검  토  자','승  인  자'].map(r=>`<div class="sig-box"><div class="sig-lbl">${r}</div><div class="sig-sp"></div></div>`).join('')}</div>
        <p class="footer">본 보고서는 GENOS AI 보고서 작성 에이전트에 의해 자동 생성되었으며, 담당자 검토 후 확정됩니다.</p>
      </div>
    </div>
    </body></html>`;
    const w=window.open('','_blank','width=900,height=1200');
    w.document.write(html);
    w.document.close();
    w.focus();
  };

  if(step===1) return(
    <div className="flex-1 overflow-y-auto px-6 py-8 bg-white">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-2">
          {onBack&&<button onClick={onBack} className="text-slate-400 hover:text-slate-600 text-[11px] font-bold flex items-center gap-1 shrink-0"><ChevronRight className="w-3.5 h-3.5 rotate-180"/>뒤로</button>}
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md shrink-0"><FileText className="w-5 h-5 text-white"/></div>
          <div>
            <div className="text-[15px] font-black text-slate-800">보고서 템플릿 자동 작성 에이전트</div>
            <div className="text-xs text-slate-400">표준 양식 선택 → 정보 입력 → AI 보고서 자동 생성</div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">1 · 보고서 유형 선택</label>
          <div className="grid grid-cols-2 gap-3">
            {REPORT_TYPES.map(t=>(
              <button key={t.id} onClick={()=>setReportType(t.id)}
                className={cn(
                  'flex flex-col items-start gap-1.5 px-4 py-3.5 border-2 rounded-2xl text-left transition-all',
                  reportType===t.id
                    ?'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100'
                    :'border-slate-200 hover:border-emerald-200 hover:bg-slate-50'
                )}>
                <div className="flex items-center gap-2 w-full">
                  <span className="text-xl">{t.icon}</span>
                  <span className={cn('font-black text-[13px]',reportType===t.id?'text-emerald-700':'text-slate-700')}>{t.label}</span>
                  {reportType===t.id&&<CheckCircle className="w-4 h-4 text-emerald-500 ml-auto shrink-0"/>}
                </div>
                <span className="text-[11px] text-slate-400 ml-7 leading-snug">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">2 · 기본 정보</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-500 font-bold mb-1 block">보고 부서</label>
              <input value={dept} onChange={e=>setDept(e.target.value)}
                className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100"/>
            </div>
            <div>
              <label className="text-[11px] text-slate-500 font-bold mb-1 block">보고 기간</label>
              <input value={period} onChange={e=>setPeriod(e.target.value)}
                className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100"/>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">3 · 주요 실적</label>
          <textarea value={mainWork} onChange={e=>setMainWork(e.target.value)} rows={4}
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 resize-none text-slate-700 leading-relaxed"/>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">4 · 차주 계획</label>
          <textarea value={nextPlan} onChange={e=>setNextPlan(e.target.value)} rows={4}
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 resize-none text-slate-700 leading-relaxed"/>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">5 · 특이 사항</label>
            <span className="text-[10px] text-slate-400">(선택)</span>
          </div>
          <textarea value={special} onChange={e=>setSpecial(e.target.value)} rows={2}
            placeholder="특이 사항이 있으면 입력하세요"
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 resize-none text-slate-700 leading-relaxed"/>
        </div>

        {/* 보고서 톤/길이 설정 */}
        <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4">
          <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider">6 · 보고서 톤 &amp; 길이 설정</div>
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-500">문체 선택</p>
            <div className="grid grid-cols-3 gap-2">
              {TONES.map(t=>(
                <button key={t.id} onClick={()=>setTone(t.id)}
                  className={cn(
                    'flex flex-col items-start px-3 py-2.5 border-2 rounded-xl text-left transition-all',
                    tone===t.id?'border-emerald-400 bg-emerald-50':'border-slate-200 hover:border-emerald-200 bg-white'
                  )}>
                  <span className={cn('text-[12px] font-black',tone===t.id?'text-emerald-700':'text-slate-700')}>{t.label}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 leading-snug">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-500">분량 선택</p>
            <div className="grid grid-cols-3 gap-2">
              {LENGTHS_REPORT.map(l=>(
                <button key={l.id} onClick={()=>setLength(l.id)}
                  className={cn(
                    'flex flex-col items-start px-3 py-2.5 border-2 rounded-xl text-left transition-all',
                    length===l.id?'border-emerald-400 bg-emerald-50':'border-slate-200 hover:border-emerald-200 bg-white'
                  )}>
                  <span className={cn('text-[12px] font-black',length===l.id?'text-emerald-700':'text-slate-700')}>{l.label}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 leading-snug">{l.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={startProcess}
          className="w-full py-3.5 bg-emerald-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100 text-[15px]">
          <Play className="w-4 h-4 fill-white"/> 보고서 자동 작성 시작
        </button>
      </div>
    </div>
  );

  if(step===2) return(
    <div className="flex-1 flex min-h-0 overflow-hidden">
      <div className="flex-1 min-w-0 flex flex-col items-center justify-center overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-xl px-6">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-100">
              <Radio className="w-7 h-7 text-white animate-pulse"/>
            </div>
            <div className="text-[18px] font-black text-slate-800">멀티 에이전트 보고서 생성 중</div>
            <div className="text-sm text-slate-400 mt-1">표준 양식을 불러오고 AI가 내용을 자동 구성합니다</div>
          </div>
          <div className="space-y-3">
            {AGENTS.map((ag,i)=>{
              const isDone=doneIdx.includes(i);
              const isActive=agentIdx===i;
              const AgIcon=ag.icon;
              return(
                <div key={i}>
                  <div className={cn(
                    'rounded-2xl border-2 p-4 transition-all duration-500',
                    isDone?'border-emerald-200 bg-emerald-50/60':
                    isActive?'border-emerald-300 bg-emerald-50 shadow-md shadow-emerald-100':
                    'border-slate-100 bg-white opacity-50'
                  )}>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all',
                        isDone?'bg-emerald-500':isActive?ag.color:'bg-slate-200'
                      )}>
                        {isDone?<CheckCircle className="w-5 h-5 text-white"/>
                          :<AgIcon className={cn('w-5 h-5',isActive?'text-white animate-pulse':'text-slate-400')}/>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={cn('font-black text-sm',isDone?'text-emerald-700':isActive?'text-emerald-700':'text-slate-400')}>{ag.label}</div>
                        <div className={cn('text-xs mt-0.5',isDone?'text-emerald-500':isActive?'text-emerald-500':'text-slate-300')}>
                          {isActive?`처리 중 — ${ag.sub}`:isDone?`완료 — ${ag.sub}`:ag.sub}
                        </div>
                      </div>
                      {isActive&&<Loader2 className="w-4 h-4 text-emerald-500 animate-spin shrink-0"/>}
                      {isDone&&<span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">완료</span>}
                    </div>
                    {isActive&&<div className="mt-3"><div className="h-1 bg-emerald-100 rounded-full overflow-hidden"><div className="h-1 bg-emerald-500 rounded-full animate-pulse" style={{width:'70%'}}/></div></div>}
                  </div>
                  {i<AGENTS.length-1&&<div className="flex justify-center my-1"><ChevronRight className="w-4 h-4 text-slate-300 rotate-90"/></div>}
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center text-xs text-slate-400">
            <Network className="w-3.5 h-3.5 inline mr-1 text-emerald-400"/>
            GPT-OSS 120B 문서 생성 모델 — 표준 공문서 형식 준수
          </div>
        </div>
      </div>
      <div className="w-80 shrink-0 border-l border-slate-100 bg-gradient-to-b from-slate-50 to-white p-4 overflow-y-auto custom-scrollbar flex flex-col">
        <AgentWorkflowPanel agentId="agent-report" activeStep={agentIdx} doneSteps={doneIdx} />
      </div>
    </div>
  );

  return(
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-100">
      <div className="shrink-0 bg-white border-b px-5 py-2.5 flex items-center gap-2 flex-wrap shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0"><CheckCircle className="w-3.5 h-3.5 text-white"/></div>
          <div className="min-w-0">
            <div className="text-[13px] font-black text-slate-800 truncate">보고서 생성 완료</div>
            <div className="text-[10px] text-slate-400">{selectedType?.label} · {DOC_NUM}</div>
          </div>
        </div>
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 gap-0.5">
          {[['doc','문서 보기'],['edit','원본 편집']].map(([m,l])=>(
            <button key={m} onClick={()=>setViewMode(m)}
              className={cn('px-3 py-1.5 rounded-md text-[11px] font-bold transition-all',
                viewMode===m?'bg-white text-emerald-700 shadow-sm':'text-slate-500 hover:text-slate-700')}>
              {m==='doc'?<Eye className="w-3 h-3 inline mr-1"/>:<Edit3 className="w-3 h-3 inline mr-1"/>}{l}
            </button>
          ))}
        </div>
        <button onClick={reset} className="flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-[11px] font-bold text-slate-500 hover:bg-slate-50 transition-colors"><RotateCcw className="w-3 h-3"/>새 보고서</button>
        {/* 내보내기 드롭다운 */}
        <div className="relative">
          <button onClick={()=>setShowExportMenu(p=>!p)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Download className="w-3 h-3"/>내보내기 ▾
          </button>
          {showExportMenu&&(
            <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
              {EXPORT_FORMATS.map(fmt=>(
                <button key={fmt.ext}
                  onClick={()=>{setShowExportMenu(false);alert(`${fmt.label.replace(/\s*\(.*\)/,'')} 형식으로 내보내기 준비 중...`);}}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left">
                  <span className="text-base">{fmt.icon}</span>
                  <span className={cn('text-[12px] font-bold',fmt.color)}>{fmt.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={downloadDoc} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[11px] font-bold hover:bg-emerald-700 transition-colors shadow-sm"><Printer className="w-3 h-3"/>출력</button>
        {apvState!=='done'
          ?<button onClick={()=>setApvState('selfcheck')} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-[11px] font-bold hover:bg-emerald-800 transition-colors shadow-sm"><FileCheck className="w-3 h-3"/>결재 상신</button>
          :<span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold"><CheckCircle className="w-3 h-3"/>결재 진행 중</span>
        }
      </div>

      {apvState==='done'&&(
        <div className="shrink-0 bg-emerald-50 border-b border-emerald-100 px-5 py-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
              <span className="text-[11px] font-black text-slate-700">결재 현황</span>
              <span className="text-[9px] font-bold text-white bg-emerald-700 px-1.5 py-0.5 rounded">WorksOn</span>
            </div>
            <div className="flex items-center gap-1 flex-1 min-w-0">
              {APV_LINE.map((p,i)=>(
                <React.Fragment key={i}>
                  <div className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] border whitespace-nowrap',
                    i===0?'bg-emerald-50 border-emerald-200':i===1?'bg-blue-50 border-blue-200 shadow-sm':'bg-white border-slate-200'
                  )}>
                    {i===0?<CheckCircle className="w-3 h-3 text-emerald-500 shrink-0"/>
                      :i===1?<Loader2 className="w-3 h-3 text-blue-500 animate-spin shrink-0"/>
                      :<Clock className="w-3 h-3 text-slate-300 shrink-0"/>}
                    <span className="font-bold text-slate-700">{p.name}</span>
                    <span className={cn('font-black text-[9px]',i===0?'text-emerald-500':i===1?'text-blue-500':'text-slate-300')}>
                      {i===0?'서명 완료':i===1?'검토 중':'대기'}
                    </span>
                  </div>
                  {i<APV_LINE.length-1&&<ChevronRight className="w-3 h-3 text-slate-300 shrink-0"/>}
                </React.Fragment>
              ))}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] text-slate-400 font-mono">APV-2026-0313-027</span>
              <a href="#" onClick={e=>e.preventDefault()} className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-0.5">WorksOn에서 보기<ExternalLink className="w-2.5 h-2.5"/></a>
            </div>
          </div>
        </div>
      )}

      {apvState==='selfcheck'&&(
        <SelfCheckModal
          docType={reportType==='officetel'?'officetel':'report'}
          onClose={()=>setApvState(null)}
          onProceed={()=>setApvState('modal')}
        />
      )}

      {(apvState==='modal'||apvState==='submitting')&&(
        <ApprovalModal
          docTitle={`${selectedType?.label} — ${period}`}
          docNum={DOC_NUM}
          apvLine={APV_LINE}
          apvMsg={apvMsg} setApvMsg={setApvMsg}
          onClose={()=>setApvState(null)}
          onSubmit={submitApv}
          submitting={apvState==='submitting'}
          accentBg="bg-emerald-700"
          accentBtn="bg-emerald-600 hover:bg-emerald-700"
        />
      )}

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {viewMode==='edit'?(
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border shadow-sm overflow-hidden">
            <textarea value={editResult} onChange={e=>setEditResult(e.target.value)}
              className="w-full p-6 font-mono text-[13px] text-slate-700 leading-relaxed resize-none outline-none"
              style={{minHeight:640}}/>
          </div>
        ):(
          <div className="max-w-3xl mx-auto shadow-2xl rounded-lg overflow-hidden"
            style={{fontFamily:"'Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif",lineHeight:1.85,wordBreak:'keep-all',letterSpacing:'-0.01em'}}>
            {/* Document header — 공식 REB 보도자료 양식 */}
            <div style={{border:'1px solid #091D58',display:'grid',gridTemplateColumns:'170px 1fr',gridTemplateRows:'auto auto'}}>
              {/* 로고 — 2행 span */}
              <div style={{gridColumn:'1',gridRow:'1/3',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px 14px',background:'#fff',borderRight:'1px solid #091D58'}}>
                <img src={REB_LOGO} alt="REB 한국부동산원" style={{width:'130px',height:'auto'}}/>
              </div>
              {/* 문서 제목 */}
              <div style={{gridColumn:'2',gridRow:'1',display:'flex',alignItems:'center',justifyContent:'center',padding:'18px 14px',background:'#e6e6e6',borderBottom:'1px solid #091D58',overflow:'hidden'}}>
                <div style={{fontSize:'34px',fontWeight:900,letterSpacing:'0.4em',paddingRight:'0.4em',fontFamily:"'HY견고딕','돋움','맑은 고딕',sans-serif",color:'#041E54',lineHeight:1.2,whiteSpace:'nowrap'}}>
                  {selectedType?.label||'주간실적보고'}
                </div>
              </div>
              {/* 메타 정보 행 */}
              <div style={{gridColumn:'2',gridRow:'2',display:'grid',gridTemplateColumns:'72px 1fr 72px 1fr'}}>
                <div style={{padding:'7px 10px',background:'#dfeaf5',borderRight:'1px solid #091D58',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <span style={{fontSize:'12px',fontWeight:700,color:'#091D58'}}>담당부서</span>
                </div>
                <div style={{padding:'7px 12px',borderRight:'1px solid #091D58',display:'flex',alignItems:'center'}}>
                  <span style={{fontSize:'13px',color:'#1a202c',fontWeight:600}}>{dept}</span>
                </div>
                <div style={{padding:'7px 10px',background:'#dfeaf5',borderRight:'1px solid #091D58',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <span style={{fontSize:'12px',fontWeight:700,color:'#091D58'}}>문서번호</span>
                </div>
                <div style={{padding:'7px 12px',display:'flex',flexDirection:'column',justifyContent:'center',gap:'2px'}}>
                  <span style={{fontSize:'12px',fontFamily:'monospace',fontWeight:700,color:'#1a202c'}}>{DOC_NUM}</span>
                  <span style={{fontSize:'10px',color:'#6b7280'}}>수신: 내부결재</span>
                </div>
              </div>
            </div>

            {/* Document body */}
            {reportType==='officetel' ? (
            /* ── 주택가격동향조사 보도자료 형식 ── */
            <div className="bg-white px-8 py-7 space-y-6" style={{fontFamily:"'Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif",lineHeight:1.85,wordBreak:'keep-all',letterSpacing:'-0.01em'}}>
              {/* 메타 정보 */}
              <table className="w-full border-collapse text-[13px]" style={{borderTop:'2px solid #003087'}}>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-2.5 pr-4 font-bold text-[#003087] w-28 whitespace-nowrap">담당 부서</td>
                    <td className="py-2.5 pr-6 font-semibold text-slate-800" colSpan={3}>{dept}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2.5 font-bold text-[#003087] whitespace-nowrap">조사 기간</td>
                    <td className="py-2.5 text-slate-700 pr-6">{period}</td>
                    <td className="py-2.5 font-bold text-[#003087] w-24 whitespace-nowrap">배포 일시</td>
                    <td className="py-2.5 text-slate-700">2025년 7월 15일 (화)</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2.5 font-bold text-[#003087] whitespace-nowrap">문서번호</td>
                    <td className="py-2.5 font-mono text-slate-600 text-[12px]" colSpan={3}>{DOC_NUM}</td>
                  </tr>
                </tbody>
              </table>

              {/* 핵심 지표 요약 */}
              <div style={{background:'#eef2ff',border:'1px solid #c7d2fe',borderRadius:'10px',padding:'16px 18px'}}>
                <div style={{fontSize:'11px',fontWeight:800,color:'#003087',letterSpacing:'0.05em',marginBottom:'12px'}}>
                  ▪ 2025년 2분기 주택가격동향 핵심 지표 (전분기 대비)
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px'}}>
                  {[
                    {label:'매매가격',value:'▼ 0.39%',sub:'전분기 -0.39%',color:'#dc2626'},
                    {label:'전세가격',value:'▼ 0.25%',sub:'전분기 -0.22%',color:'#dc2626'},
                    {label:'월세가격',value:'▲ 0.20%',sub:'전분기 +0.49%',color:'#16a34a'},
                    {label:'전월세전환율',value:'6.35%',sub:'수익률 5.55%',color:'#1e40af'},
                  ].map(({label,value,sub,color})=>(
                    <div key={label} style={{background:'#fff',border:'1px solid #e0e7ff',borderRadius:'8px',padding:'10px 12px',textAlign:'center'}}>
                      <div style={{fontSize:'10px',color:'#6b7280',fontWeight:700,marginBottom:'4px'}}>{label}</div>
                      <div style={{fontSize:'18px',fontWeight:900,color,lineHeight:1.2}}>{value}</div>
                      <div style={{fontSize:'10px',color:'#9ca3af',marginTop:'3px'}}>{sub}</div>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:'12px',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px'}}>
                  {[
                    {label:'전국 매매 평균가격',value:'221,662천원'},
                    {label:'전국 전세가율',value:'85.18%'},
                    {label:'서울 월세 평균',value:'914천원/월'},
                  ].map(({label,value})=>(
                    <div key={label} style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'7px 10px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{fontSize:'10px',color:'#6b7280',fontWeight:600}}>{label}</span>
                      <span style={{fontSize:'12px',color:'#1e3a8a',fontWeight:800}}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 그래프 섹션 ── */}
              <div className="grid grid-cols-2 gap-5">
                {/* 가격지수 월별 추이 꺾은선 */}
                <div style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:'10px',padding:'14px 16px'}}>
                  <div style={{fontSize:'11px',fontWeight:800,color:'#003087',marginBottom:'12px',letterSpacing:'0.03em'}}>
                    ▪ 가격지수 월별 추이 (2023.12=100.0)
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={INDEX_TREND} margin={{top:5,right:12,left:-20,bottom:0}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
                      <XAxis dataKey="month" tick={{fontSize:10,fill:'#94a3b8'}} tickLine={false}/>
                      <YAxis domain={[96.5,103]} tick={{fontSize:9,fill:'#94a3b8'}} tickLine={false} axisLine={false}/>
                      <Tooltip content={<CustomTooltip/>}/>
                      <Legend wrapperStyle={{fontSize:'10px',paddingTop:'6px'}}/>
                      <Line type="monotone" dataKey="매매" stroke="#dc2626" strokeWidth={2.5} dot={{r:4,fill:'#dc2626'}} activeDot={{r:6}}/>
                      <Line type="monotone" dataKey="전세" stroke="#2563eb" strokeWidth={2.5} dot={{r:4,fill:'#2563eb'}} activeDot={{r:6}}/>
                      <Line type="monotone" dataKey="월세" stroke="#16a34a" strokeWidth={2.5} dot={{r:4,fill:'#16a34a'}} activeDot={{r:6}}/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* 지역별 변동률 막대 그래프 */}
                <div style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:'10px',padding:'14px 16px'}}>
                  <div style={{fontSize:'11px',fontWeight:800,color:'#003087',marginBottom:'12px',letterSpacing:'0.03em'}}>
                    ▪ 지역별 변동률 (전분기 대비, %)
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={REGION_RATE} margin={{top:5,right:8,left:-24,bottom:0}} barCategoryGap="25%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false}/>
                      <XAxis dataKey="area" tick={{fontSize:10,fill:'#64748b'}} tickLine={false}/>
                      <YAxis tick={{fontSize:9,fill:'#94a3b8'}} tickLine={false} axisLine={false}/>
                      <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1.5}/>
                      <Tooltip content={<CustomTooltip/>}/>
                      <Legend wrapperStyle={{fontSize:'10px',paddingTop:'6px'}}/>
                      <Bar dataKey="매매" fill="#fca5a5" radius={[3,3,0,0]}>
                        {REGION_RATE.map((e,i)=><Cell key={i} fill={e.매매<0?'#fca5a5':'#86efac'}/>)}
                      </Bar>
                      <Bar dataKey="전세" fill="#93c5fd" radius={[3,3,0,0]}>
                        {REGION_RATE.map((e,i)=><Cell key={i} fill={e.전세<0?'#93c5fd':'#6ee7b7'}/>)}
                      </Bar>
                      <Bar dataKey="월세" fill="#6ee7b7" radius={[3,3,0,0]}>
                        {REGION_RATE.map((_,i)=><Cell key={i} fill="#86efac"/>)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 매매 / 전세 / 월세 섹션 */}
              {[
                {num:'1',title:'매매가격동향',
                  regions:[{area:'전국',rate:'-0.39%',prev:'-0.39%'},{area:'수도권',rate:'-0.34%',prev:'-0.31%'},{area:'지방',rate:'-0.56%',prev:'-0.72%'}],
                  details:[
                    {area:'서울',rate:'0.00%',note:'중대형 주택 상승 + 초소형 하락 상쇄 → 보합 전환 (전분기 0.03%→0.00%)'},
                    {area:'인천',rate:'-0.91%',note:'입주예정 매물 누적 하락세 지속. 역세권 신축 매수 문의 증가로 하락폭 소폭 축소 (-0.96%→-0.91%)'},
                    {area:'경기',rate:'-0.47%',note:'신도시 신축 공급 과잉이 하락 주도. 노후 단지 투자 수요 감소로 하락폭 확대 (-0.40%→-0.47%)'},
                  ],
                },
                {num:'2',title:'전세가격동향',
                  regions:[{area:'전국',rate:'-0.25%',prev:'-0.22%'},{area:'수도권',rate:'-0.23%',prev:'-0.16%'},{area:'지방',rate:'-0.30%',prev:'-0.44%'}],
                  details:[
                    {area:'서울',rate:'-0.02%',note:'이사철 마무리로 이주 수요 감소. 전세기피·월세전환 증가로 상승→하락 전환 (0.01%→-0.02%)'},
                    {area:'인천',rate:'-0.64%',note:'전세사기·역전세 우려로 전세기피 지속. 노후 주택 중심 하락폭 확대 (-0.47%→-0.64%)'},
                    {area:'경기',rate:'-0.31%',note:'매매가 하락에 따른 보증금 미반환 불안 확산. 공급 과잉 지역 중심 하락폭 확대 (-0.22%→-0.31%)'},
                  ],
                },
                {num:'3',title:'월세가격동향',
                  regions:[{area:'전국',rate:'+0.20%',prev:'+0.49%'},{area:'수도권',rate:'+0.25%',prev:'+0.56%'},{area:'지방',rate:'+0.04%',prev:'+0.20%'}],
                  details:[
                    {area:'서울',rate:'+0.28%',note:'역세권 입주여건 양호 지역 중심 상승. 이사철 마무리로 상승폭 축소 (0.44%→0.28%)'},
                    {area:'인천',rate:'+0.08%',note:'공급 과잉·노후 주택 하락으로 상승폭 대폭 축소 (1.30%→0.08%)'},
                    {area:'경기',rate:'+0.28%',note:'교통 양호 지역 월세선호 증가로 상승. 신도시 공급 과잉 지역은 하락 (0.43%→0.28%)'},
                  ],
                },
              ].map(({num,title,regions,details})=>(
                <section key={num}>
                  <h3 className="flex items-center gap-2 text-[14px] font-black text-slate-800 mb-3">
                    <span className="w-6 h-6 rounded-md bg-[#003087] flex items-center justify-center text-white text-[10px] font-black shrink-0">{num}</span>
                    {title}
                  </h3>
                  <div className="ml-8 grid grid-cols-3 gap-2 mb-3">
                    {regions.map(r=>(
                      <div key={r.area} style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'8px 12px'}}>
                        <div style={{fontSize:'10px',color:'#94a3b8',fontWeight:700,marginBottom:'2px'}}>{r.area}</div>
                        <div style={{fontSize:'16px',fontWeight:900,color:r.rate.startsWith('-')?'#dc2626':'#16a34a',lineHeight:1.2}}>{r.rate}</div>
                        <div style={{fontSize:'10px',color:'#cbd5e1',marginTop:'2px'}}>전분기 {r.prev}</div>
                      </div>
                    ))}
                  </div>
                  <div className="ml-8 space-y-1.5">
                    {details.map(d=>(
                      <div key={d.area} style={{display:'flex',gap:'8px',fontSize:'13px',lineHeight:1.6,alignItems:'flex-start'}}>
                        <span style={{fontWeight:800,color:'#003087',width:'40px',flexShrink:0}}>{d.area}</span>
                        <span style={{fontWeight:700,flexShrink:0,color:d.rate.startsWith('-')?'#dc2626':d.rate.startsWith('+')?'#16a34a':'#475569'}}>({d.rate})</span>
                        <span style={{color:'#475569'}}>{d.note}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ))}

              {/* 가격지수 변동률 테이블 */}
              <section>
                <h3 className="flex items-center gap-2 text-[14px] font-black text-slate-800 mb-3">
                  <span className="w-6 h-6 rounded-md bg-[#003087] flex items-center justify-center text-white text-[10px] font-black shrink-0">4</span>
                  2025년 4~6월 가격지수 및 변동률
                </h3>
                <div className="ml-8">
                  <table className="w-full border-collapse text-[12px]" style={{border:'1px solid #e2e8f0'}}>
                    <thead>
                      <tr style={{background:'#003087',color:'#fff'}}>
                        {['구분','2025.4','2025.5','2025.6','전분기 변동률(%)'].map(h=>(
                          <th key={h} className="py-2 px-3 font-bold text-left">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {cat:'매매',rows:[{a:'전국',v1:'97.82',v2:'97.71',v3:'97.57',c:'-0.39'},{a:'수도권',v1:'98.24',v2:'98.13',v3:'98.02',c:'-0.34'},{a:'서울',v1:'99.70',v2:'99.71',v3:'99.70',c:'0.00'}]},
                        {cat:'전세',rows:[{a:'전국',v1:'98.67',v2:'98.58',v3:'98.49',c:'-0.25'},{a:'수도권',v1:'99.03',v2:'98.95',v3:'98.87',c:'-0.23'},{a:'서울',v1:'99.81',v2:'99.79',v3:'99.80',c:'-0.02'}]},
                        {cat:'월세',rows:[{a:'전국',v1:'101.79',v2:'101.85',v3:'101.92',c:'+0.20'},{a:'수도권',v1:'102.31',v2:'102.38',v3:'102.47',c:'+0.25'},{a:'서울',v1:'102.24',v2:'102.33',v3:'102.42',c:'+0.28'}]},
                      ].map(({cat,rows})=>(
                        <React.Fragment key={cat}>
                          <tr style={{background:'#dbeafe'}}>
                            <td className="py-1.5 px-3 font-black text-[#003087] text-[11px]" colSpan={5}>{cat}가격 (2023.12=100.0)</td>
                          </tr>
                          {rows.map(r=>(
                            <tr key={r.a} className="border-b border-slate-100">
                              <td className="py-1.5 px-3 pl-5 text-slate-600">{r.a}</td>
                              <td className="py-1.5 px-3 text-slate-600">{r.v1}</td>
                              <td className="py-1.5 px-3 text-slate-600">{r.v2}</td>
                              <td className="py-1.5 px-3 text-slate-600">{r.v3}</td>
                              <td className={`py-1.5 px-3 font-black ${r.c.startsWith('-')?'text-rose-600':r.c==='0.00'?'text-slate-500':'text-emerald-600'}`}>{r.c}%</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                  <p style={{fontSize:'10px',color:'#9ca3af',marginTop:'5px'}}>* 지수산정: 제본스지수 | 통계청 국가통계 승인번호 408002</p>
                </div>
              </section>

              {/* ── 전세가율 및 수익률 요약 차트 ── */}
              <section>
                <h3 className="flex items-center gap-2 text-[14px] font-black text-slate-800 mb-3">
                  <span className="w-6 h-6 rounded-md bg-[#003087] flex items-center justify-center text-white text-[10px] font-black shrink-0">5</span>
                  지역별 전세가율 및 수익률
                </h3>
                <div className="ml-8">
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart
                      data={[
                        {area:'서울',전세가율:88.34,수익률:4.82},
                        {area:'인천',전세가율:87.20,수익률:5.41},
                        {area:'경기',전세가율:86.72,수익률:5.13},
                        {area:'부산',전세가율:83.45,수익률:5.77},
                        {area:'전국',전세가율:85.18,수익률:5.55},
                      ]}
                      margin={{top:5,right:16,left:-10,bottom:0}}
                      barCategoryGap="30%"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false}/>
                      <XAxis dataKey="area" tick={{fontSize:11,fill:'#64748b'}} tickLine={false}/>
                      <YAxis yAxisId="left" domain={[78,92]} tick={{fontSize:9,fill:'#94a3b8'}} tickLine={false} axisLine={false} tickFormatter={v=>`${v}%`}/>
                      <YAxis yAxisId="right" orientation="right" domain={[4,7]} tick={{fontSize:9,fill:'#94a3b8'}} tickLine={false} axisLine={false} tickFormatter={v=>`${v}%`}/>
                      <Tooltip content={({active,payload,label})=>{
                        if(!active||!payload?.length)return null;
                        return(
                          <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-[11px]">
                            <div className="font-black text-slate-700 mb-1">{label}</div>
                            {payload.map(p=>(
                              <div key={p.name} className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full" style={{background:p.color}}/>
                                <span className="text-slate-600">{p.name}:</span>
                                <span className="font-bold" style={{color:p.color}}>{p.value}%</span>
                              </div>
                            ))}
                          </div>
                        );
                      }}/>
                      <Legend wrapperStyle={{fontSize:'10px',paddingTop:'6px'}}/>
                      <ReferenceLine yAxisId="left" y={85} stroke="#ef4444" strokeDasharray="4 3" strokeWidth={1.5} label={{value:'위험선 85%',position:'insideTopRight',fontSize:9,fill:'#ef4444'}}/>
                      <Bar yAxisId="left" dataKey="전세가율" fill="#bfdbfe" radius={[3,3,0,0]}>
                        {[{area:'서울'},{area:'인천'},{area:'경기'},{area:'부산'},{area:'전국'}].map((_,i,arr)=>(
                          <Cell key={i} fill={[0.8834,0.872,0.8672,0.8345,0.8518][i]>=0.85?'#fca5a5':'#bfdbfe'}/>
                        ))}
                        <LabelList dataKey="전세가율" position="top" style={{fontSize:9,fontWeight:700,fill:'#3b82f6'}} formatter={v=>`${v}%`}/>
                      </Bar>
                      <Bar yAxisId="right" dataKey="수익률" fill="#6ee7b7" radius={[3,3,0,0]}>
                        <LabelList dataKey="수익률" position="top" style={{fontSize:9,fontWeight:700,fill:'#16a34a'}} formatter={v=>`${v}%`}/>
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <p style={{fontSize:'10px',color:'#9ca3af',marginTop:'4px'}}>* 전세가율 85% 이상(빨간 막대): 전세사기·깡통전세 고위험 임계치 | 수익률: 월세 연환산 ÷ 전세보증금</p>
                </div>
              </section>

              {/* 문의처 */}
              <div style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'10px 14px',fontSize:'11px',color:'#64748b'}}>
                <span style={{fontWeight:700,color:'#003087'}}>문의</span>　부동산통계처 상업자산통계부장 최윤주 ☎ (053)663-8531 | 담당 차장 박병희 ☎ (053)663-8532
                　｜　자료확인: R-ONE 부동산통계정보시스템 www.reb.or.kr/r-one
              </div>

              {/* 작성 정보 */}
              <div className="flex items-center justify-between text-[12px] text-slate-500">
                <span>작성자: <strong className="text-slate-700">김민준</strong> · {dept} 과장</span>
                <span>작성일: 2025. 07. 15.</span>
              </div>

              {/* 서명란 */}
              <div style={{borderTop:'2px solid #003087',paddingTop:'14px'}}>
                <div className="grid grid-cols-3 gap-4">
                  {APV_LINE.map((p,i)=>(
                    <div key={i} className="border border-slate-300 rounded-lg overflow-hidden">
                      <div className="py-2 text-center text-[12px] font-bold text-white" style={{background:'#003087'}}>{p.role}</div>
                      <div className="h-14 flex flex-col items-center justify-end pb-2 gap-0.5">
                        <div className="text-[13px] font-bold text-slate-700">{p.name}</div>
                        <div className="text-[11px] text-slate-400">{p.dept}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-center text-[10px] text-slate-400 mt-3">
                  본 보고서는 GENOS AI 보고서 작성 에이전트 v1.0에 의해 자동 생성되었으며, 담당자 검토 후 확정됩니다.
                </p>
              </div>
            </div>
            ) : (
            /* ── 일반 보고서 형식 ── */
            <div className="bg-white px-10 py-8 space-y-7">
              <table className="w-full border-collapse text-[14.5px]" style={{borderTop:'2px solid #003087'}}>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-3.5 pr-4 font-bold text-[#064e3b] w-24 whitespace-nowrap">담당 부서</td>
                    <td className="py-3.5 pr-8 font-semibold text-slate-800">{dept}</td>
                    <td className="py-3.5 pr-4 font-bold text-[#064e3b] w-24 whitespace-nowrap">문서번호</td>
                    <td className="py-3.5 font-mono text-slate-700">{DOC_NUM}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-3.5 pr-4 font-bold text-[#064e3b] whitespace-nowrap">보고 기간</td>
                    <td className="py-3.5 text-slate-700" colSpan={3}>{period}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex items-center gap-3"><div className="flex-1 h-px bg-slate-200"/><div className="w-1.5 h-1.5 rounded-full bg-slate-300"/><div className="flex-1 h-px bg-slate-200"/></div>

              {/* 실적 현황 차트 */}
              {(()=>{
                const chartData=reportType==='monthly'?MONTHLY_CHART:reportType==='field'?FIELD_CHART:WEEKLY_CHART;
                const accentColor='#064e3b';
                const label=reportType==='monthly'?'월간':reportType==='field'?'현장조사':'주간';
                return(
                  <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:'10px',padding:'14px 18px'}}>
                    <div style={{fontSize:'11px',fontWeight:800,color:accentColor,marginBottom:'12px',letterSpacing:'0.03em'}}>
                      ▪ {label} 실적 현황 — 목표 대비 달성률
                    </div>
                    <div className="grid grid-cols-2 gap-5 items-center">
                      <ResponsiveContainer width="100%" height={160}>
                        <BarChart data={chartData} layout="vertical" margin={{top:0,right:40,left:10,bottom:0}}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" horizontal={false}/>
                          <XAxis type="number" tick={{fontSize:10,fill:'#6b7280'}} tickLine={false} axisLine={false}/>
                          <YAxis type="category" dataKey="item" tick={{fontSize:11,fill:'#374151',fontWeight:600}} tickLine={false} axisLine={false} width={52}/>
                          <Tooltip content={<CustomTooltip/>}/>
                          <Bar dataKey="목표" fill="#d1fae5" radius={[0,3,3,0]} barSize={12}/>
                          <Bar dataKey="완료" fill={accentColor} radius={[0,3,3,0]} barSize={12}>
                            <LabelList dataKey="완료" position="right" style={{fontSize:10,fontWeight:700,fill:accentColor}}/>
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="space-y-2.5">
                        {chartData.map(d=>{
                          const pct=Math.round(d.완료/d.목표*100);
                          return(
                            <div key={d.item}>
                              <div className="flex justify-between text-[11px] mb-1">
                                <span className="font-bold text-slate-700">{d.item}</span>
                                <span className="font-black" style={{color:pct>=100?'#16a34a':pct>=80?accentColor:'#f59e0b'}}>{pct}%</span>
                              </div>
                              <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all" style={{width:`${Math.min(pct,100)}%`,background:pct>=100?'#16a34a':pct>=80?accentColor:'#f59e0b'}}/>
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">{d.완료} / {d.목표}건</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {[
                {num:'1',title:'주요 실적',content:mainWork},
                {num:'2',title:'차주 계획',content:nextPlan},
                {num:'3',title:'특이 사항',content:special||'해당 없음'},
              ].map(({num,title,content})=>(
                <section key={num}>
                  <h3 className="flex items-center gap-2 text-[16.5px] font-black text-slate-800 mb-3.5">
                    <span className="w-7 h-7 rounded-md bg-[#064e3b] flex items-center justify-center text-white text-[11px] font-black shrink-0">{num}</span>
                    {title}
                  </h3>
                  <div className="ml-9 text-[14.5px] text-slate-700 space-y-2" style={{lineHeight:2.0,wordBreak:'keep-all'}}>
                    {content.split('\n').filter(l=>l.trim()).map((line,i)=>(
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </section>
              ))}

              <div className="flex items-center gap-3"><div className="flex-1 h-px bg-slate-200"/><div className="w-1.5 h-1.5 rounded-full bg-slate-300"/><div className="flex-1 h-px bg-slate-200"/></div>

              <div className="flex items-center justify-between text-[13px] text-slate-500">
                <span>작성자: <strong className="text-slate-700">김민준</strong> · {dept} 과장</span>
                <span>작성일: 2026. 03. 13.</span>
              </div>

              <div className="pt-4" style={{borderTop:'2px solid #064e3b'}}>
                <div className="grid grid-cols-3 gap-4">
                  {APV_LINE.map((p,i)=>(
                    <div key={i} className="border border-slate-300 rounded-lg overflow-hidden">
                      <div className="py-2 text-center text-[12px] font-bold text-white" style={{background:'#064e3b'}}>{p.role}</div>
                      <div className="h-16 flex flex-col items-center justify-end pb-2 gap-1">
                        <div className="text-[13px] font-bold text-slate-700">{p.name}</div>
                        <div className="text-[11px] text-slate-400">{p.dept}</div>
                        <div className="w-16 border-b border-slate-300 mt-1"/>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-center text-[11px] text-slate-400 mt-4">
                  본 보고서는 GENOS AI 보고서 작성 에이전트 v1.0에 의해 자동 생성되었으며, 담당자 검토 후 확정됩니다.
                </p>
              </div>
            </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportAgent;
