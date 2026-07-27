/* Everything on the project map that carries text or takes a click: workfront
   labels, issue pins, milestones and evidence. What is drawn is decided by the
   layer tab, not by the map. */

import { MapMarker } from "@/map/MapMarker";
import type { ProjectDetail, WorkState } from "@/domain/types";
import { CONFIDENCE_HEALTH, CONFIDENCE_LABEL, SEVERITY_HEALTH, SEVERITY_LABEL } from "@/domain/status";
import { ISSUE_CATEGORY_BY_ID } from "@/data/reference";
import { resolveLayers, useViewStore } from "@/state/viewStore";
import { IconImage } from "@/components/ui/icons";

const WORK_STATE_LABEL: Record<WorkState, string> = {
  completed: "Completed",
  active: "In progress",
  planned: "Planned",
  blocked: "Blocked",
  behind: "Behind programme",
};

export function ProjectMapMarkers({ detail }: { detail: ProjectDetail }) {
  const layerView = useViewStore((s) => s.layerView);
  const layers = resolveLayers(layerView);
  const selectedIssueId = useViewStore((s) => s.selectedIssueId);
  const selectedWorkfrontId = useViewStore((s) => s.selectedWorkfrontId);
  const selectIssue = useViewStore((s) => s.selectIssue);
  const selectWorkfront = useViewStore((s) => s.selectWorkfront);

  const visibleIssues = layers.showIssues
    ? detail.issues.filter((issue) => !layers.issueCategory || issue.category === layers.issueCategory)
    : [];

  return (
    <>
      {detail.workfronts.map((workfront) => (
        <MapMarker key={workfront.id} lngLat={workfront.labelAt} anchor="left" order={10}>
          <button
            type="button"
            className={`workfront-label is-${workfront.state}${
              selectedWorkfrontId === workfront.id ? " is-selected" : ""
            }`}
            onClick={() => selectWorkfront(selectedWorkfrontId === workfront.id ? null : workfront.id)}
            aria-pressed={selectedWorkfrontId === workfront.id}
          >
            <span className="workfront-label-name">
              <span className="u-num workfront-label-ref">{workfront.reference}</span>
              {workfront.name}
            </span>
            <span className="workfront-label-state">{WORK_STATE_LABEL[workfront.state]}</span>
          </button>
        </MapMarker>
      ))}

      {layers.showMilestones
        ? detail.milestones.map((milestone) => (
            <MapMarker key={milestone.id} lngLat={milestone.position} order={20}>
              <span
                className={`milestone-pin is-${CONFIDENCE_HEALTH[milestone.confidence]}`}
                title={`${milestone.label}. ${CONFIDENCE_LABEL[milestone.confidence]}. ${milestone.date}.`}
              >
                <span className="milestone-pin-mark" aria-hidden="true" />
                <span className="milestone-pin-label">
                  {milestone.label}
                  <span className="u-num milestone-pin-date">
                    {milestone.date} · {CONFIDENCE_LABEL[milestone.confidence]}
                  </span>
                </span>
              </span>
            </MapMarker>
          ))
        : null}

      {layers.showEvidence
        ? detail.evidence.map((item) => (
            <MapMarker key={item.id} lngLat={item.position} order={15}>
              <span className="evidence-pin" title={`${item.label} · ${item.caption}`}>
                <IconImage size={13} />
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
