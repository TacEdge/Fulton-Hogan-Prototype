/* Application chrome: charcoal frame, client logo slot, product name with the
   TACEDGE attribution kept secondary, and a navigation trail whose current
   step carries the orange underline. Nothing here is decorative. */

import { useViewStore } from "@/state/viewStore";
import { PROJECT_BY_ID } from "@/data/portfolio";
import { BrandLockup } from "./BrandLockup";
import { IconInfo } from "./ui/icons";

export function AppHeader() {
  const scope = useViewStore((s) => s.scope);
  const openProjectId = useViewStore((s) => s.openProjectId);
  const closeProject = useViewStore((s) => s.closeProject);
  const setAboutOpen = useViewStore((s) => s.setAboutOpen);

  const project = openProjectId ? PROJECT_BY_ID.get(openProjectId) : undefined;

  return (
    <header className="app-header on-dark">
      <div className="app-header-brand">
        <BrandLockup />
        <span className="app-header-divider" aria-hidden="true" />
        <span className="app-header-product">
          <span className="app-header-title">Operational Picture</span>
          <span className="app-header-attribution">Concept by TACEDGE</span>
        </span>
      </div>

      <nav className="app-nav" aria-label="Location">
        <button
          type="button"
          className={`app-nav-item${scope === "portfolio" ? " is-current" : ""}`}
          onClick={closeProject}
          aria-current={scope === "portfolio" ? "page" : undefined}
        >
          Portfolio
        </button>
        {project ? (
          <span className="app-nav-item is-current" aria-current="page">
            {project.name}
          </span>
        ) : null}
      </nav>

      <div className="app-header-actions">
        <span className="demo-badge" title="Nothing on this screen is real project data.">
          Demonstration data — Concept prototype
        </span>
        <button type="button" className="header-btn" onClick={() => setAboutOpen(true)}>
          <IconInfo size={17} />
          <span>About</span>
        </button>
      </div>
    </header>
  );
}
