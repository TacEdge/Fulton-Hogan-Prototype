/* Shared interface primitives. The only place a status is turned into a class
   name, and the only place a status is allowed to appear without a written
   label beside it (it never is: every one of these carries text). */

import type { ReactNode } from "react";
import type { Health } from "@/domain/types";
import { HEALTH_LABEL } from "@/domain/status";
import {
  IconAlertOctagon,
  IconAlertTriangle,
  IconCheckCircle,
  IconClock,
  IconExternal,
} from "./icons";

export type MarkerState = Health | "stale";

export function healthClass(state: MarkerState): string {
  return `is-${state}`;
}

/** Shape as well as colour, so status survives a colour-blind reader and a
 *  bad projector. */
export function StatusIcon({ state, size = 18 }: { state: MarkerState; size?: number }) {
  const Component =
    state === "on-track"
      ? IconCheckCircle
      : state === "attention"
        ? IconAlertTriangle
        : state === "intervention"
          ? IconAlertOctagon
          : IconClock;
  return <Component size={size} className={`status-icon ${healthClass(state)}`} />;
}

export function StatusDot({ state, size = 9 }: { state: MarkerState; size?: number }) {
  return (
    <span
      className={`status-dot ${healthClass(state)}`}
      style={{ inlineSize: size, blockSize: size }}
      aria-hidden="true"
    />
  );
}

/** The stamp treatment: short, uppercase, tinted. Used once per panel header. */
export function StatusBadge({ state, label }: { state: MarkerState; label?: string }) {
  return <span className={`status-badge ${healthClass(state)}`}>{label ?? HEALTH_LABEL[state]}</span>;
}

/** The inline treatment: sentence case, dot plus text, used in lists. */
export function StatusPill({ state, label }: { state: MarkerState; label?: string }) {
  return (
    <span className={`status-pill ${healthClass(state)}`}>
      <StatusDot state={state} size={8} />
      {label ?? HEALTH_LABEL[state]}
    </span>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return <span className="chip">{children}</span>;
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
      <span className="field-label">{label}</span>
      <span className="field-value">{children}</span>
    </div>
  );
}

/** A label and value on one line, divided by a hairline. The dense readout
 *  pattern used down the right of the project panel. */
export function ReadoutRow({
  label,
  children,
  icon,
}: {
  label: string;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="readout-row">
      <span className="readout-label">
        {icon}
        {label}
      </span>
      <span className="readout-value">{children}</span>
    </div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="section-title">
      <h3 className="u-eyebrow">{children}</h3>
      {action}
    </div>
  );
}

/** Actual and planned always appear together, with the variance written out in
 *  plain language. Performance is never communicated by colour alone. */
export function ProgressMeter({
  value,
  state,
}: {
  value: number;
  state: MarkerState | "planned";
}) {
  return (
    <div className="meter" role="img" aria-label={`${value} percent`}>
      <div className={`meter-fill ${state === "planned" ? "is-planned" : healthClass(state)}`} style={{ inlineSize: `${value}%` }} />
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
  icon,
  iconAfter,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "quiet";
  disabled?: boolean;
  title?: string;
  full?: boolean;
  icon?: ReactNode;
  iconAfter?: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`btn btn-${variant}${full ? " btn-full" : ""}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {icon}
      <span>{children}</span>
      {iconAfter}
    </button>
  );
}

/** The conceptual link back to the system that holds the record. It is never
 *  live, and the button says so rather than implying an integration. */
export function OpenInSourceButton({ label, full }: { label: string; full?: boolean }) {
  return (
    <Button
      variant="secondary"
      full={full}
      disabled
      title={`Conceptual. This prototype has no integration to ${label}.`}
      iconAfter={<IconExternal size={16} />}
    >
      Open in {label}
    </Button>
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
