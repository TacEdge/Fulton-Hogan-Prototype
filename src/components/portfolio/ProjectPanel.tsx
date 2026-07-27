/* The contextual drawer behind a project marker. Enough to decide whether this
   project needs you, and one way in if it does. */

import { useState } from "react";
import {
  CONFIDENCE_HEALTH,
  CONFIDENCE_LABEL,
  DIMENSION_LABEL,
  HEALTH_LABEL,
  SIGNAL_LABEL,
  bySeverityThenDimension,
  formatAge,
  formatVariance,
} from "@/domain/status";
import { BUSINESS_UNIT_BY_ID, PROJECT_TYPE_BY_ID, REGION_BY_ID, sourceLabel } from "@/data/reference";
import { useProject } from "@/hooks/usePortfolio";
import { useViewStore } from "@/state/viewStore";
import {
  Button,
  Field,
  OpenInSourceButton,
  ProgressMeter,
  ReadoutRow,
  SectionTitle,
  SourceTag,
  StatusBadge,
  StatusDot,
  StatusPill,
} from "@/components/ui/primitives";
import { IconArrowRight, IconClose } from "@/components/ui/icons";

export function ProjectPanel() {
  const selectedProjectId = useViewStore((s) => s.selectedProjectId);
  const selectProject = useViewStore((s) => s.selectProject);
  const openProject = useViewStore((s) => s.openProject);
  const entry = useProject(selectedProjectId);
  const [signalsOpen, setSignalsOpen] = useState(false);

  if (!entry) return null;
  const { project, status } = entry;
  const region = REGION_BY_ID.get(project.regionId);
  const unit = BUSINESS_UNIT_BY_ID.get(project.businessUnitId);
  const type = PROJECT_TYPE_BY_ID.get(project.typeId);
  const signals = [...project.signals].sort(bySeverityThenDimension);

  return (
    <aside className="drawer" aria-label={`${project.name} summary`}>
      <header className="drawer-head">
        <div className="drawer-head-line">
          <StatusDot state={status.markerState} size={11} />
          <h2 className="drawer-title">{project.name}</h2>
          <button
            type="button"
            className="icon-btn"
            onClick={() => selectProject(null)}
            aria-label="Close project panel"
          >
            <IconClose size={18} />
          </button>
        </div>
        <div className="drawer-head-meta">
          <StatusBadge state={status.markerState} />
          <span className="u-caption u-num">{project.reference}</span>
        </div>
      </header>

      <div className="drawer-body">
        <section className="drawer-section">
          <div className="field-grid field-grid-3">
            <Field label="Region">{region?.label ?? "—"}</Field>
            <Field label="Business unit">{unit?.label ?? "—"}</Field>
            <Field label="Project type">{type?.label ?? "—"}</Field>
            <Field label="Project Manager">{project.projectManager}</Field>
            <Field label="Operations Manager">{project.operationsManager}</Field>
            <Field label="Contract" wide>
              {project.contract}
            </Field>
          </div>
        </section>

        <section className="drawer-section progress-block">
          <div className="progress-columns">
            <div className="progress-column">
              <span className="u-eyebrow">Actual progress</span>
              <span className="progress-number u-num">{project.progressActual}%</span>
              <ProgressMeter value={project.progressActual} state={status.markerState} />
            </div>
            <div className="progress-column">
              <span className="u-eyebrow">Planned progress</span>
              <span className="progress-number u-num is-quiet">{project.progressPlanned}%</span>
              <ProgressMeter value={project.progressPlanned} state="planned" />
            </div>
            <div className="progress-column">
              <span className="u-eyebrow">Variance</span>
              <span className={`progress-number u-num${status.variance < 0 ? " is-behind" : ""}`}>
                {status.variance > 0 ? "+" : ""}
                {status.variance}%
              </span>
              <span className="u-caption">{formatVariance(status.variance)}</span>
            </div>
          </div>
        </section>

        <section className="drawer-section">
          <div className="readout-column">
            <ReadoutRow label="Overall health">
              <StatusPill state={status.markerState} />
            </ReadoutRow>
            <ReadoutRow label="Current workfront">
              <span className="u-truncate" title={project.currentWorkfront}>
                {project.currentWorkfront}
              </span>
            </ReadoutRow>
            <ReadoutRow label="Open issues">
              <span className="u-num">{project.openIssues}</span>
            </ReadoutRow>
            <ReadoutRow label="Overdue actions">
              <span className={`u-num${project.overdueActions > 0 ? " is-flagged" : ""}`}>
                {project.overdueActions}
              </span>
            </ReadoutRow>
            <ReadoutRow label="Next milestone">
              <span className="u-truncate" title={project.nextMilestone}>
                {project.nextMilestone}
              </span>
            </ReadoutRow>
            <ReadoutRow label="Milestone date">
              <span className="u-num">{project.nextMilestoneDate}</span>
            </ReadoutRow>
            <ReadoutRow label="Milestone confidence">
              <StatusPill
                state={CONFIDENCE_HEALTH[project.milestoneConfidence]}
                label={CONFIDENCE_LABEL[project.milestoneConfidence]}
              />
            </ReadoutRow>
            <ReadoutRow label="Data freshness">
              <span className="freshness">
                <StatusDot state={status.freshness === "stale" ? "stale" : "on-track"} size={8} />
                {formatAge(project.dataAgeHours)}
              </span>
            </ReadoutRow>
          </div>
        </section>

        <section className="drawer-section">
          <SectionTitle
            action={
              <button
                type="button"
                className="link-btn"
                aria-expanded={signalsOpen}
                onClick={() => setSignalsOpen((v) => !v)}
              >
                {signalsOpen ? "Hide signals" : "Show signals"}
              </button>
            }
          >
            Why it reads {HEALTH_LABEL[status.markerState].toLowerCase()}
          </SectionTitle>
          <p className="rationale">{status.rationale}</p>
          <p className="derivation u-caption">
            Derived from {project.signals.length} signals across{" "}
            {new Set(project.signals.map((s) => s.sourceSystemId)).size} systems. Demonstration logic.
          </p>

          {signalsOpen ? (
            <ul className="signal-list">
              {signals.map((signal) => (
                <li key={signal.id} className={`signal is-${signal.state}`}>
                  <div className="signal-head">
                    <StatusDot
                      state={
                        signal.state === "act"
                          ? "intervention"
                          : signal.state === "watch"
                            ? "attention"
                            : signal.state === "unknown"
                              ? "stale"
                              : "on-track"
                      }
                      size={8}
                    />
                    <span className="signal-dimension">{DIMENSION_LABEL[signal.dimension]}</span>
                    <span className="signal-state">{SIGNAL_LABEL[signal.state]}</span>
                  </div>
                  <p className="signal-value">{signal.value}</p>
                  {signal.note ? <p className="signal-note u-caption">{signal.note}</p> : null}
                  <div className="signal-foot">
                    <SourceTag label={sourceLabel(signal.sourceSystemId)} compact />
                    <span className="u-caption">{formatAge(signal.ageHours)}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </div>

      <footer className="drawer-foot">
        {project.hasDetailView ? (
          <Button
            variant="primary"
            onClick={() => openProject(project.id)}
            iconAfter={<IconArrowRight size={16} />}
          >
            View project
          </Button>
        ) : (
          <Button
            variant="secondary"
            disabled
            title="Only the featured project carries a project-level spatial view in this prototype."
          >
            Project view not in this prototype
          </Button>
        )}
        <OpenInSourceButton label="Project Controls" />
      </footer>
    </aside>
  );
}
