/* The end of the journey. Where the issue is, why it matters, who owns it and
   what has to happen next, with the system that holds the authoritative record
   named at the bottom.

   The pager exists because a leader who has come this far usually wants all
   four, not one. */

import { SEVERITY_HEALTH, SEVERITY_LABEL } from "@/domain/status";
import { ISSUE_CATEGORY_BY_ID, SOURCE_SYSTEM_BY_ID, sourceLabel } from "@/data/reference";
import { ADAPTER_BY_SOURCE } from "@/services/adapters";
import { EVIDENCE_BY_ID, WORKFRONT_BY_ID } from "@/data/featured";
import type { Issue } from "@/domain/types";
import { useViewStore } from "@/state/viewStore";
import {
  Field,
  OpenInSourceButton,
  ReadoutRow,
  SectionTitle,
  StatusBadge,
} from "@/components/ui/primitives";
import {
  IconArrowLeft,
  IconChevronLeft,
  IconChevronRight,
  IconClose,
  IconImage,
} from "@/components/ui/icons";

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

export function IssuePanel({ issue, siblings }: { issue: Issue; siblings: Issue[] }) {
  const selectIssue = useViewStore((s) => s.selectIssue);
  const category = ISSUE_CATEGORY_BY_ID.get(issue.category);
  const workfront = WORKFRONT_BY_ID.get(issue.workfrontId);
  const source = SOURCE_SYSTEM_BY_ID.get(issue.sourceSystemId);
  const adapter = ADAPTER_BY_SOURCE.get(issue.sourceSystemId);
  const evidence = issue.evidenceIds.map((id) => EVIDENCE_BY_ID.get(id)).filter(Boolean);

  const index = siblings.findIndex((i) => i.id === issue.id);
  const previous = index > 0 ? siblings[index - 1] : null;
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;

  return (
    <aside className="drawer drawer-issue" aria-label={`${issue.title} detail`}>
      <div className="drawer-pager">
        <button type="button" className="link-btn link-btn-icon" onClick={() => selectIssue(null)}>
          <IconArrowLeft size={15} />
          <span>All issues</span>
        </button>
        <span className="drawer-pager-position u-num">
          Issue {index + 1} of {siblings.length}
        </span>
        <span className="drawer-pager-controls">
          <button
            type="button"
            className="icon-btn"
            disabled={!previous}
            onClick={() => previous && selectIssue(previous.id)}
            aria-label="Previous issue"
          >
            <IconChevronLeft size={17} />
          </button>
          <button
            type="button"
            className="icon-btn"
            disabled={!next}
            onClick={() => next && selectIssue(next.id)}
            aria-label="Next issue"
          >
            <IconChevronRight size={17} />
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => selectIssue(null)}
            aria-label="Close issue panel"
          >
            <IconClose size={17} />
          </button>
        </span>
      </div>

      <header className="drawer-head">
        <div className="drawer-head-line">
          <h2 className="drawer-title drawer-title-sm">{issue.title}</h2>
        </div>
        <div className="drawer-head-meta">
          <StatusBadge
            state={SEVERITY_HEALTH[issue.severity]}
            label={`${SEVERITY_LABEL[issue.severity]} severity`}
          />
          <span className="chip">{category?.label}</span>
          <span className="chip">{STATUS_LABEL[issue.status]}</span>
          {issue.overdue ? <span className="overdue-flag">Overdue</span> : null}
          <span className="u-caption u-num">{issue.reference}</span>
        </div>
      </header>

      <div className="drawer-body">
        <section className="drawer-section action-block">
          <SectionTitle>Required next action</SectionTitle>
          <p className="action-text">{issue.nextAction}</p>
          <div className="readout-column">
            <ReadoutRow label="Action owner">{issue.actionOwner}</ReadoutRow>
            <ReadoutRow label="Due">
              <span className={`u-num${issue.overdue ? " is-flagged" : ""}`}>{issue.dueDate}</span>
            </ReadoutRow>
            <ReadoutRow label="Time open">
              <span className="u-num">{issue.daysOpen} days</span>
            </ReadoutRow>
          </div>
        </section>

        <section className="drawer-section">
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

        <section className="drawer-section">
          <SectionTitle>Ownership and impact</SectionTitle>
          <div className="field-grid">
            <Field label="Owner">{issue.owner}</Field>
            <Field label="Role">{issue.ownerRole}</Field>
            <Field label="Identified">
              <span className="u-num">{issue.identifiedOn}</span>
            </Field>
            <Field label="Status">{STATUS_LABEL[issue.status]}</Field>
            <Field label="Programme impact" wide>
              {issue.programmeImpact}
            </Field>
            {issue.costImpact ? (
              <Field label="Cost impact" wide>
                {issue.costImpact}
              </Field>
            ) : null}
          </div>
        </section>

        <section className="drawer-section">
          <SectionTitle>Latest update</SectionTitle>
          <p className="update-text">{issue.latestUpdate}</p>
          <p className="u-caption u-num">{formatStamp(issue.latestUpdateAt)}</p>
        </section>

        <section className="drawer-section">
          <SectionTitle>Evidence</SectionTitle>
          {evidence.length === 0 ? (
            <p className="u-caption">No evidence attached.</p>
          ) : (
            <ul className="evidence-list">
              {evidence.map((item) =>
                item ? (
                  <li key={item.id} className="evidence-row">
                    <span className="evidence-thumb" aria-hidden="true">
                      <IconImage size={20} />
                      <span className="evidence-thumb-note">No image</span>
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
            Evidence is referenced, not stored: the file stays in the system that captured it. No
            photographs are included in this prototype.
          </p>
        </section>

        <section className="drawer-section">
          <SectionTitle>Source system</SectionTitle>
          <div className="source-block">
            <div className="source-block-main">
              <span className="source-block-name">{source?.label ?? "Unknown"}</span>
              <span className="u-num u-caption">{issue.sourceReference}</span>
            </div>
            <p className="u-caption">{source?.role}</p>
            {adapter ? (
              <p className="u-caption source-block-adapter">
                Would read {joinReads(adapter.reads)} over a {adapter.transport},{" "}
                {adapter.cadence.toLowerCase()}. Not connected in this prototype.
              </p>
            ) : null}
          </div>
        </section>
      </div>

      <footer className="drawer-foot">
        <OpenInSourceButton label={source?.label ?? "source system"} full />
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
