/* Project status markers. Size, colour and centre symbol all carry the status,
   so the picture survives a colour-blind reader and a bad projector.

   Projects that need a decision above project level are labelled on the map
   without being asked. Everything else labels on hover. Naming only the two
   that cannot wait is what keeps the national view readable, and it is the
   product's argument made in the marker layer. */

import { HEALTH_LABEL, formatVariance } from "@/domain/status";
import { MapMarker } from "@/map/MapMarker";
import { useFilteredProjects } from "@/hooks/usePortfolio";
import { useViewStore } from "@/state/viewStore";
import { ORIENTATION_PLACES } from "@/data/portfolio";

export function ProjectMarkers() {
  const projects = useFilteredProjects();
  const selectedProjectId = useViewStore((s) => s.selectedProjectId);
  const hoveredProjectId = useViewStore((s) => s.hoveredProjectId);
  const selectProject = useViewStore((s) => s.selectProject);
  const hoverProject = useViewStore((s) => s.hoverProject);

  return (
    <>
      {projects.map(({ project, status }) => {
        const selected = selectedProjectId === project.id;
        const hovered = hoveredProjectId === project.id;
        const needsAttention = status.markerState !== "on-track";
        const alwaysLabelled = status.markerState === "intervention";
        return (
          <MapMarker
            key={project.id}
            lngLat={project.position}
            order={selected ? 60 : status.markerState === "intervention" ? 40 : needsAttention ? 30 : 20}
          >
            <button
              type="button"
              className={`project-pin is-${status.markerState}${selected ? " is-selected" : ""}`}
              onClick={() => selectProject(selected ? null : project.id)}
              onMouseEnter={() => hoverProject(project.id)}
              onMouseLeave={() => hoverProject(null)}
              onFocus={() => hoverProject(project.id)}
              onBlur={() => hoverProject(null)}
              aria-pressed={selected}
              aria-label={`${project.name}. ${HEALTH_LABEL[status.markerState]}. ${formatVariance(status.variance)}.`}
            >
              <span className="project-pin-dot" aria-hidden="true">
                {status.markerState === "intervention" ? "!" : null}
              </span>
            </button>
            {selected || hovered || alwaysLabelled ? (
              <span
                className={`project-pin-label is-${status.markerState}${selected ? " is-selected" : ""}${
                  hovered && !selected ? " is-hovered" : ""
                }`}
              >
                {project.name}
              </span>
            ) : null}
          </MapMarker>
        );
      })}

      <PlaceLabels />
    </>
  );
}

/** Place names, so the reader can orient without a labelled basemap. */
function PlaceLabels() {
  return (
    <>
      {ORIENTATION_PLACES.map((place) => (
        <MapMarker
          key={place.name}
          lngLat={place.position}
          anchor="top"
          order={5}
          className="is-passive"
        >
          <span className="place-label">{place.name}</span>
        </MapMarker>
      ))}
    </>
  );
}
