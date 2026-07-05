import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, Database, Settings, Cpu, Activity, HardDrive, Server, Plus, Search,
  FileText, CheckCircle, AlertCircle, ChevronRight, ChevronDown, Bot, MoreVertical, X,
  Send, Paperclip, RefreshCw, Box, Layers, Code, Zap, BarChart2, Shield, Briefcase,
  Users, Grid, Play, Pause, Terminal, Save, Trash2, UploadCloud, List, ToggleLeft,
  ToggleRight, Clock, CheckSquare, PieChart, ArrowUpRight, Globe, Lock, Download,
  Eye, Check, XCircle, Filter, Power, RotateCcw, Cloud, Wrench, Home, Bell,
  Columns, Monitor, FolderOpen, Hash, Copy, ExternalLink, BookOpen, MessageSquare,
  FileBarChart, Table2, UserCog, Image as ImageIcon, Sparkles, GitBranch, CircleDot,
  Workflow, ArrowRight, Gauge, Package, Unplug, History, TestTube2, SlidersHorizontal,
  TrendingUp, ThumbsUp, ThumbsDown, Edit3, Megaphone, FolderTree, KeyRound, UserPlus,
  AlertTriangle, Link2, Star, Folder,
  ScanLine, FileCode2, Loader2, AlignLeft, LayoutList
} from 'lucide-react';

// ==================== MOCK DATA ====================
const MOCK_GPU_NODES = [
  { id:'node-01',name:'genos-ai-01',model:'NVIDIA H200 NVL',count:4,memory:'141GB',
    gpus:[{id:0,util:82,memUtil:65,temp:72,power:650},{id:1,util:78,memUtil:62,temp:70,power:640},{id:2,util:95,memUtil:88,temp:78,power:680},{id:3,util:45,memUtil:30,temp:55,power:320}]},
  { id:'node-02',name:'genos-ai-02',model:'NVIDIA H200 NVL',count:4,memory:'141GB',
    gpus:[{id:0,util:12,memUtil:10,temp:45,power:210},{id:1,util:5,memUtil:8,temp:42,power:190},{id:2,util:0,memUtil:2,temp:38,power:150},{id:3,util:0,memUtil:2,temp:38,power:150}]},
  { id:'node-03',name:'genos-db-01',model:'NVIDIA L40S',count:4,memory:'48GB',
    gpus:[{id:0,util:32,memUtil:45,temp:58,power:210},{id:1,util:28,memUtil:40,temp:56,power:190},{id:2,util:15,memUtil:20,temp:45,power:120},{id:3,util:10,memUtil:15,temp:42,power:110}]},
];

const MOCK_EMBEDDING_JOBS = [
  {id:950,name:'공시지가 조사지침 임베딩 v3',plan:'KoE5-base',creator:'김세은',dept:'AI혁신TF',date:'2026-02-10 14:51:32',gpu:'A100 x1',tbStatus:'실행 중',status:'학습 완료'},
  {id:910,name:'감정평가 선례 임베딩 v2',plan:'KoE5-base',creator:'이준호',dept:'토지공시부',date:'2026-01-28 22:35:46',gpu:'A100 x1',tbStatus:'실행 중',status:'학습 완료'},
  {id:895,name:'내규·지침 통합 임베딩 v4',plan:'KoE5-large',creator:'박지현',dept:'경영지원팀',date:'2026-01-19 19:59:20',gpu:'A100 x2',tbStatus:'중지됨',status:'취소됨'},
  {id:874,name:'실거래 신고서 임베딩 v1',plan:'KoE5-base',creator:'최민수',dept:'법무팀',date:'2026-01-19 19:40:26',gpu:'A100 x1',tbStatus:'중지됨',status:'학습 완료'},
  {id:856,name:'공동주택 특성자료 임베딩 v2',plan:'BGE-m3-ko',creator:'장영수',dept:'주택공시부',date:'2026-01-12 12:00:38',gpu:'A100 x1',tbStatus:'중지됨',status:'학습 완료'},
  {id:853,name:'민원 상담 사례 임베딩 v1',plan:'BGE-m3-ko',creator:'주현탁',dept:'민원지원부',date:'2026-01-11 11:37:59',gpu:'A100 x1',tbStatus:'중지됨',status:'오류 발생'},
  {id:847,name:'법령·판례 임베딩 v2',plan:'KoE5-large',creator:'고성민',dept:'부동산공시처',date:'2025-12-18 21:42:03',gpu:'A100 x2',tbStatus:'중지됨',status:'대기 중'},
  {id:844,name:'조사·평가 매뉴얼 임베딩 v1',plan:'KoE5-base',creator:'현지우',dept:'부동산통계처',date:'2025-12-18 20:58:53',gpu:'A100 x1',tbStatus:'중지됨',status:'오류 발생'},
  {id:838,name:'보상평가서 임베딩 v1',plan:'KoE5-base',creator:'정다은',dept:'보상지원부',date:'2025-12-18 20:46:38',gpu:'A100 x1',tbStatus:'중지됨',status:'오류 발생'},
];

const MOCK_MCP_TOOLS = [
  {id:162,name:'Search',desc:'사내 지식베이스 시맨틱 검색',creator:'김세은',dept:'AI혁신TF',date:'2026-01-29 22:06:28'},
  {id:159,name:'Web Search',desc:'검색 분야 설정 + 검색 분량 설정 추가',creator:'이준호',dept:'토지공시부',date:'2026-01-23 10:59:32'},
  {id:158,name:'Web Crawler',desc:'국토교통부·법제처 고시 수집',creator:'최민수',dept:'법무팀',date:'2026-01-21 18:36:52'},
  {id:155,name:'Dynamic SearchFilter',desc:'보안등급별 검색 결과 필터링',creator:'박지현',dept:'경영지원팀',date:'2026-01-20 15:27:50'},
  {id:153,name:'Dynamic Filter',desc:'부서 권한 기반 응답 필터링',creator:'장영수',dept:'주택공시부',date:'2026-01-17 18:01:51'},
  {id:151,name:'CodeDev',desc:'통계 분석 코드 실행 샌드박스',creator:'전하늘',dept:'인재개발부',date:'2025-12-26 14:28:00'},
  {id:150,name:'DocConverter',desc:'HWP·PDF 문서 변환기',creator:'최민수',dept:'법무팀',date:'2025-12-24 16:24:45'},
  {id:148,name:'SearchFilter',desc:'공시자료 검색 범위 제한',creator:'이준호',dept:'토지공시부',date:'2025-12-18 17:56:05'},
  {id:146,name:'AddrGeocoder',desc:'주소 표준화·지오코딩',creator:'전하늘',dept:'부동산통계처',date:'2025-12-12 16:17:30'},
  {id:145,name:'Normality_Test',desc:'가격 분포 정규성 검정',creator:'이준호',dept:'부동산통계처',date:'2025-12-12 14:46:54'},
];

const MOCK_MODELS = [
  {id:'gpt-oss',name:'GPT-OSS-120B',param:'120B',context:'128K',quant:'None (FP16)',status:'Running',loaded:'Node-01'},
  {id:'llama-3',name:'Llama-3-Kor-Instruct',param:'70B',context:'8K',quant:'AWQ-4bit',status:'Running',loaded:'Node-01'},
  {id:'exaone',name:'EXAONE-3.0-7.8B',param:'7.8B',context:'32K',quant:'FP16',status:'Running',loaded:'Node-02'},
  {id:'gemma',name:'Gemma-2-9B-It',param:'9B',context:'8K',quant:'GGUF-Q8',status:'Stopped',loaded:'-'},
  {id:'solar',name:'Solar-10.7B-v1.0',param:'10.7B',context:'4K',quant:'GGUF-Q5',status:'Running',loaded:'Node-02'},
];

const MOCK_PROMPTS = [
  {id:385,name:'[전용] 공시지가 상담 RAG',desc:'표준지·개별공시지가 질의 응답용 RAG 프롬프트',dept:'부동산공시처',date:'2026-01-29 10:41:12'},
  {id:384,name:'이의신청 답변 초안 프롬프트',desc:'이의신청 회신문 표준 서식 초안 생성',dept:'토지공시부',date:'2026-01-27 10:54:11'},
  {id:383,name:'[전용] 나만의 RAG',desc:'개인 지식영역 기반 전용 채팅',dept:'AI혁신TF',date:'2026-01-22 14:10:12'},
  {id:382,name:'보도자료 요약 프롬프트',desc:'주간 보도자료 3줄 요약 생성',dept:'홍보실',date:'2026-01-22 04:30:28'},
  {id:381,name:'신입 교육용 프롬프트',desc:'공시업무 입문 교육 질의응답 자료',dept:'인재개발부',date:'2026-01-22 04:27:45'},
  {id:380,name:'[전용] 규정 원문 뷰어',desc:'전용 채팅 기능(규정 원문 인용·페이지 이동)',dept:'경영지원팀',date:'2026-01-20 18:30:11'},
  {id:378,name:'[전용] 보고서 자동 생성',desc:'전용 채팅 기능(주간 실적 보고 서식)',dept:'부동산통계처',date:'2026-01-13 18:11:50'},
];

const MOCK_CHAT_APPS = [
  {id:1663,name:'공시지가 상담 챗봇',type:'전용 채팅',status:'Online',deploy:'배포',creator:'김세은',dept:'부동산공시처',addr:'/apps/notice-chat'},
  {id:1662,name:'이의신청 안내 봇',type:'전용 채팅',status:'Online',deploy:'배포',creator:'이준호',dept:'토지공시부',addr:'/apps/appeal-guide'},
  {id:1661,name:'내규 Q&A 봇',type:'전용 채팅',status:'Online',deploy:'배포',creator:'박지현',dept:'경영지원팀',addr:'/apps/reg-qa'},
  {id:1656,name:'실거래 검증 도우미',type:'전용 채팅',status:'Online',deploy:'배포',creator:'장영수',dept:'주택공시부',addr:'/apps/rtms-verify'},
  {id:1655,name:'청약 상담 봇 (시범)',type:'전용 채팅',status:'Offline',deploy:'배포중지',creator:'주현탁',dept:'청약운영부',addr:'/apps/subscription'},
  {id:1650,name:'보상평가 문의 봇',type:'전용 채팅',status:'Online',deploy:'배포',creator:'정다은',dept:'보상지원부',addr:'/apps/compensation'},
  {id:1649,name:'통계 조회 어시스턴트',type:'전용 채팅',status:'Online',deploy:'배포',creator:'현지우',dept:'부동산통계처',addr:'/apps/stats-query'},
  {id:1645,name:'리모트 RAG 채팅',type:'전용 채팅',status:'Offline',deploy:'배포중지',creator:'고성민',dept:'AI혁신TF',addr:'/apps/remote-rag'},
  {id:1643,name:'민원 응대 지원 봇',type:'전용 채팅',status:'Online',deploy:'배포',creator:'김세은',dept:'민원지원부',addr:'/apps/civil-support'},
  {id:1640,name:'현장조사 지원 챗봇',type:'전용 채팅',status:'Online',deploy:'배포',creator:'이준호',dept:'토지공시부',addr:'/apps/field-survey'},
];

const MOCK_NODES = [
  {name:'genos01',instance:'192.123.12.123:1234',os:'Linux',version:'X (Core)',release:'3.10.0-1234.12.1.el1.x86_64',cpu:0.28,mem:4.6},
  {name:'genos02',instance:'192.123.12.123:1234',os:'Linux',version:'X (Core)',release:'3.10.0-1234.12.1.el1.x86_64',cpu:13.0,mem:43.2},
  {name:'genos03',instance:'192.123.12.123:1234',os:'Linux',version:'X (Core)',release:'3.10.0-1234.12.1.el1.x86_64',cpu:4.69,mem:18.4},
];

const MOCK_GUARDRAIL_LOGS = [
  {id:1,time:'2026-02-10 11:23:45',user:'김직원',query:'회사 기밀정보 알려줘',rule:'기밀정보 요청',action:'차단'},
  {id:2,time:'2026-02-10 10:15:22',user:'이대리',query:'경쟁사 비밀 분석해줘',rule:'경쟁정보 수집',action:'차단'},
  {id:3,time:'2026-02-09 16:42:11',user:'박과장',query:'직원 급여 전체 목록',rule:'개인정보 접근',action:'차단'},
  {id:4,time:'2026-02-09 14:30:05',user:'최사원',query:'보안 시스템 우회 방법',rule:'보안 우회 시도',action:'차단'},
  {id:5,time:'2026-02-08 09:12:33',user:'정대리',query:'퇴직자 연락처 전체',rule:'개인정보 접근',action:'경고'},
];

// ==================== LLM ADMIN MOCK DATA ====================
const MOCK_LLM_ADMIN_MODELS = [
  {id:'m-001',name:'GPT-OSS-120B',baseModel:'Meta-Llama-3-405B-Instruct',version:'v2.4.1',
   desc:'한국부동산원 특화 파인튜닝 대용량 LLM — 규정 검색, 문서 요약, 에이전트 업무 자동화 최적화',
   status:'Active',temperature:0.3,maxTokens:4096,topP:0.9,contextWindow:'128K',
   systemPrompt:'당신은 한국부동산원(REB)의 전문 AI 어시스턴트입니다.\n\n규칙:\n1. 반드시 사내 규정·지침을 우선 참조합니다.\n2. 불확실한 내용은 "확인이 필요합니다"로 답변합니다.\n3. 개인정보 및 보안 정보는 절대 제공하지 않습니다.\n4. 모든 답변은 공문서 형식을 따릅니다.',
   promptHistory:[
    {ver:'v2.4.1',date:'2026-02-10 14:30',author:'김영빈',note:'보안 규정 4항 추가',
     content:'당신은 한국부동산원(REB)의 전문 AI 어시스턴트입니다.\n\n규칙:\n1. 반드시 사내 규정·지침을 우선 참조합니다.\n2. 불확실한 내용은 "확인이 필요합니다"로 답변합니다.\n3. 개인정보 및 보안 정보는 절대 제공하지 않습니다.\n4. 모든 답변은 공문서 형식을 따릅니다.'},
    {ver:'v2.3.0',date:'2026-01-15 09:00',author:'한서윤',note:'온보딩 처리 규칙 개선',
     content:'당신은 한국부동산원의 AI 어시스턴트입니다.\n\n사내 규정을 참조하여 답변하고, 불확실한 내용은 확인 필요 안내를 제공하세요.'},
    {ver:'v2.0.0',date:'2025-12-01 10:00',author:'김영빈',note:'초기 배포 버전',
     content:'한국부동산원 AI 어시스턴트입니다. 전문적이고 정확한 정보를 제공합니다.'},
  ]},
  {id:'m-002',name:'Llama-3-Kor-Instruct',baseModel:'Meta-Llama-3-70B',version:'v1.8.0',
   desc:'70B 한국어 특화 경량 모델 — HR 질의, 교육 안내 등 빠른 응답 업무에 활용',
   status:'Active',temperature:0.5,maxTokens:2048,topP:0.95,contextWindow:'8K',
   systemPrompt:'한국부동산원 직원 지원 AI입니다. 인사 규정, 복리후생, 교육 안내를 친절하게 제공합니다.',
   promptHistory:[
    {ver:'v1.8.0',date:'2026-02-01 11:00',author:'박지현',note:'인사 규정 2026 개정 반영',
     content:'한국부동산원 직원 지원 AI입니다. 인사 규정, 복리후생, 교육 안내를 친절하게 제공합니다.'},
    {ver:'v1.5.0',date:'2025-11-10 09:00',author:'전하늘',note:'교육 안내 기능 추가',content:'한국부동산원 HR 어시스턴트입니다.'},
  ]},
  {id:'m-003',name:'EXAONE-3.0-7.8B',baseModel:'LG-EXAONE-3.0-7.8B',version:'v1.3.2',
   desc:'LG AI Research 7.8B 경량 모델 — 저지연 실시간 응답, 단순 질의 최적',
   status:'Active',temperature:0.6,maxTokens:1024,topP:0.9,contextWindow:'32K',
   systemPrompt:'한국부동산원 정보 안내 AI입니다. 간결하고 정확하게 답변합니다.',
   promptHistory:[
    {ver:'v1.3.2',date:'2026-01-20 14:00',author:'김영빈',note:'응답 간결화 지시어 추가',content:'한국부동산원 정보 안내 AI입니다. 간결하고 정확하게 답변합니다.'},
  ]},
  {id:'m-004',name:'Solar-10.7B-v1.0',baseModel:'Upstage-Solar-Pro-10.7B',version:'v1.0.0',
   desc:'Upstage Solar 10.7B — 비활성화 (성능 평가 후 재도입 예정)',
   status:'Inactive',temperature:0.5,maxTokens:2048,topP:0.9,contextWindow:'4K',
   systemPrompt:'',promptHistory:[]},
];

const MOCK_FILTER_RULES = [
  {id:1,n:'기밀정보 요청',p:'기밀, 보안등급, 내부전용, 사내비밀',category:'기밀',severity:'danger',a:'차단',active:true,hitCount:23},
  {id:2,n:'개인정보 접근',p:'급여, 주민번호, 연봉, 개인식별',category:'개인정보',severity:'danger',a:'차단',active:true,hitCount:41},
  {id:3,n:'경쟁정보 수집',p:'경쟁사, 입찰가, 내부가격, 원가',category:'기밀',severity:'warning',a:'차단',active:true,hitCount:8},
  {id:4,n:'보안 우회 시도',p:'우회, 해킹, 탈옥, jailbreak, 프롬프트 무시',category:'보안',severity:'danger',a:'차단',active:true,hitCount:12},
  {id:5,n:'비윤리적 요청',p:'차별, 혐오, 폭력, 불법',category:'비윤리',severity:'warning',a:'차단',active:true,hitCount:6},
  {id:6,n:'외부 URL 삽입',p:'http://, https://, www.',category:'보안',severity:'caution',a:'경고',active:true,hitCount:34},
  {id:7,n:'과도한 반복 질의',p:'반복, 재실행, 계속, 루프',category:'시스템',severity:'caution',a:'로그만',active:false,hitCount:2},
];

// ==================== 신뢰성 관리 MOCK DATA ====================
const MOCK_RERANK_PIPELINES = [
  {id:'rp-001',agent:'공시업무규정 검색 에이전트',model:'BGE-Reranker-v2',topK:5,threshold:0.70,enabled:true,improvement:18.4},
  {id:'rp-002',agent:'가격 검증 어시스턴트',model:'Cross-Encoder-KoE5',topK:3,threshold:0.75,enabled:true,improvement:12.1},
  {id:'rp-003',agent:'HR 질의응답 봇',model:'BGE-Reranker-v2',topK:5,threshold:0.65,enabled:true,improvement:9.8},
  {id:'rp-004',agent:'계약서 검토 에이전트',model:'ColBERT-v2-Kor',topK:8,threshold:0.80,enabled:false,improvement:0},
  {id:'rp-005',agent:'민원 대응 가이드',model:'BGE-Reranker-v2',topK:5,threshold:0.85,enabled:true,improvement:22.3},
  {id:'rp-006',agent:'직무 교육 튜터',model:'Cross-Encoder-KoE5',topK:4,threshold:0.68,enabled:true,improvement:7.5},
];

const MOCK_RAG_GLOBAL = {
  chunkSize:512,chunkOverlap:64,topKRetrieve:10,topKAfterRerank:5,
  similarityThreshold:0.65,embeddingModel:'KoSimCSE-roberta-multitask',
  hybridSearch:true,bm25Weight:30,semanticWeight:70,
  citationRequired:true,minCitationSimilarity:75,
};

const MOCK_RAG_AREAS = [
  {id:'KA-001',area:'공시업무규정',topK:8,threshold:0.70,chunkSize:256,override:true,updated:'2026-02-12'},
  {id:'KA-002',area:'조사·평가 매뉴얼',topK:10,threshold:0.65,chunkSize:512,override:true,updated:'2026-02-10'},
  {id:'KA-003',area:'인사규정',topK:5,threshold:0.60,chunkSize:512,override:false,updated:'2026-02-08'},
  {id:'KA-004',area:'법률/계약',topK:6,threshold:0.75,chunkSize:256,override:true,updated:'2026-02-05'},
  {id:'KA-005',area:'교육자료',topK:7,threshold:0.62,chunkSize:512,override:false,updated:'2026-02-11'},
  {id:'KA-006',area:'민원대응',topK:5,threshold:0.80,chunkSize:256,override:true,updated:'2026-01-28'},
];

const MOCK_OUTPUT_GUARDRAILS = [
  {id:'og-001',name:'인용 출처 필수',desc:'RAG 응답 시 반드시 참조 문서 출처를 포함해야 합니다.',category:'인용',action:'재생성 요청',enabled:true,hitCount:14},
  {id:'og-002',name:'숫자·날짜 팩트 검증',desc:'규정 조항 번호·날짜가 참조 문서와 일치하는지 검증합니다.',category:'팩트체크',action:'경고 표시',enabled:true,hitCount:8},
  {id:'og-003',name:'불확실 표현 감지',desc:'"아마도","추정","잘 모르겠" 등 불확실 표현 자동 감지합니다.',category:'팩트체크',action:'신뢰도 감점',enabled:true,hitCount:31},
  {id:'og-004',name:'응답 길이 제한',desc:'2,000자 초과 응답은 자동으로 요약본을 제공합니다.',category:'품질',action:'자동 요약',enabled:true,hitCount:22},
  {id:'og-005',name:'외부 URL 출력 차단',desc:'응답 본문에 외부 URL이 포함될 경우 제거합니다.',category:'보안',action:'자동 제거',enabled:true,hitCount:5},
  {id:'og-006',name:'PII 자동 마스킹',desc:'출력에 개인식별정보(이름·전화·주민번호) 포함 시 마스킹합니다.',category:'보안',action:'자동 마스킹',enabled:false,hitCount:0},
  {id:'og-007',name:'반복 루프 감지',desc:'동일한 문장이 3회 이상 반복될 경우 응답을 중단합니다.',category:'품질',action:'응답 중단',enabled:true,hitCount:3},
];

const MOCK_CONFIDENCE_CONFIG = {
  autoAnswerThreshold:80,hitlThreshold:65,hallucinationWarnThreshold:55,
  factors:[
    {name:'RAG 유사도 점수',key:'rag',weight:40,desc:'벡터 검색 결과 상위 문서 평균 유사도'},
    {name:'LLM 자체 신뢰도',key:'llm',weight:35,desc:'모델 출력 토큰 확률 기반 자체 평가'},
    {name:'Re-ranker 점수',key:'rerank',weight:25,desc:'Cross-Encoder 최종 정렬 점수'},
  ],
  perModel:[
    {model:'GPT-OSS-120B',baseline:88,adj:0,avgScore:87.4},
    {model:'Llama-3-Kor-Instruct',baseline:82,adj:-3,avgScore:79.2},
    {model:'EXAONE-3.0-7.8B',baseline:76,adj:-5,avgScore:73.8},
    {model:'Solar-10.7B-v1.0',baseline:72,adj:-2,avgScore:70.1},
  ],
  trend:[
    {date:'02-18',avg:83.2},{date:'02-19',avg:84.5},{date:'02-20',avg:82.1},
    {date:'02-21',avg:85.8},{date:'02-22',avg:87.2},{date:'02-23',avg:86.1},{date:'02-24',avg:88.4},
  ],
};

const MOCK_CODESPACES = [
  {id:1,name:'llm-finetune-env',image:'pytorch/pytorch:2.1-cuda12.1',status:'Running',gpu:'H200 x1',created:'2026-02-10'},
  {id:2,name:'rag-pipeline-dev',image:'python:3.11-slim',status:'Running',gpu:'-',created:'2026-02-08'},
  {id:3,name:'embedding-research',image:'nvidia/cuda:12.2-devel',status:'Stopped',gpu:'L40S x1',created:'2026-02-05'},
  {id:4,name:'agent-builder-test',image:'node:20-alpine',status:'Running',gpu:'-',created:'2026-01-28'},
];

const MOCK_VOLUMES = [
  {name:'shared-models',size:'2.4 TB',mount:'/mnt/models',usedBy:'llm-finetune-env, rag-pipeline-dev',status:'Healthy'},
  {name:'dataset-store',size:'800 GB',mount:'/mnt/datasets',usedBy:'embedding-research',status:'Healthy'},
  {name:'vector-db-backup',size:'120 GB',mount:'/mnt/backup/vectordb',usedBy:'System',status:'Healthy'},
  {name:'logs-archive',size:'50 GB',mount:'/mnt/logs',usedBy:'All',status:'Warning'},
];

// ==================== ADMIN MOCK DATA ====================
const MOCK_USERS = [
  {id:'USR-001',name:'김영빈',dept:'AI활용 업무혁신 TF',role:'시스템관리자',email:'kim@reb.or.kr',status:'Running',lastLogin:'2026-02-14 09:10',loginCount:342,apiCalls:1580},
  {id:'USR-002',name:'이준호',dept:'토지공시부',role:'부서관리자',email:'lee@reb.or.kr',status:'Running',lastLogin:'2026-02-14 08:45',loginCount:280,apiCalls:920},
  {id:'USR-003',name:'박지현',dept:'경영지원팀',role:'일반사용자',email:'park@reb.or.kr',status:'Running',lastLogin:'2026-02-13 17:30',loginCount:156,apiCalls:430},
  {id:'USR-004',name:'최민수',dept:'법무팀',role:'일반사용자',email:'choi@reb.or.kr',status:'Running',lastLogin:'2026-02-14 07:20',loginCount:98,apiCalls:210},
  {id:'USR-005',name:'장영수',dept:'주택공시부',role:'부서관리자',email:'jang@reb.or.kr',status:'Stopped',lastLogin:'2026-02-10 14:00',loginCount:45,apiCalls:80},
  {id:'USR-006',name:'전하늘',dept:'인재개발부',role:'일반사용자',email:'jeon@reb.or.kr',status:'Running',lastLogin:'2026-02-13 16:55',loginCount:201,apiCalls:560},
  {id:'USR-007',name:'고성민',dept:'부동산공시처',role:'부서관리자',email:'ko@reb.or.kr',status:'Running',lastLogin:'2026-02-14 08:00',loginCount:310,apiCalls:1200},
  {id:'USR-008',name:'한서윤',dept:'정보기술팀',role:'시스템관리자',email:'han@reb.or.kr',status:'Running',lastLogin:'2026-02-14 09:05',loginCount:450,apiCalls:2100},
];

const MOCK_PERMISSION_REQUESTS = [
  {id:'PRM-001',user:'박지현',dept:'경영지원팀',type:'지식영역 접근',target:'공시업무규정 DB',status:'대기 중',date:'2026-02-13'},
  {id:'PRM-002',user:'최민수',dept:'법무팀',type:'API 키 발급',target:'GPT-OSS-120B',status:'대기 중',date:'2026-02-12'},
  {id:'PRM-003',user:'장영수',dept:'주택공시부',type:'에이전트 배포',target:'현장조사 보고서 생성기',status:'완료',date:'2026-02-11'},
  {id:'PRM-004',user:'전하늘',dept:'인재개발부',type:'데이터셋 접근',target:'Notice_Guidelines_QA_v1',status:'완료',date:'2026-02-10'},
];

const MOCK_KNOWLEDGE_AREAS = [
  {id:'KA-001',name:'공시업무규정',desc:'사내 공시업무규정 및 매뉴얼',docs:245,chunks:12400,size:'1.2 GB',owner:'부동산공시처',access:['AI연구소','토지공시부','부동산공시처'],updated:'2026-02-12',status:'Running'},
  {id:'KA-002',name:'조사·평가 매뉴얼',desc:'현장조사 및 평가 실무 문서',docs:180,chunks:9200,size:'850 MB',owner:'주택공시부',access:['토지공시부','주택공시부'],updated:'2026-02-10',status:'Running'},
  {id:'KA-003',name:'인사규정',desc:'복리후생, 급여, 인사 관련 규정',docs:120,chunks:6100,size:'320 MB',owner:'경영지원팀',access:['전체'],updated:'2026-02-08',status:'Running'},
  {id:'KA-004',name:'법률/계약',desc:'계약서 템플릿 및 법률 자문 문서',docs:95,chunks:4800,size:'450 MB',owner:'법무팀',access:['법무팀','경영지원팀'],updated:'2026-02-05',status:'Running'},
  {id:'KA-005',name:'교육자료',desc:'신입사원 교육 및 기술 교육 자료',docs:310,chunks:15600,size:'2.1 GB',owner:'인재개발부',access:['전체'],updated:'2026-02-11',status:'Running'},
  {id:'KA-006',name:'민원대응',desc:'비상 매뉴얼 및 대응 절차',docs:65,chunks:3200,size:'180 MB',owner:'부동산공시처',access:['전체'],updated:'2026-01-28',status:'Warning'},
];

const MOCK_KB_FOLDERS = [
  {id:'f-001',name:'공시업무규정',parent:null,docs:245,perm:'all',owner:'부동산공시처'},
  {id:'f-011',name:'실거래 검증',parent:'f-001',docs:120,perm:'dept',owner:'부동산공시처'},
  {id:'f-012',name:'시설안전',parent:'f-001',docs:125,perm:'dept',owner:'토지공시부'},
  {id:'f-002',name:'조사·평가 매뉴얼',parent:null,docs:180,perm:'dept',owner:'주택공시부'},
  {id:'f-021',name:'점검 이력',parent:'f-002',docs:80,perm:'dept',owner:'주택공시부'},
  {id:'f-003',name:'인사규정',parent:null,docs:120,perm:'all',owner:'경영지원팀'},
  {id:'f-004',name:'법률/계약',parent:null,docs:95,perm:'specific',owner:'법무팀'},
  {id:'f-005',name:'교육자료',parent:null,docs:310,perm:'all',owner:'인재개발부'},
];
const MOCK_KB_DOCS = {
  'f-001':[
    {id:'d-001',name:'공시업무규정_2026.pdf',size:'4.2MB',pii:false,status:'완료',chunks:312,uploaded:'2026-02-12',uploader:'고성민'},
    {id:'d-002',name:'표준지공시지가_조사기준.pdf',size:'8.1MB',pii:false,status:'완료',chunks:580,uploaded:'2026-02-10',uploader:'고성민'},
    {id:'d-003',name:'안전점검체크리스트.xlsx',size:'1.2MB',pii:true,status:'완료',chunks:85,uploaded:'2026-02-08',uploader:'이준호'},
  ],
  'f-002':[
    {id:'d-011',name:'현장조사_실무매뉴얼.pdf',size:'12.3MB',pii:false,status:'완료',chunks:820,uploaded:'2026-02-10',uploader:'장영수'},
    {id:'d-012',name:'2025_유지보수이력.xlsx',size:'2.8MB',pii:true,status:'처리중',chunks:190,uploaded:'2026-02-11',uploader:'장영수'},
  ],
  'f-003':[
    {id:'d-021',name:'인사규정_2026_개정안.pdf',size:'2.4MB',pii:true,status:'완료',chunks:145,uploaded:'2026-02-14',uploader:'박지현'},
    {id:'d-022',name:'복리후생제도안내.pdf',size:'1.8MB',pii:false,status:'완료',chunks:98,uploaded:'2026-01-20',uploader:'박지현'},
  ],
  'f-004':[{id:'d-031',name:'표준계약서_2026.docx',size:'580KB',pii:false,status:'완료',chunks:62,uploaded:'2026-02-05',uploader:'최민수'}],
  'f-005':[
    {id:'d-041',name:'신입교육과정.pptx',size:'22.5MB',pii:false,status:'완료',chunks:410,uploaded:'2026-02-01',uploader:'전하늘'},
    {id:'d-042',name:'안전교육_2026_1분기.pdf',size:'5.8MB',pii:false,status:'완료',chunks:270,uploaded:'2026-02-11',uploader:'전하늘'},
  ],
};
const MOCK_BATCH_JOBS = [
  {id:'bj-001',src:'그룹웨어',target:'공시업무규정',schedule:'매일 02:00',lastRun:'2026-02-25 02:00',lastResult:'성공',addedDocs:3,updatedDocs:1,deletedDocs:0,enabled:true},
  {id:'bj-002',src:'ERP',target:'인사규정',schedule:'매주 월 03:00',lastRun:'2026-02-24 03:00',lastResult:'성공',addedDocs:0,updatedDocs:2,deletedDocs:0,enabled:true},
  {id:'bj-003',src:'DMS',target:'법률/계약',schedule:'실시간 동기화',lastRun:'2026-02-25 09:15',lastResult:'성공',addedDocs:1,updatedDocs:0,deletedDocs:0,enabled:true},
  {id:'bj-004',src:'그룹웨어',target:'교육자료',schedule:'매일 04:00',lastRun:'2026-02-24 04:00',lastResult:'실패',addedDocs:0,updatedDocs:0,deletedDocs:0,enabled:false},
];
const MOCK_SYNC_LOGS = [
  {id:1,time:'2026-02-25 09:15:22',src:'DMS',folder:'법률/계약',file:'임시계약서_수정본.docx',action:'추가',pii:false,status:'완료'},
  {id:2,time:'2026-02-25 02:00:45',src:'그룹웨어',folder:'공시업무규정',file:'안전교육자료_2월.pdf',action:'추가',pii:false,status:'완료'},
  {id:3,time:'2026-02-25 02:00:43',src:'그룹웨어',folder:'공시업무규정',file:'안전점검일지_2월.xlsx',action:'업데이트',pii:true,status:'완료(마스킹)'},
  {id:4,time:'2026-02-24 03:01:12',src:'ERP',folder:'인사규정',file:'급여기준표_개정.xlsx',action:'업데이트',pii:true,status:'완료(마스킹)'},
  {id:5,time:'2026-02-23 04:00:33',src:'그룹웨어',folder:'교육자료',file:'신입교육자료_2월.pptx',action:'추가',pii:false,status:'실패'},
];

const MOCK_USAGE_STATS = {
  daily:[
    {date:'02-08',queries:1240,users:85},{date:'02-09',queries:980,users:72},{date:'02-10',queries:1560,users:102},
    {date:'02-11',queries:1890,users:115},{date:'02-12',queries:2100,users:128},{date:'02-13',queries:1780,users:110},{date:'02-14',queries:920,users:68}
  ],
  byDept:[{dept:'AI연구소',queries:3200,pct:28},{dept:'토지공시부',queries:2400,pct:21},{dept:'경영지원팀',queries:1800,pct:16},{dept:'부동산공시처',queries:1500,pct:13},{dept:'인재개발부',queries:1200,pct:10},{dept:'기타',queries:1370,pct:12}],
  byModel:[{model:'GPT-OSS-120B',queries:5200,pct:45},{model:'Llama-3-Kor',queries:3100,pct:27},{model:'EXAONE-3.0',queries:2800,pct:24},{model:'기타',queries:370,pct:4}],
  topKeywords:['공시업무규정','현장조사','실거래 검증','인사규정','계약검토','교육자료','민원대응','표준지 선정','복리후생','출장규정'],
};

const MOCK_USAGE_HISTORY = [
  {id:'uh-001',user:'김영빈',dept:'AI활용 업무혁신 TF',mode:'GENERAL',query:'표준지공시지가 정기 현장조사 시기가 어떻게 되나요?',answer:'표준지공시지가 조사지침(제2장)에 따르면, 표준지는 매년 1월 1일을 기준으로 현장조사를 실시하며, 가격변동이 큰 지역은 수시조사를 병행...',time:'2026-02-25 14:30',tokens:284,rating:5,errReport:false},
  {id:'uh-002',user:'이준호',dept:'토지공시부',mode:'REVIEW',query:'업로드한 출장 신청 기안문을 취업규칙과 대조해서 위반 소지 검토해줘',answer:'취업규칙 대조 결과: 5박 초과 시 임원 별도 승인 필요(제42조②), 출장비 신청서 누락...',time:'2026-02-25 13:20',tokens:412,rating:4,errReport:false},
  {id:'uh-003',user:'박지현',dept:'경영지원팀',mode:'TRANSLATE',query:'업로드한 영문 평가 기준서를 한국어로 번역해줘',answer:'시장가치의 정의 (IVS 국제평가기준) — 시장가치란 자발적인 매도인과 매수인 사이의 정상적인 거래에서 성립될 가능성이 가장 높은 가액...',time:'2026-02-25 11:05',tokens:556,rating:5,errReport:false},
  {id:'uh-004',user:'고성민',dept:'부동산공시처',mode:'GENERAL',query:'비상시 대피 경로',answer:'본사 건물의 비상 대피 경로는...',time:'2026-02-24 16:42',tokens:185,rating:2,errReport:true,errDetail:'층별 대피도 누락, 환각 의심'},
  {id:'uh-005',user:'최민수',dept:'법무팀',mode:'REVIEW',query:'수의계약 한도액 기준 확인',answer:'수의계약은 추정가격이 2천만원 이하인 경우...',time:'2026-02-24 15:30',tokens:320,rating:3,errReport:false},
  {id:'uh-006',user:'전하늘',dept:'인재개발부',mode:'REPORT',query:'이번 주 표준지 현장조사 12건 완료, 이의신청 검토 2건 처리 완료를 주간 실적 보고서로 작성해줘',answer:'부동산공시처 주간 업무 실적 보고 | 보고 기간: 2026.02.17~02.21...',time:'2026-02-24 14:15',tokens:680,rating:5,errReport:false},
];
const MOCK_SATISFACTION_DATA = {
  avg:4.2, total:342,
  dist:[{stars:5,count:178,pct:52},{stars:4,count:95,pct:28},{stars:3,count:41,pct:12},{stars:2,count:18,pct:5},{stars:1,count:10,pct:3}],
  recent:[
    {id:1,user:'이준호',dept:'토지공시부',stars:4,comment:'문서 검토 결과가 매우 정확했습니다. 더 빠른 응답 속도가 필요합니다.',date:'2026-02-25'},
    {id:2,user:'박지현',dept:'경영지원팀',stars:5,comment:'번역 품질이 훌륭합니다. 공기업 문체도 잘 반영됩니다.',date:'2026-02-25'},
    {id:3,user:'고성민',dept:'부동산공시처',stars:2,comment:'비상 대피 경로 답변이 부정확했습니다. 개선 필요.',date:'2026-02-24'},
    {id:4,user:'전하늘',dept:'인재개발부',stars:5,comment:'보고서 자동 작성 기능이 업무 효율을 크게 높여주었습니다.',date:'2026-02-24'},
    {id:5,user:'최민수',dept:'법무팀',stars:3,comment:'계약 관련 법령 DB가 더 최신화되면 좋겠습니다.',date:'2026-02-23'},
  ]
};

// ==================== RAG PIPELINE MOCK DATA ====================
const MOCK_DATA_SOURCES_INT = [
  {id:'ds-i01',name:'그룹웨어 (WorksOn)',protocol:'REST API',target:'공시업무규정/교육자료',schedule:'매일 02:00',lastSync:'2026-02-25 02:01',status:'정상',docCount:555,newToday:5},
  {id:'ds-i02',name:'ERP (SAP S/4HANA)',protocol:'DB Direct',target:'인사규정',schedule:'매주 월 03:00',lastSync:'2026-02-24 03:02',status:'정상',docCount:120,newToday:0},
  {id:'ds-i03',name:'DMS (문서관리시스템)',protocol:'WebDAV',target:'법률/계약',schedule:'실시간 동기화',lastSync:'2026-02-25 09:15',status:'정상',docCount:95,newToday:1},
  {id:'ds-i04',name:'EDMS (전자결재시스템)',protocol:'REST API',target:'공시업무규정',schedule:'매일 01:00',lastSync:'2026-02-25 01:03',status:'경고',docCount:280,newToday:0},
];
const MOCK_DATA_SOURCES_EXT = [
  {id:'ds-e01',name:'법령정보센터 (법제처)',method:'Open API',url:'https://www.law.go.kr/DRF/lawService',target:'법률/계약',schedule:'매주 화 05:00',lastSync:'2026-02-25 05:00',status:'정상',docCount:1240,newToday:3},
  {id:'ds-e02',name:'나라장터 (조달청)',method:'Open API',url:'https://openapi.g2b.go.kr/',target:'법률/계약',schedule:'매일 06:00',lastSync:'2026-02-25 06:01',status:'정상',docCount:320,newToday:12},
  {id:'ds-e03',name:'국가법령 (산업안전)',method:'크롤링',url:'https://www.law.go.kr/',target:'공시업무규정',schedule:'매주 수 04:00',lastSync:'2026-02-19 04:00',status:'정상',docCount:88,newToday:0},
  {id:'ds-e04',name:'국토교통부 공시업무 규정',method:'크롤링',url:'https://www.molit.go.kr/',target:'공시업무규정',schedule:'매주 목 04:00',lastSync:'2026-02-20 04:00',status:'오류',docCount:42,newToday:0},
];
const MOCK_DOC_PIPELINE = [
  {id:'dp-001',name:'공시업무규정_2026.pdf',folder:'공시업무규정',src:'그룹웨어',type:'PDF',size:'4.2MB',ingest:'2026-02-25 02:01',parseStatus:'완료',chunkStatus:'완료',embedStatus:'완료',chunks:312,tokens:48200,pii:false,version:3,changeType:'업데이트'},
  {id:'dp-002',name:'안전교육자료_2월.pdf',folder:'공시업무규정',src:'그룹웨어',type:'PDF',size:'8.1MB',ingest:'2026-02-25 02:00',parseStatus:'완료',chunkStatus:'완료',embedStatus:'완료',chunks:580,tokens:91000,pii:false,version:1,changeType:'신규'},
  {id:'dp-003',name:'급여기준표_개정.xlsx',folder:'인사규정',src:'ERP',type:'XLSX',size:'1.8MB',ingest:'2026-02-24 03:01',parseStatus:'완료',chunkStatus:'완료',embedStatus:'완료',chunks:145,tokens:18500,pii:true,version:5,changeType:'업데이트'},
  {id:'dp-004',name:'임시계약서_수정본.docx',folder:'법률/계약',src:'DMS',type:'DOCX',size:'580KB',ingest:'2026-02-25 09:15',parseStatus:'완료',chunkStatus:'완료',embedStatus:'처리중',chunks:62,tokens:9800,pii:false,version:2,changeType:'업데이트'},
  {id:'dp-005',name:'신입교육자료_2월.pptx',folder:'교육자료',src:'그룹웨어',type:'PPTX',size:'22.5MB',ingest:'2026-02-23 04:00',parseStatus:'완료',chunkStatus:'실패',embedStatus:'대기',chunks:0,tokens:0,pii:false,version:1,changeType:'신규'},
  {id:'dp-006',name:'산업안전보건법_개정.pdf',folder:'공시업무규정',src:'법령정보센터',type:'PDF',size:'3.2MB',ingest:'2026-02-25 05:00',parseStatus:'완료',chunkStatus:'완료',embedStatus:'완료',chunks:210,tokens:33500,pii:false,version:1,changeType:'신규'},
  {id:'dp-007',name:'나라장터_입찰공고_0225.json',folder:'법률/계약',src:'조달청',type:'JSON',size:'1.1MB',ingest:'2026-02-25 06:01',parseStatus:'완료',chunkStatus:'완료',embedStatus:'완료',chunks:28,tokens:4200,pii:false,version:1,changeType:'신규'},
];
const MOCK_CHUNK_QUALITY = [
  {docId:'d-001',name:'공시업무규정_2026.pdf',folder:'공시업무규정',avgLen:154,specialCharPct:1.2,dupPct:0.8,semanticScore:94,status:'양호'},
  {docId:'d-002',name:'표준지공시지가_조사기준.pdf',folder:'공시업무규정',avgLen:168,specialCharPct:2.1,dupPct:1.5,semanticScore:91,status:'양호'},
  {docId:'d-011',name:'현장조사_실무매뉴얼.pdf',folder:'조사·평가 매뉴얼',avgLen:142,specialCharPct:4.5,dupPct:3.2,semanticScore:78,status:'주의'},
  {docId:'d-021',name:'인사규정_2026_개정안.pdf',folder:'인사규정',avgLen:201,specialCharPct:0.8,dupPct:0.4,semanticScore:96,status:'양호'},
  {docId:'d-041',name:'신입교육과정.pptx',folder:'교육자료',avgLen:88,specialCharPct:8.2,dupPct:6.5,semanticScore:58,status:'경고'},
  {docId:'e-006',name:'산업안전보건법_개정.pdf',folder:'공시업무규정',avgLen:178,specialCharPct:1.9,dupPct:0.9,semanticScore:92,status:'양호'},
];
const MOCK_CHUNK_PREVIEW = [
  {idx:1,text:'제1장 총칙 제1조(목적) 본 조사지침은 표준지공시지가의 조사·평가에 관한 세부 기준과 절차를 정하여 공시지가의 적정성과 균형성을 확보함을 목적으로 한다.',len:142,score:96},
  {idx:2,text:'제2조(적용범위) 이 지침은 전국 표준지 및 시·군·구 조사 담당자와 조사·평가를 위탁받은 감정평가법인등에 적용한다.',len:88,score:93},
  {idx:3,text:'제3조(정의) ① "표준지"란 토지의 가격공시를 위하여 선정한 대표성 있는 필지를 말한다. ② "현장조사"란 조사자가 대상 토지를 직접 방문하여 이용상황·주위환경 등을 확인하는 절차를 말한다.',len:165,score:97},
];
const MOCK_EMBED_STATUS = {
  today:{total:1420,success:1398,fail:8,pending:14,successRate:98.4},
  models:[
    {name:'KLUE-BERT-base',dim:768,docs:12400,lastUpdated:'2026-02-25 02:30',status:'정상',avgLatency:42},
    {name:'BGE-M3 (한국어 특화)',dim:1024,docs:5800,lastUpdated:'2026-02-25 06:10',status:'정상',avgLatency:67},
  ],
  vectorDb:{name:'Milvus 2.4',collections:6,totalVectors:1824560,diskUsage:'18.4 GB',indexType:'HNSW',status:'정상',queryLatency:8},
  anomalies:[
    {id:'an-001',doc:'신입교육과정.pptx',type:'낮은밀도',desc:'벡터 클러스터 밀도 임계값(0.45) 미만 — 이미지 슬라이드 과다 포함 의심',detected:'2026-02-23 04:12',status:'미처리'},
    {id:'an-002',doc:'2025_유지보수이력.xlsx',type:'이상치',desc:'유클리디안 거리 상위 1% 이상 이탈 벡터 12개 탐지 — 수식/특수문자 과다',detected:'2026-02-24 03:05',status:'검토중'},
  ],
  weeklyTrend:[
    {date:'02-19',success:1280,fail:22},{date:'02-20',success:1350,fail:15},{date:'02-21',success:1180,fail:31},
    {date:'02-22',success:890,fail:8},{date:'02-23',success:420,fail:12},{date:'02-24',success:1390,fail:6},{date:'02-25',success:1398,fail:8},
  ],
};
const MOCK_REPROCESS_QUEUE = [
  {id:'rq-001',doc:'신입교육자료_2월.pptx',folder:'교육자료',src:'그룹웨어',stage:'청킹',error:'PPTX 이미지 슬라이드 파싱 오류 (PIL 디코딩 실패)',failedAt:'2026-02-23 04:00',retryCount:2,status:'대기중',priority:'높음'},
  {id:'rq-002',doc:'국토교통부_공시업무규정.pdf',folder:'공시업무규정',src:'크롤링',stage:'임베딩',error:'임베딩 서버 응답 타임아웃 (>30s)',failedAt:'2026-02-20 04:15',retryCount:1,status:'대기중',priority:'보통'},
  {id:'rq-003',doc:'현장조사일지_1월.xlsx',folder:'조사·평가 매뉴얼',src:'그룹웨어',stage:'파싱',error:'암호화된 XLSX 파일 — 비밀번호 해제 필요',failedAt:'2026-02-18 02:05',retryCount:3,status:'수동처리필요',priority:'높음'},
  {id:'rq-004',doc:'민원대응매뉴얼_v3.pdf',folder:'민원대응',src:'DMS',stage:'임베딩',error:'토큰 수 초과 (한도 32,768 — 실제 41,200토큰)',failedAt:'2026-02-22 09:30',retryCount:0,status:'대기중',priority:'보통'},
];

// ==================== 정보서비스·모니터링·HR MOCK DATA ====================
const MOCK_SERVICE_STATS = {
  summary:{users:842,newToday:12,conversations:15240,apiCalls:48920,linkCalls:3280,feedbacks:342},
  daily:[
    {date:'02-19',users:98,conv:1840,api:5820},{date:'02-20',users:115,conv:2100,api:6230},
    {date:'02-21',users:102,conv:1980,api:5940},{date:'02-22',users:45,conv:890,api:2810},
    {date:'02-23',users:32,conv:620,api:1980},{date:'02-24',users:128,conv:2380,api:7100},{date:'02-25',users:134,conv:2460,api:7280},
  ],
  keywords:[
    {word:'공시업무규정',cnt:1240},{word:'현장조사',cnt:980},{word:'실거래 검증',cnt:820},{word:'인사규정',cnt:750},
    {word:'계약검토',cnt:680},{word:'교육자료',cnt:540},{word:'민원대응',cnt:490},{word:'표준지 선정',cnt:420},
    {word:'이의신청 처리',cnt:380},{word:'복리후생',cnt:320},{word:'출장규정',cnt:280},{word:'보고서 작성',cnt:240},
  ],
  topics:[
    {topic:'공시·조사',pct:38,c:'bg-red-400'},{topic:'통계·시장',pct:25,c:'bg-blue-400'},
    {topic:'인사·노무',pct:16,c:'bg-green-400'},{topic:'법무·계약',pct:11,c:'bg-purple-400'},{topic:'교육·훈련',pct:10,c:'bg-yellow-400'},
  ],
  apiByEndpoint:[
    {ep:'/api/v1/chat',calls:28420,pct:58},{ep:'/api/v1/rag/search',calls:12880,pct:26},
    {ep:'/api/v1/embed',calls:4820,pct:10},{ep:'/api/v1/agent/run',calls:1940,pct:4},{ep:'기타',calls:860,pct:2},
  ],
  peakHours:[0,0,0,0,0,2,8,42,112,168,145,98,120,145,160,182,195,188,142,95,68,42,18,5],
};
const MOCK_NOTICES_MGMT = [
  {id:'N-001',title:'[필독] 2026년 1분기 보안 업데이트 공지',type:'공지',author:'한서윤',date:'2026-02-25',views:248,pinned:true,active:true},
  {id:'N-002',title:'GPT-OSS-120B 모델 업그레이드 안내',type:'업데이트',author:'김영빈',date:'2026-02-22',views:182,pinned:false,active:true},
  {id:'N-003',title:'3월 정기 점검 (2026.03.08 02:00~06:00)',type:'점검',author:'한서윤',date:'2026-02-20',views:124,pinned:false,active:true},
  {id:'N-004',title:'AI 플랫폼 사용 매뉴얼 v2.1 배포',type:'매뉴얼',author:'김영빈',date:'2026-02-15',views:340,pinned:false,active:true},
];
const MOCK_QNA_MGMT = [
  {id:'Q-001',title:'번역 기능에서 한→중 번역이 안됩니다',user:'박지현',dept:'경영지원팀',date:'2026-02-25',status:'답변완료',answer:'현재 한→중 번역은 베타 기능으로 일부 문장 유형에서 오류가 발생할 수 있습니다. v2.1 패치에서 개선될 예정입니다.'},
  {id:'Q-002',title:'에이전트가 공시 데이터에 접근하지 못하는 경우',user:'이준호',dept:'토지공시부',date:'2026-02-24',status:'처리중',answer:''},
  {id:'Q-003',title:'RAG 검색 시 유사도 점수 기준이 어떻게 되나요?',user:'고성민',dept:'부동산공시처',date:'2026-02-23',status:'답변완료',answer:'현재 코사인 유사도 0.75 이상인 문서가 검색 결과에 포함됩니다. 관리자 설정에서 임계값 조정이 가능합니다.'},
  {id:'Q-004',title:'보고서 자동 생성 길이 제한 변경 가능한가요?',user:'전하늘',dept:'인재개발부',date:'2026-02-21',status:'대기',answer:''},
];
const MOCK_SURVEYS_MGMT = [
  {id:'SV-001',title:'2026년 1분기 AI 플랫폼 만족도 조사',start:'2026-02-01',end:'2026-02-28',responses:248,target:450,status:'진행중'},
  {id:'SV-002',title:'신규 에이전트 기능 필요성 조사',start:'2026-01-15',end:'2026-01-31',responses:312,target:400,status:'완료'},
  {id:'SV-003',title:'사용자 온보딩 경험 개선 설문',start:'2026-03-01',end:'2026-03-31',responses:0,target:500,status:'예정'},
];
const MOCK_IP_BLOCKS = [
  {id:'ib-001',target:'192.168.100.45',type:'IP',reason:'비정상 반복 접속 (10분간 500회)',action:'차단',appliedBy:'한서윤',date:'2026-02-24',status:'활성'},
  {id:'ib-002',target:'10.20.30.99',type:'IP',reason:'권한 외 지식영역 접근 시도',action:'차단',appliedBy:'한서윤',date:'2026-02-22',status:'활성'},
  {id:'ib-003',target:'USR-EXT-012',type:'ID',reason:'퇴직 처리 미완료 계정',action:'차단',appliedBy:'김영빈',date:'2026-02-20',status:'활성'},
  {id:'ib-004',target:'192.168.200.0/24',type:'대역',reason:'협력업체 외부망 허용 대역',action:'허용',appliedBy:'한서윤',date:'2026-02-10',status:'활성'},
];
const MOCK_WORK_LOG = [
  {id:1,time:'2026-02-25 14:35',user:'김영빈',dept:'AI혁신TF',ip:'10.20.30.41',action:'문서 업로드',target:'공시업무규정_2026.pdf',detail:'공시업무규정 폴더 업로드 (4.2MB)'},
  {id:2,time:'2026-02-25 14:20',user:'한서윤',dept:'정보기술팀',ip:'10.20.30.10',action:'설정 변경',target:'GPT-OSS-120B',detail:'Temperature 0.3→0.2 변경'},
  {id:3,time:'2026-02-25 13:55',user:'이준호',dept:'토지공시부',ip:'10.20.30.55',action:'에이전트 호출',target:'가격검증봇',detail:'공시가격 검증 질의 (응답 2.1s)'},
  {id:4,time:'2026-02-25 11:30',user:'박지현',dept:'경영지원팀',ip:'10.20.30.78',action:'데이터 추출',target:'이용통계_0225.xlsx',detail:'통계 엑셀 다운로드 (48KB)'},
  {id:5,time:'2026-02-25 10:12',user:'고성민',dept:'부동산공시처',ip:'10.20.30.62',action:'지식영역 접근',target:'공시업무규정 DB',detail:'민원대응 관련 5건 검색'},
];
const MOCK_EXTRACT_LOG = [
  {id:1,time:'2026-02-25 11:30',user:'박지현',dept:'경영지원팀',type:'통계 엑셀',file:'이용통계_0225.xlsx',size:'48KB',rows:340},
  {id:2,time:'2026-02-24 16:45',user:'김영빈',dept:'AI혁신TF',type:'로그 CSV',file:'접속로그_0224.csv',size:'1.2MB',rows:5820},
  {id:3,time:'2026-02-23 14:20',user:'한서윤',dept:'정보기술팀',type:'보고서 PDF',file:'월간리포트_202601.pdf',size:'3.4MB',rows:null},
  {id:4,time:'2026-02-22 10:05',user:'이준호',dept:'토지공시부',type:'질의이력 CSV',file:'질의이력_이준호_0222.csv',size:'89KB',rows:248},
];
const MOCK_USAGE_BY_DEPT = [
  {dept:'AI활용 추진반',users:8,queries:3240,avgLen:245,tokens:812000,peakHour:'14:00',abuseSuspect:false},
  {dept:'토지공시부',users:15,queries:2880,avgLen:198,tokens:621000,peakHour:'10:00',abuseSuspect:false},
  {dept:'부동산공시처',users:12,queries:2240,avgLen:185,tokens:452000,peakHour:'09:00',abuseSuspect:false},
  {dept:'경영지원팀',users:10,queries:1820,avgLen:142,tokens:284000,peakHour:'14:00',abuseSuspect:false},
  {dept:'법무팀',users:6,queries:1480,avgLen:312,tokens:502000,peakHour:'11:00',abuseSuspect:false},
  {dept:'인재개발부',users:11,queries:1240,avgLen:168,tokens:228000,peakHour:'15:00',abuseSuspect:false},
];
const MOCK_ABUSE_ALERTS = [
  {id:'ab-001',user:'미확인',ip:'192.168.100.45',type:'반복 접속',detail:'10분간 500회 API 호출 (정상범위 100회/10분)',detected:'2026-02-25 11:18',status:'차단됨',severity:'위험'},
  {id:'ab-002',user:'USR-EXT-012',ip:'10.20.100.8',type:'권한 외 접근',detail:'법무/계약 지식영역 무단 접근 시도 12회',detected:'2026-02-24 15:30',status:'경고발송',severity:'주의'},
  {id:'ab-003',user:'장영수',ip:'10.20.30.75',type:'대량 추출',detail:'1시간 내 엑셀 추출 8회 (일 평균 0.3회)',detected:'2026-02-23 14:40',status:'모니터링',severity:'정보'},
];
const MOCK_APIS = [
  {id:'api-001',name:'GeNOS Chat API',endpoint:'/api/v1/chat',version:'v1.2',auth:'Bearer Token',status:'활성',callsToday:28420,approvedDate:'2026-01-05'},
  {id:'api-002',name:'RAG 검색 API',endpoint:'/api/v1/rag/search',version:'v1.0',auth:'Bearer Token',status:'활성',callsToday:12880,approvedDate:'2026-01-05'},
  {id:'api-003',name:'임베딩 API',endpoint:'/api/v1/embed',version:'v1.1',auth:'API Key',status:'활성',callsToday:4820,approvedDate:'2026-01-12'},
  {id:'api-004',name:'에이전트 실행 API',endpoint:'/api/v1/agent/run',version:'v0.9',auth:'Bearer Token',status:'베타',callsToday:1940,approvedDate:'2026-02-01'},
  {id:'api-005',name:'통계 조회 API',endpoint:'/api/v1/stats',version:'v1.0',auth:'API Key',status:'활성',callsToday:320,approvedDate:'2026-01-20'},
];
const MOCK_API_APPROVALS = [
  {id:'apr-001',requester:'이준호',dept:'토지공시부',api:'에이전트 실행 API',purpose:'가격 검증 자동화 파이프라인 연동',requestDate:'2026-02-24',status:'대기'},
  {id:'apr-002',requester:'최민수',dept:'법무팀',api:'RAG 검색 API',purpose:'계약서 검토 자동화 연동',requestDate:'2026-02-22',status:'대기'},
  {id:'apr-003',requester:'전하늘',dept:'인재개발부',api:'임베딩 API',purpose:'교육자료 유사도 검색 시스템',requestDate:'2026-02-20',status:'승인'},
];
const MOCK_PROMPTS_MGMT = [
  {id:'pt-001',name:'공시업무규정 Q&A 시스템 프롬프트',mode:'GENERAL',version:'v2.1',tokens:342,lastUpdated:'2026-02-20',active:true,desc:'부동산 공시업무규정 전문 답변 프롬프트. 출처 인용 필수, 환각 방지 지시 포함.'},
  {id:'pt-002',name:'문서 검토 평가 프롬프트',mode:'REVIEW',version:'v1.4',tokens:518,lastUpdated:'2026-02-18',active:true,desc:'사내 규정 대조 문서 검토용. 위반 소지 항목을 조항 단위로 발췌하도록 지시.'},
  {id:'pt-003',name:'번역·요약 지시 프롬프트',mode:'TRANSLATE',version:'v1.0',tokens:285,lastUpdated:'2026-02-10',active:true,desc:'한/영/중/일 다국어 번역 및 요약 길이 제어 지시.'},
  {id:'pt-004',name:'보고서 생성 프롬프트',mode:'REPORT',version:'v2.0',tokens:624,lastUpdated:'2026-02-15',active:true,desc:'공문서 형식 기반 주간/월간/특수 보고서 자동 생성.'},
];
const MOCK_HR_SYNC = {
  lastSync:'2026-02-25 01:00:12',nextSync:'2026-02-26 01:00:00',status:'정상',
  summary:{total:842,new:3,retired:1,moved:5,concurrent:2,leave:4},
  recent:[
    {id:'hr-001',name:'신민철',type:'신규입사',dept:'AI활용 추진반',syncDate:'2026-02-25',action:'계정 생성'},
    {id:'hr-002',name:'유정민',type:'신규입사',dept:'토지공시부',syncDate:'2026-02-25',action:'계정 생성'},
    {id:'hr-003',name:'장태훈',type:'퇴직',dept:'정보기술팀',syncDate:'2026-02-25',action:'계정 비활성화'},
    {id:'hr-004',name:'이민준',type:'부서이동',dept:'부동산공시처 → 토지공시부',syncDate:'2026-02-24',action:'부서 정보 업데이트'},
    {id:'hr-005',name:'박서연',type:'겸직',dept:'법무팀 + 경영지원팀',syncDate:'2026-02-24',action:'그룹 추가'},
    {id:'hr-006',name:'최재혁',type:'부재설정',dept:'토지공시부',syncDate:'2026-02-23',action:'임시 계정 잠금 (육아휴직)'},
  ],
};
const MOCK_CONNECTED_SW = {
  rag:{status:'정상',qps:28.4,avgLatency:142,successRate:98.4,queueSize:14},
  ocr:{status:'정상',processed:342,avgLatency:890,successRate:99.2,queueSize:2},
  vectordb:{name:'Milvus 2.4',status:'정상',totalVectors:1824560,qps:45.2,avgQueryMs:8,diskUsage:'18.4GB'},
  agent:{status:'주의',activePipelines:3,completedToday:28,failedToday:2,avgExecSec:12.4},
  logs:[
    {time:'2026-02-25 14:30',sw:'RAG',level:'INFO',msg:'검색 쿼리 처리 완료 (28.4 QPS, p99=342ms)'},
    {time:'2026-02-25 13:20',sw:'Agent',level:'WARN',msg:'파이프라인 #P-042 실행 시간 초과 (30s 한도)'},
    {time:'2026-02-25 11:18',sw:'VectorDB',level:'INFO',msg:'인덱스 최적화 완료 (HNSW, 1,824,560 vectors)'},
    {time:'2026-02-25 09:42',sw:'Agent',level:'ERROR',msg:'파이프라인 #P-039 실패 (외부 API 연결 오류)'},
    {time:'2026-02-25 02:30',sw:'RAG',level:'INFO',msg:'임베딩 배치 처리 완료 (1,398 vectors, 98.4% 성공)'},
    {time:'2026-02-24 22:00',sw:'OCR',level:'INFO',msg:'야간 배치 OCR 처리 완료 (342건)'},
  ],
};

const MOCK_ACCESS_LOGS = [
  {id:1,time:'2026-02-14 09:10:23',user:'김영빈',dept:'AI활용 업무혁신 TF',action:'로그인',ip:'10.20.30.41',detail:'SSO 인증 성공'},
  {id:2,time:'2026-02-14 09:08:15',user:'이준호',dept:'토지공시부',action:'에이전트 호출',ip:'10.20.30.55',detail:'가격 검증 어시스턴트 질의'},
  {id:3,time:'2026-02-14 08:55:02',user:'한서윤',dept:'정보기술팀',action:'모델 설정 변경',ip:'10.20.30.10',detail:'GPT-OSS-120B Temperature 0.3→0.2'},
  {id:4,time:'2026-02-14 08:45:33',user:'박지현',dept:'경영지원팀',action:'문서 업로드',ip:'10.20.30.78',detail:'인사규정_2026_개정안.pdf (2.4MB)'},
  {id:5,time:'2026-02-14 08:30:11',user:'고성민',dept:'부동산공시처',action:'에이전트 호출',ip:'10.20.30.62',detail:'민원 대응 가이드 질의'},
  {id:6,time:'2026-02-14 08:20:45',user:'최민수',dept:'법무팀',action:'에이전트 호출',ip:'10.20.30.90',detail:'계약서 검토 에이전트 질의'},
  {id:7,time:'2026-02-13 17:55:10',user:'전하늘',dept:'인재개발부',action:'보고서 생성',ip:'10.20.30.44',detail:'기술교육 이수현황 리포트'},
  {id:8,time:'2026-02-13 17:30:22',user:'장영수',dept:'주택공시부',action:'로그아웃',ip:'10.20.30.33',detail:'세션 종료'},
];

const MOCK_QUALITY_REVIEWS = [
  {id:'QR-001',query:'표준지 현장조사 주기는?',answer:'표준지는 연 1회 정기 현장조사를 실시하며...',agent:'공시업무규정 검색 에이전트',reviewer:'고성민',rating:'good',confidence:0.92,date:'2026-02-13',feedback:'정확한 규정 인용'},
  {id:'QR-002',query:'연차 계산 방법 알려줘',answer:'근로기준법에 따라 1년 미만 근로자는...',agent:'HR 질의응답 봇',reviewer:'박지현',rating:'edit',confidence:0.78,date:'2026-02-12',feedback:'공사 내규 추가 필요'},
  {id:'QR-003',query:'공동주택 공시가격 산정 기준',answer:'공동주택 공시가격은 실거래가와 시세 수준을 반영하여...',agent:'가격 검증 어시스턴트',reviewer:'이준호',rating:'good',confidence:0.95,date:'2026-02-11',feedback:''},
  {id:'QR-004',query:'비상시 대피 경로',answer:'본사 건물의 비상 대피 경로는...',agent:'민원 대응 가이드',reviewer:'고성민',rating:'bad',confidence:0.55,date:'2026-02-10',feedback:'층별 대피도 누락, 할루시네이션 의심'},
  {id:'QR-005',query:'수의계약 한도액 기준',answer:'수의계약은 추정가격이 2천만원 이하인 경우...',agent:'계약서 검토 에이전트',reviewer:'최민수',rating:'edit',confidence:0.82,date:'2026-02-09',feedback:'공사 내규 한도액 기준 상이'},
];

const MOCK_ANNOUNCEMENTS = [
  {id:1,title:'GenOS AI 플랫폼 정식 오픈 안내',category:'공지',status:'Running',startDate:'2026-02-01',endDate:'2026-03-01',author:'한서윤',views:452},
  {id:2,title:'시스템 정기 점검 안내 (2/15 02:00~06:00)',category:'점검',status:'Running',startDate:'2026-02-13',endDate:'2026-02-15',author:'한서윤',views:128},
  {id:3,title:'신규 모델 Solar-10.7B 서비스 추가',category:'업데이트',status:'Running',startDate:'2026-02-10',endDate:'2026-02-28',author:'김영빈',views:89},
  {id:4,title:'개인 지식영역 기능 출시',category:'업데이트',status:'Stopped',startDate:'2026-01-15',endDate:'2026-02-01',author:'김영빈',views:310},
];

const MOCK_LINKED_SW = [
  {name:'Milvus Vector DB',version:'2.4.1',status:'Running',endpoint:'milvus.reb.internal:19530',cpu:12.5,memory:28.4,uptime:'30d 4h'},
  {name:'OCR Engine (Tesseract)',version:'5.3.3',status:'Running',endpoint:'ocr.reb.internal:8090',cpu:5.2,memory:8.1,uptime:'30d 4h'},
  {name:'vLLM Serving',version:'0.4.2',status:'Running',endpoint:'vllm.reb.internal:8000',cpu:45.0,memory:62.3,uptime:'14d 2h'},
  {name:'Redis Cache',version:'7.2.4',status:'Running',endpoint:'redis.reb.internal:6379',cpu:2.1,memory:15.6,uptime:'30d 4h'},
  {name:'MinIO Object Storage',version:'2024.02',status:'Warning',endpoint:'minio.reb.internal:9000',cpu:8.3,memory:12.0,uptime:'30d 4h'},
  {name:'Agent Runtime',version:'1.2.0',status:'Running',endpoint:'agent.reb.internal:5000',cpu:18.7,memory:24.5,uptime:'7d 11h'},
];

// ==================== AGENT MOCK DATA ====================
const MOCK_AGENTS = [
  {id:'AGT-001',name:'공시업무규정 검색 에이전트',desc:'사내 공시업무규정 및 매뉴얼을 기반으로 질의응답을 수행합니다.',model:'GPT-OSS-120B',tools:['사내 규정 벡터 DB','웹 검색'],mcpTools:['MCP-Search','MCP-WebCrawler'],ragEnabled:true,hitl:false,a2a:false,responseMode:'knowledge',actionable:false,status:'Running',version:'v2.1',creator:'김세은',dept:'AI연구소',created:'2026-01-15',updated:'2026-02-08',requests24h:342,avgLatency:'1.2s',successRate:98.5,confidence:0.92,systemPrompt:'당신은 한국부동산원의 공시 규정 전문가입니다. 사내 규정을 정확히 참조하여 답변하세요.',temperature:0.3,maxTokens:2048},
  {id:'AGT-002',name:'가격 검증 어시스턴트',desc:'공시가격 이상 징후를 분석하고 검증 절차를 안내합니다. 실거래가 데이터 연동으로 실시간 분석.',model:'Llama-3-Kor-Instruct',tools:['공시가격 이력 DB','실거래가 조회 API'],mcpTools:['MCP-RTMS','MCP-SearchFilter'],ragEnabled:true,hitl:true,a2a:true,responseMode:'knowledge',actionable:false,status:'Running',version:'v1.8',creator:'이준호',dept:'토지공시부',created:'2026-01-20',updated:'2026-02-10',requests24h:189,avgLatency:'0.8s',successRate:97.2,confidence:0.88,systemPrompt:'공시가격 전문 검증 도우미입니다. 가격 이력과 실거래 데이터를 참조하여 검증 절차를 안내하세요.',temperature:0.2,maxTokens:4096},
  {id:'AGT-003',name:'HR 질의응답 봇',desc:'인사/복리후생/규정 관련 직원 문의에 자동 응답합니다.',model:'EXAONE-3.0-7.8B',tools:['HR 규정 벡터 DB'],mcpTools:['MCP-Search'],ragEnabled:true,hitl:false,a2a:false,responseMode:'knowledge',actionable:false,status:'Running',version:'v1.3',creator:'박지현',dept:'경영지원팀',created:'2025-12-05',updated:'2026-02-03',requests24h:567,avgLatency:'0.5s',successRate:95.8,confidence:0.85,systemPrompt:'한국부동산원 인사 규정 전문 도우미입니다. 정확한 조항을 인용하여 답변하세요.',temperature:0.4,maxTokens:1024},
  {id:'AGT-004',name:'계약서 검토 에이전트',desc:'계약서 초안을 검토하고 리스크 조항을 식별합니다.',model:'GPT-OSS-120B',tools:['법률 규정 DB','계약 템플릿 DB'],mcpTools:['MCP-Search','MCP-DynamicFilter'],ragEnabled:true,hitl:true,a2a:false,responseMode:'knowledge',actionable:false,status:'Running',version:'v1.0',creator:'최민수',dept:'법무팀',created:'2026-02-01',updated:'2026-02-09',requests24h:45,avgLatency:'2.1s',successRate:99.1,confidence:0.94,systemPrompt:'계약서 전문 검토 에이전트입니다. 불리한 조항이나 누락된 사항을 식별하세요.',temperature:0.1,maxTokens:4096},
  {id:'AGT-005',name:'현장조사 보고서 생성기',desc:'현장 조사 데이터를 기반으로 정형화된 보고서를 자동 생성합니다.',model:'Llama-3-Kor-Instruct',tools:['보고서 템플릿 DB','현장조사 이력 DB'],mcpTools:['MCP-CodeDev'],ragEnabled:false,hitl:false,a2a:true,responseMode:'direct',actionable:true,status:'Stopped',version:'v0.9',creator:'장영수',dept:'주택공시부',created:'2026-01-25',updated:'2026-02-05',requests24h:0,avgLatency:'-',successRate:92.0,confidence:0.76,systemPrompt:'현장조사 보고서를 작성하는 전문 에이전트입니다.',temperature:0.5,maxTokens:8192},
  {id:'AGT-006',name:'직무 교육 튜터',desc:'신입사원 및 조사직 대상 직무 교육 질의응답을 제공합니다.',model:'EXAONE-3.0-7.8B',tools:['교육 자료 벡터 DB','웹 검색'],mcpTools:['MCP-Search','MCP-WebSearch'],ragEnabled:true,hitl:false,a2a:false,responseMode:'knowledge',actionable:false,status:'Running',version:'v1.5',creator:'전하늘',dept:'인재개발부',created:'2025-11-10',updated:'2026-01-28',requests24h:231,avgLatency:'0.6s',successRate:96.4,confidence:0.87,systemPrompt:'한국부동산원 직무 교육 튜터입니다. 쉽고 정확하게 설명하세요.',temperature:0.6,maxTokens:2048},
  {id:'AGT-007',name:'민원 대응 가이드',desc:'집단 민원 등 긴급 상황 시 대응 절차를 실시간으로 안내합니다.',model:'GPT-OSS-120B',tools:['민원 매뉴얼 DB','알림 서비스 API'],mcpTools:['MCP-Search','MCP-RTMS'],ragEnabled:true,hitl:true,a2a:true,responseMode:'knowledge',actionable:true,status:'Running',version:'v3.0',creator:'고성민',dept:'부동산공시처',created:'2025-10-01',updated:'2026-02-11',requests24h:12,avgLatency:'0.9s',successRate:99.8,confidence:0.96,systemPrompt:'민원 대응 전문 에이전트입니다. 신속하고 정확한 대응 절차를 안내하세요.',temperature:0.1,maxTokens:2048},
  {id:'AGT-008',name:'회계전표 자동 작성',desc:'업무 지시를 받아 ERP 시스템에서 회계전표를 자동으로 작성합니다.',model:'GPT-OSS-120B',tools:['ERP 연동 API','회계 규정 DB'],mcpTools:['MCP-ERPConnector','MCP-GWSync'],ragEnabled:false,hitl:true,a2a:true,responseMode:'direct',actionable:true,status:'Running',version:'v1.0',creator:'한서윤',dept:'정보기술팀',created:'2026-02-05',updated:'2026-02-13',requests24h:78,avgLatency:'3.2s',successRate:96.0,confidence:0.90,systemPrompt:'회계전표 작성 전문 에이전트입니다. ERP 시스템과 연동하여 전표를 자동 생성합니다.',temperature:0.1,maxTokens:2048},
];

const MOCK_AGENT_DEPLOYS = [
  {id:'DEP-001',agentId:'AGT-001',agentName:'공시업무규정 검색 에이전트',model:'GPT-OSS-120B',version:'v2.1',env:'Production',endpoint:'/api/agent/notice-reg',deployDate:'2026-02-08 14:30',deployer:'김세은',status:'Running',replicas:3,cpu:'2 Core',memory:'8 GB',gpu:'H200 x1',uptime:'5d 12h',requests24h:342,errorRate:1.5},
  {id:'DEP-002',agentId:'AGT-002',agentName:'가격 검증 어시스턴트',model:'Llama-3-Kor-Instruct',version:'v1.8',env:'Production',endpoint:'/api/agent/price-verify',deployDate:'2026-02-10 09:15',deployer:'이준호',status:'Running',replicas:2,cpu:'4 Core',memory:'16 GB',gpu:'H200 x1',uptime:'3d 2h',requests24h:189,errorRate:2.8},
  {id:'DEP-003',agentId:'AGT-003',agentName:'HR 질의응답 봇',model:'EXAONE-3.0-7.8B',version:'v1.3',env:'Production',endpoint:'/api/agent/hr-qa',deployDate:'2026-02-03 11:00',deployer:'박지현',status:'Running',replicas:2,cpu:'1 Core',memory:'4 GB',gpu:'-',uptime:'10d 1h',requests24h:567,errorRate:4.2},
  {id:'DEP-004',agentId:'AGT-004',agentName:'계약서 검토 에이전트',model:'GPT-OSS-120B',version:'v1.0',env:'Staging',endpoint:'/api/agent/contract-review',deployDate:'2026-02-09 16:45',deployer:'최민수',status:'Running',replicas:1,cpu:'2 Core',memory:'8 GB',gpu:'H200 x1',uptime:'4d 5h',requests24h:45,errorRate:0.9},
  {id:'DEP-005',agentId:'AGT-005',agentName:'현장조사 보고서 생성기',model:'Llama-3-Kor-Instruct',version:'v0.9',env:'Staging',endpoint:'/api/agent/survey-report',deployDate:'2026-02-05 10:00',deployer:'장영수',status:'Stopped',replicas:0,cpu:'-',memory:'-',gpu:'-',uptime:'-',requests24h:0,errorRate:0},
  {id:'DEP-006',agentId:'AGT-006',agentName:'직무 교육 튜터',model:'EXAONE-3.0-7.8B',version:'v1.5',env:'Production',endpoint:'/api/agent/edu-tutor',deployDate:'2026-01-28 08:30',deployer:'전하늘',status:'Running',replicas:2,cpu:'1 Core',memory:'4 GB',gpu:'-',uptime:'16d 3h',requests24h:231,errorRate:3.6},
  {id:'DEP-007',agentId:'AGT-007',agentName:'민원 대응 가이드',model:'GPT-OSS-120B',version:'v3.0',env:'Production',endpoint:'/api/agent/civil-response',deployDate:'2026-02-11 00:00',deployer:'고성민',status:'Running',replicas:4,cpu:'4 Core',memory:'16 GB',gpu:'H200 x2',uptime:'2d 11h',requests24h:12,errorRate:0.2},
  {id:'DEP-008',agentId:'AGT-008',agentName:'회계전표 자동 작성',model:'GPT-OSS-120B',version:'v1.0',env:'Staging',endpoint:'/api/agent/accounting',deployDate:'2026-02-13 10:30',deployer:'한서윤',status:'Running',replicas:2,cpu:'2 Core',memory:'8 GB',gpu:'H200 x1',uptime:'1d 0h',requests24h:78,errorRate:4.0},
];

const MOCK_WORKFLOWS = [
  {id:'WF-001',name:'공시가격 이상 종합 대응',desc:'가격 이상 감지 → 검증 → 보고서 생성 → 알림 발송 (A2A 멀티에이전트)',status:'Running',creator:'김세은',created:'2026-02-01',lastRun:'2026-02-13 09:30',runs24h:8,successRate:95.0,protocol:'A2A',hitl:true,
    steps:[{id:'s1',name:'가격 변동 이상 감지',type:'trigger',agentId:null},{id:'s2',name:'가격 검증 어시스턴트',type:'agent',agentId:'AGT-002'},{id:'s3',name:'HITL 전문가 검토',type:'hitl',agentId:null},{id:'s4',name:'심각도 ≥ 높음',type:'condition',agentId:null},{id:'s5',name:'조사 보고서 생성',type:'agent',agentId:'AGT-005'},{id:'s6',name:'민원 대응 가이드',type:'agent',agentId:'AGT-007'},{id:'s7',name:'MCP 알림 발송',type:'mcp',agentId:null}]},
  {id:'WF-002',name:'신입사원 온보딩 자동화',desc:'HR 질의 → 교육 콘텐츠 추천 → 규정 안내 (MCP 그룹웨어 연동)',status:'Running',creator:'박지현',created:'2026-01-20',lastRun:'2026-02-12 15:00',runs24h:15,successRate:98.0,protocol:'MCP',hitl:false,
    steps:[{id:'s1',name:'신규 입사자 트리거',type:'trigger',agentId:null},{id:'s2',name:'MCP-GWSync',type:'mcp',agentId:null},{id:'s3',name:'HR 질의응답 봇',type:'agent',agentId:'AGT-003'},{id:'s4',name:'직무 교육 튜터',type:'agent',agentId:'AGT-006'},{id:'s5',name:'공시업무규정 검색 에이전트',type:'agent',agentId:'AGT-001'}]},
  {id:'WF-003',name:'계약 검토 승인 프로세스',desc:'계약서 업로드 → AI 검토 → 리스크 분류 → HITL 승인',status:'Stopped',creator:'최민수',created:'2026-02-05',lastRun:'2026-02-10 11:20',runs24h:0,successRate:100.0,protocol:'A2A',hitl:true,
    steps:[{id:'s1',name:'계약서 업로드',type:'trigger',agentId:null},{id:'s2',name:'계약서 검토 에이전트',type:'agent',agentId:'AGT-004'},{id:'s3',name:'리스크 레벨 분기',type:'condition',agentId:null},{id:'s4',name:'HITL 법무팀 검토',type:'hitl',agentId:null},{id:'s5',name:'승인 요청 발송',type:'action',agentId:null}]},
  {id:'WF-004',name:'회계전표 자동화 파이프라인',desc:'업무 지시 → ERP 데이터 조회 → 전표 작성 → 승인 (Actionable AI)',status:'Running',creator:'한서윤',created:'2026-02-10',lastRun:'2026-02-14 08:30',runs24h:23,successRate:96.5,protocol:'MCP+A2A',hitl:true,
    steps:[{id:'s1',name:'업무 지시 수신',type:'trigger',agentId:null},{id:'s2',name:'MCP-ERPConnector',type:'mcp',agentId:null},{id:'s3',name:'회계전표 자동 작성',type:'agent',agentId:'AGT-008'},{id:'s4',name:'금액 ≥ 100만원',type:'condition',agentId:null},{id:'s5',name:'HITL 결재 요청',type:'hitl',agentId:null},{id:'s6',name:'ERP 전표 등록',type:'action',agentId:null}]},
];

// ==================== HELPER COMPONENTS ====================
const Breadcrumb = ({path}) => (
  <div className="flex items-center space-x-1.5 text-sm text-gray-500 mb-5">
    <Home size={14} className="text-gray-400"/>
    {(path||[]).map((item,idx)=>(
      <React.Fragment key={idx}>
        <ChevronRight size={14} className="text-gray-300"/>
        <span className={idx===path.length-1?"font-semibold text-gray-800":"hover:text-blue-600 cursor-pointer"}>{item}</span>
      </React.Fragment>
    ))}
  </div>
);

const StatusBadge = ({status}) => {
  const map = {
    'Running':'bg-green-100 text-green-700','Healthy':'bg-green-100 text-green-700','Online':'bg-green-100 text-green-700',
    '학습 완료':'bg-green-100 text-green-700','완료':'bg-green-100 text-green-700','배포':'bg-blue-100 text-blue-700',
    'Stopped':'bg-gray-100 text-gray-600','Offline':'bg-gray-100 text-gray-600','취소됨':'bg-gray-200 text-gray-600',
    '배포중지':'bg-gray-100 text-gray-600','학습 중':'bg-blue-100 text-blue-700 animate-pulse','실행 중':'bg-blue-100 text-blue-700',
    '중지됨':'bg-gray-100 text-gray-600','오류 발생':'bg-red-100 text-red-700','대기 중':'bg-yellow-100 text-yellow-700',
    'Warning':'bg-yellow-100 text-yellow-700','차단':'bg-red-100 text-red-700','경고':'bg-yellow-100 text-yellow-700',
    'Restarting':'bg-purple-100 text-purple-700 animate-pulse','삭제됨':'bg-red-50 text-red-600',
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${map[status]||'bg-gray-100 text-gray-600'}`}>{status}</span>;
};

const Modal = ({isOpen,onClose,title,children,size='md'}) => {
  if(!isOpen) return null;
  const s = {sm:'max-w-md',md:'max-w-2xl',lg:'max-w-4xl',xl:'max-w-6xl'};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${s[size]} max-h-[90vh] flex flex-col`} onClick={e=>e.stopPropagation()}>
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><X size={20}/></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

const SemiGauge = ({value,label,unit='%',color='#22c55e'}) => {
  const pct = Math.min(value/100,1);
  const r=60, cx=80, cy=75;
  const startAngle=-180, endAngle=0;
  const range = endAngle-startAngle;
  const valAngle = startAngle + range*pct;
  const toRad=a=>a*Math.PI/180;
  const arcPath=(start,end)=>{
    const x1=cx+r*Math.cos(toRad(start)),y1=cy+r*Math.sin(toRad(start));
    const x2=cx+r*Math.cos(toRad(end)),y2=cy+r*Math.sin(toRad(end));
    const large=end-start>180?1:0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };
  return (
    <div className="bg-white rounded-xl border p-5 flex flex-col items-center">
      <div className="text-sm text-gray-500 mb-2 font-medium">{label}</div>
      <svg width="160" height="100" viewBox="0 0 160 100">
        <path d={arcPath(-180,0)} fill="none" stroke="#e5e7eb" strokeWidth="10" strokeLinecap="round"/>
        {pct>0 && <path d={arcPath(-180,valAngle)} fill="none" stroke={pct>0.8?'#ef4444':pct>0.6?'#f59e0b':color} strokeWidth="10" strokeLinecap="round"/>}
        <text x={cx} y={cy+5} textAnchor="middle" className="text-2xl font-bold" style={{fontSize:'22px',fill:pct>0.8?'#ef4444':pct>0.6?'#f59e0b':color}}>
          {typeof value==='number'?value.toFixed(value<10?2:1):value}{unit}
        </text>
      </svg>
    </div>
  );
};

const PageShell = ({breadcrumb,title,sub,action,children}) => (
  <div className="p-7 h-full overflow-y-auto animate-in slide-in-from-bottom-2 duration-200">
    <Breadcrumb path={breadcrumb}/>
    {(title||action) && (
      <div className="flex justify-between items-start mb-6 pb-5 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <div className="w-1 h-8 bg-blue-600 rounded-full mt-0.5 shrink-0"/>
          <div>
            <h2 className="text-[22px] font-black text-gray-900 leading-tight">{title}</h2>
            {sub && <p className="text-sm text-slate-500 font-medium mt-0.5">{sub}</p>}
          </div>
        </div>
        {action && <div className="shrink-0 ml-4">{action}</div>}
      </div>
    )}
    {children}
  </div>
);

// ==================== DASHBOARD PAGES ====================
const SystemDashboard = () => {
  const [selectedNode,setSelectedNode]=useState(null);
  return (
    <PageShell breadcrumb={['대시보드','시스템']}>
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-lg font-bold">클러스터 리소스</h3>
        <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded border">현재</span>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-8">
        <SemiGauge value={5.32} label="Cluster CPU usage"/>
        <SemiGauge value={35.9} label="Cluster Memory Usage"/>
        <SemiGauge value={26.5} label="GPU Power Usage (AVG.)" unit=" W"/>
        <SemiGauge value={58.4} label="Cluster Filesystem"/>
      </div>
      <h3 className="text-lg font-bold mb-2">서버 정보</h3>
      <div className="bg-white rounded-xl border overflow-hidden mb-8">
        <div className="px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-600">Node Information</div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase"><tr>
            <th className="px-4 py-3 text-left">nodename</th><th className="px-4 py-3 text-left">instance</th>
            <th className="px-4 py-3 text-left">OS</th><th className="px-4 py-3 text-left">Version</th>
            <th className="px-4 py-3 text-left">Release</th><th className="px-4 py-3 text-right">CPU Usage(%)</th>
            <th className="px-4 py-3 text-right">MEM Usage(%)</th>
          </tr></thead>
          <tbody className="divide-y">{MOCK_NODES.map((n,i)=>(
            <tr key={i} className="hover:bg-gray-50 cursor-pointer" onClick={()=>setSelectedNode(n)}>
              <td className="px-4 py-3 font-medium">{n.name}</td><td className="px-4 py-3 text-gray-500">{n.instance}</td>
              <td className="px-4 py-3">{n.os}</td><td className="px-4 py-3">{n.version}</td>
              <td className="px-4 py-3 text-gray-500 text-xs">{n.release}</td>
              <td className="px-4 py-3 text-right">{n.cpu}</td><td className="px-4 py-3 text-right">{n.mem}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold">파드 정보</h3>
        <div className="flex space-x-1">{['1h','6h','24h','7d'].map(t=><button key={t} className="px-2.5 py-1 text-xs rounded border hover:bg-blue-50 hover:text-blue-600">{t}</button>)}</div>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50 text-xs text-gray-500"><tr>
          <th className="px-4 py-2 text-left">Pod Name</th><th className="px-4 py-2 text-left">Namespace</th><th className="px-4 py-2 text-right">CPU</th><th className="px-4 py-2 text-right">Memory</th><th className="px-4 py-2 text-left">Status</th>
        </tr></thead><tbody className="divide-y">
          {[{n:'genos-api-7f8b9c-x2k4p',ns:'production',cpu:'120m',mem:'256Mi',s:'Running'},{n:'llm-serving-gpt-oss-0',ns:'serving',cpu:'4000m',mem:'32Gi',s:'Running'},{n:'embedding-worker-1',ns:'training',cpu:'2000m',mem:'8Gi',s:'Running'},{n:'vector-db-milvus-0',ns:'data',cpu:'500m',mem:'4Gi',s:'Running'},{n:'scheduler-cron-abc12',ns:'system',cpu:'50m',mem:'128Mi',s:'Completed'}].map((p,i)=>(
            <tr key={i} className="hover:bg-gray-50"><td className="px-4 py-2 font-mono text-xs">{p.n}</td><td className="px-4 py-2 text-xs">{p.ns}</td><td className="px-4 py-2 text-right text-xs">{p.cpu}</td><td className="px-4 py-2 text-right text-xs">{p.mem}</td><td className="px-4 py-2"><StatusBadge status={p.s}/></td></tr>
          ))}
        </tbody></table>
      </div>
      <Modal isOpen={!!selectedNode} onClose={()=>setSelectedNode(null)} title={`${selectedNode?.name} 상세 정보`} size="lg">
        {selectedNode&&<div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg"><div className="text-xs text-gray-400">CPU</div><div className="font-bold text-lg">{selectedNode.cpu}%</div></div>
            <div className="bg-gray-50 p-4 rounded-lg"><div className="text-xs text-gray-400">Memory</div><div className="font-bold text-lg">{selectedNode.mem}%</div></div>
            <div className="bg-gray-50 p-4 rounded-lg"><div className="text-xs text-gray-400">OS</div><div className="font-bold">{selectedNode.os} {selectedNode.version}</div></div>
          </div>
          <div className="bg-gray-900 text-green-400 font-mono text-xs p-4 rounded-lg h-48 overflow-y-auto">
            <div className="text-gray-500 border-b border-gray-700 pb-1 mb-2">PID USER PR NI VIRT RES SHR S %CPU %MEM COMMAND</div>
            <div>1234 root 20 0 16.2g 4.1g 124m S 12.0 1.6 python3 train.py</div>
            <div>1452 redis 20 0 4.2g 1.2g 42m S 4.0 0.5 redis-server</div>
            <div>1102 root 20 0 220m 45m 12m S 1.0 0.0 dockerd</div>
          </div>
        </div>}
      </Modal>
    </PageShell>
  );
};

const ServiceDashboard = () => {
  const toast=useToast();
  const [svcs,setSvcs]=useState([
    {id:1,name:'인증 서비스 (SSO)',desc:'사용자 통합 인증',status:'Healthy',up:'14d 2h',cpu:'12%',mem:'256MB',port:8443},
    {id:2,name:'모델 서빙 API',desc:'LLM 추론 엔드포인트',status:'Healthy',up:'14d 2h',cpu:'68%',mem:'32GB',port:8080},
    {id:3,name:'벡터 DB 서비스',desc:'RAG 검색 엔진',status:'Healthy',up:'14d 2h',cpu:'24%',mem:'4GB',port:19530},
    {id:4,name:'로그 수집기',desc:'시스템/감사 로그',status:'Healthy',up:'14d 2h',cpu:'5%',mem:'512MB',port:5044},
    {id:5,name:'알림 서비스',desc:'Slack/Email 연동',status:'Warning',up:'14d 2h',cpu:'8%',mem:'128MB',port:9090},
    {id:6,name:'작업 스케줄러',desc:'배치 작업 관리',status:'Healthy',up:'14d 2h',cpu:'3%',mem:'256MB',port:8090},
  ]);
  const [detail,setDetail]=useState(null);
  const restart=i=>{setSvcs(p=>p.map((s,j)=>j===i?{...s,status:'Restarting'}:s));setTimeout(()=>setSvcs(p=>p.map((s,j)=>j===i?{...s,status:'Healthy'}:s)),2000);toast('서비스 재시작 중...','info');};
  const healthy=svcs.filter(s=>s.status==='Healthy').length;
  return (
    <PageShell breadcrumb={['대시보드','서비스']} title="서비스 상태 모니터링">
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[{l:'전체 서비스',v:svcs.length,c:'bg-blue-50 text-blue-700'},{l:'정상',v:healthy,c:'bg-green-50 text-green-700'},{l:'주의',v:svcs.length-healthy,c:'bg-yellow-50 text-yellow-700'}].map((s,i)=>(
          <div key={i} className={`p-4 rounded-xl ${s.c}`}><div className="text-2xl font-bold">{s.v}</div><div className="text-xs mt-1 opacity-80">{s.l}</div></div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">{svcs.map((s,i)=>(
        <div key={s.id} className="bg-white p-5 rounded-xl border hover:border-blue-300 transition-all cursor-pointer" onClick={()=>setDetail(s)}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${s.status==='Healthy'?'bg-green-500':s.status==='Warning'?'bg-yellow-500':'bg-purple-500 animate-pulse'}`}/>
              <div><div className="font-bold text-sm">{s.name}</div><div className="text-xs text-gray-500">{s.desc}</div></div>
            </div>
            <StatusBadge status={s.status}/>
          </div>
          <div className="flex justify-between items-end pt-3 border-t">
            <span className="text-xs text-gray-400 font-mono">Up: {s.up}</span>
            <button onClick={e=>{e.stopPropagation();restart(i);}} disabled={s.status==='Restarting'} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50">
              <RotateCcw size={14} className={s.status==='Restarting'?'animate-spin':''}/>
            </button>
          </div>
        </div>
      ))}</div>
      <Modal isOpen={!!detail} onClose={()=>setDetail(null)} title={detail?.name} size="md">
        {detail&&<div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">{[['CPU 사용률',detail.cpu],['메모리',detail.mem],['포트',detail.port],['가동시간',detail.up]].map(([k,v],i)=>(
            <div key={i} className="bg-gray-50 p-3 rounded-lg"><div className="text-xs text-gray-400">{k}</div><div className="font-medium">{v}</div></div>
          ))}</div>
          <div><StatusBadge status={detail.status}/></div>
        </div>}
      </Modal>
    </PageShell>
  );
};

const GpuDashboard = () => {
  const [detailGpu,setDetailGpu]=useState(null);
  const allGpus=MOCK_GPU_NODES.flatMap(n=>n.gpus);
  const avgUtil=Math.round(allGpus.reduce((a,g)=>a+g.util,0)/allGpus.length);
  const avgTemp=Math.round(allGpus.reduce((a,g)=>a+g.temp,0)/allGpus.length);
  const overloaded=allGpus.filter(g=>g.util>90).length;
  return (
    <PageShell breadcrumb={['대시보드','GPU']} title="GPU 클러스터">
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[{l:'총 GPU',v:allGpus.length,c:'bg-blue-50 text-blue-700'},{l:'평균 사용률',v:`${avgUtil}%`,c:'bg-green-50 text-green-700'},{l:'평균 온도',v:`${avgTemp}°C`,c:'bg-orange-50 text-orange-700'},{l:'과부하',v:overloaded,c:overloaded>0?'bg-red-50 text-red-700':'bg-gray-50 text-gray-700'}].map((s,i)=>(
          <div key={i} className={`p-4 rounded-xl ${s.c}`}><div className="text-2xl font-bold">{s.v}</div><div className="text-xs mt-1 opacity-80">{s.l}</div></div>
        ))}
      </div>
      <div className="space-y-6">{MOCK_GPU_NODES.map(node=>(
        <div key={node.id} className="bg-white rounded-xl border overflow-hidden">
          <div className="px-5 py-4 bg-gray-50 border-b flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Cpu className="text-gray-500" size={20}/>
              <div><h3 className="font-bold">{node.name}</h3><p className="text-xs text-gray-500">{node.model} x{node.count} ({node.memory})</p></div>
            </div>
          </div>
          <div className="p-5 grid grid-cols-4 gap-4">{node.gpus.map(gpu=>(
            <div key={gpu.id} className="bg-gray-50 rounded-lg p-4 border hover:border-blue-300 transition-colors cursor-pointer" onClick={()=>setDetailGpu({...gpu,node:node.name,model:node.model})}>
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-sm">GPU {gpu.id}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${gpu.util>90?'bg-red-100 text-red-600':'bg-green-100 text-green-600'}`}>{gpu.util>90?'과부하':'정상'}</span>
              </div>
              <div className="mb-3"><div className="flex justify-between text-xs text-gray-500 mb-1"><span>Util</span><span>{gpu.util}%</span></div>
                <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{width:`${gpu.util}%`}}/></div></div>
              <div className="mb-3"><div className="flex justify-between text-xs text-gray-500 mb-1"><span>VRAM</span><span>{gpu.memUtil}%</span></div>
                <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-purple-500 h-1.5 rounded-full transition-all" style={{width:`${gpu.memUtil}%`}}/></div></div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2 rounded border text-center"><span className="text-gray-400 block">온도</span><span className={`font-bold ${gpu.temp>80?'text-red-500':''}`}>{gpu.temp}°C</span></div>
                <div className="bg-white p-2 rounded border text-center"><span className="text-gray-400 block">전력</span><span className="font-bold">{gpu.power}W</span></div>
              </div>
            </div>
          ))}</div>
        </div>
      ))}</div>
      <Modal isOpen={!!detailGpu} onClose={()=>setDetailGpu(null)} title={`GPU ${detailGpu?.id} 상세`} size="md">
        {detailGpu&&<div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">{[['노드',detailGpu.node],['모델',detailGpu.model],['GPU ID',detailGpu.id],['사용률',`${detailGpu.util}%`],['VRAM',`${detailGpu.memUtil}%`],['온도',`${detailGpu.temp}°C`],['전력',`${detailGpu.power}W`]].map(([k,v],i)=>(
            <div key={i} className="bg-gray-50 p-3 rounded-lg"><div className="text-xs text-gray-400">{k}</div><div className="font-medium">{v}</div></div>
          ))}</div>
        </div>}
      </Modal>
    </PageShell>
  );
};

const DashboardTrainer = () => {
  const [period,setPeriod]=useState('주간');
  return (
    <PageShell breadcrumb={['대시보드','트레이너']} title="학습 작업 현황">
      <div className="flex space-x-1 mb-4">{['일간','주간','월간'].map(p=>(
        <button key={p} onClick={()=>setPeriod(p)} className={`px-4 py-1.5 text-sm rounded-lg ${period===p?'bg-blue-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{p}</button>
      ))}</div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="font-bold mb-4">{period} 학습 요약</h3>
          <div className="space-y-3">
            {[{label:'완료된 작업',count:period==='일간'?5:period==='주간'?24:96,color:'text-blue-700 bg-blue-50'},{label:'실패한 작업',count:period==='일간'?0:period==='주간'?2:8,color:'text-red-600 bg-red-50'},{label:'대기 중 작업',count:period==='일간'?1:period==='주간'?3:5,color:'text-yellow-600 bg-yellow-50'}].map((s,i)=>(
              <div key={i} className={`flex justify-between items-center p-4 rounded-lg border ${s.color}`}>
                <span className="text-sm font-medium">{s.label}</span><span className="font-bold text-lg">{s.count}건</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="font-bold mb-4">리소스 배분 현황</h3>
          <div className="flex items-center justify-center space-x-8 py-4">
            <div className="relative w-40 h-40 rounded-full" style={{background:'conic-gradient(#3b82f6 0% 60%, #8b5cf6 60% 80%, #10b981 80% 95%, #e2e8f0 95% 100%)'}}>
              <div className="absolute inset-0 m-auto w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center shadow-inner"><span className="text-2xl font-bold">95%</span><span className="text-xs text-gray-500">Total</span></div>
            </div>
            <div className="space-y-3 text-sm">
              {[{l:'LLM 학습',v:60,c:'#3b82f6'},{l:'RAG 임베딩',v:20,c:'#8b5cf6'},{l:'추론',v:15,c:'#10b981'},{l:'대기',v:5,c:'#e2e8f0'}].map((d,i)=>(
                <div key={i} className="flex items-center"><span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor:d.c}}/><span className="text-gray-500 w-20">{d.l}</span><span className="font-bold">{d.v}%</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <h3 className="font-bold mb-3">최근 학습 작업</h3>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50 text-xs text-gray-500"><tr>
          <th className="px-4 py-2 text-left">Job ID</th><th className="px-4 py-2 text-left">모델</th><th className="px-4 py-2 text-left">유형</th><th className="px-4 py-2 text-left">시작</th><th className="px-4 py-2 text-left">상태</th>
        </tr></thead><tbody className="divide-y">
          {[{id:'JOB-992',m:'GPT-OSS-120B',t:'LoRA',d:'02-10 14:30',s:'학습 중'},{id:'JOB-991',m:'Llama-3-Kor',t:'QLoRA',d:'02-09 09:00',s:'학습 완료'},{id:'VLM-102',m:'InternVL-2-8B',t:'VLM',d:'02-10 10:00',s:'학습 중'},{id:'EMB-003',m:'KoE5-large',t:'임베딩',d:'02-08 16:00',s:'학습 완료'}].map(j=>(
            <tr key={j.id} className="hover:bg-gray-50"><td className="px-4 py-2 font-mono text-xs">{j.id}</td><td className="px-4 py-2 font-medium">{j.m}</td><td className="px-4 py-2">{j.t}</td><td className="px-4 py-2 text-gray-500 text-xs">{j.d}</td><td className="px-4 py-2"><StatusBadge status={j.s}/></td></tr>
          ))}
        </tbody></table>
      </div>
    </PageShell>
  );
};

// ==================== DEV PAGES ====================
const DatasetPage = () => {
  const toast=useToast();
  const [datasets,setDatasets]=useState([
    {id:1,n:'Notice_Guidelines_QA_v1',d:'공시 규정 QA 데이터셋',t:'JSONL',s:'124MB',c:'15,000',date:'2026-02-10'},
    {id:2,n:'Maintenance_Manual_Corpus',d:'장비 유지보수 매뉴얼',t:'TXT',s:'512MB',c:'N/A',date:'2026-02-09'},
    {id:3,n:'Employee_Inquiry_Logs',d:'임직원 질의 로그',t:'CSV',s:'45MB',c:'8,200',date:'2026-02-08'},
    {id:4,n:'Gemma_Instruction_Tuning',d:'Gemma 한국어 인스트럭션',t:'JSONL',s:'230MB',c:'25,000',date:'2026-02-07'},
    {id:5,n:'EXAONE_Finance_Report',d:'재무 보고서 요약 학습',t:'Parquet',s:'1.2GB',c:'5,000',date:'2026-02-06'},
  ]);
  const [search,setSearch]=useState('');const [showCreate,setShowCreate]=useState(false);const [detail,setDetail]=useState(null);const [confirmDel,setConfirmDel]=useState(null);
  const [form,setForm]=useState({name:'',desc:'',type:'JSONL'});
  const filtered=datasets.filter(d=>d.n.toLowerCase().includes(search.toLowerCase())||d.d.includes(search));
  return (
    <PageShell breadcrumb={['데이터','데이터셋']} title="데이터셋 관리" action={<button onClick={()=>setShowCreate(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"><Plus size={16} className="mr-1"/>데이터셋 생성</button>}>
      <div className="relative max-w-sm mb-4"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="데이터셋 검색..." className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/><Search size={16} className="absolute left-3 top-2.5 text-gray-400"/></div>
      <div className="grid grid-cols-3 gap-4">{filtered.map(d=>(
        <div key={d.id} className="bg-white p-5 rounded-xl border hover:border-blue-300 cursor-pointer transition-all" onClick={()=>setDetail(d)}>
          <div className="flex justify-between items-start mb-3"><div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg"><Database size={20}/></div><span className="text-xs text-gray-400">{d.date}</span></div>
          <h3 className="font-bold text-sm mb-1">{d.n}</h3>
          <p className="text-xs text-gray-500 mb-3 h-8">{d.d}</p>
          <div className="flex space-x-1.5 text-xs">{[d.t,d.s,d.c+' items'].map((t,j)=><span key={j} className="bg-gray-100 px-2 py-0.5 rounded">{t}</span>)}</div>
        </div>
      ))}</div>
      <Modal isOpen={showCreate} onClose={()=>setShowCreate(false)} title="데이터셋 생성" size="md">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">이름</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div><label className="block text-sm font-medium mb-1">설명</label><input value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div><label className="block text-sm font-medium mb-1">유형</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>JSONL</option><option>CSV</option><option>TXT</option><option>Parquet</option></select></div>
          <button onClick={()=>{if(!form.name)return;setDatasets(p=>[{id:Date.now(),n:form.name,d:form.desc,t:form.type,s:'0MB',c:'0',date:'2026-02-11'},...p]);setShowCreate(false);setForm({name:'',desc:'',type:'JSONL'});toast('데이터셋이 생성되었습니다');}} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm">생성</button>
        </div>
      </Modal>
      <Modal isOpen={!!detail} onClose={()=>setDetail(null)} title={detail?.n} size="lg">
        {detail&&<div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">{[['유형',detail.t],['크기',detail.s],['건수',detail.c],['생성일',detail.date],['설명',detail.d]].map(([k,v],i)=>(
            <div key={i} className={`bg-gray-50 p-3 rounded-lg ${i===4?'col-span-2':''}`}><div className="text-xs text-gray-400">{k}</div><div className="font-medium">{v}</div></div>
          ))}</div>
          <button onClick={()=>{setConfirmDel(detail);setDetail(null);}} className="w-full bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-100">삭제</button>
        </div>}
      </Modal>
      <ConfirmDialog isOpen={!!confirmDel} onClose={()=>setConfirmDel(null)} onConfirm={()=>{setDatasets(p=>p.filter(x=>x.id!==confirmDel.id));setConfirmDel(null);toast('데이터셋이 삭제되었습니다','info');}} title="데이터셋 삭제" message={`'${confirmDel?.n}'을(를) 삭제하시겠습니까?`} confirmText="삭제" danger/>
    </PageShell>
  );
};

const VectorDbPage = () => {
  const toast=useToast();
  const [query,setQuery]=useState('');const [results,setResults]=useState(null);const [searching,setSearching]=useState(false);
  const [collections]=useState([
    {name:'safety_regulations',vectors:'850K',dim:1024,status:'Active',updated:'2026-02-10'},
    {name:'maintenance_manual',vectors:'420K',dim:1024,status:'Active',updated:'2026-02-09'},
    {name:'employee_qa_logs',vectors:'680K',dim:768,status:'Active',updated:'2026-02-10'},
    {name:'financial_reports',vectors:'210K',dim:1024,status:'Active',updated:'2026-02-08'},
    {name:'training_materials',vectors:'240K',dim:768,status:'Building',updated:'2026-02-11'},
  ]);
  const doSearch=()=>{if(!query.trim())return;setSearching(true);setTimeout(()=>{setResults([
    {id:'vec_8a1',score:0.92,content:'...본 규정은 한국부동산원의 부동산 가격공시 업무 수행에 필요한 사항을 규정함을 목적으로 한다...'},
    {id:'vec_3b2',score:0.88,content:'...제 2 조 (적용범위) 이 규정은 공사의 전 임직원 및 사업장 내 협력업체에 적용하며...'},
    {id:'vec_9c3',score:0.75,content:'...표준지 현장조사는 연 1회 정기 실시를 원칙으로 하며...'},
  ]);setSearching(false);},800);};
  return (
    <PageShell breadcrumb={['데이터','벡터 DB']}>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border"><div className="text-3xl font-bold mb-1">2.4M</div><div className="text-sm text-gray-500">총 벡터 수</div></div>
        <div className="bg-white p-5 rounded-xl border"><div className="text-3xl font-bold mb-1">{collections.length}</div><div className="text-sm text-gray-500">활성 컬렉션</div></div>
        <div className="bg-white p-5 rounded-xl border"><div className="text-3xl font-bold mb-1">45ms</div><div className="text-sm text-gray-500">평균 쿼리 지연</div></div>
      </div>
      <div className="bg-white rounded-xl border p-5 mb-6">
        <h3 className="font-bold mb-3 flex items-center"><Search size={18} className="mr-2 text-blue-600"/>벡터 검색 시뮬레이터</h3>
        <div className="flex space-x-2 mb-4">
          <input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doSearch()} placeholder="테스트할 검색어 입력..." className="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <button onClick={doSearch} disabled={searching} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">{searching?'검색 중...':'검색'}</button>
        </div>
        {results&&<div className="space-y-2">{results.map((r,i)=>(
          <div key={i} className="bg-gray-50 border rounded-lg p-3 hover:border-blue-300">
            <div className="flex justify-between mb-1"><span className="text-xs font-mono text-gray-500">{r.id}</span><span className="text-xs font-bold text-blue-600">유사도: {r.score}</span></div>
            <p className="text-sm text-gray-700">{r.content}</p>
          </div>
        ))}</div>}
      </div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold">컬렉션 관리</h3>
        <button onClick={()=>toast('컬렉션이 생성되었습니다')} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center"><Plus size={14} className="mr-1"/>컬렉션 생성</button>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50 text-xs text-gray-500 uppercase"><tr>
          <th className="px-4 py-3 text-left">컬렉션명</th><th className="px-4 py-3 text-right">벡터 수</th><th className="px-4 py-3 text-right">차원</th><th className="px-4 py-3 text-left">상태</th><th className="px-4 py-3 text-left">최근 업데이트</th>
        </tr></thead><tbody className="divide-y">{collections.map((c,i)=>(
          <tr key={i} className="hover:bg-gray-50"><td className="px-4 py-3 font-mono text-sm font-medium">{c.name}</td><td className="px-4 py-3 text-right">{c.vectors}</td><td className="px-4 py-3 text-right">{c.dim}</td><td className="px-4 py-3"><StatusBadge status={c.status}/></td><td className="px-4 py-3 text-gray-500 text-xs">{c.updated}</td></tr>
        ))}</tbody></table>
      </div>
    </PageShell>
  );
};

const AutoLoadPage = () => {
  const toast=useToast();
  const [sources,setSources]=useState([
    {id:1,n:'ERP_HR_DB',t:'Oracle DB',s:'매일 02:00',l:'2026-02-10 02:00',st:'Healthy',active:true},
    {id:2,n:'SharePoint_Docs',t:'API Crawler',s:'매시간',l:'2026-02-10 11:00',st:'Healthy',active:true},
    {id:3,n:'Legacy_File_Server',t:'SMB Mount',s:'매주 (일)',l:'2026-02-09 00:00',st:'Warning',active:true},
    {id:4,n:'IoT_Sensor_Logs',t:'MQTT Stream',s:'실시간',l:'실행 중',st:'Healthy',active:true},
  ]);
  const [showAdd,setShowAdd]=useState(false);const [confirmRun,setConfirmRun]=useState(null);
  const [form,setForm]=useState({name:'',type:'Oracle DB',schedule:'매일 02:00'});
  return (
    <PageShell breadcrumb={['데이터','자동 적재']} title="데이터 자동 적재 설정" action={<button onClick={()=>setShowAdd(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"><Plus size={16} className="mr-1"/>소스 추가</button>}>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50 text-xs text-gray-500 uppercase"><tr>
          <th className="px-4 py-3 text-left">소스명</th><th className="px-4 py-3 text-left">유형</th><th className="px-4 py-3 text-left">주기</th><th className="px-4 py-3 text-left">최근 실행</th><th className="px-4 py-3 text-left">상태</th><th className="px-4 py-3 text-center">활성</th><th className="px-4 py-3 text-center">액션</th>
        </tr></thead><tbody className="divide-y">{sources.map(r=>(
          <tr key={r.id} className={`hover:bg-gray-50 ${!r.active?'opacity-50':''}`}>
            <td className="px-4 py-3 font-medium">{r.n}</td><td className="px-4 py-3">{r.t}</td><td className="px-4 py-3">{r.s}</td><td className="px-4 py-3 text-gray-500">{r.l}</td><td className="px-4 py-3"><StatusBadge status={r.st}/></td>
            <td className="px-4 py-3 text-center"><ToggleSwitch on={r.active} onClick={()=>{setSources(p=>p.map(x=>x.id===r.id?{...x,active:!x.active}:x));toast(r.active?`${r.n} 비활성화`:`${r.n} 활성화`,r.active?'info':'success');}}/></td>
            <td className="px-4 py-3 text-center"><button onClick={()=>setConfirmRun(r)} className="text-xs text-blue-600 hover:underline">지금 실행</button></td>
          </tr>
        ))}</tbody></table>
      </div>
      <Modal isOpen={showAdd} onClose={()=>setShowAdd(false)} title="소스 추가" size="md">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">소스명</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">유형</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>Oracle DB</option><option>API Crawler</option><option>SMB Mount</option><option>MQTT Stream</option><option>S3 Bucket</option></select></div>
            <div><label className="block text-sm font-medium mb-1">주기</label><select value={form.schedule} onChange={e=>setForm({...form,schedule:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>실시간</option><option>매시간</option><option>매일 02:00</option><option>매주 (일)</option></select></div>
          </div>
          <button onClick={()=>{if(!form.name)return;setSources(p=>[...p,{id:Date.now(),n:form.name,t:form.type,s:form.schedule,l:'-',st:'Healthy',active:true}]);setShowAdd(false);setForm({name:'',type:'Oracle DB',schedule:'매일 02:00'});toast('소스가 추가되었습니다');}} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm">추가</button>
        </div>
      </Modal>
      <ConfirmDialog isOpen={!!confirmRun} onClose={()=>setConfirmRun(null)} onConfirm={()=>{setSources(p=>p.map(x=>x.id===confirmRun.id?{...x,l:'실행 중',st:'Healthy'}:x));setConfirmRun(null);toast(`${confirmRun?.n} 적재가 시작되었습니다`);}} title="지금 실행" message={`'${confirmRun?.n}'을(를) 즉시 실행하시겠습니까?`} confirmText="실행"/>
    </PageShell>
  );
};

const CodespacePage = () => {
  const toast=useToast();
  const [spaces,setSpaces]=useState(MOCK_CODESPACES.map(c=>({...c})));
  const [showCreate,setShowCreate]=useState(false);const [confirmDel,setConfirmDel]=useState(null);
  const [form,setForm]=useState({name:'',image:'pytorch/pytorch:2.1-cuda12',gpu:'A100 x1'});
  const toggleStatus=(id)=>{setSpaces(p=>p.map(c=>{if(c.id!==id)return c;const ns=c.status==='Running'?'Stopped':'Running';toast(ns==='Running'?`${c.name} 시작됨`:`${c.name} 중지됨`,ns==='Running'?'success':'info');return{...c,status:ns};}));};
  return (
    <PageShell breadcrumb={['개발','코드스페이스']} title="코드스페이스" action={<button onClick={()=>setShowCreate(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"><Plus size={16} className="mr-1"/>새 환경 생성</button>}>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50 text-xs text-gray-500 uppercase"><tr>
          <th className="px-4 py-3 text-left">이름</th><th className="px-4 py-3 text-left">Docker 이미지</th><th className="px-4 py-3 text-left">상태</th><th className="px-4 py-3 text-left">GPU</th><th className="px-4 py-3 text-left">생성일</th><th className="px-4 py-3 text-center">액션</th>
        </tr></thead><tbody className="divide-y">{spaces.map(c=>(
          <tr key={c.id} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium">{c.name}</td><td className="px-4 py-3 text-gray-500 font-mono text-xs">{c.image}</td><td className="px-4 py-3"><StatusBadge status={c.status}/></td><td className="px-4 py-3">{c.gpu}</td><td className="px-4 py-3 text-gray-500">{c.created}</td>
            <td className="px-4 py-3 text-center space-x-2">
              <button onClick={()=>toggleStatus(c.id)} className={`text-xs px-2 py-1 rounded ${c.status==='Running'?'bg-orange-50 text-orange-600 hover:bg-orange-100':'bg-green-50 text-green-600 hover:bg-green-100'}`}>{c.status==='Running'?'중지':'시작'}</button>
              <button onClick={()=>setConfirmDel(c)} className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100">삭제</button>
            </td>
          </tr>
        ))}</tbody></table>
      </div>
      <Modal isOpen={showCreate} onClose={()=>setShowCreate(false)} title="새 코드스페이스 생성" size="md">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">이름</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div><label className="block text-sm font-medium mb-1">Docker 이미지</label><select value={form.image} onChange={e=>setForm({...form,image:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>pytorch/pytorch:2.1-cuda12</option><option>tensorflow/tensorflow:2.15-gpu</option><option>jupyter/datascience-notebook</option><option>vllm/vllm-openai:latest</option></select></div>
          <div><label className="block text-sm font-medium mb-1">GPU</label><select value={form.gpu} onChange={e=>setForm({...form,gpu:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>None</option><option>A100 x1</option><option>A100 x2</option><option>A100 x4</option></select></div>
          <button onClick={()=>{if(!form.name)return;setSpaces(p=>[{id:`cs-${Date.now()}`,name:form.name,image:form.image,status:'Stopped',gpu:form.gpu,created:'2026-02-11'},...p]);setShowCreate(false);setForm({name:'',image:'pytorch/pytorch:2.1-cuda12',gpu:'A100 x1'});toast('코드스페이스가 생성되었습니다');}} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm">생성</button>
        </div>
      </Modal>
      <ConfirmDialog isOpen={!!confirmDel} onClose={()=>setConfirmDel(null)} onConfirm={()=>{setSpaces(p=>p.filter(x=>x.id!==confirmDel.id));setConfirmDel(null);toast('코드스페이스가 삭제되었습니다','info');}} title="코드스페이스 삭제" message={`'${confirmDel?.name}'을(를) 삭제하시겠습니까?`} confirmText="삭제" danger/>
    </PageShell>
  );
};

const SharedVolumePage = () => {
  const toast=useToast();
  const [volumes,setVolumes]=useState(MOCK_VOLUMES.map((v,i)=>({...v,id:i+1})));
  const [showCreate,setShowCreate]=useState(false);const [resizeVol,setResizeVol]=useState(null);const [confirmDel,setConfirmDel]=useState(null);
  const [form,setForm]=useState({name:'',size:'100GB',mount:'/mnt/shared/'});const [newSize,setNewSize]=useState('');
  return (
    <PageShell breadcrumb={['개발','공유 볼륨']} title="공유 볼륨 관리" action={<button onClick={()=>setShowCreate(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"><Plus size={16} className="mr-1"/>볼륨 생성</button>}>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50 text-xs text-gray-500 uppercase"><tr>
          <th className="px-4 py-3 text-left">이름</th><th className="px-4 py-3 text-left">크기</th><th className="px-4 py-3 text-left">마운트 경로</th><th className="px-4 py-3 text-left">사용 환경</th><th className="px-4 py-3 text-left">상태</th><th className="px-4 py-3 text-center">액션</th>
        </tr></thead><tbody className="divide-y">{volumes.map(v=>(
          <tr key={v.id} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium">{v.name}</td><td className="px-4 py-3">{v.size}</td><td className="px-4 py-3 font-mono text-xs text-gray-500">{v.mount}</td><td className="px-4 py-3 text-gray-500">{v.usedBy}</td><td className="px-4 py-3"><StatusBadge status={v.status}/></td>
            <td className="px-4 py-3 text-center space-x-2">
              <button onClick={()=>{setResizeVol(v);setNewSize(v.size);}} className="text-xs text-blue-600 hover:underline">리사이즈</button>
              <button onClick={()=>setConfirmDel(v)} className="text-xs text-red-500 hover:underline">삭제</button>
            </td>
          </tr>
        ))}</tbody></table>
      </div>
      <Modal isOpen={showCreate} onClose={()=>setShowCreate(false)} title="볼륨 생성" size="md">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">이름</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">크기</label><select value={form.size} onChange={e=>setForm({...form,size:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>50GB</option><option>100GB</option><option>500GB</option><option>1TB</option><option>5TB</option></select></div>
            <div><label className="block text-sm font-medium mb-1">마운트 경로</label><input value={form.mount} onChange={e=>setForm({...form,mount:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm font-mono"/></div>
          </div>
          <button onClick={()=>{if(!form.name)return;setVolumes(p=>[...p,{id:Date.now(),name:form.name,size:form.size,mount:form.mount,usedBy:'-',status:'Mounted'}]);setShowCreate(false);setForm({name:'',size:'100GB',mount:'/mnt/shared/'});toast('볼륨이 생성되었습니다');}} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm">생성</button>
        </div>
      </Modal>
      <Modal isOpen={!!resizeVol} onClose={()=>setResizeVol(null)} title={`${resizeVol?.name} 리사이즈`} size="sm">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">새 크기</label><select value={newSize} onChange={e=>setNewSize(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm"><option>50GB</option><option>100GB</option><option>500GB</option><option>1TB</option><option>5TB</option><option>10TB</option></select></div>
          <button onClick={()=>{setVolumes(p=>p.map(x=>x.id===resizeVol.id?{...x,size:newSize}:x));setResizeVol(null);toast('볼륨 크기가 변경되었습니다');}} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm">적용</button>
        </div>
      </Modal>
      <ConfirmDialog isOpen={!!confirmDel} onClose={()=>setConfirmDel(null)} onConfirm={()=>{setVolumes(p=>p.filter(x=>x.id!==confirmDel.id));setConfirmDel(null);toast('볼륨이 삭제되었습니다','info');}} title="볼륨 삭제" message={`'${confirmDel?.name}'을(를) 삭제하시겠습니까? 데이터가 영구 삭제됩니다.`} confirmText="삭제" danger/>
    </PageShell>
  );
};

// ==================== MODEL, TRAINER, EVAL, GUARDRAIL ====================
const ModelRegistry = () => {
  const toast=useToast();
  const [models,setModels]=useState(MOCK_MODELS.map(m=>({...m})));
  const [search,setSearch]=useState('');const [showCreate,setShowCreate]=useState(false);const [detail,setDetail]=useState(null);const [confirmAction,setConfirmAction]=useState(null);
  const [form,setForm]=useState({name:'',param:'7B',context:'4K',quant:'FP16'});
  const filtered=models.filter(m=>m.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <PageShell breadcrumb={['모델']} title="모델 레지스트리" action={<button onClick={()=>setShowCreate(true)} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"><Plus size={16} className="mr-1"/>모델 등록</button>}>
      <div className="relative max-w-sm mb-4"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="모델 검색..." className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/><Search size={16} className="absolute left-3 top-2.5 text-gray-400"/></div>
      <div className="space-y-3">{filtered.map(m=>(
        <div key={m.id} className="bg-white p-5 rounded-xl border flex items-center justify-between hover:border-blue-300 transition-all cursor-pointer" onClick={()=>setDetail(m)}>
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-600">AI</div>
            <div><h3 className="font-bold">{m.name}</h3>
              <div className="flex space-x-2 mt-1 text-xs">{[`파라미터: ${m.param}`,`문맥: ${m.context}`,`양자화: ${m.quant}`].map((t,i)=><span key={i} className="bg-gray-100 px-2 py-0.5 rounded border">{t}</span>)}</div>
            </div>
          </div>
          <div className="flex items-center space-x-4" onClick={e=>e.stopPropagation()}>
            <div className="text-right text-sm"><div className="text-xs text-gray-400">로드 노드</div><div className="font-medium">{m.loaded}</div></div>
            <StatusBadge status={m.status}/>
            <button onClick={()=>setConfirmAction({model:m,action:m.status==='Running'?'unload':'load'})} className={`text-xs px-3 py-1.5 rounded font-medium ${m.status==='Running'?'bg-orange-50 text-orange-600 hover:bg-orange-100':'bg-green-50 text-green-600 hover:bg-green-100'}`}>{m.status==='Running'?'언로드':'로드'}</button>
          </div>
        </div>
      ))}</div>
      <Modal isOpen={showCreate} onClose={()=>setShowCreate(false)} title="모델 등록" size="md">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">모델명</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="모델 이름" className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium mb-1">파라미터</label><select value={form.param} onChange={e=>setForm({...form,param:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>7B</option><option>13B</option><option>30B</option><option>70B</option><option>120B</option></select></div>
            <div><label className="block text-sm font-medium mb-1">문맥 길이</label><select value={form.context} onChange={e=>setForm({...form,context:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>4K</option><option>8K</option><option>32K</option><option>128K</option></select></div>
            <div><label className="block text-sm font-medium mb-1">양자화</label><select value={form.quant} onChange={e=>setForm({...form,quant:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>FP16</option><option>INT8</option><option>INT4</option><option>GPTQ</option><option>AWQ</option></select></div>
          </div>
          <button onClick={()=>{if(!form.name)return;setModels(p=>[{id:`model-${Date.now()}`,name:form.name,param:form.param,context:form.context,quant:form.quant,loaded:'-',status:'Stopped'},...p]);setShowCreate(false);setForm({name:'',param:'7B',context:'4K',quant:'FP16'});toast('모델이 등록되었습니다');}} className="w-full bg-gray-800 text-white py-2.5 rounded-lg font-medium text-sm">등록</button>
        </div>
      </Modal>
      <Modal isOpen={!!detail} onClose={()=>setDetail(null)} title={detail?.name} size="lg">
        {detail&&<div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">{[['파라미터',detail.param],['문맥 길이',detail.context],['양자화',detail.quant],['로드 노드',detail.loaded],['상태',detail.status],['ID',detail.id]].map(([k,v],i)=>(
            <div key={i} className="bg-gray-50 p-3 rounded-lg"><div className="text-xs text-gray-400">{k}</div><div className="font-medium">{v}</div></div>
          ))}</div>
        </div>}
      </Modal>
      <ConfirmDialog isOpen={!!confirmAction} onClose={()=>setConfirmAction(null)} onConfirm={()=>{const{model,action}=confirmAction;setModels(p=>p.map(x=>x.id===model.id?{...x,status:action==='load'?'Running':'Stopped',loaded:action==='load'?'gpu-node-01':'-'}:x));setConfirmAction(null);toast(action==='load'?`${model.name} 로드 완료`:`${model.name} 언로드 완료`,action==='load'?'success':'info');}} title={confirmAction?.action==='load'?'모델 로드':'모델 언로드'} message={`${confirmAction?.model?.name}을(를) ${confirmAction?.action==='load'?'로드':'언로드'}하시겠습니까?`} confirmText={confirmAction?.action==='load'?'로드':'언로드'}/>
    </PageShell>
  );
};

const LlmTraining = () => {
  const toast=useToast();
  const [jobs,setJobs]=useState([
    {id:'JOB-992',model:'GPT-OSS-120B',method:'LoRA',dataset:'Maintenance_Manual',progress:45,status:'학습 중',lr:'2e-4',epochs:'3/10',batch:32,gpu:'A100 x8'},
    {id:'JOB-991',model:'Llama-3-Kor',method:'QLoRA',dataset:'Safety_QA_v1',progress:100,status:'학습 완료',lr:'3e-4',epochs:'10/10',batch:16,gpu:'A100 x4'},
    {id:'JOB-989',model:'EXAONE-3.0',method:'Full-FT',dataset:'Finance_Report',progress:0,status:'오류 발생',lr:'1e-5',epochs:'0/5',batch:8,gpu:'A100 x8'},
  ]);
  const [showCreate,setShowCreate]=useState(false);const [detail,setDetail]=useState(null);const [confirmStop,setConfirmStop]=useState(null);
  const [form,setForm]=useState({model:'Llama-3-Kor',method:'QLoRA',dataset:'',lr:'2e-4',epochs:10,batch:16,gpu:'A100 x4'});
  return (
    <PageShell breadcrumb={['트레이너','LLM']} title="LLM 학습 관리" action={<button onClick={()=>setShowCreate(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"><Plus size={16} className="mr-1"/>새 학습 작업</button>}>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50 text-xs text-gray-500 uppercase"><tr>
          <th className="px-4 py-3 text-left">Job ID</th><th className="px-4 py-3 text-left">모델</th><th className="px-4 py-3 text-left">방법</th><th className="px-4 py-3 text-left">데이터셋</th><th className="px-4 py-3 text-left">진행률</th><th className="px-4 py-3 text-left">상태</th><th className="px-4 py-3 text-center">액션</th>
        </tr></thead><tbody className="divide-y">{jobs.map(j=>(
          <tr key={j.id} className="hover:bg-gray-50 cursor-pointer" onClick={()=>setDetail(j)}>
            <td className="px-4 py-3 font-mono text-xs">{j.id}</td><td className="px-4 py-3 font-medium">{j.model}</td><td className="px-4 py-3">{j.method}</td><td className="px-4 py-3 text-gray-500">{j.dataset}</td>
            <td className="px-4 py-3"><div className="flex items-center space-x-2"><div className="w-full bg-gray-200 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${j.status==='오류 발생'?'bg-red-500':j.status==='학습 중'?'bg-blue-500 animate-pulse':'bg-green-500'}`} style={{width:`${j.progress}%`}}/></div><span className="text-xs w-8">{j.progress}%</span></div></td>
            <td className="px-4 py-3"><StatusBadge status={j.status}/></td>
            <td className="px-4 py-3 text-center" onClick={e=>e.stopPropagation()}>
              {j.status==='학습 중'&&<button onClick={()=>setConfirmStop(j)} className="text-xs text-red-500 hover:underline">중지</button>}
              {j.status==='오류 발생'&&<button onClick={()=>{setJobs(p=>p.map(x=>x.id===j.id?{...x,status:'학습 중',progress:1}:x));toast('재학습을 시작합니다');}} className="text-xs text-blue-600 hover:underline">재시도</button>}
            </td>
          </tr>
        ))}</tbody></table>
      </div>
      <Modal isOpen={showCreate} onClose={()=>setShowCreate(false)} title="새 LLM 학습 작업" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">모델</label><select value={form.model} onChange={e=>setForm({...form,model:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>Llama-3-Kor</option><option>GPT-OSS-120B</option><option>EXAONE-3.0</option><option>Solar-10.7B</option><option>Gemma-2-9B</option></select></div>
            <div><label className="block text-sm font-medium mb-1">학습 방법</label><select value={form.method} onChange={e=>setForm({...form,method:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>QLoRA</option><option>LoRA</option><option>Full-FT</option><option>DPO</option><option>RLHF</option></select></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">데이터셋</label><input value={form.dataset} onChange={e=>setForm({...form,dataset:e.target.value})} placeholder="데이터셋 이름" className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div className="grid grid-cols-4 gap-4">
            <div><label className="block text-sm font-medium mb-1">Learning Rate</label><input value={form.lr} onChange={e=>setForm({...form,lr:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm font-mono"/></div>
            <div><label className="block text-sm font-medium mb-1">에폭</label><input type="number" value={form.epochs} onChange={e=>setForm({...form,epochs:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
            <div><label className="block text-sm font-medium mb-1">배치 크기</label><select value={form.batch} onChange={e=>setForm({...form,batch:+e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>8</option><option>16</option><option>32</option><option>64</option></select></div>
            <div><label className="block text-sm font-medium mb-1">GPU</label><select value={form.gpu} onChange={e=>setForm({...form,gpu:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>A100 x2</option><option>A100 x4</option><option>A100 x8</option></select></div>
          </div>
          <button onClick={()=>{setJobs(p=>[{id:`JOB-${993+p.length}`,model:form.model,method:form.method,dataset:form.dataset||'Custom',progress:0,status:'대기 중',lr:form.lr,epochs:`0/${form.epochs}`,batch:form.batch,gpu:form.gpu},...p]);setShowCreate(false);toast('학습 작업이 생성되었습니다');}} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm">생성</button>
        </div>
      </Modal>
      <Modal isOpen={!!detail} onClose={()=>setDetail(null)} title={`${detail?.id} 상세`} size="lg">
        {detail&&<div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">{[['모델',detail.model],['방법',detail.method],['데이터셋',detail.dataset],['Learning Rate',detail.lr],['에폭',detail.epochs],['배치 크기',detail.batch],['GPU',detail.gpu],['진행률',`${detail.progress}%`]].map(([k,v],i)=>(
            <div key={i} className="bg-gray-50 p-3 rounded-lg"><div className="text-xs text-gray-400">{k}</div><div className="font-medium">{v}</div></div>
          ))}</div>
          <div><StatusBadge status={detail.status}/></div>
        </div>}
      </Modal>
      <ConfirmDialog isOpen={!!confirmStop} onClose={()=>setConfirmStop(null)} onConfirm={()=>{setJobs(p=>p.map(x=>x.id===confirmStop.id?{...x,status:'중지됨'}:x));setConfirmStop(null);toast('학습이 중지되었습니다','info');}} title="학습 중지" message={`${confirmStop?.id} 작업을 중지하시겠습니까?`} confirmText="중지" danger/>
    </PageShell>
  );
};

const VlmTraining = () => {
  const toast=useToast();
  const [jobs,setJobs]=useState([
    {id:'VLM-101',model:'LLaVA-1.6-13B',resolution:'336x336',epochs:'10/10',progress:100,status:'학습 완료',dataset:'REB_Image_QA',gpu:'A100 x2',created:'2026-02-08'},
    {id:'VLM-102',model:'InternVL-2-8B',resolution:'448x448',epochs:'4/20',progress:20,status:'학습 중',dataset:'Safety_Image_v2',gpu:'A100 x4',created:'2026-02-10'},
    {id:'VLM-103',model:'Qwen-VL-Chat',resolution:'224x224',epochs:'0/15',progress:0,status:'대기 중',dataset:'Equipment_Manual_Img',gpu:'A100 x2',created:'2026-02-11'},
  ]);
  const [showCreate,setShowCreate]=useState(false);const [detail,setDetail]=useState(null);
  const [form,setForm]=useState({model:'LLaVA-1.6-13B',resolution:'336x336',epochs:10,dataset:'',gpu:'A100 x2'});
  return (
    <PageShell breadcrumb={['트레이너','VLM']} title="시각 언어 모델 (VLM) 학습" action={<button onClick={()=>setShowCreate(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"><Plus size={16} className="mr-1"/>새 학습 작업</button>}>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[{l:'전체 작업',v:jobs.length,c:'bg-blue-50 text-blue-700'},{l:'학습 중',v:jobs.filter(j=>j.status==='학습 중').length,c:'bg-green-50 text-green-700'},{l:'완료',v:jobs.filter(j=>j.status==='학습 완료').length,c:'bg-purple-50 text-purple-700'}].map((s,i)=>(
          <div key={i} className={`p-4 rounded-xl ${s.c}`}><div className="text-2xl font-bold">{s.v}</div><div className="text-xs mt-1 opacity-80">{s.l}</div></div>
        ))}
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50 text-xs text-gray-500 uppercase"><tr>
          <th className="px-4 py-3 text-left">Job ID</th><th className="px-4 py-3 text-left">모델</th><th className="px-4 py-3 text-left">해상도</th><th className="px-4 py-3 text-left">에폭</th><th className="px-4 py-3 text-left">진행률</th><th className="px-4 py-3 text-left">상태</th><th className="px-4 py-3 text-center">액션</th>
        </tr></thead><tbody className="divide-y">{jobs.map(j=>(
          <tr key={j.id} className="hover:bg-gray-50 cursor-pointer" onClick={()=>setDetail(j)}>
            <td className="px-4 py-3 font-mono text-xs">{j.id}</td><td className="px-4 py-3 font-medium">{j.model}</td><td className="px-4 py-3">{j.resolution}</td><td className="px-4 py-3">{j.epochs}</td>
            <td className="px-4 py-3"><div className="flex items-center space-x-2"><div className="w-full bg-gray-200 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${j.status==='학습 완료'?'bg-green-500':j.status==='학습 중'?'bg-blue-500 animate-pulse':'bg-gray-400'}`} style={{width:`${j.progress}%`}}/></div><span className="text-xs text-gray-500 w-8">{j.progress}%</span></div></td>
            <td className="px-4 py-3"><StatusBadge status={j.status}/></td>
            <td className="px-4 py-3 text-center" onClick={e=>e.stopPropagation()}>{j.status==='학습 중'&&<button onClick={()=>{setJobs(p=>p.map(x=>x.id===j.id?{...x,status:'중지됨'}:x));toast('학습이 중지되었습니다','info');}} className="text-xs text-red-500 hover:underline">중지</button>}{j.status==='대기 중'&&<button onClick={()=>{setJobs(p=>p.map(x=>x.id===j.id?{...x,status:'학습 중',progress:5}:x));toast('학습이 시작되었습니다');}} className="text-xs text-blue-600 hover:underline">시작</button>}</td>
          </tr>
        ))}</tbody></table>
      </div>
      <Modal isOpen={showCreate} onClose={()=>setShowCreate(false)} title="새 VLM 학습 작업" size="md">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">모델</label><select value={form.model} onChange={e=>setForm({...form,model:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>LLaVA-1.6-13B</option><option>InternVL-2-8B</option><option>Qwen-VL-Chat</option></select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">해상도</label><select value={form.resolution} onChange={e=>setForm({...form,resolution:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>224x224</option><option>336x336</option><option>448x448</option></select></div>
            <div><label className="block text-sm font-medium mb-1">에폭 수</label><input type="number" value={form.epochs} onChange={e=>setForm({...form,epochs:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">데이터셋</label><input value={form.dataset} onChange={e=>setForm({...form,dataset:e.target.value})} placeholder="데이터셋 이름" className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div><label className="block text-sm font-medium mb-1">GPU</label><select value={form.gpu} onChange={e=>setForm({...form,gpu:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>A100 x2</option><option>A100 x4</option><option>A100 x8</option></select></div>
          <button onClick={()=>{const nj={id:`VLM-${104+jobs.length}`,model:form.model,resolution:form.resolution,epochs:`0/${form.epochs}`,progress:0,status:'대기 중',dataset:form.dataset||'Custom',gpu:form.gpu,created:'2026-02-11'};setJobs(p=>[nj,...p]);setShowCreate(false);toast('VLM 학습 작업이 생성되었습니다');}} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm">생성</button>
        </div>
      </Modal>
      <Modal isOpen={!!detail} onClose={()=>setDetail(null)} title={`${detail?.id} 상세 정보`} size="lg">
        {detail&&<div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">{[['모델',detail.model],['해상도',detail.resolution],['에폭',detail.epochs],['GPU',detail.gpu],['데이터셋',detail.dataset],['생성일',detail.created]].map(([k,v],i)=>(
            <div key={i} className="bg-gray-50 p-3 rounded-lg"><div className="text-xs text-gray-400">{k}</div><div className="font-medium">{v}</div></div>
          ))}</div>
          <div className="bg-gray-50 p-4 rounded-lg"><div className="flex justify-between mb-2"><span className="text-sm font-medium">학습 진행률</span><span className="text-sm font-bold text-blue-600">{detail.progress}%</span></div>
            <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{width:`${detail.progress}%`}}/></div></div>
          <div><StatusBadge status={detail.status}/></div>
        </div>}
      </Modal>
    </PageShell>
  );
};

const EmbeddingPage = () => {
  const toast=useToast();
  const [jobs,setJobs]=useState(MOCK_EMBEDDING_JOBS.map(j=>({...j})));
  const [search,setSearch]=useState('');const [detail,setDetail]=useState(null);const [showCreate,setShowCreate]=useState(false);
  const [form,setForm]=useState({name:'',plan:'Fine-Tune',gpu:'A100 x1'});
  const filtered=jobs.filter(j=>j.name.toLowerCase().includes(search.toLowerCase())||j.creator.includes(search));
  return (
    <PageShell breadcrumb={['트레이너','임베딩']}>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">학습 임베딩 목록</h2>
        <button onClick={()=>setShowCreate(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"><Plus size={16} className="mr-1"/>학습 임베딩 생성</button>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <select className="border rounded-lg px-3 py-2 text-sm bg-white"><option>제목</option><option>제작자</option></select>
        <div className="relative flex-1 max-w-xs"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="검색어를 입력해 주세요" className="pl-9 pr-3 py-2 border rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"/><Search size={16} className="absolute left-3 top-2.5 text-gray-400"/></div>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50 text-xs text-gray-500"><tr>
          <th className="px-4 py-3 text-left">ID</th><th className="px-4 py-3 text-left">제목</th><th className="px-4 py-3 text-left">유형</th>
          <th className="px-4 py-3 text-left">제작자</th><th className="px-4 py-3 text-left">관리 그룹</th><th className="px-4 py-3 text-left">등록일시</th>
          <th className="px-4 py-3 text-left">GPU</th><th className="px-4 py-3 text-center">텐서보드</th><th className="px-4 py-3 text-center">학습 상태</th><th className="px-4 py-3 text-center">액션</th>
        </tr></thead><tbody className="divide-y">{filtered.map(j=>(
          <tr key={j.id} className="hover:bg-gray-50 cursor-pointer" onClick={()=>setDetail(j)}>
            <td className="px-4 py-3 text-gray-500">{j.id}</td><td className="px-4 py-3 font-medium">{j.name}</td><td className="px-4 py-3 text-gray-500">{j.plan}</td>
            <td className="px-4 py-3"><div className="font-medium">{j.creator}</div><div className="text-xs text-gray-400">admin</div></td>
            <td className="px-4 py-3">{j.dept}</td><td className="px-4 py-3 text-gray-500 text-xs font-mono">{j.date}</td>
            <td className="px-4 py-3 text-xs">{j.gpu}</td>
            <td className="px-4 py-3 text-center"><span className={`inline-flex items-center text-xs ${j.tbStatus==='실행 중'?'text-green-600':'text-gray-400'}`}><span className={`w-1.5 h-1.5 rounded-full mr-1 ${j.tbStatus==='실행 중'?'bg-green-500':'bg-gray-400'}`}/>{j.tbStatus}</span></td>
            <td className="px-4 py-3 text-center"><StatusBadge status={j.status}/></td>
            <td className="px-4 py-3 text-center" onClick={e=>e.stopPropagation()}>
              {j.status==='학습 중'&&<button onClick={()=>{setJobs(p=>p.map(x=>x.id===j.id?{...x,status:'중지됨'}:x));toast('학습이 중지되었습니다','info');}} className="text-xs text-red-500 hover:underline">중지</button>}
              {(j.status==='학습 완료'||j.tbStatus==='실행 중')&&<button onClick={()=>toast('텐서보드를 엽니다')} className="text-xs text-blue-600 hover:underline">텐서보드</button>}
            </td>
          </tr>
        ))}</tbody></table>
      </div>
      <Modal isOpen={showCreate} onClose={()=>setShowCreate(false)} title="학습 임베딩 생성" size="md">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">제목</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">유형</label><select value={form.plan} onChange={e=>setForm({...form,plan:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>Fine-Tune</option><option>Pre-Train</option><option>Distillation</option></select></div>
            <div><label className="block text-sm font-medium mb-1">GPU</label><select value={form.gpu} onChange={e=>setForm({...form,gpu:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>A100 x1</option><option>A100 x2</option><option>A100 x4</option></select></div>
          </div>
          <button onClick={()=>{if(!form.name)return;setJobs(p=>[{id:p.length+1,name:form.name,plan:form.plan,creator:'김영빈',dept:'AI혁신TF',date:'2026-02-11',gpu:form.gpu,tbStatus:'정지',status:'대기 중'},...p]);setShowCreate(false);setForm({name:'',plan:'Fine-Tune',gpu:'A100 x1'});toast('임베딩 학습이 생성되었습니다');}} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm">생성</button>
        </div>
      </Modal>
      <Modal isOpen={!!detail} onClose={()=>setDetail(null)} title={detail?.name} size="lg">
        {detail&&<div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">{[['유형',detail.plan],['제작자',detail.creator],['관리 그룹',detail.dept],['GPU',detail.gpu],['등록일',detail.date],['텐서보드',detail.tbStatus]].map(([k,v],i)=>(
            <div key={i} className="bg-gray-50 p-3 rounded-lg"><div className="text-xs text-gray-400">{k}</div><div className="font-medium">{v}</div></div>
          ))}</div>
          <div><StatusBadge status={detail.status}/></div>
        </div>}
      </Modal>
    </PageShell>
  );
};

const RerankingPage = () => {
  const toast=useToast();
  const [models,setModels]=useState([
    {id:1,name:'BGE-Reranker-v2',desc:'BAAI 기반 한국어 리랭킹 모델',topK:5,threshold:0.7,active:true,accuracy:92.4,latency:'15ms'},
    {id:2,name:'Cross-Encoder-KoE5',desc:'한국어 특화 Cross-Encoder',topK:3,threshold:0.8,active:true,accuracy:89.1,latency:'22ms'},
    {id:3,name:'ColBERT-v2-Kor',desc:'ColBERT 기반 다단계 리랭킹',topK:10,threshold:0.6,active:false,accuracy:87.5,latency:'35ms'},
  ]);
  const [showAdd,setShowAdd]=useState(false);const [editModel,setEditModel]=useState(null);
  const [form,setForm]=useState({name:'',desc:'',topK:5,threshold:0.7});
  return (
    <PageShell breadcrumb={['트레이너','리랭킹']} title="Cross-Encoder 리랭킹 학습" action={<button onClick={()=>setShowAdd(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"><Plus size={16} className="mr-1"/>모델 추가</button>}>
      <div className="grid grid-cols-3 gap-4">
        {models.map(m=>(
          <div key={m.id} className={`bg-white p-5 rounded-xl border ${m.active?'border-blue-200':'border-gray-200 opacity-70'} transition-all`}>
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-sm">{m.name}</h3>
              <ToggleSwitch on={m.active} onClick={()=>{setModels(p=>p.map(x=>x.id===m.id?{...x,active:!x.active}:x));toast(m.active?`${m.name} 비활성화됨`:`${m.name} 활성화됨`,m.active?'info':'success');}}/>
            </div>
            <p className="text-xs text-gray-500 mb-3">{m.desc}</p>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="bg-gray-50 p-2 rounded"><span className="text-gray-400">Top-K: </span><span className="font-bold">{m.topK}</span></div>
              <div className="bg-gray-50 p-2 rounded"><span className="text-gray-400">임계값: </span><span className="font-bold">{m.threshold}</span></div>
              <div className="bg-blue-50 p-2 rounded"><span className="text-blue-400">정확도: </span><span className="font-bold text-blue-700">{m.accuracy}%</span></div>
              <div className="bg-green-50 p-2 rounded"><span className="text-green-400">지연: </span><span className="font-bold text-green-700">{m.latency}</span></div>
            </div>
            <button onClick={()=>setEditModel(m)} className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium text-xs hover:bg-gray-200 transition-colors">설정 변경</button>
          </div>
        ))}
      </div>
      <Modal isOpen={showAdd} onClose={()=>setShowAdd(false)} title="리랭킹 모델 추가" size="md">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">모델명</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div><label className="block text-sm font-medium mb-1">설명</label><input value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Top-K</label><input type="number" value={form.topK} onChange={e=>setForm({...form,topK:+e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
            <div><label className="block text-sm font-medium mb-1">임계값</label><input type="number" step="0.1" value={form.threshold} onChange={e=>setForm({...form,threshold:+e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          </div>
          <button onClick={()=>{if(!form.name)return;setModels(p=>[...p,{id:Date.now(),name:form.name,desc:form.desc,topK:form.topK,threshold:form.threshold,active:true,accuracy:0,latency:'-'}]);setShowAdd(false);setForm({name:'',desc:'',topK:5,threshold:0.7});toast('리랭킹 모델이 추가되었습니다');}} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm">추가</button>
        </div>
      </Modal>
      <Modal isOpen={!!editModel} onClose={()=>setEditModel(null)} title={`${editModel?.name} 설정`} size="md">
        {editModel&&<div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Top-K</label><input type="number" value={editModel.topK} onChange={e=>setEditModel({...editModel,topK:+e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div><label className="block text-sm font-medium mb-1">임계값 (Threshold)</label><input type="number" step="0.05" value={editModel.threshold} onChange={e=>setEditModel({...editModel,threshold:+e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <button onClick={()=>{setModels(p=>p.map(x=>x.id===editModel.id?{...x,topK:editModel.topK,threshold:editModel.threshold}:x));setEditModel(null);toast('설정이 저장되었습니다');}} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm">저장</button>
        </div>}
      </Modal>
    </PageShell>
  );
};

const LeaderboardPage = () => {
  const toast=useToast();
  const data=[{r:1,m:'GPT-OSS-120B',a:82.4,b:88.9,c:94.1,d:240},{r:2,m:'Llama-3-Kor-70B',a:79.1,b:85.2,c:91.5,d:120},{r:3,m:'EXAONE-3.0-7.8B',a:72.3,b:78.6,c:88.2,d:80},{r:4,m:'Solar-10.7B',a:70.5,b:76.1,c:86.9,d:95},{r:5,m:'Gemma-2-9B',a:68.2,b:74.3,c:85.1,d:75}];
  const [sortKey,setSortKey]=useState('r');const [sortAsc,setSortAsc]=useState(true);
  const sorted=[...data].sort((x,y)=>{const va=x[sortKey],vb=y[sortKey];return sortAsc?(va>vb?1:-1):(va<vb?1:-1);});
  const handleSort=k=>{if(sortKey===k)setSortAsc(!sortAsc);else{setSortKey(k);setSortAsc(k==='r'||k==='d');}};
  const arrow=k=>sortKey===k?(sortAsc?' ↑':' ↓'):'';
  return (
    <PageShell breadcrumb={['평가','리더보드']} title="모델 리더보드" action={<button onClick={()=>toast('벤치마크 실행이 시작되었습니다')} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"><Play size={16} className="mr-1"/>벤치마크 실행</button>}>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50 text-xs text-gray-500 uppercase"><tr>
          <th className="px-4 py-3 text-left cursor-pointer hover:text-gray-800 select-none" onClick={()=>handleSort('r')}>순위{arrow('r')}</th>
          <th className="px-4 py-3 text-left">모델</th>
          <th className="px-4 py-3 text-right cursor-pointer hover:text-gray-800 select-none" onClick={()=>handleSort('a')}>MTEB{arrow('a')}</th>
          <th className="px-4 py-3 text-right cursor-pointer hover:text-gray-800 select-none" onClick={()=>handleSort('b')}>KorQuAD{arrow('b')}</th>
          <th className="px-4 py-3 text-right cursor-pointer hover:text-gray-800 select-none" onClick={()=>handleSort('c')}>K-Hate{arrow('c')}</th>
          <th className="px-4 py-3 text-right cursor-pointer hover:text-gray-800 select-none" onClick={()=>handleSort('d')}>Avg Latency{arrow('d')}</th>
        </tr></thead><tbody className="divide-y">{sorted.map((r,i)=>(
          <tr key={r.r} className={`hover:bg-gray-50 ${i===0?'bg-yellow-50/50':''}`}>
            <td className="px-4 py-3 font-bold">{i===0?'🥇':i===1?'🥈':i===2?'🥉':r.r}</td>
            <td className="px-4 py-3 font-medium">{r.m}</td>
            <td className="px-4 py-3 text-right font-bold text-blue-600">{r.a}</td>
            <td className="px-4 py-3 text-right">{r.b}</td>
            <td className="px-4 py-3 text-right">{r.c}</td>
            <td className="px-4 py-3 text-right text-gray-500">{r.d}ms</td>
          </tr>
        ))}</tbody></table>
      </div>
    </PageShell>
  );
};

const EvalMetricsPage = () => {
  const toast=useToast();const [detail,setDetail]=useState(null);
  const evals=[
    {id:'EVAL-001',model:'GPT-OSS-120B',benchmark:'MTEB',score:82.4,samples:5000,date:'2026-02-10',status:'완료',duration:'4h 20m'},
    {id:'EVAL-002',model:'Llama-3-Kor-70B',benchmark:'KorQuAD',score:85.2,samples:3000,date:'2026-02-09',status:'완료',duration:'2h 15m'},
    {id:'EVAL-003',model:'EXAONE-3.0-7.8B',benchmark:'K-Hate',score:88.2,samples:2000,date:'2026-02-09',status:'완료',duration:'1h 30m'},
    {id:'EVAL-004',model:'Solar-10.7B',benchmark:'MTEB',score:70.5,samples:5000,date:'2026-02-08',status:'완료',duration:'3h 45m'},
    {id:'EVAL-005',model:'GPT-OSS-120B',benchmark:'전체',score:0,samples:10000,date:'2026-02-11',status:'실행 중',duration:'-'},
  ];
  return (
    <PageShell breadcrumb={['평가','평가지표']} title="성능 평가 지표" action={<button onClick={()=>toast('새 평가 실행이 시작되었습니다')} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"><Play size={16} className="mr-1"/>평가 실행</button>}>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[{l:'MTEB (검색)',v:'82.4',c:'bg-blue-50 text-blue-600'},{l:'K-Hatespeech',v:'94.1',c:'bg-green-50 text-green-600'},{l:'KorQuAD 1.0',v:'88.9',c:'bg-purple-50 text-purple-600'},{l:'평균 지연시간',v:'450ms',c:'bg-orange-50 text-orange-600'}].map((m,i)=>(
          <div key={i} className={`p-5 rounded-xl ${m.c}`}><div className="text-2xl font-bold">{m.v}</div><div className="text-xs mt-1 opacity-80">{m.l}</div></div>
        ))}
      </div>
      <h3 className="font-bold mb-3">평가 실행 기록</h3>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50 text-xs text-gray-500 uppercase"><tr>
          <th className="px-4 py-3 text-left">ID</th><th className="px-4 py-3 text-left">모델</th><th className="px-4 py-3 text-left">벤치마크</th><th className="px-4 py-3 text-right">점수</th><th className="px-4 py-3 text-right">샘플</th><th className="px-4 py-3 text-left">소요시간</th><th className="px-4 py-3 text-left">상태</th>
        </tr></thead><tbody className="divide-y">{evals.map(e=>(
          <tr key={e.id} className="hover:bg-gray-50 cursor-pointer" onClick={()=>setDetail(e)}>
            <td className="px-4 py-3 font-mono text-xs">{e.id}</td><td className="px-4 py-3 font-medium">{e.model}</td><td className="px-4 py-3">{e.benchmark}</td>
            <td className="px-4 py-3 text-right font-bold text-blue-600">{e.score||'-'}</td><td className="px-4 py-3 text-right">{e.samples.toLocaleString()}</td>
            <td className="px-4 py-3 text-gray-500">{e.duration}</td><td className="px-4 py-3"><StatusBadge status={e.status}/></td>
          </tr>
        ))}</tbody></table>
      </div>
      <Modal isOpen={!!detail} onClose={()=>setDetail(null)} title={`${detail?.id} 평가 상세`} size="lg">
        {detail&&<div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">{[['모델',detail.model],['벤치마크',detail.benchmark],['점수',detail.score||'진행 중'],['샘플 수',detail.samples.toLocaleString()],['소요시간',detail.duration],['실행일',detail.date]].map(([k,v],i)=>(
            <div key={i} className="bg-gray-50 p-3 rounded-lg"><div className="text-xs text-gray-400">{k}</div><div className="font-medium">{v}</div></div>
          ))}</div>
          <div><StatusBadge status={detail.status}/></div>
        </div>}
      </Modal>
    </PageShell>
  );
};

// ==================== LLM 관리 ====================
const LlmManagePage = () => {
  const toast=useToast();
  const [models,setModels]=useState(MOCK_LLM_ADMIN_MODELS.map(m=>({...m,promptHistory:[...m.promptHistory]})));
  const [selected,setSelected]=useState(null);
  const [detailTab,setDetailTab]=useState('info');
  const [showRegister,setShowRegister]=useState(false);
  const [confirmDel,setConfirmDel]=useState(null);
  const [editPrompt,setEditPrompt]=useState('');
  const [editNote,setEditNote]=useState('');
  const [expandHist,setExpandHist]=useState(null);
  const [form,setForm]=useState({name:'',baseModel:'',version:'v1.0.0',desc:'',temperature:'0.5',maxTokens:'2048',topP:'0.9',contextWindow:'8K',systemPrompt:''});
  const sel=selected?models.find(m=>m.id===selected):null;

  const handleSelect=(m)=>{setSelected(m.id);setEditPrompt(m.systemPrompt);setEditNote('');setDetailTab('info');setExpandHist(null);};

  const savePrompt=()=>{
    if(!sel)return;
    const parts=sel.version.split('.');const newMinor=parseInt(parts[2]||0)+1;
    const newVer=`${parts[0]}.${parts[1]}.${newMinor}`;
    const newEntry={ver:newVer,date:new Date().toISOString().slice(0,16).replace('T',' '),author:'김영빈',note:editNote||'프롬프트 수정',content:editPrompt};
    setModels(prev=>prev.map(m=>m.id===sel.id?{...m,systemPrompt:editPrompt,version:newVer,promptHistory:[newEntry,...m.promptHistory]}:m));
    toast(`시스템 프롬프트 저장됨 (${newVer})`);setEditNote('');
  };

  const rollback=(h)=>{
    if(!sel)return;
    setModels(prev=>prev.map(m=>m.id===sel.id?{...m,systemPrompt:h.content,version:h.ver}:m));
    setEditPrompt(h.content);setDetailTab('prompt');
    toast(`${h.ver}으로 롤백되었습니다`,'info');
  };

  const toggleActive=(m)=>{
    setModels(prev=>prev.map(x=>x.id===m.id?{...x,status:x.status==='Active'?'Inactive':'Active'}:x));
    if(selected===m.id) setSelected(null);
    toast(`${m.name} ${m.status==='Active'?'비활성화':'활성화'}됨`,m.status==='Active'?'info':'success');
  };

  const registerModel=()=>{
    if(!form.name||!form.baseModel){toast('모델명과 베이스 모델은 필수입니다','error');return;}
    const newM={id:`m-${Date.now()}`,name:form.name,baseModel:form.baseModel,version:form.version,desc:form.desc,
      status:'Inactive',temperature:parseFloat(form.temperature)||0.5,maxTokens:parseInt(form.maxTokens)||2048,
      topP:parseFloat(form.topP)||0.9,contextWindow:form.contextWindow,systemPrompt:form.systemPrompt,promptHistory:[]};
    setModels(prev=>[...prev,newM]);setShowRegister(false);
    setForm({name:'',baseModel:'',version:'v1.0.0',desc:'',temperature:'0.5',maxTokens:'2048',topP:'0.9',contextWindow:'8K',systemPrompt:''});
    toast('모델이 등록되었습니다');
  };

  const sevColor={'danger':'bg-red-50 text-red-600','warning':'bg-yellow-50 text-yellow-700','caution':'bg-blue-50 text-blue-600'};

  return (
    <PageShell breadcrumb={['관리자 전용','LLM 관리']} title="LLM 모델 관리"
      action={<button onClick={()=>setShowRegister(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5"><Plus size={15}/>모델 등록</button>}>
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          ['등록 모델',models.length,'개','text-blue-600'],
          ['활성 모델',models.filter(m=>m.status==='Active').length,'개','text-green-600'],
          ['비활성 모델',models.filter(m=>m.status==='Inactive').length,'개','text-gray-500'],
          ['프롬프트 총 버전',models.reduce((a,m)=>a+m.promptHistory.length,0),'건','text-purple-600'],
        ].map(([label,val,unit,cls])=>(
          <div key={label} className="bg-white rounded-xl border p-4">
            <div className="text-xs text-gray-400 mb-1">{label}</div>
            <div className={`text-2xl font-extrabold ${cls}`}>{val}<span className="text-sm font-normal ml-1 text-gray-400">{unit}</span></div>
          </div>
        ))}
      </div>
      <div className="flex gap-6" style={{height:'calc(100vh - 300px)'}}>
        {/* Left: model cards */}
        <div className="w-72 shrink-0 overflow-y-auto space-y-3 pr-1">
          {models.map(m=>(
            <div key={m.id} onClick={()=>handleSelect(m)}
              className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${sel?.id===m.id?'border-blue-500 shadow-md':'border-slate-200'}`}>
              <div className="flex items-start justify-between mb-1 gap-1">
                <div className="font-bold text-sm text-slate-800 flex-1 break-all">{m.name}</div>
                <StatusBadge status={m.status==='Active'?'Running':'Stopped'}/>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mb-1.5 truncate">Base: {m.baseModel}</div>
              <div className="text-xs text-slate-500 line-clamp-2 mb-2">{m.desc||'(설명 없음)'}</div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[m.version,`T=${m.temperature}`,m.contextWindow].map(t=>(
                  <span key={t} className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded font-mono">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Right: detail panel */}
        {sel ? (
          <div className="flex-1 bg-white rounded-xl border flex flex-col overflow-hidden">
            <div className="px-6 py-3 border-b bg-slate-50 flex items-center justify-between">
              <div>
                <div className="font-bold">{sel.name}</div>
                <div className="text-xs text-slate-400 font-mono">Base: {sel.baseModel} · {sel.version}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={()=>toggleActive(sel)} className={`text-xs px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1 ${sel.status==='Active'?'bg-red-50 text-red-600 border-red-200 hover:bg-red-100':'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'}`}>
                  <Power size={12}/>{sel.status==='Active'?'비활성화':'활성화'}
                </button>
                <button onClick={()=>setConfirmDel(sel)} className="text-xs px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1 bg-white text-red-500 border-red-200 hover:bg-red-50"><Trash2 size={12}/>삭제</button>
              </div>
            </div>
            <div className="flex border-b">
              {[['info','기본 정보'],['prompt','시스템 프롬프트'],['history','변경 이력']].map(([id,label])=>(
                <button key={id} onClick={()=>setDetailTab(id)}
                  className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors ${detailTab===id?'border-blue-600 text-blue-700':'border-transparent text-slate-500 hover:text-slate-800'}`}>
                  {label}{id==='history'&&<span className="ml-1.5 bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5 rounded-full">{sel.promptHistory.length}</span>}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {detailTab==='info'&&(
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[['모델명',sel.name],['베이스 모델 *',sel.baseModel],['버전',sel.version],['컨텍스트 윈도우',sel.contextWindow]].map(([k,v])=>(
                      <div key={k} className="bg-slate-50 rounded-lg p-3">
                        <div className="text-xs text-slate-400 mb-0.5">{k}</div>
                        <div className="font-semibold text-sm text-slate-800 font-mono break-all">{v}</div>
                      </div>
                    ))}
                    <div className="col-span-2 bg-slate-50 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-0.5">설명</div>
                      <div className="text-sm text-slate-700">{sel.desc||'(없음)'}</div>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="text-xs text-blue-500 font-bold uppercase tracking-wider mb-3">파라미터 설정값</div>
                    <div className="grid grid-cols-3 gap-4">
                      {[['Temperature',sel.temperature],['Top-P',sel.topP],['Max Tokens',sel.maxTokens]].map(([k,v])=>(
                        <div key={k}>
                          <div className="text-xs text-slate-500 mb-0.5">{k}</div>
                          <div className="font-extrabold text-xl text-blue-700">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {detailTab==='prompt'&&(
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-700">공통 시스템 프롬프트</div>
                    <span className="text-xs text-slate-400">현재: <span className="font-mono font-bold text-blue-600">{sel.version}</span></span>
                  </div>
                  <textarea value={editPrompt} onChange={e=>setEditPrompt(e.target.value)} rows={10}
                    className="w-full border rounded-xl px-4 py-3 text-sm font-mono bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"/>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">변경 사유 (버전 메모)</label>
                    <input value={editNote} onChange={e=>setEditNote(e.target.value)} placeholder="예: 보안 규정 4항 추가"
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                  <button onClick={savePrompt} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700">
                    <Save size={14}/>저장 및 버전 업
                  </button>
                </div>
              )}
              {detailTab==='history'&&(
                <div>
                  <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4 flex items-center gap-2">
                    <AlertTriangle size={13}/>이전 버전으로 롤백 시 현재 프롬프트가 즉시 교체됩니다. 신중하게 진행하세요.
                  </div>
                  {sel.promptHistory.length===0 && <div className="text-sm text-slate-400 text-center py-12">변경 이력이 없습니다.</div>}
                  <div className="space-y-3">
                    {sel.promptHistory.map((h,i)=>(
                      <div key={i} className={`rounded-xl border-2 p-4 ${i===0?'border-blue-300 bg-blue-50/40':'border-slate-200'}`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-blue-700 text-sm">{h.ver}</span>
                            {i===0&&<span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">현재</span>}
                            <span className="text-xs text-slate-400">{h.date} · {h.author}</span>
                          </div>
                          {i>0&&(
                            <button onClick={()=>rollback(h)} className="text-xs text-orange-600 border border-orange-200 bg-orange-50 px-3 py-1 rounded-lg font-semibold flex items-center gap-1 hover:bg-orange-100">
                              <RotateCcw size={11}/>롤백
                            </button>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mb-1.5"><span className="font-semibold text-slate-700">변경 사유: </span>{h.note}</div>
                        <button onClick={()=>setExpandHist(expandHist===h.ver?null:h.ver)}
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                          <Eye size={11}/>{expandHist===h.ver?'내용 닫기':'내용 보기'}
                        </button>
                        {expandHist===h.ver&&(
                          <pre className="mt-2 bg-slate-100 rounded-lg p-3 text-xs font-mono whitespace-pre-wrap text-slate-700 max-h-36 overflow-y-auto">{h.content}</pre>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ):(
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-slate-400"><Cpu size={42} className="mx-auto mb-3 opacity-20"/><p className="text-sm">좌측에서 모델을 선택하세요</p></div>
          </div>
        )}
      </div>
      {/* Register Modal */}
      <Modal isOpen={showRegister} onClose={()=>setShowRegister(false)} title="LLM 모델 등록" size="md">
        <div className="space-y-4">
          <div><label className="block text-sm font-semibold mb-1">모델명 <span className="text-red-500">*</span></label>
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="예: GPT-OSS-120B" className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div><label className="block text-sm font-semibold mb-1">베이스 모델 <span className="text-red-500">*</span></label>
            <input value={form.baseModel} onChange={e=>setForm({...form,baseModel:e.target.value})} placeholder="예: Meta-Llama-3-405B-Instruct" className="w-full border rounded-lg px-3 py-2 text-sm font-mono"/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-semibold mb-1">버전</label>
              <input value={form.version} onChange={e=>setForm({...form,version:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm font-mono"/></div>
            <div><label className="block text-sm font-semibold mb-1">컨텍스트 윈도우</label>
              <select value={form.contextWindow} onChange={e=>setForm({...form,contextWindow:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm bg-white">
                {['4K','8K','32K','128K','200K'].map(v=><option key={v}>{v}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[['temperature','Temperature'],['topP','Top-P'],['maxTokens','Max Tokens']].map(([k,label])=>(
              <div key={k}><label className="block text-sm font-semibold mb-1">{label}</label>
                <input value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
            ))}
          </div>
          <div><label className="block text-sm font-semibold mb-1">설명</label>
            <textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} rows={2} className="w-full border rounded-lg px-3 py-2 text-sm resize-none"/></div>
          <div><label className="block text-sm font-semibold mb-1">초기 시스템 프롬프트</label>
            <textarea value={form.systemPrompt} onChange={e=>setForm({...form,systemPrompt:e.target.value})} rows={3} placeholder="선택 사항 — 나중에 편집 가능" className="w-full border rounded-lg px-3 py-2 text-sm font-mono resize-none"/></div>
          <button onClick={registerModel} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm">등록</button>
        </div>
      </Modal>
      <ConfirmDialog isOpen={!!confirmDel} onClose={()=>setConfirmDel(null)}
        onConfirm={()=>{setModels(p=>p.filter(x=>x.id!==confirmDel.id));if(selected===confirmDel?.id)setSelected(null);setConfirmDel(null);toast('모델이 삭제되었습니다','info');}}
        title="모델 삭제" message={`'${confirmDel?.name}' 모델을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`} confirmText="삭제" danger/>
    </PageShell>
  );
};

// ==================== 필터링 관리 ====================
const GuardrailFilterPage = () => {
  const toast=useToast();
  const [rules,setRules]=useState(()=>{
    try{const s=localStorage.getItem('genos_filter_rules');return s?JSON.parse(s):MOCK_FILTER_RULES.map(r=>({...r}));}
    catch{return MOCK_FILTER_RULES.map(r=>({...r}));}
  });
  const [showAdd,setShowAdd]=useState(false);
  const [editRule,setEditRule]=useState(null);
  const [confirmDel,setConfirmDel]=useState(null);
  const [catFilter,setCatFilter]=useState('전체');
  const [showTest,setShowTest]=useState(false);
  const [testInput,setTestInput]=useState('');
  const [testResult,setTestResult]=useState(null);
  const [form,setForm]=useState({name:'',pattern:'',category:'기밀',severity:'warning',action:'차단'});

  // 규칙 변경 시 localStorage에 즉시 동기화 → 사용자 포털에서 실시간 적용
  useEffect(()=>{localStorage.setItem('genos_filter_rules',JSON.stringify(rules));},[rules]);

  const CATS=['전체','기밀','개인정보','보안','비윤리','시스템'];
  const SEV_MAP={danger:{label:'위험',cls:'bg-red-100 text-red-700'},warning:{label:'경고',cls:'bg-yellow-100 text-yellow-700'},caution:{label:'주의',cls:'bg-blue-100 text-blue-700'}};
  const filtered=catFilter==='전체'?rules:rules.filter(r=>r.category===catFilter);
  const totalHits=rules.filter(r=>r.active).reduce((a,r)=>a+r.hitCount,0);

  const runTest=()=>{
    if(!testInput.trim())return;
    const matched=rules.filter(r=>{
      if(!r.active)return false;
      return r.p.split(',').map(k=>k.trim().toLowerCase()).some(k=>testInput.toLowerCase().includes(k));
    });
    setTestResult({input:testInput,matched,blocked:matched.some(r=>r.a==='차단')});
  };

  return (
    <PageShell breadcrumb={['가드레일','필터 설정']} title="부적절 프롬프트 필터링 관리"
      action={
        <div className="flex items-center gap-2">
          <button onClick={()=>{setTestInput('');setTestResult(null);setShowTest(true);}} className="border border-amber-400 text-amber-700 bg-amber-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-amber-100"><TestTube2 size={15}/>프롬프트 테스트</button>
          <button onClick={()=>setShowAdd(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5"><Plus size={15}/>필터 추가</button>
        </div>
      }>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          ['전체 규칙',rules.length,'개','text-blue-600'],
          ['활성 규칙',rules.filter(r=>r.active).length,'개','text-green-600'],
          ['금일 총 차단',totalHits,'건','text-red-600'],
          ['위험 등급 규칙',rules.filter(r=>r.severity==='danger'&&r.active).length,'개','text-red-500'],
        ].map(([label,val,unit,cls])=>(
          <div key={label} className="bg-white rounded-xl border p-4">
            <div className="text-xs text-gray-400 mb-1">{label}</div>
            <div className={`text-2xl font-extrabold ${cls}`}>{val}<span className="text-sm font-normal ml-1 text-gray-400">{unit}</span></div>
          </div>
        ))}
      </div>
      {/* Category filter tabs */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {CATS.map(c=>(
          <button key={c} onClick={()=>setCatFilter(c)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${catFilter===c?'bg-blue-600 text-white border-blue-600':'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>{c}</button>
        ))}
        <span className="ml-auto text-xs text-gray-400">{filtered.length}개 규칙</span>
      </div>
      {/* Rules table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-3 text-left">규칙명</th>
              <th className="px-4 py-3 text-left">분류</th>
              <th className="px-4 py-3 text-left">위험도</th>
              <th className="px-4 py-3 text-left">패턴/키워드</th>
              <th className="px-4 py-3 text-left">동작</th>
              <th className="px-4 py-3 text-right">탐지 수</th>
              <th className="px-4 py-3 text-center">활성</th>
              <th className="px-4 py-3 text-center">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(f=>(
              <tr key={f.id} className={`hover:bg-gray-50 transition-colors ${!f.active?'opacity-40':''}`}>
                <td className="px-4 py-3 font-semibold">{f.n}</td>
                <td className="px-4 py-3"><span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{f.category}</span></td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded font-bold ${SEV_MAP[f.severity]?.cls||'bg-gray-100 text-gray-600'}`}>
                    {SEV_MAP[f.severity]?.label||f.severity}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 max-w-xs truncate text-xs">{f.p}</td>
                <td className="px-4 py-3"><StatusBadge status={f.a}/></td>
                <td className="px-4 py-3 text-right font-mono font-bold text-red-600">{f.hitCount.toLocaleString()}</td>
                <td className="px-4 py-3 text-center">
                  <ToggleSwitch on={f.active} onClick={()=>{
                    setRules(p=>p.map(x=>x.id===f.id?{...x,active:!x.active}:x));
                    toast(f.active?`'${f.n}' 비활성화`:`'${f.n}' 활성화`,f.active?'info':'success');
                  }}/>
                </td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button onClick={()=>setEditRule({...f})} className="text-xs text-blue-600 hover:underline font-medium">편집</button>
                  <button onClick={()=>setConfirmDel(f)} className="text-xs text-red-500 hover:underline font-medium">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={()=>setShowAdd(false)} title="필터 규칙 추가" size="md">
        <div className="space-y-4">
          <div><label className="block text-sm font-semibold mb-1">규칙명 <span className="text-red-500">*</span></label>
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="예: 내부 기밀 요청" className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div><label className="block text-sm font-semibold mb-1">패턴/키워드 <span className="text-gray-400 font-normal">(쉼표 구분)</span></label>
            <input value={form.pattern} onChange={e=>setForm({...form,pattern:e.target.value})} placeholder="키워드1, 키워드2, ..." className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="block text-sm font-semibold mb-1">분류</label>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm bg-white">
                {['기밀','개인정보','보안','비윤리','시스템'].map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label className="block text-sm font-semibold mb-1">위험도</label>
              <select value={form.severity} onChange={e=>setForm({...form,severity:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm bg-white">
                <option value="danger">위험</option><option value="warning">경고</option><option value="caution">주의</option></select></div>
            <div><label className="block text-sm font-semibold mb-1">동작</label>
              <select value={form.action} onChange={e=>setForm({...form,action:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm bg-white">
                <option>차단</option><option>경고</option><option>로그만</option></select></div>
          </div>
          <button onClick={()=>{
            if(!form.name)return;
            setRules(p=>[...p,{id:Date.now(),n:form.name,p:form.pattern,category:form.category,severity:form.severity,a:form.action,active:true,hitCount:0}]);
            setShowAdd(false);setForm({name:'',pattern:'',category:'기밀',severity:'warning',action:'차단'});
            toast('필터 규칙이 추가되었습니다');
          }} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm">추가</button>
        </div>
      </Modal>
      {/* Edit Modal */}
      <Modal isOpen={!!editRule} onClose={()=>setEditRule(null)} title="필터 규칙 편집" size="md">
        {editRule&&<div className="space-y-4">
          <div><label className="block text-sm font-semibold mb-1">규칙명</label>
            <input value={editRule.n} onChange={e=>setEditRule({...editRule,n:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div><label className="block text-sm font-semibold mb-1">패턴/키워드</label>
            <input value={editRule.p} onChange={e=>setEditRule({...editRule,p:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="block text-sm font-semibold mb-1">분류</label>
              <select value={editRule.category} onChange={e=>setEditRule({...editRule,category:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm bg-white">
                {['기밀','개인정보','보안','비윤리','시스템'].map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label className="block text-sm font-semibold mb-1">위험도</label>
              <select value={editRule.severity} onChange={e=>setEditRule({...editRule,severity:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm bg-white">
                <option value="danger">위험</option><option value="warning">경고</option><option value="caution">주의</option></select></div>
            <div><label className="block text-sm font-semibold mb-1">동작</label>
              <select value={editRule.a} onChange={e=>setEditRule({...editRule,a:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm bg-white">
                <option>차단</option><option>경고</option><option>로그만</option></select></div>
          </div>
          <button onClick={()=>{setRules(p=>p.map(x=>x.id===editRule.id?{...x,...editRule}:x));setEditRule(null);toast('규칙이 수정되었습니다');}}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm">저장</button>
        </div>}
      </Modal>
      {/* Test Modal */}
      <Modal isOpen={showTest} onClose={()=>setShowTest(false)} title="프롬프트 필터 테스트" size="md">
        <div className="space-y-4">
          <div className="text-sm text-gray-500 bg-amber-50 border border-amber-200 rounded-lg p-3">
            테스트할 프롬프트를 입력하면 현재 활성 규칙과 대조하여 차단 여부를 확인합니다.
          </div>
          <textarea value={testInput} onChange={e=>setTestInput(e.target.value)} rows={4}
            placeholder="테스트 프롬프트를 입력하세요..." className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <button onClick={runTest} className="w-full bg-amber-500 text-white py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2">
            <TestTube2 size={15}/>테스트 실행
          </button>
          {testResult&&(
            <div className={`rounded-xl border-2 p-4 ${testResult.blocked?'border-red-300 bg-red-50':'border-green-300 bg-green-50'}`}>
              <div className={`font-bold text-base mb-2 flex items-center gap-2 ${testResult.blocked?'text-red-700':'text-green-700'}`}>
                {testResult.blocked?<><XCircle size={18}/>차단됨</>:<><Check size={18}/>통과됨</>}
              </div>
              {testResult.matched.length>0?(
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-gray-600 mb-1.5">적용된 규칙 ({testResult.matched.length}개)</div>
                  {testResult.matched.map(r=>(
                    <div key={r.id} className="flex items-center gap-2 text-xs text-gray-700">
                      <span className={`w-1.5 h-1.5 rounded-full ${SEV_MAP[r.severity]?.cls.includes('red')?'bg-red-500':'bg-yellow-500'}`}/>
                      <span className="font-semibold">{r.n}</span><span className="text-gray-400">→ {r.a}</span>
                    </div>
                  ))}
                </div>
              ):(
                <div className="text-sm text-green-700">매칭된 필터 규칙이 없습니다.</div>
              )}
            </div>
          )}
        </div>
      </Modal>
      <ConfirmDialog isOpen={!!confirmDel} onClose={()=>setConfirmDel(null)}
        onConfirm={()=>{setRules(p=>p.filter(x=>x.id!==confirmDel.id));setConfirmDel(null);toast('규칙이 삭제되었습니다','info');}}
        title="규칙 삭제" message={`'${confirmDel?.n}' 규칙을 삭제하시겠습니까?`} confirmText="삭제" danger/>
    </PageShell>
  );
};

const GuardrailLogPage = () => {
  const [search,setSearch]=useState('');const [filterRule,setFilterRule]=useState('전체');const [detail,setDetail]=useState(null);
  const logs=MOCK_GUARDRAIL_LOGS.filter(l=>{
    const matchSearch=!search||l.user.includes(search)||l.query.includes(search);
    const matchRule=filterRule==='전체'||l.rule===filterRule;
    return matchSearch&&matchRule;
  });
  const rules=[...new Set(MOCK_GUARDRAIL_LOGS.map(l=>l.rule))];
  return (
    <PageShell breadcrumb={['가드레일','탐지 로그']} title="탐지 로그">
      <div className="flex items-center space-x-3 mb-4">
        <div className="relative flex-1 max-w-sm"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="사용자 또는 질의 검색..." className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/><Search size={16} className="absolute left-3 top-2.5 text-gray-400"/></div>
        <select value={filterRule} onChange={e=>setFilterRule(e.target.value)} className="border rounded-lg px-3 py-2 text-sm bg-white"><option>전체</option>{rules.map(r=><option key={r}>{r}</option>)}</select>
        <span className="text-xs text-gray-400">총 {logs.length}건</span>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50 text-xs text-gray-500 uppercase"><tr>
          <th className="px-4 py-3 text-left">시간</th><th className="px-4 py-3 text-left">사용자</th><th className="px-4 py-3 text-left">질의 내용</th><th className="px-4 py-3 text-left">적용 규칙</th><th className="px-4 py-3 text-left">조치</th>
        </tr></thead><tbody className="divide-y">{logs.map(l=>(
          <tr key={l.id} className="hover:bg-gray-50 cursor-pointer" onClick={()=>setDetail(l)}>
            <td className="px-4 py-3 text-xs font-mono text-gray-500">{l.time}</td><td className="px-4 py-3 font-medium">{l.user}</td><td className="px-4 py-3 text-gray-700">{l.query}</td><td className="px-4 py-3 text-gray-500">{l.rule}</td><td className="px-4 py-3"><StatusBadge status={l.action}/></td>
          </tr>
        ))}</tbody></table>
      </div>
      <Modal isOpen={!!detail} onClose={()=>setDetail(null)} title="탐지 로그 상세" size="lg">
        {detail&&<div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">{[['사용자',detail.user],['시간',detail.time],['적용 규칙',detail.rule],['조치',detail.action]].map(([k,v],i)=>(
            <div key={i} className="bg-gray-50 p-3 rounded-lg"><div className="text-xs text-gray-400">{k}</div><div className="font-medium">{v}</div></div>
          ))}</div>
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg"><div className="text-xs text-red-400 mb-1">차단된 질의</div><p className="text-sm text-red-700">{detail.query}</p></div>
        </div>}
      </Modal>
    </PageShell>
  );
};

// ==================== DEPLOY PAGES ====================
const MCPToolsPage = () => {
  const toast=useToast();
  const [tools,setTools]=useState(MOCK_MCP_TOOLS.map(t=>({...t})));
  const [search,setSearch]=useState('');const [showCreate,setShowCreate]=useState(false);const [detail,setDetail]=useState(null);const [confirmDel,setConfirmDel]=useState(null);
  const [form,setForm]=useState({name:'',desc:'',dept:'AI혁신TF'});
  const filtered=tools.filter(t=>t.name.toLowerCase().includes(search.toLowerCase())||t.desc.includes(search));
  return (
    <PageShell breadcrumb={['도구','MCP 도구']}>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">MCP 도구 목록</h2>
        <button onClick={()=>setShowCreate(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"><Plus size={16} className="mr-1"/>MCP 도구 생성</button>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1 max-w-xs"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="도구 검색..." className="pl-9 pr-3 py-2 border rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"/><Search size={16} className="absolute left-3 top-2.5 text-gray-400"/></div>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50 text-xs text-gray-500"><tr>
          <th className="px-4 py-3 text-left">ID</th><th className="px-4 py-3 text-left">제목</th><th className="px-4 py-3 text-left">상세 설명</th><th className="px-4 py-3 text-left">제작자</th><th className="px-4 py-3 text-left">관리 그룹</th><th className="px-4 py-3 text-left">등록일시</th><th className="px-4 py-3 text-center">액션</th>
        </tr></thead><tbody className="divide-y">{filtered.map(t=>(
          <tr key={t.id} className="hover:bg-gray-50 cursor-pointer" onClick={()=>setDetail(t)}>
            <td className="px-4 py-3 text-gray-500">{t.id}</td><td className="px-4 py-3 font-medium">{t.name}</td><td className="px-4 py-3 text-gray-500">{t.desc}</td>
            <td className="px-4 py-3"><div className="font-medium">{t.creator}</div><div className="text-xs text-gray-400">admin</div></td><td className="px-4 py-3">{t.dept}</td><td className="px-4 py-3 text-xs font-mono text-gray-500">{t.date}</td>
            <td className="px-4 py-3 text-center" onClick={e=>e.stopPropagation()}>
              <button onClick={()=>setConfirmDel(t)} className="text-xs text-red-500 hover:underline">삭제</button>
            </td>
          </tr>
        ))}</tbody></table>
      </div>
      <Modal isOpen={showCreate} onClose={()=>setShowCreate(false)} title="MCP 도구 생성" size="md">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">제목</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div><label className="block text-sm font-medium mb-1">상세 설명</label><textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div><label className="block text-sm font-medium mb-1">관리 그룹</label><input value={form.dept} onChange={e=>setForm({...form,dept:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <button onClick={()=>{if(!form.name)return;setTools(p=>[{id:p.length+1,name:form.name,desc:form.desc,creator:'김영빈',dept:form.dept,date:'2026-02-11'},...p]);setShowCreate(false);setForm({name:'',desc:'',dept:'AI혁신TF'});toast('MCP 도구가 생성되었습니다');}} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm">생성</button>
        </div>
      </Modal>
      <Modal isOpen={!!detail} onClose={()=>setDetail(null)} title={detail?.name} size="lg">
        {detail&&<div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">{[['ID',detail.id],['제작자',detail.creator],['관리 그룹',detail.dept],['등록일',detail.date]].map(([k,v],i)=>(
            <div key={i} className="bg-gray-50 p-3 rounded-lg"><div className="text-xs text-gray-400">{k}</div><div className="font-medium">{v}</div></div>
          ))}</div>
          <div className="bg-gray-50 p-4 rounded-lg"><div className="text-xs text-gray-400 mb-1">상세 설명</div><p className="text-sm">{detail.desc}</p></div>
        </div>}
      </Modal>
      <ConfirmDialog isOpen={!!confirmDel} onClose={()=>setConfirmDel(null)} onConfirm={()=>{setTools(p=>p.filter(x=>x.id!==confirmDel.id));setConfirmDel(null);toast('MCP 도구가 삭제되었습니다','info');}} title="도구 삭제" message={`'${confirmDel?.name}'을(를) 삭제하시겠습니까?`} confirmText="삭제" danger/>
    </PageShell>
  );
};

const MCPServerPage = () => {
  const toast=useToast();
  const [servers,setServers]=useState([
    {id:1,n:'Local MCP Server',u:'http://localhost:8080',t:'Search, Web Crawler',s:'Running'},
    {id:2,n:'External API Gateway',u:'https://api.reb.or.kr/mcp',t:'ERP Connector, GW Sync',s:'Running'},
    {id:3,n:'Test Server',u:'http://192.168.10.50:3000',t:'CodeDev',s:'Stopped'},
  ]);
  const [showAdd,setShowAdd]=useState(false);const [confirmAction,setConfirmAction]=useState(null);
  const [form,setForm]=useState({name:'',url:'',tools:''});
  return (
    <PageShell breadcrumb={['도구','MCP 서버']} title="MCP 서버 관리" action={<button onClick={()=>setShowAdd(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"><Plus size={16} className="mr-1"/>서버 추가</button>}>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50 text-xs text-gray-500 uppercase"><tr>
          <th className="px-4 py-3 text-left">서버명</th><th className="px-4 py-3 text-left">URL</th><th className="px-4 py-3 text-left">연결된 도구</th><th className="px-4 py-3 text-left">상태</th><th className="px-4 py-3 text-center">액션</th>
        </tr></thead><tbody className="divide-y">{servers.map(s=>(
          <tr key={s.id} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium">{s.n}</td><td className="px-4 py-3 font-mono text-xs text-gray-500">{s.u}</td><td className="px-4 py-3 text-gray-500">{s.t}</td><td className="px-4 py-3"><StatusBadge status={s.s}/></td>
            <td className="px-4 py-3 text-center space-x-2">
              <button onClick={()=>toast(`${s.n} 연결 테스트 성공`)} className="text-xs text-green-600 hover:underline">테스트</button>
              <button onClick={()=>setConfirmAction({server:s,action:'restart'})} className="text-xs text-blue-600 hover:underline">재시작</button>
              <button onClick={()=>setConfirmAction({server:s,action:'delete'})} className="text-xs text-red-500 hover:underline">삭제</button>
            </td>
          </tr>
        ))}</tbody></table>
      </div>
      <Modal isOpen={showAdd} onClose={()=>setShowAdd(false)} title="MCP 서버 추가" size="md">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">서버명</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div><label className="block text-sm font-medium mb-1">URL</label><input value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="http://..." className="w-full border rounded-lg px-3 py-2 text-sm font-mono"/></div>
          <div><label className="block text-sm font-medium mb-1">연결 도구 (쉼표 구분)</label><input value={form.tools} onChange={e=>setForm({...form,tools:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <button onClick={()=>{if(!form.name)return;setServers(p=>[...p,{id:Date.now(),n:form.name,u:form.url,t:form.tools,s:'Stopped'}]);setShowAdd(false);setForm({name:'',url:'',tools:''});toast('서버가 추가되었습니다');}} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm">추가</button>
        </div>
      </Modal>
      <ConfirmDialog isOpen={!!confirmAction} onClose={()=>setConfirmAction(null)} onConfirm={()=>{const{server,action}=confirmAction;if(action==='restart'){setServers(p=>p.map(x=>x.id===server.id?{...x,s:'Restarting'}:x));setTimeout(()=>setServers(p=>p.map(x=>x.id===server.id?{...x,s:'Running'}:x)),2000);toast(`${server.n} 재시작 중...`,'info');}else{setServers(p=>p.filter(x=>x.id!==server.id));toast('서버가 삭제되었습니다','info');}setConfirmAction(null);}} title={confirmAction?.action==='restart'?'서버 재시작':'서버 삭제'} message={`${confirmAction?.server?.n}을(를) ${confirmAction?.action==='restart'?'재시작':'삭제'}하시겠습니까?`} confirmText={confirmAction?.action==='restart'?'재시작':'삭제'} danger={confirmAction?.action==='delete'}/>
    </PageShell>
  );
};

const PromptLibraryPage = () => {
  const toast=useToast();
  const [prompts,setPrompts]=useState(MOCK_PROMPTS.map(p=>({...p})));
  const [search,setSearch]=useState('');const [showCreate,setShowCreate]=useState(false);const [detail,setDetail]=useState(null);const [confirmDel,setConfirmDel]=useState(null);
  const [form,setForm]=useState({name:'',desc:'',content:'',dept:'AI혁신TF'});
  const filtered=prompts.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||p.desc.includes(search));
  return (
    <PageShell breadcrumb={['도구','프롬프트 라이브러리']}>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">프롬프트 라이브러리</h2>
        <button onClick={()=>setShowCreate(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"><Plus size={16} className="mr-1"/>프롬프트 생성</button>
      </div>
      <div className="relative max-w-sm mb-4"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="프롬프트 검색..." className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/><Search size={16} className="absolute left-3 top-2.5 text-gray-400"/></div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50 text-xs text-gray-500"><tr>
          <th className="px-4 py-3 text-left">ID</th><th className="px-4 py-3 text-left">제목</th><th className="px-4 py-3 text-left">설명</th><th className="px-4 py-3 text-left">관리 그룹</th><th className="px-4 py-3 text-left">등록일시</th><th className="px-4 py-3 text-center">액션</th>
        </tr></thead><tbody className="divide-y">{filtered.map(p=>(
          <tr key={p.id} className="hover:bg-gray-50 cursor-pointer" onClick={()=>setDetail(p)}>
            <td className="px-4 py-3 text-gray-500">{p.id}</td><td className="px-4 py-3 font-medium">{p.name}</td><td className="px-4 py-3 text-gray-500">{p.desc}</td><td className="px-4 py-3">{p.dept}</td><td className="px-4 py-3 text-xs font-mono text-gray-500">{p.date}</td>
            <td className="px-4 py-3 text-center" onClick={e=>e.stopPropagation()}>
              <button onClick={()=>setConfirmDel(p)} className="text-xs text-red-500 hover:underline">삭제</button>
            </td>
          </tr>
        ))}</tbody></table>
      </div>
      <Modal isOpen={showCreate} onClose={()=>setShowCreate(false)} title="프롬프트 생성" size="lg">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">제목</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div><label className="block text-sm font-medium mb-1">설명</label><input value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div><label className="block text-sm font-medium mb-1">프롬프트 내용</label><textarea value={form.content} onChange={e=>setForm({...form,content:e.target.value})} rows={5} placeholder="프롬프트 템플릿을 입력하세요..." className="w-full border rounded-lg px-3 py-2 text-sm font-mono"/></div>
          <div><label className="block text-sm font-medium mb-1">관리 그룹</label><input value={form.dept} onChange={e=>setForm({...form,dept:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <button onClick={()=>{if(!form.name)return;setPrompts(p=>[{id:p.length+1,name:form.name,desc:form.desc,dept:form.dept,date:'2026-02-11',content:form.content},...p]);setShowCreate(false);setForm({name:'',desc:'',content:'',dept:'AI혁신TF'});toast('프롬프트가 생성되었습니다');}} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm">생성</button>
        </div>
      </Modal>
      <Modal isOpen={!!detail} onClose={()=>setDetail(null)} title={detail?.name} size="lg">
        {detail&&<div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">{[['ID',detail.id],['관리 그룹',detail.dept],['등록일',detail.date],['설명',detail.desc]].map(([k,v],i)=>(
            <div key={i} className="bg-gray-50 p-3 rounded-lg"><div className="text-xs text-gray-400">{k}</div><div className="font-medium">{v}</div></div>
          ))}</div>
          {detail.content&&<div className="bg-gray-900 text-green-400 font-mono text-xs p-4 rounded-lg whitespace-pre-wrap">{detail.content}</div>}
        </div>}
      </Modal>
      <ConfirmDialog isOpen={!!confirmDel} onClose={()=>setConfirmDel(null)} onConfirm={()=>{setPrompts(p=>p.filter(x=>x.id!==confirmDel.id));setConfirmDel(null);toast('프롬프트가 삭제되었습니다','info');}} title="프롬프트 삭제" message={`'${confirmDel?.name}'을(를) 삭제하시겠습니까?`} confirmText="삭제" danger/>
    </PageShell>
  );
};

const ServingPage = () => {
  const toast=useToast();
  const [endpoints,setEndpoints]=useState([
    {id:1,e:'api-gpt-oss-prod',m:'GPT-OSS-120B',q:120,t:4500,l:'240ms',s:'Healthy',replicas:4},
    {id:2,e:'api-llama3-prod',m:'Llama-3-Kor',q:45,t:1800,l:'120ms',s:'Healthy',replicas:2},
    {id:3,e:'api-exaone-dev',m:'EXAONE-3.0',q:15,t:600,l:'180ms',s:'Healthy',replicas:1},
    {id:4,e:'api-solar-batch',m:'Solar-10.7B',q:80,t:3200,l:'95ms',s:'Healthy',replicas:2},
  ]);
  const [detail,setDetail]=useState(null);const [scaleEp,setScaleEp]=useState(null);const [confirmRestart,setConfirmRestart]=useState(null);
  const [newReplicas,setNewReplicas]=useState(1);
  return (
    <PageShell breadcrumb={['서빙']} title="모델 서빙 상태">
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50 text-xs text-gray-500 uppercase"><tr>
          <th className="px-4 py-3 text-left">엔드포인트</th><th className="px-4 py-3 text-left">모델</th><th className="px-4 py-3 text-right">QPS</th><th className="px-4 py-3 text-right">Tokens/s</th><th className="px-4 py-3 text-right">지연시간</th><th className="px-4 py-3 text-center">레플리카</th><th className="px-4 py-3 text-left">상태</th><th className="px-4 py-3 text-center">액션</th>
        </tr></thead><tbody className="divide-y">{endpoints.map(r=>(
          <tr key={r.id} className="hover:bg-gray-50 cursor-pointer" onClick={()=>setDetail(r)}>
            <td className="px-4 py-3 font-bold">{r.e}</td><td className="px-4 py-3">{r.m}</td><td className="px-4 py-3 text-right">{r.q}</td><td className="px-4 py-3 text-right">{r.t.toLocaleString()}</td><td className="px-4 py-3 text-right">{r.l}</td><td className="px-4 py-3 text-center font-medium">{r.replicas}</td><td className="px-4 py-3"><StatusBadge status={r.s}/></td>
            <td className="px-4 py-3 text-center space-x-2" onClick={e=>e.stopPropagation()}>
              <button onClick={()=>{setScaleEp(r);setNewReplicas(r.replicas);}} className="text-xs text-blue-600 hover:underline">스케일</button>
              <button onClick={()=>setConfirmRestart(r)} className="text-xs text-orange-600 hover:underline">재시작</button>
            </td>
          </tr>
        ))}</tbody></table>
      </div>
      <Modal isOpen={!!detail} onClose={()=>setDetail(null)} title={detail?.e} size="lg">
        {detail&&<div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">{[['모델',detail.m],['QPS',detail.q],['Tokens/s',detail.t.toLocaleString()],['지연시간',detail.l],['레플리카',detail.replicas],['상태',detail.s]].map(([k,v],i)=>(
            <div key={i} className="bg-gray-50 p-3 rounded-lg"><div className="text-xs text-gray-400">{k}</div><div className="font-medium">{v}</div></div>
          ))}</div>
        </div>}
      </Modal>
      <Modal isOpen={!!scaleEp} onClose={()=>setScaleEp(null)} title={`${scaleEp?.e} 스케일 조정`} size="sm">
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <button onClick={()=>setNewReplicas(Math.max(1,newReplicas-1))} className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-lg font-bold">-</button>
            <span className="text-3xl font-bold w-12 text-center">{newReplicas}</span>
            <button onClick={()=>setNewReplicas(newReplicas+1)} className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-lg font-bold">+</button>
          </div>
          <button onClick={()=>{setEndpoints(p=>p.map(x=>x.id===scaleEp.id?{...x,replicas:newReplicas}:x));setScaleEp(null);toast(`${scaleEp?.e} 레플리카가 ${newReplicas}개로 조정되었습니다`);}} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm">적용</button>
        </div>
      </Modal>
      <ConfirmDialog isOpen={!!confirmRestart} onClose={()=>setConfirmRestart(null)} onConfirm={()=>{setEndpoints(p=>p.map(x=>x.id===confirmRestart.id?{...x,s:'Restarting'}:x));setTimeout(()=>setEndpoints(p=>p.map(x=>x.id===confirmRestart.id?{...x,s:'Healthy'}:x)),2000);setConfirmRestart(null);toast(`${confirmRestart?.e} 재시작 중...`,'info');}} title="엔드포인트 재시작" message={`${confirmRestart?.e}을(를) 재시작하시겠습니까?`} confirmText="재시작"/>
    </PageShell>
  );
};

// ==================== TOAST & CONFIRM ====================
const ToastContext = React.createContext();
const ToastProvider = ({children}) => {
  const [toasts,setToasts]=useState([]);
  const addToast=(msg,type='success')=>{const id=Date.now();setToasts(p=>[...p,{id,msg,type}]);setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),3000);};
  return <ToastContext.Provider value={addToast}>{children}
    <div className="fixed top-4 right-4 z-[60] space-y-2">{toasts.map(t=>(
      <div key={t.id} className={`px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center space-x-2 animate-in ${t.type==='success'?'bg-green-600 text-white':t.type==='error'?'bg-red-600 text-white':t.type==='info'?'bg-blue-600 text-white':'bg-orange-500 text-white'}`}>
        {t.type==='success'&&<CheckCircle size={16}/>}{t.type==='error'&&<XCircle size={16}/>}{t.type==='info'&&<AlertCircle size={16}/>}{t.type==='warning'&&<AlertTriangle size={16}/>}
        <span>{t.msg}</span>
      </div>
    ))}</div>
  </ToastContext.Provider>;
};
const useToast=()=>React.useContext(ToastContext);

const ConfirmDialog = ({isOpen,onClose,onConfirm,title,message,confirmText='확인',danger=false}) => {
  if(!isOpen)return null;
  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center space-x-3 mb-4">{danger?<AlertTriangle size={24} className="text-red-500"/>:<AlertCircle size={24} className="text-blue-500"/>}<h3 className="font-bold text-lg">{title}</h3></div>
        <p className="text-sm text-gray-600 mb-6 ml-9">{message}</p>
        <div className="flex space-x-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">취소</button>
          <button onClick={()=>{onConfirm();onClose();}} className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${danger?'bg-red-600 hover:bg-red-700':'bg-blue-600 hover:bg-blue-700'}`}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

// ==================== SERVICE PAGES ====================
const ToggleSwitch = ({on,label,onClick})=>(
  <div className="flex items-center space-x-2" onClick={e=>{e.stopPropagation();onClick&&onClick();}}>
    <div className={`w-9 h-5 rounded-full cursor-pointer transition-colors ${on?'bg-blue-600':'bg-gray-300'}`}><div className={`w-4 h-4 bg-white rounded-full shadow mt-0.5 transition-transform ${on?'translate-x-4.5 ml-0.5':'ml-0.5'}`}/></div>
    {label&&<span className="text-xs text-gray-500">{label}</span>}
  </div>
);

const TaskflowBuilderPage = () => {
  const toast=useToast();
  const [agents,setAgents]=useState(MOCK_AGENTS);
  const [selected,setSelected]=useState(null);
  const [tab,setTab]=useState('config');
  const [search,setSearch]=useState('');
  const [filterModel,setFilterModel]=useState('all');
  const [filterStatus,setFilterStatus]=useState('all');
  const [chatMsgs,setChatMsgs]=useState([{role:'assistant',text:'안녕하세요! 에이전트 테스트 모드입니다. 질문을 입력해 주세요.'}]);
  const [chatInput,setChatInput]=useState('');
  const [showCreateModal,setShowCreateModal]=useState(false);
  const [showDeleteConfirm,setShowDeleteConfirm]=useState(false);
  const [showDeployConfirm,setShowDeployConfirm]=useState(false);
  const [showRollbackConfirm,setShowRollbackConfirm]=useState(null);
  const [editForm,setEditForm]=useState({});
  const [newAgent,setNewAgent]=useState({name:'',desc:'',model:'GPT-OSS-120B',responseMode:'knowledge',systemPrompt:'',temperature:0.3,maxTokens:2048});
  const [hitlThreshold,setHitlThreshold]=useState(80);
  const chatEndRef=useRef(null);
  const filtered=agents.filter(a=>{
    if(search&&!a.name.includes(search)&&!a.desc.includes(search))return false;
    if(filterModel!=='all'&&a.model!==filterModel)return false;
    if(filterStatus!=='all'&&a.status!==filterStatus)return false;
    return true;
  });
  const selectAgent=(a)=>{setSelected({...a});setEditForm({name:a.name,desc:a.desc,systemPrompt:a.systemPrompt,model:a.model,temperature:a.temperature,maxTokens:a.maxTokens,responseMode:a.responseMode,mcpTools:[...a.mcpTools],ragEnabled:a.ragEnabled,hitl:a.hitl,a2a:a.a2a,actionable:a.actionable});setTab('config');setChatMsgs([{role:'assistant',text:'안녕하세요! 에이전트 테스트 모드입니다. 질문을 입력해 주세요.'}]);};
  const handleSave=()=>{setAgents(p=>p.map(a=>a.id===selected.id?{...a,...editForm,updated:new Date().toISOString().slice(0,10)}:a));setSelected(p=>({...p,...editForm}));toast('에이전트 설정이 저장되었습니다.');};
  const handleDelete=()=>{setAgents(p=>p.filter(a=>a.id!==selected.id));setSelected(null);setTab('config');toast('에이전트가 삭제되었습니다.','warning');};
  const toggleMcp=(name)=>{setEditForm(p=>{const has=p.mcpTools.includes(name);return{...p,mcpTools:has?p.mcpTools.filter(t=>t!==name):[...p.mcpTools,name]};});};
  const toggleField=(field)=>{setEditForm(p=>({...p,[field]:!p[field]}));};
  const handleCreate=()=>{if(!newAgent.name.trim()){toast('에이전트 이름을 입력하세요.','error');return;}const id='AGT-'+(agents.length+1).toString().padStart(3,'0');const now=new Date().toISOString().slice(0,10);const a={id,name:newAgent.name,desc:newAgent.desc,model:newAgent.model,tools:[],mcpTools:[],ragEnabled:false,hitl:false,a2a:false,responseMode:newAgent.responseMode,actionable:false,status:'Stopped',version:'v1.0',creator:'김영빈',dept:'AI활용 업무혁신 TF',created:now,updated:now,requests24h:0,avgLatency:'-',successRate:0,confidence:0,systemPrompt:newAgent.systemPrompt,temperature:newAgent.temperature,maxTokens:newAgent.maxTokens};setAgents(p=>[...p,a]);setShowCreateModal(false);setNewAgent({name:'',desc:'',model:'GPT-OSS-120B',responseMode:'knowledge',systemPrompt:'',temperature:0.3,maxTokens:2048});toast(`'${a.name}' 에이전트가 생성되었습니다.`);};
  const toggleAgentStatus=(id)=>{setAgents(p=>p.map(a=>a.id===id?{...a,status:a.status==='Running'?'Stopped':'Running'}:a));toast('에이전트 상태가 변경되었습니다.','info');};
  const sendChat=()=>{if(!chatInput.trim())return;const msg=chatInput;setChatMsgs(p=>[...p,{role:'user',text:msg}]);setChatInput('');setTimeout(()=>{const ef=editForm;setChatMsgs(p=>[...p,{role:'assistant',text:`[${ef.name||selected.name}] "${msg}"에 대해 ${ef.responseMode==='knowledge'?'사내 지식 DB를 참조하여':'LLM 직접 응답으로'} 답변드리겠습니다.\n\n${ef.mcpTools?.length>0?`MCP 도구 (${ef.mcpTools.join(', ')})를 활용하여 `:''}처리되었습니다.${ef.hitl?'\n\n⚠️ HITL 모드: 전문가 검토 후 최종 응답이 제공됩니다.':''}\n\n신뢰도: ${(selected.confidence*100).toFixed(0)}% | 응답 모드: ${ef.responseMode==='knowledge'?'지식 참조':'직접 응답'}`}]);setTimeout(()=>chatEndRef.current?.scrollIntoView({behavior:'smooth'}),50);},800);};
  const models=[...new Set(agents.map(a=>a.model))];
  const versionHistory=[{ver:'v2.1',change:'MCP 도구 연동 및 HITL 워크플로우 추가',author:'김세은',date:'2026-02-08'},{ver:'v2.0',change:'GPT-OSS-120B 모델로 전환, A2A 프로토콜 활성화',author:'김세은',date:'2026-01-20'},{ver:'v1.5',change:'RAG 파이프라인 연동 및 신뢰도 임계값 설정',author:'이준호',date:'2026-01-05'},{ver:'v1.0',change:'최초 에이전트 생성 (노코드 빌더)',author:'김세은',date:'2025-12-15'}];

  if(selected) return (
    <PageShell breadcrumb={['에이전트','태스크플로우','빌더',selected.name]}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button onClick={()=>{setSelected(null);setTab('config');}} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight size={18} className="rotate-180 text-gray-500"/></button>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${editForm.actionable?'bg-gradient-to-br from-purple-600 to-blue-600':'bg-blue-600'}`}><Bot size={20} className="text-white"/></div>
          <div><h2 className="text-lg font-bold">{editForm.name||selected.name}</h2>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="text-xs text-gray-500">{selected.id} · {selected.version}</span>
              {editForm.hitl&&<span className="bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded text-[10px] font-bold">HITL</span>}
              {editForm.a2a&&<span className="bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded text-[10px] font-bold">A2A</span>}
              {editForm.actionable&&<span className="bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 px-1.5 py-0.5 rounded text-[10px] font-bold">Actionable AI</span>}
            </div>
          </div>
          <StatusBadge status={selected.status}/>
        </div>
        <div className="flex space-x-2">
          <button onClick={()=>setShowDeleteConfirm(true)} className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 flex items-center space-x-1.5"><Trash2 size={15}/><span>삭제</span></button>
          <button onClick={handleSave} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center space-x-1.5"><Save size={15}/><span>저장</span></button>
          <button onClick={()=>setShowDeployConfirm(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-1.5"><Play size={15}/><span>배포</span></button>
        </div>
      </div>
      <ConfirmDialog isOpen={showDeleteConfirm} onClose={()=>setShowDeleteConfirm(false)} onConfirm={handleDelete} title="에이전트 삭제" message={`'${selected.name}' 에이전트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`} confirmText="삭제" danger/>
      <ConfirmDialog isOpen={showDeployConfirm} onClose={()=>setShowDeployConfirm(false)} onConfirm={()=>{handleSave();toast('에이전트가 배포 대기열에 추가되었습니다.','info');}} title="에이전트 배포" message={`'${editForm.name||selected.name}' 에이전트를 Production 환경에 배포하시겠습니까?`} confirmText="배포"/>
      <ConfirmDialog isOpen={showRollbackConfirm!==null} onClose={()=>setShowRollbackConfirm(null)} onConfirm={()=>{toast(`${versionHistory[showRollbackConfirm]?.ver} 버전으로 롤백되었습니다.`,'info');}} title="버전 롤백" message={`${versionHistory[showRollbackConfirm]?.ver} 버전으로 롤백하시겠습니까?`} confirmText="롤백" danger/>
      <div className="flex space-x-1 mb-6 border-b">
        {[['config','설정'],['tools','MCP 도구 & RAG'],['protocol','프로토콜'],['test','테스트'],['history','이력']].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab===k?'border-blue-600 text-blue-600':'border-transparent text-gray-500 hover:text-gray-800'}`}>{l}</button>
        ))}
      </div>

      {tab==='config'&&<div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-5">
          <div className="bg-white rounded-xl border p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-800">기본 정보</h3>
            <div><label className="block text-xs font-medium text-gray-500 mb-1.5">에이전트 이름</label><input value={editForm.name||''} onChange={e=>setEditForm(p=>({...p,name:e.target.value}))} className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"/></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1.5">설명</label><input value={editForm.desc||''} onChange={e=>setEditForm(p=>({...p,desc:e.target.value}))} className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"/></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1.5">시스템 프롬프트</label><textarea value={editForm.systemPrompt||''} onChange={e=>setEditForm(p=>({...p,systemPrompt:e.target.value}))} className="w-full h-28 px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-mono bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"/></div>
          </div>
          <div className="bg-white rounded-xl border p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-800">모델 설정</h3>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="block text-xs font-medium text-gray-500 mb-1.5">모델</label><select value={editForm.model||''} onChange={e=>setEditForm(p=>({...p,model:e.target.value}))} className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-white">{MOCK_MODELS.map(m=><option key={m.id} value={m.name}>{m.name}</option>)}</select></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1.5">Temperature</label><input type="number" value={editForm.temperature??0.3} onChange={e=>setEditForm(p=>({...p,temperature:parseFloat(e.target.value)||0}))} step="0.1" min="0" max="1" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm"/></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1.5">Max Tokens</label><input type="number" value={editForm.maxTokens||2048} onChange={e=>setEditForm(p=>({...p,maxTokens:parseInt(e.target.value)||2048}))} className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm"/></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-800">응답 모드 (SFR-011)</h3>
            <div className="grid grid-cols-2 gap-3">
              <div onClick={()=>setEditForm(p=>({...p,responseMode:'knowledge'}))} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${editForm.responseMode==='knowledge'?'border-blue-500 bg-blue-50/50':'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex items-center space-x-2 mb-2"><BookOpen size={18} className={editForm.responseMode==='knowledge'?'text-blue-600':'text-gray-400'}/><span className="font-bold text-sm">지식 참조 모드</span></div>
                <p className="text-xs text-gray-500">RAG 파이프라인을 통한 사내 문서 기반 응답. 규정·매뉴얼 등 정확한 참조가 필요한 업무에 적합.</p>
              </div>
              <div onClick={()=>setEditForm(p=>({...p,responseMode:'direct'}))} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${editForm.responseMode==='direct'?'border-blue-500 bg-blue-50/50':'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex items-center space-x-2 mb-2"><Zap size={18} className={editForm.responseMode==='direct'?'text-blue-600':'text-gray-400'}/><span className="font-bold text-sm">직접 응답 모드</span></div>
                <p className="text-xs text-gray-500">LLM 자체 지식으로 즉각 응답. 일반 질의, 번역, 요약 등 창의적 업무에 적합.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="bg-white rounded-xl border p-5 shadow-sm">
            <h3 className="font-bold text-sm text-gray-800 mb-4">에이전트 정보</h3>
            <div className="space-y-3 text-sm">{[['ID',selected.id],['생성자',selected.creator],['부서',selected.dept],['생성일',selected.created],['수정일',selected.updated]].map(([k,v],i)=>(
              <div key={i} className="flex justify-between"><span className="text-gray-400">{k}</span><span className="font-medium">{v}</span></div>
            ))}</div>
          </div>
          <div className="bg-white rounded-xl border p-5 shadow-sm">
            <h3 className="font-bold text-sm text-gray-800 mb-4">실시간 지표</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 text-center"><div className="text-2xl font-bold text-blue-700">{selected.requests24h}</div><div className="text-xs text-blue-500">24h 요청 수</div></div>
              <div className="bg-green-50 rounded-lg p-3 text-center"><div className="text-2xl font-bold text-green-700">{selected.avgLatency}</div><div className="text-xs text-green-500">평균 응답시간</div></div>
              <div className="bg-purple-50 rounded-lg p-3 text-center"><div className="text-2xl font-bold text-purple-700">{selected.successRate}%</div><div className="text-xs text-purple-500">성공률</div></div>
              <div className={`rounded-lg p-3 text-center ${selected.confidence>=0.9?'bg-green-50':selected.confidence>=0.7?'bg-yellow-50':'bg-red-50'}`}><div className={`text-2xl font-bold ${selected.confidence>=0.9?'text-green-700':selected.confidence>=0.7?'text-yellow-700':'text-red-700'}`}>{(selected.confidence*100).toFixed(0)}%</div><div className="text-xs text-gray-500">신뢰도</div></div>
            </div>
          </div>
        </div>
      </div>}

      {tab==='tools'&&<div className="grid grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="font-bold text-sm mb-4 flex items-center"><Unplug size={16} className="mr-1.5 text-purple-600"/>MCP 도구 연결</h3>
            <p className="text-xs text-gray-500 mb-4">Model Context Protocol을 통해 외부 시스템 및 도구를 표준화된 방식으로 연동합니다.</p>
            <div className="space-y-2.5">
              {[{name:'MCP-Search',desc:'벡터 DB 시맨틱 검색'},{name:'MCP-WebSearch',desc:'외부 웹 검색 엔진'},{name:'MCP-WebCrawler',desc:'웹 페이지 크롤링'},{name:'MCP-RTMS',desc:'IoT 센서 실시간 데이터'},{name:'MCP-ERPConnector',desc:'ERP 시스템 연동 (SAP/Oracle)'},{name:'MCP-GWSync',desc:'그룹웨어 일정/문서 동기화'},{name:'MCP-CodeDev',desc:'코드 생성 및 실행'},{name:'MCP-DynamicFilter',desc:'동적 데이터 필터링'}].map((t,i)=>{const active=editForm.mcpTools?.includes(t.name);return(
                <div key={i} className={`flex items-center justify-between px-3.5 py-3 rounded-lg border transition-all ${active?'border-purple-200 bg-purple-50/50':'border-gray-200'}`}>
                  <div className="flex items-center space-x-2"><Unplug size={14} className={active?'text-purple-600':'text-gray-400'}/><div><div className="text-sm font-medium">{t.name}</div><div className="text-xs text-gray-400">{t.desc}</div></div></div>
                  <ToggleSwitch on={active} onClick={()=>toggleMcp(t.name)}/>
                </div>
              );})}
            </div>
            <button onClick={()=>toast('MCP 서버 마켓플레이스에서 도구를 추가합니다.','info')} className="mt-4 w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-purple-400 hover:text-purple-600 flex items-center justify-center space-x-1"><Plus size={15}/><span>MCP 서버에서 추가</span></button>
          </div>
        </div>
        <div className="space-y-5">
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="font-bold text-sm mb-4 flex items-center"><Database size={16} className="mr-1.5 text-blue-600"/>내부 도구 연결</h3>
            <div className="space-y-2.5">
              {[{name:'사내 규정 벡터 DB',icon:Database,desc:'공시 규정 및 매뉴얼 검색',active:true},{name:'공시가격 이력 DB',icon:HardDrive,desc:'공시가격 산정 이력 조회',active:selected.tools.includes('공시가격 이력 DB')},{name:'알림 서비스 API',icon:Bell,desc:'Slack/Email 알림 발송',active:selected.tools.includes('알림 서비스 API')}].map((t,i)=>(
                <div key={i} className={`flex items-center justify-between px-3.5 py-3 rounded-lg border ${t.active?'border-blue-200 bg-blue-50/50':'border-gray-200'}`}>
                  <div className="flex items-center space-x-2"><t.icon size={14} className={t.active?'text-blue-600':'text-gray-400'}/><div><div className="text-sm font-medium">{t.name}</div><div className="text-xs text-gray-400">{t.desc}</div></div></div>
                  <ToggleSwitch on={t.active} onClick={()=>toast(`${t.name} 도구 ${t.active?'비활성화':'활성화'}됨`,'info')}/>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-sm flex items-center"><BookOpen size={16} className="mr-1.5 text-green-600"/>RAG 설정</h3><ToggleSwitch on={editForm.ragEnabled} onClick={()=>toggleField('ragEnabled')}/></div>
            {editForm.ragEnabled&&<div className="space-y-4">
              <div><label className="block text-xs font-medium text-gray-500 mb-1.5">벡터 DB 컬렉션</label><select className="w-full px-3.5 py-2.5 border rounded-lg text-sm bg-white"><option>safety_regulations_v2</option><option>maintenance_manuals</option><option>hr_policies</option></select></div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-xs text-gray-500">Chunk Size</label><input type="number" defaultValue={512} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"/></div>
                <div><label className="text-xs text-gray-500">Top-K</label><input type="number" defaultValue={5} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"/></div>
                <div><label className="text-xs text-gray-500">유사도</label><input type="number" defaultValue={0.75} step="0.05" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"/></div>
              </div>
            </div>}
            {!editForm.ragEnabled&&<p className="text-xs text-gray-400">RAG를 활성화하면 벡터 DB 기반의 사내 문서 검색이 가능합니다.</p>}
          </div>
        </div>
      </div>}

      {tab==='protocol'&&<div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="font-bold text-sm mb-2 flex items-center"><Users size={16} className="mr-1.5 text-orange-500"/>HITL (Human-in-the-Loop)</h3>
          <p className="text-xs text-gray-500 mb-4">신뢰도가 낮거나 중요 결정이 필요한 응답에 대해 전문가 검토를 요청합니다.</p>
          <div className="flex items-center justify-between p-4 rounded-xl bg-orange-50/50 border border-orange-200 mb-4">
            <div><span className="font-bold text-sm">HITL 모드 활성화</span><p className="text-xs text-gray-500 mt-0.5">전문가 승인 후 응답 제공</p></div>
            <ToggleSwitch on={editForm.hitl} onClick={()=>toggleField('hitl')}/>
          </div>
          {editForm.hitl&&<div className="space-y-3 pl-4 border-l-2 border-orange-300">
            <div><label className="text-xs text-gray-500">검토 요청 임계값 (신뢰도)</label><div className="flex items-center space-x-2 mt-1"><input type="range" min="50" max="95" value={hitlThreshold} onChange={e=>setHitlThreshold(+e.target.value)} className="flex-1"/><span className="text-sm font-bold text-orange-600">{hitlThreshold}%</span></div></div>
            <div><label className="text-xs text-gray-500">검토자 지정</label><select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white"><option>부서 관리자 자동 배정</option><option>지정 전문가 그룹</option></select></div>
            <div><label className="text-xs text-gray-500">검토 SLA</label><select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white"><option>30분 이내</option><option>1시간 이내</option><option>4시간 이내</option></select></div>
          </div>}
        </div>
        <div className="space-y-5">
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="font-bold text-sm mb-2 flex items-center"><GitBranch size={16} className="mr-1.5 text-purple-600"/>A2A (Agent-to-Agent)</h3>
            <p className="text-xs text-gray-500 mb-4">다른 에이전트와 협업하여 복잡한 태스크를 수행합니다.</p>
            <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50/50 border border-purple-200 mb-4">
              <div><span className="font-bold text-sm">A2A 프로토콜 활성화</span><p className="text-xs text-gray-500 mt-0.5">에이전트 간 협업 통신 허용</p></div>
              <ToggleSwitch on={editForm.a2a} onClick={()=>toggleField('a2a')}/>
            </div>
            {editForm.a2a&&<div className="space-y-2">
              <div className="text-xs text-gray-500 mb-2">연결 가능한 에이전트:</div>
              {agents.filter(a=>a.id!==selected.id&&a.a2a).map(a=>(
                <div key={a.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 border">
                  <div className="flex items-center space-x-2"><Bot size={14} className="text-purple-500"/><span className="text-sm">{a.name}</span></div>
                  <StatusBadge status={a.status}/>
                </div>
              ))}
            </div>}
          </div>
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="font-bold text-sm mb-2 flex items-center"><Monitor size={16} className="mr-1.5 text-blue-600"/>Actionable AI</h3>
            <p className="text-xs text-gray-500 mb-4">실제 컴퓨터/브라우저 환경에서 업무를 직접 수행하는 실행형 AI 에이전트.</p>
            <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50/50 border border-blue-200">
              <div><span className="font-bold text-sm">Actionable AI 모드</span><p className="text-xs text-gray-500 mt-0.5">ERP, 그룹웨어 등 업무 자동 수행</p></div>
              <ToggleSwitch on={editForm.actionable} onClick={()=>toggleField('actionable')}/>
            </div>
          </div>
        </div>
      </div>}

      {tab==='test'&&<div className="bg-white rounded-xl border shadow-sm flex flex-col" style={{height:'calc(100vh - 280px)'}}>
        <div className="px-5 py-3 border-b bg-gray-50/80 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center space-x-2 text-sm"><Bot size={16} className="text-blue-600"/><span className="font-medium">{editForm.name||selected.name}</span></div>
          <div className="flex items-center space-x-2 text-xs">
            <span className={`px-2 py-0.5 rounded ${editForm.responseMode==='knowledge'?'bg-green-50 text-green-700':'bg-blue-50 text-blue-700'}`}>{editForm.responseMode==='knowledge'?'지식 참조':'직접 응답'}</span>
            {editForm.hitl&&<span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded">HITL</span>}
            <span className="text-gray-400">{editForm.model} T={editForm.temperature}</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {chatMsgs.map((m,i)=><div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}><div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${m.role==='user'?'bg-blue-600 text-white rounded-br-md':'bg-gray-100 text-gray-800 rounded-bl-md'}`}>{m.text}</div></div>)}
          <div ref={chatEndRef}/>
        </div>
        <div className="p-4 border-t bg-white rounded-b-xl">
          <div className="flex space-x-2"><input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendChat()} placeholder="테스트 메시지를 입력하세요..." className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"/><button onClick={sendChat} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700"><Send size={16}/></button></div>
          <div className="flex items-center space-x-3 mt-2 text-[10px] text-gray-400"><AlertTriangle size={10}/><span>테스트 환경에서의 응답입니다. 실제 운영 환경과 다를 수 있습니다.</span></div>
        </div>
      </div>}

      {tab==='history'&&<div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50/80"><tr>
          <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">버전</th><th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">변경 내용</th><th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">작성자</th><th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">날짜</th><th className="px-5 py-3.5 text-center text-xs font-medium text-gray-500">롤백</th>
        </tr></thead><tbody className="divide-y divide-gray-100">{versionHistory.map((v,i)=>(
          <tr key={i} className="hover:bg-gray-50"><td className="px-5 py-3.5"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-xs font-bold">{v.ver}</span></td><td className="px-5 py-3.5 text-gray-700">{v.change}</td><td className="px-5 py-3.5 text-gray-500">{v.author}</td><td className="px-5 py-3.5 text-gray-400">{v.date}</td><td className="px-5 py-3.5 text-center">{i>0&&<button onClick={()=>setShowRollbackConfirm(i)} className="px-2.5 py-1 text-xs border rounded hover:bg-gray-50 text-gray-500"><RotateCcw size={10} className="inline mr-1"/>롤백</button>}</td></tr>
        ))}</tbody></table>
      </div>}
    </PageShell>
  );

  return (
    <PageShell breadcrumb={['에이전트','태스크플로우','빌더']} title="에이전트 빌더 (노코드)" action={<button onClick={()=>setShowCreateModal(true)} className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center shadow-sm hover:bg-blue-700"><Plus size={16} className="mr-1.5"/>새 에이전트 생성</button>}>
      <div className="flex items-center space-x-3 mb-5">
        <div className="relative flex-1 max-w-sm"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="에이전트 검색..." className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"/><Search size={16} className="absolute left-3 top-3 text-gray-400"/></div>
        <select value={filterModel} onChange={e=>setFilterModel(e.target.value)} className="px-3 py-2.5 border rounded-lg text-sm bg-white"><option value="all">전체 모델</option>{models.map(m=><option key={m} value={m}>{m}</option>)}</select>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="px-3 py-2.5 border rounded-lg text-sm bg-white"><option value="all">전체 상태</option><option value="Running">Running</option><option value="Stopped">Stopped</option></select>
      </div>
      <div className="grid grid-cols-3 gap-5">{filtered.map(a=>(
        <div key={a.id} className="bg-white rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all p-5 group">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2.5" onClick={()=>selectAgent(a)}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform ${a.actionable?'bg-gradient-to-br from-purple-100 to-blue-100':'bg-blue-50'}`}><Bot size={18} className={a.actionable?'text-purple-600':'text-blue-600'}/></div>
              <div><div className="font-bold text-sm">{a.name}</div><span className="text-xs text-gray-400">{a.id}</span></div>
            </div>
            <div className="flex items-center space-x-2">
              <StatusBadge status={a.status}/>
              <button onClick={e=>{e.stopPropagation();toggleAgentStatus(a.id);}} className="p-1 hover:bg-gray-100 rounded" title={a.status==='Running'?'중지':'시작'}><Power size={13} className={a.status==='Running'?'text-green-500':'text-gray-400'}/></button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed" onClick={()=>selectAgent(a)}>{a.desc}</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs">{a.model}</span>
            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs font-medium">{a.version}</span>
            {a.ragEnabled&&<span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-md text-xs">RAG</span>}
            {a.hitl&&<span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-md text-xs">HITL</span>}
            {a.a2a&&<span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded-md text-xs">A2A</span>}
            {a.actionable&&<span className="bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 px-2 py-0.5 rounded-md text-xs">Actionable</span>}
          </div>
          {a.mcpTools.length>0&&<div className="flex items-center space-x-1 mb-3 text-[10px] text-purple-500"><Unplug size={10}/><span>MCP: {a.mcpTools.join(', ')}</span></div>}
          <div className="border-t pt-3 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-3">
              <span className="flex items-center"><Activity size={12} className="mr-1"/>{a.requests24h}/day</span>
              <span className="flex items-center"><Clock size={12} className="mr-1"/>{a.avgLatency}</span>
            </div>
            <span className={`font-bold ${a.confidence>=0.9?'text-green-600':a.confidence>=0.7?'text-yellow-600':'text-red-500'}`}>{(a.confidence*100).toFixed(0)}%</span>
          </div>
          <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs">
            <span className="text-gray-400">{a.creator} · {a.dept}</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] ${a.responseMode==='knowledge'?'bg-green-50 text-green-600':'bg-blue-50 text-blue-600'}`}>{a.responseMode==='knowledge'?'지식 참조':'직접 응답'}</span>
          </div>
        </div>
      ))}</div>
      {filtered.length===0&&<div className="text-center py-16 text-gray-400"><Bot size={40} className="mx-auto mb-3 text-gray-300"/><p className="text-sm">검색 조건에 맞는 에이전트가 없습니다.</p></div>}
      <Modal isOpen={showCreateModal} onClose={()=>setShowCreateModal(false)} title="새 에이전트 생성" size="md">
        <div className="space-y-4">
          <div><label className="text-sm font-bold">에이전트 이름 *</label><input value={newAgent.name} onChange={e=>setNewAgent(p=>({...p,name:e.target.value}))} placeholder="예: 공시업무규정 검색 에이전트" className="w-full mt-1 px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"/></div>
          <div><label className="text-sm font-bold">설명</label><input value={newAgent.desc} onChange={e=>setNewAgent(p=>({...p,desc:e.target.value}))} placeholder="에이전트 역할을 간략히 설명하세요" className="w-full mt-1 px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-bold">모델</label><select value={newAgent.model} onChange={e=>setNewAgent(p=>({...p,model:e.target.value}))} className="w-full mt-1 px-3.5 py-2.5 border rounded-lg text-sm bg-white">{MOCK_MODELS.map(m=><option key={m.id} value={m.name}>{m.name}</option>)}</select></div>
            <div><label className="text-sm font-bold">응답 모드</label><select value={newAgent.responseMode} onChange={e=>setNewAgent(p=>({...p,responseMode:e.target.value}))} className="w-full mt-1 px-3.5 py-2.5 border rounded-lg text-sm bg-white"><option value="knowledge">지식 참조</option><option value="direct">직접 응답</option></select></div>
          </div>
          <div><label className="text-sm font-bold">시스템 프롬프트</label><textarea value={newAgent.systemPrompt} onChange={e=>setNewAgent(p=>({...p,systemPrompt:e.target.value}))} placeholder="에이전트의 역할과 행동 지침을 정의하세요..." className="w-full mt-1 h-24 px-3.5 py-2.5 border rounded-lg text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20"/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-bold">Temperature</label><input type="number" value={newAgent.temperature} onChange={e=>setNewAgent(p=>({...p,temperature:parseFloat(e.target.value)||0}))} step="0.1" min="0" max="1" className="w-full mt-1 px-3.5 py-2.5 border rounded-lg text-sm"/></div>
            <div><label className="text-sm font-bold">Max Tokens</label><input type="number" value={newAgent.maxTokens} onChange={e=>setNewAgent(p=>({...p,maxTokens:parseInt(e.target.value)||2048}))} className="w-full mt-1 px-3.5 py-2.5 border rounded-lg text-sm"/></div>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
          <button onClick={()=>setShowCreateModal(false)} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">취소</button>
          <button onClick={handleCreate} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">생성</button>
        </div>
      </Modal>
    </PageShell>
  );
};

const TaskflowDeployPage = () => {
  const toast=useToast();
  const [deploys,setDeploys]=useState(MOCK_AGENT_DEPLOYS);
  const [selDep,setSelDep]=useState(null);
  const [showCreateModal,setShowCreateModal]=useState(false);
  const [showScaleModal,setShowScaleModal]=useState(false);
  const [scaleReplicas,setScaleReplicas]=useState(1);
  const [showStopConfirm,setShowStopConfirm]=useState(false);
  const [showRedeployConfirm,setShowRedeployConfirm]=useState(false);
  const [newDeploy,setNewDeploy]=useState({agentName:'공시업무규정 검색 에이전트',env:'Production',replicas:2,cpu:'2 Core',memory:'8 GB',gpu:'-'});
  const running=deploys.filter(d=>d.status==='Running').length;
  const totalReq=deploys.reduce((s,d)=>s+d.requests24h,0);
  const avgErr=running?(deploys.filter(d=>d.status==='Running').reduce((s,d)=>s+d.errorRate,0)/running).toFixed(1):'0';
  const handleStopStart=()=>{const newSt=selDep.status==='Running'?'Stopped':'Running';setDeploys(p=>p.map(d=>d.id===selDep.id?{...d,status:newSt,replicas:newSt==='Stopped'?0:d.replicas||2}:d));setSelDep(p=>({...p,status:newSt,replicas:newSt==='Stopped'?0:p.replicas||2}));toast(`배포가 ${newSt==='Running'?'시작':'중지'}되었습니다.`,newSt==='Running'?'success':'warning');};
  const handleRedeploy=()=>{const now=new Date();const dateStr=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;setDeploys(p=>p.map(d=>d.id===selDep.id?{...d,status:'Restarting',deployDate:dateStr}:d));setSelDep(p=>({...p,status:'Restarting',deployDate:dateStr}));toast('재배포 시작됨...','info');setTimeout(()=>{setDeploys(p=>p.map(d=>d.id===selDep.id?{...d,status:'Running'}:d));setSelDep(p=>p?{...p,status:'Running'}:p);toast('재배포가 완료되었습니다.');},2000);};
  const handleScale=()=>{setDeploys(p=>p.map(d=>d.id===selDep.id?{...d,replicas:scaleReplicas}:d));setSelDep(p=>({...p,replicas:scaleReplicas}));setShowScaleModal(false);toast(`Replicas가 ${scaleReplicas}개로 조정되었습니다.`);};
  const copyEndpoint=()=>{navigator.clipboard?.writeText(selDep.endpoint).catch(()=>{});toast('엔드포인트가 클립보드에 복사되었습니다.');};
  const handleCreateDeploy=()=>{const id='DEP-'+(deploys.length+1).toString().padStart(3,'0');const now=new Date();const dateStr=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;const d={id,agentId:'AGT-NEW',agentName:newDeploy.agentName,model:'GPT-OSS-120B',version:'v1.0',env:newDeploy.env,endpoint:`/api/agent/${id.toLowerCase()}`,deployDate:dateStr,deployer:'김영빈',status:'Running',replicas:newDeploy.replicas,cpu:newDeploy.cpu,memory:newDeploy.memory,gpu:newDeploy.gpu,uptime:'0h',requests24h:0,errorRate:0};setDeploys(p=>[...p,d]);setShowCreateModal(false);toast(`'${d.agentName}' 배포가 생성되었습니다.`);};
  return (
    <PageShell breadcrumb={['에이전트','태스크플로우','배포']} title="배포 관리" action={<button onClick={()=>setShowCreateModal(true)} className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center shadow-sm hover:bg-blue-700"><Plus size={16} className="mr-1.5"/>새 배포</button>}>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[{label:'총 배포 수',value:deploys.length,unit:'개',color:'border-blue-500 bg-blue-50',tc:'text-blue-700'},{label:'실행 중',value:running,unit:'개',color:'border-green-500 bg-green-50',tc:'text-green-700'},{label:'24h 총 요청',value:totalReq.toLocaleString(),unit:'건',color:'border-purple-500 bg-purple-50',tc:'text-purple-700'},{label:'평균 에러율',value:avgErr,unit:'%',color:'border-orange-500 bg-orange-50',tc:'text-orange-700'}].map((c,i)=>(
          <div key={i} className={`p-5 rounded-xl border-l-4 bg-white shadow-sm ${c.color}`}>
            <div className="text-xs text-gray-500 mb-1">{c.label}</div>
            <div className={`text-2xl font-bold ${c.tc}`}>{c.value}<span className="text-sm font-normal text-gray-400 ml-1">{c.unit}</span></div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50/80"><tr>
          <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">배포 ID</th>
          <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">에이전트</th>
          <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">모델</th>
          <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">버전</th>
          <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">환경</th>
          <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">Replicas</th>
          <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">상태</th>
          <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">배포일</th>
          <th className="px-5 py-3.5 text-center text-xs font-medium text-gray-500">상세</th>
        </tr></thead><tbody className="divide-y divide-gray-100">{deploys.map(d=>(
          <tr key={d.id} className="hover:bg-gray-50/50">
            <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{d.id}</td>
            <td className="px-5 py-3.5 font-medium">{d.agentName}</td>
            <td className="px-5 py-3.5 text-gray-600">{d.model}</td>
            <td className="px-5 py-3.5"><span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs font-medium">{d.version}</span></td>
            <td className="px-5 py-3.5"><span className={`px-2 py-0.5 rounded-md text-xs font-medium ${d.env==='Production'?'bg-green-50 text-green-700':'bg-yellow-50 text-yellow-700'}`}>{d.env}</span></td>
            <td className="px-5 py-3.5 text-gray-600">{d.replicas}</td>
            <td className="px-5 py-3.5"><StatusBadge status={d.status}/></td>
            <td className="px-5 py-3.5 text-gray-400 text-xs">{d.deployDate}</td>
            <td className="px-5 py-3.5 text-center"><button onClick={()=>setSelDep(d)} className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600"><Eye size={15}/></button></td>
          </tr>
        ))}</tbody></table>
      </div>
      <Modal isOpen={!!selDep} onClose={()=>setSelDep(null)} title={`${selDep?.agentName} 배포 상세`} size="lg">
        {selDep&&<div className="space-y-5">
          <div className="flex items-center space-x-3 mb-2">
            <StatusBadge status={selDep.status}/>
            <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${selDep.env==='Production'?'bg-green-50 text-green-700':'bg-yellow-50 text-yellow-700'}`}>{selDep.env}</span>
            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs font-medium">{selDep.version}</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[{l:'CPU',v:selDep.cpu},{l:'메모리',v:selDep.memory},{l:'GPU',v:selDep.gpu},{l:'Replicas',v:selDep.replicas}].map((r,i)=>(
              <div key={i} className="bg-gray-50 rounded-lg p-3"><div className="text-xs text-gray-400">{r.l}</div><div className="font-bold mt-0.5">{r.v}</div></div>
            ))}
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs text-gray-400 mb-1">엔드포인트</div>
            <div className="flex items-center space-x-2"><code className="text-sm font-mono bg-white px-3 py-1.5 rounded border flex-1">{selDep.endpoint}</code><button onClick={copyEndpoint} className="p-2 hover:bg-gray-200 rounded-lg" title="복사"><Copy size={14}/></button></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 text-center"><div className="text-xl font-bold text-blue-700">{selDep.requests24h}</div><div className="text-xs text-blue-500">24h 요청</div></div>
            <div className="bg-green-50 rounded-lg p-3 text-center"><div className="text-xl font-bold text-green-700">{selDep.uptime}</div><div className="text-xs text-green-500">업타임</div></div>
            <div className="bg-orange-50 rounded-lg p-3 text-center"><div className="text-xl font-bold text-orange-700">{selDep.errorRate}%</div><div className="text-xs text-orange-500">에러율</div></div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-green-400 h-32 overflow-y-auto">
            <div className="text-gray-500 border-b border-gray-700 pb-1 mb-2">최근 로그</div>
            <div>[2026-02-13 09:30:12] INFO Agent {selDep.agentName} processed request #4821</div>
            <div>[2026-02-13 09:29:45] INFO Response generated in {selDep.status==='Running'?'1.2':'0.0'}s</div>
            <div>[2026-02-13 09:28:33] INFO RAG retrieval: 5 chunks, similarity 0.89</div>
            <div className="text-yellow-400">[2026-02-13 09:25:11] WARN Token limit approaching (1856/2048)</div>
          </div>
          <div className="flex space-x-2 justify-end pt-2">
            <button onClick={()=>{setScaleReplicas(selDep.replicas||1);setShowScaleModal(true);}} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">스케일 조정</button>
            <button onClick={()=>setShowStopConfirm(true)} className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50">{selDep.status==='Running'?'중지':'시작'}</button>
            <button onClick={()=>setShowRedeployConfirm(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">재배포</button>
          </div>
        </div>}
      </Modal>
      <ConfirmDialog isOpen={showStopConfirm} onClose={()=>setShowStopConfirm(false)} onConfirm={handleStopStart} title={selDep?.status==='Running'?'배포 중지':'배포 시작'} message={`'${selDep?.agentName}'을(를) ${selDep?.status==='Running'?'중지':'시작'}하시겠습니까?`} confirmText={selDep?.status==='Running'?'중지':'시작'} danger={selDep?.status==='Running'}/>
      <ConfirmDialog isOpen={showRedeployConfirm} onClose={()=>setShowRedeployConfirm(false)} onConfirm={handleRedeploy} title="재배포 확인" message={`'${selDep?.agentName}'을(를) 재배포하시겠습니까? 일시적으로 서비스가 중단될 수 있습니다.`} confirmText="재배포"/>
      <Modal isOpen={showScaleModal} onClose={()=>setShowScaleModal(false)} title="스케일 조정" size="sm">
        <div className="space-y-4">
          <div><label className="text-sm font-bold">Replicas 수</label><div className="flex items-center space-x-4 mt-2">
            <button onClick={()=>setScaleReplicas(p=>Math.max(0,p-1))} className="w-10 h-10 border rounded-lg flex items-center justify-center text-lg font-bold hover:bg-gray-50">-</button>
            <span className="text-3xl font-bold text-blue-600 w-12 text-center">{scaleReplicas}</span>
            <button onClick={()=>setScaleReplicas(p=>Math.min(10,p+1))} className="w-10 h-10 border rounded-lg flex items-center justify-center text-lg font-bold hover:bg-gray-50">+</button>
          </div></div>
          <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700">현재 Replicas: {selDep?.replicas || 0}개 → 변경: {scaleReplicas}개</div>
        </div>
        <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
          <button onClick={()=>setShowScaleModal(false)} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">취소</button>
          <button onClick={handleScale} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">적용</button>
        </div>
      </Modal>
      <Modal isOpen={showCreateModal} onClose={()=>setShowCreateModal(false)} title="새 배포 생성" size="md">
        <div className="space-y-4">
          <div><label className="text-sm font-bold">에이전트</label><select value={newDeploy.agentName} onChange={e=>setNewDeploy(p=>({...p,agentName:e.target.value}))} className="w-full mt-1 px-3.5 py-2.5 border rounded-lg text-sm bg-white">{MOCK_AGENTS.map(a=><option key={a.id} value={a.name}>{a.name}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-bold">환경</label><select value={newDeploy.env} onChange={e=>setNewDeploy(p=>({...p,env:e.target.value}))} className="w-full mt-1 px-3.5 py-2.5 border rounded-lg text-sm bg-white"><option>Production</option><option>Staging</option></select></div>
            <div><label className="text-sm font-bold">Replicas</label><input type="number" value={newDeploy.replicas} onChange={e=>setNewDeploy(p=>({...p,replicas:parseInt(e.target.value)||1}))} min="1" max="10" className="w-full mt-1 px-3.5 py-2.5 border rounded-lg text-sm"/></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="text-sm font-bold">CPU</label><select value={newDeploy.cpu} onChange={e=>setNewDeploy(p=>({...p,cpu:e.target.value}))} className="w-full mt-1 px-3.5 py-2.5 border rounded-lg text-sm bg-white"><option>1 Core</option><option>2 Core</option><option>4 Core</option></select></div>
            <div><label className="text-sm font-bold">메모리</label><select value={newDeploy.memory} onChange={e=>setNewDeploy(p=>({...p,memory:e.target.value}))} className="w-full mt-1 px-3.5 py-2.5 border rounded-lg text-sm bg-white"><option>4 GB</option><option>8 GB</option><option>16 GB</option></select></div>
            <div><label className="text-sm font-bold">GPU</label><select value={newDeploy.gpu} onChange={e=>setNewDeploy(p=>({...p,gpu:e.target.value}))} className="w-full mt-1 px-3.5 py-2.5 border rounded-lg text-sm bg-white"><option>-</option><option>H200 x1</option><option>H200 x2</option><option>L40S x1</option></select></div>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
          <button onClick={()=>setShowCreateModal(false)} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">취소</button>
          <button onClick={handleCreateDeploy} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">배포</button>
        </div>
      </Modal>
    </PageShell>
  );
};

const WorkflowStepNode = ({step,isLast}) => {
  const cfg={trigger:{bg:'bg-orange-50',border:'border-orange-300',icon:Zap,iconColor:'text-orange-500',label:'트리거'},agent:{bg:'bg-blue-50',border:'border-blue-300',icon:Bot,iconColor:'text-blue-600',label:'에이전트'},condition:{bg:'bg-yellow-50',border:'border-yellow-300',icon:Filter,iconColor:'text-yellow-600',label:'조건 분기'},action:{bg:'bg-green-50',border:'border-green-300',icon:Play,iconColor:'text-green-600',label:'액션'},hitl:{bg:'bg-orange-50',border:'border-orange-400',icon:Users,iconColor:'text-orange-600',label:'HITL 검토'},mcp:{bg:'bg-purple-50',border:'border-purple-300',icon:Unplug,iconColor:'text-purple-600',label:'MCP 도구'}};
  const c=cfg[step.type]||cfg.action;
  return (
    <div className="flex items-center shrink-0">
      <div className={`w-36 ${c.bg} border-2 ${c.border} rounded-xl p-3 text-center shadow-sm hover:shadow-md transition-shadow`}>
        <c.icon size={20} className={`mx-auto mb-1.5 ${c.iconColor}`}/>
        <div className="text-xs font-bold text-gray-800 leading-tight">{step.name}</div>
        <div className="text-[10px] text-gray-400 mt-0.5">{c.label}</div>
      </div>
      {!isLast&&<div className="w-8 flex items-center justify-center shrink-0"><ArrowRight size={16} className="text-gray-300"/></div>}
    </div>
  );
};

const WorkflowPage = () => {
  const toast=useToast();
  const [workflows,setWorkflows]=useState(MOCK_WORKFLOWS);
  const [expanded,setExpanded]=useState({});
  const [showCreateModal,setShowCreateModal]=useState(false);
  const [runningWf,setRunningWf]=useState({});
  const [showRunConfirm,setShowRunConfirm]=useState(null);
  const [showStopConfirm,setShowStopConfirm]=useState(null);
  const [newWf,setNewWf]=useState({name:'',desc:'',protocol:'MCP',hitl:false});
  const toggle=(id)=>setExpanded(p=>({...p,[id]:!p[id]}));
  const [wfRuns,setWfRuns]=useState({});
  const mockRuns=[
    {id:'RUN-0081',start:'2026-02-13 09:30',duration:'2m 14s',status:'완료'},{id:'RUN-0080',start:'2026-02-13 08:15',duration:'1m 58s',status:'완료'},
    {id:'RUN-0079',start:'2026-02-12 17:42',duration:'3m 05s',status:'오류 발생'},{id:'RUN-0078',start:'2026-02-12 14:20',duration:'2m 31s',status:'완료'},
  ];
  const handleRun=(wfId)=>{setRunningWf(p=>({...p,[wfId]:true}));toast('워크플로우 실행이 시작되었습니다.','info');const now=new Date();const dateStr=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;setTimeout(()=>{setRunningWf(p=>({...p,[wfId]:false}));const newRun={id:`RUN-${String(Math.floor(Math.random()*9000)+1000)}`,start:dateStr,duration:`${Math.floor(Math.random()*3)+1}m ${String(Math.floor(Math.random()*60)).padStart(2,'0')}s`,status:'완료'};setWfRuns(p=>({...p,[wfId]:[newRun,...(p[wfId]||[])]}));setWorkflows(p=>p.map(w=>w.id===wfId?{...w,lastRun:dateStr,runs24h:w.runs24h+1}:w));toast('워크플로우 실행이 완료되었습니다.');},3000);};
  const handleStop=(wfId)=>{setWorkflows(p=>p.map(w=>w.id===wfId?{...w,status:w.status==='Running'?'Stopped':'Running'}:w));toast(`워크플로우가 ${workflows.find(w=>w.id===wfId)?.status==='Running'?'중지':'시작'}되었습니다.`,workflows.find(w=>w.id===wfId)?.status==='Running'?'warning':'success');};
  const handleCreate=()=>{if(!newWf.name.trim()){toast('워크플로우 이름을 입력하세요.','error');return;}const id='WF-'+(workflows.length+1).toString().padStart(3,'0');const now=new Date().toISOString().slice(0,10);const wf={id,name:newWf.name,desc:newWf.desc,status:'Stopped',creator:'김영빈',created:now,lastRun:'-',runs24h:0,successRate:0,protocol:newWf.protocol,hitl:newWf.hitl,steps:[{id:'s1',name:'트리거 이벤트',type:'trigger',agentId:null},{id:'s2',name:'에이전트 처리',type:'agent',agentId:'AGT-001'}]};setWorkflows(p=>[...p,wf]);setShowCreateModal(false);setNewWf({name:'',desc:'',protocol:'MCP',hitl:false});toast(`'${wf.name}' 워크플로우가 생성되었습니다.`);};
  return (
    <PageShell breadcrumb={['에이전트','워크플로우']} title="멀티 에이전트 워크플로우" action={<button onClick={()=>setShowCreateModal(true)} className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center shadow-sm hover:bg-blue-700"><Plus size={16} className="mr-1.5"/>새 워크플로우 생성</button>}>
      <div className="flex items-center space-x-4 mb-5 text-xs">
        <div className="flex items-center space-x-1.5"><div className="w-3 h-3 rounded bg-orange-200 border border-orange-400"/><span className="text-gray-500">트리거</span></div>
        <div className="flex items-center space-x-1.5"><div className="w-3 h-3 rounded bg-blue-200 border border-blue-400"/><span className="text-gray-500">에이전트</span></div>
        <div className="flex items-center space-x-1.5"><div className="w-3 h-3 rounded bg-yellow-200 border border-yellow-400"/><span className="text-gray-500">조건 분기</span></div>
        <div className="flex items-center space-x-1.5"><div className="w-3 h-3 rounded bg-purple-200 border border-purple-400"/><span className="text-gray-500">MCP 도구</span></div>
        <div className="flex items-center space-x-1.5"><div className="w-3 h-3 rounded bg-orange-200 border border-orange-500"/><span className="text-gray-500">HITL 검토</span></div>
        <div className="flex items-center space-x-1.5"><div className="w-3 h-3 rounded bg-green-200 border border-green-400"/><span className="text-gray-500">액션</span></div>
      </div>
      <div className="space-y-5">{workflows.map(wf=>(
        <div key={wf.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden ${runningWf[wf.id]?'ring-2 ring-blue-400 ring-offset-2':''}`}>
          <div className="p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${wf.status==='Running'?'bg-blue-50':'bg-gray-100'} ${runningWf[wf.id]?'animate-pulse':''}`}><Layers size={20} className={wf.status==='Running'?'text-blue-600':'text-gray-400'}/></div>
                <div>
                  <div className="flex items-center space-x-2"><h3 className="font-bold">{wf.name}</h3>
                    {wf.protocol&&<span className="bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded text-[10px] font-bold">{wf.protocol}</span>}
                    {wf.hitl&&<span className="bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded text-[10px] font-bold">HITL</span>}
                    {runningWf[wf.id]&&<span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold animate-pulse">실행 중...</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{wf.desc}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={()=>{if(runningWf[wf.id])return;setShowRunConfirm(wf.id);}} disabled={runningWf[wf.id]||wf.status==='Stopped'} className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 ${runningWf[wf.id]?'bg-gray-100 text-gray-400 cursor-not-allowed':wf.status==='Stopped'?'bg-gray-100 text-gray-400 cursor-not-allowed':'bg-blue-600 text-white hover:bg-blue-700'}`}><Play size={12}/><span>실행</span></button>
                <button onClick={()=>setShowStopConfirm(wf.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${wf.status==='Running'?'border border-red-200 text-red-600 hover:bg-red-50':'border border-green-200 text-green-600 hover:bg-green-50'}`}>{wf.status==='Running'?'중지':'시작'}</button>
                <StatusBadge status={wf.status}/>
                <button onClick={()=>toggle(wf.id)} className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronDown size={16} className={`text-gray-400 transition-transform ${expanded[wf.id]?'rotate-180':''}`}/></button>
              </div>
            </div>
            <div className="flex items-center space-x-5 text-xs text-gray-400 mb-5 ml-[52px]">
              <span>생성자: {wf.creator}</span><span>최종 실행: {wf.lastRun}</span><span>24h 실행: {wf.runs24h}회</span><span>성공률: {wf.successRate}%</span><span>노드: {wf.steps.length}개</span>
            </div>
            <div className="bg-gray-50/80 rounded-xl p-5 overflow-x-auto">
              <div className="flex items-center min-w-max">
                {wf.steps.map((s,i)=><WorkflowStepNode key={s.id} step={s} isLast={i===wf.steps.length-1}/>)}
              </div>
            </div>
          </div>
          {expanded[wf.id]&&<div className="border-t">
            <div className="px-5 py-3 bg-gray-50/50 text-xs font-bold text-gray-500">실행 이력</div>
            <table className="w-full text-sm"><thead className="bg-gray-50/50"><tr>
              <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-400">Run ID</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-400">시작 시간</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-400">소요 시간</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-400">상태</th>
            </tr></thead><tbody className="divide-y divide-gray-100">{[...(wfRuns[wf.id]||[]),...mockRuns].map(r=>(
              <tr key={r.id} className="hover:bg-gray-50/50"><td className="px-5 py-2.5 font-mono text-xs text-gray-500">{r.id}</td><td className="px-5 py-2.5 text-gray-600">{r.start}</td><td className="px-5 py-2.5 text-gray-500">{r.duration}</td><td className="px-5 py-2.5"><StatusBadge status={r.status}/></td></tr>
            ))}</tbody></table>
          </div>}
        </div>
      ))}</div>
      <ConfirmDialog isOpen={showRunConfirm!==null} onClose={()=>setShowRunConfirm(null)} onConfirm={()=>{handleRun(showRunConfirm);}} title="워크플로우 실행" message={`'${workflows.find(w=>w.id===showRunConfirm)?.name}' 워크플로우를 실행하시겠습니까?`} confirmText="실행"/>
      <ConfirmDialog isOpen={showStopConfirm!==null} onClose={()=>setShowStopConfirm(null)} onConfirm={()=>{handleStop(showStopConfirm);}} title={`워크플로우 ${workflows.find(w=>w.id===showStopConfirm)?.status==='Running'?'중지':'시작'}`} message={`'${workflows.find(w=>w.id===showStopConfirm)?.name}' 워크플로우를 ${workflows.find(w=>w.id===showStopConfirm)?.status==='Running'?'중지':'시작'}하시겠습니까?`} confirmText={workflows.find(w=>w.id===showStopConfirm)?.status==='Running'?'중지':'시작'} danger={workflows.find(w=>w.id===showStopConfirm)?.status==='Running'}/>
      <Modal isOpen={showCreateModal} onClose={()=>setShowCreateModal(false)} title="새 워크플로우 생성" size="md">
        <div className="space-y-4">
          <div><label className="text-sm font-bold">워크플로우 이름 *</label><input value={newWf.name} onChange={e=>setNewWf(p=>({...p,name:e.target.value}))} placeholder="예: 이의신청 자동 분류" className="w-full mt-1 px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"/></div>
          <div><label className="text-sm font-bold">설명</label><textarea value={newWf.desc} onChange={e=>setNewWf(p=>({...p,desc:e.target.value}))} placeholder="워크플로우의 목적과 처리 흐름을 설명하세요" className="w-full mt-1 h-20 px-3.5 py-2.5 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20"/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-bold">프로토콜</label><select value={newWf.protocol} onChange={e=>setNewWf(p=>({...p,protocol:e.target.value}))} className="w-full mt-1 px-3.5 py-2.5 border rounded-lg text-sm bg-white"><option>MCP</option><option>A2A</option><option>MCP+A2A</option></select></div>
            <div><label className="text-sm font-bold">HITL</label><div className="flex items-center mt-3 space-x-2"><ToggleSwitch on={newWf.hitl} onClick={()=>setNewWf(p=>({...p,hitl:!p.hitl}))}/><span className="text-sm text-gray-600">{newWf.hitl?'활성화':'비활성화'}</span></div></div>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
          <button onClick={()=>setShowCreateModal(false)} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">취소</button>
          <button onClick={handleCreate} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">생성</button>
        </div>
      </Modal>
    </PageShell>
  );
};

const ChatAppPage = () => {
  const toast=useToast();
  const [apps,setApps]=useState(MOCK_CHAT_APPS);
  const [showModal,setShowModal]=useState(false);const [step,setStep]=useState(1);
  const [chatForm,setChatForm]=useState({title:'',desc:'',group:'AI Engineer',model:'GPT-OSS-120B',mode:'knowledge',approval:false});
  const handleCreate=()=>{const id=apps.length>0?Math.max(...apps.map(a=>a.id))+1:1;const a={id,name:chatForm.title,type:'전용 채팅',status:'Online',deploy:'배포',creator:'김영빈',dept:chatForm.group,addr:''};setApps(p=>[a,...p]);setShowModal(false);setStep(1);setChatForm({title:'',desc:'',group:'AI Engineer',model:'GPT-OSS-120B',mode:'knowledge',approval:false});toast(`'${chatForm.title}' 채팅 앱이 생성되었습니다.`);};
  const toggleDeploy=(id)=>{setApps(p=>p.map(a=>a.id===id?{...a,status:a.status==='Online'?'Offline':'Online',deploy:a.deploy==='배포'?'배포중지':'배포'}:a));toast('배포 상태가 변경되었습니다.','info');};
  const copyAddr=(id)=>{toast(`앱 ID ${id}의 주소가 클립보드에 복사되었습니다.`);};
  return (
    <PageShell breadcrumb={['애플리케이션','채팅']}>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">채팅 애플리케이션 목록</h2>
        <div className="flex space-x-2">
          <button onClick={()=>{setShowModal(true);setStep(1);}} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"><Plus size={16} className="mr-1"/>애플리케이션 생성</button>
        </div>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50 text-xs text-gray-500"><tr>
          <th className="px-4 py-3 text-left">ID</th><th className="px-4 py-3 text-left">제목</th><th className="px-4 py-3 text-left">유형</th><th className="px-4 py-3 text-center">상태</th><th className="px-4 py-3 text-center">배포</th><th className="px-4 py-3 text-left">제작자</th><th className="px-4 py-3 text-left">관리 그룹</th><th className="px-4 py-3 text-center">액션</th>
        </tr></thead><tbody className="divide-y">{apps.map(a=>(
          <tr key={a.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-gray-500">{a.id}</td><td className="px-4 py-3 font-medium">{a.name||'-'}</td><td className="px-4 py-3">{a.type||'-'}</td>
            <td className="px-4 py-3 text-center">{a.status?<StatusBadge status={a.status}/>:'-'}</td>
            <td className="px-4 py-3 text-center">{a.deploy?<span className="cursor-pointer" onClick={()=>toggleDeploy(a.id)}><StatusBadge status={a.deploy}/></span>:'-'}</td>
            <td className="px-4 py-3">{a.creator||'-'}</td><td className="px-4 py-3">{a.dept}</td>
            <td className="px-4 py-3 text-center"><div className="flex items-center justify-center space-x-1">
              <button onClick={()=>copyAddr(a.id)} title="주소 복사"><Copy size={14} className="text-gray-400 cursor-pointer hover:text-blue-600"/></button>
              {a.deploy&&<button onClick={()=>toggleDeploy(a.id)} title={a.deploy==='배포'?'배포 중지':'배포'}><Power size={14} className={a.status==='Online'?'text-green-500 hover:text-red-500':'text-gray-400 hover:text-green-500'}/></button>}
            </div></td></tr>
        ))}</tbody></table>
      </div>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title="채팅 생성" size="md">
        <div className="flex justify-center space-x-4 mb-8">{[1,2,3,4].map(s=>(
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step>s?'bg-blue-600 text-white':step===s?'bg-blue-600 text-white ring-4 ring-blue-100':'bg-gray-200 text-gray-500'}`}>{step>s?<Check size={14}/>:s}</div>
            <span className="ml-2 text-sm font-medium">{['기본정보','모델설정','권한설정','완료'][s-1]}</span>
            {s<4&&<div className={`w-12 h-0.5 mx-2 ${step>s?'bg-blue-600':'bg-gray-200'}`}/>}
          </div>
        ))}</div>
        {step===1&&<div className="space-y-4">
          <div><label className="text-sm font-bold">제목 *</label><input value={chatForm.title} onChange={e=>setChatForm(p=>({...p,title:e.target.value}))} placeholder="제목을 입력하세요" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"/></div>
          <div><label className="text-sm font-bold">상세 설명</label><input value={chatForm.desc} onChange={e=>setChatForm(p=>({...p,desc:e.target.value}))} placeholder="상세 설명을 입력하세요" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"/></div>
          <div><label className="text-sm font-bold">관리 그룹 *</label><select value={chatForm.group} onChange={e=>setChatForm(p=>({...p,group:e.target.value}))} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white"><option>AI Engineer</option><option>QA</option><option>토지공시부</option><option>경영지원팀</option></select></div>
        </div>}
        {step===2&&<div className="space-y-4">
          <div><label className="text-sm font-bold">LLM 모델 선택 *</label><select value={chatForm.model} onChange={e=>setChatForm(p=>({...p,model:e.target.value}))} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white">{MOCK_MODELS.map(m=><option key={m.id} value={m.name}>{m.name}</option>)}</select></div>
          <div><label className="text-sm font-bold">응답 모드</label>
            <div className="mt-2 space-y-2">
              <div onClick={()=>setChatForm(p=>({...p,mode:'knowledge'}))} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${chatForm.mode==='knowledge'?'bg-blue-50 border-blue-200':''}`}><input type="radio" name="mode" checked={chatForm.mode==='knowledge'} readOnly className="mr-2"/><div><div className="font-medium text-sm">지식 참조 모드</div><div className="text-xs text-gray-500">RAG 파이프라인을 통한 내부 문서 참조 응답</div></div></div>
              <div onClick={()=>setChatForm(p=>({...p,mode:'direct'}))} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${chatForm.mode==='direct'?'bg-blue-50 border-blue-200':''}`}><input type="radio" name="mode" checked={chatForm.mode==='direct'} readOnly className="mr-2"/><div><div className="font-medium text-sm">직접 응답 모드</div><div className="text-xs text-gray-500">내부 LLM만 활용한 즉각적 응답</div></div></div>
            </div>
          </div>
        </div>}
        {step===3&&<div className="space-y-4">
          <div><label className="text-sm font-bold">승인 필요 여부</label><div className="mt-2 flex items-center space-x-2"><ToggleSwitch on={chatForm.approval} onClick={()=>setChatForm(p=>({...p,approval:!p.approval}))}/><span className="text-sm text-gray-600">{chatForm.approval?'승인 후 배포':'즉시 배포'}</span></div></div>
          <div><label className="text-sm font-bold">사용 가능한 관리 그룹</label><select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white"><option>AI Engineer</option><option>QA</option><option>전체</option></select></div>
          <div><label className="text-sm font-bold">사용 가능한 역할</label><select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white"><option>전체</option><option>시스템관리자</option><option>부서관리자</option><option>일반사용자</option></select></div>
        </div>}
        {step===4&&<div className="text-center py-8"><CheckCircle size={48} className="mx-auto text-green-500 mb-4"/><h3 className="text-lg font-bold">설정 완료!</h3><p className="text-gray-500 mt-2">'{chatForm.title}' 채팅 애플리케이션이 생성됩니다.</p><div className="mt-4 text-sm text-gray-500"><div>모델: {chatForm.model}</div><div>응답 모드: {chatForm.mode==='knowledge'?'지식 참조':'직접 응답'}</div><div>그룹: {chatForm.group}</div></div></div>}
        <div className="flex justify-between items-center mt-8 pt-4 border-t">
          <button onClick={()=>setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm">닫기</button>
          <div className="flex space-x-2">
            {step>1&&<button onClick={()=>setStep(s=>s-1)} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">← 이전</button>}
            <button onClick={()=>{if(step===1&&!chatForm.title.trim()){toast('제목을 입력하세요.','error');return;}if(step<4)setStep(s=>s+1);else handleCreate();}} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">{step===4?'생성':'다음 →'}</button>
          </div>
        </div>
      </Modal>
    </PageShell>
  );
};

const ReportGenPage = () => {
  const toast=useToast();
  const [reports,setReports]=useState([
    {id:'RPT-001',title:'2월 공시업무 현황 보고서',type:'요약',template:'공시업무',status:'완료',date:'2026-02-10',pages:12},
    {id:'RPT-002',title:'공동주택 가격변동 분석 리포트',type:'분석',template:'현장조사',status:'완료',date:'2026-02-09',pages:24},
    {id:'RPT-003',title:'1분기 AI 활용 성과보고',type:'보고서',template:'성과분석',status:'생성 중',date:'2026-02-11',pages:0},
    {id:'RPT-004',title:'장비 유지보수 매뉴얼 번역',type:'번역',template:'기술문서',status:'완료',date:'2026-02-08',pages:45},
    {id:'RPT-005',title:'신입사원 교육자료 요약',type:'요약',template:'교육',status:'대기 중',date:'2026-02-11',pages:0},
  ]);
  const [showCreate,setShowCreate]=useState(false);const [detail,setDetail]=useState(null);
  const [form,setForm]=useState({title:'',type:'요약',template:'공시업무',source:''});
  return (
    <PageShell breadcrumb={['애플리케이션','보고서 생성']} title="보고서 생성" action={<button onClick={()=>setShowCreate(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"><Plus size={16} className="mr-1"/>새 보고서</button>}>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[{l:'전체 보고서',v:reports.length,c:'bg-blue-50 text-blue-700'},{l:'생성 완료',v:reports.filter(r=>r.status==='완료').length,c:'bg-green-50 text-green-700'},{l:'총 페이지',v:reports.reduce((a,r)=>a+r.pages,0),c:'bg-purple-50 text-purple-700'}].map((s,i)=>(
          <div key={i} className={`p-4 rounded-xl ${s.c}`}><div className="text-2xl font-bold">{s.v}</div><div className="text-xs mt-1 opacity-80">{s.l}</div></div>
        ))}
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50 text-xs text-gray-500 uppercase"><tr>
          <th className="px-4 py-3 text-left">ID</th><th className="px-4 py-3 text-left">제목</th><th className="px-4 py-3 text-left">유형</th><th className="px-4 py-3 text-left">템플릿</th><th className="px-4 py-3 text-right">페이지</th><th className="px-4 py-3 text-left">상태</th>
        </tr></thead><tbody className="divide-y">{reports.map(r=>(
          <tr key={r.id} className="hover:bg-gray-50 cursor-pointer" onClick={()=>setDetail(r)}>
            <td className="px-4 py-3 font-mono text-xs">{r.id}</td><td className="px-4 py-3 font-medium">{r.title}</td>
            <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded ${r.type==='요약'?'bg-blue-50 text-blue-700':r.type==='분석'?'bg-purple-50 text-purple-700':r.type==='번역'?'bg-green-50 text-green-700':'bg-orange-50 text-orange-700'}`}>{r.type}</span></td>
            <td className="px-4 py-3 text-gray-500">{r.template}</td><td className="px-4 py-3 text-right">{r.pages||'-'}</td><td className="px-4 py-3"><StatusBadge status={r.status}/></td>
          </tr>
        ))}</tbody></table>
      </div>
      <Modal isOpen={showCreate} onClose={()=>setShowCreate(false)} title="새 보고서 생성" size="md">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">제목</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="보고서 제목" className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">유형</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>요약</option><option>분석</option><option>보고서</option><option>번역</option></select></div>
            <div><label className="block text-sm font-medium mb-1">템플릿</label><select value={form.template} onChange={e=>setForm({...form,template:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>공시업무</option><option>현장조사</option><option>성과분석</option><option>기술문서</option><option>교육</option></select></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">데이터 소스</label><input value={form.source} onChange={e=>setForm({...form,source:e.target.value})} placeholder="데이터셋 또는 문서명" className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <button onClick={()=>{if(!form.title)return;setReports(p=>[{id:`RPT-${String(p.length+1).padStart(3,'0')}`,title:form.title,type:form.type,template:form.template,status:'생성 중',date:'2026-02-11',pages:0},...p]);setShowCreate(false);setForm({title:'',type:'요약',template:'공시업무',source:''});toast('보고서 생성이 시작되었습니다');}} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm">생성 시작</button>
        </div>
      </Modal>
      <Modal isOpen={!!detail} onClose={()=>setDetail(null)} title={detail?.title} size="lg">
        {detail&&<div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">{[['유형',detail.type],['템플릿',detail.template],['생성일',detail.date],['페이지 수',detail.pages||'생성 중'],['상태',detail.status],['ID',detail.id]].map(([k,v],i)=>(
            <div key={i} className="bg-gray-50 p-3 rounded-lg"><div className="text-xs text-gray-400">{k}</div><div className="font-medium">{v}</div></div>
          ))}</div>
          {detail.status==='완료'&&<button onClick={()=>{toast('보고서를 다운로드합니다');setDetail(null);}} className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium">다운로드</button>}
        </div>}
      </Modal>
    </PageShell>
  );
};

const DataAnalysisPage = () => {
  const toast=useToast();
  const [showCreate,setShowCreate]=useState(false);
  const [form,setForm]=useState({file:'',type:'CSV',method:'통계분석'});
  const templates=[
    {name:'통계 분석',desc:'기초 통계량, 분포, 상관관계 분석',icon:'📊',color:'bg-blue-50 border-blue-200'},
    {name:'이상치 탐지',desc:'데이터 이상값 자동 탐지 및 시각화',icon:'🔍',color:'bg-red-50 border-red-200'},
    {name:'트렌드 분석',desc:'시계열 추세 및 패턴 분석',icon:'📈',color:'bg-green-50 border-green-200'},
    {name:'텍스트 분석',desc:'자연어 텍스트 감성 및 토픽 분석',icon:'📝',color:'bg-purple-50 border-purple-200'},
  ];
  return (
    <PageShell breadcrumb={['애플리케이션','데이터 분석']} title="데이터 분석" action={<button onClick={()=>setShowCreate(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"><Plus size={16} className="mr-1"/>새 분석</button>}>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[{l:'총 분석 작업',v:47,c:'bg-blue-50 text-blue-700'},{l:'이번 주 실행',v:12,c:'bg-green-50 text-green-700'},{l:'평균 처리시간',v:'2.3분',c:'bg-purple-50 text-purple-700'}].map((s,i)=>(
          <div key={i} className={`p-4 rounded-xl ${s.c}`}><div className="text-2xl font-bold">{s.v}</div><div className="text-xs mt-1 opacity-80">{s.l}</div></div>
        ))}
      </div>
      <h3 className="font-bold mb-3">분석 템플릿</h3>
      <div className="grid grid-cols-2 gap-4 mb-6">{templates.map((t,i)=>(
        <div key={i} className={`p-5 rounded-xl border cursor-pointer hover:shadow-md transition-all ${t.color}`} onClick={()=>{setForm({...form,method:t.name});setShowCreate(true);}}>
          <div className="text-2xl mb-2">{t.icon}</div>
          <h4 className="font-bold text-sm mb-1">{t.name}</h4>
          <p className="text-xs text-gray-500">{t.desc}</p>
        </div>
      ))}</div>
      <Modal isOpen={showCreate} onClose={()=>setShowCreate(false)} title="새 분석 작업" size="md">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">파일 이름</label><input value={form.file} onChange={e=>setForm({...form,file:e.target.value})} placeholder="분석할 파일명" className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">파일 유형</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>CSV</option><option>Excel</option><option>JSON</option><option>Parquet</option></select></div>
            <div><label className="block text-sm font-medium mb-1">분석 방법</label><select value={form.method} onChange={e=>setForm({...form,method:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>통계분석</option><option>이상치 탐지</option><option>트렌드 분석</option><option>텍스트 분석</option></select></div>
          </div>
          <button onClick={()=>{setShowCreate(false);toast('분석 작업이 시작되었습니다');}} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm">분석 시작</button>
        </div>
      </Modal>
    </PageShell>
  );
};

// ==================== OPS PAGES ====================
const ApprovalPage = () => {
  const toast=useToast();
  const [requests,setRequests]=useState([
    {id:'APR-101',type:'모델 배포',user:'김철수',dept:'AI연구소',date:'2026-02-09',status:'대기 중',desc:'GPT-OSS-120B 모델 운영 환경 배포 요청'},
    {id:'APR-102',type:'GPU 할당',user:'이영희',dept:'개발팀',date:'2026-02-10',status:'대기 중',desc:'VLM 학습을 위한 A100 x4 GPU 할당 요청'},
    {id:'APR-100',type:'GPU 할당',user:'이영희',dept:'개발팀',date:'2026-02-08',status:'승인',desc:'임베딩 학습용 GPU 할당'},
    {id:'APR-099',type:'데이터 접근',user:'박지민',dept:'부동산공시처',date:'2026-02-07',status:'승인',desc:'공시 규정 데이터셋 접근 권한 요청'},
    {id:'APR-098',type:'API 키 발급',user:'최준호',dept:'경영기획',date:'2026-02-06',status:'거부',desc:'외부 API 키 발급 요청'},
  ]);
  const [tab,setTab]=useState('전체');const [confirmAction,setConfirmAction]=useState(null);const [rejectReason,setRejectReason]=useState('');
  const filtered=tab==='전체'?requests:requests.filter(r=>r.status===tab);
  const counts={total:requests.length,pending:requests.filter(r=>r.status==='대기 중').length,approved:requests.filter(r=>r.status==='승인').length,rejected:requests.filter(r=>r.status==='거부').length};
  return (
    <PageShell breadcrumb={['운영','승인']} title="승인 관리">
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[{l:'전체',v:counts.total,c:'bg-gray-50 text-gray-700'},{l:'대기 중',v:counts.pending,c:'bg-yellow-50 text-yellow-700'},{l:'승인',v:counts.approved,c:'bg-green-50 text-green-700'},{l:'거부',v:counts.rejected,c:'bg-red-50 text-red-700'}].map((s,i)=>(
          <div key={i} className={`p-4 rounded-xl ${s.c}`}><div className="text-2xl font-bold">{s.v}</div><div className="text-xs mt-1 opacity-80">{s.l}</div></div>
        ))}
      </div>
      <div className="flex space-x-1 mb-4 border-b">{['전체','대기 중','승인','거부'].map(t=>(
        <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 ${tab===t?'border-blue-600 text-blue-600':'border-transparent text-gray-500 hover:text-gray-800'}`}>{t}</button>
      ))}</div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50 text-xs text-gray-500 uppercase"><tr>
          <th className="px-4 py-3 text-left">요청 ID</th><th className="px-4 py-3 text-left">유형</th><th className="px-4 py-3 text-left">요청자</th><th className="px-4 py-3 text-left">부서</th><th className="px-4 py-3 text-left">요청일</th><th className="px-4 py-3 text-left">상태</th><th className="px-4 py-3 text-center">액션</th>
        </tr></thead><tbody className="divide-y">{filtered.map(r=>(
          <tr key={r.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 font-mono text-xs">{r.id}</td><td className="px-4 py-3 font-medium">{r.type}</td><td className="px-4 py-3">{r.user}</td><td className="px-4 py-3 text-gray-500">{r.dept}</td><td className="px-4 py-3 text-gray-500">{r.date}</td><td className="px-4 py-3"><StatusBadge status={r.status}/></td>
            <td className="px-4 py-3 text-center space-x-2">
              {r.status==='대기 중'&&<>
                <button onClick={()=>setConfirmAction({req:r,action:'approve'})} className="text-xs px-2 py-1 rounded bg-green-50 text-green-600 hover:bg-green-100 font-medium">승인</button>
                <button onClick={()=>setConfirmAction({req:r,action:'reject'})} className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 font-medium">거부</button>
              </>}
            </td>
          </tr>
        ))}</tbody></table>
      </div>
      {confirmAction?.action==='approve'&&<ConfirmDialog isOpen={true} onClose={()=>setConfirmAction(null)} onConfirm={()=>{setRequests(p=>p.map(x=>x.id===confirmAction.req.id?{...x,status:'승인'}:x));setConfirmAction(null);toast(`${confirmAction.req.id} 승인 완료`);}} title="요청 승인" message={`${confirmAction.req.user}의 "${confirmAction.req.type}" 요청을 승인하시겠습니까?\n\n상세: ${confirmAction.req.desc}`} confirmText="승인"/>}
      {confirmAction?.action==='reject'&&<Modal isOpen={true} onClose={()=>{setConfirmAction(null);setRejectReason('');}} title="요청 거부" size="md">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{confirmAction.req.user}의 "{confirmAction.req.type}" 요청을 거부합니다.</p>
          <div><label className="block text-sm font-medium mb-1">거부 사유</label><textarea value={rejectReason} onChange={e=>setRejectReason(e.target.value)} rows={3} placeholder="거부 사유를 입력하세요..." className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <button onClick={()=>{setRequests(p=>p.map(x=>x.id===confirmAction.req.id?{...x,status:'거부'}:x));setConfirmAction(null);setRejectReason('');toast(`${confirmAction.req.id} 거부 완료`,'info');}} className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium text-sm">거부</button>
        </div>
      </Modal>}
    </PageShell>
  );
};

const QuotaPage = () => {
  const toast=useToast();
  const [depts,setDepts]=useState([
    {id:1,name:'AI연구소',gpu:{used:4,total:8},mem:{used:256,total:512},storage:{used:8,total:10}},
    {id:2,name:'IT개발팀',gpu:{used:1,total:2},mem:{used:64,total:256},storage:{used:3,total:5}},
    {id:3,name:'데이터분석팀',gpu:{used:2,total:4},mem:{used:180,total:256},storage:{used:4.5,total:5}},
    {id:4,name:'서비스운영팀',gpu:{used:0,total:1},mem:{used:32,total:128},storage:{used:1,total:5}},
    {id:5,name:'경영기획팀',gpu:{used:0,total:1},mem:{used:16,total:64},storage:{used:0.5,total:2}},
    {id:6,name:'부동산공시처',gpu:{used:1,total:2},mem:{used:96,total:128},storage:{used:2,total:3}},
  ]);
  const [editDept,setEditDept]=useState(null);
  const pct=(u,t)=>Math.round(u/t*100);
  return (
    <PageShell breadcrumb={['운영','할당량']} title="부서별 리소스 할당량 관리">
      <div className="grid grid-cols-3 gap-4">{depts.map(d=>(
        <div key={d.id} className="bg-white p-5 rounded-xl border">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold">{d.name}</h3>
            <button onClick={()=>setEditDept({...d})} className="text-xs text-blue-600 hover:underline">수정</button>
          </div>
          <div className="space-y-3">{[
            {l:'GPU',u:d.gpu.used,t:d.gpu.total,unit:'개',color:'bg-blue-500'},
            {l:'메모리',u:d.mem.used,t:d.mem.total,unit:'GB',color:'bg-purple-500'},
            {l:'스토리지',u:d.storage.used,t:d.storage.total,unit:'TB',color:'bg-green-500'},
          ].map((r,j)=>{const p=pct(r.u,r.t);return(
            <div key={j}><div className="flex justify-between text-xs mb-1"><span className="text-gray-500">{r.l}</span><div className="flex items-center space-x-1"><span className="font-medium">{r.u}/{r.t} {r.unit}</span>{p>=80&&<span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-600 font-medium">⚠ {p}%</span>}</div></div>
              <div className="w-full bg-gray-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${p>=80?'bg-red-500':r.color}`} style={{width:`${p}%`}}/></div></div>
          );})}</div>
        </div>
      ))}</div>
      <Modal isOpen={!!editDept} onClose={()=>setEditDept(null)} title={`${editDept?.name} 할당량 수정`} size="md">
        {editDept&&<div className="space-y-4">
          <div><label className="block text-sm font-medium mb-2">GPU 할당량</label>
            <input type="range" min={1} max={16} value={editDept.gpu.total} onChange={e=>setEditDept({...editDept,gpu:{...editDept.gpu,total:+e.target.value}})} className="w-full"/>
            <div className="text-right text-sm font-medium">{editDept.gpu.total}개</div></div>
          <div><label className="block text-sm font-medium mb-2">메모리 할당량</label>
            <input type="range" min={64} max={1024} step={64} value={editDept.mem.total} onChange={e=>setEditDept({...editDept,mem:{...editDept.mem,total:+e.target.value}})} className="w-full"/>
            <div className="text-right text-sm font-medium">{editDept.mem.total} GB</div></div>
          <div><label className="block text-sm font-medium mb-2">스토리지 할당량</label>
            <input type="range" min={1} max={20} value={editDept.storage.total} onChange={e=>setEditDept({...editDept,storage:{...editDept.storage,total:+e.target.value}})} className="w-full"/>
            <div className="text-right text-sm font-medium">{editDept.storage.total} TB</div></div>
          <button onClick={()=>{setDepts(p=>p.map(x=>x.id===editDept.id?editDept:x));setEditDept(null);toast('할당량이 저장되었습니다');}} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm">저장</button>
        </div>}
      </Modal>
    </PageShell>
  );
};

// ==================== ADMIN PAGES ====================
const UserManagementPage = () => {
  const [selUser,setSelUser]=useState(null);
  const [tab,setTab]=useState('users');
  const roleBadge=r=>r==='시스템관리자'?'bg-red-50 text-red-700':r==='부서관리자'?'bg-blue-50 text-blue-700':'bg-gray-100 text-gray-600';
  return (
    <PageShell breadcrumb={['관리자 전용','사용자 관리']} title="사용자 및 권한 관리" action={<button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"><UserPlus size={16} className="mr-1.5"/>사용자 추가</button>}>
      <div className="flex space-x-1 mb-5 border-b">
        {[['users','사용자 목록'],['permissions','권한 요청'],['roles','역할 관리']].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab===k?'border-blue-600 text-blue-600':'border-transparent text-gray-500 hover:text-gray-800'}`}>{l}</button>
        ))}
      </div>
      {tab==='users'&&<>
        <div className="flex items-center space-x-3 mb-4">
          <div className="relative flex-1 max-w-sm"><input placeholder="이름, 부서, 이메일 검색..." className="w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"/><Search size={16} className="absolute left-3 top-3 text-gray-400"/></div>
          <select className="px-3 py-2.5 border rounded-lg text-sm bg-white"><option>전체 역할</option><option>시스템관리자</option><option>부서관리자</option><option>일반사용자</option></select>
        </div>
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm"><thead className="bg-gray-50/80"><tr>
            <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">ID</th>
            <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">이름</th>
            <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">부서</th>
            <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">역할</th>
            <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">이메일</th>
            <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">최근 로그인</th>
            <th className="px-5 py-3.5 text-right text-xs font-medium text-gray-500">API 호출</th>
            <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">상태</th>
          </tr></thead><tbody className="divide-y divide-gray-100">{MOCK_USERS.map(u=>(
            <tr key={u.id} className="hover:bg-gray-50/50 cursor-pointer" onClick={()=>setSelUser(u)}>
              <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{u.id}</td>
              <td className="px-5 py-3.5 font-medium">{u.name}</td>
              <td className="px-5 py-3.5 text-gray-600">{u.dept}</td>
              <td className="px-5 py-3.5"><span className={`px-2 py-0.5 rounded-md text-xs font-medium ${roleBadge(u.role)}`}>{u.role}</span></td>
              <td className="px-5 py-3.5 text-gray-500 text-xs">{u.email}</td>
              <td className="px-5 py-3.5 text-gray-400 text-xs">{u.lastLogin}</td>
              <td className="px-5 py-3.5 text-right font-medium">{u.apiCalls.toLocaleString()}</td>
              <td className="px-5 py-3.5"><StatusBadge status={u.status}/></td>
            </tr>
          ))}</tbody></table>
        </div>
      </>}
      {tab==='permissions'&&<div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50/80"><tr>
          <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">요청 ID</th>
          <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">요청자</th>
          <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">부서</th>
          <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">유형</th>
          <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">대상</th>
          <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">요청일</th>
          <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">상태</th>
          <th className="px-5 py-3.5 text-center text-xs font-medium text-gray-500">처리</th>
        </tr></thead><tbody className="divide-y divide-gray-100">{MOCK_PERMISSION_REQUESTS.map(p=>(
          <tr key={p.id} className="hover:bg-gray-50/50">
            <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{p.id}</td>
            <td className="px-5 py-3.5 font-medium">{p.user}</td>
            <td className="px-5 py-3.5 text-gray-600">{p.dept}</td>
            <td className="px-5 py-3.5"><span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md text-xs font-medium">{p.type}</span></td>
            <td className="px-5 py-3.5 text-gray-500">{p.target}</td>
            <td className="px-5 py-3.5 text-gray-400">{p.date}</td>
            <td className="px-5 py-3.5"><StatusBadge status={p.status}/></td>
            <td className="px-5 py-3.5 text-center">{p.status==='대기 중'&&<div className="flex space-x-1 justify-center">
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700">승인</button>
              <button className="px-3 py-1 border border-red-200 text-red-600 rounded text-xs font-medium hover:bg-red-50">거부</button>
            </div>}</td>
          </tr>
        ))}</tbody></table>
      </div>}
      {tab==='roles'&&<div className="grid grid-cols-3 gap-5">
        {[{role:'시스템관리자',desc:'전체 시스템 관리 및 설정 권한',perms:['전체 메뉴 접근','사용자 관리','모델 관리','시스템 설정','통계 조회'],count:2,color:'bg-red-50 border-red-200'},
          {role:'부서관리자',desc:'소속 부서 리소스 관리 권한',perms:['부서 에이전트 관리','지식영역 관리','부서원 권한 관리','사용 통계 조회'],count:3,color:'bg-blue-50 border-blue-200'},
          {role:'일반사용자',desc:'기본 서비스 이용 권한',perms:['에이전트 질의','개인 지식영역','채팅 애플리케이션','보고서 생성'],count:3,color:'bg-gray-50 border-gray-200'}
        ].map((r,i)=>(
          <div key={i} className={`p-5 rounded-xl border ${r.color}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm">{r.role}</h3>
              <span className="text-xs bg-white px-2 py-0.5 rounded-full border">{r.count}명</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">{r.desc}</p>
            <div className="space-y-1.5">{r.perms.map((p,j)=>(
              <div key={j} className="flex items-center text-xs text-gray-600"><Check size={12} className="mr-1.5 text-green-500 shrink-0"/>{p}</div>
            ))}</div>
          </div>
        ))}
      </div>}
      <Modal isOpen={!!selUser} onClose={()=>setSelUser(null)} title={`${selUser?.name} 상세 정보`} size="md">
        {selUser&&<div className="space-y-5">
          <div className="flex items-center space-x-4 pb-4 border-b">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-lg font-bold">{selUser.name[0]}</div>
            <div><div className="font-bold text-lg">{selUser.name}</div><div className="text-sm text-gray-500">{selUser.dept} · {selUser.role}</div><div className="text-xs text-gray-400 mt-0.5">{selUser.email}</div></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 text-center"><div className="text-xl font-bold text-blue-700">{selUser.loginCount}</div><div className="text-xs text-blue-500">총 로그인</div></div>
            <div className="bg-green-50 rounded-lg p-3 text-center"><div className="text-xl font-bold text-green-700">{selUser.apiCalls.toLocaleString()}</div><div className="text-xs text-green-500">API 호출</div></div>
            <div className="bg-purple-50 rounded-lg p-3 text-center"><div className="text-xl font-bold text-purple-700">{selUser.lastLogin.split(' ')[1]}</div><div className="text-xs text-purple-500">최근 접속</div></div>
          </div>
          <div className="flex space-x-2 pt-2">
            <button className="flex-1 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">역할 변경</button>
            <button className="flex-1 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50">{selUser.status==='Running'?'비활성화':'활성화'}</button>
          </div>
        </div>}
      </Modal>
    </PageShell>
  );
};

// ── Document OCR 시뮬레이션 결과 ──
const UPSTAGE_OCR_MOCK = {
  totalPages:3, totalBlocks:16, elapsed:2.4,
  pages:[
    {page:1,
     text:"제1조 (목적)\n이 규정은 한국부동산원의 표준지공시지가 조사·평가에 관한 사항을 규정함을 목적으로 한다.\n\n제2조 (적용 범위)\n이 규정은 원이 조사하는 모든 표준지에 적용한다.\n\n제3조 (정의)\n이 규정에서 사용하는 용어의 정의는 다음과 같다.",
     blocks:[
       {text:"제1조 (목적)",bbox:{x:14,y:14,w:35,h:6}},
       {text:"이 규정은 한국부동산원의 표준지공시지가 조사·평가에 관한 사항을 규정함을 목적으로 한다.",bbox:{x:14,y:22,w:70,h:8}},
       {text:"제2조 (적용 범위)",bbox:{x:14,y:36,w:38,h:6}},
       {text:"이 규정은 원이 조사하는 모든 표준지에 적용한다.",bbox:{x:14,y:44,w:65,h:6}},
       {text:"제3조 (정의)",bbox:{x:14,y:56,w:28,h:6}},
       {text:"이 규정에서 사용하는 용어의 정의는 다음과 같다.",bbox:{x:14,y:64,w:60,h:6}},
     ]},
    {page:2,
     text:"제4조 (조사 주기)\n① 표준지: 정기 조사 연 1회, 수시 조사 가격변동 시\n② 공동주택: 정기 조사 연 1회, 표본 검증 반기 1회\n③ 비주거용 부동산: 정기 조사 연 1회, 정밀 검증 2년",
     blocks:[
       {text:"제4조 (조사 주기)",bbox:{x:14,y:10,w:36,h:6}},
       {text:"① 표준지: 정기 조사 연 1회, 수시 조사 가격변동 시",bbox:{x:18,y:20,w:66,h:6}},
       {text:"② 공동주택: 정기 조사 연 1회, 표본 검증 반기 1회",bbox:{x:18,y:29,w:62,h:6}},
       {text:"③ 비주거용 부동산: 정기 조사 연 1회, 정밀 검증 2년",bbox:{x:18,y:38,w:60,h:6}},
     ]},
    {page:3,
     text:"제5조 (조사 결과 보고)\n조사 완료 후 14일 이내에 조사 결과 보고서를 작성하여 부동산공시처장에게 제출하여야 한다.\n\n[별표 1] 토지특성 조사 체크리스트",
     blocks:[
       {text:"제5조 (조사 결과 보고)",bbox:{x:14,y:10,w:44,h:6}},
       {text:"조사 완료 후 14일 이내에 결과보고서를 제출하여야 한다.",bbox:{x:14,y:20,w:70,h:8}},
       {text:"[별표 1] 토지특성 조사 체크리스트",bbox:{x:14,y:36,w:52,h:6}},
       {text:"(개인 식별 정보 처리됨 — PII 마스킹 적용)",bbox:{x:14,y:46,w:65,h:6}},
       {text:"담당자 서명란",bbox:{x:14,y:58,w:28,h:6}},
       {text:"부동산공시처장 확인",bbox:{x:14,y:66,w:34,h:6}},
     ]},
  ]
};

// ── Document Parse 시뮬레이션 결과 ──
const UPSTAGE_PARSE_MOCK = {
  statistics:{paragraphs:24,headings:8,tables:3,figures:2,total:37},
  elements:[
    {category:'heading1',content:'공시업무규정',page:1},
    {category:'heading2',content:'제1장 총칙',page:1},
    {category:'paragraph',content:'제1조 (목적) 이 규정은 한국부동산원의 표준지공시지가 조사·평가에 관한 사항을 규정함을 목적으로 한다.',page:1},
    {category:'paragraph',content:'제2조 (적용 범위) 이 규정은 원이 조사하는 모든 표준지에 적용한다.',page:1},
    {category:'heading2',content:'제2장 조사 기준',page:2},
    {category:'table',content:'| 조사 대상 | 조사 주기 | 담당부서 |\n|---------|---------|--------|\n| 표준지 | 연 1회 | 부동산공시처 |\n| 공동주택 | 연 1회 | 주택공시부 |',page:2},
    {category:'paragraph',content:'제4조 (점검 방법) 점검은 관련 법령 및 내부 기준에 따라 실시한다.',page:2},
    {category:'figure',content:'[그림 1] 표준지 조사 업무 흐름도',page:2},
    {category:'heading2',content:'제3장 보고 의무',page:3},
    {category:'paragraph',content:'제5조 (보고 의무) 조사 완료 후 14일 이내에 결과보고서를 제출하여야 한다.',page:3},
    {category:'list',content:'• 정기조사 결과 보고서\n• 표준지 선정 조서\n• 이상 발견 시 즉시 보고',page:3},
    {category:'figure',content:'[그림 2] 보고 체계도',page:3},
  ],
  outputs:{
    markdown:`# 공시업무규정\n\n## 제1장 총칙\n\n**제1조 (목적)** 이 규정은 한국부동산원의 표준지공시지가 조사·평가에 관한 사항을 규정함을 목적으로 한다.\n\n**제2조 (적용 범위)** 이 규정은 원이 조사하는 모든 표준지에 적용한다.\n\n## 제2장 조사 기준\n\n| 조사 대상 | 조사 주기 | 담당부서 |\n|---------|---------|--------|\n| 표준지 | 연 1회 | 부동산공시처 |\n| 공동주택 | 연 1회 | 주택공시부 |\n\n> [그림 1] 표준지 조사 업무 흐름도\n\n## 제3장 보고 의무\n\n**제5조 (보고 의무)** 조사 완료 후 14일 이내에 결과보고서를 제출하여야 한다.\n\n- 정기조사 결과 보고서\n- 표준지 선정 조서\n- 이상 발견 시 즉시 보고`,
    html:`<h1>공시업무규정</h1>\n<h2>제1장 총칙</h2>\n<p><strong>제1조 (목적)</strong> 이 규정은 한국부동산원의 표준지공시지가 조사·평가에 관한 사항을 규정함을 목적으로 한다.</p>\n<p><strong>제2조 (적용 범위)</strong> 이 규정은 원이 조사하는 모든 표준지에 적용한다.</p>\n<h2>제2장 조사 기준</h2>\n<table><tr><th>조사 대상</th><th>조사 주기</th><th>담당부서</th></tr><tr><td>표준지</td><td>연 1회</td><td>부동산공시처</td></tr></table>`,
    text:`공시업무규정\n\n제1장 총칙\n\n제1조 (목적) 이 규정은 한국부동산원의 표준지공시지가 조사·평가에 관한 사항을 규정함을 목적으로 한다.\n\n제2조 (적용 범위) 이 규정은 원이 조사하는 모든 표준지에 적용한다.\n\n제2장 조사 기준\n표준지 | 연 1회 | 부동산공시처\n공동주택 | 연 1회 | 주택공시부`,
  }
};

const KnowledgeManagementPage = () => {
  const [kbTab,setKbTab]=useState('folders');
  const [flds]=useState(MOCK_KB_FOLDERS.map(f=>({...f})));
  const [docs,setDocs]=useState(JSON.parse(JSON.stringify(MOCK_KB_DOCS)));
  const [sel,setSel]=useState(MOCK_KB_FOLDERS[0]);
  const [expanded,setExpanded]=useState({'f-001':true,'f-002':false});
  const [batches,setBatches]=useState(MOCK_BATCH_JOBS.map(b=>({...b})));
  const [showUp,setShowUp]=useState(false);
  const [showPerm,setShowPerm]=useState(false);
  const [showPrep,setShowPrep]=useState(false);
  const [prepDoc,setPrepDoc]=useState(null);
  const [upFile,setUpFile]=useState({name:'',pii:false,scanning:false,scanned:false});
  // ── 수동 전처리 상태 ──
  const [prepTab,setPrepTab]=useState('parse');           // 'ocr' | 'parse'
  const [ocrState,setOcrState]=useState('idle');          // idle | processing | done
  const [ocrResult,setOcrResult]=useState(null);
  const [ocrLang,setOcrLang]=useState('auto');
  const [ocrShowBbox,setOcrShowBbox]=useState(true);
  const [ocrPageIdx,setOcrPageIdx]=useState(0);
  const [parseState,setParseState]=useState('idle');      // idle | processing | done
  const [parseResult,setParseResult]=useState(null);
  const [parseFormat,setParseFormat]=useState('markdown');
  const [parseMode,setParseMode]=useState('auto');
  const [parseSplit,setParseSplit]=useState(false);
  const [parseCoords,setParseCoords]=useState(false);
  const [parseBase64,setParseBase64]=useState(false);
  const [parsedContent,setParsedContent]=useState('');
  const resetPrep=()=>{setOcrState('idle');setOcrResult(null);setParseState('idle');setParseResult(null);setParsedContent('');setOcrPageIdx(0);};
  const closePrep=()=>{setShowPrep(false);resetPrep();};
  const runOcr=()=>{
    setOcrState('processing');
    setTimeout(()=>{
      const result=JSON.parse(JSON.stringify(UPSTAGE_OCR_MOCK));
      setOcrResult(result);setOcrState('done');setOcrPageIdx(0);
      showToast('OCR 완료 — 텍스트 추출 및 인식 영역 생성됨','success');
    },2800);
  };
  const runParse=()=>{
    setParseState('processing');
    setTimeout(()=>{
      const result=JSON.parse(JSON.stringify(UPSTAGE_PARSE_MOCK));
      setParsedContent(result.outputs[parseFormat]);
      setParseResult(result);setParseState('done');
      showToast('문서 파싱 완료 — 레이아웃 요소 구조화됨','success');
    },3200);
  };
  const {showToast}=useToast();
  const rootFlds=flds.filter(f=>!f.parent);
  const getKids=id=>flds.filter(f=>f.parent===id);
  const selDocs=(docs[sel?.id]||[]);
  const PLBL={all:'전체 공개',dept:'부서별',specific:'특정 사용자',admin:'관리자 전용'};
  const PCLR={all:'bg-green-100 text-green-700',dept:'bg-blue-100 text-blue-700',specific:'bg-yellow-100 text-yellow-700',admin:'bg-red-100 text-red-700'};
  const SCLR={완료:'bg-green-100 text-green-700',처리중:'bg-yellow-100 text-yellow-700',오류:'bg-red-100 text-red-700'};
  const scan=()=>{setUpFile(p=>({...p,scanning:true,scanned:false}));setTimeout(()=>setUpFile(p=>({...p,scanning:false,scanned:true,pii:Math.random()>0.5})),1800);};
  const doUpload=()=>{const nd={id:'d-'+Date.now(),name:upFile.name||'파일.pdf',size:'2.1MB',pii:upFile.pii,status:'처리중',chunks:0,uploaded:new Date().toISOString().slice(0,10),uploader:'김영빈'};setDocs(p=>({...p,[sel.id]:[...(p[sel.id]||[]),nd]}));setShowUp(false);setUpFile({name:'',pii:false,scanning:false,scanned:false});showToast('업로드 완료. 벡터 색인 중...','info');};
  const delDoc=id=>{setDocs(p=>({...p,[sel.id]:p[sel.id].filter(d=>d.id!==id)}));showToast('삭제 및 벡터 DB 반영됨','success');};
  const toggleBatch=id=>setBatches(p=>p.map(b=>b.id===id?{...b,enabled:!b.enabled}:b));
  const FNode=({f,depth=0})=>{
    const kids=getKids(f.id);const isExp=expanded[f.id];const isSel=sel?.id===f.id;
    return(<div><div onClick={()=>setSel(f)} style={{paddingLeft:`${depth*12+8}px`}} className={`flex items-center py-1.5 rounded-lg cursor-pointer text-xs transition-colors group ${isSel?'bg-indigo-50 text-indigo-700 font-semibold':'hover:bg-gray-100 text-gray-700'}`}>
      {kids.length>0?<button onClick={e=>{e.stopPropagation();setExpanded(p=>({...p,[f.id]:!p[f.id]}))}} className="mr-1 text-gray-400">{isExp?<ChevronDown size={12}/>:<ChevronRight size={12}/>}</button>:<span className="w-4 mr-1"/>}
      <Folder size={13} className={`mr-1.5 ${isSel?'text-indigo-500':'text-gray-400'}`}/>
      <span className="flex-1 truncate">{f.name}</span>
      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ml-1 mr-1 shrink-0 ${PCLR[f.perm]}`}>{PLBL[f.perm].split(' ')[0]}</span>
    </div>{isExp&&kids.map(c=><FNode key={c.id} f={c} depth={depth+1}/>)}</div>);
  };
  return(<PageShell breadcrumb={['관리자 전용','기본 지식 관리']} title="기본 지식 관리" action={<button onClick={()=>setShowUp(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"><UploadCloud size={14} className="mr-1.5"/>문서 업로드</button>}>
    {/* 탭 */}
    <div className="flex items-center space-x-1 mb-5 bg-gray-100 p-1 rounded-xl w-fit">
      {[['folders','폴더·문서 관리',FolderTree],['batch','배치·동기화',RefreshCw],['agent','에이전트 연동',Bot]].map(([k,l,Ic])=>(
        <button key={k} onClick={()=>setKbTab(k)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${kbTab===k?'bg-white text-blue-700 shadow-sm':'text-gray-500 hover:text-gray-700'}`}><Ic size={14}/><span>{l}</span></button>
      ))}
    </div>
    {/* Tab 1: 폴더·문서 */}
    {kbTab==='folders'&&<div className="flex gap-5" style={{height:'calc(100vh - 290px)'}}>
      <div className="w-60 shrink-0 bg-white rounded-xl border shadow-sm flex flex-col">
        <div className="p-3 border-b flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-gray-600">폴더 구조</span>
          <button onClick={()=>showToast('폴더 생성 모달','info')} className="text-blue-600 hover:text-blue-700"><Plus size={14}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">{rootFlds.map(f=><FNode key={f.id} f={f}/>)}</div>
      </div>
      <div className="flex-1 bg-white rounded-xl border shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2"><Folder size={15} className="text-indigo-500"/><span className="font-bold text-sm">{sel?.name}</span>{sel&&<span className={`text-xs px-2 py-0.5 rounded-full ${PCLR[sel.perm]}`}>{PLBL[sel.perm]}</span>}</div>
            <div className="text-xs text-gray-400 mt-0.5">소유: {sel?.owner} · {selDocs.length}개 문서</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>setShowPerm(true)} className="flex items-center text-xs text-gray-500 border rounded-lg px-3 py-1.5 hover:bg-gray-50"><Lock size={12} className="mr-1"/>권한 설정</button>
            <button onClick={()=>setShowUp(true)} className="flex items-center text-xs text-blue-600 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50"><UploadCloud size={12} className="mr-1"/>업로드</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {selDocs.length===0?<div className="flex flex-col items-center justify-center h-full text-gray-300"><FileText size={40}/><p className="text-sm mt-2">문서 없음</p></div>:(
            <table className="w-full text-sm"><thead><tr className="bg-gray-50 text-xs text-gray-500 sticky top-0">
              {['파일명','크기','개인정보','청크','상태','업로드일','조작'].map((h,i)=><th key={i} className="text-left px-4 py-2.5 font-semibold">{h}</th>)}
            </tr></thead><tbody className="divide-y divide-gray-50">
              {selDocs.map(d=><tr key={d.id} className="hover:bg-gray-50">
                <td className="px-4 py-2.5"><div className="flex items-center gap-2"><FileText size={13} className="text-gray-400"/><span className="font-medium text-xs truncate max-w-[160px]">{d.name}</span></div></td>
                <td className="px-4 py-2.5 text-xs text-gray-500">{d.size}</td>
                <td className="px-4 py-2.5">{d.pii?<span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded-full flex items-center w-fit gap-1"><Shield size={10}/>마스킹</span>:<span className="text-gray-300 text-xs">-</span>}</td>
                <td className="px-4 py-2.5 text-xs text-gray-600">{d.chunks}</td>
                <td className="px-4 py-2.5"><span className={`text-[10px] px-2 py-0.5 rounded-full ${SCLR[d.status]||'bg-gray-100 text-gray-500'}`}>{d.status}</span></td>
                <td className="px-4 py-2.5 text-[10px] text-gray-400">{d.uploaded}</td>
                <td className="px-4 py-2.5"><div className="flex items-center gap-1">
                  <button onClick={()=>{setPrepDoc(d);setShowPrep(true)}} className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded" title="전처리 설정"><SlidersHorizontal size={13}/></button>
                  <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="다운로드"><Download size={13}/></button>
                  <button onClick={()=>delDoc(d.id)} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="삭제"><Trash2 size={13}/></button>
                </div></td>
              </tr>)}
            </tbody></table>
          )}
        </div>
      </div>
    </div>}
    {/* Tab 2: 배치·동기화 */}
    {kbTab==='batch'&&<div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {[{src:'그룹웨어',icon:Globe,desc:'사내 그룹웨어 문서 자동 수집',last:'2026-02-25 02:00',c:'border-blue-200'},
          {src:'ERP',icon:Database,desc:'ERP 시스템 규정/인사 자료 동기화',last:'2026-02-24 03:00',c:'border-green-200'},
          {src:'DMS',icon:Server,desc:'문서관리시스템 실시간 연동',last:'2026-02-25 09:15',c:'border-purple-200'}
        ].map((s,i)=><div key={i} className={`p-4 rounded-xl border bg-white shadow-sm ${s.c}`}>
          <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><s.icon size={18} className="text-gray-600"/><span className="font-bold text-sm">{s.src}</span></div>
            <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle size={10}/>연결됨</span></div>
          <p className="text-xs text-gray-500 mb-1">{s.desc}</p>
          <div className="text-xs text-gray-400">마지막: {s.last}</div>
        </div>)}
      </div>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between"><h3 className="font-bold text-sm">배치 스케줄 관리</h3>
          <button className="text-sm text-blue-600 font-medium flex items-center hover:text-blue-700"><Plus size={14} className="mr-1"/>추가</button></div>
        <table className="w-full text-sm"><thead><tr className="bg-gray-50 text-xs text-gray-500">
          {['소스','대상 폴더','스케줄','마지막 실행','결과','문서 변경','활성'].map((h,i)=><th key={i} className="text-left px-4 py-2.5 font-semibold">{h}</th>)}
        </tr></thead><tbody className="divide-y divide-gray-50">
          {batches.map(bj=><tr key={bj.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 font-medium text-sm">{bj.src}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{bj.target}</td>
            <td className="px-4 py-3"><span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded font-mono">{bj.schedule}</span></td>
            <td className="px-4 py-3 text-xs text-gray-500">{bj.lastRun}</td>
            <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${bj.lastResult==='성공'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{bj.lastResult}</span></td>
            <td className="px-4 py-3 text-xs text-gray-600">+{bj.addedDocs} / ~{bj.updatedDocs} / -{bj.deletedDocs}</td>
            <td className="px-4 py-3"><ToggleSwitch on={bj.enabled} onChange={()=>toggleBatch(bj.id)}/></td>
          </tr>)}
        </tbody></table>
      </div>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between"><h3 className="font-bold text-sm">동기화 로그</h3>
          <button className="text-xs text-gray-500 flex items-center gap-1"><RefreshCw size={12}/>새로고침</button></div>
        <table className="w-full text-sm"><thead><tr className="bg-gray-50 text-xs text-gray-500">
          {['시각','소스','폴더','파일명','액션','PII','상태'].map((h,i)=><th key={i} className="text-left px-4 py-2 font-semibold">{h}</th>)}
        </tr></thead><tbody className="divide-y divide-gray-50">
          {MOCK_SYNC_LOGS.map(log=><tr key={log.id} className="hover:bg-gray-50 text-xs">
            <td className="px-4 py-2.5 text-gray-400 whitespace-nowrap">{log.time}</td>
            <td className="px-4 py-2.5 font-medium">{log.src}</td>
            <td className="px-4 py-2.5 text-gray-500">{log.folder}</td>
            <td className="px-4 py-2.5 text-gray-700 max-w-[160px] truncate">{log.file}</td>
            <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded-full ${log.action==='추가'?'bg-blue-100 text-blue-700':log.action==='업데이트'?'bg-yellow-100 text-yellow-700':'bg-red-100 text-red-700'}`}>{log.action}</span></td>
            <td className="px-4 py-2.5">{log.pii?<span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">PII</span>:<span className="text-gray-300">-</span>}</td>
            <td className="px-4 py-2.5"><span className={log.status.includes('완료')?'text-green-600':log.status==='실패'?'text-red-500':'text-gray-500'}>{log.status}</span></td>
          </tr>)}
        </tbody></table>
      </div>
    </div>}
    {/* Tab 3: 에이전트 연동 */}
    {kbTab==='agent'&&<div className="grid grid-cols-3 gap-4">
      {[{agent:'사규 기반 문서 사전 검토',folders:['공시업무규정','법률/계약'],icon:CheckSquare,color:'bg-indigo-50 text-indigo-700'},
        {agent:'가격 검증 어시스턴트',folders:['조사·평가 매뉴얼','공시업무규정'],icon:Wrench,color:'bg-blue-50 text-blue-700'},
        {agent:'HR 질의응답 봇',folders:['인사규정','교육자료'],icon:Users,color:'bg-green-50 text-green-700'},
      ].map((ag,i)=><div key={i} className="bg-white rounded-xl border shadow-sm p-5">
        <div className={`w-10 h-10 rounded-xl ${ag.color.split(' ')[0]} flex items-center justify-center mb-3`}><ag.icon size={20} className={ag.color.split(' ')[1]}/></div>
        <h3 className="font-bold text-sm mb-1">{ag.agent}</h3>
        <p className="text-xs text-gray-500 mb-3">연결된 지식 폴더</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {ag.folders.map((f,j)=><span key={j} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-lg flex items-center gap-1"><Folder size={10}/>{f}</span>)}
        </div>
        <button className="w-full text-xs text-blue-600 border border-blue-200 rounded-lg py-2 hover:bg-blue-50 flex items-center justify-center gap-1"><Plus size={12}/>폴더 연결 추가</button>
      </div>)}
    </div>}
    {/* 업로드 모달 */}
    <Modal isOpen={showUp} onClose={()=>{setShowUp(false);setUpFile({name:'',pii:false,scanning:false,scanned:false})}} title="문서 업로드" size="md">
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
          <UploadCloud size={28} className="mx-auto text-gray-300 mb-2"/>
          <p className="text-sm text-gray-500 mb-3">PDF, DOCX, XLSX, PPTX 지원</p>
          <input type="text" placeholder="파일명 입력 (시뮬레이션)" value={upFile.name} onChange={e=>setUpFile(p=>({...p,name:e.target.value,scanned:false,scanning:false}))} className="w-full border rounded-lg px-3 py-2 text-sm"/>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div><div className="text-sm font-medium">개인정보(PII) 자동 탐지</div><div className="text-xs text-gray-400">주민번호·연락처·계좌번호 자동 마스킹</div></div>
          {!upFile.scanned&&!upFile.scanning&&<button onClick={scan} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg">스캔 실행</button>}
          {upFile.scanning&&<span className="text-xs text-blue-600 animate-pulse">스캔 중...</span>}
          {upFile.scanned&&(upFile.pii?<span className="text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg flex items-center gap-1"><AlertCircle size={12}/>PII 탐지 → 마스킹</span>:<span className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg flex items-center gap-1"><CheckCircle size={12}/>PII 없음</span>)}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className="text-xs text-gray-500">청크 크기</label><input type="number" defaultValue={512} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"/></div>
          <div><label className="text-xs text-gray-500">오버랩</label><input type="number" defaultValue={50} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"/></div>
          <div><label className="text-xs text-gray-500">분할 방식</label><select className="w-full mt-1 border rounded-lg px-3 py-2 text-sm bg-white"><option>의미 단위</option><option>고정 크기</option><option>문단</option></select></div>
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={()=>{setShowUp(false);setUpFile({name:'',pii:false,scanning:false,scanned:false})}} className="flex-1 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">취소</button>
          <button onClick={doUpload} disabled={!upFile.name} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40">업로드 및 색인</button>
        </div>
      </div>
    </Modal>
    {/* 권한 모달 */}
    <Modal isOpen={showPerm} onClose={()=>setShowPerm(false)} title={`'${sel?.name}' 접근 권한 설정`} size="md">
      <div className="space-y-4">
        <div><label className="text-sm font-medium text-gray-700 block mb-2">공개 범위</label>
          <div className="space-y-2">
            {[['all','전체 공개','모든 사용자가 조회 가능'],['dept','부서별','지정 부서만 접근'],['specific','특정 사용자','지정 사용자만 접근'],['admin','관리자 전용','관리자만 접근 가능']].map(([k,l,d])=>(
              <label key={k} className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition-colors ${sel?.perm===k?'border-blue-500 bg-blue-50':'border-transparent bg-gray-50 hover:border-gray-200'}`}>
                <input type="radio" name="perm" value={k} defaultChecked={sel?.perm===k} className="mt-0.5 mr-3"/>
                <div><div className="text-sm font-medium">{l}</div><div className="text-xs text-gray-500">{d}</div></div>
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={()=>setShowPerm(false)} className="flex-1 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">취소</button>
          <button onClick={()=>{setShowPerm(false);showToast('권한이 업데이트되었습니다.','success')}} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">저장</button>
        </div>
      </div>
    </Modal>
    {/* ── 수동 전처리 모달 ── */}
    <Modal isOpen={showPrep} onClose={closePrep} title="수동 전처리" size="lg">
      {prepDoc&&<div className="space-y-4">

        {/* 파일 정보 배너 */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border">
          <FileText size={18} className="text-indigo-600 shrink-0"/>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-gray-800 truncate">{prepDoc.name}</div>
            <div className="text-xs text-gray-400">{prepDoc.size} · {prepDoc.chunks}청크 (기존)</div>
          </div>
          <span className="text-xs px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full font-bold shrink-0">문서 AI</span>
        </div>

        {/* 탭: Document OCR | Document Parse */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          {[['ocr','Document OCR','스캔·이미지 텍스트 추출',ScanLine],['parse','Document Parse','구조 문서 레이아웃 파싱',FileCode2]].map(([key,label,sub,Icon])=>(
            <button key={key} onClick={()=>{setPrepTab(key);resetPrep();}} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm transition-all ${prepTab===key?'bg-white shadow-sm text-indigo-700':'text-gray-500 hover:text-gray-700'}`}>
              <Icon size={15}/>
              <div className="text-left">
                <div className="font-bold text-[13px]">{label}</div>
                <div className="text-[10px] opacity-70">{sub}</div>
              </div>
            </button>
          ))}
        </div>

        {/* ═══ Document OCR 탭 ═══ */}
        {prepTab==='ocr'&&<div className="space-y-3">
          {/* 설정 */}
          {ocrState==='idle'&&<div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-medium text-gray-500 block mb-1">인식 언어</label>
                <select value={ocrLang} onChange={e=>setOcrLang(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm bg-white">
                  <option value="auto">자동 감지</option><option value="ko">한국어</option>
                  <option value="en">English</option><option value="ko-en">한국어+영어</option>
                </select></div>
              <div><label className="text-xs font-medium text-gray-500 block mb-1.5">인식 영역 표시</label>
                <button onClick={()=>setOcrShowBbox(!ocrShowBbox)} className={`relative inline-flex w-10 h-5 rounded-full transition-colors ${ocrShowBbox?'bg-indigo-600':'bg-gray-200'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${ocrShowBbox?'translate-x-5':'translate-x-0.5'}`}/>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-700">
              <ScanLine size={12} className="shrink-0"/>
              지원 형식: PNG · JPG · TIFF · PDF(스캔본) — 이미지 기반 스캔 문서에 최적화
            </div>
            <button onClick={runOcr} className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors">
              <ScanLine size={16}/> OCR 실행
            </button>
          </div>}

          {/* 처리 중 */}
          {ocrState==='processing'&&<div className="flex flex-col items-center py-10 gap-3">
            <Loader2 size={36} className="animate-spin text-indigo-600"/>
            <div className="text-sm font-bold text-gray-700">OCR 처리 중...</div>
            <div className="text-xs text-gray-400">텍스트 및 인식 영역 추출 중</div>
            <div className="w-64 bg-gray-100 rounded-full h-1.5 mt-1"><div className="bg-indigo-600 h-1.5 rounded-full w-3/5 animate-pulse"/></div>
          </div>}

          {/* 결과 */}
          {ocrState==='done'&&ocrResult&&<div className="space-y-3">
            {/* 통계 */}
            <div className="grid grid-cols-3 gap-2">
              {[['총 페이지',ocrResult.totalPages+'쪽','text-blue-600','bg-blue-50'],
                ['추출 블록',ocrResult.totalBlocks+'개','text-green-600','bg-green-50'],
                ['처리 시간',ocrResult.elapsed+'s','text-orange-600','bg-orange-50'],
              ].map(([l,v,c,bg])=>(
                <div key={l} className={`${bg} rounded-xl p-2.5 border text-center`}>
                  <div className={`text-lg font-black ${c}`}>{v}</div>
                  <div className="text-[10px] text-gray-500 font-medium">{l}</div>
                </div>
              ))}
            </div>
            {/* 페이지 탭 */}
            <div className="flex gap-1">
              {ocrResult.pages.map((_,i)=>(
                <button key={i} onClick={()=>setOcrPageIdx(i)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold border transition-colors ${ocrPageIdx===i?'bg-indigo-600 text-white border-indigo-600':'border-gray-200 text-gray-500 hover:border-indigo-300'}`}>
                  {i+1}쪽
                </button>
              ))}
            </div>
            {/* 2단 프리뷰 */}
            <div className="grid grid-cols-2 gap-3">
              {/* 좌: 문서 미리보기 + OCR 하이라이트 */}
              <div className="border-2 rounded-xl overflow-hidden">
                <div className="px-3 py-2 border-b bg-gray-50 text-[11px] font-bold text-gray-500 flex items-center gap-1">
                  <Eye size={11}/> 문서 미리보기 (OCR 인식 영역)
                </div>
                <div className="p-3 bg-white" style={{minHeight:200}}>
                  {/* 실제 문서 시뮬레이션: 텍스트 블록을 bbox 위치에 배치 */}
                  <div className="relative bg-white border border-gray-200 rounded shadow-sm overflow-hidden" style={{minHeight:220,fontFamily:'serif'}}>
                    {/* 문서 텍스트 블록 (실제 위치에 렌더링) */}
                    {ocrResult.pages[ocrPageIdx]?.blocks.map((blk,bi)=>(
                      <div key={`t-${bi}`} className="absolute text-gray-800 leading-tight select-none"
                        style={{
                          left:`${blk.bbox.x}%`,top:`${blk.bbox.y}%`,
                          width:`${blk.bbox.w}%`,
                          fontSize: blk.bbox.h>7?'10px':'8.5px',
                          fontWeight: blk.text.startsWith('제')&&blk.text.includes('조')?'700':'400',
                        }}>
                        {blk.text}
                      </div>
                    ))}
                    {/* OCR 인식 영역 하이라이트 오버레이 */}
                    {ocrShowBbox&&ocrResult.pages[ocrPageIdx]?.blocks.map((blk,bi)=>(
                      <div key={`h-${bi}`}
                        className="absolute rounded-sm border border-indigo-400/70 bg-indigo-200/30 hover:bg-indigo-200/50 transition-colors cursor-default"
                        style={{
                          left:`${blk.bbox.x}%`,top:`${blk.bbox.y}%`,
                          width:`${blk.bbox.w}%`,height:`${Math.max(blk.bbox.h,5)}%`,
                        }}
                        title={blk.text}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {/* 우: 추출 텍스트 편집 */}
              <div className="border-2 rounded-xl overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b bg-gray-50 text-[11px] font-bold text-gray-500 flex items-center gap-1">
                  <Edit3 size={11}/> 추출 텍스트 (편집 가능)
                </div>
                <textarea
                  value={ocrResult.pages[ocrPageIdx]?.text||''}
                  onChange={e=>setOcrResult(prev=>({...prev,pages:prev.pages.map((p,i)=>i===ocrPageIdx?{...p,text:e.target.value}:p)}))}
                  className="flex-1 p-3 text-xs resize-none border-none outline-none font-mono bg-white"
                  style={{minHeight:180}}
                />
              </div>
            </div>
            {/* 블록 목록 */}
            <div className="border rounded-xl overflow-hidden">
              <div className="px-3 py-2 bg-gray-50 border-b text-[11px] font-bold text-gray-500 flex items-center gap-1">
                <LayoutList size={11}/> 인식 블록 목록 — {ocrResult.pages[ocrPageIdx]?.blocks.length}개
              </div>
              <div className="max-h-28 overflow-y-auto divide-y">
                {ocrResult.pages[ocrPageIdx]?.blocks.map((blk,bi)=>(
                  <div key={bi} className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-indigo-50/40 group">
                    <span className="w-5 text-center text-[9px] font-bold text-indigo-400 shrink-0">#{bi+1}</span>
                    <span className="text-gray-300 font-mono text-[9px] shrink-0">[{blk.bbox.x},{blk.bbox.y}]</span>
                    <span className="flex-1 truncate text-gray-600">{blk.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>}
        </div>}

        {/* ═══ Document Parse 탭 ═══ */}
        {prepTab==='parse'&&<div className="space-y-3">
          {/* 설정 */}
          {parseState==='idle'&&<div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-xs font-medium text-gray-500 block mb-1">출력 형식</label>
                <select value={parseFormat} onChange={e=>setParseFormat(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm bg-white">
                  <option value="markdown">Markdown</option>
                  <option value="html">HTML</option>
                  <option value="text">Plain Text</option>
                </select></div>
              <div><label className="text-xs font-medium text-gray-500 block mb-1">파싱 모드</label>
                <select value={parseMode} onChange={e=>setParseMode(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm bg-white">
                  <option value="auto">Auto (권장)</option>
                  <option value="standard">Standard — 텍스트 중심</option>
                  <option value="enhanced">Enhanced — 표·이미지 포함</option>
                </select></div>
              <div><label className="text-xs font-medium text-gray-500 block mb-1">페이지 분할</label>
                <select value={parseSplit?'page':'doc'} onChange={e=>setParseSplit(e.target.value==='page')} className="w-full border rounded-lg px-3 py-2 text-sm bg-white">
                  <option value="doc">문서 단위</option>
                  <option value="page">페이지 단위</option>
                </select></div>
            </div>
            <div className="flex items-center gap-5 px-3 py-2.5 bg-gray-50 border rounded-xl text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={parseCoords} onChange={e=>setParseCoords(e.target.checked)} className="rounded"/>
                <span className="font-medium text-gray-600">좌표 추출</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={parseBase64} onChange={e=>setParseBase64(e.target.checked)} className="rounded"/>
                <span className="font-medium text-gray-600">이미지 Base64</span>
              </label>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-700">
              <FileCode2 size={12} className="shrink-0"/>
              지원 형식: PDF · DOCX · PPTX · XLSX · HWP — 레이아웃·표·수식·그림 자동 추출
            </div>
            <button onClick={runParse} className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors">
              <FileCode2 size={16}/> 문서 파싱 실행
            </button>
          </div>}

          {/* 처리 중 */}
          {parseState==='processing'&&<div className="flex flex-col items-center py-8 gap-3">
            <Loader2 size={36} className="animate-spin text-indigo-600"/>
            <div className="text-sm font-bold text-gray-700">문서 파싱 중...</div>
            <div className="text-xs text-gray-400">문서 레이아웃 구조 분석 중</div>
            <div className="mt-2 space-y-1.5 w-full max-w-xs">
              {['레이아웃 감지','요소 분류 (단락·표·그림)','테이블 구조 추출','마크다운/HTML 변환'].map((step,i)=>(
                <div key={i} className="flex items-center gap-2 text-xs">
                  {i<2?<CheckCircle size={13} className="text-green-500 shrink-0"/>:i===2?<Loader2 size={13} className="animate-spin text-indigo-500 shrink-0"/>:<div className="w-3.5 h-3.5 rounded-full border-2 border-gray-200 shrink-0"/>}
                  <span className={i<3?'text-gray-700':'text-gray-300'}>{step}</span>
                </div>
              ))}
            </div>
          </div>}

          {/* 결과 */}
          {parseState==='done'&&parseResult&&<div className="space-y-3">
            {/* 요소 통계 */}
            <div className="grid grid-cols-5 gap-2">
              {[['단락',parseResult.statistics.paragraphs,'text-blue-600','bg-blue-50'],
                ['제목',parseResult.statistics.headings,'text-purple-600','bg-purple-50'],
                ['표',parseResult.statistics.tables,'text-green-600','bg-green-50'],
                ['그림',parseResult.statistics.figures,'text-orange-600','bg-orange-50'],
                ['합계',parseResult.statistics.total,'text-gray-700','bg-gray-50'],
              ].map(([l,cnt,c,bg])=>(
                <div key={l} className={`${bg} rounded-xl p-2.5 border text-center`}>
                  <div className={`text-xl font-black ${c}`}>{cnt}</div>
                  <div className="text-[10px] text-gray-500 font-medium">{l}</div>
                </div>
              ))}
            </div>
            {/* 2단: 요소 목록 + 편집 가능 출력 */}
            <div className="grid grid-cols-2 gap-3">
              {/* 좌: 감지된 요소 목록 */}
              <div className="border-2 rounded-xl overflow-hidden">
                <div className="px-3 py-2 border-b bg-gray-50 text-[11px] font-bold text-gray-500 flex items-center gap-1">
                  <LayoutList size={11}/> 감지된 요소 ({parseResult.elements.length}개)
                </div>
                <div className="max-h-52 overflow-y-auto divide-y">
                  {parseResult.elements.map((el,i)=>{
                    const tagMap={heading1:'H1',heading2:'H2',heading3:'H3',paragraph:'P',table:'TBL',figure:'IMG',list:'LIST'};
                    const clrMap={heading1:'bg-purple-100 text-purple-700',heading2:'bg-purple-100 text-purple-700',heading3:'bg-purple-100 text-purple-700',paragraph:'bg-blue-100 text-blue-700',table:'bg-green-100 text-green-700',figure:'bg-orange-100 text-orange-700',list:'bg-yellow-100 text-yellow-700'};
                    return(
                      <div key={i} className="flex items-start gap-2 px-3 py-1.5 hover:bg-gray-50 text-xs">
                        <span className={`shrink-0 text-[9px] px-1.5 py-0.5 rounded font-black mt-0.5 ${clrMap[el.category]||'bg-gray-100 text-gray-600'}`}>{tagMap[el.category]||el.category.toUpperCase()}</span>
                        <span className="flex-1 text-gray-600 truncate">{el.content.substring(0,55)}{el.content.length>55?'…':''}</span>
                        {el.page&&<span className="shrink-0 text-[9px] text-gray-300">{el.page}p</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* 우: 출력 편집 */}
              <div className="border-2 rounded-xl overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b bg-gray-50 text-[11px] font-bold text-gray-500 flex items-center justify-between">
                  <div className="flex items-center gap-1"><Edit3 size={11}/> {parseFormat.toUpperCase()} 출력 (편집)</div>
                  <div className="flex gap-0.5">
                    {['markdown','html','text'].map(f=>(
                      <button key={f} onClick={()=>{setParseFormat(f);setParsedContent(parseResult.outputs[f]);}}
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold transition-colors ${parseFormat===f?'bg-indigo-600 text-white':'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea value={parsedContent} onChange={e=>setParsedContent(e.target.value)}
                  className="flex-1 p-3 text-xs resize-none border-none outline-none font-mono bg-white"
                  style={{minHeight:210}}/>
              </div>
            </div>
            {/* 옵션 적용 안내 */}
            <div className="flex flex-wrap gap-2">
              {parseCoords&&<span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-purple-50 border border-purple-200 rounded-lg text-purple-700 font-medium"><CheckSquare size={11}/>좌표 데이터 포함됨</span>}
              {parseBase64&&<span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-orange-50 border border-orange-200 rounded-lg text-orange-700 font-medium"><CheckSquare size={11}/>이미지 Base64 포함됨</span>}
              {parseSplit&&<span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 font-medium"><CheckSquare size={11}/>페이지 단위 분할</span>}
            </div>
          </div>}
        </div>}

        {/* 하단 버튼 */}
        <div className="flex gap-2 pt-3 border-t">
          {(ocrState==='done'||parseState==='done')&&(
            <button onClick={resetPrep} className="px-3 py-2 border rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">초기화</button>
          )}
          <div className="flex-1"/>
          <button onClick={closePrep} className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">취소</button>
          <button
            disabled={ocrState!=='done'&&parseState!=='done'}
            onClick={()=>{closePrep();showToast('전처리 결과가 RAG 파이프라인에 반영되었습니다.','success');}}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold disabled:opacity-40 hover:bg-indigo-700 transition-colors flex items-center gap-1.5">
            <CheckCircle size={14}/> 전처리 적용 및 색인
          </button>
        </div>

      </div>}
    </Modal>
  </PageShell>);
};

const UsageHistoryPage = () => {
  const [hist]=useState(MOCK_USAGE_HISTORY.map(h=>({...h})));
  const [search,setSearch]=useState('');
  const [modeF,setModeF]=useState('ALL');
  const [expRow,setExpRow]=useState(null);
  const MLBL={GENERAL:'일반질의',REVIEW:'문서검토',TRANSLATE:'번역·요약',REPORT:'보고서',AGENT:'에이전트',SECURE:'보안채팅'};
  const MCLR={GENERAL:'bg-blue-100 text-blue-700',REVIEW:'bg-indigo-100 text-indigo-700',TRANSLATE:'bg-violet-100 text-violet-700',REPORT:'bg-emerald-100 text-emerald-700',AGENT:'bg-orange-100 text-orange-700',SECURE:'bg-red-100 text-red-700'};
  const filt=hist.filter(h=>(modeF==='ALL'||h.mode===modeF)&&(!search||h.query.includes(search)||h.user.includes(search)));
  const errC=filt.filter(h=>h.errReport).length;
  const avgR=(filt.reduce((s,h)=>s+(h.rating||0),0)/(filt.length||1)).toFixed(1);
  return(<PageShell breadcrumb={['관리자 전용','이용 이력 관리']} title="이용 이력 관리">
    <div className="grid grid-cols-4 gap-4 mb-5">
      {[{l:'전체 질의 수',v:filt.length+'건',c:'border-blue-500 bg-blue-50',tc:'text-blue-700'},
        {l:'사용 토큰',v:(filt.reduce((s,h)=>s+h.tokens,0)/1000).toFixed(1)+'K',c:'border-green-500 bg-green-50',tc:'text-green-700'},
        {l:'평균 만족도',v:avgR+'/5',c:'border-yellow-500 bg-yellow-50',tc:'text-yellow-700'},
        {l:'오류 신고',v:errC+'건',c:'border-red-500 bg-red-50',tc:'text-red-700'}
      ].map((s,i)=><div key={i} className={`p-5 rounded-xl border-l-4 shadow-sm ${s.c}`}>
        <div className="text-xs text-gray-500">{s.l}</div><div className={`text-2xl font-bold mt-1 ${s.tc}`}>{s.v}</div>
      </div>)}
    </div>
    <div className="bg-white rounded-xl border shadow-sm p-4 mb-4 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 flex-1 min-w-[180px]">
        <Search size={14} className="text-gray-400 shrink-0"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="사용자명·질의 내용 검색" className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"/>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {['ALL','GENERAL','REVIEW','TRANSLATE','REPORT','AGENT','SECURE'].map(m=>(
          <button key={m} onClick={()=>setModeF(m)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${modeF===m?'bg-blue-600 text-white':'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {m==='ALL'?'전체':MLBL[m]}
          </button>
        ))}
      </div>
    </div>
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <table className="w-full text-sm"><thead><tr className="bg-gray-50 text-xs text-gray-500 border-b">
        {['시각','사용자','모드','질의 내용','토큰','만족도','오류신고',''].map((h,i)=><th key={i} className="text-left px-4 py-3 font-semibold">{h}</th>)}
      </tr></thead><tbody className="divide-y divide-gray-50">
        {filt.map(h=>(
          <React.Fragment key={h.id}>
            <tr className={`hover:bg-gray-50 cursor-pointer transition-colors ${h.errReport?'bg-red-50/30':''}`} onClick={()=>setExpRow(expRow===h.id?null:h.id)}>
              <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{h.time}</td>
              <td className="px-4 py-3"><div className="font-medium">{h.user}</div><div className="text-xs text-gray-400">{h.dept}</div></td>
              <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-bold ${MCLR[h.mode]||'bg-gray-100 text-gray-500'}`}>{MLBL[h.mode]}</span></td>
              <td className="px-4 py-3 max-w-[220px]"><p className="text-sm text-gray-700 truncate">{h.query}</p></td>
              <td className="px-4 py-3 text-xs text-gray-500">{h.tokens}</td>
              <td className="px-4 py-3"><div className="flex gap-0.5">{[1,2,3,4,5].map(s=><Star key={s} size={12} className={s<=h.rating?'text-yellow-400 fill-yellow-400':'text-gray-200'}/>)}</div></td>
              <td className="px-4 py-3">{h.errReport&&<span className="flex items-center gap-1 text-xs text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full w-fit"><AlertTriangle size={10}/>신고됨</span>}</td>
              <td className="px-4 py-3"><ChevronDown size={14} className={`text-gray-400 transition-transform ${expRow===h.id?'rotate-180':''}`}/></td>
            </tr>
            {expRow===h.id&&<tr className="bg-blue-50/20"><td colSpan={8} className="px-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><div className="text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">질의</div><div className="text-sm text-gray-700 bg-white rounded-lg p-3 border leading-relaxed">{h.query}</div></div>
                <div><div className="text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">AI 답변 요약</div>
                  <div className="text-sm text-gray-700 bg-white rounded-lg p-3 border leading-relaxed line-clamp-3">{h.answer}</div>
                  {h.errReport&&<div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-100 text-xs text-red-600"><AlertTriangle size={10} className="inline mr-1"/><strong>신고 사유:</strong> {h.errDetail}</div>}
                </div>
              </div>
            </td></tr>}
          </React.Fragment>
        ))}
      </tbody></table>
    </div>
  </PageShell>);
};

const SatisfactionMgmtPage = () => {
  const [data]=useState(MOCK_SATISFACTION_DATA);
  return(<PageShell breadcrumb={['관리자 전용','이용만족도 관리']} title="이용만족도 관리" action={<button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"><Plus size={14} className="mr-1.5"/>만족도 조사 발송</button>}>
    <div className="grid grid-cols-4 gap-4 mb-6">
      {[{l:'평균 만족도',v:`${data.avg}점`,c:'border-yellow-500 bg-yellow-50',tc:'text-yellow-700'},
        {l:'총 응답 수',v:`${data.total}건`,c:'border-blue-500 bg-blue-50',tc:'text-blue-700'},
        {l:'응답률',v:'68%',c:'border-green-500 bg-green-50',tc:'text-green-700'},
        {l:'오류 신고',v:'12건',c:'border-red-500 bg-red-50',tc:'text-red-700'}
      ].map((s,i)=><div key={i} className={`p-5 rounded-xl border-l-4 shadow-sm ${s.c}`}>
        <div className="text-xs text-gray-500">{s.l}</div><div className={`text-2xl font-bold mt-1 ${s.tc}`}>{s.v}</div>
      </div>)}
    </div>
    <div className="grid grid-cols-3 gap-5 mb-6">
      <div className="bg-white rounded-xl border shadow-sm p-5">
        <h3 className="font-bold text-sm mb-4">평점 분포</h3>
        <div className="space-y-2.5">
          {data.dist.map(d=><div key={d.stars} className="flex items-center gap-3">
            <div className="flex gap-0.5 w-14 shrink-0">{[1,2,3,4,5].map(s=><Star key={s} size={10} className={s<=d.stars?'text-yellow-400 fill-yellow-400':'text-gray-200'}/>)}</div>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 rounded-full" style={{width:`${d.pct}%`}}/></div>
            <div className="text-xs text-gray-500 w-16 text-right">{d.count}건 ({d.pct}%)</div>
          </div>)}
        </div>
      </div>
      <div className="col-span-2 bg-white rounded-xl border shadow-sm p-5">
        <h3 className="font-bold text-sm mb-4">주간 만족도 추이</h3>
        <div className="flex items-end gap-2 h-28">
          {[{d:'02-19',v:3.8},{d:'02-20',v:4.0},{d:'02-21',v:4.1},{d:'02-22',v:3.9},{d:'02-23',v:4.3},{d:'02-24',v:4.5},{d:'02-25',v:4.2}].map((pt,i)=>(
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-[10px] font-bold text-yellow-600">{pt.v}</div>
              <div className="w-full rounded-t-md overflow-hidden" style={{height:`${(pt.v/5)*100}%`,minHeight:'8px'}}>
                <div className="w-full h-full bg-yellow-400"></div>
              </div>
              <div className="text-[9px] text-gray-400">{pt.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between"><h3 className="font-bold text-sm">최근 응답</h3>
        <span className="text-xs text-gray-400">최근 5건</span></div>
      <table className="w-full text-sm"><thead><tr className="bg-gray-50 text-xs text-gray-500 border-b">
        {['사용자','부서','평점','의견','날짜'].map((h,i)=><th key={i} className="text-left px-4 py-2.5 font-semibold">{h}</th>)}
      </tr></thead><tbody className="divide-y divide-gray-50">
        {data.recent.map(r=><tr key={r.id} className="hover:bg-gray-50">
          <td className="px-4 py-3 font-medium">{r.user}</td>
          <td className="px-4 py-3 text-xs text-gray-500">{r.dept}</td>
          <td className="px-4 py-3"><div className="flex gap-0.5">{[1,2,3,4,5].map(s=><Star key={s} size={12} className={s<=r.stars?'text-yellow-400 fill-yellow-400':'text-gray-200'}/>)}</div></td>
          <td className="px-4 py-3 text-xs text-gray-700 max-w-[300px]">{r.comment}</td>
          <td className="px-4 py-3 text-xs text-gray-400">{r.date}</td>
        </tr>)}
      </tbody></table>
    </div>
  </PageShell>);
};

const UsageStatsPage = () => {
  const [period,setPeriod]=useState('week');
  const maxQ=Math.max(...MOCK_USAGE_STATS.daily.map(d=>d.queries));
  return (
    <PageShell breadcrumb={['관리자 전용','이용 통계']} title="이용 통계 및 분석">
      <div className="flex items-center space-x-2 mb-5">
        {[['week','최근 7일'],['month','최근 30일'],['quarter','분기']].map(([k,l])=>(
          <button key={k} onClick={()=>setPeriod(k)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period===k?'bg-blue-600 text-white':'bg-white border hover:bg-gray-50'}`}>{l}</button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[{l:'총 질의 수',v:'11,470',c:'border-blue-500',tc:'text-blue-700',bg:'bg-blue-50',icon:MessageSquare},{l:'활성 사용자',v:'128',c:'border-green-500',tc:'text-green-700',bg:'bg-green-50',icon:Users},{l:'평균 응답시간',v:'1.1s',c:'border-purple-500',tc:'text-purple-700',bg:'bg-purple-50',icon:Clock},{l:'만족도',v:'4.2/5',c:'border-orange-500',tc:'text-orange-700',bg:'bg-orange-50',icon:Star}].map((c,i)=>(
          <div key={i} className={`p-5 rounded-xl border-l-4 bg-white shadow-sm ${c.c}`}>
            <div className="flex items-center justify-between mb-2"><span className="text-xs text-gray-500">{c.l}</span><c.icon size={16} className="text-gray-300"/></div>
            <div className={`text-2xl font-bold ${c.tc}`}>{c.v}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="col-span-2 bg-white rounded-xl border shadow-sm p-5">
          <h3 className="font-bold text-sm mb-4">일별 질의량 추이</h3>
          <div className="flex items-end space-x-2 h-40">
            {MOCK_USAGE_STATS.daily.map((d,i)=>(
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-blue-100 rounded-t-md relative" style={{height:`${(d.queries/maxQ)*100}%`,minHeight:'4px'}}>
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 font-medium whitespace-nowrap">{d.queries}</div>
                </div>
                <div className="text-[10px] text-gray-400 mt-1.5 font-medium">{d.date}</div>
                <div className="text-[10px] text-gray-300">{d.users}명</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border shadow-sm p-5">
          <h3 className="font-bold text-sm mb-4">부서별 이용 현황</h3>
          <div className="space-y-3">{MOCK_USAGE_STATS.byDept.map((d,i)=>(
            <div key={i}>
              <div className="flex justify-between text-xs mb-1"><span className="text-gray-600 font-medium">{d.dept}</span><span className="text-gray-500">{d.queries.toLocaleString()}건 ({d.pct}%)</span></div>
              <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{width:`${d.pct*100/28}%`}}/></div>
            </div>
          ))}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border shadow-sm p-5">
          <h3 className="font-bold text-sm mb-4">모델별 사용량</h3>
          <div className="space-y-3">{MOCK_USAGE_STATS.byModel.map((m,i)=>(
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2"><Cpu size={14} className="text-gray-400"/><span className="text-sm font-medium">{m.model}</span></div>
              <div className="flex items-center space-x-3"><span className="text-sm font-bold">{m.queries.toLocaleString()}</span><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{m.pct}%</span></div>
            </div>
          ))}</div>
        </div>
        <div className="bg-white rounded-xl border shadow-sm p-5">
          <h3 className="font-bold text-sm mb-4">인기 검색 키워드 (Top 10)</h3>
          <div className="flex flex-wrap gap-2">{MOCK_USAGE_STATS.topKeywords.map((kw,i)=>(
            <span key={i} className={`px-3 py-1.5 rounded-full border text-sm font-medium ${i<3?'bg-blue-50 text-blue-700 border-blue-200':'bg-gray-50 text-gray-600 border-gray-200'}`}>
              <Hash size={12} className="inline mr-1"/>{kw}
            </span>
          ))}</div>
        </div>
      </div>
    </PageShell>
  );
};

const AccessLogPage = () => (
  <PageShell breadcrumb={['관리자 전용','접근 로그']} title="접근 및 감사 로그">
    <div className="flex items-center space-x-3 mb-4">
      <div className="relative flex-1 max-w-sm"><input placeholder="사용자, 부서, IP 검색..." className="w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"/><Search size={16} className="absolute left-3 top-3 text-gray-400"/></div>
      <select className="px-3 py-2.5 border rounded-lg text-sm bg-white"><option>전체 액션</option><option>로그인</option><option>에이전트 호출</option><option>설정 변경</option><option>문서 업로드</option></select>
      <select className="px-3 py-2.5 border rounded-lg text-sm bg-white"><option>오늘</option><option>최근 7일</option><option>최근 30일</option></select>
    </div>
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <table className="w-full text-sm"><thead className="bg-gray-50/80"><tr>
        <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">시간</th>
        <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">사용자</th>
        <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">부서</th>
        <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">액션</th>
        <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">IP</th>
        <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">상세</th>
      </tr></thead><tbody className="divide-y divide-gray-100">{MOCK_ACCESS_LOGS.map(l=>(
        <tr key={l.id} className="hover:bg-gray-50/50">
          <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{l.time}</td>
          <td className="px-5 py-3.5 font-medium">{l.user}</td>
          <td className="px-5 py-3.5 text-gray-600 text-xs">{l.dept}</td>
          <td className="px-5 py-3.5"><span className={`px-2 py-0.5 rounded-md text-xs font-medium ${l.action==='로그인'?'bg-green-50 text-green-700':l.action==='에이전트 호출'?'bg-blue-50 text-blue-700':l.action==='설정 변경'?'bg-orange-50 text-orange-700':'bg-purple-50 text-purple-700'}`}>{l.action}</span></td>
          <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{l.ip}</td>
          <td className="px-5 py-3.5 text-gray-500 text-xs">{l.detail}</td>
        </tr>
      ))}</tbody></table>
    </div>
  </PageShell>
);

const QualityManagementPage = () => {
  const [selReview,setSelReview]=useState(null);
  const ratingIcon=r=>r==='good'?<ThumbsUp size={14} className="text-green-600"/>:r==='bad'?<ThumbsDown size={14} className="text-red-600"/>:<Edit3 size={14} className="text-orange-500"/>;
  const ratingLabel=r=>r==='good'?'정확':r==='bad'?'할루시네이션':'수정 필요';
  const ratingBg=r=>r==='good'?'bg-green-50 text-green-700':r==='bad'?'bg-red-50 text-red-700':'bg-orange-50 text-orange-700';
  const good=MOCK_QUALITY_REVIEWS.filter(r=>r.rating==='good').length;
  const edit=MOCK_QUALITY_REVIEWS.filter(r=>r.rating==='edit').length;
  const bad=MOCK_QUALITY_REVIEWS.filter(r=>r.rating==='bad').length;
  return (
    <PageShell breadcrumb={['관리자 전용','AI 품질 관리']} title="AI 답변 품질 관리">
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[{l:'총 검토 건수',v:MOCK_QUALITY_REVIEWS.length,c:'border-blue-500 bg-blue-50',tc:'text-blue-700'},
          {l:'정확',v:good,c:'border-green-500 bg-green-50',tc:'text-green-700'},
          {l:'수정 필요',v:edit,c:'border-orange-500 bg-orange-50',tc:'text-orange-700'},
          {l:'할루시네이션',v:bad,c:'border-red-500 bg-red-50',tc:'text-red-700'},
          {l:'평균 신뢰도',v:((MOCK_QUALITY_REVIEWS.reduce((s,r)=>s+r.confidence,0)/MOCK_QUALITY_REVIEWS.length)*100).toFixed(0)+'%',c:'border-purple-500 bg-purple-50',tc:'text-purple-700'}
        ].map((c,i)=>(
          <div key={i} className={`p-4 rounded-xl border-l-4 bg-white shadow-sm ${c.c}`}>
            <div className="text-xs text-gray-500 mb-1">{c.l}</div>
            <div className={`text-xl font-bold ${c.tc}`}>{c.v}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="col-span-2">
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-gray-50/80 border-b flex items-center justify-between">
              <h3 className="font-bold text-sm">전문가 검토 내역</h3>
              <select className="text-xs border rounded px-2 py-1 bg-white"><option>전체</option><option>정확</option><option>수정 필요</option><option>할루시네이션</option></select>
            </div>
            <div className="divide-y">{MOCK_QUALITY_REVIEWS.map(r=>(
              <div key={r.id} onClick={()=>setSelReview(r)} className="px-5 py-4 hover:bg-gray-50/50 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`flex items-center space-x-1 px-2 py-0.5 rounded-md text-xs font-medium ${ratingBg(r.rating)}`}>{ratingIcon(r.rating)}<span className="ml-1">{ratingLabel(r.rating)}</span></span>
                    <span className="text-xs text-gray-400">{r.agent}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <span>신뢰도: <span className={`font-bold ${r.confidence>=0.9?'text-green-600':r.confidence>=0.7?'text-orange-500':'text-red-600'}`}>{(r.confidence*100).toFixed(0)}%</span></span>
                    <span>{r.date}</span>
                  </div>
                </div>
                <div className="text-sm font-medium mb-1">Q: {r.query}</div>
                <div className="text-xs text-gray-500 truncate">A: {r.answer}</div>
                {r.feedback&&<div className="text-xs text-orange-600 mt-1 flex items-center"><Edit3 size={10} className="mr-1"/>{r.feedback}</div>}
              </div>
            ))}</div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="font-bold text-sm mb-4">신뢰도 임계값 설정</h3>
            <div className="space-y-4">
              <div><label className="text-xs text-gray-500">자동 응답 임계값</label><div className="flex items-center space-x-2 mt-1"><input type="range" min="0" max="100" defaultValue="80" className="flex-1"/><span className="text-sm font-bold text-blue-600">80%</span></div><p className="text-xs text-gray-400 mt-1">이 값 이상이면 자동 응답, 미만이면 전문가 검토 요청</p></div>
              <div><label className="text-xs text-gray-500">할루시네이션 경고 임계값</label><div className="flex items-center space-x-2 mt-1"><input type="range" min="0" max="100" defaultValue="60" className="flex-1"/><span className="text-sm font-bold text-red-600">60%</span></div><p className="text-xs text-gray-400 mt-1">이 값 미만이면 할루시네이션 경고 표시</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="font-bold text-sm mb-3">Golden Data 관리</h3>
            <p className="text-xs text-gray-500 mb-3">검증된 Q&A 쌍을 골든 데이터로 등록하여 답변 품질을 개선합니다.</p>
            <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3 mb-2"><span className="text-sm font-medium text-blue-700">등록된 골든 데이터</span><span className="text-lg font-bold text-blue-700">247<span className="text-xs font-normal text-blue-500 ml-1">건</span></span></div>
            <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600">+ 골든 데이터 등록</button>
          </div>
        </div>
      </div>
      <Modal isOpen={!!selReview} onClose={()=>setSelReview(null)} title="답변 상세 검토" size="lg">
        {selReview&&<div className="space-y-5">
          <div className="flex items-center space-x-3 pb-3 border-b">
            <span className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium ${ratingBg(selReview.rating)}`}>{ratingIcon(selReview.rating)}<span className="ml-1">{ratingLabel(selReview.rating)}</span></span>
            <span className="text-sm text-gray-500">{selReview.agent}</span>
            <span className="text-sm text-gray-400">검토자: {selReview.reviewer}</span>
          </div>
          <div className="bg-blue-50 rounded-lg p-4"><div className="text-xs text-blue-600 font-bold mb-1">질문</div><div className="text-sm">{selReview.query}</div></div>
          <div className="bg-gray-50 rounded-lg p-4"><div className="text-xs text-gray-500 font-bold mb-1">AI 답변 (신뢰도: {(selReview.confidence*100).toFixed(0)}%)</div><div className="text-sm">{selReview.answer}</div></div>
          {selReview.feedback&&<div className="bg-orange-50 rounded-lg p-4"><div className="text-xs text-orange-600 font-bold mb-1">전문가 피드백</div><div className="text-sm text-orange-800">{selReview.feedback}</div></div>}
          <div className="flex space-x-2 justify-end pt-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center"><ThumbsUp size={14} className="mr-1.5"/>골든 데이터 등록</button>
            <button className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">답변 수정</button>
          </div>
        </div>}
      </Modal>
    </PageShell>
  );
};

const AnnouncementPage = () => {
  const toast=useToast();
  const [announcements,setAnnouncements]=useState(MOCK_ANNOUNCEMENTS.map(a=>({...a})));
  const [showCreate,setShowCreate]=useState(false);const [detail,setDetail]=useState(null);
  const [form,setForm]=useState({title:'',category:'공지',content:'',startDate:'2026-02-11',endDate:'2026-03-11'});
  return (
    <PageShell breadcrumb={['관리자 전용','공지사항']} title="공지사항 관리" action={<button onClick={()=>setShowCreate(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"><Plus size={16} className="mr-1.5"/>공지 등록</button>}>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50/80"><tr>
          <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">제목</th>
          <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">분류</th>
          <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">게시 기간</th>
          <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">작성자</th>
          <th className="px-5 py-3.5 text-right text-xs font-medium text-gray-500">조회수</th>
          <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">상태</th>
          <th className="px-5 py-3.5 text-center text-xs font-medium text-gray-500">게시</th>
        </tr></thead><tbody className="divide-y divide-gray-100">{announcements.map(a=>(
          <tr key={a.id} className="hover:bg-gray-50/50 cursor-pointer" onClick={()=>setDetail(a)}>
            <td className="px-5 py-3.5 font-medium">{a.title}</td>
            <td className="px-5 py-3.5"><span className={`px-2 py-0.5 rounded-md text-xs font-medium ${a.category==='공지'?'bg-blue-50 text-blue-700':a.category==='점검'?'bg-orange-50 text-orange-700':'bg-green-50 text-green-700'}`}>{a.category}</span></td>
            <td className="px-5 py-3.5 text-gray-400 text-xs">{a.startDate} ~ {a.endDate}</td>
            <td className="px-5 py-3.5 text-gray-500">{a.author}</td>
            <td className="px-5 py-3.5 text-right font-medium">{a.views}</td>
            <td className="px-5 py-3.5"><StatusBadge status={a.status}/></td>
            <td className="px-5 py-3.5 text-center" onClick={e=>e.stopPropagation()}>
              <ToggleSwitch on={a.status==='게시 중'} onClick={()=>{setAnnouncements(p=>p.map(x=>x.id===a.id?{...x,status:x.status==='게시 중'?'중지':'게시 중'}:x));toast(a.status==='게시 중'?'공지가 중지되었습니다':'공지가 게시되었습니다',a.status==='게시 중'?'info':'success');}}/>
            </td>
          </tr>
        ))}</tbody></table>
      </div>
      <Modal isOpen={showCreate} onClose={()=>setShowCreate(false)} title="공지 등록" size="lg">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">제목</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium mb-1">분류</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>공지</option><option>점검</option><option>업데이트</option></select></div>
            <div><label className="block text-sm font-medium mb-1">시작일</label><input type="date" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
            <div><label className="block text-sm font-medium mb-1">종료일</label><input type="date" value={form.endDate} onChange={e=>setForm({...form,endDate:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">내용</label><textarea value={form.content} onChange={e=>setForm({...form,content:e.target.value})} rows={5} placeholder="공지 내용을 입력하세요..." className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <button onClick={()=>{if(!form.title)return;setAnnouncements(p=>[{id:p.length+1,title:form.title,category:form.category,startDate:form.startDate,endDate:form.endDate,author:'김영빈',views:0,status:'게시 중',content:form.content},...p]);setShowCreate(false);setForm({title:'',category:'공지',content:'',startDate:'2026-02-11',endDate:'2026-03-11'});toast('공지가 등록되었습니다');}} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm">등록</button>
        </div>
      </Modal>
      <Modal isOpen={!!detail} onClose={()=>setDetail(null)} title={detail?.title} size="lg">
        {detail&&<div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">{[['분류',detail.category],['작성자',detail.author],['조회수',detail.views],['게시 기간',`${detail.startDate} ~ ${detail.endDate}`],['상태',detail.status]].map(([k,v],i)=>(
            <div key={i} className={`bg-gray-50 p-3 rounded-lg ${i===3?'col-span-2':''}`}><div className="text-xs text-gray-400">{k}</div><div className="font-medium">{v}</div></div>
          ))}</div>
          {detail.content&&<div className="bg-gray-50 p-4 rounded-lg text-sm">{detail.content}</div>}
          <div className="flex space-x-2">
            <button onClick={()=>{setAnnouncements(p=>p.filter(x=>x.id!==detail.id));setDetail(null);toast('공지가 삭제되었습니다','info');}} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-100">삭제</button>
          </div>
        </div>}
      </Modal>
    </PageShell>
  );
};

const SystemMonitorPage = () => (
  <PageShell breadcrumb={['관리자 전용','시스템 모니터링']} title="연동 SW 및 시스템 모니터링">
    <div className="grid grid-cols-3 gap-4 mb-6">
      {[{l:'연동 SW',v:MOCK_LINKED_SW.length,u:'개',c:'border-blue-500 bg-blue-50',tc:'text-blue-700'},
        {l:'정상 가동',v:MOCK_LINKED_SW.filter(s=>s.status==='Running').length,u:'개',c:'border-green-500 bg-green-50',tc:'text-green-700'},
        {l:'주의 필요',v:MOCK_LINKED_SW.filter(s=>s.status==='Warning').length,u:'개',c:'border-orange-500 bg-orange-50',tc:'text-orange-700'}
      ].map((c,i)=>(
        <div key={i} className={`p-5 rounded-xl border-l-4 bg-white shadow-sm ${c.c}`}>
          <div className="text-xs text-gray-500 mb-1">{c.l}</div>
          <div className={`text-2xl font-bold ${c.tc}`}>{c.v}<span className="text-sm font-normal text-gray-400 ml-1">{c.u}</span></div>
        </div>
      ))}
    </div>
    <div className="space-y-3">{MOCK_LINKED_SW.map((sw,i)=>(
      <div key={i} className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sw.status==='Running'?'bg-green-50':'bg-orange-50'}`}>
              <Link2 size={20} className={sw.status==='Running'?'text-green-600':'text-orange-500'}/>
            </div>
            <div>
              <div className="flex items-center space-x-2"><h3 className="font-bold text-sm">{sw.name}</h3><StatusBadge status={sw.status}/></div>
              <div className="flex items-center space-x-3 text-xs text-gray-400 mt-0.5">
                <span>v{sw.version}</span>
                <span className="font-mono">{sw.endpoint}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <div className="text-center"><div className="font-bold text-gray-800">{sw.cpu}%</div><div className="text-xs text-gray-400">CPU</div></div>
            <div className="text-center"><div className="font-bold text-gray-800">{sw.memory}%</div><div className="text-xs text-gray-400">Memory</div></div>
            <div className="text-center"><div className="font-bold text-gray-800">{sw.uptime}</div><div className="text-xs text-gray-400">Uptime</div></div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2">
          <div><div className="flex justify-between text-xs mb-1"><span className="text-gray-500">CPU</span><span className="font-medium">{sw.cpu}%</span></div>
            <div className="w-full bg-gray-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${sw.cpu>40?'bg-orange-500':'bg-green-500'}`} style={{width:`${sw.cpu}%`}}/></div></div>
          <div><div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Memory</span><span className="font-medium">{sw.memory}%</span></div>
            <div className="w-full bg-gray-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${sw.memory>50?'bg-orange-500':'bg-green-500'}`} style={{width:`${sw.memory}%`}}/></div></div>
        </div>
      </div>
    ))}</div>
  </PageShell>
);

const AdminPage = () => (
  <PageShell breadcrumb={['관리자 전용','관리']} title="시스템 관리">
    <div className="grid grid-cols-3 gap-5">
      {[{icon:Users,title:'사용자 관리',desc:'계정, 권한, 역할 관리',count:`${MOCK_USERS.length}명`,color:'bg-blue-50 text-blue-600'},
        {icon:FolderTree,title:'지식영역 관리',desc:'RAG 지식 DB 및 접근 권한',count:`${MOCK_KNOWLEDGE_AREAS.length}개`,color:'bg-purple-50 text-purple-600'},
        {icon:TrendingUp,title:'이용 통계',desc:'질의 현황, 부서별 분석',count:'11,470건',color:'bg-green-50 text-green-600'},
        {icon:FileText,title:'접근 로그',desc:'감사 로그 및 이력 추적',count:'2,450건',color:'bg-orange-50 text-orange-600'},
        {icon:Star,title:'AI 품질 관리',desc:'전문가 검토, 골든 데이터',count:`${MOCK_QUALITY_REVIEWS.length}건`,color:'bg-red-50 text-red-600'},
        {icon:Megaphone,title:'공지사항',desc:'공지, 점검, 업데이트 안내',count:`${MOCK_ANNOUNCEMENTS.filter(a=>a.status==='Running').length}건 게시 중`,color:'bg-teal-50 text-teal-600'},
        {icon:Link2,title:'시스템 모니터링',desc:'연동 SW 상태 모니터링',count:`${MOCK_LINKED_SW.length}개 연동`,color:'bg-indigo-50 text-indigo-600'},
        {icon:Shield,title:'보안 설정',desc:'접근 제어, DRM, IP 제한',count:'활성',color:'bg-gray-50 text-gray-600'},
        {icon:Settings,title:'시스템 설정',desc:'전역 설정 및 구성 관리',count:'',color:'bg-gray-50 text-gray-600'}
      ].map((c,i)=>(
        <div key={i} className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}><c.icon size={20}/></div>
            <div><h3 className="font-bold text-sm">{c.title}</h3><p className="text-xs text-gray-500">{c.desc}</p></div>
          </div>
          {c.count&&<div className="text-right text-xs font-medium text-gray-400">{c.count}</div>}
        </div>
      ))}
    </div>
  </PageShell>
);

const UserPage = () => {
  const toast=useToast();
  const [profile,setProfile]=useState({name:'김영빈',dept:'AI활용 업무혁신 TF',role:'관리자',email:'kim@reb.or.kr',phone:'02-2100-0000'});
  const [showEdit,setShowEdit]=useState(false);const [editForm,setEditForm]=useState({...profile});
  const [docs]=useState([{name:'공시업무_규정_요약.pdf',size:'2.4MB',date:'2026-02-08'},{name:'현장조사_매뉴얼.docx',size:'5.1MB',date:'2026-02-05'},{name:'AI_활용_사례집.pptx',size:'12MB',date:'2026-01-28'}]);
  const [apiKey]=useState('genos-api-xxxx-xxxx-1a2b');const [showKey,setShowKey]=useState(false);
  return (
    <PageShell breadcrumb={['사용자 페이지']} title="내 정보 및 개인 지식영역">
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[{l:'총 질의 수',v:'1,247',c:'bg-blue-50 text-blue-700'},{l:'이번 달 사용량',v:'342',c:'bg-green-50 text-green-700'},{l:'업로드 문서',v:docs.length,c:'bg-purple-50 text-purple-700'},{l:'API 호출',v:'856',c:'bg-orange-50 text-orange-700'}].map((s,i)=>(
          <div key={i} className={`p-4 rounded-xl ${s.c}`}><div className="text-2xl font-bold">{s.v}</div><div className="text-xs mt-1 opacity-80">{s.l}</div></div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border">
          <div className="flex justify-between items-center mb-4"><h3 className="font-bold">내 프로필</h3><button onClick={()=>{setEditForm({...profile});setShowEdit(true);}} className="text-xs text-blue-600 hover:underline">수정</button></div>
          <div className="space-y-3 text-sm">{Object.entries({이름:profile.name,부서:profile.dept,역할:profile.role,이메일:profile.email,전화:profile.phone}).map(([k,v],i)=>(
            <div key={i} className="flex justify-between border-b pb-2"><span className="text-gray-500">{k}</span><span className="font-medium">{v}</span></div>
          ))}</div>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-bold mb-4">업로드 문서</h3>
            <div className="space-y-2 mb-4">{docs.map((d,i)=>(
              <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <div><div className="text-sm font-medium">{d.name}</div><div className="text-xs text-gray-400">{d.size} · {d.date}</div></div>
              </div>
            ))}</div>
            <button onClick={()=>toast('문서 업로드 (데모)')} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"><UploadCloud size={16} className="mr-1"/>문서 업로드</button>
          </div>
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-bold mb-3">API 키</h3>
            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
              <code className="text-sm flex-1 font-mono">{showKey?apiKey:'genos-api-xxxx-xxxx-****'}</code>
              <button onClick={()=>setShowKey(!showKey)} className="text-xs text-blue-600 hover:underline">{showKey?'숨기기':'보기'}</button>
              <button onClick={()=>{navigator.clipboard?.writeText(apiKey);toast('API 키가 복사되었습니다');}} className="text-xs text-gray-500 hover:underline">복사</button>
            </div>
            <button onClick={()=>toast('API 키가 재발급되었습니다','info')} className="mt-2 text-xs text-red-500 hover:underline">키 재발급</button>
          </div>
        </div>
      </div>
      <Modal isOpen={showEdit} onClose={()=>setShowEdit(false)} title="프로필 수정" size="md">
        <div className="space-y-4">
          {[['이름','name'],['부서','dept'],['이메일','email'],['전화','phone']].map(([label,key])=>(
            <div key={key}><label className="block text-sm font-medium mb-1">{label}</label><input value={editForm[key]} onChange={e=>setEditForm({...editForm,[key]:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          ))}
          <button onClick={()=>{setProfile(editForm);setShowEdit(false);toast('프로필이 수정되었습니다');}} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm">저장</button>
        </div>
      </Modal>
    </PageShell>
  );
};

// ==================== 신뢰성 관리 (환각 최소화) ====================
const TrustManagePage = () => {
  const toast = useToast();
  const [tab, setTab] = useState('rerank');

  /* ── Re-rank 상태 ── */
  const [pipelines, setPipelines] = useState(MOCK_RERANK_PIPELINES.map(p=>({...p})));
  const [editPipe, setEditPipe] = useState(null);

  /* ── RAG 상태 ── */
  const [ragGlobal, setRagGlobal] = useState({...MOCK_RAG_GLOBAL});
  const [ragAreas, setRagAreas] = useState(MOCK_RAG_AREAS.map(a=>({...a})));
  const [editArea, setEditArea] = useState(null);

  /* ── 출력 가드레일 상태 ── */
  const [outRules, setOutRules] = useState(()=>{
    try{const s=localStorage.getItem('genos_output_guardrails');return s?JSON.parse(s):MOCK_OUTPUT_GUARDRAILS.map(r=>({...r}));}
    catch{return MOCK_OUTPUT_GUARDRAILS.map(r=>({...r}));}
  });
  // 가드레일 변경 시 localStorage 동기화
  useEffect(()=>{localStorage.setItem('genos_output_guardrails',JSON.stringify(outRules));},[outRules]);
  const [ogCat, setOgCat] = useState('전체');
  const [editOgRule, setEditOgRule] = useState(null);
  const [showAddOg, setShowAddOg] = useState(false);
  const [ogForm, setOgForm] = useState({name:'',desc:'',category:'팩트체크',action:'경고 표시'});

  /* ── 신뢰도 스코어링 상태 ── */
  const [conf, setConf] = useState({...MOCK_CONFIDENCE_CONFIG,factors:MOCK_CONFIDENCE_CONFIG.factors.map(f=>({...f})),perModel:MOCK_CONFIDENCE_CONFIG.perModel.map(m=>({...m}))});

  const TABS=[
    {id:'rerank',label:'Re-rank 설정',icon:Filter},
    {id:'rag',label:'RAG 파이프라인',icon:Database},
    {id:'guardrail',label:'출력 가드레일',icon:Shield},
    {id:'confidence',label:'신뢰도 스코어링',icon:Gauge},
  ];

  const OG_CATS=['전체','인용','팩트체크','품질','보안'];
  const OG_ACTION_COLORS={'재생성 요청':'bg-orange-50 text-orange-700','경고 표시':'bg-yellow-50 text-yellow-700','신뢰도 감점':'bg-red-50 text-red-700','자동 요약':'bg-blue-50 text-blue-700','자동 제거':'bg-purple-50 text-purple-700','자동 마스킹':'bg-purple-50 text-purple-700','응답 중단':'bg-red-100 text-red-800'};

  const updateWeight = (key, val) => {
    setConf(prev=>{
      const others = prev.factors.filter(f=>f.key!==key);
      const remain = 100 - val;
      const total = others.reduce((a,f)=>a+f.weight,0);
      const newFactors = prev.factors.map(f=>{
        if(f.key===key) return {...f,weight:val};
        return {...f, weight: total===0 ? Math.round(remain/others.length) : Math.round((f.weight/total)*remain)};
      });
      return {...prev, factors:newFactors};
    });
  };

  const trendMax = Math.max(...conf.trend.map(t=>t.avg));
  const trendMin = Math.min(...conf.trend.map(t=>t.avg)) - 5;

  return (
    <PageShell breadcrumb={['관리자 전용','신뢰성 관리']} title="환각 최소화 · 신뢰성 관리">
      {/* Top-level metric cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          ['활성 Re-rank 파이프라인', pipelines.filter(p=>p.enabled).length+'개', 'text-blue-600', '평균 정확도 향상 +'+((pipelines.filter(p=>p.enabled).reduce((a,p)=>a+p.improvement,0)/Math.max(1,pipelines.filter(p=>p.enabled).length)).toFixed(1))+'%'],
          ['RAG 지식영역', ragAreas.length+'개', 'text-purple-600', '하이브리드 검색: '+(ragGlobal.hybridSearch?'활성':'비활성')],
          ['출력 가드레일', outRules.filter(r=>r.enabled).length+'/'+outRules.length+'개', 'text-orange-600', '금주 적용 '+outRules.reduce((a,r)=>a+r.hitCount,0)+'건'],
          ['평균 신뢰도', conf.trend[conf.trend.length-1].avg.toFixed(1)+'%', conf.trend[conf.trend.length-1].avg>=80?'text-green-600':'text-yellow-600', '자동응답 임계값 '+conf.autoAnswerThreshold+'%'],
        ].map(([label,val,cls,sub])=>(
          <div key={label} className="bg-white rounded-xl border p-4">
            <div className="text-xs text-gray-400 mb-1">{label}</div>
            <div className={`text-2xl font-extrabold ${cls}`}>{val}</div>
            <div className="text-xs text-gray-400 mt-1">{sub}</div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex border-b mb-5">
        {TABS.map(({id,label,icon:Icon})=>(
          <button key={id} onClick={()=>setTab(id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${tab===id?'border-blue-600 text-blue-700':'border-transparent text-gray-500 hover:text-gray-800'}`}>
            <Icon size={15}/>{label}
          </button>
        ))}
      </div>

      {/* ── Tab 1: Re-rank ── */}
      {tab==='rerank'&&(
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">에이전트별 Re-rank 파이프라인을 설정합니다. Re-ranking은 초기 벡터 검색 결과를 Cross-Encoder로 재정렬하여 답변 정확도를 향상시킵니다.</p>
          </div>
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">에이전트</th>
                  <th className="px-4 py-3 text-left">Re-rank 모델</th>
                  <th className="px-4 py-3 text-center">Top-K</th>
                  <th className="px-4 py-3 text-center">임계값</th>
                  <th className="px-4 py-3 text-center">정확도 향상</th>
                  <th className="px-4 py-3 text-center">활성</th>
                  <th className="px-4 py-3 text-center">설정</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pipelines.map(p=>(
                  <tr key={p.id} className={`hover:bg-gray-50 ${!p.enabled?'opacity-50':''}`}>
                    <td className="px-4 py-3 font-semibold text-gray-800">{p.agent}</td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-mono font-bold">{p.model}</span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold">{p.topK}</td>
                    <td className="px-4 py-3 text-center font-bold">{p.threshold}</td>
                    <td className="px-4 py-3 text-center">
                      {p.enabled
                        ? <span className="text-green-700 font-bold">+{p.improvement}%</span>
                        : <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <ToggleSwitch on={p.enabled} onClick={()=>{
                        setPipelines(prev=>prev.map(x=>x.id===p.id?{...x,enabled:!x.enabled}:x));
                        toast(`${p.agent} Re-rank ${p.enabled?'비활성화':'활성화'}됨`,p.enabled?'info':'success');
                      }}/>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={()=>setEditPipe({...p})} className="text-xs text-blue-600 hover:underline font-medium">편집</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Reranker model summary */}
          <div className="mt-5 grid grid-cols-3 gap-4">
            {['BGE-Reranker-v2','Cross-Encoder-KoE5','ColBERT-v2-Kor'].map(modelName=>{
              const count = pipelines.filter(p=>p.model===modelName&&p.enabled).length;
              const avgImp = pipelines.filter(p=>p.model===modelName&&p.enabled).reduce((a,p)=>a+p.improvement,0)/(count||1);
              return (
                <div key={modelName} className="bg-white rounded-xl border p-4">
                  <div className="font-mono font-bold text-sm text-slate-700 mb-2">{modelName}</div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>적용 파이프라인</span><span className="font-bold text-blue-700">{count}개</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span>평균 정확도 향상</span><span className="font-bold text-green-700">+{count?avgImp.toFixed(1):0}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Tab 2: RAG ── */}
      {tab==='rag'&&(
        <div className="space-y-6">
          {/* Global settings */}
          <div className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-gray-800">전역 RAG 파라미터</h3>
              <button onClick={()=>toast('RAG 파라미터가 저장되었습니다')} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"><Save size={12}/>저장</button>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-5">
              {[
                ['청크 크기 (Chunk Size)',ragGlobal.chunkSize,'chunkSize','tokens'],
                ['청크 오버랩',ragGlobal.chunkOverlap,'chunkOverlap','tokens'],
                ['초기 검색 Top-K',ragGlobal.topKRetrieve,'topKRetrieve','개'],
                ['Re-rank 후 Top-K',ragGlobal.topKAfterRerank,'topKAfterRerank','개'],
              ].map(([label,val,key,unit])=>(
                <div key={key} className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-2">{label}</div>
                  <div className="flex items-center gap-2">
                    <input type="number" value={val} onChange={e=>setRagGlobal(prev=>({...prev,[key]:+e.target.value}))}
                      className="w-20 border rounded px-2 py-1 text-sm font-bold text-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"/>
                    <span className="text-xs text-gray-400">{unit}</span>
                  </div>
                </div>
              ))}
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-2">유사도 임계값</div>
                <div className="flex items-center gap-3">
                  <input type="range" min="40" max="95" value={ragGlobal.similarityThreshold*100|0}
                    onChange={e=>setRagGlobal(p=>({...p,similarityThreshold:e.target.value/100}))} className="flex-1"/>
                  <span className="text-sm font-bold text-blue-700 w-12 text-right">{(ragGlobal.similarityThreshold*100).toFixed(0)}%</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-2">최소 인용 유사도</div>
                <div className="flex items-center gap-3">
                  <input type="range" min="50" max="95" value={ragGlobal.minCitationSimilarity}
                    onChange={e=>setRagGlobal(p=>({...p,minCitationSimilarity:+e.target.value}))} className="flex-1"/>
                  <span className="text-sm font-bold text-purple-700 w-12 text-right">{ragGlobal.minCitationSimilarity}%</span>
                </div>
              </div>
            </div>
            {/* Hybrid search */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold text-gray-700">하이브리드 검색 (BM25 + Semantic)</div>
                  <div className="text-xs text-gray-400">키워드 검색과 의미론적 검색을 결합하여 검색 재현율을 향상시킵니다.</div>
                </div>
                <ToggleSwitch on={ragGlobal.hybridSearch} onClick={()=>setRagGlobal(p=>({...p,hybridSearch:!p.hybridSearch}))}/>
              </div>
              {ragGlobal.hybridSearch&&(
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-2">검색 가중치 비율</div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-gray-600">BM25</span>
                      <span className="font-bold text-blue-700">{ragGlobal.bm25Weight}%</span>
                    </div>
                    <input type="range" min="10" max="90" value={ragGlobal.bm25Weight}
                      onChange={e=>setRagGlobal(p=>({...p,bm25Weight:+e.target.value,semanticWeight:100-e.target.value}))} className="flex-1"/>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-gray-600">Semantic</span>
                      <span className="font-bold text-purple-700">{ragGlobal.semanticWeight}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Per-area overrides */}
          <div>
            <h3 className="font-bold text-sm text-gray-800 mb-3">지식영역별 파라미터 오버라이드</h3>
            <div className="bg-white rounded-xl border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">지식영역</th>
                    <th className="px-4 py-3 text-center">Top-K</th>
                    <th className="px-4 py-3 text-center">유사도 임계값</th>
                    <th className="px-4 py-3 text-center">청크 크기</th>
                    <th className="px-4 py-3 text-center">오버라이드</th>
                    <th className="px-4 py-3 text-center">최종 수정</th>
                    <th className="px-4 py-3 text-center">편집</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {ragAreas.map(a=>(
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">{a.area}</td>
                      <td className="px-4 py-3 text-center font-mono">{a.topK}</td>
                      <td className="px-4 py-3 text-center font-mono">{a.threshold}</td>
                      <td className="px-4 py-3 text-center font-mono">{a.chunkSize}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded font-bold ${a.override?'bg-blue-100 text-blue-700':'bg-gray-100 text-gray-500'}`}>
                          {a.override?'개별 설정':'전역 적용'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-gray-400">{a.updated}</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={()=>setEditArea({...a})} className="text-xs text-blue-600 hover:underline font-medium">편집</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 3: 출력 가드레일 ── */}
      {tab==='guardrail'&&(
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500">입력 필터링과 달리, 출력 가드레일은 <strong>AI의 응답 결과를 검증</strong>하여 환각을 감지하고 신뢰도를 보장합니다.</div>
            <button onClick={()=>setShowAddOg(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 shrink-0 ml-4"><Plus size={14}/>규칙 추가</button>
          </div>
          {/* Category tabs */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {OG_CATS.map(c=>(
              <button key={c} onClick={()=>setOgCat(c)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${ogCat===c?'bg-blue-600 text-white border-blue-600':'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>{c}</button>
            ))}
            <span className="ml-auto text-xs text-gray-400">금주 총 적용 {outRules.filter(r=>r.enabled).reduce((a,r)=>a+r.hitCount,0)}건</span>
          </div>
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">규칙명</th>
                  <th className="px-4 py-3 text-left">설명</th>
                  <th className="px-4 py-3 text-left">분류</th>
                  <th className="px-4 py-3 text-left">적용 동작</th>
                  <th className="px-4 py-3 text-right">적용 수</th>
                  <th className="px-4 py-3 text-center">활성</th>
                  <th className="px-4 py-3 text-center">편집</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {outRules.filter(r=>ogCat==='전체'||r.category===ogCat).map(r=>(
                  <tr key={r.id} className={`hover:bg-gray-50 ${!r.enabled?'opacity-40':''}`}>
                    <td className="px-4 py-3 font-semibold">{r.name}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-xs">{r.desc}</td>
                    <td className="px-4 py-3"><span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded font-medium">{r.category}</span></td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded font-bold ${OG_ACTION_COLORS[r.action]||'bg-gray-100 text-gray-600'}`}>{r.action}</span></td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-orange-600">{r.hitCount}</td>
                    <td className="px-4 py-3 text-center">
                      <ToggleSwitch on={r.enabled} onClick={()=>{
                        setOutRules(prev=>prev.map(x=>x.id===r.id?{...x,enabled:!x.enabled}:x));
                        toast(`'${r.name}' ${r.enabled?'비활성화':'활성화'}됨`,r.enabled?'info':'success');
                      }}/>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={()=>setEditOgRule({...r})} className="text-xs text-blue-600 hover:underline font-medium">편집</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab 4: 신뢰도 스코어링 ── */}
      {tab==='confidence'&&(
        <div className="grid grid-cols-3 gap-5">
          {/* Left: thresholds + weights */}
          <div className="col-span-2 space-y-5">
            {/* Threshold sliders */}
            <div className="bg-white rounded-xl border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm">신뢰도 임계값 설정</h3>
                <button onClick={()=>toast('임계값이 저장되었습니다')} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"><Save size={11}/>저장</button>
              </div>
              <div className="space-y-5">
                {[
                  {key:'autoAnswerThreshold',label:'자동 응답 임계값',desc:'이 점수 이상이면 사람 검토 없이 자동 응답합니다.',color:'text-green-700',icon:'🟢'},
                  {key:'hitlThreshold',label:'HITL 요청 임계값',desc:'이 점수 미만이면 전문가 검토를 요청합니다.',color:'text-orange-600',icon:'🟠'},
                  {key:'hallucinationWarnThreshold',label:'환각 경고 임계값',desc:'이 점수 미만이면 사용자에게 환각 경고를 표시합니다.',color:'text-red-600',icon:'🔴'},
                ].map(({key,label,desc,color,icon})=>(
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-sm font-semibold text-gray-700">{icon} {label}</span>
                        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                      </div>
                      <span className={`text-xl font-extrabold ${color} w-16 text-right`}>{conf[key]}%</span>
                    </div>
                    <input type="range" min="30" max="99" value={conf[key]}
                      onChange={e=>setConf(p=>({...p,[key]:+e.target.value}))} className="w-full"/>
                  </div>
                ))}
              </div>
            </div>
            {/* Scoring weights */}
            <div className="bg-white rounded-xl border p-5">
              <h3 className="font-bold text-sm mb-4">신뢰도 점수 구성 요소</h3>
              <div className="space-y-4">
                {conf.factors.map(f=>(
                  <div key={f.key}>
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-sm font-semibold text-gray-700">{f.name}</span>
                        <span className="text-xs text-gray-400 ml-2">{f.desc}</span>
                      </div>
                      <span className="font-extrabold text-blue-700 w-12 text-right">{f.weight}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div className="h-3 bg-blue-500 rounded-full transition-all" style={{width:`${f.weight}%`}}/>
                      </div>
                      <input type="range" min="10" max="70" value={f.weight}
                        onChange={e=>updateWeight(f.key,+e.target.value)} className="w-28"/>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end text-xs text-gray-400">
                  합계: <span className={`ml-1 font-bold ${conf.factors.reduce((a,f)=>a+f.weight,0)===100?'text-green-600':'text-red-500'}`}>{conf.factors.reduce((a,f)=>a+f.weight,0)}%</span>
                </div>
              </div>
            </div>
            {/* Per-model baselines */}
            <div className="bg-white rounded-xl border p-5">
              <h3 className="font-bold text-sm mb-4">모델별 신뢰도 기준선</h3>
              <div className="space-y-3">
                {conf.perModel.map((m,i)=>(
                  <div key={m.model} className="flex items-center gap-4">
                    <div className="w-44 text-sm font-semibold text-gray-700 shrink-0">{m.model}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div className="h-3 rounded-full transition-all"
                        style={{width:`${m.avgScore}%`,background:m.avgScore>=80?'#22c55e':m.avgScore>=70?'#f59e0b':'#ef4444'}}/>
                    </div>
                    <div className="text-xs font-mono font-bold w-14 text-right">
                      <span className={m.avgScore>=80?'text-green-600':m.avgScore>=70?'text-yellow-600':'text-red-600'}>{m.avgScore}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 w-20">
                      <span>기준:</span>
                      <input type="number" min="50" max="100" value={m.baseline}
                        onChange={e=>setConf(p=>({...p,perModel:p.perModel.map((x,j)=>j===i?{...x,baseline:+e.target.value}:x)}))}
                        className="w-12 border rounded px-1 py-0.5 text-xs font-bold text-center"/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Right: trend chart */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl border p-5">
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><TrendingUp size={15} className="text-blue-500"/>최근 7일 신뢰도 추이</h3>
              <div className="flex items-end gap-2 h-32">
                {conf.trend.map((t,i)=>{
                  const pct=((t.avg-trendMin)/(trendMax-trendMin+1))*100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="text-[10px] font-bold text-blue-700">{t.avg}</div>
                      <div className="w-full rounded-t-sm transition-all"
                        style={{height:`${Math.max(10,pct)}%`,background:t.avg>=80?'#3b82f6':'#f59e0b'}}/>
                      <div className="text-[9px] text-gray-400 whitespace-nowrap">{t.date}</div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-50 rounded p-2 text-center">
                  <div className="text-green-600 font-bold">{Math.max(...conf.trend.map(t=>t.avg))}%</div>
                  <div className="text-gray-400">최고</div>
                </div>
                <div className="bg-orange-50 rounded p-2 text-center">
                  <div className="text-orange-600 font-bold">{Math.min(...conf.trend.map(t=>t.avg))}%</div>
                  <div className="text-gray-400">최저</div>
                </div>
              </div>
            </div>
            {/* Alert config */}
            <div className="bg-white rounded-xl border p-5">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Bell size={15} className="text-orange-500"/>알림 규칙</h3>
              <div className="space-y-3 text-sm">
                {[
                  ['연속 3회 이상 환각 경고','이메일 발송','text-red-600'],
                  ['평균 신뢰도 70% 미만','슬랙 알림','text-orange-600'],
                  ['HITL 대기 10건 초과','관리자 팝업','text-yellow-600'],
                ].map(([trigger,action,cls],i)=>(
                  <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-2.5">
                    <div>
                      <div className={`text-xs font-semibold ${cls}`}>{trigger}</div>
                      <div className="text-xs text-gray-400">→ {action}</div>
                    </div>
                    <ToggleSwitch on={true} onClick={()=>toast(`알림 규칙 설정 변경됨`)}/>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {/* Edit pipeline */}
      <Modal isOpen={!!editPipe} onClose={()=>setEditPipe(null)} title={`Re-rank 설정: ${editPipe?.agent}`} size="md">
        {editPipe&&<div className="space-y-4">
          <div><label className="block text-sm font-semibold mb-1">Re-rank 모델</label>
            <select value={editPipe.model} onChange={e=>setEditPipe({...editPipe,model:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm bg-white font-mono">
              {['BGE-Reranker-v2','Cross-Encoder-KoE5','ColBERT-v2-Kor'].map(m=><option key={m}>{m}</option>)}</select></div>
          <div><label className="block text-sm font-semibold mb-1">Top-K <span className="font-normal text-gray-400">(최종 반환 문서 수)</span></label>
            <input type="number" min="1" max="20" value={editPipe.topK} onChange={e=>setEditPipe({...editPipe,topK:+e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div><label className="block text-sm font-semibold mb-2">임계값 (Threshold): <span className="text-blue-700">{editPipe.threshold}</span></label>
            <input type="range" min="0.3" max="0.95" step="0.05" value={editPipe.threshold} onChange={e=>setEditPipe({...editPipe,threshold:+parseFloat(e.target.value).toFixed(2)})} className="w-full"/>
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0.3 (낮음)</span><span>0.95 (높음)</span></div></div>
          <button onClick={()=>{setPipelines(p=>p.map(x=>x.id===editPipe.id?{...editPipe}:x));setEditPipe(null);toast('Re-rank 설정이 저장되었습니다');}}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm">저장</button>
        </div>}
      </Modal>

      {/* Edit RAG area */}
      <Modal isOpen={!!editArea} onClose={()=>setEditArea(null)} title={`RAG 설정: ${editArea?.area}`} size="md">
        {editArea&&<div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[['Top-K','topK'],['청크 크기','chunkSize']].map(([label,key])=>(
              <div key={key}><label className="block text-sm font-semibold mb-1">{label}</label>
                <input type="number" value={editArea[key]} onChange={e=>setEditArea({...editArea,[key]:+e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
            ))}
          </div>
          <div><label className="block text-sm font-semibold mb-2">유사도 임계값: <span className="text-blue-700">{editArea.threshold}</span></label>
            <input type="range" min="0.4" max="0.95" step="0.05" value={editArea.threshold} onChange={e=>setEditArea({...editArea,threshold:+parseFloat(e.target.value).toFixed(2)})} className="w-full"/></div>
          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
            <div className="text-sm font-semibold text-gray-700">전역 설정 오버라이드</div>
            <ToggleSwitch on={editArea.override} onClick={()=>setEditArea(p=>({...p,override:!p.override}))}/>
          </div>
          <button onClick={()=>{setRagAreas(p=>p.map(x=>x.id===editArea.id?{...editArea,updated:new Date().toISOString().slice(0,10)}:x));setEditArea(null);toast(`${editArea.area} RAG 설정이 저장되었습니다`);}}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm">저장</button>
        </div>}
      </Modal>

      {/* Edit output guardrail */}
      <Modal isOpen={!!editOgRule} onClose={()=>setEditOgRule(null)} title="출력 가드레일 편집" size="md">
        {editOgRule&&<div className="space-y-4">
          <div><label className="block text-sm font-semibold mb-1">규칙명</label>
            <input value={editOgRule.name} onChange={e=>setEditOgRule({...editOgRule,name:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div><label className="block text-sm font-semibold mb-1">설명</label>
            <textarea value={editOgRule.desc} onChange={e=>setEditOgRule({...editOgRule,desc:e.target.value})} rows={2} className="w-full border rounded-lg px-3 py-2 text-sm resize-none"/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-semibold mb-1">분류</label>
              <select value={editOgRule.category} onChange={e=>setEditOgRule({...editOgRule,category:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm bg-white">
                {['인용','팩트체크','품질','보안'].map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label className="block text-sm font-semibold mb-1">적용 동작</label>
              <select value={editOgRule.action} onChange={e=>setEditOgRule({...editOgRule,action:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm bg-white">
                {['재생성 요청','경고 표시','신뢰도 감점','자동 요약','자동 제거','자동 마스킹','응답 중단'].map(a=><option key={a}>{a}</option>)}</select></div>
          </div>
          <button onClick={()=>{setOutRules(p=>p.map(x=>x.id===editOgRule.id?{...editOgRule}:x));setEditOgRule(null);toast('가드레일 규칙이 수정되었습니다');}}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm">저장</button>
        </div>}
      </Modal>

      {/* Add output guardrail */}
      <Modal isOpen={showAddOg} onClose={()=>setShowAddOg(false)} title="출력 가드레일 추가" size="md">
        <div className="space-y-4">
          <div><label className="block text-sm font-semibold mb-1">규칙명 <span className="text-red-500">*</span></label>
            <input value={ogForm.name} onChange={e=>setOgForm({...ogForm,name:e.target.value})} placeholder="예: 법률 조항 번호 검증" className="w-full border rounded-lg px-3 py-2 text-sm"/></div>
          <div><label className="block text-sm font-semibold mb-1">설명</label>
            <textarea value={ogForm.desc} onChange={e=>setOgForm({...ogForm,desc:e.target.value})} rows={2} className="w-full border rounded-lg px-3 py-2 text-sm resize-none"/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-semibold mb-1">분류</label>
              <select value={ogForm.category} onChange={e=>setOgForm({...ogForm,category:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm bg-white">
                {['인용','팩트체크','품질','보안'].map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label className="block text-sm font-semibold mb-1">적용 동작</label>
              <select value={ogForm.action} onChange={e=>setOgForm({...ogForm,action:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm bg-white">
                {['재생성 요청','경고 표시','신뢰도 감점','자동 요약','자동 제거','자동 마스킹','응답 중단'].map(a=><option key={a}>{a}</option>)}</select></div>
          </div>
          <button onClick={()=>{
            if(!ogForm.name)return;
            setOutRules(p=>[...p,{id:`og-${Date.now()}`,name:ogForm.name,desc:ogForm.desc,category:ogForm.category,action:ogForm.action,enabled:true,hitCount:0}]);
            setShowAddOg(false);setOgForm({name:'',desc:'',category:'팩트체크',action:'경고 표시'});
            toast('출력 가드레일 규칙이 추가되었습니다');
          }} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm">추가</button>
        </div>
      </Modal>
    </PageShell>
  );
};

// ==================== SIDEBAR ====================
const SidebarItem = ({item,activeId,onNav,level=0}) => {
  const isActive = activeId===item.id;
  const isParentActive = activeId?.startsWith(item.id+'.');
  const hasChildren = !!item.children;
  const [expanded,setExpanded]=useState(isActive||isParentActive);
  useEffect(()=>{if(isActive||isParentActive) setExpanded(true);},[activeId,item.id]);

  const pl = level===0?'pl-4':level===1?'pl-8':level===2?'pl-11':'pl-13';

  const handleClick = ()=>{
    if(hasChildren){setExpanded(!expanded);} else {onNav(item.id);}
  };

  return (<>
    <div onClick={handleClick} className={`flex items-center justify-between py-2 pr-3 mx-1.5 rounded-lg cursor-pointer text-sm transition-all duration-150 select-none ${pl}
      ${!hasChildren&&isActive
        ? 'bg-blue-50 text-blue-700 font-bold border-l-[3px] border-blue-600 shadow-sm'
        : hasChildren&&isParentActive
          ? 'text-gray-900 font-semibold hover:bg-blue-50/50'
          : 'text-gray-600 hover:bg-blue-50/40 hover:text-gray-900'}`}>
      <div className="flex items-center space-x-2.5 min-w-0">
        {level===0&&item.icon&&<item.icon size={17} className={!hasChildren&&isActive?'text-blue-600':isParentActive?'text-blue-500':'text-gray-400'}/>}
        {level>0&&<span className={`w-1.5 h-1.5 rounded-full shrink-0 ${!hasChildren&&isActive?'bg-blue-600':'bg-gray-300'}`}/>}
        <span className="truncate">{item.label}</span>
      </div>
      {hasChildren&&<ChevronDown size={13} className={`text-gray-400 shrink-0 transition-transform duration-200 ${expanded?'rotate-180':''}`}/>}
    </div>
    {hasChildren&&expanded&&<div className="mt-0.5 mb-1">{item.children.map(c=><SidebarItem key={c.id} item={c} activeId={activeId} onNav={onNav} level={level+1}/>)}</div>}
  </>);
};

// ==================== 서비스 통계 리포트 ====================
const InfoServiceStatsPage = () => {
  const [tab, setTab] = useState('overview');
  const { setToast } = useToast();
  const TABS = [{id:'overview',label:'📊 이용 현황'},{id:'keyword',label:'🔑 키워드 분석'},{id:'apistats',label:'🔌 API 통계'}];
  const maxKw = MOCK_SERVICE_STATS.keywords[0].cnt;
  const maxBar = Math.max(...MOCK_SERVICE_STATS.daily.map(d=>d.api));
  return (
    <PageShell breadcrumb={['운영·관리','서비스 통계 리포트']} title="서비스 통계 리포트" sub="이용자 · 대화 · API · 키워드 통합 분석">
      <div className="flex gap-0.5 mb-6 border-b border-gray-200 -mx-6 px-6">
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} className={`px-4 py-2.5 text-[13px] font-bold border-b-2 whitespace-nowrap transition-colors ${tab===t.id?'border-blue-600 text-blue-700 bg-blue-50/60':'border-transparent text-gray-500 hover:text-gray-700'}`}>{t.label}</button>)}
      </div>
      {tab==='overview' && (
        <div className="space-y-5">
          <div className="grid grid-cols-6 gap-4">
            {[{label:'전체 사용자',v:MOCK_SERVICE_STATS.summary.users.toLocaleString(),sub:`오늘 +${MOCK_SERVICE_STATS.summary.newToday}명`,c:'text-blue-600'},{label:'총 대화 건수',v:MOCK_SERVICE_STATS.summary.conversations.toLocaleString(),sub:'누적',c:'text-green-600'},{label:'API 호출',v:MOCK_SERVICE_STATS.summary.apiCalls.toLocaleString(),sub:'누적',c:'text-purple-600'},{label:'링크 연계',v:MOCK_SERVICE_STATS.summary.linkCalls.toLocaleString(),sub:'누적',c:'text-indigo-600'},{label:'만족도 응답',v:MOCK_SERVICE_STATS.summary.feedbacks,sub:'건',c:'text-yellow-600'},{label:'오늘 신규 가입',v:MOCK_SERVICE_STATS.summary.newToday,sub:'명',c:'text-teal-600'}].map(s=>(
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
                <div className={`text-2xl font-black ${s.c}`}>{s.v}</div>
                <div className="text-[11px] text-gray-500 mt-1">{s.label}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-black text-[14px] text-gray-700 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-500"/> 일별 이용 추이 (최근 7일)</h4>
              <button onClick={()=>setToast({message:'통계 데이터를 엑셀로 내보냅니다.'})} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-[12px] font-bold hover:bg-gray-50"><Download className="w-3.5 h-3.5"/> 엑셀 내보내기</button>
            </div>
            <div className="flex items-end gap-2" style={{height:'100px'}}>
              {MOCK_SERVICE_STATS.daily.map(d=>{
                const h = Math.max(8, Math.round((d.api/maxBar)*90));
                const uh = Math.max(4, Math.round((d.users/150)*60));
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-0.5">
                    <div className="w-full flex flex-col items-center" style={{height:'90px',justifyContent:'flex-end'}}>
                      <div className="w-3 rounded-t bg-blue-400 mb-0.5" style={{height:`${uh}px`}} title={`사용자 ${d.users}명`}/>
                      <div className="w-full rounded bg-purple-300" style={{height:`${h}px`}} title={`API ${d.api}건`}/>
                    </div>
                    <span className="text-[10px] text-gray-400">{d.date}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 mt-2 text-[11px]"><span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-400 inline-block"/> 사용자</span><span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-300 inline-block"/> API 호출</span></div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h4 className="font-black text-[14px] text-gray-700 mb-4 flex items-center gap-2"><PieChart className="w-4 h-4 text-indigo-500"/> 주제어별 질의 분포</h4>
            <div className="space-y-3">
              {MOCK_SERVICE_STATS.topics.map(t=>(
                <div key={t.topic} className="flex items-center gap-3">
                  <span className="text-[13px] font-bold text-gray-700 w-24 shrink-0">{t.topic}</span>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${t.c} transition-all`} style={{width:`${t.pct}%`}}/>
                  </div>
                  <span className="text-[13px] font-black text-gray-700 w-10 text-right">{t.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {tab==='keyword' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h4 className="font-black text-[14px] text-gray-700 mb-4 flex items-center gap-2"><Hash className="w-4 h-4 text-blue-500"/> 키워드 빈도 상위 12개</h4>
            <div className="space-y-2">
              {MOCK_SERVICE_STATS.keywords.map((k,i)=>(
                <div key={k.word} className="flex items-center gap-3">
                  <span className={`text-[12px] font-black w-5 text-right ${i<3?'text-blue-600':'text-gray-400'}`}>{i+1}</span>
                  <span className="text-[13px] font-bold text-gray-800 w-28 shrink-0">{k.word}</span>
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${i===0?'bg-blue-500':i===1?'bg-blue-400':i===2?'bg-blue-300':'bg-gray-300'}`} style={{width:`${Math.round((k.cnt/maxKw)*100)}%`}}/>
                  </div>
                  <span className="text-[12px] font-bold text-gray-600 w-16 text-right">{k.cnt.toLocaleString()}건</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h4 className="font-black text-[14px] text-gray-700 mb-3">키워드 클라우드</h4>
            <div className="flex flex-wrap gap-2">
              {MOCK_SERVICE_STATS.keywords.map((k,i)=>(
                <span key={k.word} className={`px-3 py-1.5 rounded-full font-bold cursor-default select-none ${i===0?'text-[18px] bg-blue-600 text-white':i<3?'text-[16px] bg-blue-100 text-blue-800':i<6?'text-[14px] bg-gray-100 text-gray-700':'text-[12px] bg-gray-50 text-gray-500'}`}>{k.word}</span>
              ))}
            </div>
          </div>
        </div>
      )}
      {tab==='apistats' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm overflow-hidden">
            <h4 className="font-black text-[14px] text-gray-700 mb-4">엔드포인트별 오늘 호출 현황</h4>
            <table className="w-full text-[13px]">
              <thead><tr className="border-b border-gray-100 bg-gray-50">{['엔드포인트','호출 건수','비율','막대'].map(h=><th key={h} className="text-left font-bold text-gray-500 py-2 px-3 text-[11px] uppercase">{h}</th>)}</tr></thead>
              <tbody>{MOCK_SERVICE_STATS.apiByEndpoint.map(a=>(
                <tr key={a.ep} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-gray-800">{a.ep}</td>
                  <td className="py-2.5 px-3 font-bold text-gray-700">{a.calls.toLocaleString()}</td>
                  <td className="py-2.5 px-3 font-bold text-blue-600">{a.pct}%</td>
                  <td className="py-2.5 px-3 w-48"><div className="h-2 bg-gray-100 rounded-full"><div className="h-full bg-blue-500 rounded-full" style={{width:`${a.pct}%`}}/></div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h4 className="font-black text-[14px] text-gray-700 mb-4">시간대별 API 호출 패턴 (오늘)</h4>
            <div className="flex items-end gap-1" style={{height:'80px'}}>
              {MOCK_SERVICE_STATS.peakHours.map((v,h)=>{
                const max=195; const ht=Math.max(2,Math.round((v/max)*72));
                return <div key={h} className="flex-1 flex flex-col items-center" title={`${h}시: ${v}건`}><div className="w-full rounded-t" style={{height:`${ht}px`,background:v>150?'#3b82f6':v>80?'#93c5fd':'#dbeafe'}}/></div>;
              })}
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>0시</span><span>6시</span><span>12시</span><span>18시</span><span>23시</span></div>
            <p className="text-[12px] text-gray-500 mt-2 font-medium">피크 시간: <strong className="text-blue-600">17:00~18:00 (195건)</strong></p>
          </div>
        </div>
      )}
    </PageShell>
  );
};

// ==================== 콘텐츠 관리 ====================
const ContentMgmtPage = () => {
  const [tab, setTab] = useState('notice');
  const [notices, setNotices] = useState(MOCK_NOTICES_MGMT.map(n=>({...n})));
  const [qnas, setQnas] = useState(MOCK_QNA_MGMT.map(q=>({...q})));
  const [selQ, setSelQ] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [newNotice, setNewNotice] = useState({title:'',type:'공지',content:''});
  const { setToast } = useToast();
  const TABS = [{id:'notice',label:'📢 공지사항'},{id:'qna',label:'❓ Q&A 게시판'},{id:'survey',label:'📋 설문조사'}];
  const tcls = {공지:'bg-blue-100 text-blue-700',업데이트:'bg-green-100 text-green-700',점검:'bg-orange-100 text-orange-700',매뉴얼:'bg-purple-100 text-purple-700'};
  const qcls = {답변완료:'bg-green-100 text-green-700',처리중:'bg-blue-100 text-blue-700',대기:'bg-yellow-100 text-yellow-700'};
  return (
    <PageShell breadcrumb={['운영·관리','콘텐츠 관리']} title="콘텐츠 관리" sub="공지사항 · Q&A · 설문조사 게시 및 관리">
      <div className="flex gap-0.5 mb-6 border-b border-gray-200 -mx-6 px-6">
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} className={`px-4 py-2.5 text-[13px] font-bold border-b-2 whitespace-nowrap transition-colors ${tab===t.id?'border-blue-600 text-blue-700 bg-blue-50/60':'border-transparent text-gray-500 hover:text-gray-700'}`}>{t.label}</button>)}
      </div>
      {tab==='notice' && (
        <div className="space-y-4">
          <div className="flex justify-end"><button onClick={()=>setShowNoticeForm(true)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-[13px] font-bold hover:bg-blue-700 shadow-sm"><Plus className="w-4 h-4"/> 공지 등록</button></div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-[13px]">
              <thead><tr className="border-b border-gray-100 bg-gray-50">{['유형','제목','작성자','등록일','조회수','고정','게시',''].map(h=><th key={h} className="text-left font-bold text-gray-500 py-2.5 px-4 text-[11px] uppercase">{h}</th>)}</tr></thead>
              <tbody>{notices.map(n=>(
                <tr key={n.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded text-[11px] font-bold ${tcls[n.type]||'bg-gray-100 text-gray-600'}`}>{n.type}</span></td>
                  <td className="py-3 px-4 font-bold text-gray-800">{n.pinned&&<span className="text-red-500 mr-1">📌</span>}{n.title}</td>
                  <td className="py-3 px-4 text-gray-600">{n.author}</td>
                  <td className="py-3 px-4 text-gray-500">{n.date}</td>
                  <td className="py-3 px-4 text-gray-600">{n.views}</td>
                  <td className="py-3 px-4"><button onClick={()=>{setNotices(ns=>ns.map(x=>x.id===n.id?{...x,pinned:!x.pinned}:x));setToast({message:`고정 ${n.pinned?'해제':'설정'} 완료`});}} className={`text-[11px] font-bold px-2 py-0.5 rounded ${n.pinned?'bg-red-100 text-red-600':'bg-gray-100 text-gray-500'}`}>{n.pinned?'고정중':'고정'}</button></td>
                  <td className="py-3 px-4"><ToggleSwitch on={n.active} onChange={v=>{setNotices(ns=>ns.map(x=>x.id===n.id?{...x,active:v}:x));}} size="sm"/></td>
                  <td className="py-3 px-4 flex gap-1"><button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600"><Edit3 className="w-3.5 h-3.5"/></button><button onClick={()=>{setNotices(ns=>ns.filter(x=>x.id!==n.id));setToast({message:'공지가 삭제되었습니다.'});}} className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5"/></button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          {showNoticeForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"><div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-7 mx-4">
              <div className="flex items-center justify-between mb-5"><h3 className="font-black text-[16px]">공지 등록</h3><button onClick={()=>setShowNoticeForm(false)}><X className="w-5 h-5 text-gray-400"/></button></div>
              <select value={newNotice.type} onChange={e=>setNewNotice(p=>({...p,type:e.target.value}))} className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-[13px] mb-3 focus:outline-none focus:border-blue-400">
                {['공지','업데이트','점검','매뉴얼'].map(t=><option key={t}>{t}</option>)}
              </select>
              <input value={newNotice.title} onChange={e=>setNewNotice(p=>({...p,title:e.target.value}))} placeholder="제목" className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-[13px] mb-3 focus:outline-none focus:border-blue-400"/>
              <textarea value={newNotice.content} onChange={e=>setNewNotice(p=>({...p,content:e.target.value}))} placeholder="내용" rows={4} className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-[13px] mb-4 resize-none focus:outline-none focus:border-blue-400"/>
              <div className="flex gap-3"><button onClick={()=>setShowNoticeForm(false)} className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-[13px]">취소</button><button onClick={()=>{if(!newNotice.title){setToast({message:'제목을 입력하세요.'});return;}setNotices(ns=>[{id:`N-${Date.now()}`,title:newNotice.title,type:newNotice.type,author:'김영빈',date:new Date().toISOString().slice(0,10),views:0,pinned:false,active:true},...ns]);setShowNoticeForm(false);setNewNotice({title:'',type:'공지',content:''});setToast({message:'공지가 등록되었습니다.'});}} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-black text-[13px] hover:bg-blue-700">등록</button></div>
            </div></div>
          )}
        </div>
      )}
      {tab==='qna' && (
        <div className="flex gap-5">
          <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <h4 className="font-black text-[14px] text-gray-700">Q&A 문의 목록</h4>
              <div className="flex gap-2 text-[12px]">
                {['전체','대기','처리중','답변완료'].map(s=><button key={s} className="px-3 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium">{s}</button>)}
              </div>
            </div>
            <table className="w-full text-[13px]">
              <thead><tr className="border-b border-gray-100 bg-gray-50">{['제목','질문자','부서','등록일','상태'].map(h=><th key={h} className="text-left font-bold text-gray-500 py-2.5 px-4 text-[11px] uppercase">{h}</th>)}</tr></thead>
              <tbody>{qnas.map(q=>(
                <tr key={q.id} onClick={()=>{setSelQ(q);setAnswerText(q.answer);}} className={`border-b border-gray-50 cursor-pointer ${selQ?.id===q.id?'bg-blue-50':'hover:bg-gray-50'}`}>
                  <td className="py-2.5 px-4 font-bold text-gray-800">{q.title}</td>
                  <td className="py-2.5 px-4 text-gray-600">{q.user}</td>
                  <td className="py-2.5 px-4 text-gray-500">{q.dept}</td>
                  <td className="py-2.5 px-4 text-gray-500">{q.date}</td>
                  <td className="py-2.5 px-4"><span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${qcls[q.status]}`}>{q.status}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div className="w-80 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 shrink-0">
            {selQ ? (
              <div>
                <h4 className="font-black text-[13px] text-gray-700 mb-3">답변 작성</h4>
                <div className="p-3 bg-gray-50 rounded-xl mb-3 text-[12px] text-gray-700"><strong className="block mb-1">{selQ.user} ({selQ.dept})</strong>{selQ.title}</div>
                <textarea value={answerText} onChange={e=>setAnswerText(e.target.value)} placeholder="답변을 입력하세요..." rows={6} className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-[13px] resize-none focus:outline-none focus:border-blue-400 mb-3"/>
                <button onClick={()=>{setQnas(qs=>qs.map(q=>q.id===selQ.id?{...q,answer:answerText,status:'답변완료'}:q));setToast({message:'답변이 등록되었습니다.'});setSelQ(null);}} className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-black text-[13px] hover:bg-blue-700">답변 등록</button>
              </div>
            ) : <div className="flex flex-col items-center justify-center h-48 text-gray-400"><MessageSquare className="w-10 h-10 mb-2 text-gray-200"/><p className="text-[13px] font-medium text-center">Q&A를 선택하면<br/>답변을 작성할 수 있습니다</p></div>}
          </div>
        </div>
      )}
      {tab==='survey' && (
        <div className="space-y-4">
          <div className="flex justify-end"><button onClick={()=>setToast({message:'설문 생성 기능은 준비 중입니다.'})} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[13px] font-bold hover:bg-indigo-700 shadow-sm"><Plus className="w-4 h-4"/> 설문 생성</button></div>
          <div className="space-y-4">
            {MOCK_SURVEYS_MGMT.map(sv=>(
              <div key={sv.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div><h4 className="font-black text-[15px] text-gray-800 mb-1">{sv.title}</h4><p className="text-[12px] text-gray-500">{sv.start} ~ {sv.end}</p></div>
                  <span className={`px-2.5 py-1 rounded-full text-[12px] font-bold ${sv.status==='진행중'?'bg-green-100 text-green-700':sv.status==='완료'?'bg-gray-100 text-gray-600':'bg-blue-100 text-blue-700'}`}>{sv.status}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full"><div className="h-full bg-indigo-500 rounded-full" style={{width:`${Math.round((sv.responses/sv.target)*100)}%`}}/></div>
                  <span className="text-[13px] font-bold text-gray-700">{sv.responses}/{sv.target}명</span>
                  <span className="text-[12px] text-indigo-600 font-bold">{Math.round((sv.responses/sv.target)*100)}%</span>
                </div>
                {sv.status==='완료' && <button onClick={()=>setToast({message:'설문 결과 상세 리포트를 표시합니다.'})} className="mt-3 px-3 py-1.5 border border-indigo-200 text-indigo-600 rounded-lg text-[12px] font-bold hover:bg-indigo-50">결과 보기</button>}
              </div>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
};

// ==================== 접근권한·차단 관리 ====================
const AccessSecurityPage = () => {
  const [tab, setTab] = useState('permission');
  const [blocks, setBlocks] = useState(MOCK_IP_BLOCKS.map(b=>({...b})));
  const [showAdd, setShowAdd] = useState(false);
  const [newBlock, setNewBlock] = useState({target:'',type:'IP',reason:'',action:'차단'});
  const { setToast } = useToast();
  const TABS = [{id:'permission',label:'🔐 사용자/그룹별 권한'},{id:'block',label:'🚫 ID·IP 차단·허용'}];
  return (
    <PageShell breadcrumb={['운영·관리','접근권한·차단']} title="접근권한 · 차단 관리" sub="지식영역별 사용자/그룹 권한 및 ID·IP 접근 제어">
      <div className="flex gap-0.5 mb-6 border-b border-gray-200 -mx-6 px-6">
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} className={`px-4 py-2.5 text-[13px] font-bold border-b-2 whitespace-nowrap transition-colors ${tab===t.id?'border-blue-600 text-blue-700 bg-blue-50/60':'border-transparent text-gray-500 hover:text-gray-700'}`}>{t.label}</button>)}
      </div>
      {tab==='permission' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm overflow-x-auto">
            <div className="flex items-center justify-between mb-4"><h4 className="font-black text-[14px] text-gray-700">지식영역별 부서 접근 권한 매트릭스</h4><button onClick={()=>setToast({message:'권한 변경 사항이 저장되었습니다.'})} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-[12px] font-bold hover:bg-blue-700">저장</button></div>
            <table className="w-full text-[12px]">
              <thead><tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left font-bold text-gray-500 py-2 px-3 text-[11px]">부서/그룹</th>
                {['공시업무규정','조사·평가 매뉴얼','인사규정','법률/계약','교육자료','민원대응'].map(ka=><th key={ka} className="text-center font-bold text-gray-500 py-2 px-2 text-[11px] whitespace-nowrap">{ka}</th>)}
              </tr></thead>
              <tbody>{[
                {dept:'부동산공시처',perm:[true,true,false,false,true,true]},
                {dept:'토지공시부',perm:[true,true,false,false,true,true]},
                {dept:'경영지원팀',perm:[false,false,true,false,true,false]},
                {dept:'법무팀',perm:[false,false,false,true,false,false]},
                {dept:'인재개발부',perm:[false,false,false,false,true,false]},
                {dept:'주택공시부',perm:[false,true,false,false,false,true]},
              ].map(r=>(
                <tr key={r.dept} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-bold text-gray-800">{r.dept}</td>
                  {r.perm.map((p,i)=>(
                    <td key={i} className="py-2.5 px-2 text-center">
                      <button onClick={()=>setToast({message:`권한이 ${p?'해제':'부여'}되었습니다.`})} className={`w-6 h-6 rounded-md border-2 flex items-center justify-center mx-auto transition-colors ${p?'bg-blue-600 border-blue-600 text-white':'border-gray-200 hover:border-blue-300'}`}>{p&&<Check className="w-3.5 h-3.5"/>}</button>
                    </td>
                  ))}
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div className="bg-amber-50 border-2 border-amber-100 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5"/>
            <p className="text-[13px] text-amber-800 font-medium">권한은 인사정보(HR) 연계를 통해 매일 01:00에 자동 업데이트됩니다. 이 화면에서 수동으로 변경한 권한은 다음 HR 동기화 시 재적용됩니다. <strong>개인 사용자 단위 예외 설정</strong>은 사용자 관리 페이지에서 별도 지정하세요.</p>
          </div>
        </div>
      )}
      {tab==='block' && (
        <div className="space-y-4">
          <div className="flex justify-end"><button onClick={()=>setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-xl text-[13px] font-bold hover:bg-red-700 shadow-sm"><Plus className="w-4 h-4"/> 차단·허용 추가</button></div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-[13px]">
              <thead><tr className="border-b border-gray-100 bg-gray-50">{['대상','유형','처리','사유','설정자','설정일','상태',''].map(h=><th key={h} className="text-left font-bold text-gray-500 py-2.5 px-4 text-[11px] uppercase">{h}</th>)}</tr></thead>
              <tbody>{blocks.map(b=>(
                <tr key={b.id} className={`border-b border-gray-50 hover:bg-gray-50 ${b.action==='차단'?'bg-red-50/30':''}`}>
                  <td className="py-3 px-4 font-mono font-bold text-gray-800">{b.target}</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[11px] font-bold">{b.type}</span></td>
                  <td className="py-3 px-4"><span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${b.action==='차단'?'bg-red-100 text-red-700':'bg-green-100 text-green-700'}`}>{b.action}</span></td>
                  <td className="py-3 px-4 text-gray-600 max-w-[200px] truncate" title={b.reason}>{b.reason}</td>
                  <td className="py-3 px-4 text-gray-500">{b.appliedBy}</td>
                  <td className="py-3 px-4 text-gray-500">{b.date}</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[11px] font-bold">{b.status}</span></td>
                  <td className="py-3 px-4"><button onClick={()=>{setBlocks(bs=>bs.filter(x=>x.id!==b.id));setToast({message:`${b.target} 규칙이 해제되었습니다.`});}} className="px-2.5 py-1 border border-gray-200 text-gray-600 rounded-lg text-[11px] font-bold hover:bg-gray-50">해제</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          {showAdd && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"><div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 mx-4">
              <div className="flex items-center justify-between mb-5"><h3 className="font-black text-[16px]">차단·허용 규칙 추가</h3><button onClick={()=>setShowAdd(false)}><X className="w-5 h-5 text-gray-400"/></button></div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <select value={newBlock.type} onChange={e=>setNewBlock(p=>({...p,type:e.target.value}))} className="border-2 border-gray-200 rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400">
                    {['IP','ID','대역'].map(t=><option key={t}>{t}</option>)}
                  </select>
                  <select value={newBlock.action} onChange={e=>setNewBlock(p=>({...p,action:e.target.value}))} className="border-2 border-gray-200 rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400">
                    {['차단','허용'].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <input value={newBlock.target} onChange={e=>setNewBlock(p=>({...p,target:e.target.value}))} placeholder="IP 주소 또는 사용자 ID" className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400"/>
                <input value={newBlock.reason} onChange={e=>setNewBlock(p=>({...p,reason:e.target.value}))} placeholder="사유" className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400"/>
              </div>
              <div className="flex gap-3 mt-5"><button onClick={()=>setShowAdd(false)} className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-[13px]">취소</button><button onClick={()=>{if(!newBlock.target||!newBlock.reason){setToast({message:'대상과 사유를 입력하세요.'});return;}setBlocks(bs=>[{id:`ib-${Date.now()}`,target:newBlock.target,type:newBlock.type,reason:newBlock.reason,action:newBlock.action,appliedBy:'김영빈',date:new Date().toISOString().slice(0,10),status:'활성'},...bs]);setShowAdd(false);setNewBlock({target:'',type:'IP',reason:'',action:'차단'});setToast({message:'규칙이 추가되었습니다.'});}} className={`flex-1 py-2.5 rounded-xl font-black text-[13px] text-white ${newBlock.action==='차단'?'bg-red-600 hover:bg-red-700':'bg-green-600 hover:bg-green-700'}`}>추가</button></div>
            </div></div>
          )}
        </div>
      )}
    </PageShell>
  );
};

// ==================== 통합 로그 관리 ====================
const WorkLogPage = () => {
  const [tab, setTab] = useState('access');
  const [q, setQ] = useState('');
  const { setToast } = useToast();
  const TABS = [{id:'access',label:'🔑 접속 로그'},{id:'work',label:'⚙️ 작업 로그'},{id:'query',label:'💬 질의 이력'},{id:'extract',label:'📥 추출·출력 로그'}];
  const LogTable = ({cols,rows}) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-0"><Search className="w-4 h-4 text-gray-400 shrink-0"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="사용자·IP·내용 검색..." className="flex-1 text-[13px] outline-none font-medium text-gray-700 placeholder:text-gray-400"/></div>
        <div className="flex gap-2 shrink-0">
          <input type="date" defaultValue="2026-02-01" className="border border-gray-200 rounded-lg px-2 py-1.5 text-[12px] focus:outline-none"/>
          <input type="date" defaultValue="2026-02-25" className="border border-gray-200 rounded-lg px-2 py-1.5 text-[12px] focus:outline-none"/>
          <button onClick={()=>setToast({message:'CSV로 내보냅니다.'})} className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-[12px] font-bold hover:bg-gray-50"><Download className="w-3.5 h-3.5"/> CSV</button>
        </div>
      </div>
      <div className="overflow-x-auto"><table className="w-full text-[12px]">
        <thead><tr className="border-b border-gray-100 bg-gray-50">{cols.map(c=><th key={c} className="text-left font-bold text-gray-500 py-2.5 px-3 text-[11px] uppercase whitespace-nowrap">{c}</th>)}</tr></thead>
        <tbody>{rows.map((r,i)=><tr key={i} className="border-b border-gray-50 hover:bg-gray-50">{r.map((c,j)=><td key={j} className={`py-2.5 px-3 ${j===0?'text-gray-400 whitespace-nowrap':j===1||j===2?'font-bold text-gray-800':'text-gray-600'}`}>{c}</td>)}</tr>)}</tbody>
      </table></div>
    </div>
  );
  const accessRows = MOCK_ACCESS_LOGS.map(l=>[l.time,l.user,l.dept,l.ip,<span className={`px-2 py-0.5 rounded text-[11px] font-bold ${(l.action.includes('로그인')||l.action.includes('성공'))?'bg-green-100 text-green-700':'bg-blue-100 text-blue-700'}`}>{l.action}</span>,l.detail]);
  const workRows = MOCK_WORK_LOG.map(l=>[l.time,l.user,l.dept,l.ip,<span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[11px] font-bold">{l.action}</span>,l.target,l.detail]);
  const extractRows = MOCK_EXTRACT_LOG.map(l=>[l.time,l.user,l.dept,l.type,l.file,l.size,l.rows?l.rows+'행':'–']);
  return (
    <PageShell breadcrumb={['운영·관리','통합 로그 관리']} title="통합 로그 관리" sub="접속 · 작업 · 질의 이력 · 추출/출력 로그 통합 조회">
      <div className="flex gap-0.5 mb-6 border-b border-gray-200 -mx-6 px-6">
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} className={`px-4 py-2.5 text-[13px] font-bold border-b-2 whitespace-nowrap transition-colors ${tab===t.id?'border-blue-600 text-blue-700 bg-blue-50/60':'border-transparent text-gray-500 hover:text-gray-700'}`}>{t.label}</button>)}
      </div>
      {tab==='access' && <LogTable cols={['일시','사용자','부서','IP','행위','상세']} rows={accessRows}/>}
      {tab==='work' && <LogTable cols={['일시','사용자','부서','IP','행위 유형','대상','상세']} rows={workRows}/>}
      {tab==='query' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-1"><Search className="w-4 h-4 text-gray-400"/><input placeholder="질의 내용·사용자 검색..." className="flex-1 text-[13px] outline-none"/></div>
            <div className="flex gap-2">
              {['전체','GENERAL','REVIEW','TRANSLATE','REPORT','AGENT'].map(m=><button key={m} className="px-2.5 py-1 border border-gray-200 text-gray-600 rounded-lg text-[11px] font-bold hover:bg-gray-50">{m}</button>)}
              <button onClick={()=>setToast({message:'질의이력을 CSV로 내보냅니다.'})} className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-[12px] font-bold hover:bg-gray-50"><Download className="w-3.5 h-3.5"/> CSV</button>
            </div>
          </div>
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-gray-100 bg-gray-50">{['일시','사용자','부서','모드','질문 요약','토큰','별점','오류신고'].map(h=><th key={h} className="text-left font-bold text-gray-500 py-2.5 px-3 text-[11px] uppercase whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>{MOCK_USAGE_HISTORY.map(r=>(
              <tr key={r.id} className={`border-b border-gray-50 hover:bg-gray-50 ${r.errReport?'bg-red-50/30':''}`}>
                <td className="py-2.5 px-3 text-gray-400 whitespace-nowrap">{r.time}</td>
                <td className="py-2.5 px-3 font-bold text-gray-800">{r.user}</td>
                <td className="py-2.5 px-3 text-gray-600">{r.dept}</td>
                <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">{r.mode}</span></td>
                <td className="py-2.5 px-3 text-gray-700 max-w-[200px] truncate" title={r.query}>{r.query}</td>
                <td className="py-2.5 px-3 font-mono text-gray-600">{r.tokens}</td>
                <td className="py-2.5 px-3 text-yellow-500">{'★'.repeat(r.rating)}</td>
                <td className="py-2.5 px-3">{r.errReport&&<span className="text-red-500 text-[11px] font-bold">⚠ 신고</span>}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {tab==='extract' && <LogTable cols={['일시','사용자','부서','추출 유형','파일명','크기','레코드 수']} rows={extractRows}/>}
    </PageShell>
  );
};

// ==================== 사용량 모니터링 ====================
const UsageMonitorPage = () => {
  const [tab, setTab] = useState('dept');
  const { setToast } = useToast();
  const TABS = [{id:'dept',label:'🏢 부서별 현황'},{id:'pattern',label:'📈 API 패턴 분석'},{id:'abuse',label:'🚨 오남용 탐지'}];
  const maxQ = Math.max(...MOCK_USAGE_BY_DEPT.map(d=>d.queries));
  const sevCls = {위험:'bg-red-100 text-red-700 border-red-200',주의:'bg-yellow-100 text-yellow-700 border-yellow-200',정보:'bg-gray-100 text-gray-600 border-gray-200'};
  return (
    <PageShell breadcrumb={['운영·관리','사용량 모니터링']} title="사용량 모니터링" sub="부서별 현황 · API 패턴 · 오남용 탐지">
      <div className="flex gap-0.5 mb-6 border-b border-gray-200 -mx-6 px-6">
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} className={`px-4 py-2.5 text-[13px] font-bold border-b-2 whitespace-nowrap transition-colors ${tab===t.id?'border-blue-600 text-blue-700 bg-blue-50/60':'border-transparent text-gray-500 hover:text-gray-700'}`}>{t.label}</button>)}
      </div>
      {tab==='dept' && (
        <div className="space-y-5">
          <div className="grid grid-cols-4 gap-4">
            {[{label:'전체 질의 수',v:'13,900',c:'text-blue-600'},{label:'평균 대화 길이',v:'208자',c:'text-green-600'},{label:'총 토큰 사용',v:'2.9M',c:'text-purple-600'},{label:'오남용 의심',v:'3건',c:'text-red-600'}].map(s=>(
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm"><div className={`text-2xl font-black ${s.c}`}>{s.v}</div><div className="text-[11px] text-gray-500 mt-1">{s.label}</div></div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <h4 className="font-black text-[14px] text-gray-700">부서별 사용 현황</h4>
              <button onClick={()=>setToast({message:'부서별 사용 현황을 엑셀로 내보냅니다.'})} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-[12px] font-bold hover:bg-gray-50"><Download className="w-3.5 h-3.5"/> 엑셀</button>
            </div>
            <table className="w-full text-[12px]">
              <thead><tr className="border-b border-gray-100 bg-gray-50">{['부서','사용자수','질의 건수','질의 추이','평균 대화길이','토큰 사용','피크 시간'].map(h=><th key={h} className="text-left font-bold text-gray-500 py-2.5 px-4 text-[11px] uppercase whitespace-nowrap">{h}</th>)}</tr></thead>
              <tbody>{MOCK_USAGE_BY_DEPT.map(d=>(
                <tr key={d.dept} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4 font-bold text-gray-800">{d.dept}</td>
                  <td className="py-3 px-4 text-gray-600">{d.users}명</td>
                  <td className="py-3 px-4 font-bold text-gray-800">{d.queries.toLocaleString()}</td>
                  <td className="py-3 px-4 w-32"><div className="h-2 bg-gray-100 rounded-full"><div className="h-full bg-blue-500 rounded-full" style={{width:`${Math.round((d.queries/maxQ)*100)}%`}}/></div></td>
                  <td className="py-3 px-4 text-gray-600">{d.avgLen}자</td>
                  <td className="py-3 px-4 font-mono text-gray-700">{(d.tokens/1000).toFixed(0)}K</td>
                  <td className="py-3 px-4 text-gray-600">{d.peakHour}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
      {tab==='pattern' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h4 className="font-black text-[14px] text-gray-700 mb-4">시간대별 API 호출 패턴 (주간 평균)</h4>
            <div className="flex items-end gap-1" style={{height:'80px'}}>
              {MOCK_SERVICE_STATS.peakHours.map((v,h)=>{
                const max=195; const ht=Math.max(2,Math.round((v/max)*72));
                return <div key={h} className="flex-1 flex flex-col items-center" title={`${h}시: ${v}건`}><div className="w-full rounded-t" style={{height:`${ht}px`,background:v>150?'#3b82f6':v>80?'#93c5fd':'#dbeafe'}}/></div>;
              })}
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>0시</span><span>6시</span><span>12시</span><span>18시</span><span>23시</span></div>
            <p className="text-[12px] text-gray-500 mt-2">피크 시간대 <strong className="text-blue-600">15:00~18:00</strong> — 서버 사전 스케일업 권장</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h4 className="font-black text-[14px] text-gray-700 mb-4">모드별 사용 패턴</h4>
            <div className="space-y-3">
              {[{mode:'GENERAL',pct:48,c:'bg-blue-500'},{mode:'REVIEW',pct:22,c:'bg-purple-500'},{mode:'TRANSLATE',pct:14,c:'bg-violet-500'},{mode:'REPORT',pct:10,c:'bg-green-500'},{mode:'AGENT',pct:4,c:'bg-indigo-500'},{mode:'SECURE',pct:2,c:'bg-slate-700'}].map(m=>(
                <div key={m.mode} className="flex items-center gap-3">
                  <span className="text-[12px] font-black text-gray-600 w-20">{m.mode}</span>
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${m.c}`} style={{width:`${m.pct}%`}}/></div>
                  <span className="text-[13px] font-black text-gray-700 w-8 text-right">{m.pct}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-4 flex items-start gap-3">
            <Activity className="w-5 h-5 text-blue-500 shrink-0 mt-0.5"/>
            <div className="text-[13px] text-blue-800 font-medium"><strong>할당량 관리 권장:</strong> AI활용 추진반(3,240건/월)과 토지공시부(2,880건/월)이 전체 사용량의 45%를 차지합니다. 부서별 할당량 설정을 통해 리소스를 균형 있게 배분하세요.</div>
          </div>
        </div>
      )}
      {tab==='abuse' && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            {[{label:'오늘 탐지',v:MOCK_ABUSE_ALERTS.length,c:'text-red-600',bg:'bg-red-50'},{label:'자동 차단',v:1,c:'text-orange-600',bg:'bg-orange-50'},{label:'모니터링 중',v:2,c:'text-yellow-600',bg:'bg-yellow-50'}].map(s=>(
              <div key={s.label} className={`${s.bg} rounded-2xl border border-gray-100 p-4 text-center shadow-sm`}><div className={`text-2xl font-black ${s.c}`}>{s.v}</div><div className="text-[11px] text-gray-500 mt-1">{s.label}</div></div>
            ))}
          </div>
          <div className="space-y-4">
            {MOCK_ABUSE_ALERTS.map(a=>(
              <div key={a.id} className={`bg-white rounded-2xl border-2 p-5 shadow-sm ${a.severity==='위험'?'border-red-200':a.severity==='주의'?'border-yellow-200':'border-gray-100'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-black border ${sevCls[a.severity]}`}>{a.severity}</span>
                      <span className="font-black text-[14px] text-gray-800">{a.type}</span>
                      <span className="text-[13px] text-gray-600">({a.user} · {a.ip})</span>
                    </div>
                    <p className="text-[13px] text-gray-700 mb-2">{a.detail}</p>
                    <p className="text-[11px] text-gray-400">탐지: {a.detected}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${a.status==='차단됨'?'bg-red-100 text-red-700':a.status==='경고발송'?'bg-yellow-100 text-yellow-700':'bg-blue-100 text-blue-700'}`}>{a.status}</span>
                    {a.status!=='차단됨'&&<button onClick={()=>setToast({message:`${a.user} IP를 차단했습니다.`})} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-[11px] font-bold hover:bg-red-700">즉시 차단</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h4 className="font-black text-[14px] text-gray-700 mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-blue-500"/> 오남용 방지 임계값 설정</h4>
            <div className="grid grid-cols-3 gap-4">
              {[{label:'분당 API 호출 한도',val:'50',unit:'회/분'},{label:'일일 토큰 사용 한도',val:'100,000',unit:'토큰/일'},{label:'대량 추출 감지 기준',val:'5',unit:'건/시간'}].map(s=>(
                <div key={s.label}><label className="text-[12px] font-bold text-gray-600 block mb-1.5">{s.label}</label><div className="flex items-center gap-2"><input defaultValue={s.val} className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-1.5 text-[13px] font-mono focus:outline-none focus:border-blue-400"/><span className="text-[11px] text-gray-400 whitespace-nowrap">{s.unit}</span></div></div>
              ))}
            </div>
            <button onClick={()=>setToast({message:'오남용 방지 설정이 저장되었습니다.'})} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-[12px] font-bold hover:bg-blue-700">저장</button>
          </div>
        </div>
      )}
    </PageShell>
  );
};

// ==================== API · 프롬프트 관리 ====================
const ApiPromptPage = () => {
  const [tab, setTab] = useState('api');
  const [apis, setApis] = useState(MOCK_APIS.map(a=>({...a})));
  const [approvals, setApprovals] = useState(MOCK_API_APPROVALS.map(a=>({...a})));
  const [prompts, setPrompts] = useState(MOCK_PROMPTS_MGMT.map(p=>({...p})));
  const [selPrompt, setSelPrompt] = useState(null);
  const [editContent, setEditContent] = useState('');
  const { setToast } = useToast();
  const TABS = [{id:'api',label:'🔌 API 관리'},{id:'approval',label:'✅ 사용 승인'},{id:'prompt',label:'✏️ 프롬프트 관리'}];
  return (
    <PageShell breadcrumb={['운영·관리','API·프롬프트 관리']} title="API · 프롬프트 관리" sub="API 생성/승인/통계 및 프롬프트 설계·테스트">
      <div className="flex gap-0.5 mb-6 border-b border-gray-200 -mx-6 px-6">
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} className={`px-4 py-2.5 text-[13px] font-bold border-b-2 whitespace-nowrap transition-colors ${tab===t.id?'border-blue-600 text-blue-700 bg-blue-50/60':'border-transparent text-gray-500 hover:text-gray-700'}`}>{t.label}</button>)}
      </div>
      {tab==='api' && (
        <div className="space-y-4">
          <div className="flex justify-end"><button onClick={()=>setToast({message:'API 등록 다이얼로그가 열립니다.'})} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-[13px] font-bold hover:bg-blue-700 shadow-sm"><Plus className="w-4 h-4"/> API 등록</button></div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-[13px]">
              <thead><tr className="border-b border-gray-100 bg-gray-50">{['API명','엔드포인트','버전','인증 방식','상태','오늘 호출','승인일','활성화',''].map(h=><th key={h} className="text-left font-bold text-gray-500 py-2.5 px-4 text-[11px] uppercase whitespace-nowrap">{h}</th>)}</tr></thead>
              <tbody>{apis.map(a=>(
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4 font-bold text-gray-800">{a.name}</td>
                  <td className="py-3 px-4 font-mono text-gray-600 text-[12px]">{a.endpoint}</td>
                  <td className="py-3 px-4"><span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[11px] font-bold">{a.version}</span></td>
                  <td className="py-3 px-4 text-gray-600 text-[12px]">{a.auth}</td>
                  <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${a.status==='활성'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>{a.status}</span></td>
                  <td className="py-3 px-4 font-bold text-gray-700">{a.callsToday.toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-500">{a.approvedDate}</td>
                  <td className="py-3 px-4"><ToggleSwitch on={a.status==='활성'} onChange={v=>setApis(as=>as.map(x=>x.id===a.id?{...x,status:v?'활성':'비활성'}:x))} size="sm"/></td>
                  <td className="py-3 px-4"><button onClick={()=>setToast({message:`${a.name} API 키를 재발급합니다.`})} className="px-2.5 py-1 border border-gray-200 text-gray-600 rounded-lg text-[11px] font-bold hover:bg-gray-50">키 재발급</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
      {tab==='approval' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[{label:'승인 대기',v:approvals.filter(a=>a.status==='대기').length,c:'text-yellow-600',bg:'bg-yellow-50'},{label:'승인 완료',v:approvals.filter(a=>a.status==='승인').length,c:'text-green-600',bg:'bg-green-50'},{label:'거부',v:0,c:'text-red-600',bg:'bg-red-50'}].map(s=>(
              <div key={s.label} className={`${s.bg} rounded-2xl border border-gray-100 p-4 text-center shadow-sm`}><div className={`text-2xl font-black ${s.c}`}>{s.v}</div><div className="text-[11px] text-gray-500 mt-1">{s.label}</div></div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-[13px]">
              <thead><tr className="border-b border-gray-100 bg-gray-50">{['신청자','부서','신청 API','사용 목적','신청일','상태',''].map(h=><th key={h} className="text-left font-bold text-gray-500 py-2.5 px-4 text-[11px] uppercase">{h}</th>)}</tr></thead>
              <tbody>{approvals.map(a=>(
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4 font-bold text-gray-800">{a.requester}</td>
                  <td className="py-3 px-4 text-gray-600">{a.dept}</td>
                  <td className="py-3 px-4 text-gray-700 font-medium">{a.api}</td>
                  <td className="py-3 px-4 text-gray-600 max-w-[200px] truncate">{a.purpose}</td>
                  <td className="py-3 px-4 text-gray-500">{a.requestDate}</td>
                  <td className="py-3 px-4"><span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${a.status==='대기'?'bg-yellow-100 text-yellow-700':'bg-green-100 text-green-700'}`}>{a.status}</span></td>
                  <td className="py-3 px-4">{a.status==='대기'&&<div className="flex gap-2"><button onClick={()=>{setApprovals(as=>as.map(x=>x.id===a.id?{...x,status:'승인'}:x));setToast({message:`${a.requester} API 사용이 승인되었습니다.`});}} className="px-2.5 py-1 bg-green-600 text-white rounded-lg text-[11px] font-bold hover:bg-green-700">승인</button><button onClick={()=>{setApprovals(as=>as.filter(x=>x.id!==a.id));setToast({message:'거부되었습니다.'});}} className="px-2.5 py-1 bg-red-500 text-white rounded-lg text-[11px] font-bold hover:bg-red-600">거부</button></div>}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
      {tab==='prompt' && (
        <div className="flex gap-5">
          <div className="flex-1 space-y-4">
            {prompts.map(p=>(
              <div key={p.id} onClick={()=>{setSelPrompt(p);setEditContent(`[${p.mode} 시스템 프롬프트 v${p.version}]\n\n당신은 한국부동산원의 AI 어시스턴트입니다.\n${p.desc}\n\n답변 시 반드시 출처 문서를 인용하고, 모르는 내용은 "관련 정보가 없습니다"라고 명확히 밝히세요.`);}} className={`bg-white rounded-2xl border-2 p-5 shadow-sm cursor-pointer transition-colors ${selPrompt?.id===p.id?'border-blue-500':'border-gray-100 hover:border-blue-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2"><span className="font-black text-[14px] text-gray-800">{p.name}</span><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[11px] font-bold">{p.mode}</span><span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[11px] font-bold">{p.version}</span></div>
                  <div className="flex items-center gap-2"><span className="text-[11px] text-gray-400">{p.tokens} tokens</span><ToggleSwitch on={p.active} onChange={v=>setPrompts(ps=>ps.map(x=>x.id===p.id?{...x,active:v}:x))} size="sm"/></div>
                </div>
                <p className="text-[12px] text-gray-600">{p.desc}</p>
                <p className="text-[11px] text-gray-400 mt-1">최종 수정: {p.lastUpdated}</p>
              </div>
            ))}
          </div>
          <div className="w-96 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 shrink-0">
            <h4 className="font-black text-[13px] text-gray-700 mb-3 flex items-center gap-2"><Edit3 className="w-4 h-4 text-blue-500"/> 프롬프트 편집 · 테스트</h4>
            {selPrompt ? (
              <div className="space-y-3">
                <textarea value={editContent} onChange={e=>setEditContent(e.target.value)} rows={10} className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-[12px] font-mono resize-none focus:outline-none focus:border-blue-400"/>
                <div className="flex gap-2">
                  <button onClick={()=>setToast({message:'프롬프트가 저장되었습니다.'})} className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-[12px] font-bold hover:bg-blue-700">저장</button>
                  <button onClick={()=>setToast({message:'테스트 대화창이 열립니다.'})} className="flex-1 py-2 rounded-xl border-2 border-blue-200 text-blue-700 text-[12px] font-bold hover:bg-blue-50">테스트</button>
                </div>
              </div>
            ) : <div className="flex flex-col items-center justify-center h-48 text-gray-400"><Edit3 className="w-10 h-10 mb-2 text-gray-200"/><p className="text-[13px] font-medium text-center">프롬프트를 선택하면<br/>편집창이 열립니다</p></div>}
          </div>
        </div>
      )}
    </PageShell>
  );
};

// ==================== HR 연계 · 사용자/그룹 확장 ====================
const HrSyncPage = () => {
  const [tab, setTab] = useState('hrsync');
  const { setToast } = useToast();
  const TABS = [{id:'hrsync',label:'🔄 인사정보 연계'},{id:'group',label:'👥 그룹 관리'}];
  const typeCls = {신규입사:'bg-green-100 text-green-700',퇴직:'bg-red-100 text-red-700',부서이동:'bg-blue-100 text-blue-700',겸직:'bg-purple-100 text-purple-700',부재설정:'bg-yellow-100 text-yellow-700'};
  return (
    <PageShell breadcrumb={['운영·관리','HR 연계·그룹 관리']} title="인사정보 연계 · 그룹 관리" sub="HR DB 자동 동기화 및 사용자 그룹 관리">
      <div className="flex gap-0.5 mb-6 border-b border-gray-200 -mx-6 px-6">
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} className={`px-4 py-2.5 text-[13px] font-bold border-b-2 whitespace-nowrap transition-colors ${tab===t.id?'border-blue-600 text-blue-700 bg-blue-50/60':'border-transparent text-gray-500 hover:text-gray-700'}`}>{t.label}</button>)}
      </div>
      {tab==='hrsync' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border-2 border-green-100 p-5 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1"><div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]"/><span className="font-black text-[15px] text-gray-800">인사정보 DB 연계 상태: <span className="text-green-600">{MOCK_HR_SYNC.status}</span></span></div>
                <div className="text-[12px] text-gray-500">마지막 동기화: {MOCK_HR_SYNC.lastSync} · 다음 예정: {MOCK_HR_SYNC.nextSync}</div>
              </div>
              <button onClick={()=>setToast({message:'수동 동기화가 시작되었습니다. 완료 시 알림이 발송됩니다.'})} className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-xl text-[13px] font-bold hover:bg-green-700 shadow-sm"><RotateCcw className="w-4 h-4"/> 수동 동기화</button>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4">
            {[{label:'전체 사용자',v:MOCK_HR_SYNC.summary.total},{label:'신규 입사',v:MOCK_HR_SYNC.summary.new},{label:'퇴직',v:MOCK_HR_SYNC.summary.retired},{label:'부서이동',v:MOCK_HR_SYNC.summary.moved},{label:'겸직',v:MOCK_HR_SYNC.summary.concurrent},{label:'부재',v:MOCK_HR_SYNC.summary.leave}].map(s=>(
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-3 text-center shadow-sm"><div className="text-xl font-black text-gray-800">{s.v}</div><div className="text-[11px] text-gray-500 mt-0.5">{s.label}</div></div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100"><h4 className="font-black text-[14px] text-gray-700">최근 동기화 내역</h4></div>
            <table className="w-full text-[13px]">
              <thead><tr className="border-b border-gray-100 bg-gray-50">{['이름','변경 유형','소속 부서','동기화 일시','처리 내용'].map(h=><th key={h} className="text-left font-bold text-gray-500 py-2.5 px-4 text-[11px] uppercase whitespace-nowrap">{h}</th>)}</tr></thead>
              <tbody>{MOCK_HR_SYNC.recent.map(r=>(
                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4 font-bold text-gray-800">{r.name}</td>
                  <td className="py-3 px-4"><span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${typeCls[r.type]}`}>{r.type}</span></td>
                  <td className="py-3 px-4 text-gray-600">{r.dept}</td>
                  <td className="py-3 px-4 text-gray-500">{r.syncDate}</td>
                  <td className="py-3 px-4 text-gray-700">{r.action}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5"/>
            <p className="text-[13px] text-blue-800 font-medium">인사정보 DB와 매일 01:00 자동 동기화됩니다. <strong>신규 입사</strong>: 계정 자동 생성 + 기본 권한 부여 / <strong>퇴직</strong>: 계정 즉시 비활성화 + 접속 차단 / <strong>부서이동</strong>: 소속 그룹 자동 변경 / <strong>겸직</strong>: 복수 그룹 추가 / <strong>부재</strong>: 임시 계정 잠금</p>
          </div>
        </div>
      )}
      {tab==='group' && (
        <div className="space-y-4">
          <div className="flex justify-end"><button onClick={()=>setToast({message:'그룹 생성 다이얼로그가 열립니다.'})} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[13px] font-bold hover:bg-indigo-700 shadow-sm"><Plus className="w-4 h-4"/> 그룹 생성</button></div>
          <div className="grid grid-cols-2 gap-4">
            {[{name:'공시가격본부',type:'부서 그룹',members:27,areas:['공시업무규정','민원대응','조사·평가 매뉴얼'],perms:'읽기+쓰기'},{name:'법무지원그룹',type:'기능 그룹',members:6,areas:['법률/계약'],perms:'읽기 전용'},{name:'관리자 그룹',type:'시스템 그룹',members:3,areas:['전체 영역'],perms:'전체 권한'},{name:'외부 협력업체',type:'외부 그룹',members:12,areas:['교육자료 (일부)'],perms:'제한적 읽기'}].map(g=>(
              <div key={g.name} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3"><div><span className="font-black text-[14px] text-gray-800 block">{g.name}</span><span className="text-[11px] text-gray-500">{g.type}</span></div><span className="text-[12px] font-bold text-gray-600">{g.members}명</span></div>
                <div className="text-[12px] text-gray-600 mb-2"><span className="font-medium text-gray-500">접근 영역: </span>{g.areas.join(', ')}</div>
                <div className="flex items-center justify-between"><span className={`text-[11px] px-2 py-0.5 rounded font-bold ${g.perms.includes('전체')?'bg-red-100 text-red-700':g.perms.includes('쓰기')?'bg-blue-100 text-blue-700':'bg-gray-100 text-gray-600'}`}>{g.perms}</span><div className="flex gap-2"><button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600"><Edit3 className="w-3.5 h-3.5"/></button><button onClick={()=>setToast({message:'그룹이 삭제되었습니다.'})} className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5"/></button></div></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
};

// ==================== 연계 SW 통합 모니터링 ====================
const ConnectedMonitorPage = () => {
  const { setToast } = useToast();
  const SW = [
    {key:'rag',name:'RAG 서비스',icon:BookOpen,c:'blue',d:MOCK_CONNECTED_SW.rag,metrics:[['QPS',MOCK_CONNECTED_SW.rag.qps],['평균 지연',`${MOCK_CONNECTED_SW.rag.avgLatency}ms`],['성공률',`${MOCK_CONNECTED_SW.rag.successRate}%`],['대기 큐',`${MOCK_CONNECTED_SW.rag.queueSize}건`]]},
    {key:'ocr',name:'OCR 엔진',icon:FileText,c:'green',d:MOCK_CONNECTED_SW.ocr,metrics:[['처리 건수',MOCK_CONNECTED_SW.ocr.processed],['평균 지연',`${MOCK_CONNECTED_SW.ocr.avgLatency}ms`],['성공률',`${MOCK_CONNECTED_SW.ocr.successRate}%`],['대기 큐',`${MOCK_CONNECTED_SW.ocr.queueSize}건`]]},
    {key:'vectordb',name:'VectorDB (Milvus)',icon:Database,c:'purple',d:MOCK_CONNECTED_SW.vectordb,metrics:[['총 벡터',MOCK_CONNECTED_SW.vectordb.totalVectors.toLocaleString()],['QPS',MOCK_CONNECTED_SW.vectordb.qps],['쿼리 지연',`${MOCK_CONNECTED_SW.vectordb.avgQueryMs}ms`],['디스크',MOCK_CONNECTED_SW.vectordb.diskUsage]]},
    {key:'agent',name:'에이전트 엔진',icon:Bot,c:'orange',d:MOCK_CONNECTED_SW.agent,metrics:[['활성 파이프라인',MOCK_CONNECTED_SW.agent.activePipelines],['오늘 완료',MOCK_CONNECTED_SW.agent.completedToday],['오늘 실패',MOCK_CONNECTED_SW.agent.failedToday],['평균 실행',`${MOCK_CONNECTED_SW.agent.avgExecSec}s`]]},
  ];
  const statCls = {정상:'bg-green-100 text-green-700',주의:'bg-yellow-100 text-yellow-700',오류:'bg-red-100 text-red-700'};
  const levelCls = {INFO:'text-gray-500',WARN:'text-yellow-600 font-bold',ERROR:'text-red-600 font-bold'};
  return (
    <PageShell breadcrumb={['운영·관리','연계 SW 모니터링']} title="연계 SW 통합 모니터링" sub="RAG · OCR · VectorDB · Agent 실시간 상태 및 로그">
      <div className="grid grid-cols-2 gap-5 mb-5">
        {SW.map(sw=>(
          <div key={sw.key} className="bg-white rounded-2xl border-2 border-gray-100 p-5 shadow-sm hover:border-blue-100 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-${sw.c}-50 border-2 border-${sw.c}-100 flex items-center justify-center`}><sw.icon className={`w-5 h-5 text-${sw.c}-600`}/></div>
                <div><div className="font-black text-[14px] text-gray-800">{sw.name}</div><div className="text-[11px] text-gray-400">{sw.key==='vectordb'?MOCK_CONNECTED_SW.vectordb.name:sw.name}</div></div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${statCls[sw.d.status]}`}>{sw.d.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {sw.metrics.map(([k,v])=>(
                <div key={k} className="bg-gray-50 rounded-xl p-3"><div className="text-[10px] text-gray-400 font-medium">{k}</div><div className="font-black text-[15px] text-gray-800 mt-0.5">{v}</div></div>
              ))}
            </div>
            {sw.key==='agent'&&MOCK_CONNECTED_SW.agent.failedToday>0&&<div className="mt-3 p-2.5 bg-yellow-50 border border-yellow-200 rounded-xl text-[11px] text-yellow-700 font-medium">⚠ 오늘 {MOCK_CONNECTED_SW.agent.failedToday}건 실패 — 재처리 큐 확인 권장</div>}
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <h4 className="font-black text-[14px] text-gray-700">연계 SW 통합 로그 (최근)</h4>
          <button onClick={()=>setToast({message:'로그를 새로고침했습니다.'})} className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-[12px] font-bold hover:bg-gray-50"><RotateCcw className="w-3.5 h-3.5"/> 새로고침</button>
        </div>
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50">{['시각','SW','레벨','메시지'].map(h=><th key={h} className="text-left font-bold text-gray-500 py-2.5 px-4 text-[11px] uppercase whitespace-nowrap">{h}</th>)}</tr></thead>
          <tbody>{MOCK_CONNECTED_SW.logs.map((l,i)=>(
            <tr key={i} className={`border-b border-gray-50 hover:bg-gray-50 ${l.level==='ERROR'?'bg-red-50/40':l.level==='WARN'?'bg-yellow-50/40':''}`}>
              <td className="py-2.5 px-4 text-gray-400 whitespace-nowrap font-mono">{l.time}</td>
              <td className="py-2.5 px-4"><span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[11px] font-bold">{l.sw}</span></td>
              <td className={`py-2.5 px-4 text-[11px] font-black ${levelCls[l.level]}`}>{l.level}</td>
              <td className="py-2.5 px-4 text-gray-700">{l.msg}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div className="mt-5 bg-indigo-50 border-2 border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5"/>
        <p className="text-[13px] text-indigo-800 font-medium">임계치 초과 시 Slack 및 이메일로 즉시 알림이 발송됩니다. 알림 기준: <strong>에러율 &gt;2%</strong>, <strong>응답 지연 p99 &gt;1s</strong>, <strong>큐 적체 &gt;100건</strong>. 임계값은 시스템 모니터링 페이지에서 설정 가능합니다.</p>
      </div>
    </PageShell>
  );
};

// ==================== RAG PIPELINE PAGE ====================
const RagPipelinePage = () => {
  const [tab, setTab] = useState('sources');
  const [selChunk, setSelChunk] = useState(null);
  const [rpQueue, setRpQueue] = useState(MOCK_REPROCESS_QUEUE.map(r=>({...r})));
  const { setToast } = useToast();

  const SBadge = ({v}) => {
    const m = {정상:'green',양호:'green',완료:'blue',대기중:'yellow',처리중:'blue',오류:'red',실패:'red',경고:'yellow',주의:'yellow',수동처리필요:'red',검토중:'yellow',미처리:'red',신규:'purple'};
    const c = m[v]||'gray';
    const cls = {green:'bg-green-100 text-green-700',blue:'bg-blue-100 text-blue-700',yellow:'bg-yellow-100 text-yellow-700',red:'bg-red-100 text-red-700',purple:'bg-purple-100 text-purple-700',gray:'bg-gray-100 text-gray-600'};
    return <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap ${cls[c]}`}>{v}</span>;
  };

  const stColor = {완료:'text-green-600',처리중:'text-blue-600',실패:'text-red-600',대기:'text-gray-400'};
  const stIcon  = {완료:'✓',처리중:'⟳',실패:'✗',대기:'…'};

  const TABS = [
    {id:'sources',label:'📡 데이터 소스'},{id:'monitor',label:'📊 처리 모니터링'},
    {id:'chunk',label:'🧩 청크 품질'},{id:'embed',label:'🔢 임베딩 품질'},{id:'queue',label:'🔄 재처리 큐'},
  ];

  return (
    <PageShell breadcrumb={['지식·RAG','RAG 파이프라인']} title="RAG 파이프라인 관리" sub="데이터 수집 · 전처리 · 임베딩 · 품질 통합 관리">
      {/* Tab bar */}
      <div className="flex gap-0.5 mb-6 border-b border-gray-200 -mx-6 px-6">
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            className={`px-4 py-2.5 text-[13px] font-bold border-b-2 transition-colors whitespace-nowrap ${tab===t.id?'border-blue-600 text-blue-700 bg-blue-50/60':'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab 1: 데이터 소스 ── */}
      {tab==='sources' && (
        <div className="space-y-6">
          {/* 내부 시스템 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-[15px] text-gray-800 flex items-center gap-2"><Database className="w-4 h-4 text-blue-600"/> 내부 시스템 연계</h3>
              <button onClick={()=>setToast({message:'소스 추가 다이얼로그가 열립니다.'})} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[12px] font-bold hover:bg-blue-700 shadow-sm"><Plus className="w-3.5 h-3.5"/> 소스 추가</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {MOCK_DATA_SOURCES_INT.map(src=>(
                <div key={src.id} className="bg-white rounded-2xl border-2 border-gray-100 p-5 shadow-sm hover:border-blue-200 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${src.status==='정상'?'bg-green-500 shadow-[0_0_6px_#22c55e]':src.status==='경고'?'bg-yellow-500':'bg-red-500'}`}/>
                      <span className="font-black text-[14px] text-gray-800">{src.name}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">{src.protocol}</span>
                    </div>
                    <SBadge v={src.status}/>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 text-[12px]">
                    <div><div className="text-gray-400 font-medium">대상 폴더</div><div className="font-bold text-gray-800">{src.target}</div></div>
                    <div><div className="text-gray-400 font-medium">수집 문서</div><div className="font-bold text-gray-800">{src.docCount.toLocaleString()}건 <span className="text-green-600">+{src.newToday}건</span></div></div>
                    <div><div className="text-gray-400 font-medium">스케줄</div><div className="font-bold text-gray-700">{src.schedule}</div></div>
                    <div><div className="text-gray-400 font-medium">마지막 동기화</div><div className="font-bold text-gray-700">{src.lastSync}</div></div>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button onClick={()=>setToast({message:`${src.name} 수동 동기화가 시작되었습니다.`})} className="flex items-center gap-1 px-2.5 py-1 bg-gray-800 text-white rounded-lg text-[11px] font-bold hover:bg-gray-700"><RotateCcw className="w-3 h-3"/> 즉시 동기화</button>
                    <button onClick={()=>setToast({message:`${src.name} 설정 편집창이 열립니다.`})} className="flex items-center gap-1 px-2.5 py-1 border border-gray-200 text-gray-600 rounded-lg text-[11px] font-bold hover:bg-gray-50"><Settings className="w-3 h-3"/> 설정</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* 외부 연계 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-[15px] text-gray-800 flex items-center gap-2"><Globe className="w-4 h-4 text-purple-600"/> 외부 연계 (Open API / 크롤링)</h3>
              <button onClick={()=>setToast({message:'외부 소스 추가 다이얼로그가 열립니다.'})} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-[12px] font-bold hover:bg-purple-700 shadow-sm"><Plus className="w-3.5 h-3.5"/> 외부 소스 추가</button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-[13px]">
                <thead><tr className="border-b-2 border-gray-100 bg-gray-50">{['소스명','방식','대상 폴더','수집 스케줄','마지막 수집','문서 수','상태',''].map(h=><th key={h} className="text-left font-bold text-gray-500 py-2.5 px-4 text-[11px] uppercase tracking-wide">{h}</th>)}</tr></thead>
                <tbody>{MOCK_DATA_SOURCES_EXT.map(src=>(
                  <tr key={src.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4"><div className="font-bold text-gray-800">{src.name}</div><div className="text-[11px] text-gray-400 font-mono">{src.url}</div></td>
                    <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded text-[11px] font-bold ${src.method==='Open API'?'bg-blue-100 text-blue-700':'bg-orange-100 text-orange-700'}`}>{src.method}</span></td>
                    <td className="py-3 px-4 text-gray-600">{src.target}</td>
                    <td className="py-3 px-4 text-gray-600 text-[12px]">{src.schedule}</td>
                    <td className="py-3 px-4 text-gray-500 text-[12px]">{src.lastSync}</td>
                    <td className="py-3 px-4 font-bold text-gray-800">{src.docCount.toLocaleString()} <span className="text-green-600 text-[11px] font-bold">+{src.newToday}</span></td>
                    <td className="py-3 px-4"><SBadge v={src.status}/></td>
                    <td className="py-3 px-4"><button onClick={()=>setToast({message:`${src.name} 즉시 수집이 시작되었습니다.`})} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"><RotateCcw className="w-3.5 h-3.5"/></button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
          {/* 메타데이터 & 접근권한 안내 */}
          <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0"><Shield className="w-5 h-5 text-blue-600"/></div>
            <div>
              <div className="font-black text-[14px] text-blue-800 mb-1">메타데이터 기반 접근 권한 관리</div>
              <p className="text-[13px] text-blue-700 font-medium">수집 문서의 소속 부서, 보안 등급, 문서 유형 메타데이터를 자동 추출하여 벡터 DB에 저장합니다. 검색 시 사용자 부서 및 권한 레벨에 따라 검색 대상 컬렉션을 자동 필터링하며, 최신 문서(수집일 기준)에 가중치 부스팅을 적용하여 최신 자료가 우선 답변에 활용됩니다.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 2: 처리 모니터링 ── */}
      {tab==='monitor' && (
        <div className="space-y-5">
          <div className="grid grid-cols-5 gap-4">
            {[{label:'오늘 신규 수집',v:22,c:'text-blue-600',bg:'bg-blue-50'},{label:'오늘 업데이트',v:8,c:'text-green-600',bg:'bg-green-50'},{label:'삭제 감지',v:1,c:'text-orange-600',bg:'bg-orange-50'},{label:'처리 실패',v:2,c:'text-red-600',bg:'bg-red-50'},{label:'임베딩 대기',v:14,c:'text-yellow-600',bg:'bg-yellow-50'}].map(s=>(
              <div key={s.label} className={`${s.bg} rounded-2xl border border-gray-100 p-4 text-center shadow-sm`}>
                <div className={`text-2xl font-black ${s.c}`}>{s.v}</div>
                <div className="text-[11px] text-gray-500 font-medium mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          {/* 파일 유형별 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h4 className="font-black text-[14px] text-gray-700 mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-500"/> 오늘 파일 유형별 처리 현황</h4>
            <div className="flex flex-wrap gap-3">
              {[{t:'PDF',n:14,c:'bg-red-100 text-red-700'},{t:'XLSX',n:4,c:'bg-green-100 text-green-700'},{t:'DOCX',n:2,c:'bg-blue-100 text-blue-700'},{t:'PPTX',n:1,c:'bg-orange-100 text-orange-700'},{t:'JSON',n:1,c:'bg-gray-100 text-gray-700'},{t:'크롤링',n:3,c:'bg-purple-100 text-purple-700'}].map(t=>(
                <div key={t.t} className={`flex items-center gap-2 px-4 py-2 rounded-xl ${t.c} font-bold text-[13px]`}>{t.t} <span className="font-black">{t.n}건</span></div>
              ))}
            </div>
          </div>
          {/* 파이프라인 처리 이력 테이블 */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
              <h4 className="font-black text-[14px] text-gray-700">처리 이력 (최근 7건)</h4>
              <div className="flex items-center gap-3 text-[12px] text-gray-500 flex-wrap">
                {[['green','완료'],['blue','처리중'],['red','실패'],['gray','대기']].map(([cl,lb])=>(
                  <span key={lb} className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full bg-${cl}-500 inline-block`}/>{lb}</span>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead><tr className="border-b border-gray-100 bg-gray-50">{['문서명','폴더','소스','유형','수집 일시','파싱','청킹','임베딩','청크 수','PII','변경유형'].map(h=><th key={h} className="text-left font-bold text-gray-500 py-2.5 px-3 text-[11px] uppercase tracking-wide whitespace-nowrap">{h}</th>)}</tr></thead>
                <tbody>{MOCK_DOC_PIPELINE.map(d=>(
                  <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-bold text-gray-800 max-w-[160px] truncate" title={d.name}>{d.name}</td>
                    <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">{d.folder}</td>
                    <td className="py-2.5 px-3 text-gray-500">{d.src}</td>
                    <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold">{d.type}</span></td>
                    <td className="py-2.5 px-3 text-gray-500 whitespace-nowrap">{d.ingest}</td>
                    <td className={`py-2.5 px-3 text-center font-black text-lg ${stColor[d.parseStatus]}`}>{stIcon[d.parseStatus]}</td>
                    <td className={`py-2.5 px-3 text-center font-black text-lg ${stColor[d.chunkStatus]}`}>{stIcon[d.chunkStatus]}</td>
                    <td className={`py-2.5 px-3 text-center font-black text-lg ${stColor[d.embedStatus]}`}>{stIcon[d.embedStatus]}</td>
                    <td className="py-2.5 px-3 font-mono text-gray-700">{d.chunks>0?d.chunks.toLocaleString():'–'}</td>
                    <td className="py-2.5 px-3 text-center">{d.pii?<span className="text-red-500 font-black text-[11px]">⚠PII</span>:<span className="text-gray-300 text-[11px]">–</span>}</td>
                    <td className="py-2.5 px-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${d.changeType==='신규'?'bg-blue-100 text-blue-700':d.changeType==='업데이트'?'bg-yellow-100 text-yellow-700':'bg-gray-100 text-gray-600'}`}>{d.changeType}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
          {/* 이력 관리 안내 배너 */}
          <div className="bg-indigo-50 border-2 border-indigo-100 rounded-2xl p-4 flex items-center gap-4">
            <History className="w-5 h-5 text-indigo-500 shrink-0"/>
            <p className="text-[13px] text-indigo-700 font-medium">자료실 문서 변경 사항(신규·업데이트·삭제)은 자동 감지되어 위 이력에 기록됩니다. 각 문서의 버전 이력 및 이전 벡터 스냅샷은 <strong>30일간 보관</strong>됩니다.</p>
          </div>
        </div>
      )}

      {/* ── Tab 3: 청크 품질 ── */}
      {tab==='chunk' && (
        <div className="space-y-5">
          <div className="grid grid-cols-4 gap-4">
            {[{label:'평균 청크 길이',v:'154자',sub:'권장 100~300자',ok:true},{label:'특수문자 비율',v:'3.1%',sub:'임계 5% 초과 시 경고',ok:true},{label:'중복 청크 비율',v:'2.1%',sub:'임계 5% 초과 시 경고',ok:true},{label:'의미 완결성 평균',v:'84.8점',sub:'임계 70점 미만 경고',ok:true}].map(s=>(
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="text-[11px] text-gray-500 font-medium mb-1">{s.label}</div>
                <div className="text-xl font-black text-gray-800">{s.v}</div>
                <div className={`text-[11px] mt-1 font-medium ${s.ok?'text-green-600':'text-red-600'}`}>{s.sub}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-5 items-start">
            {/* Quality table */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-w-0">
              <div className="px-5 py-3.5 border-b border-gray-100">
                <h4 className="font-black text-[14px] text-gray-700">문서별 청크 품질 현황</h4>
                <p className="text-[12px] text-gray-400 mt-0.5">행 클릭 시 청크 미리보기 패널에 표시됩니다.</p>
              </div>
              <table className="w-full text-[12px]">
                <thead><tr className="border-b border-gray-100 bg-gray-50">{['문서명','폴더','평균길이','특수문자%','중복%','의미점수','상태',''].map(h=><th key={h} className="text-left font-bold text-gray-500 py-2 px-3 text-[11px] uppercase">{h}</th>)}</tr></thead>
                <tbody>{MOCK_CHUNK_QUALITY.map(d=>(
                  <tr key={d.docId} onClick={()=>setSelChunk(d)} className={`border-b border-gray-50 cursor-pointer transition-colors ${selChunk?.docId===d.docId?'bg-blue-50 border-l-4 border-l-blue-500':'hover:bg-gray-50'}`}>
                    <td className="py-2.5 px-3 font-bold text-gray-800 max-w-[150px] truncate" title={d.name}>{d.name}</td>
                    <td className="py-2.5 px-3 text-gray-500 whitespace-nowrap">{d.folder}</td>
                    <td className="py-2.5 px-3 font-mono text-gray-700">{d.avgLen}자</td>
                    <td className={`py-2.5 px-3 font-mono font-bold ${d.specialCharPct>5?'text-red-600':d.specialCharPct>3?'text-yellow-600':'text-green-600'}`}>{d.specialCharPct}%</td>
                    <td className={`py-2.5 px-3 font-mono font-bold ${d.dupPct>5?'text-red-600':d.dupPct>3?'text-yellow-600':'text-green-600'}`}>{d.dupPct}%</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-gray-100"><div className={`h-full rounded-full ${d.semanticScore>=90?'bg-green-500':d.semanticScore>=75?'bg-yellow-500':'bg-red-500'}`} style={{width:`${d.semanticScore}%`}}/></div>
                        <span className="font-mono font-bold text-gray-700 text-[11px]">{d.semanticScore}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3"><SBadge v={d.status}/></td>
                    <td className="py-2.5 px-3"><button onClick={e=>{e.stopPropagation();setToast({message:`${d.name} 청킹 재적용이 시작되었습니다.`});}} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600"><RotateCcw className="w-3.5 h-3.5"/></button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            {/* Chunk preview */}
            <div className="w-80 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 shrink-0">
              <h4 className="font-black text-[13px] text-gray-700 mb-3 flex items-center gap-2"><Eye className="w-4 h-4 text-blue-500"/> 청크 미리보기</h4>
              {selChunk ? (
                <div>
                  <div className="text-[12px] text-gray-500 font-medium mb-3 p-2 bg-gray-50 rounded-lg">{selChunk.name}</div>
                  <div className="space-y-3">
                    {MOCK_CHUNK_PREVIEW.map(c=>(
                      <div key={c.idx} className="p-3 rounded-xl border-2 border-gray-100 bg-gray-50">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-black text-gray-400">청크 #{c.idx}</span>
                          <div className="flex gap-2">
                            <span className="text-[10px] text-gray-400">{c.len}자</span>
                            <span className={`text-[10px] font-bold ${c.score>=90?'text-green-600':'text-yellow-600'}`}>의미:{c.score}</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-gray-700 leading-relaxed">{c.text.substring(0,120)}…</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={()=>setToast({message:'청킹 규칙 재적용이 시작되었습니다.'})} className="w-full mt-3 py-2 rounded-xl bg-blue-600 text-white text-[12px] font-bold hover:bg-blue-700 transition-colors">청킹 규칙 재적용</button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-52 text-gray-400">
                  <FileText className="w-10 h-10 mb-2 text-gray-200"/>
                  <p className="text-[13px] font-medium text-center">좌측 표에서 문서를 선택하면<br/>청크 미리보기가 표시됩니다</p>
                </div>
              )}
            </div>
          </div>
          {/* Chunking rules */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h4 className="font-black text-[14px] text-gray-700 mb-4 flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-indigo-500"/> 청킹 규칙 전역 설정</h4>
            <div className="grid grid-cols-4 gap-5 mb-4">
              {[{label:'기본 청크 크기',unit:'토큰',val:'512'},{label:'오버랩 크기',unit:'토큰',val:'64'},{label:'최소 청크 길이',unit:'자',val:'30'},{label:'최대 청크 길이',unit:'자',val:'800'}].map(r=>(
                <div key={r.label}>
                  <label className="text-[12px] font-bold text-gray-600 block mb-1.5">{r.label}</label>
                  <div className="flex items-center gap-2">
                    <input defaultValue={r.val} className="w-full border-2 border-gray-200 rounded-lg px-3 py-1.5 text-[13px] font-mono font-bold text-gray-800 focus:outline-none focus:border-blue-400"/>
                    <span className="text-[12px] text-gray-400 whitespace-nowrap">{r.unit}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[12px] font-bold text-gray-600">분할 방식:</span>
              {['문장 단위 분할','절/항 단위 분할 (공문서 최적화)','시멘틱 분할 (실험적)'].map((m,i)=>(
                <label key={m} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="chunkMethod" defaultChecked={i===2} className="accent-blue-600"/>
                  <span className="text-[13px] font-medium text-gray-700">{m}</span>
                </label>
              ))}
              <button onClick={()=>setToast({message:'청킹 규칙이 저장되었습니다.'})} className="ml-auto px-4 py-1.5 bg-blue-600 text-white rounded-lg text-[12px] font-bold hover:bg-blue-700 shadow-sm">저장</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 4: 임베딩 품질 ── */}
      {tab==='embed' && (
        <div className="space-y-5">
          {/* Today stats */}
          <div className="grid grid-cols-5 gap-4">
            {[{label:'오늘 처리',v:MOCK_EMBED_STATUS.today.total,c:'text-gray-800',bg:'bg-white'},{label:'성공',v:MOCK_EMBED_STATUS.today.success,c:'text-green-600',bg:'bg-green-50'},{label:'실패',v:MOCK_EMBED_STATUS.today.fail,c:'text-red-600',bg:'bg-red-50'},{label:'대기',v:MOCK_EMBED_STATUS.today.pending,c:'text-yellow-600',bg:'bg-yellow-50'},{label:'성공률',v:`${MOCK_EMBED_STATUS.today.successRate}%`,c:'text-blue-600',bg:'bg-blue-50'}].map(s=>(
              <div key={s.label} className={`${s.bg} rounded-2xl border border-gray-100 p-4 text-center shadow-sm`}>
                <div className={`text-2xl font-black ${s.c}`}>{s.v}</div>
                <div className="text-[11px] text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          {/* Models + VectorDB */}
          <div className="grid grid-cols-3 gap-4">
            {MOCK_EMBED_STATUS.models.map(m=>(
              <div key={m.name} className="bg-white rounded-2xl border-2 border-gray-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3"><div className="font-black text-[14px] text-gray-800">{m.name}</div><SBadge v={m.status}/></div>
                <div className="space-y-2 text-[12px]">
                  {[['벡터 차원',`${m.dim}차원`],['임베딩 문서',`${m.docs.toLocaleString()}건`],['평균 지연',`${m.avgLatency}ms`],['마지막 갱신',m.lastUpdated]].map(([k,v])=>(
                    <div key={k} className="flex justify-between"><span className="text-gray-400">{k}</span><span className="font-bold text-gray-700">{v}</span></div>
                  ))}
                </div>
              </div>
            ))}
            <div className="bg-white rounded-2xl border-2 border-blue-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="font-black text-[14px] text-gray-800 flex items-center gap-2"><Database className="w-4 h-4 text-blue-500"/>{MOCK_EMBED_STATUS.vectorDb.name}</div>
                <SBadge v={MOCK_EMBED_STATUS.vectorDb.status}/>
              </div>
              <div className="space-y-2 text-[12px]">
                {[['컬렉션 수',`${MOCK_EMBED_STATUS.vectorDb.collections}개`],['총 벡터 수',MOCK_EMBED_STATUS.vectorDb.totalVectors.toLocaleString()],['디스크 사용',MOCK_EMBED_STATUS.vectorDb.diskUsage],['쿼리 지연',`${MOCK_EMBED_STATUS.vectorDb.queryLatency}ms`],['인덱스 타입',MOCK_EMBED_STATUS.vectorDb.indexType]].map(([k,v])=>(
                  <div key={k} className="flex justify-between"><span className="text-gray-400">{k}</span><span className="font-bold text-gray-700">{v}</span></div>
                ))}
              </div>
            </div>
          </div>
          {/* Weekly trend */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h4 className="font-black text-[14px] text-gray-700 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-500"/> 주간 임베딩 처리 추이</h4>
            <div className="flex items-end gap-2" style={{height:'100px'}}>
              {MOCK_EMBED_STATUS.weeklyTrend.map(d=>{
                const max=1500;
                const sh=Math.max(4,Math.round((d.success/max)*88));
                const fh=Math.max(2,Math.round((d.fail/max)*88));
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-0.5">
                    <div className="w-full flex flex-col items-center" style={{height:'88px',justifyContent:'flex-end'}}>
                      <div className="w-full rounded-t bg-red-300" style={{height:`${fh}px`}} title={`실패 ${d.fail}`}/>
                      <div className="w-full bg-green-400 rounded-b" style={{height:`${sh}px`}} title={`성공 ${d.success}`}/>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">{d.date}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 mt-2 text-[11px] font-medium">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-400 inline-block"/> 성공</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-300 inline-block"/> 실패</span>
            </div>
          </div>
          {/* Re-rank 모델 안내 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h4 className="font-black text-[14px] text-gray-700 mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-yellow-500"/> 검색 성능 향상 — Re-rank 모델 제안</h4>
            <div className="grid grid-cols-3 gap-4">
              {[{name:'BGE Reranker v2',desc:'한국어 교차 인코더. 상위 20개 후보에서 의미 기반 재순위화. MRR@10 기준 +18% 향상',badge:'권장',bc:'bg-green-100 text-green-700'},{name:'ColBERT v2',desc:'토큰 레벨 후기 상호작용. 긴 문서(1,000자↑) 검색에 효과적. 지연 +12ms',badge:'고성능',bc:'bg-blue-100 text-blue-700'},{name:'Cohere Rerank 3',desc:'다국어 지원. 한/영 혼용 문서에 최적화. API 방식으로 인프라 추가 불필요',badge:'외부API',bc:'bg-purple-100 text-purple-700'}].map(r=>(
                <div key={r.name} className="p-4 rounded-xl border-2 border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-2 mb-2"><span className="font-black text-[14px] text-gray-800">{r.name}</span><span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${r.bc}`}>{r.badge}</span></div>
                  <p className="text-[12px] text-gray-600 font-medium">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Anomaly detection */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h4 className="font-black text-[14px] text-gray-700 mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-500"/> 이상치 탐지 ({MOCK_EMBED_STATUS.anomalies.length}건)</h4>
            <div className="space-y-3">
              {MOCK_EMBED_STATUS.anomalies.map(a=>(
                <div key={a.id} className={`flex items-start justify-between p-4 rounded-xl border-2 ${a.status==='미처리'?'border-red-200 bg-red-50':'border-yellow-200 bg-yellow-50'}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[11px] font-black px-2 py-0.5 rounded ${a.status==='미처리'?'bg-red-200 text-red-700':'bg-yellow-200 text-yellow-700'}`}>{a.type}</span>
                      <span className="text-[13px] font-bold text-gray-800">{a.doc}</span>
                    </div>
                    <p className="text-[12px] text-gray-600">{a.desc}</p>
                    <p className="text-[11px] text-gray-400 mt-1">탐지 시각: {a.detected}</p>
                  </div>
                  <div className="flex gap-2 shrink-0 ml-4 items-center">
                    <SBadge v={a.status}/>
                    <button onClick={()=>setToast({message:`${a.doc} 재처리 큐에 추가되었습니다.`})} className="px-3 py-1 bg-gray-800 text-white rounded-lg text-[11px] font-bold hover:bg-gray-700">재처리</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 5: 재처리 큐 ── */}
      {tab==='queue' && (
        <div className="space-y-5">
          <div className="grid grid-cols-4 gap-4">
            {[{label:'대기 중',v:rpQueue.filter(r=>r.status==='대기중').length,c:'text-yellow-600',bg:'bg-yellow-50'},{label:'수동 처리 필요',v:rpQueue.filter(r=>r.status==='수동처리필요').length,c:'text-red-600',bg:'bg-red-50'},{label:'높음 우선순위',v:rpQueue.filter(r=>r.priority==='높음').length,c:'text-orange-600',bg:'bg-orange-50'},{label:'평균 재시도 횟수',v:`${(rpQueue.reduce((s,r)=>s+r.retryCount,0)/rpQueue.length).toFixed(1)}회`,c:'text-gray-700',bg:'bg-gray-50'}].map(s=>(
              <div key={s.label} className={`${s.bg} rounded-2xl border border-gray-100 p-4 text-center shadow-sm`}>
                <div className={`text-2xl font-black ${s.c}`}>{s.v}</div>
                <div className="text-[11px] text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
              <h4 className="font-black text-[14px] text-gray-700">재처리 대기 목록</h4>
              <div className="flex gap-2">
                <button onClick={()=>{setRpQueue(q=>q.map(r=>r.status==='대기중'?{...r,retryCount:r.retryCount+1}:r));setToast({message:`${rpQueue.filter(r=>r.status==='대기중').length}건 일괄 재처리가 시작되었습니다.`});}} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[12px] font-bold hover:bg-blue-700 shadow-sm"><RotateCcw className="w-3.5 h-3.5"/> 전체 재처리</button>
                <button onClick={()=>setToast({message:'완료된 항목이 큐에서 제거되었습니다.'})} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-[12px] font-bold hover:bg-gray-50"><Trash2 className="w-3.5 h-3.5"/> 완료 항목 정리</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead><tr className="border-b border-gray-100 bg-gray-50">{['우선순위','문서명','폴더','소스','실패 단계','오류 내용','실패 시각','재시도','상태',''].map(h=><th key={h} className="text-left font-bold text-gray-500 py-2.5 px-3 text-[11px] uppercase whitespace-nowrap">{h}</th>)}</tr></thead>
                <tbody>{rpQueue.map(r=>(
                  <tr key={r.id} className={`border-b border-gray-50 hover:bg-gray-50 ${r.status==='수동처리필요'?'bg-red-50/40':''}`}>
                    <td className="py-3 px-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${r.priority==='높음'?'bg-red-100 text-red-700':'bg-gray-100 text-gray-600'}`}>{r.priority}</span></td>
                    <td className="py-3 px-3 font-bold text-gray-800 max-w-[130px] truncate" title={r.doc}>{r.doc}</td>
                    <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{r.folder}</td>
                    <td className="py-3 px-3 text-gray-500">{r.src}</td>
                    <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-[11px] font-bold">{r.stage}</span></td>
                    <td className="py-3 px-3 text-gray-600 max-w-[220px] truncate" title={r.error}>{r.error}</td>
                    <td className="py-3 px-3 text-gray-400 whitespace-nowrap">{r.failedAt}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-gray-600">{r.retryCount}회</td>
                    <td className="py-3 px-3"><SBadge v={r.status}/></td>
                    <td className="py-3 px-3">
                      {r.status==='대기중' && <button onClick={()=>{setRpQueue(q=>q.map(x=>x.id===r.id?{...x,retryCount:x.retryCount+1}:x));setToast({message:`${r.doc} 재처리를 시작합니다.`});}} className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[11px] font-bold hover:bg-blue-700"><RotateCcw className="w-3 h-3"/> 재처리</button>}
                      {r.status==='수동처리필요' && <button onClick={()=>setToast({message:`${r.doc}: 파일 복호화 또는 분할 처리가 필요합니다.`})} className="flex items-center gap-1 px-2.5 py-1 bg-orange-500 text-white rounded-lg text-[11px] font-bold hover:bg-orange-600">수동 처리</button>}
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
          <div className="bg-amber-50 border-2 border-amber-100 rounded-2xl p-4 flex items-start gap-4">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5"/>
            <div className="text-[13px] text-amber-800 font-medium">
              <strong>수동 처리 필요 항목</strong>은 암호화 파일, 토큰 초과 문서, 손상 파일 등 자동 재처리가 불가한 경우입니다.
              해당 파일을 <strong>복호화하거나 분할 업로드</strong>한 후 재처리 버튼을 눌러주세요. 3회 이상 실패한 항목은 담당자에게 Slack 알림이 발송됩니다.
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
};

// ==================== MAIN APP ====================
const App = ({ onSwitchToUser, domain }) => {
  const orgName = domain?.orgName || '한국부동산원';
  const [activeId,setActiveId]=useState('dashboard.system');

  const menu = [
    /* ════════════════════════════════════
       대메뉴 1 — 대시보드
    ════════════════════════════════════ */
    {id:'dashboard', label:'대시보드', icon:LayoutDashboard, children:[
      {id:'dashboard.system',  label:'시스템 현황'},
      {id:'dashboard.service', label:'서비스 현황'},
      {id:'dashboard.gpu',     label:'GPU 현황'},
      {id:'dashboard.trainer', label:'트레이너 현황'},
    ]},

    /* ════════════════════════════════════
       대메뉴 2 — 인프라 · 개발
    ════════════════════════════════════ */
    {id:'_s1', label:'인프라 · 개발', section:true},
    {id:'data', label:'데이터 관리', icon:Database, children:[
      {id:'data.dataset',  label:'데이터셋'},
      {id:'data.vectordb', label:'벡터 DB'},
      {id:'data.autoload', label:'자동 적재'},
    ]},
    {id:'dev', label:'개발 환경', icon:Code, children:[
      {id:'dev.codespace', label:'코드스페이스'},
      {id:'dev.volume',    label:'공유 볼륨'},
    ]},
    {id:'model.registry', label:'모델 레지스트리', icon:Box},
    {id:'trainer', label:'학습 · 튜닝', icon:Layers, children:[
      {id:'trainer.llm',       label:'LLM 파인튜닝'},
      {id:'trainer.vlm',       label:'VLM 학습'},
      {id:'trainer.embedding', label:'임베딩 학습'},
      {id:'trainer.reranking', label:'리랭킹 학습'},
    ]},
    {id:'eval', label:'모델 평가', icon:BarChart2, children:[
      {id:'eval.leaderboard', label:'리더보드'},
      {id:'eval.metrics',     label:'평가 지표'},
    ]},

    /* ════════════════════════════════════
       대메뉴 3 — AI 서비스
    ════════════════════════════════════ */
    {id:'_s2', label:'AI 서비스', section:true},
    {id:'guardrail', label:'가드레일', icon:Shield, children:[
      {id:'guardrail.filter', label:'필터 설정'},
      {id:'guardrail.log',    label:'탐지 로그'},
    ]},
    {id:'deploy', label:'도구 · 배포', icon:Wrench, children:[
      {id:'deploy.tools.mcp',    label:'MCP 도구'},
      {id:'deploy.tools.server', label:'MCP 서버'},
      {id:'deploy.tools.prompt', label:'프롬프트 라이브러리'},
      {id:'deploy.serving',      label:'서빙 관리'},
    ]},
    {id:'agent', label:'에이전트', icon:Bot, children:[
      {id:'agent.taskflow.builder', label:'태스크플로우 빌더'},
      {id:'agent.taskflow.deploy',  label:'태스크플로우 배포'},
      {id:'agent.workflow',         label:'워크플로우'},
    ]},
    {id:'app', label:'애플리케이션', icon:Grid, children:[
      {id:'app.chat',     label:'채팅'},
      {id:'app.report',   label:'보고서 생성'},
      {id:'app.analysis', label:'데이터 분석'},
    ]},

    /* ════════════════════════════════════
       대메뉴 4 — 지식 · RAG
    ════════════════════════════════════ */
    {id:'_s3', label:'지식 · RAG', section:true},
    {id:'knowledge', label:'지식 관리', icon:FolderOpen, children:[
      {id:'admin.knowledge', label:'지식영역 설정'},
      {id:'admin.rag',       label:'RAG 파이프라인'},
    ]},

    /* ════════════════════════════════════
       대메뉴 5 — 운영 · 관리
    ════════════════════════════════════ */
    {id:'_s4', label:'운영 · 관리', section:true},
    {id:'usermgmt', label:'사용자 관리', icon:Users, children:[
      {id:'admin.users',      label:'사용자 목록'},
      {id:'ops.approval',     label:'승인 관리'},
      {id:'ops.quota',        label:'할당량'},
      {id:'admin.logs',       label:'접근 로그'},
      {id:'admin.accesssec',  label:'접근권한·차단'},
    ]},
    {id:'admin.hrsync', label:'HR 연계·그룹 관리', icon:UserCog},
    {id:'llmops', label:'LLM 운영', icon:Cpu, children:[
      {id:'admin.llm',     label:'LLM 설정'},
      {id:'admin.trust',   label:'신뢰성 관리'},
      {id:'admin.quality', label:'AI 품질 관리'},
    ]},
    {id:'analytics', label:'서비스 분석', icon:PieChart, children:[
      {id:'admin.history',      label:'이용 이력'},
      {id:'admin.satisfaction', label:'이용만족도'},
      {id:'admin.stats',        label:'이용 통계'},
      {id:'admin.infostats',    label:'서비스 통계 리포트'},
    ]},
    {id:'logmgmt', label:'로그·모니터링', icon:List, children:[
      {id:'admin.worklog',   label:'통합 로그 관리'},
      {id:'admin.usagemon',  label:'사용량 모니터링'},
    ]},
    {id:'content', label:'콘텐츠 관리', icon:Megaphone, children:[
      {id:'admin.content', label:'공지사항·Q&A·설문'},
    ]},
    {id:'apiops', label:'API·프롬프트', icon:Unplug, children:[
      {id:'admin.apiprompt', label:'API·프롬프트 관리'},
    ]},
    {id:'system', label:'시스템 설정', icon:Settings, children:[
      {id:'admin.manage',       label:'관리 홈'},
      {id:'admin.announce',     label:'공지사항'},
      {id:'admin.monitor',      label:'시스템 모니터링'},
      {id:'admin.connectedmon', label:'연계 SW 모니터링'},
    ]},
  ];

  const pages = {
    'dashboard.system':<SystemDashboard/>,'dashboard.service':<ServiceDashboard/>,'dashboard.gpu':<GpuDashboard/>,'dashboard.trainer':<DashboardTrainer/>,
    'data.dataset':<DatasetPage/>,'data.vectordb':<VectorDbPage/>,'data.autoload':<AutoLoadPage/>,
    'dev.codespace':<CodespacePage/>,'dev.volume':<SharedVolumePage/>,
    'model.registry':<ModelRegistry/>,
    'trainer.llm':<LlmTraining/>,'trainer.vlm':<VlmTraining/>,'trainer.embedding':<EmbeddingPage/>,'trainer.reranking':<RerankingPage/>,
    'eval.leaderboard':<LeaderboardPage/>,'eval.metrics':<EvalMetricsPage/>,
    'guardrail.filter':<GuardrailFilterPage/>,'guardrail.log':<GuardrailLogPage/>,
    'deploy.tools.mcp':<MCPToolsPage/>,'deploy.tools.server':<MCPServerPage/>,'deploy.tools.prompt':<PromptLibraryPage/>,
    'deploy.serving':<ServingPage/>,
    'agent.taskflow.builder':<TaskflowBuilderPage/>,'agent.taskflow.deploy':<TaskflowDeployPage/>,'agent.workflow':<WorkflowPage/>,
    'app.chat':<ChatAppPage/>,'app.report':<ReportGenPage/>,'app.analysis':<DataAnalysisPage/>,
    'ops.approval':<ApprovalPage/>,'ops.quota':<QuotaPage/>,
    'admin.manage':<AdminPage/>,'admin.users':<UserManagementPage/>,'admin.knowledge':<KnowledgeManagementPage/>,'admin.rag':<RagPipelinePage/>,
    'admin.llm':<LlmManagePage/>,
    'admin.trust':<TrustManagePage/>,
    'admin.history':<UsageHistoryPage/>,'admin.satisfaction':<SatisfactionMgmtPage/>,
    'admin.stats':<UsageStatsPage/>,'admin.logs':<AccessLogPage/>,'admin.quality':<QualityManagementPage/>,
    'admin.announce':<AnnouncementPage/>,'admin.monitor':<SystemMonitorPage/>,
    'admin.infostats':<InfoServiceStatsPage/>,'admin.content':<ContentMgmtPage/>,'admin.accesssec':<AccessSecurityPage/>,
    'admin.worklog':<WorkLogPage/>,'admin.usagemon':<UsageMonitorPage/>,'admin.apiprompt':<ApiPromptPage/>,
    'admin.hrsync':<HrSyncPage/>,'admin.connectedmon':<ConnectedMonitorPage/>,
    'user.page':<UserPage/>,
  };

  return (
    <ToastProvider>
    <div className="flex h-screen bg-gray-50 text-gray-800" style={{fontFamily:'"NanumSquareNeo","Pretendard",-apple-system,BlinkMacSystemFont,"Malgun Gothic",sans-serif'}}>
      {/* Sidebar */}
      <div className="w-60 bg-white flex flex-col h-full border-r border-gray-200 shrink-0 shadow-sm">
        <div className="px-5 py-4 flex items-center space-x-3 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-sm backdrop-blur-sm">G</div>
          <div>
            <div className="text-[15px] font-black tracking-tight text-white leading-tight">GenOS</div>
            <div className="text-[9px] font-bold tracking-widest text-blue-100 uppercase">Admin Console</div>
          </div>
        </div>
        <div className="flex-1 py-2 overflow-y-auto text-sm custom-scrollbar" style={{scrollbarWidth:'thin'}}>
          {menu.map(item=>
            item.section
              ? <div key={item.id} className="px-4 pt-5 pb-1.5 flex items-center gap-2">
                  <div className="flex-1 h-px bg-gray-100"/>
                  <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase whitespace-nowrap">{item.label}</span>
                  <div className="flex-1 h-px bg-gray-100"/>
                </div>
              : <SidebarItem key={item.id} item={item} activeId={activeId} onNav={setActiveId}/>
          )}
        </div>
        <div className="border-t">
          <div onClick={()=> onSwitchToUser ? onSwitchToUser() : setActiveId('user.page')} className={`mx-2 my-2 flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-all ${activeId==='user.page'&&!onSwitchToUser?'bg-blue-50 text-blue-700 font-bold border-l-[3px] border-blue-600':'hover:bg-gray-50 text-gray-600'}`}>
            <Monitor size={16} className={activeId==='user.page'&&!onSwitchToUser?'text-blue-600':'text-gray-400'}/><span>사용자 포털</span>
          </div>
        </div>
        <div className="p-3 border-t">
          <div className="flex items-center space-x-2.5 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs font-bold shadow-sm">김</div>
            <div className="flex-1 min-w-0"><div className="text-sm font-bold truncate">김영빈·관리자</div><div className="text-xs text-gray-400 truncate">{orgName}</div></div>
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Top bar */}
        <div className="h-14 bg-white border-b shadow-sm flex items-center justify-end px-6 shrink-0 space-x-2">
          {onSwitchToUser && (
            <button onClick={onSwitchToUser} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors border border-blue-200 mr-1">
              <Monitor size={15}/> 사용자 포털 전환
            </button>
          )}
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><Columns size={18}/></button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><Settings size={18}/></button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg relative"><Bell size={18}/><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"/></button>
          <div className="flex items-center space-x-2 ml-3 pl-3 border-l text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-[10px] font-bold">김</div>
            <span>김영빈</span><ChevronDown size={14}/>
          </div>
        </div>
        <div className="flex-1 overflow-hidden bg-[#F8F9FA]">
          {pages[activeId] || (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Briefcase size={48} className="mb-4 text-gray-300"/><h3 className="text-lg font-medium">준비 중인 페이지입니다</h3><p className="text-sm mt-1 font-mono bg-gray-100 px-3 py-1 rounded">{activeId}</p>
            </div>
          )}
        </div>
      </main>
    </div>
    </ToastProvider>
  );
};

export default App;
