/* Project layer control. Thin on purpose: this is an operational picture, not
   a GIS. Only the layers that change a decision are here. */

import { ISSUE_CATEGORIES } from "@/data/reference";
import { ALL_WORK_STATES, useViewStore } from "@/state/viewStore";
import type { ProjectDetail, WorkState } from "@/domain/types";

const WORK_LABEL: Record<WorkState, string> = {
  completed: "Completed",
  active: "Active",
  behind: "Behind programme",
  blocked: "Blocked",
  planned: "Planned",
};

export function ProjectLayersRail({ detail }: { detail: ProjectDetail }) {
  const layers = useViewStore((s) => s.projectLayers);
  const setProjectLayers = useViewStore((s) => s.setProjectLayers);
  const toggleWorkState = useViewStore((s) => s.toggleWorkState);
  const toggleIssueCategory = useViewStore((s) => s.toggleIssueCategory);

  const categoriesPresent = ISSUE_CATEGORIES.filter((c) =>
    detail.issues.some((i) => i.category === c.id),
  );

  return (
    <aside className="rail" aria-label="Project layers">
      <div className="rail-head">
        <span className="u-label">Layers</span>
        <button
          type="button"
          className="link-btn"
          onClick={() =>
            setProjectLayers({
              work: ALL_WORK_STATES,
              issues: true,
              issueCategories: [],
              milestones: true,
              evidence: false,
            })
          }
        >
          Reset
        </button>
      </div>

      <section className="filter-group is-static">
        <span className="u-label rail-group-title">Progress</span>
        <ul className="toggle-list">
          {ALL_WORK_STATES.map((state) => {
            const n = detail.workfronts.filter((w) => w.state === state).length;
            if (n === 0) return null;
            const on = layers.work.includes(state);
            return (
              <li key={state}>
                <button
                  type="button"
                  className={`toggle${on ? " is-on" : ""}`}
                  aria-pressed={on}
                  onClick={() => toggleWorkState(state)}
                >
                  <span className={`legend-swatch sw-${state}`} aria-hidden="true" />
                  <span className="u-truncate">{WORK_LABEL[state]}</span>
                  <span className="toggle-count u-num">{n}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="filter-group is-static">
        <span className="u-label rail-group-title">Signals</span>
        <ul className="toggle-list">
          <li>
            <button
              type="button"
              className={`toggle${layers.issues ? " is-on" : ""}`}
              aria-pressed={layers.issues}
              onClick={() => setProjectLayers({ issues: !layers.issues })}
            >
              <span className="legend-swatch sw-issue" aria-hidden="true" />
              <span className="u-truncate">Issues</span>
              <span className="toggle-count u-num">{detail.issues.length}</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`toggle${layers.milestones ? " is-on" : ""}`}
              aria-pressed={layers.milestones}
              onClick={() => setProjectLayers({ milestones: !layers.milestones })}
            >
              <span className="legend-swatch sw-milestone" aria-hidden="true" />
              <span className="u-truncate">Milestones</span>
              <span className="toggle-count u-num">{detail.milestones.length}</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`toggle${layers.evidence ? " is-on" : ""}`}
              aria-pressed={layers.evidence}
              onClick={() => setProjectLayers({ evidence: !layers.evidence })}
            >
              <span className="legend-swatch sw-evidence" aria-hidden="true" />
              <span className="u-truncate">Evidence</span>
              <span className="toggle-count u-num">{detail.evidence.length}</span>
            </button>
          </li>
        </ul>
      </section>

      {layers.issues ? (
        <section className="filter-group is-static">
          <span className="u-label rail-group-title">Issue category</span>
          <div className="chip-row">
            {categoriesPresent.map((category) => {
              const on = layers.issueCategories.includes(category.id);
              return (
                <button
                  key={category.id}
                  type="button"
                  className={`filter-chip${on ? " is-on" : ""}`}
                  aria-pressed={on}
                  onClick={() => toggleIssueCategory(category.id)}
                  title={category.note}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
          {layers.issueCategories.length === 0 ? (
            <p className="filter-note u-caption">All categories shown.</p>
          ) : null}
        </section>
      ) : null}
    </aside>
  );
}
