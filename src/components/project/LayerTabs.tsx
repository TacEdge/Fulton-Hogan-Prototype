/* Layer selection as tabs rather than a stack of checkboxes. Each tab answers
   a question, carries its own count, and the active one is marked with the
   brand orange underline. Work areas are drawn under every view, because the
   corridor is the subject of the map, not a layer on it. */

import type { IssueCategory, ProjectDetail } from "@/domain/types";
import { useViewStore, type LayerView } from "@/state/viewStore";

interface TabSpec {
  view: LayerView;
  label: string;
  category?: IssueCategory;
  countKind?: "issues" | "category" | "evidence";
}

const TABS: TabSpec[] = [
  { view: "all", label: "All layers" },
  { view: "progress", label: "Progress" },
  { view: "issues", label: "Issues", countKind: "issues" },
  { view: "programme", label: "Programme", category: "programme", countKind: "category" },
  { view: "quality", label: "Quality", category: "quality", countKind: "category" },
  { view: "safety", label: "Safety", category: "safety", countKind: "category" },
  { view: "approvals", label: "Approvals", category: "approvals", countKind: "category" },
  { view: "constraints", label: "Constraints", category: "constraints", countKind: "category" },
  { view: "evidence", label: "Evidence", countKind: "evidence" },
];

export function LayerTabs({ detail }: { detail: ProjectDetail }) {
  const layerView = useViewStore((s) => s.layerView);
  const setLayerView = useViewStore((s) => s.setLayerView);

  const countFor = (tab: TabSpec): number | null => {
    if (tab.countKind === "issues") return detail.issues.length;
    if (tab.countKind === "evidence") return detail.evidence.length;
    if (tab.countKind === "category") {
      return detail.issues.filter((i) => i.category === tab.category).length;
    }
    return null;
  };

  return (
    <div className="layer-tabs" role="tablist" aria-label="Map layers">
      {TABS.map((tab) => {
        const count = countFor(tab);
        const empty = tab.countKind === "category" && count === 0;
        const current = layerView === tab.view;
        return (
          <button
            key={tab.view}
            type="button"
            role="tab"
            aria-selected={current}
            className={`layer-tab${current ? " is-current" : ""}${empty ? " is-empty" : ""}`}
            onClick={() => setLayerView(tab.view)}
            disabled={empty}
            title={empty ? `No ${tab.label.toLowerCase()} issues on this project` : undefined}
          >
            <span>{tab.label}</span>
            {count === null ? null : (
              <span className={`layer-tab-count u-num${count === 0 ? " is-zero" : ""}`}>{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
