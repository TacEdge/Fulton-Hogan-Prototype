/* One surface. A charcoal header, a white toolbar band, and below them the map,
   edge to edge, with detail opening in a right-side drawer. The map is always
   the same map; the scope decides what is drawn on it. There are no pages. */

import { useEffect } from "react";
import { MapCanvas } from "@/map/MapCanvas";
import { MapCamera, useReframe } from "@/map/MapCamera";
import { MapControls } from "@/map/MapControls";
import { AppHeader } from "@/components/AppHeader";
import { AboutPanel } from "@/components/AboutPanel";
import { Legend, PORTFOLIO_LEGEND, PROJECT_LEGEND } from "@/components/Legend";
import { MetricsStrip } from "@/components/portfolio/MetricsStrip";
import { FilterBar } from "@/components/portfolio/FilterBar";
import { ProjectMarkers } from "@/components/portfolio/ProjectMarkers";
import { ProjectPanel } from "@/components/portfolio/ProjectPanel";
import { ProjectGeometry } from "@/components/project/ProjectGeometry";
import { ProjectMapMarkers } from "@/components/project/ProjectMapMarkers";
import { ProjectToolbar } from "@/components/project/ProjectToolbar";
import { ProjectDetailPanel } from "@/components/project/ProjectDetailPanel";
import { IssuePanel } from "@/components/project/IssuePanel";
import { useProject, useProjectDetail } from "@/hooks/usePortfolio";
import { resolveLayers, useViewStore } from "@/state/viewStore";

const OPENING_VIEW = { center: [173.6, -41.2] as [number, number], zoom: 5.1 };

export default function App() {
  const scope = useViewStore((s) => s.scope);
  const selectedProjectId = useViewStore((s) => s.selectedProjectId);
  const openProjectId = useViewStore((s) => s.openProjectId);
  const entry = useProject(openProjectId);
  const detail = useProjectDetail(openProjectId);

  const drawerOpen = scope === "project" || Boolean(selectedProjectId);

  return (
    <div className="app">
      <AppHeader />

      <div className="app-toolbar">
        {scope === "portfolio" ? (
          <>
            <MetricsStrip />
            <FilterBar />
          </>
        ) : entry && detail ? (
          <ProjectToolbar project={entry.project} status={entry.status} detail={detail} />
        ) : null}
      </div>

      <main className={`app-map scope-${scope}${drawerOpen ? " has-drawer" : ""}`}>
        <MapCanvas initialView={OPENING_VIEW}>
          <MapCamera />
          <MapChrome />
          {scope === "portfolio" ? <ProjectMarkers /> : <ProjectLayersOnMap />}
        </MapCanvas>

        <div className="legend-slot">
          <Legend
            title={scope === "portfolio" ? "Project status" : "Map key"}
            items={scope === "portfolio" ? PORTFOLIO_LEGEND : PROJECT_LEGEND}
          />
        </div>

        {scope === "portfolio" ? <ProjectPanel /> : <ProjectDrawer />}

        <p className="map-footnote">
          Demonstration data. Concept prototype by TACEDGE.{" "}
          {scope === "portfolio" ? "Boundaries: Natural Earth." : "Indicative project geometry."}
        </p>
      </main>

      <AboutPanel />
    </div>
  );
}

/** Map controls live inside the map context, so they need their own component. */
function MapChrome() {
  const reframe = useReframe();
  return <MapControls onReframe={reframe} />;
}

function ProjectLayersOnMap() {
  const openProjectId = useViewStore((s) => s.openProjectId);
  const detail = useProjectDetail(openProjectId);
  if (!detail) return null;
  return (
    <>
      <ProjectGeometry detail={detail} />
      <ProjectMapMarkers detail={detail} />
    </>
  );
}

function ProjectDrawer() {
  const openProjectId = useViewStore((s) => s.openProjectId);
  const selectedIssueId = useViewStore((s) => s.selectedIssueId);
  const selectIssue = useViewStore((s) => s.selectIssue);
  const closeProject = useViewStore((s) => s.closeProject);
  const layerView = useViewStore((s) => s.layerView);
  const entry = useProject(openProjectId);
  const detail = useProjectDetail(openProjectId);

  /* Escape steps back one level, never all the way out. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (selectedIssueId) selectIssue(null);
      else closeProject();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIssueId, selectIssue, closeProject]);

  if (!entry || !detail) return null;

  const { issueCategory } = resolveLayers(layerView);
  const siblings = detail.issues.filter((i) => !issueCategory || i.category === issueCategory);
  const issue = selectedIssueId ? detail.issues.find((i) => i.id === selectedIssueId) : undefined;

  return issue ? (
    <IssuePanel issue={issue} siblings={siblings.some((i) => i.id === issue.id) ? siblings : detail.issues} />
  ) : (
    <ProjectDetailPanel project={entry.project} detail={detail} />
  );
}
