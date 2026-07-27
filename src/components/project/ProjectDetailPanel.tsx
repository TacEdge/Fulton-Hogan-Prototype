/* Project-level panel: what is open, what is blocked, and what is coming.
   Selecting anything here moves the map, so the list and the picture never
   disagree. */

import {
  CONFIDENCE_HEALTH,
  CONFIDENCE_LABEL,
  SEVERITY_HEALTH,
  SEVERITY_LABEL,
  formatAge,
} from "@/domain/status";
import { ISSUE_CATEGORY_BY_ID, sourceLabel } from "@/data/reference";
import type { Project, ProjectDetail, WorkState } from "@/domain/types";
import { useViewStore } from "@/state/viewStore";
import { HealthChip, SectionTitle, SourceTag, StatusDot } from "@/components/ui/primitives";

const WORK_STATE_HEALTH: Record<WorkState, "on-track" | "attention" | "intervention" | "stale"> = {
  completed: "on-track",
  active: "on-track",
  behind: "attention",
  blocked: "intervention",
  planned: "stale",
};

const WORK_STATE_LABEL: Record<WorkState, string> = {
  completed: "Completed",
  active: "Active",
  behind: "Behind programme",
  blocked: "Blocked",
  planned: "Planned",
};

export function ProjectDetailPanel({
  project,
  detail,
}: {
  project: Project;
  detail: ProjectDetail;
}) {
  const selectIssue = useViewStore((s) => s.selectIssue);
  const selectWorkfront = useViewStore((s) => s.selectWorkfront);
  const selectedWorkfrontId = useViewStore((s) => s.selectedWorkfrontId);

  const issues = [...detail.issues].sort(
    (a, b) => severityRank(a.severity) - severityRank(b.severity) || b.daysOpen - a.daysOpen,
  );

  return (
    <aside className="panel" aria-label={`${project.name} detail`}>
      <div className="panel-body panel-body-flush">
        <section className="panel-section">
          <SectionTitle>Issues requiring action</SectionTitle>
          <ul className="issue-list">
            {issues.map((issue) => (
              <li key={issue.id}>
                <button type="button" className="issue-row" onClick={() => selectIssue(issue.id)}>
                  <span className="issue-row-top">
                    <StatusDot state={SEVERITY_HEALTH[issue.severity]} size={9} />
                    <span className="issue-row-title">{issue.title}</span>
                  </span>
                  <span className="issue-row-meta">
                    <span className="chip chip-quiet">
                      {ISSUE_CATEGORY_BY_ID.get(issue.category)?.label}
                    </span>
                    <span className="u-caption">{SEVERITY_LABEL[issue.severity]}</span>
                    <span className="u-caption u-num">{issue.daysOpen}d open</span>
                    {issue.overdue ? <span className="overdue-flag">Overdue</span> : null}
                  </span>
                  <span className="issue-row-foot">
                    <span className="u-caption">{issue.owner}</span>
                    <SourceTag label={sourceLabel(issue.sourceSystemId)} compact />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel-section">
          <SectionTitle>Workfronts</SectionTitle>
          <ul className="workfront-list">
            {detail.workfronts.map((workfront) => {
              const selected = selectedWorkfrontId === workfront.id;
              const variance = workfront.progressActual - workfront.progressPlanned;
              return (
                <li key={workfront.id}>
                  <button
                    type="button"
                    className={`workfront-row${selected ? " is-selected" : ""}`}
                    onClick={() => selectWorkfront(selected ? null : workfront.id)}
                    aria-pressed={selected}
                  >
                    <span className="workfront-row-top">
                      <span className="u-label u-num">{workfront.reference}</span>
                      <HealthChip
                        state={WORK_STATE_HEALTH[workfront.state]}
                        label={WORK_STATE_LABEL[workfront.state]}
                      />
                    </span>
                    <span className="workfront-row-name">{workfront.name}</span>
                    <span className="workfront-row-meta u-caption">
                      <span className="u-num">{workfront.extent}</span>
                      <span>·</span>
                      <span className="u-num">
                        {workfront.progressActual}% of {workfront.progressPlanned}% planned
                      </span>
                      {variance < 0 ? <span className="variance is-behind u-num">{variance}%</span> : null}
                    </span>
                    {selected ? <span className="workfront-row-summary">{workfront.summary}</span> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="panel-section">
          <SectionTitle>Milestones</SectionTitle>
          <ul className="milestone-list">
            {detail.milestones.map((milestone) => (
              <li key={milestone.id} className="milestone-row">
                <span className="milestone-row-top">
                  <span className="milestone-row-label">{milestone.label}</span>
                  <span className="u-num u-caption">{milestone.date}</span>
                </span>
                <span className="milestone-row-meta">
                  <HealthChip
                    state={CONFIDENCE_HEALTH[milestone.confidence]}
                    label={CONFIDENCE_LABEL[milestone.confidence]}
                  />
                  <span className="u-caption">{milestone.note}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel-section">
          <SectionTitle>Data freshness</SectionTitle>
          <p className="u-caption">
            The picture for this project last refreshed {formatAge(project.dataAgeHours).toLowerCase()}.
            Each reading below it carries its own age and its own source.
          </p>
        </section>
      </div>
    </aside>
  );
}

function severityRank(severity: string): number {
  return { critical: 0, high: 1, moderate: 2, low: 3 }[severity] ?? 9;
}
