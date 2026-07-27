/* Portfolio filters. A single column of toggle groups, collapsed by default
   past the two most-used ones so the map keeps the space. */

import { useState } from "react";
import {
  BUSINESS_UNITS,
  ISSUE_CATEGORIES,
  PROJECT_TYPES,
  REGIONS,
} from "@/data/reference";
import { useFiltersActive, useProjects } from "@/hooks/usePortfolio";
import { useViewStore } from "@/state/viewStore";

interface GroupProps {
  title: string;
  count: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function Group({ title, count, defaultOpen = false, children }: GroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="filter-group">
      <button
        type="button"
        className="filter-group-head"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="u-label">{title}</span>
        <span className="filter-group-meta">
          {count > 0 ? <span className="filter-count u-num">{count}</span> : null}
          <span className={`chevron${open ? " is-open" : ""}`} aria-hidden="true" />
        </span>
      </button>
      {open ? <div className="filter-group-body">{children}</div> : null}
    </section>
  );
}

export function FilterRail() {
  const filters = useViewStore((s) => s.filters);
  const toggleFilter = useViewStore((s) => s.toggleFilter);
  const clearFilters = useViewStore((s) => s.clearFilters);
  const active = useFiltersActive();
  const projects = useProjects();

  const countIn = (predicate: (regionOrUnitId: string) => boolean, key: "regionId" | "businessUnitId" | "typeId") =>
    projects.filter((p) => predicate(p.project[key])).length;

  return (
    <aside className="rail" aria-label="Filters">
      <div className="rail-head">
        <span className="u-label">Filter</span>
        {active > 0 ? (
          <button type="button" className="link-btn" onClick={clearFilters}>
            Clear all
          </button>
        ) : null}
      </div>

      <Group title="Region" count={filters.regionIds.length} defaultOpen>
        <ul className="toggle-list">
          {REGIONS.map((region) => {
            const n = countIn((id) => id === region.id, "regionId");
            if (n === 0) return null;
            const on = filters.regionIds.includes(region.id);
            return (
              <li key={region.id}>
                <button
                  type="button"
                  className={`toggle${on ? " is-on" : ""}`}
                  aria-pressed={on}
                  onClick={() => toggleFilter("regionIds", region.id)}
                >
                  <span className="u-truncate">{region.label}</span>
                  <span className="toggle-count u-num">{n}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </Group>

      <Group title="Business unit" count={filters.businessUnitIds.length}>
        <ul className="toggle-list">
          {BUSINESS_UNITS.map((unit) => {
            const n = countIn((id) => id === unit.id, "businessUnitId");
            const on = filters.businessUnitIds.includes(unit.id);
            return (
              <li key={unit.id}>
                <button
                  type="button"
                  className={`toggle${on ? " is-on" : ""}`}
                  aria-pressed={on}
                  onClick={() => toggleFilter("businessUnitIds", unit.id)}
                  title={unit.note}
                >
                  <span className="u-truncate">{unit.label}</span>
                  <span className="toggle-count u-num">{n}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="filter-note u-caption">Business unit structure is inferred for this prototype.</p>
      </Group>

      <Group title="Project type" count={filters.typeIds.length}>
        <ul className="toggle-list">
          {PROJECT_TYPES.map((type) => {
            const n = countIn((id) => id === type.id, "typeId");
            if (n === 0) return null;
            const on = filters.typeIds.includes(type.id);
            return (
              <li key={type.id}>
                <button
                  type="button"
                  className={`toggle${on ? " is-on" : ""}`}
                  aria-pressed={on}
                  onClick={() => toggleFilter("typeIds", type.id)}
                >
                  <span className="u-truncate">{type.label}</span>
                  <span className="toggle-count u-num">{n}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </Group>

      <Group title="Issue category" count={filters.issueCategories.length}>
        <ul className="toggle-list">
          {ISSUE_CATEGORIES.map((category) => {
            const on = filters.issueCategories.includes(category.id);
            return (
              <li key={category.id}>
                <button
                  type="button"
                  className={`toggle${on ? " is-on" : ""}`}
                  aria-pressed={on}
                  onClick={() => toggleFilter("issueCategories", category.id)}
                  title={category.note}
                >
                  <span className="u-truncate">{category.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="filter-note u-caption">
          Shows projects with a signal reading outside tolerance in that category.
        </p>
      </Group>
    </aside>
  );
}
