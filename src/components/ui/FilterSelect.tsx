/* A compact horizontal filter control: label above, current selection in the
   control, options in a popover. Multi-select, because a regional manager
   wants two regions rather than one at a time, and the summary line always
   says what is currently applied. */

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { IconChevronDown } from "./icons";

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
  hint?: string;
  swatch?: ReactNode;
}

interface FilterSelectProps {
  label: string;
  options: FilterOption[];
  selected: string[];
  onToggle(id: string): void;
  /** Shown when nothing is selected. */
  allLabel?: string;
  note?: string;
}

export function FilterSelect({
  label,
  options,
  selected,
  onToggle,
  allLabel = "All",
  note,
}: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const summary =
    selected.length === 0
      ? allLabel
      : selected.length === 1
        ? (options.find((o) => o.id === selected[0])?.label ?? "1 selected")
        : `${selected.length} selected`;

  return (
    <div className="filter-select" ref={rootRef}>
      <span className="filter-select-label" id={`${id}-label`}>
        {label}
      </span>
      <button
        type="button"
        className={`filter-select-control${selected.length ? " is-active" : ""}`}
        aria-expanded={open}
        aria-haspopup="true"
        aria-labelledby={`${id}-label`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="u-truncate">{summary}</span>
        <IconChevronDown size={16} className={`filter-select-chevron${open ? " is-open" : ""}`} />
      </button>

      {open ? (
        <div className="filter-popover" role="group" aria-labelledby={`${id}-label`}>
          <ul className="filter-popover-list">
            {options.map((option) => {
              const on = selected.includes(option.id);
              return (
                <li key={option.id}>
                  <label className={`filter-option${on ? " is-on" : ""}`} title={option.hint}>
                    <input type="checkbox" checked={on} onChange={() => onToggle(option.id)} />
                    <span className="filter-option-box" aria-hidden="true" />
                    {option.swatch}
                    <span className="u-truncate">{option.label}</span>
                    {option.count === undefined ? null : (
                      <span className="filter-option-count u-num">{option.count}</span>
                    )}
                  </label>
                </li>
              );
            })}
          </ul>
          {note ? <p className="filter-popover-note u-caption">{note}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
