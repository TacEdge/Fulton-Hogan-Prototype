/* Everything on the project map that carries text or takes a click: workfront
   labels, issue pins, milestones and evidence. */

import { MapMarker } from "@/map/MapMarker";
import type { ProjectDetail } from "@/domain/types";
import { CONFIDENCE_HEALTH, CONFIDENCE_LABEL, SEVERITY_HEALTH, SEVERITY_LABEL } from "@/domain/status";
import { ISSUE_CATEGORY_BY_ID } from "@/data/reference";
import { useViewStore } from "@/state/viewStore";

const WORK_STATE_LABEL = {
  completed: "Completed",
  active: "Active",
  planned: "Planned",
  blocked: "Blocked",
  behind: "Behind programme",
} as const;

export function ProjectMapMarkers({ detail }: { detail: ProjectDetail }) {
  const layers = useViewStore((s) => s.projectLayers);
  const selectedIssueId = useViewStore((s) => s.selectedIssueId);
  const selectedWorkfrontId = useViewStore((s) => s.selectedWorkfrontId);
  const selectIssue = useViewStore((s) => s.selectIssue);
  const selectWorkfront = useViewStore((s) => s.selectWorkfront);

  const visibleIssues = layers.issues
    ? detail.issues.filter(
        (issue) =>
          layers.issueCategories.length === 0 || layers.issueCategories.includes(issue.category),
      )
    : [];

  return (
    <>
      {detail.workfronts
        .filter((w) => layers.work.includes(w.state))
        .map((workfront) => (
          <MapMarker key={workfront.id} lngLat={workfront.labelAt} anchor="left" order={10}>
            <button
              type="button"
              className={`workfront-label is-${workfront.state}${
                selectedWorkfrontId === workfront.id ? " is-selected" : ""
              }`}
              onClick={() => selectWorkfront(selectedWorkfrontId === workfront.id ? null : workfront.id)}
              aria-pressed={selectedWorkfrontId === workfront.id}
            >
              <span className="workfront-label-ref u-num">{workfront.reference}</span>
              <span className="workfront-label-name">{workfront.name}</span>
              <span className="workfront-label-state u-label">{WORK_STATE_LABEL[workfront.state]}</span>
            </button>
          </MapMarker>
        ))}

      {layers.milestones
        ? detail.milestones.map((milestone) => (
            <MapMarker key={milestone.id} lngLat={milestone.position} order={20}>
              <span
                className={`milestone-pin is-${CONFIDENCE_HEALTH[milestone.confidence]}`}
                title={`${milestone.label}. ${CONFIDENCE_LABEL[milestone.confidence]}. ${milestone.date}.`}
              >
                <span className="milestone-pin-mark" aria-hidden="true" />
                <span className="milestone-pin-label">
                  {milestone.label}
                  <span className="u-num milestone-pin-date">{milestone.date}</span>
                </span>
              </span>
            </MapMarker>
          ))
        : null}

      {layers.evidence
        ? detail.evidence.map((item) => (
            <MapMarker key={item.id} lngLat={item.position} order={15}>
              <span className="evidence-pin" title={`${item.label} · ${item.caption}`}>
                <span className="evidence-pin-mark" aria-hidden="true" />
              </span>
            </MapMarker>
          ))
        : null}

      {visibleIssues.map((issue) => {
        const selected = selectedIssueId === issue.id;
        return (
          <MapMarker key={issue.id} lngLat={issue.position} order={selected ? 60 : 50}>
            <button
              type="button"
              className={`issue-pin is-${SEVERITY_HEALTH[issue.severity]}${selected ? " is-selected" : ""}`}
              onClick={() => selectIssue(selected ? null : issue.id)}
              aria-pressed={selected}
              aria-label={`${issue.title}. ${SEVERITY_LABEL[issue.severity]} severity. ${
                ISSUE_CATEGORY_BY_ID.get(issue.category)?.label ?? issue.category
              }.`}
            >
              <span className="issue-pin-mark" aria-hidden="true">
                !
              </span>
            </button>
            {selected ? <span className="issue-pin-label">{issue.title}</span> : null}
          </MapMarker>
        );
      })}
    </>
  );
}
