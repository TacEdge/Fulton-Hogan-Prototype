/* Data hooks. UI components consume these rather than reaching into the data
   modules, so the demonstration source can be swapped for a live one in a
   single place (see services/adapters.ts). */

import { useMemo } from "react";
import { demoPicture } from "@/services/adapters";
import { issueCategoriesOf, statusOf, summarise, type ProjectStatus } from "@/domain/status";
import type { Project } from "@/domain/types";
import { useViewStore, type PortfolioFilters } from "@/state/viewStore";

export interface ProjectWithStatus {
  project: Project;
  status: ProjectStatus;
}

function passes(entry: ProjectWithStatus, filters: PortfolioFilters): boolean {
  const { project, status } = entry;
  if (filters.regionIds.length && !filters.regionIds.includes(project.regionId)) return false;
  if (filters.businessUnitIds.length && !filters.businessUnitIds.includes(project.businessUnitId)) return false;
  if (filters.typeIds.length && !filters.typeIds.includes(project.typeId)) return false;
  if (filters.healths.length && !filters.healths.includes(status.markerState)) return false;
  if (filters.issueCategories.length) {
    const categories = issueCategoriesOf(project);
    if (!filters.issueCategories.some((c) => categories.includes(c))) return false;
  }
  return true;
}

export function useProjects(): ProjectWithStatus[] {
  return useMemo(
    () => demoPicture.listProjects().map((project) => ({ project, status: statusOf(project) })),
    [],
  );
}

export function useFilteredProjects(): ProjectWithStatus[] {
  const all = useProjects();
  const filters = useViewStore((s) => s.filters);
  return useMemo(() => all.filter((entry) => passes(entry, filters)), [all, filters]);
}

export function usePortfolioSummary(projects: ProjectWithStatus[]) {
  return useMemo(() => summarise(projects.map((p) => p.project)), [projects]);
}

export function useProject(id: string | null) {
  return useMemo(() => {
    if (!id) return null;
    const project = demoPicture.getProject(id);
    if (!project) return null;
    return { project, status: statusOf(project) } satisfies ProjectWithStatus;
  }, [id]);
}

export function useProjectDetail(id: string | null) {
  return useMemo(() => (id ? (demoPicture.getProjectDetail(id) ?? null) : null), [id]);
}

export function useFiltersActive(): number {
  const filters = useViewStore((s) => s.filters);
  return (
    filters.regionIds.length +
    filters.businessUnitIds.length +
    filters.typeIds.length +
    filters.healths.length +
    filters.issueCategories.length
  );
}
