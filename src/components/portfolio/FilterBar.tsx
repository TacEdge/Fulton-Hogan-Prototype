/* Portfolio filters as a compact horizontal row, so the left of the map stays
   free. Active filters are visible in each control and the reset is one click. */

import { HEALTH_LABEL } from "@/domain/status";
import {
  BUSINESS_UNITS,
  ISSUE_CATEGORIES,
  PROJECT_TYPES,
  REGIONS,
} from "@/data/reference";
import { useFiltersActive, useProjects } from "@/hooks/usePortfolio";
import { useViewStore } from "@/state/viewStore";
import { FilterSelect, type FilterOption } from "@/components/ui/FilterSelect";
import { StatusDot } from "@/components/ui/primitives";
import type { Health } from "@/domain/types";

const HEALTH_ORDER: (Health | "stale")[] = ["on-track", "attention", "intervention", "stale"];

export function FilterBar() {
  const filters = useViewStore((s) => s.filters);
  const toggleFilter = useViewStore((s) => s.toggleFilter);
  const clearFilters = useViewStore((s) => s.clearFilters);
  const active = useFiltersActive();
  const projects = useProjects();

  const countBy = (key: "regionId" | "businessUnitId" | "typeId", id: string) =>
    projects.filter((p) => p.project[key] === id).length;

  const regionOptions: FilterOption[] = REGIONS.map((r) => ({
    id: r.id,
    label: r.label,
    count: countBy("regionId", r.id),
  })).filter((o) => o.count > 0);

  const unitOptions: FilterOption[] = BUSINESS_UNITS.map((u) => ({
    id: u.id,
    label: u.label,
    hint: u.note,
    count: countBy("businessUnitId", u.id),
  }));

  const typeOptions: FilterOption[] = PROJECT_TYPES.map((t) => ({
    id: t.id,
    label: t.label,
    count: countBy("typeId", t.id),
  })).filter((o) => o.count > 0);

  const statusOptions: FilterOption[] = HEALTH_ORDER.map((state) => ({
    id: state,
    label: HEALTH_LABEL[state],
    swatch: <StatusDot state={state} size={9} />,
  }));

  const categoryOptions: FilterOption[] = ISSUE_CATEGORIES.map((c) => ({
    id: c.id,
    label: c.label,
    hint: c.note,
  }));

  return (
    <div className="filter-bar" role="group" aria-label="Filters">
      <FilterSelect
        label="Region"
        allLabel="All regions"
        options={regionOptions}
        selected={filters.regionIds}
        onToggle={(id) => toggleFilter("regionIds", id)}
      />
      <FilterSelect
        label="Business unit"
        allLabel="All business units"
        options={unitOptions}
        selected={filters.businessUnitIds}
        onToggle={(id) => toggleFilter("businessUnitIds", id)}
        note="Business unit structure is inferred for this prototype."
      />
      <FilterSelect
        label="Project type"
        allLabel="All types"
        options={typeOptions}
        selected={filters.typeIds}
        onToggle={(id) => toggleFilter("typeIds", id)}
      />
      <FilterSelect
        label="Status"
        allLabel="All statuses"
        options={statusOptions}
        selected={filters.healths}
        onToggle={(id) => toggleFilter("healths", id as Health | "stale")}
      />
      <FilterSelect
        label="Issue category"
        allLabel="All categories"
        options={categoryOptions}
        selected={filters.issueCategories}
        onToggle={(id) => toggleFilter("issueCategories", id as (typeof ISSUE_CATEGORIES)[number]["id"])}
        note="Shows projects with a signal reading outside tolerance in that category."
      />

      <div className="filter-bar-tail">
        {active > 0 ? (
          <span className="filter-bar-count u-caption">
            {active} {active === 1 ? "filter" : "filters"} applied
          </span>
        ) : null}
        <button type="button" className="btn btn-secondary btn-sm" onClick={clearFilters} disabled={active === 0}>
          Reset
        </button>
      </div>
    </div>
  );
}
