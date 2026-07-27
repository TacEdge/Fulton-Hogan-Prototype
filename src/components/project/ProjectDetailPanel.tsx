/* Project-level drawer: what is open, what is blocked, and what is coming.
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
import type { Issue, Project, ProjectDetail, WorkState } from "@/domain/types";
import { resolveLayers, useViewStore } from "@/state/viewStore";
import {
  SectionTitle,
  SourceTag,
  StatusDot,
  StatusPill,
} from "@/components/ui/primitives";
import { IconChevronRight } from "@/components/ui/icons";

const WORK_STATE_HEALTH: Record<WorkState, "on-track" | "attention" | "intervention" | "stale"> = {
  completed: "on-track",
  active: "on-track",
  behind: "attention",
  blocked: "intervention",
  planned: "stale",
};

const WORK_STATE_LABEL: Record<WorkState, string> = {
  completed: "Completed",
  active: "In progress",
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
  const layerView = useViewStore((s) => s.layerView);
  const layers = resolveLayers(layerView);

  const issues = [...detail.issues]
    .filter((issue) => !layers.issueCategory || issue.category === layers.issueCategory)
    .sort((a, b) => severityRank(a.severity) - severityRank(b.severity) || b.daysOpen - a.daysOpen);

  return (
    <aside className="drawer" aria-label={`${project.name} detail`}>
      <div className="drawer-body drawer-body-flush">
        <section className="drawer-section">
          <SectionTitle>
            {layers.issueCategory
              ? `${ISSUE_CATEGORY_BY_ID.get(layers.issueCategory)?.label} issues`
              : "Issues requiring action"}
          </SectionTitle>
          {issues.length === 0 ? (
            <p className="u-caption empty-note">No issues in this category.</p>
          ) : (
            <ul className="issue-list">
              {issues.map((issue) => (
                <li key={issue.id}>
                  <IssueRow issue={issue} onSelect={() => selectIssue(issue.id)} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="drawer-section">
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
                      <span className="workfront-row-name">
                        <span className="u-num workfront-row-ref">{workfront.reference}</span>
                        {workfront.name}
                      </span>
                      <StatusPill
                        state={WORK_STATE_HEALTH[workfront.state]}
                        label={WORK_STATE_LABEL[workfront.state]}
                      />
                    </span>
                    <span className="workfront-row-meta u-caption">
                      <span className="u-num">{workfront.extent}</span>
                      <span aria-hidden="true">·</span>
                      <span className="u-num">
                        {workfront.progressActual}% of {workfront.progressPlanned}% planned
                      </span>
                      {variance < 0 ? (
                        <span className="variance is-behind u-num">{variance}%</span>
                      ) : null}
                    </span>
                    {selected ? <span className="workfront-row-summary">{workfront.summary}</span> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="drawer-section">
          <SectionTitle>Milestones</SectionTitle>
          <ul className="milestone-list">
            {detail.milestones.map((milestone) => (
              <li key={milestone.id} className="milestone-row">
                <span className="milestone-row-top">
                  <span className="milestone-row-label">{milestone.label}</span>
                  <span className="u-num u-caption">{milestone.date}</span>
                </span>
                <span className="milestone-row-meta">
                  <StatusPill
                    state={CONFIDENCE_HEALTH[milestone.confidence]}
                    label={CONFIDENCE_LABEL[milestone.confidence]}
                  />
                  <span className="u-caption">{milestone.note}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="drawer-section">
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

function IssueRow({ issue, onSelect }: { issue: Issue; onSelect(): void }) {
  return (
    <button type="button" className="issue-row" onClick={onSelect}>
      <span className="issue-row-top">
        <StatusDot state={SEVERITY_HEALTH[issue.severity]} size={9} />
        <span className="issue-row-title">{issue.title}</span>
        <IconChevronRight size={16} className="issue-row-chevron" />
      </span>
      <span className="issue-row-meta">
        <span className="chip">{ISSUE_CATEGORY_BY_ID.get(issue.category)?.label}</span>
        <span className="u-caption">{SEVERITY_LABEL[issue.severity]}</span>
        <span className="u-caption u-num">{issue.daysOpen} days open</span>
        {issue.overdue ? <span className="overdue-flag">Overdue</span> : null}
      </span>
      <span className="issue-row-foot">
        <span className="u-caption">{issue.owner}</span>
        <SourceTag label={sourceLabel(issue.sourceSystemId)} compact />
      </span>
    </button>
  );
}

function severityRank(severity: string): number {
  return { critical: 0, high: 1, moderate: 2, low: 3 }[severity] ?? 9;
}
