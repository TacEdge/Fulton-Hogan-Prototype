/* ============================================================================
   View state
   ----------------------------------------------------------------------------
   Client-only state: what the user is looking at and what they have filtered
   out. No project content lives here. The map reads it, the panels read it,
   and the URL is deliberately not involved because this is one continuous
   surface rather than a set of pages.
   ========================================================================== */

import { create } from "zustand";
import type { Health, IssueCategory } from "@/domain/types";

export type Scope = "portfolio" | "project";

export interface PortfolioFilters {
  regionIds: string[];
  businessUnitIds: string[];
  typeIds: string[];
  healths: (Health | "stale")[];
  issueCategories: IssueCategory[];
}

export const EMPTY_FILTERS: PortfolioFilters = {
  regionIds: [],
  businessUnitIds: [],
  typeIds: [],
  healths: [],
  issueCategories: [],
};

/** What the project map is showing. One view at a time rather than a stack of
 *  toggles: the layer bar is there to answer a question, not to configure a
 *  GIS. Work areas are always drawn, because the corridor is the subject. */
export type LayerView =
  | "all"
  | "progress"
  | "issues"
  | "programme"
  | "quality"
  | "safety"
  | "approvals"
  | "constraints"
  | "evidence";

/** Layer views that resolve to a single issue category. */
export const CATEGORY_VIEWS: Partial<Record<LayerView, IssueCategory>> = {
  programme: "programme",
  quality: "quality",
  safety: "safety",
  approvals: "approvals",
  constraints: "constraints",
};

export interface ResolvedLayers {
  showIssues: boolean;
  issueCategory: IssueCategory | null;
  showMilestones: boolean;
  showEvidence: boolean;
}

export function resolveLayers(view: LayerView): ResolvedLayers {
  if (view === "progress") {
    return { showIssues: false, issueCategory: null, showMilestones: true, showEvidence: false };
  }
  if (view === "evidence") {
    return { showIssues: false, issueCategory: null, showMilestones: false, showEvidence: true };
  }
  const category = CATEGORY_VIEWS[view] ?? null;
  return {
    showIssues: true,
    issueCategory: category,
    showMilestones: view === "all",
    showEvidence: false,
  };
}

interface ViewState {
  scope: Scope;
  selectedProjectId: string | null;
  openProjectId: string | null;
  selectedIssueId: string | null;
  hoveredProjectId: string | null;
  selectedWorkfrontId: string | null;
  filters: PortfolioFilters;
  layerView: LayerView;
  aboutOpen: boolean;

  selectProject(id: string | null): void;
  hoverProject(id: string | null): void;
  openProject(id: string): void;
  closeProject(): void;
  selectIssue(id: string | null): void;
  selectWorkfront(id: string | null): void;
  toggleFilter<K extends keyof PortfolioFilters>(key: K, value: PortfolioFilters[K][number]): void;
  clearFilters(): void;
  setLayerView(view: LayerView): void;
  setAboutOpen(open: boolean): void;
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export const useViewStore = create<ViewState>((set) => ({
  scope: "portfolio",
  selectedProjectId: null,
  openProjectId: null,
  selectedIssueId: null,
  hoveredProjectId: null,
  selectedWorkfrontId: null,
  filters: EMPTY_FILTERS,
  layerView: "all",
  aboutOpen: false,

  selectProject: (id) => set({ selectedProjectId: id }),
  hoverProject: (id) => set({ hoveredProjectId: id }),
  openProject: (id) =>
    set({
      scope: "project",
      openProjectId: id,
      selectedProjectId: id,
      selectedIssueId: null,
      selectedWorkfrontId: null,
      layerView: "all",
    }),
  closeProject: () =>
    set({
      scope: "portfolio",
      openProjectId: null,
      selectedIssueId: null,
      selectedWorkfrontId: null,
    }),
  selectIssue: (id) => set({ selectedIssueId: id, selectedWorkfrontId: null }),
  selectWorkfront: (id) => set({ selectedWorkfrontId: id, selectedIssueId: null }),

  toggleFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: toggle(state.filters[key] as unknown[], value) },
    })),
  clearFilters: () => set({ filters: EMPTY_FILTERS }),

  setLayerView: (view) => set({ layerView: view }),

  setAboutOpen: (open) => set({ aboutOpen: open }),
}));
