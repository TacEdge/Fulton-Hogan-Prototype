/* The project-level spatial layers: boundary, corridor, context and the
   workfronts themselves. Colour carries the work state; the dash pattern
   carries whether work is proceeding, so blocked and planned still separate
   without relying on hue. */

import { useMemo } from "react";
import { GeoJsonLayer, type LayerBody } from "@/map/GeoJsonLayer";
import type { ProjectDetail, WorkState } from "@/domain/types";
import { useViewStore } from "@/state/viewStore";

/* Semantic status colour, not decoration. Active work is informational blue
   rather than green so that green keeps meaning finished. */
const WORK_COLOUR: Record<WorkState, string> = {
  completed: "#18864b",
  active: "#1976a3",
  behind: "#d97706",
  blocked: "#c62828",
  planned: "#7b8792",
};

const WORK_FILL_OPACITY: Record<WorkState, number> = {
  completed: 0.16,
  active: 0.16,
  behind: 0.18,
  blocked: 0.2,
  planned: 0.07,
};

function collection(features: GeoJSON.Feature[]): GeoJSON.FeatureCollection {
  return { type: "FeatureCollection", features };
}

export function ProjectGeometry({ detail }: { detail: ProjectDetail }) {
  const selectedWorkfrontId = useViewStore((s) => s.selectedWorkfrontId);
  const selectedIssueId = useViewStore((s) => s.selectedIssueId);

  const highlightedWorkfrontId = useMemo(() => {
    if (selectedWorkfrontId) return selectedWorkfrontId;
    if (!selectedIssueId) return null;
    return detail.issues.find((i) => i.id === selectedIssueId)?.workfrontId ?? null;
  }, [detail.issues, selectedWorkfrontId, selectedIssueId]);

  const boundaryData = useMemo(
    () =>
      collection([
        {
          type: "Feature",
          properties: {},
          geometry: { type: "Polygon", coordinates: [closeRing(detail.boundary)] },
        },
      ]),
    [detail.boundary],
  );

  const contextData = useMemo(
    () =>
      collection(
        detail.context.map((feature) => ({
          type: "Feature" as const,
          properties: { kind: feature.kind, label: feature.label },
          geometry: { type: "LineString" as const, coordinates: feature.path },
        })),
      ),
    [detail.context],
  );

  const corridorData = useMemo(
    () =>
      collection([
        {
          type: "Feature",
          properties: { label: detail.centrelineLabel },
          geometry: { type: "LineString", coordinates: detail.centreline },
        },
      ]),
    [detail.centreline, detail.centrelineLabel],
  );

  const workData = useMemo(
    () =>
      collection(
        detail.workfronts.map((workfront) => ({
          type: "Feature" as const,
          properties: {
            id: workfront.id,
            state: workfront.state,
            colour: WORK_COLOUR[workfront.state],
            fillOpacity: WORK_FILL_OPACITY[workfront.state],
            selected: workfront.id === highlightedWorkfrontId,
            dashed: workfront.state === "planned" || workfront.state === "blocked",
          },
          geometry: { type: "Polygon" as const, coordinates: [closeRing(workfront.ring)] },
        })),
      ),
    [detail.workfronts, highlightedWorkfrontId],
  );

  return (
    <>
      <GeoJsonLayer id="project-boundary" data={boundaryData} layers={BOUNDARY_LAYERS} />
      <GeoJsonLayer id="project-context" data={contextData} layers={CONTEXT_LAYERS} />
      <GeoJsonLayer id="project-corridor" data={corridorData} layers={CORRIDOR_LAYERS} />
      <GeoJsonLayer id="project-work" data={workData} layers={WORK_LAYERS} />
    </>
  );
}

function closeRing(ring: [number, number][]): [number, number][] {
  const first = ring[0];
  const last = ring[ring.length - 1];
  return first[0] === last[0] && first[1] === last[1] ? ring : [...ring, first];
}

const BOUNDARY_LAYERS: LayerBody[] = [
  { suffix: "fill", type: "fill", paint: { "fill-color": "#ffffff", "fill-opacity": 0.5 } },
  {
    suffix: "line",
    type: "line",
    paint: {
      "line-color": "#5d6870",
      "line-width": 1.2,
      "line-opacity": 0.6,
      "line-dasharray": [5, 4],
    },
  },
];

const CONTEXT_LAYERS: LayerBody[] = [
  {
    suffix: "river",
    type: "line",
    filter: ["==", ["get", "kind"], "river"],
    paint: { "line-color": "#b9d3e0", "line-width": 3, "line-opacity": 0.95 },
  },
  {
    suffix: "rail",
    type: "line",
    filter: ["==", ["get", "kind"], "rail"],
    paint: { "line-color": "#7a858d", "line-width": 1.2, "line-dasharray": [3, 3], "line-opacity": 0.7 },
  },
  {
    suffix: "side-road",
    type: "line",
    filter: ["==", ["get", "kind"], "side-road"],
    paint: { "line-color": "#e4e9ec", "line-width": 3.5, "line-opacity": 1 },
  },
];

const CORRIDOR_LAYERS: LayerBody[] = [
  { suffix: "casing", type: "line", paint: { "line-color": "#aebdc7", "line-width": 9 } },
  { suffix: "fill", type: "line", paint: { "line-color": "#ffffff", "line-width": 5.5 } },
];

const WORK_LAYERS: LayerBody[] = [
  {
    suffix: "fill",
    type: "fill",
    paint: { "fill-color": ["get", "colour"], "fill-opacity": ["get", "fillOpacity"] },
  },
  {
    suffix: "line",
    type: "line",
    filter: ["!", ["get", "dashed"]],
    paint: {
      "line-color": ["get", "colour"],
      "line-width": ["case", ["get", "selected"], 3, 1.75],
      "line-opacity": 0.95,
    },
  },
  {
    suffix: "line-dashed",
    type: "line",
    filter: ["get", "dashed"],
    paint: {
      "line-color": ["get", "colour"],
      "line-width": ["case", ["get", "selected"], 3, 1.75],
      "line-opacity": 0.95,
      "line-dasharray": [3, 2.5],
    },
  },
];
