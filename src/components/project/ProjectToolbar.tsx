/* Project identity band. The same frame the portfolio uses, carrying who and
   what instead of how many, with the layer tabs below it. */

import { formatAge, formatVariance } from "@/domain/status";
import type { ProjectStatus } from "@/domain/status";
import type { Project, ProjectDetail } from "@/domain/types";
import { REGION_BY_ID } from "@/data/reference";
import { useViewStore } from "@/state/viewStore";
import { StatusBadge, StatusDot } from "@/components/ui/primitives";
import { IconArrowLeft } from "@/components/ui/icons";
import { LayerTabs } from "./LayerTabs";

export function ProjectToolbar({
  project,
  status,
  detail,
}: {
  project: Project;
  status: ProjectStatus;
  detail: ProjectDetail;
}) {
  const closeProject = useViewStore((s) => s.closeProject);
  const region = REGION_BY_ID.get(project.regionId);

  return (
    <>
      <div className="project-bar">
        <button type="button" className="btn btn-secondary btn-sm" onClick={closeProject}>
          <IconArrowLeft size={16} />
          <span>Portfolio</span>
        </button>

        <div className="project-bar-identity">
          <div className="project-bar-line">
            <h2 className="project-bar-title">{project.name}</h2>
            <StatusBadge state={status.markerState} />
          </div>
          <p className="u-caption">
            <span className="u-num">{project.reference}</span> · {region?.label} · {project.contract}
          </p>
        </div>

        <div className="project-bar-stats">
          <Stat value={`${project.progressActual}%`} label="Actual" />
          <Stat value={`${project.progressPlanned}%`} label="Planned" quiet />
          <Stat
            value={formatVariance(status.variance)}
            label="Variance"
            tone={status.variance < 0 ? "behind" : undefined}
          />
          <Stat value={String(project.openIssues)} label="Open issues" />
          <Stat
            value={String(project.overdueActions)}
            label="Overdue"
            tone={project.overdueActions > 0 ? "behind" : undefined}
          />
          <div className="stat stat-refresh">
            <span className="stat-value stat-value-sm">
              <StatusDot state={status.freshness === "stale" ? "stale" : "on-track"} size={8} />
              {formatAge(project.dataAgeHours)}
            </span>
            <span className="stat-label">Last refresh</span>
          </div>
        </div>
      </div>

      <LayerTabs detail={detail} />
    </>
  );
}

function Stat({
  value,
  label,
  quiet,
  tone,
}: {
  value: string;
  label: string;
  quiet?: boolean;
  tone?: "behind";
}) {
  return (
    <div className="stat">
      <span className={`stat-value u-num${quiet ? " is-quiet" : ""}${tone === "behind" ? " is-behind" : ""}`}>
        {value}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
