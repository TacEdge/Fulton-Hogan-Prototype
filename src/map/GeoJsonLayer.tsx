/* Declarative GeoJSON source plus its layers. Mount adds them, unmount removes
   them, and a changed `data` updates in place rather than tearing down. */

import { useEffect, useRef } from "react";
import type { GeoJSONSource, Map as MapLibreMap } from "maplibre-gl";
import { useMap } from "./MapCanvas";

/** A layer spec without the parts this component supplies. */
export type LayerBody = {
  suffix: string;
  type: "fill" | "line" | "circle" | "symbol";
  paint?: Record<string, unknown>;
  layout?: Record<string, unknown>;
  filter?: unknown[];
  /** Insert beneath this layer id, if present. */
  beforeId?: string;
};

interface GeoJsonLayerProps {
  id: string;
  data: GeoJSON.FeatureCollection;
  layers: LayerBody[];
}

export function GeoJsonLayer({ id, data, layers }: GeoJsonLayerProps) {
  const { map, ready } = useMap();
  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    if (!map || !ready) return;
    if (!map.getSource(id)) {
      map.addSource(id, { type: "geojson", data: dataRef.current });
    }
    const added: string[] = [];
    for (const layer of layers) {
      const layerId = `${id}-${layer.suffix}`;
      if (map.getLayer(layerId)) continue;
      map.addLayer(
        {
          id: layerId,
          type: layer.type,
          source: id,
          ...(layer.paint ? { paint: layer.paint } : {}),
          ...(layer.layout ? { layout: layer.layout } : {}),
          ...(layer.filter ? { filter: layer.filter } : {}),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        layer.beforeId && map.getLayer(layer.beforeId) ? layer.beforeId : undefined,
      );
      added.push(layerId);
    }

    return () => {
      if (!isUsable(map)) return;
      for (const layerId of added) {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
      }
      if (map.getSource(id)) map.removeSource(id);
    };
    // Layer bodies are static per mount; data changes flow through the effect
    // below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, ready, id]);

  useEffect(() => {
    if (!map || !ready) return;
    const source = map.getSource(id) as GeoJSONSource | undefined;
    source?.setData(data);
  }, [map, ready, id, data]);

  return null;
}

function isUsable(map: MapLibreMap): boolean {
  try {
    return Boolean(map.getStyle());
  } catch {
    return false;
  }
}
