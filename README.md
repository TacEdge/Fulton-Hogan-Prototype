# Operational Picture — concept prototype by TACEDGE

**One map. Every project. The issues that matter now.**

A high-fidelity, clickable prototype of a thin geospatial visibility layer that
sits above the project systems an organisation already runs and presents one
shared operational picture: where projects are, how delivery is tracking, where
issues are concentrated, who owns them and what has to happen next.

The proposition it demonstrates:

> The existing systems remain authoritative. TACEDGE shows what their
> information collectively means.

**Everything on screen is demonstration data.** This is a concept prototype. It
is not commissioned, reviewed, approved or deployed by Fulton Hogan, and no
integration to any system exists.

---

## Running it

```bash
npm install
npm run dev          # http://localhost:5180
```

```bash
npm run build        # type-check, then production build to dist/
npm run preview      # serve the production build
npm run typecheck
```

Node 20 or newer. No API keys, no tile server, no database, no network access
required: the basemap is a small vector basemap carried in `public/geo/`.

### Hosted build

Pushing to this branch publishes to
<https://tacedge.github.io/Fulton-Hogan-Prototype/> via
`.github/workflows/deploy-pages.yml`. The site is served from a subdirectory, so
the workflow builds with `VITE_BASE=/Fulton-Hogan-Prototype/`; everything that
resolves an asset at runtime goes through `import.meta.env.BASE_URL`, so the
same source runs at a domain root without a change.

The page carries a web app manifest and `noindex`, so it installs to a phone or
desktop home screen as a standalone app and stays out of search results.
Obscurity, not access control: the URL is public to anyone who has it.

### Optional: LINZ Basemaps

The prototype can render on LINZ Basemaps, the New Zealand authoritative
imagery and topographic service, instead of the built-in basemap. Copy
`.env.example` to `.env` and set:

```
VITE_LINZ_API_KEY=<your LINZ Basemaps key>
VITE_BASEMAP=linz-topographic     # or linz-aerial
```

Without a key the prototype falls back to the local basemap and says so in the
console. The style is chosen once at boot.

---

## The 60-second walkthrough

1. **Portfolio.** Fifteen active projects on one national map. The headline
   strip answers how many are running, how many are on track, how many need
   attention, how many need intervention, and how many have stopped reporting.
   Marker size, colour and centre symbol all carry status, so the picture
   survives a colour-blind reader and a projector. The two projects needing a
   decision above project level are named on the map without being asked;
   everything else labels on hover, which is what keeps the national view
   readable.
2. **Select an amber project.** `SH73 Ōtira Gorge Resilience Package` opens a
   panel: progress against programme, variance, current workfront, open issues,
   overdue actions, next milestone and its confidence, accountability, and when
   the data last refreshed. Expand *Show signals* to see every reading behind
   the status, each with its own age and source system.
3. **View project.** The map moves from the country to the corridor. Completed,
   in-progress, behind, blocked and planned work are drawn where they are
   happening, with issues, milestones and evidence capture points on top. The
   layer tabs switch what the map is answering, each carrying its own count.
4. **Select an issue.** The map goes to the exact location. The panel leads with
   the required next action and its owner, then the location, the programme and
   cost impact, the latest update, the ownership, the evidence, and the source
   system that holds the authoritative record.

The whole path is one continuous map. There are no pages.

---

## What it deliberately is not

It is not a system of record and does not replace one. Financial systems, ERP,
Salesforce, health and safety, quality management, scheduling, BIM, GIS,
document control and field applications all stay where they are and stay
authoritative.

The layer does four things: aggregate a small number of status signals,
normalise them into one shape, show where progress and problems are, and link
back to the source when someone needs the detail.

Not built, and not intended to be built here: authentication, a live database,
enterprise APIs, real integrations, permissions, production security, or an
administrative environment.

---

## Conceptual integration model

Every source system in the interface is labelled, and every one of them reports
**not connected**. `src/services/adapters.ts` is the seam: one adapter per
system, describing the few fields the picture would read, what stays out of
scope, the transport and the refresh cadence. None is implemented. The single
implementation of the read model, `demoPicture`, serves the static data in
`src/data/`. A live implementation would satisfy the same interface.

| System | Would read | Stays out of scope |
| --- | --- | --- |
| Maximo | Work order state, asset reference, planned and actual dates | Asset registry, maintenance history, work order authoring |
| ArcGIS | Work extent geometry, asset location, network reference | Authoritative spatial data management, editing, publishing |
| M-Field | Shift and field report headers, constraint flags, evidence pointers | Prestarts, forms, field workflow |
| Salesforce | Project register, ownership and responsibility | The application platform and every app built on it |
| Project Controls | Actual and planned progress, variance | Progress claims, earned value, reporting packs |
| Scheduling | Milestone dates, float, critical path flag | Programme authoring, logic, resourcing |
| Quality System | Open non-conformance count, hold point state, severity | Inspection and test plans, records, close-out |
| Safety System | Open corrective actions, overdue count | Event management, investigation, reporting obligations |
| Document Control | Approval state, days outstanding, document reference | The document register, revision control, distribution |
| Financial System | Forecast against budget flag | Cost, rates, margin, commercial detail of any kind |

The first four are systems Fulton Hogan is publicly known to run. The rest are
role placeholders standing in for whichever product fills that role. Naming a
system here describes a dependency, not an integration.

---

## The status model

Deliberately small, and legible enough to argue with.

- Signals are assessed across eight dimensions: delivery progress, programme
  confidence, quality, safety, commercial, approvals, constraints and data
  freshness. Each signal carries a value, a state (`ok` / `watch` / `act`), an
  age, and the system it came from.
- A project reads as **the worst thing currently true about it**: any `act`
  makes it *Intervention required*, any `watch` makes it *Attention required*,
  otherwise *On track*. There is no weighted score, so there is no number to
  argue about or to game.
- **Freshness is a separate axis.** A project whose data has not refreshed in
  over three days is greyed on the map and counted separately. It is not judged,
  because the picture cannot be trusted until it refreshes. Its last known
  status still counts in the headline figures.
- Every panel can show the contributing signals on request, and says plainly
  that the status is derived by TACEDGE using demonstration logic.

The model lives in `src/domain/status.ts`. Headline metrics are derived from the
project records, never typed in separately.

---

## Demonstration data

All of it is in `src/data/`, and it is the only place content is edited.

| File | What is in it |
| --- | --- |
| `portfolio.ts` | The fifteen projects, their signals, and the orientation place names |
| `featured.ts` | The featured project: boundary, corridor, five workfronts, four issues, three milestones, five evidence points |
| `reference.ts` | Regions, business units, project types, source systems, issue categories, glossary |

Every reference entry carries a provenance marker, and the interface surfaces
the distinction rather than hiding it:

- **`terminology`** — language used publicly by Fulton Hogan, NZTA Waka Kotahi
  or the wider New Zealand civil industry. New Zealand regions, project types,
  IDM/IDC/AFWP/MSQA/TMP/STMS/CoPTTM/RP/NCR/PS4, and the four named systems. Used
  because getting the language right is most of what makes a picture legible to
  the people who work in it.
- **`inferred`** — structures assembled for the prototype and plausible, but not
  asserted as fact. Business unit names, and the shape of the source-system
  landscape. Marked as inferred wherever it appears in the interface.
- **`notional`** — invented. Every project, person, reference number,
  percentage, date, issue and coordinate.

No real project data, personal information, commercially sensitive material,
unpublished financial data or credentials appears anywhere in this repository.
Nothing was copied from internal documentation; source material was used to get
the terminology and operating context right, and nothing else.

`SH73` through the Ōtira Gorge is a real state highway in a real place, and the
corridor is drawn approximately where it runs. The package, its workfronts, its
people, its issues and its numbers are invented, and the geometry is schematic.
The interface labels it *indicative project geometry*.

---

## Branding

Two sources govern the visual system, and they do different jobs.

### Fulton Hogan brand guidance

`FULTON_HOGAN_BRAND_GUIDELINES.md`, supplied for this prototype, is the
authority for how the interface looks. It is described in that document as
public-site-derived and provisional, not an official Fulton Hogan brand manual,
so every value it gives is treated as an approximation that official brand files
would replace. `src/styles/tokens.css` implements it in one place:

- Charcoal `#211F1F` frame, white and neutral surfaces, roughly the 70 / 20 / 10
  balance the guidance asks for.
- Brand blue `#0099C7` for identity and links, brand orange `#F58325` for the
  current selection and one primary emphasis. Neither appears as a background
  wash, and neither is used at body text size: `#006B8A` and `#A94700` carry
  those, because the bright values fail AA below large text.
- Semantic status colours only for operational meaning: green on track, amber
  attention, red intervention, grey data not current. Brand orange is never
  used to mean "warning".
- Montserrat for display and Inter for interface, self-hosted from
  `public/fonts/`, never a CDN. Both are Google Fonts under SIL OFL 1.1 and
  exist here only to render this prototype.
- Sentence case throughout. Uppercase is reserved for short eyebrow labels and
  status stamps.
- 4px spacing scale, 4 to 8px radii, hairline borders, minimal shadow.
- Motion is 120 to 220ms and respects `prefers-reduced-motion`.

**There is no Fulton Hogan logo in this prototype.** No official asset exists in
any connected repository, and the guidance is explicit that the mark must not be
redrawn or recreated in CSS and that a third-party download is not a substitute.
Nothing here approximates it. `src/components/BrandLockup.tsx` is a slot: drop an
official file at `public/brand/fulton-hogan-logo.svg` and the header renders it,
unmodified and at the supplied aspect ratio, in the position the guidance
specifies. Until then the slot collapses and the header leads with the product
name.

### TACEDGE repositories

Three were used as read-only reference. Nothing in them was modified.

**[Coordination](https://github.com/TacEdge/Coordination)** is the TacEdge
mapping application, and the geospatial architecture here follows it rather than
inventing a second one: a framework-agnostic `MapInstanceManager` owning the
MapLibre lifecycle with a dynamically imported SDK, a React binding that only
owns the container, declarative layer and marker components, and the same
addressing for LINZ Basemaps styles as `src/lib/map/basemaps.ts` there.

**[Fulton-Hogan](https://github.com/TacEdge/Fulton-Hogan)** supplied the
operating context: NZTA Waka Kotahi's Integrated Delivery Model, the contract
and programme vocabulary, the traffic-management and quality terms, and the
digital-systems landscape. Terminology only.

**[Brand-Identity-and-Guidelines](https://github.com/TacEdge/Brand-Identity-and-Guidelines)**
governs how TACEDGE appears. Here that reduces to one rule that still applies:
TACEDGE is always uppercase. The interface itself follows the Fulton Hogan
guidance above, because this is a Fulton Hogan concept screen, and the TACEDGE
attribution is deliberately secondary: the words "Concept by TACEDGE" beside the
product name, and no TACEDGE mark competing with the client's identity.

---

## Architecture

```
src/
  domain/       types.ts, status.ts   the status model, no UI, no data
  data/         portfolio, featured, reference   all demonstration content
  services/     adapters.ts           the integration seam and the read model
  hooks/        usePortfolio.ts       data hooks; components never touch data directly
  state/        viewStore.ts          client-only view state (Zustand)
  map/          MapInstanceManager, MapCanvas, MapCamera, MapMarker,
                GeoJsonLayer, basemap
  components/   portfolio/, project/, ui/, AppHeader, BrandLockup,
                AboutPanel, Legend
  styles/       tokens.css, fonts.css, base.css, app.css
public/
  geo/          nz-land.json, nz-regions.json   simplified from Natural Earth
  fonts/        self-hosted Inter and Montserrat woff2
  brand/        client logo slot (empty), TACEDGE app icon used as the favicon
```

Separation worth keeping: `domain/` and `services/` know nothing about React;
`map/` knows nothing about projects or issues; components read hooks rather than
data modules. Swapping the demonstration source for a live one is a change in
one file.

React 19, Vite, TypeScript in strict mode, MapLibre GL JS, Zustand. No UI
framework, no CSS framework and no icon library: the tokens are the design
system and the icons are drawn in `components/ui/icons.tsx` so stroke, size and
join stay consistent.

### Map rendering notes

- Geometry (land, regions, boundary, corridor, workfronts) renders as GL layers.
  Everything carrying text or taking a click is a DOM marker, which keeps the
  type system exact, keeps labels focusable, and means the deployment never
  needs a glyph server.
- Chrome clearance is applied as per-call `padding` on `fitBounds` and as a
  centre `offset` on point moves. It is never left on the map as persistent
  padding, because MapLibre would then apply it a second time and pull every fit
  too far out.
- Rotation is disabled. The picture is read, not explored, and rotation costs
  orientation without adding anything.
- Camera moves respect `prefers-reduced-motion`.

### Basemap data

`public/geo/nz-land.json` and `nz-regions.json` are New Zealand coastline and
regional boundaries from [Natural Earth](https://www.naturalearthdata.com/)
(public domain), simplified with Douglas-Peucker and clipped to the main islands
— the Chatham Islands straddle the antimeridian and break rendering, and the
subantarctic islands only cost frame. Together they are about 78 kB, which is
what lets the prototype run with no network at all.

---

## Assumptions made

1. **Business unit structure is invented.** Fulton Hogan's actual internal unit
   names and boundaries are not in the source material, so the five units here
   are assembled from work the business is publicly known to deliver, and are
   marked inferred in the interface.
2. **One project has a spatial detail view.** The brief asks for one featured
   project that demonstrates the whole journey. The other fourteen open a
   portfolio panel and say plainly that the project view is not in this
   prototype, rather than pretending to a depth that is not there.
3. **The issue-category filter reads signals, not issue records.** Only the
   featured project carries individual issues, so at portfolio level the filter
   matches projects with a signal reading outside tolerance in that category.
4. **Thresholds are demonstration values.** Ageing at 24 hours, stale at 72.
   Both are in `src/domain/status.ts`.
5. **The demonstration is staged at 27 July 2026** (`DEMO_AS_AT` in
   `src/data/portfolio.ts`). Relative times are written against that date.
6. **People are initials and a surname**, deliberately, so no invented person
   reads as a real one.
7. **Desktop first, phone capable.** Down to about 1180px the chrome narrows
   and the map keeps the space. Below 900px the drawer becomes a bottom sheet,
   the legend folds, and unrequested map labels are suppressed, because on a
   small map they cover more than they explain. It installs and works on a
   phone; it is designed for a desk.
8. **No photography.** The guidance asks for authentic documentary imagery in
   evidence views. Nothing suitable exists here and inventing a construction
   photograph would be a fabrication, so evidence records show a labelled
   placeholder and say plainly that no photographs are included.
9. **Navigation is the trail, not invented sections.** The mock shows Portfolio,
   Programmes and Reports tabs. Only Portfolio exists, so only Portfolio and the
   open project are in the header: dead tabs would be chrome pretending to be a
   product.

---

## Licence and attribution

Concept prototype by TACEDGE. Colour, type and layout follow the supplied
Fulton Hogan brand guidance, which is itself derived from public material and
provisional; official brand files replace it. No Fulton Hogan logo or other
trademarked asset is included. Basemap geometry is from Natural Earth (public
domain). Montserrat and Inter are SIL OFL 1.1. MapLibre GL JS is BSD-3-Clause.

Demonstration data throughout. Not a representation of any live project.
