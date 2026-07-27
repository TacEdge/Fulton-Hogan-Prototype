/* Camera choreography. One component owns every camera move so the map never
   fights itself, and so the transitions stay restrained: the reader should
   always be able to tell where they just came from.

   Chrome clearance is handled once, as map padding, rather than per call.
   MapLibre adds any per-call padding on top of the map's own, so mixing the
   two silently double-counts and everything ends up too far out. */

import { useEffect, useRef } from "react";
import { useMap } from "./MapCanvas";
import { useViewStore } from "@/state/viewStore";
import { useProject, useProjectDetail } from "@/hooks/usePortfolio";

/** Main-islands bounds. The portfolio always frames the country, whatever the
 *  viewport is doing. */
const NZ_BOUNDS: [[number, number], [number, number]] = [
  [166.3, -47.4],
  [178.7, -34.3],
];

/** Reframes whatever the reader is currently looking at. Exposed so the map
 *  controls and the camera agree on what "the whole picture" means. */
export function useReframe(): () => void {
  const { map, ready } = useMap();
  const scope = useViewStore((s) => s.scope);
  const openProjectId = useViewStore((s) => s.openProjectId);
  const selectedProjectId = useViewStore((s) => s.selectedProjectId);
  const detail = useProjectDetail(openProjectId);

  return () => {
    if (!map || !ready) return;
    if (scope === "project" && detail) {
      map.fitBounds(ringBounds(detail.boundary), { padding: framePadding(), duration: 700, maxZoom: 14 });
      return;
    }
    map.fitBounds(NZ_BOUNDS, {
      padding: framePadding(Boolean(selectedProjectId)),
      duration: 700,
      maxZoom: 7,
    });
  };
}

export function MapCamera() {
  const { map, ready } = useMap();
  const scope = useViewStore((s) => s.scope);
  const openProjectId = useViewStore((s) => s.openProjectId);
  const selectedProjectId = useViewStore((s) => s.selectedProjectId);
  const selectedIssueId = useViewStore((s) => s.selectedIssueId);
  const selectedWorkfrontId = useViewStore((s) => s.selectedWorkfrontId);

  const openProject = useProject(openProjectId);
  const detail = useProjectDetail(openProjectId);
  const selected = useProject(selectedProjectId);
  const lastScope = useRef<string | null>(null);

  const reduced = usePrefersReducedMotion();

  /* Scope changes: portfolio frames the country, project frames the corridor. */
  useEffect(() => {
    if (!map || !ready) return;
    const key = `${scope}:${openProjectId ?? ""}`;
    if (lastScope.current === key) return;
    lastScope.current = key;

    if (scope === "portfolio") {
      map.fitBounds(NZ_BOUNDS, {
        padding: framePadding(false),
        duration: reduced ? 0 : 1400,
        maxZoom: 7,
      });
      return;
    }
    if (detail) {
      map.fitBounds(ringBounds(detail.boundary), {
        padding: framePadding(),
        duration: reduced ? 0 : 1600,
        bearing: detail.view.bearing,
        maxZoom: 14,
      });
    }
  }, [map, ready, scope, openProjectId, detail, reduced]);

  /* Refit when the viewport changes, so the chrome never crowds the subject. */
  useEffect(() => {
    if (!map || !ready) return;
    const onResize = () => {
      const bounds =
        scope === "project" && detail ? ringBounds(detail.boundary) : NZ_BOUNDS;
      if (scope === "project" && (selectedIssueId || selectedWorkfrontId)) return;
      map.fitBounds(bounds, {
        padding: framePadding(scope === "project"),
        duration: 0,
        maxZoom: scope === "project" ? 14 : 7,
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [map, ready, scope, detail, selectedIssueId, selectedWorkfrontId]);

  /* Selecting a project on the portfolio nudges it into the clear rather than
     zooming. Losing the national context to read one project is a bad trade. */
  useEffect(() => {
    if (!map || !ready || scope !== "portfolio") return;
    if (!selected) {
      /* Panel closed: the country goes back to sitting in the whole frame. */
      map.fitBounds(NZ_BOUNDS, {
        padding: framePadding(false),
        duration: reduced ? 0 : 700,
        maxZoom: 7,
      });
      return;
    }
    map.easeTo({
      center: selected.project.position,
      offset: frameOffset(),
      duration: reduced ? 0 : 700,
      essential: true,
    });
    // Only when the selection itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, ready, scope, selectedProjectId]);

  /* An issue is a place. Selecting one goes there. */
  useEffect(() => {
    if (!map || !ready || scope !== "project" || !detail || !selectedIssueId) return;
    const issue = detail.issues.find((i) => i.id === selectedIssueId);
    if (!issue) return;
    map.flyTo({
      center: issue.position,
      zoom: Math.max(map.getZoom(), 13.8),
      offset: frameOffset(),
      duration: reduced ? 0 : 1100,
      essential: true,
    });
  }, [map, ready, scope, detail, selectedIssueId, reduced]);

  /* Selecting a workfront frames that workfront. */
  useEffect(() => {
    if (!map || !ready || scope !== "project" || !detail || !selectedWorkfrontId) return;
    const workfront = detail.workfronts.find((w) => w.id === selectedWorkfrontId);
    if (!workfront) return;
    map.fitBounds(ringBounds(workfront.ring), {
      padding: framePadding(),
      duration: reduced ? 0 : 900,
      maxZoom: 14,
    });
  }, [map, ready, scope, detail, selectedWorkfrontId, reduced]);

  /* Clearing a selection inside a project returns to the whole corridor. */
  const hadSelection = useRef(false);
  useEffect(() => {
    if (!map || !ready || scope !== "project" || !detail || !openProject) return;
    const has = Boolean(selectedIssueId || selectedWorkfrontId);
    const cleared = hadSelection.current && !has;
    hadSelection.current = has;
    if (!cleared) return;
    map.fitBounds(ringBounds(detail.boundary), {
      padding: framePadding(),
      duration: reduced ? 0 : 800,
      maxZoom: 14,
    });
  }, [map, ready, scope, detail, openProject, selectedIssueId, selectedWorkfrontId, reduced]);

  return null;
}

/** Chrome clearance inside the map area: the legend card on the left, the
 *  detail drawer on the right. `panel` is false for the portfolio's resting
 *  state, where nothing is selected and the country can have the whole frame.
 *  Collapses on narrow viewports where the drawer becomes a bottom sheet. */
function framePadding(
  panel = true,
): { top: number; bottom: number; left: number; right: number } {
  const width = typeof window === "undefined" ? 1440 : window.innerWidth;
  if (width < 900) return { top: 24, bottom: panel ? 340 : 40, left: 24, right: 24 };
  if (width < 1280) return { top: 24, bottom: 36, left: 200, right: panel ? 372 : 48 };
  return { top: 28, bottom: 40, left: 224, right: panel ? 444 : 56 };
}

/** The same clearance expressed as a centre offset, for camera moves that
 *  target a point rather than a box. Padding is never left on the map itself:
 *  MapLibre would then apply it a second time and pull every fit too far out. */
function frameOffset(): [number, number] {
  const p = framePadding();
  return [(p.left - p.right) / 2, (p.top - p.bottom) / 2];
}

function ringBounds(ring: [number, number][]): [[number, number], [number, number]] {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;
  for (const [lng, lat] of ring) {
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }
  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
}

function usePrefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
