/* The ten-second answer. Counts are derived from the project records, never
   typed in, so changing the data changes the headline.

   Each status tile is also the filter for that status: the number you want to
   understand is the control that shows you it. */

import { HEALTH_LABEL } from "@/domain/status";
import { useFilteredProjects, usePortfolioSummary } from "@/hooks/usePortfolio";
import { useViewStore } from "@/state/viewStore";
import type { Health } from "@/domain/types";
import { StatusIcon } from "@/components/ui/primitives";
import { IconFolder } from "@/components/ui/icons";

const TILES: { state: Health | "stale"; key: "onTrack" | "attention" | "intervention" | "dataNotCurrent" }[] = [
  { state: "on-track", key: "onTrack" },
  { state: "attention", key: "attention" },
  { state: "intervention", key: "intervention" },
  { state: "stale", key: "dataNotCurrent" },
];

export function MetricsStrip() {
  const projects = useFilteredProjects();
  const summary = usePortfolioSummary(projects);
  const filters = useViewStore((s) => s.filters);
  const toggleFilter = useViewStore((s) => s.toggleFilter);

  return (
    <div className="metrics" role="group" aria-label="Portfolio status">
      <div className="metric">
        <span className="metric-icon is-neutral">
          <IconFolder size={20} />
        </span>
        <span className="metric-body">
          <span className="metric-value u-num">{summary.active}</span>
          <span className="metric-label">Active projects</span>
        </span>
      </div>

      {TILES.map(({ state, key }) => {
        const pressed = filters.healths.includes(state);
        return (
          <button
            key={state}
            type="button"
            className={`metric metric-btn${pressed ? " is-pressed" : ""}`}
            aria-pressed={pressed}
            onClick={() => toggleFilter("healths", state)}
            title={`Show only projects reading ${HEALTH_LABEL[state].toLowerCase()}`}
          >
            <span className="metric-icon">
              <StatusIcon state={state} size={20} />
            </span>
            <span className="metric-body">
              <span className={`metric-value u-num ${state}`}>{summary[key]}</span>
              <span className="metric-label">{HEALTH_LABEL[state]}</span>
            </span>
          </button>
        );
      })}

      <div className="metrics-tail">
        <span className="metrics-tail-item">
          <span className="metrics-tail-value u-num">{summary.openIssues}</span>
          <span className="metrics-tail-label">Open issues</span>
        </span>
        <span className="metrics-tail-item">
          <span className="metrics-tail-value u-num">{summary.overdueActions}</span>
          <span className="metrics-tail-label">Overdue actions</span>
        </span>
      </div>
    </div>
  );
}
