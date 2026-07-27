/* ============================================================================
   Source adapters: the integration seam
   ----------------------------------------------------------------------------
   This is where a real deployment would connect. Each adapter describes one
   source system, the small set of fields the operational picture would read
   from it, and how it would read them. None of them is implemented. Every
   adapter reports `status: "not-connected"` and every reading in this
   prototype is served by `demoAdapter`, which returns the static
   demonstration data in `src/data/`.

   The shape matters more than the implementation. It says what the layer is:
   a normaliser over a handful of fields per system, not a copy of those
   systems. The authoritative record stays where it is.
   ========================================================================== */

import type { Project, ProjectDetail } from "@/domain/types";
import { PROJECTS, PROJECT_BY_ID } from "@/data/portfolio";
import { FEATURED_DETAIL } from "@/data/featured";

export type AdapterStatus = "not-connected" | "connected";

export type Transport = "REST API" | "Event stream" | "Scheduled extract" | "Spatial service";

export interface SourceAdapter {
  sourceSystemId: string;
  /** The fields the picture would read. Deliberately short. */
  reads: string[];
  /** What the picture would never read, write or replace. */
  outOfScope: string;
  transport: Transport;
  /** How often a reading would refresh in a live deployment. */
  cadence: string;
  status: AdapterStatus;
}

export const SOURCE_ADAPTERS: SourceAdapter[] = [
  {
    sourceSystemId: "maximo",
    reads: ["Work order state", "Asset reference", "Planned and actual dates"],
    outOfScope: "Asset registry, maintenance history, work order authoring.",
    transport: "REST API",
    cadence: "Every 15 minutes",
    status: "not-connected",
  },
  {
    sourceSystemId: "arcgis",
    reads: ["Work extent geometry", "Asset location", "Network reference"],
    outOfScope: "Authoritative spatial data management, editing, publishing.",
    transport: "Spatial service",
    cadence: "On change",
    status: "not-connected",
  },
  {
    sourceSystemId: "m-field",
    reads: ["Shift and field report headers", "Constraint flags", "Evidence pointers"],
    outOfScope: "Prestarts, forms, field workflow. The field app stays the field app.",
    transport: "Event stream",
    cadence: "On submission",
    status: "not-connected",
  },
  {
    sourceSystemId: "salesforce",
    reads: ["Project register", "Ownership and responsibility"],
    outOfScope: "The application platform and every app built on it.",
    transport: "REST API",
    cadence: "Hourly",
    status: "not-connected",
  },
  {
    sourceSystemId: "project-controls",
    reads: ["Actual and planned progress", "Variance"],
    outOfScope: "Progress claims, earned value calculation, reporting packs.",
    transport: "Scheduled extract",
    cadence: "Daily",
    status: "not-connected",
  },
  {
    sourceSystemId: "scheduling",
    reads: ["Milestone dates", "Float", "Critical path flag"],
    outOfScope: "Programme authoring, logic, resourcing.",
    transport: "Scheduled extract",
    cadence: "Weekly, plus on reissue",
    status: "not-connected",
  },
  {
    sourceSystemId: "quality-system",
    reads: ["Open non-conformance count", "Hold point state", "Severity"],
    outOfScope: "Inspection and test plans, records, close-out evidence.",
    transport: "REST API",
    cadence: "On change",
    status: "not-connected",
  },
  {
    sourceSystemId: "safety-system",
    reads: ["Open corrective actions", "Overdue count"],
    outOfScope: "Event management, investigation, reporting obligations.",
    transport: "REST API",
    cadence: "On change",
    status: "not-connected",
  },
  {
    sourceSystemId: "document-control",
    reads: ["Approval state", "Days outstanding", "Document reference"],
    outOfScope: "The document register, revision control, distribution.",
    transport: "REST API",
    cadence: "On change",
    status: "not-connected",
  },
  {
    sourceSystemId: "financial-system",
    reads: ["Forecast against budget flag"],
    outOfScope: "Cost, rates, margin, commercial detail of any kind.",
    transport: "Scheduled extract",
    cadence: "Monthly",
    status: "not-connected",
  },
];

export const ADAPTER_BY_SOURCE = new Map(SOURCE_ADAPTERS.map((a) => [a.sourceSystemId, a]));

/* ---- The read model the interface consumes -------------------------------- */

export interface OperationalPicture {
  listProjects(): Project[];
  getProject(id: string): Project | undefined;
  getProjectDetail(id: string): ProjectDetail | undefined;
  /** Where the picture's content came from. Shown to the user, not hidden. */
  readonly mode: "demonstration" | "live";
}

/** The only implementation. Serves the static demonstration data. A live
 *  implementation would satisfy the same interface by fanning out across the
 *  adapters above and normalising what comes back. */
export const demoPicture: OperationalPicture = {
  mode: "demonstration",
  listProjects: () => PROJECTS,
  getProject: (id) => PROJECT_BY_ID.get(id),
  getProjectDetail: (id) => (id === FEATURED_DETAIL.projectId ? FEATURED_DETAIL : undefined),
};
