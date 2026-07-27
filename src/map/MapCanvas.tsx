/* React binding for the map instance. Owns the container element, exposes the
   live map through context, and nothing else. Layers and markers are separate
   components so the map surface stays a surface, not a god object. */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import { MapInstanceManager, type MapView } from "./MapInstanceManager";
import type { BasemapKind } from "./basemap";

interface MapContextValue {
  map: MapLibreMap | null;
  manager: MapInstanceManager | null;
  basemapKind: BasemapKind | null;
  ready: boolean;
}

const MapContext = createContext<MapContextValue>({
  map: null,
  manager: null,
  basemapKind: null,
  ready: false,
});

export function useMap(): MapContextValue {
  return useContext(MapContext);
}

/** Runs `effect` once the style is loaded, and re-runs it on dependency change.
 *  Every layer component goes through here so none of them has to think about
 *  whether the map exists yet. */
export function useMapReady(effect: (map: MapLibreMap) => void | (() => void), deps: unknown[]): void {
  const { map, ready } = useMap();
  useEffect(() => {
    if (!map || !ready) return;
    return effect(map);
    // The caller owns the dependency list; `effect` is intentionally not in it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, ready, ...deps]);
}

interface MapCanvasProps {
  initialView: MapView;
  children?: ReactNode;
}

export function MapCanvas({ initialView, children }: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<MapInstanceManager | null>(null);
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const manager = new MapInstanceManager({
      onReady: () => setReady(true),
    });
    managerRef.current = manager;

    void manager.create(container, initialView).then((instance) => {
      if (instance) setMap(instance);
      if (instance && import.meta.env.DEV) {
        // Dev-only handle, for poking at the map from the console.
        (window as unknown as { __map?: unknown }).__map = instance;
      }
    });

    const observer = new ResizeObserver(() => manager.resize());
    observer.observe(container);

    return () => {
      observer.disconnect();
      manager.dispose();
      managerRef.current = null;
      setMap(null);
      setReady(false);
    };
    // Mount only. `initialView` is the opening camera, not a live prop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<MapContextValue>(
    () => ({
      map,
      manager: managerRef.current,
      basemapKind: managerRef.current?.basemapKind ?? null,
      ready,
    }),
    [map, ready],
  );

  return (
    <MapContext.Provider value={value}>
      <div className="map-canvas" ref={containerRef} role="application" aria-label="Operational map" />
      {ready ? children : null}
    </MapContext.Provider>
  );
}
