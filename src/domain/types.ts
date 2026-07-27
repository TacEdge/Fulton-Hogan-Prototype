/* ============================================================================
   Domain types for the operational picture
   ----------------------------------------------------------------------------
   The prototype models a thin layer: enough of a common status shape to make
   projects comparable on one map, and nothing that would duplicate a system of
   record. Anything a real deployment would read from Maximo, ArcGIS, M-Field,
   Salesforce or a scheduling tool is represented here as a *signal* carrying
   the system it came from, never as a copy of that system's data model.
   ========================================================================== */

/** Where a piece of content in this prototype comes from.
 *  Kept on the data so the interface can be honest about what is real. */
export type Provenance =
  /** Terminology used publicly by Fulton Hogan, NZTA or the wider NZ industry. */
  | "terminology"
  /** A structure inferred for the prototype. Plausible, not asserted as fact. */
  | "inferred"
  /** Invented demonstration content. Names, numbers, dates, locations. */
  | "notional";

/** The four states a project or workfront can present on the map. */
export type Health = "on-track" | "attention" | "intervention";

/** Freshness is a separate axis from health. Stale data does not mean bad
 *  delivery, it means the picture cannot be trusted yet. */
export type Freshness = "current" | "ageing" | "stale";

/** How a single contributing signal reads. */
export type SignalState = "ok" | "watch" | "act" | "unknown";

/** The dimensions the status model assesses. Deliberately short. */
export type Dimension =
  | "delivery-progress"
  | "programme-confidence"
  | "quality"
  | "safety"
  | "commercial"
  | "approvals"
  | "constraints"
  | "data-freshness";

export type IssueCategory =
  | "programme"
  | "quality"
  | "safety"
  | "approvals"
  | "constraints"
  | "commercial"
  | "environmental";

export type Severity = "low" | "moderate" | "high" | "critical";

export type IssueStatus = "open" | "in-progress" | "awaiting-response" | "closed";

/** Progress state of a workfront. Drives the map fill. */
export type WorkState = "completed" | "active" | "planned" | "blocked" | "behind";

export type MilestoneConfidence = "on-track" | "at-risk" | "missed";

/* ---- Source systems ------------------------------------------------------ */

export interface SourceSystem {
  id: string;
  /** Display label, e.g. "Maximo". */
  label: string;
  /** What the system is authoritative for. */
  role: string;
  /** `named` systems are ones Fulton Hogan publicly runs. `generic` are role
   *  placeholders standing in for whichever product fills that role. */
  kind: "named" | "generic";
  provenance: Provenance;
  /** Always false in this prototype. No integration exists. */
  connected: false;
}

/* ---- Reference data ------------------------------------------------------ */

export interface Region {
  id: string;
  label: string;
  /** Natural Earth admin-1 name, used to match the boundary geometry. */
  boundaryName: string;
  provenance: Provenance;
}

export interface BusinessUnit {
  id: string;
  label: string;
  note: string;
  provenance: Provenance;
}

export interface ProjectType {
  id: string;
  label: string;
  provenance: Provenance;
}

/* ---- Signals ------------------------------------------------------------- */

/** One contributing reading behind a status. The interface always shows these
 *  on request, so a summary can never be mistaken for a black box. */
export interface Signal {
  id: string;
  dimension: Dimension;
  label: string;
  /** Short readable value, e.g. "12% behind programme". */
  value: string;
  state: SignalState;
  sourceSystemId: string;
  /** Age of the underlying reading, in hours. */
  ageHours: number;
  note?: string;
}

/* ---- Portfolio ----------------------------------------------------------- */

export interface Project {
  id: string;
  /** Short reference used in mono labels, e.g. "FH-1043". */
  reference: string;
  name: string;
  regionId: string;
  businessUnitId: string;
  typeId: string;
  /** Freeform context line: contract, network or client framing. */
  contract: string;
  projectManager: string;
  operationsManager: string;
  /** [lng, lat] */
  position: [number, number];
  progressActual: number;
  progressPlanned: number;
  currentWorkfront: string;
  openIssues: number;
  overdueActions: number;
  nextMilestone: string;
  nextMilestoneDate: string;
  milestoneConfidence: MilestoneConfidence;
  /** Hours since the last signal refresh across the project's sources. */
  dataAgeHours: number;
  signals: Signal[];
  /** Set on the one project that has a detailed spatial view. */
  hasDetailView?: boolean;
}

/* ---- Project detail ------------------------------------------------------ */

export interface Workfront {
  id: string;
  reference: string;
  name: string;
  state: WorkState;
  progressActual: number;
  progressPlanned: number;
  crew: string;
  /** Human location description, e.g. "RP 8.4 to RP 9.1". */
  extent: string;
  summary: string;
  /** Polygon ring, [lng, lat] pairs. */
  ring: [number, number][];
  /** Label anchor, [lng, lat]. */
  labelAt: [number, number];
  issueIds: string[];
}

export interface Evidence {
  id: string;
  label: string;
  kind: "photo" | "survey" | "test-result" | "field-report";
  capturedAt: string;
  capturedBy: string;
  sourceSystemId: string;
  position: [number, number];
  workfrontId?: string;
  caption: string;
}

export interface Milestone {
  id: string;
  label: string;
  date: string;
  confidence: MilestoneConfidence;
  position: [number, number];
  note: string;
}

export interface Issue {
  id: string;
  reference: string;
  title: string;
  category: IssueCategory;
  severity: Severity;
  status: IssueStatus;
  position: [number, number];
  /** Location in the project's own reference frame. */
  locationLabel: string;
  workfrontId: string;
  owner: string;
  ownerRole: string;
  identifiedOn: string;
  daysOpen: number;
  programmeImpact: string;
  costImpact?: string;
  latestUpdate: string;
  latestUpdateAt: string;
  nextAction: string;
  actionOwner: string;
  dueDate: string;
  overdue: boolean;
  evidenceIds: string[];
  sourceSystemId: string;
  /** The reference this issue carries in its source system. */
  sourceReference: string;
}

export interface ProjectDetail {
  projectId: string;
  /** Project boundary ring, [lng, lat] pairs. */
  boundary: [number, number][];
  /** Corridor or spine geometry, [lng, lat] pairs. */
  centreline: [number, number][];
  centrelineLabel: string;
  /** Where the map should sit when the project opens. */
  view: { center: [number, number]; zoom: number; bearing: number };
  workfronts: Workfront[];
  issues: Issue[];
  milestones: Milestone[];
  evidence: Evidence[];
  /** Context features drawn under the work, so the corridor reads as a place. */
  context: { id: string; kind: "river" | "rail" | "side-road"; label: string; path: [number, number][] }[];
}
