/* ============================================================================
   Reference data
   ----------------------------------------------------------------------------
   Every entry carries a provenance marker:

     terminology  Used publicly by Fulton Hogan, NZTA Waka Kotahi or the wider
                  New Zealand civil industry. Safe to treat as real language.
     inferred     A plausible structure assembled for the prototype. It is not
                  claimed to be Fulton Hogan's actual internal structure.
     notional     Invented demonstration content.

   The interface surfaces this distinction rather than hiding it. See README.
   ========================================================================== */

import type {
  BusinessUnit,
  IssueCategory,
  ProjectType,
  Region,
  SourceSystem,
} from "@/domain/types";

/* ---- Regions -------------------------------------------------------------- */
/* New Zealand's regions are public administrative geography. `boundaryName`
   matches the Natural Earth admin-1 feature that draws the outline. */

export const REGIONS: Region[] = [
  { id: "northland", label: "Northland", boundaryName: "Northland", provenance: "terminology" },
  { id: "auckland", label: "Auckland", boundaryName: "Auckland", provenance: "terminology" },
  { id: "waikato", label: "Waikato", boundaryName: "Waikato", provenance: "terminology" },
  { id: "bay-of-plenty", label: "Bay of Plenty", boundaryName: "Bay of Plenty", provenance: "terminology" },
  { id: "gisborne", label: "Tairāwhiti Gisborne", boundaryName: "Gisborne District", provenance: "terminology" },
  { id: "hawkes-bay", label: "Hawke's Bay", boundaryName: "Hawke's Bay", provenance: "terminology" },
  { id: "taranaki", label: "Taranaki", boundaryName: "Taranaki", provenance: "terminology" },
  { id: "manawatu-whanganui", label: "Manawatū-Whanganui", boundaryName: "Manawatu-Wanganui", provenance: "terminology" },
  { id: "wellington", label: "Wellington", boundaryName: "Wellington", provenance: "terminology" },
  { id: "nelson-tasman", label: "Nelson Tasman", boundaryName: "Tasman District", provenance: "terminology" },
  { id: "marlborough", label: "Marlborough", boundaryName: "Marlborough District", provenance: "terminology" },
  { id: "west-coast", label: "West Coast", boundaryName: "West Coast", provenance: "terminology" },
  { id: "canterbury", label: "Canterbury", boundaryName: "Canterbury", provenance: "terminology" },
  { id: "otago", label: "Otago", boundaryName: "Otago", provenance: "terminology" },
  { id: "southland", label: "Southland", boundaryName: "Southland", provenance: "terminology" },
];

export const REGION_BY_ID = new Map(REGIONS.map((r) => [r.id, r]));

/* ---- Business units ------------------------------------------------------- */
/* Inferred. Fulton Hogan's real internal unit names and boundaries are not
   published in the source material available to this prototype, so these are
   assembled from the kinds of work the business is publicly known to deliver. */

export const BUSINESS_UNITS: BusinessUnit[] = [
  {
    id: "network-delivery",
    label: "Network Delivery",
    note: "State highway network maintenance and renewals delivered under an Integrated Delivery Contract.",
    provenance: "inferred",
  },
  {
    id: "civil-construction",
    label: "Civil Construction",
    note: "Capital works: structures, earthworks and corridor upgrades.",
    provenance: "inferred",
  },
  {
    id: "infrastructure-services",
    label: "Infrastructure Services",
    note: "Three waters, utilities and underground services.",
    provenance: "inferred",
  },
  {
    id: "surfacing",
    label: "Surfacing and Asphalt",
    note: "Resurfacing, chipseal and asphalt production and laying.",
    provenance: "inferred",
  },
  {
    id: "quarries",
    label: "Quarries and Aggregates",
    note: "Extraction, processing and supply of aggregate.",
    provenance: "inferred",
  },
];

export const BUSINESS_UNIT_BY_ID = new Map(BUSINESS_UNITS.map((b) => [b.id, b]));

/* ---- Project types -------------------------------------------------------- */

export const PROJECT_TYPES: ProjectType[] = [
  { id: "roads", label: "Roads", provenance: "terminology" },
  { id: "structures", label: "Structures", provenance: "terminology" },
  { id: "water", label: "Water", provenance: "terminology" },
  { id: "utilities", label: "Utilities", provenance: "terminology" },
  { id: "earthworks", label: "Earthworks", provenance: "terminology" },
  { id: "maintenance", label: "Maintenance", provenance: "terminology" },
  { id: "surfacing", label: "Surfacing", provenance: "terminology" },
  { id: "civil-infrastructure", label: "Civil infrastructure", provenance: "terminology" },
  { id: "specialist", label: "Specialist construction", provenance: "terminology" },
];

export const PROJECT_TYPE_BY_ID = new Map(PROJECT_TYPES.map((t) => [t.id, t]));

/* ---- Source systems ------------------------------------------------------- */
/* The four `named` systems are ones Fulton Hogan is publicly known to run.
   They appear here as sources the operational picture would read from. No
   integration is built, and every one of them is marked `connected: false`.
   The `generic` entries stand in for whichever product fills that role. */

export const SOURCE_SYSTEMS: SourceSystem[] = [
  {
    id: "maximo",
    label: "Maximo",
    role: "Asset management. Work orders, assets and maintenance history.",
    kind: "named",
    provenance: "terminology",
    connected: false,
  },
  {
    id: "arcgis",
    label: "ArcGIS",
    role: "Spatial and asset layer. Where network assets live geographically.",
    kind: "named",
    provenance: "terminology",
    connected: false,
  },
  {
    id: "m-field",
    label: "M-Field",
    role: "Field application. Plant prestarts and field reporting.",
    kind: "named",
    provenance: "terminology",
    connected: false,
  },
  {
    id: "salesforce",
    label: "Salesforce",
    role: "In-house application platform. Task-specific field and office apps.",
    kind: "named",
    provenance: "terminology",
    connected: false,
  },
  {
    id: "project-controls",
    label: "Project Controls",
    role: "Progress claims, earned value and programme reporting.",
    kind: "generic",
    provenance: "inferred",
    connected: false,
  },
  {
    id: "scheduling",
    label: "Scheduling",
    role: "Baseline and current programme, critical path and float.",
    kind: "generic",
    provenance: "inferred",
    connected: false,
  },
  {
    id: "quality-system",
    label: "Quality System",
    role: "Non-conformance reports, inspection and test plans, hold points.",
    kind: "generic",
    provenance: "inferred",
    connected: false,
  },
  {
    id: "safety-system",
    label: "Safety System",
    role: "Events, observations, corrective actions and site safety documents.",
    kind: "generic",
    provenance: "inferred",
    connected: false,
  },
  {
    id: "document-control",
    label: "Document Control",
    role: "Drawing revisions, RFIs, producer statements and approvals.",
    kind: "generic",
    provenance: "inferred",
    connected: false,
  },
  {
    id: "financial-system",
    label: "Financial System",
    role: "Cost to date, forecast and commitment.",
    kind: "generic",
    provenance: "inferred",
    connected: false,
  },
];

export const SOURCE_SYSTEM_BY_ID = new Map(SOURCE_SYSTEMS.map((s) => [s.id, s]));

export function sourceLabel(id: string): string {
  return SOURCE_SYSTEM_BY_ID.get(id)?.label ?? "Unknown source";
}

/* ---- Issue categories ----------------------------------------------------- */

export const ISSUE_CATEGORIES: { id: IssueCategory; label: string; note: string }[] = [
  { id: "programme", label: "Programme", note: "Sequence, duration, resource or dependency slippage." },
  { id: "quality", label: "Quality", note: "Non-conformance, failed test, unresolved hold point." },
  { id: "safety", label: "Safety", note: "Event, hazard or unresolved control." },
  { id: "approvals", label: "Approvals", note: "Design, consent or producer statement not yet granted." },
  { id: "constraints", label: "Constraints", note: "Access, traffic management, environmental window, third party." },
  { id: "commercial", label: "Commercial", note: "Variation, claim or cost exposure." },
  { id: "environmental", label: "Environmental", note: "Consent condition, discharge, sediment or ecology." },
];

export const ISSUE_CATEGORY_BY_ID = new Map(ISSUE_CATEGORIES.map((c) => [c.id, c]));

/* ---- Glossary -------------------------------------------------------------- */
/* Industry terms the interface uses. Shown in the "About this prototype"
   panel so a reader outside the sector can follow the demonstration. */

export const GLOSSARY: { term: string; expansion: string; note: string }[] = [
  {
    term: "IDM",
    expansion: "Integrated Delivery Model",
    note: "NZTA Waka Kotahi's operating model for the state highway network. NZTA owns asset management; contractors deliver the work.",
  },
  {
    term: "IDC",
    expansion: "Integrated Delivery Contract",
    note: "The contract a delivery partner holds for a network under IDM.",
  },
  {
    term: "AFWP",
    expansion: "Annual Forward Works Programme",
    note: "The baseline programme of work for a network. Delivery is measured against it.",
  },
  {
    term: "MSQA",
    expansion: "Management, Surveillance and Quality Assurance",
    note: "Professional services provider checking quality on the client's behalf.",
  },
  {
    term: "TMP",
    expansion: "Traffic Management Plan",
    note: "The approved plan for managing traffic at a worksite. Drafted by an STMS and approved before work starts.",
  },
  {
    term: "STMS",
    expansion: "Site Traffic Management Specialist",
    note: "The certified person accountable for traffic management at a worksite.",
  },
  {
    term: "CoPTTM",
    expansion: "Code of Practice for Temporary Traffic Management",
    note: "The national rulebook every TMP complies with.",
  },
  {
    term: "RP",
    expansion: "Route Position",
    note: "Distance in kilometres along a state highway route section. Used here to locate work and issues on the corridor.",
  },
  {
    term: "NCR",
    expansion: "Non-Conformance Report",
    note: "A raised record that delivered work does not meet specification.",
  },
  {
    term: "PS4",
    expansion: "Producer Statement — Construction Review",
    note: "A design engineer's statement that construction has been reviewed against the design.",
  },
];
