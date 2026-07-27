/* ============================================================================
   Basemap resolution
   ----------------------------------------------------------------------------
   Two modes, chosen once at boot from the environment:

     local   (default) A self-contained vector basemap built from New Zealand
             coastline and regional boundaries carried in `public/geo/`, styled
             in the interface neutrals. No API key, no tile server, no network. This is
             what makes the prototype runnable anywhere.

     linz    LINZ Basemaps, the authoritative national imagery and topographic
             service. Requires VITE_LINZ_API_KEY. The resolver mirrors the one
             in the TacEdge Coordination app (src/lib/map/basemaps.ts) so the
             production mapping stack and this prototype agree on how a LINZ
             style is addressed.

   The local basemap is deliberately quiet. It orients the reader and then gets
   out of the way, because the information on this map is the project status,
   not the terrain.
   ========================================================================== */

import type { StyleSpecification } from "maplibre-gl";

export type BasemapKind = "local" | "linz-topographic" | "linz-aerial";

/* Map-specific neutrals, mirroring the --map-* tokens in styles/tokens.css.
   Reduced saturation, light land, restrained lines: the basemap gives
   geographic context and then stays out of the way of the overlays. */
const MAP = {
  sea: "#d4e3ec",
  land: "#f4f6f7",
  coast: "#aebdc7",
  coastHalo: "#c3d4de",
  regionLine: "#dce2e6",
} as const;

/** Resolves a public asset against the deployed base path, so the prototype
 *  works at a domain root and under a subdirectory without a rebuild. */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`;
}

export function resolveBasemapKind(): BasemapKind {
  const requested = (import.meta.env.VITE_BASEMAP ?? "local") as BasemapKind;
  const hasLinzKey = Boolean(import.meta.env.VITE_LINZ_API_KEY);
  if (requested !== "local" && !hasLinzKey) {
    console.warn(
      `[basemap] VITE_BASEMAP=${requested} needs VITE_LINZ_API_KEY. Falling back to the local basemap.`,
    );
    return "local";
  }
  return requested;
}

/** LINZ style URL, matching the addressing used by the Coordination app. */
export function linzStyleUrl(kind: Exclude<BasemapKind, "local">): string {
  const key = import.meta.env.VITE_LINZ_API_KEY ?? "";
  const name = kind === "linz-aerial" ? "aerial" : "topographic";
  return `https://basemaps.linz.govt.nz/v1/tiles/${name}/EPSG:3857/style/${name}.json?api=${key}`;
}

/** The self-contained New Zealand basemap. */
export function localStyle(): StyleSpecification {
  return {
    version: 8,
    name: "Operational ground",
    // No `glyphs` entry: nothing in this style renders text. Every label on the
    // map is a DOM marker, which is what keeps the type system exact and keeps
    // a glyph server out of the deployment.
    sources: {
      "nz-land": { type: "geojson", data: asset("geo/nz-land.json") },
      "nz-regions": { type: "geojson", data: asset("geo/nz-regions.json") },
    },
    layers: [
      { id: "sea", type: "background", paint: { "background-color": MAP.sea } },
      {
        id: "land-halo",
        type: "line",
        source: "nz-land",
        paint: { "line-color": MAP.coastHalo, "line-width": 4, "line-blur": 3, "line-opacity": 0.7 },
      },
      { id: "land", type: "fill", source: "nz-land", paint: { "fill-color": MAP.land } },
      {
        id: "region-fill",
        type: "fill",
        source: "nz-regions",
        paint: { "fill-color": "#e8f6fa", "fill-opacity": 0 },
      },
      {
        id: "region-line",
        type: "line",
        source: "nz-regions",
        paint: {
          "line-color": MAP.regionLine,
          "line-width": 0.8,
          // Regional boundaries are portfolio-scale furniture. Inside a project
          // they are a line across the view that means nothing, so they go.
          "line-opacity": ["interpolate", ["linear"], ["zoom"], 9, 0.75, 10.5, 0],
        },
      },
      {
        id: "coast",
        type: "line",
        source: "nz-land",
        paint: { "line-color": MAP.coast, "line-width": 1 },
      },
    ],
  } as StyleSpecification;
}

export function styleFor(kind: BasemapKind): StyleSpecification | string {
  return kind === "local" ? localStyle() : linzStyleUrl(kind);
}
