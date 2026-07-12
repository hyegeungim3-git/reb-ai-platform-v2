/**
 * 도메인 팩 레지스트리
 * 코어 플랫폼(RootApp/UserApp)은 이 레지스트리를 통해서만 도메인 콘텐츠에 접근한다.
 * 새 도메인 추가 = 팩 파일 1개 작성 + 여기 등록이 전부여야 한다.
 */
import reb from "./reb.js";
import manufacturing from "./manufacturing.js";
import civic from "./civic.js";

export const DOMAINS = {
  [reb.id]: reb,
  [manufacturing.id]: manufacturing,
  [civic.id]: civic,
};

export const DOMAIN_LIST = [reb, manufacturing, civic];

const STORAGE_KEY = "genos.activeDomain";

export function getActiveDomainId() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved && DOMAINS[saved] ? saved : reb.id;
  } catch {
    return reb.id;
  }
}

export function setActiveDomainId(id) {
  try { localStorage.setItem(STORAGE_KEY, id); } catch { /* 저장 실패 시 세션 한정 동작 */ }
}

/** 도메인 팩의 카탈로그 오버라이드를 기본 AGENT_TEAMS 위에 병합 */
export function mergeAgentTeams(baseTeams, domain) {
  const overrides = domain?.agentCatalog || {};
  return baseTeams.map(a => ({ ...a, ...(overrides[a.id] || {}) }));
}

export default DOMAINS;
