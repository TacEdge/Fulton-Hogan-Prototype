/* ============================================================================
   View state
   ----------------------------------------------------------------------------
   Client-only state: what the user is looking at and what they have filtered
   out. No project content lives here. The map reads it, the panels read it,
   and the URL is deliberately not involved because this is one continuous
   surface rather than a set of pages.
   ========================================================================== */

import { create } from "zustand";
import type { Health, IssueCategory, WorkState } from "@/domain/types";

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

/** Which layers the project view is drawing. */
export interface ProjectLayers {
  work: WorkState[];
  issues: boolean;
  issueCategories: IssueCategory[];
  milestones: boolean;
  evidence: boolean;
}

export const ALL_WORK_STATES: WorkState[] = ["completed", "active", "planned", "blocked", "behind"];

export const DEFAULT_PROJECT_LAYERS: ProjectLayers = {
  work: ALL_WORK_STATES,
  issues: true,
  issueCategories: [],
  milestones: true,
  evidence: false,
};

interface ViewState {
  scope: Scope;
  selectedProjectId: string | null;
  openProjectId: string | null;
  selectedIssueId: string | null;
  hoveredProjectId: string | null;
  selectedWorkfrontId: string | null;
  filters: PortfolioFilters;
  projectLayers: ProjectLayers;
  aboutOpen: boolean;

  selectProject(id: string | null): void;
  hoverProject(id: string | null): void;
  openProject(id: string): void;
  closeProject(): void;
  selectIssue(id: string | null): void;
  selectWorkfront(id: string | null): void;
  toggleFilter<K extends keyof PortfolioFilters>(key: K, value: PortfolioFilters[K][number]): void;
  clearFilters(): void;
  setProjectLayers(update: Partial<ProjectLayers>): void;
  toggleWorkState(state: WorkState): void;
  toggleIssueCategory(category: IssueCategory): void;
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
  projectLayers: DEFAULT_PROJECT_LAYERS,
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
      projectLayers: DEFAULT_PROJECT_LAYERS,
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

  setProjectLayers: (update) =>
    set((state) => ({ projectLayers: { ...state.projectLayers, ...update } })),
  toggleWorkState: (state) =>
    set((s) => ({ projectLayers: { ...s.projectLayers, work: toggle(s.projectLayers.work, state) } })),
  toggleIssueCategory: (category) =>
    set((s) => ({
      projectLayers: {
        ...s.projectLayers,
        issueCategories: toggle(s.projectLayers.issueCategories, category),
      },
    })),

  setAboutOpen: (open) => set({ aboutOpen: open }),
}));
