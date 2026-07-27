/* The ten-second answer. Counts are derived from the project records, never
   typed in, so changing the data changes the headline. */

import { HEALTH_LABEL } from "@/domain/status";
import { useFilteredProjects, usePortfolioSummary, useFiltersActive } from "@/hooks/usePortfolio";
import { useViewStore } from "@/state/viewStore";
import type { Health } from "@/domain/types";
import { StatusDot } from "@/components/ui/primitives";

const TILES: { state: Health | "stale"; key: "onTrack" | "attention" | "intervention" }[] = [
  { state: "on-track", key: "onTrack" },
  { state: "attention", key: "attention" },
  { state: "intervention", key: "intervention" },
];

export function MetricsStrip() {
  const projects = useFilteredProjects();
  const summary = usePortfolioSummary(projects);
  const filtersActive = useFiltersActive();
  const filters = useViewStore((s) => s.filters);
  const toggleFilter = useViewStore((s) => s.toggleFilter);

  return (
    <div className="metrics-strip" role="group" aria-label="Portfolio status">
      <div className="metric metric-lead">
        <span className="metric-value u-num">{summary.active}</span>
        <span className="metric-label">Active projects</span>
      </div>

      <span className="metric-rule" aria-hidden="true" />

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
            <span className="metric-value u-num">
              <StatusDot state={state} size={9} />
              {summary[key]}
            </span>
            <span className="metric-label">{HEALTH_LABEL[state]}</span>
          </button>
        );
      })}

      <span className="metric-rule" aria-hidden="true" />

      <div className="metric metric-quiet">
        <span className="metric-value u-num">{summary.openIssues}</span>
        <span className="metric-label">Open issues</span>
      </div>
      <div className="metric metric-quiet">
        <span className="metric-value u-num">{summary.overdueActions}</span>
        <span className="metric-label">Overdue actions</span>
      </div>
      <button
        type="button"
        className={`metric metric-btn metric-quiet${filters.healths.includes("stale") ? " is-pressed" : ""}`}
        aria-pressed={filters.healths.includes("stale")}
        onClick={() => toggleFilter("healths", "stale")}
        title="Show only projects whose data has not refreshed"
      >
        <span className="metric-value u-num">
          <StatusDot state="stale" size={9} />
          {summary.dataNotCurrent}
        </span>
        <span className="metric-label">Data not current</span>
      </button>

      {filtersActive > 0 ? (
        <span className="metric-filtered u-caption">
          Filtered view · {filtersActive} {filtersActive === 1 ? "filter" : "filters"} applied
        </span>
      ) : null}
    </div>
  );
}
