/* Project status markers. Size and colour both carry the status, so the
   picture still reads for someone who cannot separate the two hues. */

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
        return (
          <MapMarker
            key={project.id}
            lngLat={project.position}
            order={selected ? 40 : status.markerState === "intervention" ? 30 : 20}
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
              <span className="project-pin-dot" aria-hidden="true" />
            </button>
            {selected || hovered ? (
              <span className={`project-pin-label${selected ? " is-selected" : ""}`}>
                {project.name}
              </span>
            ) : null}
          </MapMarker>
        );
      })}
    </>
  );
}

/** Place names, so the reader can orient without a labelled basemap. */
export function PlaceLabels() {
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
