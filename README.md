# 한국부동산원 AI 플랫폼 (REB AI Platform)

**한국부동산원 생성형 AI 플랫폼 데모 v2.0** — 사용자 포털 + 관리자 시스템 + 10개 AI 에이전트

> 🌐 **Live demo (v2.0)**: https://hyegeungim3-git.github.io/reb-ai-platform/
> 🔒 **v1.0 안정 버전**: https://hyegeungim3-git.github.io/genos-app/

---

## 주요 기능

### 사용자 포털 (User Portal)
- **GENERAL 탭** — 일반 질의응답, RAG 기반 지식 검색
- **AGENT 탭** — 10개 AI 에이전트 허브
  - 챗봇 / 보고서 작성 / 회의록 작성 / 내규 조회
  - OCR / 지식 검색 / DB 질의 / 주소 표준화
  - 데이터 분석 / 문서 요약
- **SECURE 탭** — 보안 채팅(무저장 · 로컬 LLM · 망분리 적용)

### 관리자 시스템 (Admin Console)
- 대시보드 (시스템 · GPU · 서비스 현황)
- 모델 학습 · 배포 · 서빙 파이프라인
- 에이전트 태스크플로우 빌더
- 사용자 관리 · 승인 · 통계 · 접근 로그

---

## v2.0 개선 사항 (v1.0 대비)

| 영역 | 개선 내용 |
|---|---|
| **성능** | RootApp · UserApp · 10개 에이전트 모두 lazy 로딩 → 초기 번들 크기 대폭 축소 |
| **정리** | 미사용 코드 제거 (`AdminChatApp.jsx`, `utils.js`, `dist-test/`, `App.css`) |
| **메타데이터** | `index.html`: 한국어 lang 속성, OpenGraph, title/description/favicon 적절히 적용 |
| **빌드** | `recharts` 별도 청크 분리, chunk size 경고 임계값 상향 |
| **로딩 UX** | Suspense 폴백 컴포넌트 추가 (스피너 + 안내) |
| **메타정보** | KOGAS 잔존 주석 정리, 모든 브랜딩 "한국부동산원"으로 통일 |

---

## 기술 스택

- **Frontend**: React 19.2 + Vite 7.3 + Tailwind CSS 4.1
- **Icons**: lucide-react
- **Charts**: recharts
- **PDF**: pdf-parse, pdfjs-dist
- **Font**: Pretendard, Noto Sans KR, NanumSquareNeo
- **Deploy**: GitHub Pages + GitHub Actions

---

## 로컬 실행

```bash
npm install
npm run dev      # http://localhost:5174
npm run build    # dist/ 빌드 산출
npm run preview  # dist 미리보기
```

---

## 디렉터리 구조

```
src/
├── main.jsx              # 진입점
├── RootApp.jsx           # 포털 선택 (User ↔ Admin)
├── UserApp.jsx           # 사용자 포털 (GENERAL/AGENT/SECURE 3탭)
├── App.jsx               # 관리자 시스템
├── user/
│   ├── utils.jsx         # cn(), SECURITY_LEVELS, SecurityBadge
│   ├── data/             # constants, responses (mock 데이터)
│   └── components/
│       ├── ApprovalModal, SelfCheckModal, Toast
│       └── agents/       # AgentHub + 10개 개별 에이전트
```

---

## 라이선스 · 면책

본 프로젝트는 한국부동산원 「AI 에이전트 플랫폼 구축 용역」 시연 데모로 제작되었습니다.
모든 데이터·로고·내용은 데모 목적이며, 실제 한국부동산원 서비스가 아닙니다.
