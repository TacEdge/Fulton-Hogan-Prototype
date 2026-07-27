/* One surface. The map is always the same map; the scope decides what is drawn
   on it and what sits alongside it. There are no pages. */

import { useEffect } from "react";
import { MapCanvas } from "@/map/MapCanvas";
import { MapCamera } from "@/map/MapCamera";
import { AppHeader } from "@/components/AppHeader";
import { AboutPanel } from "@/components/AboutPanel";
import { Legend, PORTFOLIO_LEGEND, PROJECT_LEGEND } from "@/components/Legend";
import { MetricsStrip } from "@/components/portfolio/MetricsStrip";
import { FilterRail } from "@/components/portfolio/FilterRail";
import { PlaceLabels, ProjectMarkers } from "@/components/portfolio/ProjectMarkers";
import { ProjectPanel } from "@/components/portfolio/ProjectPanel";
import { ProjectGeometry } from "@/components/project/ProjectGeometry";
import { ProjectMapMarkers } from "@/components/project/ProjectMapMarkers";
import { ProjectSummaryCard } from "@/components/project/ProjectSummaryCard";
import { ProjectLayersRail } from "@/components/project/ProjectLayersRail";
import { ProjectDetailPanel } from "@/components/project/ProjectDetailPanel";
import { IssuePanel } from "@/components/project/IssuePanel";
import { useProject, useProjectDetail } from "@/hooks/usePortfolio";
import { useViewStore } from "@/state/viewStore";

const OPENING_VIEW = { center: [173.6, -41.2] as [number, number], zoom: 5.1 };

export default function App() {
  const scope = useViewStore((s) => s.scope);

  return (
    <div className="app">
      <AppHeader />
      <main className={`app-body scope-${scope}`}>
        <MapCanvas initialView={OPENING_VIEW}>
          <MapCamera />
          {scope === "portfolio" ? (
            <>
              <PlaceLabels />
              <ProjectMarkers />
            </>
          ) : (
            <ProjectLayersOnMap />
          )}
        </MapCanvas>

        {scope === "portfolio" ? <PortfolioChrome /> : <ProjectChrome />}
      </main>
      <AboutPanel />
    </div>
  );
}

function PortfolioChrome() {
  return (
    <>
      <MetricsStrip />
      <FilterRail />
      <ProjectPanel />
      <div className="legend-slot">
        <Legend title="Project status" items={PORTFOLIO_LEGEND} />
      </div>
      <p className="map-footnote">
        Operational Picture — concept by TACEDGE · Demonstration data · Boundaries: Natural Earth
      </p>
    </>
  );
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

function ProjectChrome() {
  const openProjectId = useViewStore((s) => s.openProjectId);
  const selectedIssueId = useViewStore((s) => s.selectedIssueId);
  const selectIssue = useViewStore((s) => s.selectIssue);
  const closeProject = useViewStore((s) => s.closeProject);
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
  const issue = selectedIssueId ? detail.issues.find((i) => i.id === selectedIssueId) : undefined;

  return (
    <>
      <ProjectSummaryCard project={entry.project} status={entry.status} />
      <ProjectLayersRail detail={detail} />
      {issue ? <IssuePanel issue={issue} /> : <ProjectDetailPanel project={entry.project} detail={detail} />}
      <div className="legend-slot">
        <Legend title="Map key" items={PROJECT_LEGEND} />
      </div>
      <p className="map-footnote">
        Operational Picture — concept by TACEDGE · Demonstration data · Indicative project geometry
      </p>
    </>
  );
}
