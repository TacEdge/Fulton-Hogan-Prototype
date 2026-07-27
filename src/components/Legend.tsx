/* One legend component, two vocabularies. It sits over the map, quiet and
   collapsible: a reader who already knows the colours should be able to fold
   it away, and nobody should have to consult it to read a status, because
   every status carries its label wherever it appears. */

import { useState } from "react";
import { IconChevronDown } from "./ui/icons";

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
        <span className="u-eyebrow">{title}</span>
        <IconChevronDown size={15} className={`legend-chevron${open ? " is-open" : ""}`} />
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

export const PROJECT_LEGEND: LegendItem[] = [
  { key: "completed", label: "Completed", swatch: "sw-completed" },
  { key: "active", label: "In progress", swatch: "sw-active" },
  { key: "behind", label: "Behind programme", swatch: "sw-behind" },
  { key: "blocked", label: "Blocked", swatch: "sw-blocked" },
  { key: "planned", label: "Planned", swatch: "sw-planned" },
  { key: "issue", label: "Issue location", swatch: "sw-issue" },
  { key: "milestone", label: "Milestone", swatch: "sw-milestone", note: "Hover for the date." },
  { key: "evidence", label: "Evidence", swatch: "sw-evidence" },
];
