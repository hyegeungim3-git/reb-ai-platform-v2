# GenOS — 멀티 도메인 생성형 AI 플랫폼 데모

> **이 문서는 모든 AI 모델(Fable 5, Opus, Sonnet 등)과 세션의 공통 진입점이다.**
> 작업 시작 전 반드시 끝까지 읽고, 규모 있는 작업 후에는 이 문서의 "현재 상태"를 갱신하라.

## 1. 프로젝트 정체

- **본질**: 특정 조직 전용 데모가 아니라, **도메인(발주처)을 갈아끼울 수 있는 범용 AI 에이전트 플랫폼**.
  코어 플랫폼(도메인 중립)과 도메인 팩(콘텐츠)의 2층 구조를 절대 무너뜨리지 말 것.
- **스택**: React 19 + Vite 7 + Tailwind CSS v4. 백엔드 없음 — 모든 AI 응답은 mock 시뮬레이션.
- **구성**: 포털 선택(RootApp) → 사용자 포털(UserApp: 일반/에이전트/보안 3탭, 10개 에이전트) + 관리자 시스템(App: 45개 페이지).

## 2. 배포 (역할을 혼동하지 말 것)

| 역할 | 주소 | 저장소 |
|---|---|---|
| **개발 진행본 (push 대상)** | https://hyegeungim3-git.github.io/reb-ai-platform-v2/ | origin = reb-ai-platform-v2 |
| v2.0 스냅샷 (동결, push 금지) | https://hyegeungim3-git.github.io/reb-ai-platform/ | remote명 snapshot |
| v1.0 안정 버전 | https://hyegeungim3-git.github.io/genos-app/ | genos-app |

- `main` push 시 GitHub Actions로 자동 배포. 배포 확인: `gh run watch <id> --exit-status`
- 실패한 런은 `rerun --failed` 금지(아티팩트 중복) — 새 런을 실행할 것.

## 3. 아키텍처 — 도메인 팩 시스템

```
src/
├── domains/            ← 도메인 팩 (콘텐츠 계층)
│   ├── index.js        ← 레지스트리 + localStorage('genos.activeDomain') + mergeAgentTeams()
│   ├── _template.js    ← 새 팩 작성용 템플릿 (레지스트리 미등록)
│   ├── reb.js          ← 한국부동산원 (기본값)
│   ├── manufacturing.js← 한빛정밀 (제조)
│   └── civic.js        ← 한성시청 (공공행정)
├── RootApp.jsx         ← 포털 선택 + 도메인 스위처. domain을 UserApp/App에 prop으로 주입
├── UserApp.jsx         ← 컴포넌트 상단에서 도메인 프로파일을 상수로 주입(shadowing) 후 사용
├── App.jsx             ← 관리자 (5,900줄 모놀리식 — 분해 예정. 콘텐츠는 아직 REB 고정)
└── user/
    ├── data/constants.js  ← 도메인 중립 기본값 + MODES/MCP_TOOLS 등 코어 데이터
    ├── data/responses.js  ← REB용 AI 응답·문서 템플릿
    └── components/agents/ ← 10개 에이전트 (내부 mock은 아직 REB 고정)
```

- **새 도메인 추가 = 팩 파일 1개 + index.js 등록.** 코어 파일 수정이 필요해지면 설계 위반이니 먼저 코어를 일반화하라.
- 상세 작성법: **[docs/DOMAIN-PACK-GUIDE.md](docs/DOMAIN-PACK-GUIDE.md)** (스키마 전체 + 콘텐츠 품질 기준)
- 검수 절차: **[docs/QUALITY-CHECKLIST.md](docs/QUALITY-CHECKLIST.md)** (필수 — 완료 보고 전 실행)

## 4. 작업 규칙 (위반 시 실제 사고 이력 있음)

1. **파일 수정은 Edit 도구만.** PowerShell `-replace`/`Set-Content`는 한글 파일을 파괴한다.
   대량 치환은 Python(`io.open(..., encoding='utf-8')`)으로, 실행 후 스크립트 삭제.
2. git 커밋 메시지에 쌍따옴표(") 금지 — here-string `@'...'@` 사용 (닫는 `'@`는 줄 시작).
3. Bash 도구의 상대경로는 매 호출 초기화됨 — `cd /c/한국부동산원/genos-app && ...` 형태로.
4. **완료 = 빌드 통과 + 브라우저 DOM 검증 + 증거 제시.** "될 겁니다" 금지.
   - 빌드: `npx vite build` (2,381 모듈 기준)
   - 실행: 프리뷰 서버(.claude/launch.json `genos-app`). 포트는 launch.json상 5174이나 점유 시 5173 등으로 배정되므로 **시작 로그의 실제 포트를 따를 것**
   - DOM 검증이 스크린샷보다 우선. 검증 스크립트는 QUALITY-CHECKLIST.md 참조.
5. 하드코딩 금지 원칙: 조직·업무 콘텐츠를 코어 파일(UserApp/AgentHub/App)에 문자열로 넣지 말 것.
   도메인 팩 필드로 공급하고, 코어에는 REB 기본값 fallback만 남긴다.

## 5. 현재 상태 (2026-07-05)

- ✅ 1단계 P0: 관리자 KOGAS 잔재 제거(324건), 빈 mock·[TEST] 정리, 중복 마운트 제거, 미사용 로고·의존성 제거
- ✅ 2단계 기반: 도메인 팩 아키텍처(3팩), 포털 스위처, Claude Fable 5 플래그십 모델(보안 게이트웨이 서사)
- ✅ 2-A: App.jsx 5,935줄 → admin/(mocks.js + common.jsx + pages/12그룹) + 라우팅 223줄. 분해 중 잠복 버그 발견·수정(HrSyncPage Info 아이콘 미임포트 → HR 메뉴 클릭 시 관리자 전체 크래시였음)
- ✅ 2-B: useAgentSimulation 훅(src/user/hooks/)으로 8개 에이전트 시뮬레이션 통합, cn() 14곳 → utils.jsx 단일화
- ✅ 허브 13종 확장: 미사용이던 Translate·DocReview·SafetyPlan을 재등록 (agent-translate·agent-review·agent-safety, 도메인 팩 3곳 오버라이드 완비)
- ⬜ 2-C: UserApp 2,137줄 분해 (탭·패널·모달 단위 — 상태 얽힘이 커서 별도 세션 권장)
- ⬜ 도메인화 잔여(팩으로 미이관): ①에이전트 10종 내부 mock ②관리자 45페이지 콘텐츠 ③REVIEW/TRANSLATE/REPORT 모드 응답·공문서 템플릿(responses.js) ④FILE_DATA 인용 문서 ⑤SECURE_SUGGESTIONS
- ⬜ 3단계 신규: 지도 인텔리전스, 멀티에이전트 오케스트레이션 시나리오, AI 기본법 대시보드
- ⬜ 4단계 P2: 반응형(고정폭 사이드바), 접근성(aria 0건), 상태 유지, HISTORY 탭 구현

## 6. 도메인 상수 (혼동 주의)

- REB 사용자: 김민준 과장(부동산공시처) / 관리자 페르소나: 김영빈(AI활용 업무혁신 TF)
- 브랜드: REB #003087 / 한빛정밀 #0F766E / 한성시청 #166534
- 문서번호 체계: KREA-부동산공시처-2026-NNN (REB), HBP-·HSC- 접두 (타 도메인)
