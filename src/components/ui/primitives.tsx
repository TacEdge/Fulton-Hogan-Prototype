/* Shared interface primitives. Small, unopinionated, and the only place a
   status colour is turned into a class name. */

import type { ReactNode } from "react";
import type { Health } from "@/domain/types";
import { HEALTH_LABEL } from "@/domain/status";

export type MarkerState = Health | "stale";

export function healthClass(state: MarkerState): string {
  return `is-${state}`;
}

export function StatusDot({ state, size = 10 }: { state: MarkerState; size?: number }) {
  return (
    <span
      className={`status-dot ${healthClass(state)}`}
      style={{ inlineSize: size, blockSize: size }}
      aria-hidden="true"
    />
  );
}

export function HealthChip({ state, label }: { state: MarkerState; label?: string }) {
  return (
    <span className={`health-chip ${healthClass(state)}`}>
      <StatusDot state={state} size={8} />
      {label ?? HEALTH_LABEL[state]}
    </span>
  );
}

export function Chip({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "quiet" }) {
  return <span className={`chip chip-${tone}`}>{children}</span>;
}

export function Field({
  label,
  children,
  wide,
}: {
  label: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`field${wide ? " field-wide" : ""}`}>
      <span className="u-label field-label">{label}</span>
      <span className="field-value">{children}</span>
    </div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="section-title">
      <h3 className="u-label">{children}</h3>
      {action}
    </div>
  );
}

/** Actual against planned, on one bar. The planned position is a tick, not a
 *  second bar, so the eye reads the gap rather than two competing lengths. */
export function ProgressBar({
  actual,
  planned,
  state,
}: {
  actual: number;
  planned: number;
  state: MarkerState;
}) {
  return (
    <div className="progress">
      <div className="progress-track">
        <div className={`progress-fill ${healthClass(state)}`} style={{ inlineSize: `${actual}%` }} />
        <div className="progress-planned" style={{ insetInlineStart: `${planned}%` }} aria-hidden="true" />
      </div>
      <div className="progress-legend">
        <span className="u-num">{actual}% actual</span>
        <span className="u-num u-caption">{planned}% planned</span>
      </div>
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = "secondary",
  disabled,
  title,
  full,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "quiet";
  disabled?: boolean;
  title?: string;
  full?: boolean;
}) {
  return (
    <button
      type="button"
      className={`btn btn-${variant}${full ? " btn-full" : ""}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
}

/** A source-system attribution. Always carries the fact that nothing is wired
 *  up, because claiming an integration that does not exist is the one thing
 *  this prototype must never do. */
export function SourceTag({ label, compact }: { label: string; compact?: boolean }) {
  return (
    <span
      className={`source-tag${compact ? " is-compact" : ""}`}
      title={`${label} would be the authoritative source. No integration exists in this prototype.`}
    >
      <span className="source-tag-dot" aria-hidden="true" />
      {label}
      {compact ? null : <span className="source-tag-note">not connected</span>}
    </span>
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <p className="empty-note u-caption">{children}</p>;
}
