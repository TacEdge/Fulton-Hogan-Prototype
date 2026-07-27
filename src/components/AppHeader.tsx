/* Application chrome. Deliberately thin: one line of orientation, the concept
   attribution, and a way into the notes about what this is. */

import { useViewStore } from "@/state/viewStore";
import { PROJECT_BY_ID } from "@/data/portfolio";

export function AppHeader() {
  const scope = useViewStore((s) => s.scope);
  const openProjectId = useViewStore((s) => s.openProjectId);
  const closeProject = useViewStore((s) => s.closeProject);
  const setAboutOpen = useViewStore((s) => s.setAboutOpen);

  const project = openProjectId ? PROJECT_BY_ID.get(openProjectId) : undefined;

  return (
    <header className="app-header on-dark">
      <div className="app-header-brand">
        <img src="/brand/tacedge-lockup-cream.svg" alt="TACEDGE" className="app-header-logo" />
        <span className="app-header-divider" aria-hidden="true" />
        <span className="app-header-title">Operational Picture</span>
      </div>

      <nav className="app-header-trail" aria-label="Location">
        <button
          type="button"
          className={`trail-step${scope === "portfolio" ? " is-current" : ""}`}
          onClick={closeProject}
          aria-current={scope === "portfolio" ? "page" : undefined}
        >
          Portfolio
        </button>
        {project ? (
          <>
            <span className="trail-sep" aria-hidden="true">
              /
            </span>
            <span className="trail-step is-current" aria-current="page">
              {project.name}
            </span>
          </>
        ) : null}
      </nav>

      <div className="app-header-actions">
        <span className="demo-badge" title="Nothing on this screen is real project data.">
          Demonstration data · Concept prototype
        </span>
        <button type="button" className="header-btn" onClick={() => setAboutOpen(true)}>
          About this prototype
        </button>
      </div>
    </header>
  );
}
