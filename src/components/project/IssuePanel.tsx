/* The end of the journey. Where the issue is, why it matters, who owns it and
   what has to happen next, with the system that holds the authoritative record
   named at the bottom. */

import { SEVERITY_HEALTH, SEVERITY_LABEL } from "@/domain/status";
import { ISSUE_CATEGORY_BY_ID, SOURCE_SYSTEM_BY_ID, sourceLabel } from "@/data/reference";
import { ADAPTER_BY_SOURCE } from "@/services/adapters";
import { EVIDENCE_BY_ID, WORKFRONT_BY_ID } from "@/data/featured";
import type { Issue } from "@/domain/types";
import { useViewStore } from "@/state/viewStore";
import { Button, Field, HealthChip, SectionTitle } from "@/components/ui/primitives";

const STATUS_LABEL = {
  open: "Open",
  "in-progress": "In progress",
  "awaiting-response": "Awaiting response",
  closed: "Closed",
} as const;

const EVIDENCE_KIND_LABEL = {
  photo: "Photograph",
  survey: "Survey",
  "test-result": "Test result",
  "field-report": "Field report",
} as const;

export function IssuePanel({ issue }: { issue: Issue }) {
  const selectIssue = useViewStore((s) => s.selectIssue);
  const category = ISSUE_CATEGORY_BY_ID.get(issue.category);
  const workfront = WORKFRONT_BY_ID.get(issue.workfrontId);
  const source = SOURCE_SYSTEM_BY_ID.get(issue.sourceSystemId);
  const adapter = ADAPTER_BY_SOURCE.get(issue.sourceSystemId);
  const evidence = issue.evidenceIds.map((id) => EVIDENCE_BY_ID.get(id)).filter(Boolean);

  return (
    <aside className="panel panel-issue" aria-label={`${issue.title} detail`}>
      <header className="panel-head">
        <div className="panel-head-top">
          <button type="button" className="back-btn back-btn-inline" onClick={() => selectIssue(null)}>
            <span aria-hidden="true">←</span> Project
          </button>
          <span className="u-label u-num">{issue.reference}</span>
        </div>
        <h2 className="panel-title panel-title-sm">{issue.title}</h2>
        <div className="panel-head-status">
          <HealthChip
            state={SEVERITY_HEALTH[issue.severity]}
            label={`${SEVERITY_LABEL[issue.severity]} severity`}
          />
          <span className="chip chip-quiet">{category?.label}</span>
          <span className="chip chip-quiet">{STATUS_LABEL[issue.status]}</span>
          {issue.overdue ? <span className="overdue-flag">Overdue</span> : null}
        </div>
      </header>

      <div className="panel-body">
        <section className="panel-section panel-section-action">
          <SectionTitle>Required next action</SectionTitle>
          <p className="action-text">{issue.nextAction}</p>
          <div className="field-grid">
            <Field label="Action owner" wide>
              {issue.actionOwner}
            </Field>
            <Field label="Due">
              <span className={`u-num${issue.overdue ? " is-flagged" : ""}`}>{issue.dueDate}</span>
            </Field>
            <Field label="Open">
              <span className="u-num">{issue.daysOpen} days</span>
            </Field>
          </div>
        </section>

        <section className="panel-section">
          <SectionTitle>Where</SectionTitle>
          <div className="field-grid">
            <Field label="Location" wide>
              <span className="u-num">{issue.locationLabel}</span>
            </Field>
            <Field label="Workfront" wide>
              {workfront ? `${workfront.reference} ${workfront.name}` : "—"}
            </Field>
            <Field label="Coordinates" wide>
              <span className="u-num">
                {issue.position[1].toFixed(4)}, {issue.position[0].toFixed(4)}
              </span>
            </Field>
          </div>
        </section>

        <section className="panel-section">
          <SectionTitle>Impact</SectionTitle>
          <Field label="Programme" wide>
            {issue.programmeImpact}
          </Field>
          {issue.costImpact ? (
            <Field label="Cost" wide>
              {issue.costImpact}
            </Field>
          ) : null}
        </section>

        <section className="panel-section">
          <SectionTitle>Latest update</SectionTitle>
          <p className="update-text">{issue.latestUpdate}</p>
          <p className="u-caption u-num">{formatStamp(issue.latestUpdateAt)}</p>
        </section>

        <section className="panel-section">
          <SectionTitle>Ownership</SectionTitle>
          <div className="field-grid">
            <Field label="Owner">{issue.owner}</Field>
            <Field label="Role">{issue.ownerRole}</Field>
            <Field label="Identified">
              <span className="u-num">{issue.identifiedOn}</span>
            </Field>
          </div>
        </section>

        <section className="panel-section">
          <SectionTitle>Evidence</SectionTitle>
          {evidence.length === 0 ? (
            <p className="u-caption">No evidence attached.</p>
          ) : (
            <ul className="evidence-list">
              {evidence.map((item) =>
                item ? (
                  <li key={item.id} className="evidence-row">
                    <span className={`evidence-thumb is-${item.kind}`} aria-hidden="true">
                      {item.kind === "photo" ? "▣" : item.kind === "survey" ? "⌖" : "≡"}
                    </span>
                    <span className="evidence-body">
                      <span className="evidence-label">{item.label}</span>
                      <span className="u-caption">{item.caption}</span>
                      <span className="evidence-meta u-caption">
                        {EVIDENCE_KIND_LABEL[item.kind]} · {item.capturedBy} ·{" "}
                        <span className="u-num">{formatStamp(item.capturedAt)}</span> ·{" "}
                        {sourceLabel(item.sourceSystemId)}
                      </span>
                    </span>
                  </li>
                ) : null,
              )}
            </ul>
          )}
          <p className="u-caption evidence-note">
            Evidence is referenced, not stored. The file stays in the system that captured it.
          </p>
        </section>
      </div>

      <footer className="panel-foot panel-foot-source">
        <div className="source-block">
          <span className="u-label">Source system</span>
          <div className="source-block-main">
            <span className="source-block-name">{source?.label ?? "Unknown"}</span>
            <span className="u-num u-caption">{issue.sourceReference}</span>
          </div>
          <p className="u-caption">{source?.role}</p>
          {adapter ? (
            <p className="u-caption source-block-adapter">
              Would read {joinReads(adapter.reads)} over a {adapter.transport}, {adapter.cadence.toLowerCase()}.
              Not connected in this prototype.
            </p>
          ) : null}
        </div>
        <Button
          variant="secondary"
          full
          disabled
          title="Conceptual. This prototype has no integration to open."
        >
          Open in {source?.label ?? "source system"} ↗
        </Button>
      </footer>
    </aside>
  );
}

/** "a, b and c", with only the first item taking a capital. */
function joinReads(reads: string[]): string {
  const parts = reads.map((r, i) => (i === 0 ? r.charAt(0).toLowerCase() + r.slice(1) : r.toLowerCase()));
  if (parts.length < 2) return parts.join("");
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

function formatStamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-NZ", { month: "short" });
  const time = date.toLocaleTimeString("en-NZ", { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${day} ${month} ${date.getFullYear()}, ${time}`;
}
