/* ================================================================== */
/* 라이브 데이터 엔진 — 팩 liveMetric 설정으로 구동되는 시뮬레이션 틱   */
/* 순수 함수로 분리: UI 없이도 장시간 거동(고착 없음)을 검증 가능       */
/*                                                                    */
/* 팩 스키마 (liveMetric — 선택, 생략 시 라이브 카드·실시간 알림 비활성) */
/*   label, unit, decimals, source: 표시용                            */
/*   initial, min, max, window: 초기값·표시 범위·스파크라인 길이       */
/*   threshold, thresholdLabel: 임계값 (상향 돌파 시 alert 발화)        */
/*   drift: 초당 기저 상승량 / noise: 랜덤 워크 진폭                   */
/*   recovery: { at, to } — at 도달 시 to로 리셋 (조치 서사 + 고착 방지) */
/*   alert: { severity, title, body('{value}' 치환), link:{agentId} }  */
/* ================================================================== */

export function initLive(cfg) {
  const n = cfg.window || 48;
  return {
    value: cfg.initial,
    series: Array(n).fill(cfg.initial),
    above: cfg.initial >= cfg.threshold,
    crossings: 0,   // 임계 상향 돌파 누적 (검증·데모 지표)
    simSeconds: 0,  // 경과 시뮬레이션 시간
  };
}

/* dt = 이번 스텝이 나타내는 시뮬레이션 초 (배속 = 실제 1초당 dt) */
export function stepLive(state, cfg, dt = 1) {
  let v = state.value + cfg.drift * dt + (Math.random() - 0.5) * cfg.noise * Math.sqrt(dt);
  let recovered = false;
  if (cfg.recovery && v >= cfg.recovery.at) { v = cfg.recovery.to; recovered = true; }
  v = Math.min(cfg.max, Math.max(cfg.min, v));
  const above = v >= cfg.threshold;
  const crossed = above && !state.above; // 상향 돌파 순간에만 true
  return {
    next: {
      value: v,
      series: [...state.series.slice(1), v],
      above,
      crossings: state.crossings + (crossed ? 1 : 0),
      simSeconds: state.simSeconds + dt,
    },
    crossed,
    recovered,
  };
}

/* 알림 본문 생성 — body의 '{value}'를 현재 값으로 치환 */
export function liveAlertOf(cfg, value, id) {
  return {
    id,
    severity: cfg.alert.severity || "alert",
    title: cfg.alert.title,
    body: cfg.alert.body.replace("{value}", value.toFixed(cfg.decimals ?? 1)),
    time: "방금",
    link: cfg.alert.link,
  };
}
