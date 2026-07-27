/* A React node anchored to a coordinate. The marker element is created once and
   children are portalled into it, so markers get real brand typography, real
   focus behaviour and real hit targets.

   The element handed to MapLibre stays MapLibre's: it owns that node's classes
   and transform. Everything of ours lives on an inner host div. */

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { Marker } from "maplibre-gl";
import { useMap } from "./MapCanvas";

interface MapMarkerProps {
  lngLat: [number, number];
  anchor?: "center" | "bottom" | "top" | "left" | "right";
  className?: string;
  /** Higher sits above lower. Used to keep issues above workfront labels. */
  order?: number;
  children: ReactNode;
}

export function MapMarker({ lngLat, anchor = "center", className, order = 0, children }: MapMarkerProps) {
  const { manager, map, ready } = useMap();
  const [marker, setMarker] = useState<Marker | null>(null);

  const element = useMemo(() => {
    const el = document.createElement("div");
    // Positioning belongs to MapLibre. Only the things it does not set are set
    // here, and never via className, which MapLibre also writes to.
    el.style.pointerEvents = "none";
    return el;
  }, []);

  useEffect(() => {
    if (!manager || !map || !ready) return;
    const created = manager.createMarker(element, { anchor });
    if (!created) return;
    created.setLngLat(lngLat).addTo(map);
    setMarker(created);
    return () => {
      created.remove();
      setMarker(null);
    };
    // Position is applied by the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager, map, ready, element, anchor]);

  useEffect(() => {
    marker?.setLngLat(lngLat);
  }, [marker, lngLat]);

  useEffect(() => {
    element.style.zIndex = String(order);
  }, [element, order]);

  return createPortal(
    <div className={`map-marker-host${className ? ` ${className}` : ""}`}>{children}</div>,
    element,
  );
}
