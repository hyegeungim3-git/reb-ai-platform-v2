export function cn(...classes) { return classes.filter(Boolean).join(" "); }

/* 도메인 팩 orchestration 필드 정규화 — 객체 1개(기존 팩 하위호환) 또는 배열(시나리오 여러 개) 모두 허용 */
export const orchList = (o) => (Array.isArray(o) ? o : o ? [o] : []);

/* 데이터 보안 등급 체계 (정보공개법 제9조 기반) */
export const SECURITY_LEVELS = {
  C: { label:"기밀", code:"C", bg:"bg-red-600",    text:"text-red-700",    border:"border-red-200",    light:"bg-red-50",    dot:"bg-red-500",    desc:"법률상 비밀 / 안보·국방·외교·국민 생명·안전",       fullDesc:"법률상 비밀·비공개 / 안보·국방·외교·국민 생명·안전과 직결" },
  S: { label:"민감", code:"S", bg:"bg-orange-500", text:"text-orange-700", border:"border-orange-200", light:"bg-orange-50", dot:"bg-orange-400", desc:"개인정보·경영비밀 등 비공개 정보",                   fullDesc:"개인·국가 이익 침해 가능한 비공개 정보 (개인정보·경영비밀 등)" },
  O: { label:"공개", code:"O", bg:"bg-green-600",  text:"text-green-700",  border:"border-green-200",  light:"bg-green-50",  dot:"bg-green-500",  desc:"기밀·민감 외 공개 가능한 정보",                     fullDesc:"기밀·민감 외 공개 가능한 모든 정보" },
};

import React from "react";
export const SecurityBadge = ({ level, size = "sm" }) => {
  const cfg = SECURITY_LEVELS[level] || { bg:"bg-slate-400", label:"미분류", code:"?" };
  const sz = size === "xs" ? "text-[8px] px-1.5 py-0.5"
           : size === "md" ? "text-[11px] px-2.5 py-1"
           : "text-[9px] px-1.5 py-0.5";
  return (
    <span className={`${cfg.bg} text-white ${sz} rounded font-black tracking-wide shrink-0 leading-none whitespace-nowrap`}>
      {cfg.label}({cfg.code})
    </span>
  );
};
