/* The contextual panel behind a project marker. Enough to decide whether this
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
  HealthChip,
  ProgressBar,
  SectionTitle,
  SourceTag,
  StatusDot,
} from "@/components/ui/primitives";

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
    <aside className="panel" aria-label={`${project.name} summary`}>
      <header className="panel-head">
        <div className="panel-head-top">
          <span className="u-label u-num">{project.reference}</span>
          <button
            type="button"
            className="panel-close"
            onClick={() => selectProject(null)}
            aria-label="Close project panel"
          >
            ×
          </button>
        </div>
        <h2 className="panel-title">{project.name}</h2>
        <p className="panel-sub u-caption">{project.contract}</p>
        <div className="panel-head-status">
          <HealthChip state={status.markerState} />
          {status.freshness === "stale" ? (
            <span className="u-caption">Last refresh {formatAge(project.dataAgeHours)}</span>
          ) : null}
        </div>
      </header>

      <div className="panel-body">
        <section className="panel-section">
          <SectionTitle>Progress against programme</SectionTitle>
          <ProgressBar
            actual={project.progressActual}
            planned={project.progressPlanned}
            state={status.markerState}
          />
          <div className="variance-line">
            <span className={`variance ${status.variance < 0 ? "is-behind" : "is-ok"} u-num`}>
              {formatVariance(status.variance)}
            </span>
            <span className="u-caption">Programme variance</span>
          </div>
        </section>

        <section className="panel-section">
          <SectionTitle>Where it stands</SectionTitle>
          <div className="field-grid">
            <Field label="Current workfront" wide>
              {project.currentWorkfront}
            </Field>
            <Field label="Open issues">
              <span className="u-num">{project.openIssues}</span>
            </Field>
            <Field label="Overdue actions">
              <span className={`u-num${project.overdueActions > 0 ? " is-flagged" : ""}`}>
                {project.overdueActions}
              </span>
            </Field>
            <Field label="Next milestone" wide>
              {project.nextMilestone}
              <span className="field-aside u-num">{project.nextMilestoneDate}</span>
            </Field>
            <Field label="Milestone confidence" wide>
              <HealthChip
                state={CONFIDENCE_HEALTH[project.milestoneConfidence]}
                label={CONFIDENCE_LABEL[project.milestoneConfidence]}
              />
            </Field>
          </div>
        </section>

        <section className="panel-section">
          <SectionTitle>Accountability</SectionTitle>
          <div className="field-grid">
            <Field label="Project Manager">{project.projectManager}</Field>
            <Field label="Operations Manager">{project.operationsManager}</Field>
            <Field label="Region">{region?.label ?? "—"}</Field>
            <Field label="Project type">{type?.label ?? "—"}</Field>
            <Field label="Business unit" wide>
              {unit?.label ?? "—"}
            </Field>
          </div>
        </section>

        <section className="panel-section">
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
            Derived by TACEDGE from {project.signals.length} signals across{" "}
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
                    <span className="signal-state u-label">{SIGNAL_LABEL[signal.state]}</span>
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

      <footer className="panel-foot">
        <div className="freshness">
          <StatusDot state={status.freshness === "stale" ? "stale" : "on-track"} size={7} />
          <span className="u-caption">Last data refresh {formatAge(project.dataAgeHours).toLowerCase()}</span>
        </div>
        {project.hasDetailView ? (
          <Button variant="primary" full onClick={() => openProject(project.id)}>
            View project
          </Button>
        ) : (
          <Button
            variant="secondary"
            full
            disabled
            title="Only the featured project carries a project-level spatial view in this prototype."
          >
            Project view not in this prototype
          </Button>
        )}
      </footer>
    </aside>
  );
}
