/* Zoom and reframe. Three buttons, keyboard reachable, sitting clear of the
   detail drawer. MapLibre's own controls are switched off so the interface has
   one control vocabulary rather than two. */

import { useMap } from "./MapCanvas";
import { IconFrame, IconMinus, IconPlus } from "@/components/ui/icons";

export function MapControls({ onReframe }: { onReframe(): void }) {
  const { map, ready } = useMap();
  if (!ready || !map) return null;

  return (
    <div className="map-controls">
      <button
        type="button"
        className="map-control"
        onClick={() => map.zoomIn({ duration: 200 })}
        aria-label="Zoom in"
        title="Zoom in"
      >
        <IconPlus size={18} />
      </button>
      <button
        type="button"
        className="map-control"
        onClick={() => map.zoomOut({ duration: 200 })}
        aria-label="Zoom out"
        title="Zoom out"
      >
        <IconMinus size={18} />
      </button>
      <button
        type="button"
        className="map-control"
        onClick={onReframe}
        aria-label="Reframe the map"
        title="Reframe"
      >
        <IconFrame size={18} />
      </button>
    </div>
  );
}
