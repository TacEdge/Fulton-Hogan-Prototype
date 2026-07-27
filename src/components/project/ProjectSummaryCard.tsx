/* Project header, over the map. The same four numbers a project manager is
   asked for on any given morning. */

import {
  CONFIDENCE_HEALTH,
  CONFIDENCE_LABEL,
  formatAge,
  formatVariance,
} from "@/domain/status";
import type { ProjectStatus } from "@/domain/status";
import type { Project } from "@/domain/types";
import { REGION_BY_ID } from "@/data/reference";
import { useViewStore } from "@/state/viewStore";
import { HealthChip, StatusDot } from "@/components/ui/primitives";

export function ProjectSummaryCard({ project, status }: { project: Project; status: ProjectStatus }) {
  const closeProject = useViewStore((s) => s.closeProject);
  const region = REGION_BY_ID.get(project.regionId);

  return (
    <div className="project-summary">
      <button type="button" className="back-btn" onClick={closeProject}>
        <span aria-hidden="true">←</span> Portfolio
      </button>

      <div className="project-summary-main">
        <div className="project-summary-id">
          <span className="u-label u-num">{project.reference}</span>
          <HealthChip state={status.markerState} />
        </div>
        <h2 className="project-summary-title">{project.name}</h2>
        <p className="u-caption">
          {region?.label} · {project.contract}
        </p>
      </div>

      <div className="project-summary-stats">
        <div className="stat">
          <span className="stat-value u-num">{project.progressActual}%</span>
          <span className="stat-label">Actual</span>
        </div>
        <div className="stat">
          <span className="stat-value u-num is-quiet">{project.progressPlanned}%</span>
          <span className="stat-label">Planned</span>
        </div>
        <div className="stat">
          <span className={`stat-value u-num ${status.variance < 0 ? "is-behind" : ""}`}>
            {formatVariance(status.variance)}
          </span>
          <span className="stat-label">Variance</span>
        </div>
        <div className="stat">
          <span className="stat-value u-num">{project.openIssues}</span>
          <span className="stat-label">Open issues</span>
        </div>
        <div className="stat">
          <span className={`stat-value u-num${project.overdueActions > 0 ? " is-flagged" : ""}`}>
            {project.overdueActions}
          </span>
          <span className="stat-label">Overdue</span>
        </div>
        <div className="stat stat-wide">
          <span className="stat-value stat-value-sm">
            <StatusDot state={CONFIDENCE_HEALTH[project.milestoneConfidence]} size={8} />
            {CONFIDENCE_LABEL[project.milestoneConfidence]}
          </span>
          <span className="stat-label">{project.nextMilestone}</span>
        </div>
        <div className="stat stat-refresh">
          <span className="stat-value stat-value-sm">
            <StatusDot state={status.freshness === "stale" ? "stale" : "on-track"} size={8} />
            {formatAge(project.dataAgeHours)}
          </span>
          <span className="stat-label">Last refresh</span>
        </div>
      </div>
    </div>
  );
}
