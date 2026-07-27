/* ============================================================================
   The operational status model
   ----------------------------------------------------------------------------
   One small, legible rule set. It exists so that projects run by different
   teams, on different contracts, in different systems, can sit on one map and
   mean the same thing.

   It is deliberately not a score. There is no weighting to argue about and no
   number to game. A project reads as the worst thing currently true about it,
   and the interface always shows which signal made that call.

   Freshness is assessed separately. Stale data is not a delivery judgement, it
   is a statement that the picture cannot be trusted yet, so the map greys the
   marker and keeps the last known health in the count.
   ========================================================================== */

import type {
  Dimension,
  Freshness,
  Health,
  IssueCategory,
  MilestoneConfidence,
  Project,
  Severity,
  Signal,
  SignalState,
} from "./types";

/** Hours after which a reading is ageing, then stale. Demonstration thresholds. */
export const FRESHNESS_THRESHOLDS = { ageing: 24, stale: 72 } as const;

export function freshnessOf(ageHours: number): Freshness {
  if (ageHours >= FRESHNESS_THRESHOLDS.stale) return "stale";
  if (ageHours >= FRESHNESS_THRESHOLDS.ageing) return "ageing";
  return "current";
}

/** Delivery signals only. Freshness is assessed on its own axis: a project
 *  whose data has gone quiet is not thereby a project in trouble. */
function deliverySignals(signals: Signal[]): Signal[] {
  return signals.filter((s) => s.dimension !== "data-freshness");
}

/** Worst-of across the delivery signals. `act` beats `watch` beats `ok`. */
export function healthOf(signals: Signal[]): Health {
  const delivery = deliverySignals(signals);
  if (delivery.some((s) => s.state === "act")) return "intervention";
  if (delivery.some((s) => s.state === "watch")) return "attention";
  return "on-track";
}

/** The signals that decided the health, in the order the panel should show them. */
export function drivingSignals(signals: Signal[]): Signal[] {
  const health = healthOf(signals);
  const target: SignalState = health === "intervention" ? "act" : health === "attention" ? "watch" : "ok";
  return deliverySignals(signals).filter((s) => s.state === target);
}

const RANK: Record<SignalState, number> = { act: 0, watch: 1, unknown: 2, ok: 3 };

export function bySeverityThenDimension(a: Signal, b: Signal): number {
  return RANK[a.state] - RANK[b.state] || a.dimension.localeCompare(b.dimension);
}

/* ---- Project-level derivation -------------------------------------------- */

export interface ProjectStatus {
  health: Health;
  freshness: Freshness;
  /** What the map should paint. Stale projects paint grey. */
  markerState: Health | "stale";
  variance: number;
  drivers: Signal[];
  /** One sentence explaining the call, for the panel. */
  rationale: string;
}

export function statusOf(project: Project): ProjectStatus {
  const health = healthOf(project.signals);
  const freshness = freshnessOf(project.dataAgeHours);
  const drivers = drivingSignals(project.signals).sort(bySeverityThenDimension);
  const variance = project.progressActual - project.progressPlanned;

  return {
    health,
    freshness,
    markerState: freshness === "stale" ? "stale" : health,
    variance,
    drivers,
    rationale: rationaleFor(health, freshness, drivers),
  };
}

function rationaleFor(health: Health, freshness: Freshness, drivers: Signal[]): string {
  if (freshness === "stale") {
    return "Data is not current. The status shown is the last known reading and is not being counted as verified.";
  }
  if (health === "on-track") {
    return "No signal is currently reading outside tolerance.";
  }
  const names = drivers.slice(0, 3).map((d) => d.label.toLowerCase());
  const list =
    names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names[0];
  return health === "intervention"
    ? `Set by ${list}. One or more signals need a decision above project level.`
    : `Set by ${list}. Within the project team's control, but drifting.`;
}

/** Dimensions map onto issue categories so one vocabulary runs from the
 *  portfolio filter down to the individual issue. */
const DIMENSION_TO_CATEGORY: Record<Dimension, IssueCategory | null> = {
  "delivery-progress": "programme",
  "programme-confidence": "programme",
  quality: "quality",
  safety: "safety",
  commercial: "commercial",
  approvals: "approvals",
  constraints: "constraints",
  "data-freshness": null,
};

/** The categories a project currently has something to say about. A category
 *  counts only when its signal is reading outside tolerance. */
export function issueCategoriesOf(project: Project): IssueCategory[] {
  const found = new Set<IssueCategory>();
  for (const signal of project.signals) {
    if (signal.state !== "watch" && signal.state !== "act") continue;
    const category = DIMENSION_TO_CATEGORY[signal.dimension];
    if (category) found.add(category);
  }
  return [...found];
}

/* ---- Portfolio rollup ----------------------------------------------------- */

export interface PortfolioSummary {
  active: number;
  onTrack: number;
  attention: number;
  intervention: number;
  dataNotCurrent: number;
  openIssues: number;
  overdueActions: number;
}

export function summarise(projects: Project[]): PortfolioSummary {
  const summary: PortfolioSummary = {
    active: projects.length,
    onTrack: 0,
    attention: 0,
    intervention: 0,
    dataNotCurrent: 0,
    openIssues: 0,
    overdueActions: 0,
  };

  for (const project of projects) {
    const status = statusOf(project);
    if (status.health === "on-track") summary.onTrack += 1;
    else if (status.health === "attention") summary.attention += 1;
    else summary.intervention += 1;
    if (status.freshness === "stale") summary.dataNotCurrent += 1;
    summary.openIssues += project.openIssues;
    summary.overdueActions += project.overdueActions;
  }

  return summary;
}

/* ---- Presentation vocabulary ---------------------------------------------- */

export const HEALTH_LABEL: Record<Health | "stale", string> = {
  "on-track": "On track",
  attention: "Attention required",
  intervention: "Intervention required",
  stale: "Data not current",
};

export const HEALTH_SHORT: Record<Health | "stale", string> = {
  "on-track": "On track",
  attention: "Attention",
  intervention: "Intervention",
  stale: "Not current",
};

export const SIGNAL_LABEL: Record<SignalState, string> = {
  ok: "Within tolerance",
  watch: "Watch",
  act: "Act",
  unknown: "No reading",
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
  critical: "Critical",
};

/** Severity maps onto the same three-colour vocabulary as project health, so a
 *  red pin means the same thing everywhere in the interface. */
export const SEVERITY_HEALTH: Record<Severity, Health> = {
  low: "on-track",
  moderate: "attention",
  high: "attention",
  critical: "intervention",
};

export const CONFIDENCE_LABEL: Record<MilestoneConfidence, string> = {
  "on-track": "On track",
  "at-risk": "At risk",
  missed: "Missed",
};

export const CONFIDENCE_HEALTH: Record<MilestoneConfidence, Health> = {
  "on-track": "on-track",
  "at-risk": "attention",
  missed: "intervention",
};

export const DIMENSION_LABEL: Record<string, string> = {
  "delivery-progress": "Delivery progress",
  "programme-confidence": "Programme confidence",
  quality: "Quality",
  safety: "Safety",
  commercial: "Commercial",
  approvals: "Approvals",
  constraints: "Constraints",
  "data-freshness": "Data freshness",
};

/* ---- Formatting ----------------------------------------------------------- */

export function formatAge(hours: number): string {
  if (hours < 1) return "Minutes ago";
  if (hours < 24) return `${Math.round(hours)} hours ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}

export function formatVariance(variance: number): string {
  if (variance === 0) return "On programme";
  const magnitude = Math.abs(Math.round(variance));
  return variance < 0 ? `${magnitude}% behind` : `${magnitude}% ahead`;
}
