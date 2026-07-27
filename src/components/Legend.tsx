/* One legend component, two vocabularies. It sits low and quiet: a reader who
   already understands the colours should be able to ignore it. */

import { useState } from "react";

export interface LegendItem {
  key: string;
  label: string;
  swatch: string;
  note?: string;
}

export function Legend({ title, items }: { title: string; items: LegendItem[] }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={`legend${open ? "" : " is-collapsed"}`}>
      <button type="button" className="legend-head" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span className="u-label">{title}</span>
        <span className={`chevron${open ? " is-open" : ""}`} aria-hidden="true" />
      </button>
      {open ? (
        <ul className="legend-list">
          {items.map((item) => (
            <li key={item.key} className="legend-item" title={item.note}>
              <span className={`legend-swatch ${item.swatch}`} aria-hidden="true" />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export const PORTFOLIO_LEGEND: LegendItem[] = [
  { key: "on-track", label: "On track", swatch: "sw-on-track", note: "No signal outside tolerance." },
  {
    key: "attention",
    label: "Attention required",
    swatch: "sw-attention",
    note: "Drifting, but within the project team's control.",
  },
  {
    key: "intervention",
    label: "Intervention required",
    swatch: "sw-intervention",
    note: "Needs a decision above project level.",
  },
  {
    key: "stale",
    label: "Data not current",
    swatch: "sw-stale",
    note: "No refresh in over three days. The last known status is still counted.",
  },
];

/* Work states are not repeated here: the Progress toggles above already carry
   their swatches, and a legend that restates the control beside it is noise. */
export const PROJECT_LEGEND: LegendItem[] = [
  { key: "issue", label: "Issue location", swatch: "sw-issue" },
  { key: "milestone", label: "Milestone", swatch: "sw-milestone", note: "Hover for the date." },
  { key: "evidence", label: "Evidence capture point", swatch: "sw-evidence" },
  { key: "corridor", label: "State highway", swatch: "sw-corridor" },
  { key: "boundary", label: "Project boundary", swatch: "sw-boundary" },
];
