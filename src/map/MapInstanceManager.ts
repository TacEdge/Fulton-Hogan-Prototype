/* ============================================================================
   Map instance manager
   ----------------------------------------------------------------------------
   Framework-agnostic wrapper around the MapLibre GL lifecycle: construct,
   report readiness, move the camera, tear down. Nothing in this file imports
   React, which is the same separation the TacEdge Coordination app keeps
   (src/lib/map/MapInstanceManager.ts) so that map logic can move between the
   web app and a future React Native client unchanged.

   The SDK is imported dynamically. MapLibre is the largest thing this
   prototype loads and there is no reason to hold up first paint for it.
   ========================================================================== */

import type { LngLatBoundsLike, Map as MapLibreMap, Marker, MarkerOptions } from "maplibre-gl";
import { resolveBasemapKind, styleFor, type BasemapKind } from "./basemap";

type MapLibreModule = typeof import("maplibre-gl");

export interface MapView {
  center: [number, number];
  zoom: number;
  bearing?: number;
  pitch?: number;
}

export interface MapInstanceCallbacks {
  onReady(map: MapLibreMap): void;
}

export class MapInstanceManager {
  private map: MapLibreMap | null = null;
  private sdk: MapLibreModule | null = null;
  private disposed = false;
  readonly basemapKind: BasemapKind;

  constructor(private callbacks: MapInstanceCallbacks) {
    this.basemapKind = resolveBasemapKind();
  }

  async create(container: HTMLElement, view: MapView): Promise<MapLibreMap | null> {
    const maplibre = await import("maplibre-gl");
    this.sdk = maplibre;
    if (this.disposed) return null;

    const map = new maplibre.Map({
      container,
      style: styleFor(this.basemapKind),
      center: view.center,
      zoom: view.zoom,
      bearing: view.bearing ?? 0,
      pitch: view.pitch ?? 0,
      attributionControl: false,
      // The picture is read, not explored. Rotation adds nothing and costs
      // orientation, so it stays off.
      dragRotate: false,
      pitchWithRotate: false,
      maxZoom: 16,
      minZoom: 4,
    });
    map.touchZoomRotate.disableRotation();

    this.map = map;
    map.once("load", () => {
      if (!this.disposed) this.callbacks.onReady(map);
    });
    return map;
  }

  getMap(): MapLibreMap | null {
    return this.map;
  }

  /** Markers are DOM, not GL symbols. That keeps brand typography exact, keeps
   *  labels selectable and focusable, and avoids shipping a glyph server for
   *  what is a handful of pins. */
  createMarker(element: HTMLElement, options: MarkerOptions): Marker | null {
    if (!this.sdk || !this.map) return null;
    return new this.sdk.Marker({ ...options, element });
  }

  /** Restrained camera move. Long enough to keep orientation, short enough to
   *  stay out of the way. */
  flyTo(view: MapView, options?: { instant?: boolean }): void {
    if (!this.map) return;
    const target = {
      center: view.center,
      zoom: view.zoom,
      bearing: view.bearing ?? 0,
      pitch: view.pitch ?? 0,
    };
    if (options?.instant || prefersReducedMotion()) {
      this.map.jumpTo(target);
      return;
    }
    this.map.flyTo({ ...target, duration: 1500, curve: 1.3, essential: true });
  }

  fitBounds(bounds: LngLatBoundsLike, padding: number): void {
    if (!this.map) return;
    this.map.fitBounds(bounds, {
      padding,
      duration: prefersReducedMotion() ? 0 : 1200,
      maxZoom: 14,
    });
  }

  resize(): void {
    this.map?.resize();
  }

  dispose(): void {
    this.disposed = true;
    this.map?.remove();
    this.map = null;
  }
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
