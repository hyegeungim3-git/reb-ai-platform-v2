import React, { useState, useRef, useEffect } from "react";
import {
  MapPin, Cpu, Database, Globe2, Radio, Loader2, CheckCircle,
  ChevronRight, Network, Play, RotateCcw, Download, Copy,
  Upload, RefreshCw, FileSpreadsheet, BarChart3, Target, Map,
  AlertTriangle, ChevronDown, Search, Hash, ArrowRightLeft,
  Clipboard, ClipboardCheck, XCircle,
  ScanLine, Eye, FileText, Zap, Shield, CheckCircle2,
  Building2, Home, Layers
} from "lucide-react";
import AgentWorkflowPanel from "./AgentWorkflowPanel.jsx";
import { AGENT_TEAMS } from "../../data/constants.js";
import { useAgentSimulation } from "../../hooks/useAgentSimulation.js";
import { cn } from "../../utils.jsx";


const AGENTS=[
  {icon:Cpu,      label:'주소 파서',        sub:'주소 구성요소 분해 중',    color:'bg-rose-600',  ms:1200},
  {icon:Database, label:'주소 매핑 에이전트', sub:'공식 주소DB 매칭 중',     color:'bg-pink-600',  ms:2000},
  {icon:Globe2,   label:'지오코딩 에이전트', sub:'위경도 좌표 변환 중',     color:'bg-red-600',   ms:1500},
];

const SAMPLE_BATCH=`서울 강남구 도곡동 946-1
서울 서초구 서초동 1330-18
경기 성남시 분당구 정자동 6
인천 연수구 송도동 28-4
부산 해운대구 우동 1402`;

const BATCH_RESULTS=[
  {input:'서울 강남구 도곡동 946-1',   road:'서울특별시 강남구 언주로30길 18',   jibun:'서울특별시 강남구 도곡동 946-1',    zip:'06256', legalCode:'1168010600', adminCode:'1168064000', legalDong:'도곡동',   adminDong:'도곡2동',   conf:98.7,status:'완전매칭'},
  {input:'서울 서초구 서초동 1330-18', road:'서울특별시 서초구 서초대로 411',     jibun:'서울특별시 서초구 서초동 1330-18',  zip:'06764', legalCode:'1165010100', adminCode:'1165065000', legalDong:'서초동',   adminDong:'서초4동',  conf:99.1,status:'완전매칭'},
  {input:'경기 성남시 분당구 정자동 6', road:'경기도 성남시 분당구 불정로 6',      jibun:'경기도 성남시 분당구 정자동 6',     zip:'13561', legalCode:'4113511000', adminCode:'4113566000', legalDong:'정자동',   adminDong:'정자1동',  conf:97.4,status:'완전매칭'},
  {input:'인천 연수구 송도동 28-4',    road:'인천광역시 연수구 컨벤시아대로 42',   jibun:'인천광역시 연수구 송도동 28-4',    zip:'21987',  legalCode:'2817710200', adminCode:'2817774000', legalDong:'송도동',   adminDong:'연수3동',  conf:96.8,status:'부분매칭'},
  {input:'부산 해운대구 우동 1402',    road:'부산광역시 해운대구 해운대로 772',    jibun:'부산광역시 해운대구 우동 1402',    zip:'48099',  legalCode:'2635010300', adminCode:'2635063000', legalDong:'우동',     adminDong:'우2동',    conf:98.2,status:'완전매칭'},
];

const QUICK_EXAMPLES=['서울 서초구 서초동 1330-18','경기 성남시 분당구 정자동 6','인천 연수구 송도동 28-4'];

/* ── 공동주택 코드 조회 ─────────────────────────────── */
const APT_QUICK=[
  '서울 강남구 도곡동 도곡렉슬아파트',
  '경기 성남시 분당구 정자동 파크뷰',
  '서울 서초구 반포동 반포자이',
];

const APT_RESULT={
  query:'서울 강남구 도곡동 도곡렉슬아파트',
  complexName:'도곡렉슬아파트',
  complexCode:'11680-0042',
  address:'서울특별시 강남구 도곡동 467',
  roadAddress:'서울특별시 강남구 논현로28길 2',
  legalDong:'도곡동',
  legalCode:'1168010600',
  totalHouseholds:1250,
  totalBuildings:12,
  buildings:[
    {dongName:'101동', dongCode:'11680004200101', floors:25, households:105},
    {dongName:'102동', dongCode:'11680004200102', floors:25, households:105},
    {dongName:'103동', dongCode:'11680004200103', floors:25, households:105},
    {dongName:'104동', dongCode:'11680004200104', floors:25, households:105},
  ],
  units:[
    {floor:1, hoName:'101호', hoCode:'11680004200101101', area:84.92, type:'84㎡A'},
    {floor:1, hoName:'102호', hoCode:'11680004200101102', area:59.83, type:'59㎡B'},
    {floor:2, hoName:'201호', hoCode:'11680004200101201', area:84.92, type:'84㎡A'},
    {floor:2, hoName:'202호', hoCode:'11680004200101202', area:59.83, type:'59㎡B'},
    {floor:3, hoName:'301호', hoCode:'11680004200101301', area:84.92, type:'84㎡A'},
    {floor:3, hoName:'302호', hoCode:'11680004200101302', area:59.83, type:'59㎡B'},
  ],
};

/* ── OCR 모드 상수 ──────────────────────────────────── */
const OCR_AGENTS=[
  {icon:Shield,    label:'DRM 복호화',        sub:'SSO/EAM 정책 검증 및 문서 복호화',   color:'bg-red-600',    ms:700},
  {icon:ScanLine,  label:'Vision OCR',         sub:'Vision OCR 엔진 문자 인식 중',       color:'bg-teal-600',   ms:3400},
  {icon:Eye,       label:'주소 패턴 추출기',   sub:'정규식 패턴으로 주소 후보 탐지',     color:'bg-amber-600',  ms:900},
  {icon:Cpu,       label:'주소 파서',          sub:'주소 구성요소 분해 중',              color:'bg-rose-600',   ms:1100},
  {icon:Database,  label:'주소 매핑 에이전트', sub:'공식 주소 DB 매칭 중',              color:'bg-pink-600',   ms:1800},
  {icon:Globe2,    label:'지오코딩 에이전트',  sub:'위경도 좌표 변환 중',               color:'bg-red-600',    ms:1200},
];

const OCR_DOC_TEXT_RAW=`[현장조사 보고서]
문서번호: 부동산공시처-2026-조사-0048
조사일자: 2026.03.12  담당: 김민준(부동산공시처)

1. 조사 개요
조사 대상: 서울특별시 강남구 일원
기준 표준지: 서울 강남구 도곡동 946-1

2. 현장 조사 내역
(1) 표준지 1호: 서울 강남구 역삼동 738
    현황: 일반상업지역 | 상업용도
(2) 표준지 2호: 경기도 성남시 분당구 정자동 6
    현황: 준주거지역 | 혼합용도

3. 거래사례 조사지
   사례 A: 인천 연수구 송도동 28-4
   사례 B: 부산광역시 해운대구 우동 1402

4. 비고
   AI 보조 선정 결과 감정평가사 2차 검증 예정`;

const OCR_ADDR_RESULTS=[
  {raw:'서울 강남구 도곡동 946-1',    ctx:'기준 표준지',  ocrConf:98.3, road:'서울특별시 강남구 언주로30길 18', jibun:'서울특별시 강남구 도곡동 946-1',    zip:'06256',lat:'37.4916',lng:'127.0378',legalCode:'1168010600',legalDong:'도곡동', adminCode:'1168064000',adminDong:'도곡2동', matchConf:98.7,status:'완전매칭'},
  {raw:'서울 강남구 역삼동 738',       ctx:'표준지 1호',   ocrConf:97.1, road:'서울특별시 강남구 테헤란로 152',  jibun:'서울특별시 강남구 역삼동 738',      zip:'06236',lat:'37.4999',lng:'127.0361',legalCode:'1168010300',legalDong:'역삼동', adminCode:'1168064500',adminDong:'역삼1동',matchConf:99.2,status:'완전매칭'},
  {raw:'경기도 성남시 분당구 정자동 6',ctx:'표준지 2호',   ocrConf:96.8, road:'경기도 성남시 분당구 불정로 6',   jibun:'경기도 성남시 분당구 정자동 6',    zip:'13561',lat:'37.3617',lng:'127.1054',legalCode:'4113511000',legalDong:'정자동', adminCode:'4113566000',adminDong:'정자1동',matchConf:97.4,status:'완전매칭'},
  {raw:'인천 연수구 송도동 28-4',      ctx:'거래사례 A',   ocrConf:94.2, road:'인천광역시 연수구 컨벤시아대로 42',jibun:'인천광역시 연수구 송도동 28-4',    zip:'21987',lat:'37.3930',lng:'126.6380',legalCode:'2817710200',legalDong:'송도동', adminCode:'2817774000',adminDong:'연수3동',matchConf:96.8,status:'부분매칭'},
  {raw:'부산광역시 해운대구 우동 1402', ctx:'거래사례 B',  ocrConf:99.1, road:'부산광역시 해운대구 해운대로 772',jibun:'부산광역시 해운대구 우동 1402',    zip:'48099',lat:'35.1628',lng:'129.1636',legalCode:'2635010300',legalDong:'우동',   adminCode:'2635063000',adminDong:'우2동',  matchConf:98.2,status:'완전매칭'},
];

const CODE_LOOKUP={
  '1168010600':{type:'법정동',dong:'도곡동',   road:'서울특별시 강남구 언주로30길 18',  jibun:'서울특별시 강남구 도곡동 946-1',    zip:'06256',legalCode:'1168010600',adminCode:'1168064000',adminDong:'도곡2동',  region:'서울특별시 > 강남구 > 도곡동'},
  '1168064000':{type:'행정동',dong:'도곡2동',  road:'서울특별시 강남구 언주로30길 18',  jibun:'서울특별시 강남구 도곡동 946-1',    zip:'06256',legalCode:'1168010600',adminCode:'1168064000',legalDong:'도곡동',  region:'서울특별시 > 강남구 > 도곡2동'},
  '1165010100':{type:'법정동',dong:'서초동',   road:'서울특별시 서초구 서초대로 411',   jibun:'서울특별시 서초구 서초동 1330-18',  zip:'06764',legalCode:'1165010100',adminCode:'1165065000',adminDong:'서초4동', region:'서울특별시 > 서초구 > 서초동'},
  '1165065000':{type:'행정동',dong:'서초4동',  road:'서울특별시 서초구 서초대로 411',   jibun:'서울특별시 서초구 서초동 1330-18',  zip:'06764',legalCode:'1165010100',adminCode:'1165065000',legalDong:'서초동',  region:'서울특별시 > 서초구 > 서초4동'},
  '4113511000':{type:'법정동',dong:'정자동',   road:'경기도 성남시 분당구 불정로 6',    jibun:'경기도 성남시 분당구 정자동 6',     zip:'13561',legalCode:'4113511000',adminCode:'4113566000',adminDong:'정자1동', region:'경기도 > 성남시 분당구 > 정자동'},
  '4113566000':{type:'행정동',dong:'정자1동',  road:'경기도 성남시 분당구 불정로 6',    jibun:'경기도 성남시 분당구 정자동 6',     zip:'13561',legalCode:'4113511000',adminCode:'4113566000',legalDong:'정자동',  region:'경기도 > 성남시 분당구 > 정자1동'},
  '2817710200':{type:'법정동',dong:'송도동',   road:'인천광역시 연수구 컨벤시아대로 42',jibun:'인천광역시 연수구 송도동 28-4',     zip:'21987',legalCode:'2817710200',adminCode:'2817774000',adminDong:'연수3동', region:'인천광역시 > 연수구 > 송도동'},
  '2817774000':{type:'행정동',dong:'연수3동',  road:'인천광역시 연수구 컨벤시아대로 42',jibun:'인천광역시 연수구 송도동 28-4',     zip:'21987',legalCode:'2817710200',adminCode:'2817774000',legalDong:'송도동',  region:'인천광역시 > 연수구 > 연수3동'},
  '2635010300':{type:'법정동',dong:'우동',     road:'부산광역시 해운대구 해운대로 772', jibun:'부산광역시 해운대구 우동 1402',     zip:'48099',legalCode:'2635010300',adminCode:'2635063000',adminDong:'우2동',   region:'부산광역시 > 해운대구 > 우동'},
  '2635063000':{type:'행정동',dong:'우2동',    road:'부산광역시 해운대구 해운대로 772', jibun:'부산광역시 해운대구 우동 1402',     zip:'48099',legalCode:'2635010300',adminCode:'2635063000',legalDong:'우동',    region:'부산광역시 > 해운대구 > 우2동'},
};

const CODE_QUICK_EXAMPLES=[
  {code:'1168010600',label:'강남구 도곡동 (법정)'},
  {code:'1168064000',label:'강남구 도곡2동 (행정)'},
  {code:'4113511000',label:'분당구 정자동 (법정)'},
];

const RESULT={
  road:'서울특별시 강남구 언주로30길 18',
  jibun:'서울특별시 강남구 도곡동 946-1',
  zip:'06256',
  lat:'37.4916',
  lng:'127.0378',
  buildType:'공동주택',
  adminDong:'도곡2동',
  legalDong:'도곡동',
  legalCode:'1168010600',
  adminCode:'1168064000',
  status:'완전매칭',
  complexName:'도곡렉슬아파트',
  complexCode:'11680-0042',
};

/* ── 처리 유형 카드 (m·color 키 고정: single|batch|ocr|reverse / rose|orange|teal|purple) ── */
const MODE_TYPES_DEFAULT=[
  {m:'single',  icon:'📍', label:'단일 주소',   desc:'비정형 주소 1건을 도로명·지번·우편번호·좌표로 변환',  color:'rose'},
  {m:'batch',   icon:'📋', label:'일괄 처리',   desc:'여러 주소를 한 번에 붙여넣거나 파일로 일괄 표준화',   color:'orange'},
  {m:'ocr',     icon:'🔍', label:'OCR 파일',    desc:'현장조사 보고서·감정평가서에서 주소 자동 추출',       color:'teal'},
  {m:'reverse', icon:'🔢', label:'코드 역조회', desc:'법정동·행정동코드로 정식 주소를 역방향 조회',          color:'purple'},
];

/* 도메인 이관: REB 기본 콘텐츠 — 도메인 팩 agentContent["agent-address"]로 키 단위 오버라이드 */
export const CONTENT_DEFAULTS={
  defaultAddress:'서울 강남구 도곡동 946-1',                 // 단일 주소 입력 초기값
  addressPlaceholder:'예: 서울 강남구 도곡동 946-1',          // 단일 주소 placeholder
  quickExamples:QUICK_EXAMPLES,                              // string[3] — 단일 주소 예시 칩
  defaultAptQuery:'서울 강남구 도곡동 도곡렉슬아파트',        // 공동주택 조회 입력 초기값
  aptPlaceholder:'예: 서울 강남구 도곡동 도곡렉슬아파트',     // 공동주택 조회 placeholder
  aptQuickExamples:APT_QUICK,                                // string[3] — 공동주택 예시 칩
  aptLookupResult:APT_RESULT,                                // {query,complexName,complexCode,address,roadAddress,legalDong,legalCode,totalHouseholds(number),totalBuildings(number),buildings:{dongName,dongCode,floors,households}[4],units:{floor,hoName,hoCode,area,type}[6]}
  singleResult:RESULT,                                       // {road,jibun,zip,lat,lng,buildType('공동주택'이면 코드 섹션 노출),adminDong,legalDong,legalCode,adminCode,status('완전매칭'|'부분매칭'),complexName,complexCode}
  sampleBatch:SAMPLE_BATCH,                                  // 개행 구분 주소 문자열(5줄) — 일괄 처리 textarea 초기값
  batchResults:BATCH_RESULTS,                                // {input,road,jibun,zip,legalCode,adminCode,legalDong,adminDong,conf(number),status('완전매칭'|'부분매칭')}[5]
  modeTypes:MODE_TYPES_DEFAULT,                              // {m·color 키 고정, icon(이모지), label, desc}[4]
  ocrDocText:OCR_DOC_TEXT_RAW,                               // OCR 스트리밍 원문 — 공백 단위로 순차 출력됨
  ocrAddrResults:OCR_ADDR_RESULTS,                           // {raw,ctx,ocrConf,road,jibun,zip,lat,lng,legalCode,legalDong,adminCode,adminDong,matchConf,status('완전매칭'|'부분매칭')}[5]
  ocrFeatureLabel:'현장조사 보고서 특화',                     // OCR 업로드 존 강조 문구(도메인 문서 유형)
  codeLookup:CODE_LOOKUP,                                    // {코드10자리: {type('법정동'|'행정동'),dong,road,jibun,zip,legalCode,adminCode,adminDong?,legalDong?,region}}
  codeQuickExamples:CODE_QUICK_EXAMPLES,                     // {code,label}[3] — 역조회 예시 칩
};

const MatchStatusBadge=({status})=>{
  const isExact=status==='완전매칭';
  return(
    <div className={cn('border rounded-xl px-4 py-3 flex items-center justify-between',isExact?'bg-emerald-50 border-emerald-200':'bg-amber-50 border-amber-200')}>
      <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider">매칭 결과</div>
      <div className="flex items-center gap-2">
        {isExact
          ?<CheckCircle className="w-4 h-4 text-emerald-500"/>
          :<AlertTriangle className="w-4 h-4 text-amber-500"/>}
        <span className={cn('text-[14px] font-black',isExact?'text-emerald-700':'text-amber-700')}>{status}</span>
        <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold border',isExact?'bg-emerald-100 border-emerald-200 text-emerald-600':'bg-amber-100 border-amber-200 text-amber-600')}>
          {isExact?'공식 DB 일치':'수동 확인 권장'}
        </span>
      </div>
    </div>
  );
};

const AddressAgent=({onBack,domain})=>{
  const C={...CONTENT_DEFAULTS,...(domain?.agentContent?.["agent-address"]||{})};
  const OCR_DOC_WORDS=C.ocrDocText.split(' ');
  const [mode,setMode]=useState('single');
  const [inputTab,setInputTab]=useState('address'); // 'address' | 'apt'
  const {step,setStep,agentIdx,doneIdx,start:startSim,resetSim}=useAgentSimulation(AGENTS);
  const [address,setAddress]=useState(C.defaultAddress);
  const [aptQuery,setAptQuery]=useState(C.defaultAptQuery);
  const [aptResult,setAptResult]=useState(null);
  const [selectedDong,setSelectedDong]=useState(0);
  const [selectedHo,setSelectedHo]=useState(0);
  const [copiedField,setCopiedField]=useState(null);
  const [batchText,setBatchText]=useState(C.sampleBatch);
  const [batchProcessed,setBatchProcessed]=useState(false);
  const [batchCopied,setBatchCopied]=useState(false);
  const [mapOpen,setMapOpen]=useState(false);
  const [uploadedFile,setUploadedFile]=useState(null);
  // 역조회
  const [revCode,setRevCode]=useState('');
  const [revResult,setRevResult]=useState(null);
  const [revSearched,setRevSearched]=useState(false);
  const [revCopied,setRevCopied]=useState(null);
  // 단일결과 전체복사
  const [copiedAll,setCopiedAll]=useState(false);
  // OCR 모드
  const [ocrFile,setOcrFile]=useState(null);
  const [ocrFileDrag,setOcrFileDrag]=useState(false);
  const [ocrStep,setOcrStep]=useState(1);
  const [ocrAgentIdx,setOcrAgentIdx]=useState(-1);
  const [ocrDoneIdx,setOcrDoneIdx]=useState([]);
  const [ocrWords,setOcrWords]=useState([]);
  const [ocrAddrFound,setOcrAddrFound]=useState(false);
  const [ocrSelectedRow,setOcrSelectedRow]=useState(null);
  const ocrFileRef=useRef(null);
  const fileRef=useRef(null);

  /* OCR 스트리밍: Vision OCR 에이전트(i=1) 활성 시 문서 텍스트 출력 */
  useEffect(()=>{
    if(ocrAgentIdx!==1){return;}
    setOcrWords([]);setOcrAddrFound(false);
    let idx=0;
    const id=setInterval(()=>{
      if(idx>=OCR_DOC_WORDS.length){clearInterval(id);return;}
      setOcrWords(p=>[...p,OCR_DOC_WORDS[idx]]);
      idx++;
    },80);
    return ()=>clearInterval(id);
  },[ocrAgentIdx]);

  /* 주소 패턴 추출기(i=2) 활성 시 "주소 감지" 플래시 */
  useEffect(()=>{
    if(ocrAgentIdx===2) setTimeout(()=>setOcrAddrFound(true),600);
  },[ocrAgentIdx]);

  const startProcess=()=>{
    if(inputTab==='apt'){
      setAptResult(C.aptLookupResult);
      setSelectedDong(0);
      setStep(3);
      return;
    }
    startSim();
  };

  const reset=()=>{resetSim();setCopiedField(null);setMapOpen(false);setAptResult(null);};

  const copyField=(key,val)=>{
    navigator.clipboard?.writeText(val);
    setCopiedField(key);
    setTimeout(()=>setCopiedField(null),2000);
  };

  const processBatch=()=>setBatchProcessed(true);

  const copyBatchCsv=()=>{
    const header='입력주소,도로명주소,지번주소,우편번호,법정동코드,법정동명,행정동코드,행정동명,매칭상태';
    const rows=C.batchResults.map(r=>[r.input,r.road,r.jibun,r.zip,r.legalCode,r.legalDong,r.adminCode,r.adminDong,r.status].join(','));
    navigator.clipboard?.writeText([header,...rows].join('\n'));
    setBatchCopied(true);
    setTimeout(()=>setBatchCopied(false),2000);
  };

  const downloadBatchExcel=()=>{
    const header='입력주소\t도로명주소\t지번주소\t우편번호\t법정동코드\t법정동명\t행정동코드\t행정동명\t매칭상태';
    const rows=C.batchResults.map(r=>[r.input,r.road,r.jibun,r.zip,r.legalCode,r.legalDong,r.adminCode,r.adminDong,r.status].join('\t'));
    const tsv=[header,...rows].join('\n');
    const blob=new Blob(['\uFEFF'+tsv],{type:'text/tab-separated-values;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download='주소표준화_결과.xls'; a.click();
    URL.revokeObjectURL(url);
  };

  const startOcrProcess=()=>{
    setOcrStep(2);setOcrAgentIdx(0);setOcrDoneIdx([]);setOcrWords([]);setOcrAddrFound(false);
    let delay=0;
    OCR_AGENTS.forEach((ag,i)=>{
      delay+=ag.ms;
      setTimeout(()=>{
        setOcrAgentIdx(i+1<OCR_AGENTS.length?i+1:-1);
        setOcrDoneIdx(p=>[...p,i]);
        if(i===OCR_AGENTS.length-1) setTimeout(()=>setOcrStep(3),600);
      },delay);
    });
  };

  const resetOcr=()=>{setOcrStep(1);setOcrFile(null);setOcrAgentIdx(-1);setOcrDoneIdx([]);setOcrWords([]);setOcrAddrFound(false);setOcrSelectedRow(null);};

  const doReverseSearch=()=>{
    const clean=revCode.replace(/\s/g,'');
    const found=C.codeLookup[clean]||null;
    setRevResult(found);
    setRevSearched(true);
    setRevCopied(null);
  };

  const copyRevField=(key,val)=>{
    navigator.clipboard?.writeText(val);
    setRevCopied(key);
    setTimeout(()=>setRevCopied(null),2000);
  };

  const copyAllFields=()=>{
    const selBuilding=C.aptLookupResult.buildings[selectedDong];
    const selUnit=C.aptLookupResult.units[selectedHo];
    const text=[
      `[도로명주소] ${C.singleResult.road}`,
      `[지번주소]   ${C.singleResult.jibun}`,
      `[우편번호]   ${C.singleResult.zip}`,
      `[좌표]       위도 ${C.singleResult.lat}, 경도 ${C.singleResult.lng}`,
      `[법정동]     ${C.singleResult.legalDong} (${C.singleResult.legalCode})`,
      `[행정동]     ${C.singleResult.adminDong} (${C.singleResult.adminCode})`,
      `[단지명]     ${C.singleResult.complexName}`,
      `[단지코드]   ${C.singleResult.complexCode}`,
      `[동코드]     ${selBuilding.dongName} ${selBuilding.dongCode}`,
      `[호코드]     ${selUnit.hoName} ${selUnit.hoCode}`,
    ].join('\n');
    navigator.clipboard?.writeText(text);
    setCopiedAll(true);
    setTimeout(()=>setCopiedAll(false),2500);
  };

  const handleFileChange=(e)=>{
    const f=e.target.files?.[0];
    if(!f) return;
    setUploadedFile(f.name);
    const reader=new FileReader();
    reader.onload=(ev)=>setBatchText(ev.target.result||'');
    reader.readAsText(f,'utf-8');
  };

  const batchCount=batchText.split('\n').filter(l=>l.trim()).length;
  const perfectMatch=C.batchResults.filter(r=>r.status==='완전매칭').length;
  const perfectMatchRate=Math.round((perfectMatch/C.batchResults.length)*100);

  const CopyBtn=({fieldKey,val})=>(
    <button onClick={()=>copyField(fieldKey,val)}
      className={cn(
        'text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors shrink-0',
        copiedField===fieldKey?'bg-emerald-100 text-emerald-600':'bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600'
      )}>
      <Copy className="w-3 h-3 inline mr-0.5"/>{copiedField===fieldKey?'복사됨':'복사'}
    </button>
  );

  /* ── step helpers ── */
  const startBatch=()=>{setBatchProcessed(true);setStep(3);};
  const startReverse=()=>{doReverseSearch();setStep(3);};

  const MODE_TYPES=C.modeTypes;

  const COLOR={
    rose:   {sel:'border-rose-500 bg-rose-50 shadow-rose-100',   icon:'bg-rose-600',   btn:'bg-rose-600 hover:bg-rose-700 shadow-rose-100',   ring:'focus:border-rose-400 focus:ring-rose-100',   check:'text-rose-500'},
    orange: {sel:'border-orange-500 bg-orange-50 shadow-orange-100', icon:'bg-orange-500', btn:'bg-orange-500 hover:bg-orange-600 shadow-orange-100', ring:'focus:border-orange-400 focus:ring-orange-100', check:'text-orange-500'},
    teal:   {sel:'border-teal-500 bg-teal-50 shadow-teal-100',   icon:'bg-teal-600',   btn:'bg-teal-600 hover:bg-teal-700 shadow-teal-100',   ring:'focus:border-teal-400 focus:ring-teal-100',   check:'text-teal-500'},
    purple: {sel:'border-purple-500 bg-purple-50 shadow-purple-100', icon:'bg-purple-600', btn:'bg-purple-600 hover:bg-purple-700 shadow-purple-100', ring:'focus:border-purple-400 focus:ring-purple-100', check:'text-purple-500'},
  };

  const resetAll=()=>{
    resetSim();setCopiedField(null);setMapOpen(false);
    setBatchProcessed(false);setRevCode('');setRevResult(null);setRevSearched(false);
    setRevCopied(null);setCopiedAll(false);resetOcr();setAptResult(null);
  };

  const cur=MODE_TYPES.find(t=>t.m===mode)||MODE_TYPES[0];
  const CLR=COLOR[cur.color];

  /* ───────────── STEP 1: 입력 ───────────── */
  if(step===1) return(
    <div className="flex-1 overflow-y-auto px-6 py-8 bg-white">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* 에이전트 타이틀 */}
        <div className="flex items-center gap-3">
          {onBack&&<button onClick={onBack} className="text-slate-400 hover:text-slate-600 text-[11px] font-bold flex items-center gap-1 shrink-0"><ChevronRight className="w-3.5 h-3.5 rotate-180"/>뒤로</button>}
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shadow-md shrink-0',CLR.icon)}>
            <MapPin className="w-5 h-5 text-white"/>
          </div>
          <div>
            <div className="text-[15px] font-black text-slate-800">주소 표준화 에이전트</div>
            <div className="text-xs text-slate-400">처리 유형 선택 → 입력 → AI 주소 표준화</div>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-[10px] text-slate-400">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
            도로명주소 DB 연결됨
          </div>
        </div>

        {/* 1 · 처리 유형 선택 */}
        <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">1 · 처리 유형 선택</label>
          <div className="grid grid-cols-2 gap-3">
            {MODE_TYPES.map(t=>{
              const tc=COLOR[t.color];
              const isActive=mode===t.m;
              return(
                <button key={t.m} onClick={()=>setMode(t.m)}
                  className={cn(
                    'flex flex-col items-start gap-1.5 px-4 py-3.5 border-2 rounded-2xl text-left transition-all',
                    isActive?tc.sel+' shadow-md':'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  )}>
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-xl">{t.icon}</span>
                    <span className={cn('font-black text-[13px]',isActive?'text-slate-800':'text-slate-600')}>{t.label}</span>
                    {isActive&&<CheckCircle className={cn('w-4 h-4 ml-auto shrink-0',tc.check)}/>}
                  </div>
                  <span className="text-[11px] text-slate-400 ml-7 leading-snug">{t.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2 · 입력 (유형별) */}
        <div className="space-y-3">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">2 · 입력</label>

          {/* 단일 주소 — 탭 분기 */}
          {mode==='single'&&(
            <div className="space-y-3">
              {/* 입력 방식 탭 */}
              <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
                <button onClick={()=>setInputTab('address')}
                  className={cn('flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-black transition-all',
                    inputTab==='address'?'bg-white text-rose-600 shadow-sm':'text-slate-500 hover:text-slate-700')}>
                  <MapPin className="w-3.5 h-3.5"/>일반 주소 변환
                </button>
                <button onClick={()=>setInputTab('apt')}
                  className={cn('flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-black transition-all',
                    inputTab==='apt'?'bg-white text-rose-600 shadow-sm':'text-slate-500 hover:text-slate-700')}>
                  <Building2 className="w-3.5 h-3.5"/>공동주택 코드 조회
                </button>
              </div>

              {/* 일반 주소 입력 */}
              {inputTab==='address'&&(
                <>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-rose-400"/>
                    <input value={address} onChange={e=>setAddress(e.target.value)}
                      placeholder={C.addressPlaceholder}
                      className={cn('w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-[14px] bg-white outline-none focus:ring-2',CLR.ring,'text-slate-700')}/>
                  </div>
                  {address&&(
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-bold">유형 추정:</span>
                      <span className="px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-full font-bold text-[10px]">
                        {address.includes('로')||address.includes('길')?'도로명주소':'지번주소'}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {C.quickExamples.map((q,i)=>(
                      <button key={i} onClick={()=>setAddress(q)}
                        className="text-[11px] px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-medium hover:bg-rose-100 transition-colors">
                        {q}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* 공동주택 코드 조회 입력 */}
              {inputTab==='apt'&&(
                <>
                  <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-[11px] text-rose-700 flex items-start gap-2">
                    <Building2 className="w-4 h-4 shrink-0 mt-0.5 text-rose-500"/>
                    <span>아파트·연립주택 단지명을 입력하면 <span className="font-black">단지코드·동코드·호코드</span>를 조회합니다.</span>
                  </div>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3.5 w-4 h-4 text-rose-400"/>
                    <input value={aptQuery} onChange={e=>setAptQuery(e.target.value)}
                      placeholder={C.aptPlaceholder}
                      className={cn('w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-[14px] bg-white outline-none focus:ring-2',CLR.ring,'text-slate-700')}/>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {C.aptQuickExamples.map((q,i)=>(
                      <button key={i} onClick={()=>setAptQuery(q)}
                        className="text-[11px] px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-medium hover:bg-rose-100 transition-colors">
                        {q}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* 일괄 처리 */}
          {mode==='batch'&&(
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{batchCount}건 입력됨</span>
                <label className="flex items-center gap-1 text-[11px] text-slate-400 cursor-pointer hover:text-orange-600 transition-colors">
                  <Upload className="w-3.5 h-3.5"/><span>파일 업로드</span>
                  <input ref={fileRef} type="file" accept=".txt,.csv" className="hidden" onChange={handleFileChange}/>
                </label>
              </div>
              <textarea value={batchText} onChange={e=>setBatchText(e.target.value)} rows={7}
                placeholder="주소를 한 줄에 하나씩 입력하세요"
                className={cn('w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] bg-white outline-none focus:ring-2',CLR.ring,'text-slate-700 resize-none')}/>
            </div>
          )}

          {/* OCR 파일 */}
          {mode==='ocr'&&(
            <div
              onDragOver={e=>{e.preventDefault();setOcrFileDrag(true);}}
              onDragLeave={()=>setOcrFileDrag(false)}
              onDrop={e=>{e.preventDefault();setOcrFileDrag(false);const f=e.dataTransfer.files?.[0];if(f)setOcrFile(f.name);}}
              onClick={()=>ocrFileRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all py-12',
                ocrFileDrag?'border-teal-400 bg-teal-50':ocrFile?'border-teal-300 bg-teal-50':'border-slate-200 hover:border-teal-300 hover:bg-teal-50/40'
              )}>
              {ocrFile?(
                <>
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-teal-600"/>
                  </div>
                  <div className="text-[14px] font-bold text-teal-700">{ocrFile}</div>
                  <div className="text-[11px] text-teal-500">파일 준비 완료 · 클릭하여 변경</div>
                </>
              ):(
                <>
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-slate-400"/>
                  </div>
                  <div className="text-[14px] font-bold text-slate-600">PDF · HWP · 이미지 업로드</div>
                  <div className="text-[12px] text-slate-400 text-center leading-relaxed">
                    파일을 드래그하거나 클릭해서 선택하세요<br/>
                    <span className="text-teal-500 font-bold">DRM 자동 복호화</span> 및 <span className="text-teal-500 font-bold">{C.ocrFeatureLabel}</span> 처리 지원
                  </div>
                </>
              )}
              <input ref={ocrFileRef} type="file" accept=".pdf,.hwp,.jpg,.png" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)setOcrFile(f.name);}}/>
            </div>
          )}

          {/* 코드 역조회 */}
          {mode==='reverse'&&(
            <div className="space-y-3">
              <div className="relative">
                <Hash className="absolute left-3 top-3.5 w-4 h-4 text-purple-400"/>
                <input value={revCode} onChange={e=>{setRevCode(e.target.value);setRevSearched(false);}}
                  onKeyDown={e=>e.key==='Enter'&&startReverse()}
                  placeholder="법정동 또는 행정동 코드 10자리 (예: 1168010600)"
                  className={cn('w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-[14px] font-mono bg-white outline-none focus:ring-2',CLR.ring,'text-slate-700')}/>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {C.codeQuickExamples.map((ex,i)=>(
                  <button key={i} onClick={()=>{setRevCode(ex.code);setRevSearched(false);}}
                    className="text-[11px] px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-medium hover:bg-purple-100 transition-colors">
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 시작 버튼 */}
        <button onClick={mode==='single'?startProcess:mode==='batch'?startBatch:mode==='ocr'?startOcrProcess:startReverse}
          className={cn('w-full py-3.5 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg text-[15px]',CLR.btn)}>
          <Play className="w-4 h-4 fill-white"/>
          {mode==='single'&&inputTab==='apt'?'공동주택 코드 조회':
           mode==='single'?'주소 표준화 시작':
           mode==='batch'?'일괄 처리 시작':
           mode==='ocr'?'OCR 주소 추출 시작':'역조회 검색'}
        </button>
      </div>
    </div>
  );

  /* ───────────── STEP 2: 처리 중 (단일/OCR) ───────────── */
  if(step===2) return(
    <div className="flex-1 flex min-h-0 overflow-hidden">
      <div className="flex-1 min-w-0 flex flex-col items-center justify-center overflow-y-auto">
        <div className="w-full max-w-xl px-6">
          <div className="text-center mb-10">
            <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg',CLR.icon)}>
              {mode==='ocr'?<ScanLine className="w-7 h-7 text-white animate-pulse"/>:<Radio className="w-7 h-7 text-white animate-pulse"/>}
            </div>
            <div className="text-[18px] font-black text-slate-800">
              {mode==='ocr'?'OCR 파이프라인 처리 중':'에이전트 파이프라인 처리 중'}
            </div>
            <div className="text-sm text-slate-400 mt-1">
              {mode==='ocr'?'문서에서 주소를 인식하고 표준화합니다':'주소를 파싱하고 공식 DB와 매핑합니다'}
            </div>
          </div>
          <div className="space-y-3">
            {(mode==='ocr'?OCR_AGENTS:AGENTS).map((ag,i)=>{
              const isDone=(mode==='ocr'?ocrDoneIdx:doneIdx).includes(i);
              const isActive=(mode==='ocr'?ocrAgentIdx:agentIdx)===i;
              const AgIcon=ag.icon;
              return(
                <div key={i}>
                  <div className={cn(
                    'rounded-2xl border-2 p-4 transition-all duration-500',
                    isDone?'border-emerald-200 bg-emerald-50/60':
                    isActive?'border-slate-300 bg-slate-50 shadow-md':
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
                        <div className={cn('font-black text-sm',isDone?'text-emerald-700':isActive?'text-slate-800':'text-slate-400')}>{ag.label}</div>
                        <div className={cn('text-xs mt-0.5',isDone?'text-emerald-500':isActive?'text-slate-500':'text-slate-300')}>
                          {isActive?'처리 중 — '+ag.sub:isDone?'완료 — '+ag.sub:ag.sub}
                        </div>
                        {isActive&&mode==='ocr'&&i===1&&ocrWords.length>0&&(
                          <div className="mt-2 text-[10px] font-mono text-teal-600 bg-teal-50 border border-teal-100 rounded-lg px-2 py-1.5 leading-relaxed max-h-16 overflow-hidden">
                            {ocrWords.join(' ')}
                            {ocrAddrFound&&<span className="ml-1 text-rose-500 font-black animate-pulse"> [주소 감지]</span>}
                          </div>
                        )}
                      </div>
                      {isActive&&<Loader2 className="w-4 h-4 text-slate-400 animate-spin shrink-0"/>}
                      {isDone&&<span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">완료</span>}
                    </div>
                    {isActive&&<div className="mt-3"><div className="h-1 bg-slate-100 rounded-full overflow-hidden"><div className={cn('h-1 rounded-full animate-pulse',CLR.icon.replace('bg-','bg-'))} style={{width:'70%'}}/></div></div>}
                  </div>
                  {i<(mode==='ocr'?OCR_AGENTS:AGENTS).length-1&&<div className="flex justify-center my-1"><ChevronRight className="w-4 h-4 text-slate-300 rotate-90"/></div>}
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center text-xs text-slate-400">
            <Network className="w-3.5 h-3.5 inline mr-1"/>
            주소 표준화 파이프라인 — 공식 도로명주소 DB 기반 정규화
          </div>
        </div>
      </div>
      <div className="w-80 shrink-0 border-l border-slate-100 bg-gradient-to-b from-slate-50 to-white p-4 overflow-y-auto flex flex-col">
        <AgentWorkflowPanel agentId="agent-address" activeStep={mode==='ocr'?ocrAgentIdx:agentIdx} doneSteps={mode==='ocr'?ocrDoneIdx:doneIdx}/>
      </div>
    </div>
  );

  /* ───────────── STEP 3: 결과 ───────────── */
  return(
    <div className="flex-1 overflow-y-auto px-6 py-8 bg-white">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* 결과 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500"/>
            <span className="text-[15px] font-black text-slate-800">
              {mode==='single'&&inputTab==='apt'?`공동주택 코드 조회 완료`:
               mode==='single'?'주소 표준화 완료':
               mode==='batch'?`일괄 처리 완료 (${C.batchResults.length}건)`:
               mode==='ocr'?`OCR 주소 추출 완료 (${C.ocrAddrResults.length}건)`:'코드 역조회 완료'}
            </span>
          </div>
          <button onClick={resetAll}
            className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all">
            <RotateCcw className="w-3.5 h-3.5"/>처음으로
          </button>
        </div>

        {/* ── 공동주택 코드 조회 결과 ── */}
        {mode==='single'&&inputTab==='apt'&&aptResult&&(
          <div className="space-y-4">
            {/* 단지 정보 카드 */}
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-5 h-5 text-rose-600"/>
                    <span className="text-[16px] font-black text-slate-800">{aptResult.complexName}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">{aptResult.address}</div>
                  <div className="text-[11px] text-slate-400">{aptResult.roadAddress}</div>
                </div>
                <div className="shrink-0 text-right bg-white border border-rose-200 rounded-xl px-3 py-2">
                  <div className="text-[10px] text-rose-500 font-bold uppercase mb-0.5">단지코드</div>
                  <div className="text-[15px] font-black text-slate-800 font-mono">{aptResult.complexCode}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-rose-200">
                <div className="text-center">
                  <div className="text-[18px] font-black text-rose-700">{aptResult.totalHouseholds.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500">총세대수</div>
                </div>
                <div className="text-center border-x border-rose-200">
                  <div className="text-[18px] font-black text-rose-700">{aptResult.totalBuildings}</div>
                  <div className="text-[10px] text-slate-500">총동수</div>
                </div>
                <div className="text-center">
                  <div className="text-[14px] font-black text-rose-700">{aptResult.legalCode}</div>
                  <div className="text-[10px] text-slate-500">법정동코드 ({aptResult.legalDong})</div>
                </div>
              </div>
            </div>

            {/* 동 선택 탭 */}
            <div className="space-y-2">
              <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-3.5 h-3.5"/>동 선택
              </div>
              <div className="flex flex-wrap gap-2">
                {aptResult.buildings.map((b,i)=>(
                  <button key={i} onClick={()=>setSelectedDong(i)}
                    className={cn(
                      'px-3.5 py-2 rounded-xl border-2 text-[12px] font-black transition-all',
                      selectedDong===i?'border-rose-500 bg-rose-50 text-rose-700 shadow-sm':'border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-600'
                    )}>
                    {b.dongName}
                  </button>
                ))}
              </div>
              {/* 선택된 동 코드 */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">동코드</div>
                  <div className="text-[14px] font-black font-mono text-slate-700 mt-0.5">
                    {aptResult.buildings[selectedDong].dongCode}
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  <div>{aptResult.buildings[selectedDong].floors}층</div>
                  <div>{aptResult.buildings[selectedDong].households}세대</div>
                </div>
              </div>
            </div>

            {/* 호 목록 테이블 */}
            <div className="space-y-2">
              <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Home className="w-3.5 h-3.5"/>호 목록 — {aptResult.buildings[selectedDong].dongName}
              </div>
              <div className="border-2 border-slate-100 rounded-2xl overflow-hidden text-[12px]">
                <div className="grid grid-cols-[0.5fr_0.6fr_1.8fr_0.7fr_0.7fr] bg-slate-50 border-b">
                  {['층','호명','호코드','면적','타입'].map(h=>(
                    <div key={h} className="px-3 py-2.5 font-black text-[10px] text-slate-500 uppercase border-r last:border-r-0">{h}</div>
                  ))}
                </div>
                {aptResult.units.map((u,i)=>(
                  <div key={i} className="grid grid-cols-[0.5fr_0.6fr_1.8fr_0.7fr_0.7fr] border-b last:border-b-0 hover:bg-rose-50/40 transition-colors">
                    <div className="px-3 py-2.5 text-slate-500 font-bold border-r">{u.floor}F</div>
                    <div className="px-3 py-2.5 text-slate-700 font-bold border-r">{u.hoName}</div>
                    <div className="px-3 py-2.5 font-mono text-[11px] text-slate-600 border-r">{u.hoCode}</div>
                    <div className="px-3 py-2.5 text-slate-500 border-r">{u.area}㎡</div>
                    <div className="px-3 py-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-50 border border-rose-200 text-rose-600">
                        {u.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 단일 주소 결과 (일반) ── */}
        {mode==='single'&&inputTab==='address'&&(
          <>
            <MatchStatusBadge status={C.singleResult.status}/>

            {/* 입력 → 결과 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-100 rounded-xl px-4 py-3">
                <div className="text-[9px] font-black text-slate-400 uppercase mb-1">입력 주소</div>
                <div className="text-[13px] text-slate-600 font-medium leading-snug">{address}</div>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
                <div className="text-[9px] font-black text-rose-500 uppercase mb-1">도로명주소</div>
                <div className="text-[13px] text-rose-700 font-bold leading-snug">{C.singleResult.road}</div>
              </div>
            </div>

            {/* ① 주소 코드 */}
            <div className="bg-white border-2 border-slate-100 rounded-2xl overflow-hidden divide-y">
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">주소 코드</span>
              </div>
              {[
                {key:'road',  label:'도로명주소',  val:C.singleResult.road,  bold:true},
                {key:'jibun', label:'지번주소',    val:C.singleResult.jibun},
                {key:'zip',   label:'우편번호',    val:C.singleResult.zip},
                {key:'coord', label:'좌표 (WGS84)', val:'위도 '+C.singleResult.lat+', 경도 '+C.singleResult.lng},
                {key:'legal', label:'법정동',      val:C.singleResult.legalDong+' ('+C.singleResult.legalCode+')'},
                {key:'admin', label:'행정동',      val:C.singleResult.adminDong+' ('+C.singleResult.adminCode+')'},
              ].map(({key,label,val,bold})=>(
                <div key={key} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-24 shrink-0 text-[11px] font-black text-slate-400">{label}</div>
                  <div className={cn('flex-1 text-[13px] text-slate-700 leading-snug font-mono',bold&&'font-bold font-sans')}>{val}</div>
                  <CopyBtn fieldKey={key} val={val}/>
                </div>
              ))}
            </div>

            {/* ② 공동주택 코드 */}
            {C.singleResult.buildType==='공동주택'&&(
              <div className="bg-white border-2 border-rose-100 rounded-2xl overflow-hidden divide-y divide-rose-50">
                {/* 헤더: 단지명 + 단지코드 */}
                <div className="px-4 py-3 bg-rose-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-rose-500 shrink-0"/>
                    <span className="text-[13px] font-black text-rose-700">{C.singleResult.complexName}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">공동주택 코드</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-black font-mono text-slate-700">{C.singleResult.complexCode}</span>
                    <CopyBtn fieldKey="complex" val={C.singleResult.complexCode}/>
                  </div>
                </div>

                {/* 동 선택 + 동코드 */}
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider w-24 shrink-0">동 선택</span>
                    <div className="flex flex-wrap gap-1.5">
                      {C.aptLookupResult.buildings.map((b,i)=>(
                        <button key={i} onClick={()=>{setSelectedDong(i);setSelectedHo(0);}}
                          className={cn('px-3 py-1 rounded-lg border text-[11px] font-black transition-all',
                            selectedDong===i
                              ?'border-rose-500 bg-rose-500 text-white shadow-sm'
                              :'border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-600')}>
                          {b.dongName}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider w-24 shrink-0">동코드</span>
                    <span className="text-[13px] font-mono text-slate-700 flex-1">{C.aptLookupResult.buildings[selectedDong].dongCode}</span>
                    <CopyBtn fieldKey="dong" val={C.aptLookupResult.buildings[selectedDong].dongCode}/>
                  </div>
                </div>

                {/* 호 선택 + 호코드 */}
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider w-24 shrink-0">호 선택</span>
                    <div className="flex flex-wrap gap-1.5">
                      {C.aptLookupResult.units.map((u,i)=>(
                        <button key={i} onClick={()=>setSelectedHo(i)}
                          className={cn('px-3 py-1 rounded-lg border text-[11px] font-black transition-all',
                            selectedHo===i
                              ?'border-rose-500 bg-rose-500 text-white shadow-sm'
                              :'border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-600')}>
                          {u.hoName}
                          <span className="text-[9px] opacity-70 ml-1">{u.type}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider w-24 shrink-0">호코드</span>
                    <span className="text-[13px] font-mono text-slate-700 flex-1">{C.aptLookupResult.units[selectedHo].hoCode}</span>
                    <CopyBtn fieldKey="ho" val={C.aptLookupResult.units[selectedHo].hoCode}/>
                  </div>
                </div>

                {/* 선택 요약 */}
                <div className="px-4 py-2.5 bg-slate-50 flex items-center gap-2 flex-wrap">
                  {[
                    {label:'법정동', val:`${C.singleResult.legalDong} (${C.singleResult.legalCode})`},
                    {label:'단지코드', val:C.singleResult.complexCode},
                    {label:'동코드', val:C.aptLookupResult.buildings[selectedDong].dongCode},
                    {label:'호코드', val:C.aptLookupResult.units[selectedHo].hoCode},
                  ].map((item,i)=>(
                    <div key={i} className="flex items-center gap-1.5 text-[10px]">
                      {i>0&&<span className="text-slate-300">·</span>}
                      <span className="font-black text-slate-400">{item.label}</span>
                      <span className="font-mono text-slate-600">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={copyAllFields}
              className={cn('w-full py-3 text-[13px] font-black rounded-xl border transition-all flex items-center justify-center gap-2',
                copiedAll?'bg-emerald-50 border-emerald-300 text-emerald-700':'border-slate-200 text-slate-600 hover:border-rose-300 hover:text-rose-600')}>
              {copiedAll?<><ClipboardCheck className="w-4 h-4"/>전체 복사됨!</>:<><Clipboard className="w-4 h-4"/>전체 복사 (법정동·단지·동·호코드 포함)</>}
            </button>
          </>
        )}

        {/* ── 일괄 처리 결과 ── */}
        {mode==='batch'&&(
          <>
            <div className="grid grid-cols-3 gap-3">
              {[
                {label:'처리 건수', val:C.batchResults.length+'건', color:'text-orange-700 bg-orange-50 border-orange-200'},
                {label:'완전매칭', val:perfectMatch+'건',           color:'text-emerald-700 bg-emerald-50 border-emerald-200'},
                {label:'완전매칭률', val:perfectMatchRate+'%',     color:'text-blue-700 bg-blue-50 border-blue-200'},
              ].map(s=>(
                <div key={s.label} className={cn('border rounded-xl px-4 py-3 text-center',s.color)}>
                  <div className="text-[9px] font-black uppercase opacity-60 mb-1">{s.label}</div>
                  <div className="text-[20px] font-black">{s.val}</div>
                </div>
              ))}
            </div>
            <div className="border-2 border-slate-100 rounded-2xl overflow-hidden text-[12px]">
              <div className="grid grid-cols-[1.2fr_1.8fr_2fr_0.8fr_0.9fr] bg-slate-50 border-b">
                {['입력주소','도로명주소','지번주소','우편번호','상태'].map(h=>(
                  <div key={h} className="px-3 py-2 font-black text-[10px] text-slate-500 uppercase border-r last:border-r-0">{h}</div>
                ))}
              </div>
              {C.batchResults.map((r,i)=>(
                <div key={i} className="grid grid-cols-[1.2fr_1.8fr_2fr_0.8fr_0.9fr] border-b last:border-b-0 hover:bg-slate-50">
                  <div className="px-3 py-2.5 text-slate-600 truncate border-r">{r.input}</div>
                  <div className="px-3 py-2.5 text-slate-700 font-medium truncate border-r">{r.road}</div>
                  <div className="px-3 py-2.5 text-slate-500 truncate border-r">{r.jibun}</div>
                  <div className="px-3 py-2.5 font-mono text-slate-600 border-r">{r.zip}</div>
                  <div className="px-3 py-2.5">
                    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-black',
                      r.status==='완전매칭'?'bg-emerald-100 text-emerald-700':'bg-amber-100 text-amber-700')}>{r.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={copyBatchCsv}
                className={cn('flex-1 py-3 font-black rounded-xl border text-[13px] flex items-center justify-center gap-2 transition-all',
                  batchCopied?'bg-emerald-50 border-emerald-300 text-emerald-700':'border-orange-200 text-orange-600 hover:bg-orange-50')}>
                {batchCopied?<><ClipboardCheck className="w-4 h-4"/>복사됨!</>:<><Copy className="w-4 h-4"/>CSV 복사</>}
              </button>
              <button onClick={downloadBatchExcel}
                className="flex-1 py-3 bg-orange-500 text-white font-black rounded-xl text-[13px] flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors shadow-md shadow-orange-100">
                <Download className="w-4 h-4"/>엑셀 다운로드
              </button>
            </div>
          </>
        )}

        {/* ── OCR 결과 ── */}
        {mode==='ocr'&&(
          <div className="space-y-3">
            {C.ocrAddrResults.map((r,i)=>(
              <div key={i}
                onClick={()=>setOcrSelectedRow(ocrSelectedRow===i?null:i)}
                className={cn('border-2 rounded-2xl p-4 cursor-pointer transition-all',
                  ocrSelectedRow===i?'border-teal-400 bg-teal-50':'border-slate-200 hover:border-teal-200 hover:bg-slate-50')}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-black text-teal-600 px-2 py-0.5 bg-teal-50 border border-teal-200 rounded-full">{r.ctx}</span>
                  <div className="flex items-center gap-2">
                    <span className={cn('text-[10px] font-black px-2 py-0.5 rounded-full',
                      r.status==='완전매칭'?'bg-emerald-100 text-emerald-700':'bg-amber-100 text-amber-700')}>{r.status}</span>
                  </div>
                </div>
                <div className="text-[14px] font-bold text-slate-800 mb-0.5">{r.road}</div>
                <div className="text-[11px] text-slate-400">원문: {r.raw}</div>
                {ocrSelectedRow===i&&(
                  <div className="mt-3 pt-3 border-t border-teal-200 grid grid-cols-2 gap-2 text-[11px]">
                    <div><span className="text-slate-400 font-bold">지번: </span><span className="text-slate-600">{r.jibun}</span></div>
                    <div><span className="text-slate-400 font-bold">우편번호: </span><span className="font-mono text-slate-600">{r.zip}</span></div>
                    <div><span className="text-slate-400 font-bold">좌표: </span><span className="text-slate-600">{r.lat}, {r.lng}</span></div>
                    <div><span className="text-slate-400 font-bold">매칭상태: </span><span className={cn('font-bold',r.status==='완전매칭'?'text-emerald-600':'text-amber-600')}>{r.status}</span></div>
                    <div><span className="text-slate-400 font-bold">법정동코드: </span><span className="font-mono text-slate-600">{r.legalCode} ({r.legalDong})</span></div>
                    <div><span className="text-slate-400 font-bold">행정동코드: </span><span className="font-mono text-slate-600">{r.adminCode} ({r.adminDong})</span></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── 코드 역조회 결과 ── */}
        {mode==='reverse'&&revResult&&(
          <>
            <div className="flex items-center gap-3">
              <div className={cn('px-3 py-1 rounded-full text-[11px] font-black border',
                revResult.type==='법정동'?'bg-purple-50 border-purple-200 text-purple-700':'bg-indigo-50 border-indigo-200 text-indigo-700')}>
                {revResult.type}
              </div>
              <div className="text-[18px] font-black text-slate-800">{revResult.dong}</div>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
              <ChevronRight className="w-3 h-3 shrink-0"/>{revResult.region}
            </div>
            <div className="bg-white border-2 border-purple-100 rounded-2xl overflow-hidden divide-y">
              {[
                {key:'road',  label:'도로명주소', val:revResult.road},
                {key:'jibun', label:'지번주소',   val:revResult.jibun},
                {key:'zip',   label:'우편번호',   val:revResult.zip},
                {key:'legal', label:'법정동코드', val:revResult.legalCode+(revResult.legalDong?' ('+revResult.legalDong+')':'')},
                {key:'admin', label:'행정동코드', val:revResult.adminCode+(revResult.adminDong?' ('+revResult.adminDong+')':'')},
              ].map(({key,label,val})=>(
                <div key={key} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-24 shrink-0 text-[11px] font-black text-slate-400">{label}</div>
                  <div className="flex-1 text-[13px] text-slate-700">{val}</div>
                  <button onClick={()=>copyRevField(key,val)}
                    className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors shrink-0',
                      revCopied===key?'bg-emerald-100 text-emerald-600':'bg-slate-100 text-slate-500 hover:bg-purple-50 hover:text-purple-600')}>
                    {revCopied===key?'복사됨':'복사'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
        {mode==='reverse'&&!revResult&&revSearched&&(
          <div className="flex flex-col items-center gap-3 py-12">
            <XCircle className="w-12 h-12 text-red-300"/>
            <div className="text-[15px] font-bold text-slate-500">코드를 찾을 수 없습니다</div>
            <div className="text-[12px] text-slate-400">입력한 코드: <span className="font-mono text-slate-600">{revCode}</span></div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AddressAgent;
