/* ============================================================================
   Featured project detail: SH73 Ōtira Gorge Resilience Package
   ----------------------------------------------------------------------------
   SH73 through the Ōtira Gorge is a real state highway in a real place, and
   the corridor is drawn approximately where it runs. Everything else on this
   page is notional: the package, the workfronts, the people, the issues, the
   percentages and the dates.

   Geometry is deliberately schematic. A live deployment would read workfront
   and asset geometry from ArcGIS rather than carry it here.
   ========================================================================== */

import type { Evidence, Issue, Milestone, ProjectDetail, Workfront } from "@/domain/types";

const centreline: [number, number][] = [
  [171.569, -42.832],
  [171.57, -42.839],
  [171.568, -42.845],
  [171.564, -42.851],
  [171.562, -42.857],
  [171.559, -42.863],
  [171.557, -42.869],
  [171.556, -42.875],
  [171.5575, -42.881],
  [171.561, -42.887],
  [171.565, -42.893],
  [171.568, -42.899],
];

/* The package boundary takes in the corridor and the slope catchments either
   side of it, which is why it is wider than the carriageway. */
const boundary: [number, number][] = [
  [171.539, -42.828],
  [171.586, -42.83],
  [171.59, -42.857],
  [171.58, -42.877],
  [171.588, -42.904],
  [171.56, -42.908],
  [171.539, -42.885],
  [171.533, -42.86],
];

const workfronts: Workfront[] = [
  {
    id: "wf-04",
    reference: "WF-04",
    name: "Northern retaining wall",
    state: "completed",
    progressActual: 100,
    progressPlanned: 100,
    crew: "Structures crew A",
    extent: "RP 4.1 to RP 5.6",
    summary:
      "Wall 1 constructed, backfilled and surfaced. Handed over to the network on 4 July. No open items.",
    ring: [
      [171.5636, -42.831],
      [171.5744, -42.8316],
      [171.5734, -42.8462],
      [171.5626, -42.8456],
    ],
    labelAt: [171.5685, -42.8386],
    issueIds: [],
  },
  {
    id: "wf-02",
    reference: "WF-02",
    name: "Culvert and drainage renewals",
    state: "behind",
    progressActual: 55,
    progressPlanned: 72,
    crew: "Civil crew B",
    extent: "RP 6.8 to RP 8.2",
    summary:
      "Six of eleven culverts replaced. Precast delivery for culverts 7 to 9 has slipped and the approved traffic management plan runs out before the closure sequence finishes.",
    ring: [
      [171.5586, -42.85],
      [171.5694, -42.8512],
      [171.5644, -42.8642],
      [171.5536, -42.863],
    ],
    labelAt: [171.5615, -42.857],
    issueIds: ["iss-03", "iss-04"],
  },
  {
    id: "wf-01",
    reference: "WF-01",
    name: "Slope stabilisation, Ōtira bluff face",
    state: "blocked",
    progressActual: 38,
    progressPlanned: 61,
    crew: "Specialist ground crew",
    extent: "RP 8.4 to RP 9.1",
    summary:
      "Anchoring stopped at row 6. The revised anchor pattern has not been accepted, and the panel 4 shotcrete non-conformance is unresolved. No productive work is possible on this front.",
    ring: [
      [171.5506, -42.8672],
      [171.5626, -42.868],
      [171.5618, -42.8768],
      [171.5498, -42.876],
    ],
    labelAt: [171.5562, -42.872],
    issueIds: ["iss-01", "iss-02"],
  },
  {
    id: "wf-05",
    reference: "WF-05",
    name: "Rockfall netting, upper gorge",
    state: "planned",
    progressActual: 0,
    progressPlanned: 0,
    crew: "Specialist ground crew",
    extent: "RP 9.4 to RP 10.2",
    summary:
      "Not yet started. Sequenced to follow the slope face. Start date depends on the anchor pattern approval clearing WF-01.",
    ring: [
      [171.552, -42.8798],
      [171.5628, -42.8806],
      [171.5664, -42.8878],
      [171.5556, -42.887],
    ],
    labelAt: [171.5592, -42.8838],
    issueIds: [],
  },
  {
    id: "wf-03",
    reference: "WF-03",
    name: "Pavement and surfacing, southern approach",
    state: "active",
    progressActual: 71,
    progressPlanned: 70,
    crew: "Surfacing crew C",
    extent: "RP 10.6 to RP 12.0",
    summary:
      "Progressing to programme. Basecourse complete over the full length, first coat seal running from the southern end.",
    ring: [
      [171.5596, -42.892],
      [171.5704, -42.8926],
      [171.5734, -42.9],
      [171.5626, -42.8994],
    ],
    labelAt: [171.5665, -42.896],
    issueIds: [],
  },
];

const issues: Issue[] = [
  {
    id: "iss-01",
    reference: "ISS-0214",
    title: "Anchor pattern revision C not accepted",
    category: "approvals",
    severity: "critical",
    status: "awaiting-response",
    position: [171.5566, -42.8712],
    locationLabel: "SH73 · RP 8.62 · bluff face, rows 6 to 11",
    workfrontId: "wf-01",
    owner: "J. Ellery",
    ownerRole: "Design lead",
    identifiedOn: "2026-07-15",
    daysOpen: 12,
    programmeImpact:
      "Blocks the slope face front and the rockfall netting behind it. Two weeks of float already consumed.",
    costImpact: "Specialist crew standing by on site. Standing time accruing since 22 July.",
    latestUpdate:
      "Revision C issued 15 July with the reduced anchor spacing. PS4 and MSQA acceptance are both still outstanding. Design lead is chasing the reviewer.",
    latestUpdateAt: "2026-07-27T14:10:00+12:00",
    nextAction: "Escalate to the MSQA provider for a dated acceptance, or agree a partial release for rows 6 to 8.",
    actionOwner: "A. Rutherford, Project Manager",
    dueDate: "2026-07-21",
    overdue: true,
    evidenceIds: ["ev-03"],
    sourceSystemId: "document-control",
    sourceReference: "RFI-0214 · DRW-SL-204 Rev C",
  },
  {
    id: "iss-02",
    reference: "NCR-0087",
    title: "Shotcrete thickness below specification, panel 4",
    category: "quality",
    severity: "high",
    status: "open",
    position: [171.5578, -42.8742],
    locationLabel: "SH73 · RP 8.81 · bluff face, panel 4",
    workfrontId: "wf-01",
    owner: "P. Duggan",
    ownerRole: "Quality lead",
    identifiedOn: "2026-07-16",
    daysOpen: 11,
    programmeImpact:
      "Holds the panel 4 to 6 sign-off. Does not stop the front on its own, but it must clear before the face can be closed out.",
    latestUpdate:
      "Cores taken 22 July confirm 68mm average against 90mm specified across a 9 square metre area. Remediation method submitted, not yet accepted.",
    latestUpdateAt: "2026-07-26T09:35:00+12:00",
    nextAction: "Agree the remediation method with the designer and reissue the inspection and test record.",
    actionOwner: "P. Duggan, Quality lead",
    dueDate: "2026-07-31",
    overdue: false,
    evidenceIds: ["ev-01", "ev-02"],
    sourceSystemId: "quality-system",
    sourceReference: "NCR-0087 · ITP-SL-04",
  },
  {
    id: "iss-03",
    reference: "CON-0041",
    title: "Traffic management plan expires before the closure window closes",
    category: "constraints",
    severity: "high",
    status: "open",
    position: [171.5612, -42.8586],
    locationLabel: "SH73 · RP 7.40 · full corridor closure limits",
    workfrontId: "wf-02",
    owner: "D. Kerei",
    ownerRole: "Site Traffic Management Specialist",
    identifiedOn: "2026-07-21",
    daysOpen: 6,
    programmeImpact:
      "The night closure sequence runs to 22 August. The approved plan expires 14 August, so the last four closures currently have no cover.",
    latestUpdate:
      "Revision C drafted and lodged for approval on 24 July. Turnaround on the previous revision was nine working days.",
    latestUpdateAt: "2026-07-27T07:50:00+12:00",
    nextAction: "Confirm the approval date with the network manager, or resequence the last four closures inside the current expiry.",
    actionOwner: "D. Kerei, STMS",
    dueDate: "2026-08-07",
    overdue: false,
    evidenceIds: ["ev-04"],
    sourceSystemId: "m-field",
    sourceReference: "TMP-1188 Rev B",
  },
  {
    id: "iss-04",
    reference: "WO-448213",
    title: "Precast culvert delivery slipped two weeks",
    category: "programme",
    severity: "moderate",
    status: "in-progress",
    position: [171.5598, -42.8618],
    locationLabel: "SH73 · RP 7.71 · culverts 7 to 9",
    workfrontId: "wf-02",
    owner: "L. Moana",
    ownerRole: "Site engineer",
    identifiedOn: "2026-07-18",
    daysOpen: 9,
    programmeImpact:
      "Culverts 7 to 9 move from the first closure block to the second. Drives most of the 17% variance on this front.",
    costImpact: "Additional traffic management for one extra closure block.",
    latestUpdate:
      "Supplier confirmed 6 August for units 7 and 8, 13 August for unit 9. Crew resequenced onto headwalls in the meantime.",
    latestUpdateAt: "2026-07-25T16:20:00+12:00",
    nextAction: "Confirm the resequenced closure block with the network manager and reissue the three-week lookahead.",
    actionOwner: "L. Moana, Site engineer",
    dueDate: "2026-08-04",
    overdue: false,
    evidenceIds: ["ev-05"],
    sourceSystemId: "maximo",
    sourceReference: "WO-448213",
  },
];

const milestones: Milestone[] = [
  {
    id: "ms-01",
    label: "Slope face anchoring complete",
    date: "2026-08-09",
    confidence: "at-risk",
    position: [171.5512, -42.8662],
    note: "Cannot start recovering until the anchor pattern is accepted.",
  },
  {
    id: "ms-02",
    label: "Southbound lane reinstatement",
    date: "2026-08-21",
    confidence: "at-risk",
    position: [171.5688, -42.8524],
    note: "Contract milestone. Float exhausted. Depends on both the slope face and the culvert front.",
  },
  {
    id: "ms-03",
    label: "Corridor handover",
    date: "2026-10-16",
    confidence: "on-track",
    position: [171.5722, -42.8916],
    note: "Unaffected so far. Six weeks of float remain behind it.",
  },
];

const evidence: Evidence[] = [
  {
    id: "ev-01",
    label: "Panel 4 face, post-spray",
    kind: "photo",
    capturedAt: "2026-07-26T08:12:00+12:00",
    capturedBy: "Specialist ground crew",
    sourceSystemId: "m-field",
    position: [171.5582, -42.8746],
    workfrontId: "wf-01",
    caption: "Sprayed face at panel 4 showing the thin section along the upper right quadrant.",
  },
  {
    id: "ev-02",
    label: "Core thickness results, panel 4",
    kind: "test-result",
    capturedAt: "2026-07-22T15:40:00+12:00",
    capturedBy: "Testing laboratory",
    sourceSystemId: "quality-system",
    position: [171.5574, -42.8738],
    workfrontId: "wf-01",
    caption: "Six cores. Average 68mm against 90mm specified.",
  },
  {
    id: "ev-03",
    label: "Bluff face survey scan",
    kind: "survey",
    capturedAt: "2026-07-14T11:05:00+12:00",
    capturedBy: "Survey team",
    sourceSystemId: "arcgis",
    position: [171.5556, -42.8702],
    workfrontId: "wf-01",
    caption: "Face scan used to set the revised anchor spacing in revision C.",
  },
  {
    id: "ev-04",
    label: "Night closure shift report",
    kind: "field-report",
    capturedAt: "2026-07-27T05:55:00+12:00",
    capturedBy: "Site Traffic Management Specialist",
    sourceSystemId: "m-field",
    position: [171.562, -42.8592],
    workfrontId: "wf-02",
    caption: "Closure 11 of 18. Records the plan revision in use and the expiry date.",
  },
  {
    id: "ev-05",
    label: "Culvert 6 excavation",
    kind: "photo",
    capturedAt: "2026-07-25T13:30:00+12:00",
    capturedBy: "Civil crew B",
    sourceSystemId: "m-field",
    position: [171.5588, -42.8608],
    workfrontId: "wf-02",
    caption: "Culvert 6 bedding complete. Units 7 to 9 not yet on site.",
  },
];

export const FEATURED_DETAIL: ProjectDetail = {
  projectId: "otira-gorge",
  boundary,
  centreline,
  centrelineLabel: "SH73",
  view: { center: [171.5615, -42.866], zoom: 12.6, bearing: 0 },
  workfronts,
  issues,
  milestones,
  evidence,
  context: [
    {
      id: "ctx-river",
      kind: "river",
      label: "Ōtira River",
      path: [
        [171.5745, -42.8255],
        [171.569, -42.837],
        [171.562, -42.848],
        [171.5555, -42.859],
        [171.5505, -42.87],
        [171.548, -42.88],
      ],
    },
    {
      id: "ctx-rail",
      kind: "rail",
      label: "Midland Line",
      path: [
        [171.572, -42.83],
        [171.5735, -42.842],
        [171.575, -42.854],
      ],
    },
    {
      id: "ctx-access",
      kind: "side-road",
      label: "Site access and laydown",
      path: [
        [171.56, -42.862],
        [171.566, -42.864],
        [171.57, -42.863],
      ],
    },
  ],
};

export const ISSUE_BY_ID = new Map(FEATURED_DETAIL.issues.map((i) => [i.id, i]));
export const WORKFRONT_BY_ID = new Map(FEATURED_DETAIL.workfronts.map((w) => [w.id, w]));
export const EVIDENCE_BY_ID = new Map(FEATURED_DETAIL.evidence.map((e) => [e.id, e]));
