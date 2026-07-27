/* What this is, what it is not, and where every number on screen came from.
   It sits behind a button rather than on the map, because the interaction is
   supposed to make the argument, not the copy. */

import { useEffect, useRef } from "react";
import { GLOSSARY, SOURCE_SYSTEMS } from "@/data/reference";
import { ADAPTER_BY_SOURCE } from "@/services/adapters";
import { useViewStore } from "@/state/viewStore";
import { IconClose } from "./ui/icons";

export function AboutPanel() {
  const open = useViewStore((s) => s.aboutOpen);
  const setAboutOpen = useViewStore((s) => s.setAboutOpen);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAboutOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setAboutOpen]);

  if (!open) return null;

  return (
    <div className="about-scrim" role="dialog" aria-modal="true" aria-label="About this prototype">
      <div className="about-sheet">
        <header className="about-head">
          <div>
            <p className="u-eyebrow">Operational Picture</p>
            <h2 className="about-title">Concept by TACEDGE</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="icon-btn"
            onClick={() => setAboutOpen(false)}
            aria-label="Close"
          >
            <IconClose size={20} />
          </button>
        </header>

        <div className="about-body">
          <section className="about-section">
            <h3 className="about-h3">What this is</h3>
            <p>
              A thin geospatial layer over project information that already exists. It reads a small
              number of status signals from the systems that hold the record, normalises them into one
              shape, and puts them on one map so that projects run by different teams on different
              contracts can be compared at a glance.
            </p>
            <p className="about-claim">One map. Every project. The issues that matter now.</p>
          </section>

          <section className="about-section">
            <h3 className="about-h3">What it is not</h3>
            <p>
              It is not a system of record and it does not replace one. Financial systems, ERP,
              Salesforce, health and safety, quality management, scheduling, BIM, GIS, document control
              and field applications all stay exactly where they are and stay authoritative. This layer
              shows what their information collectively means, then points back to them for the detail.
            </p>
          </section>

          <section className="about-section">
            <h3 className="about-h3">Status is derived, and shown as derived</h3>
            <p>
              A project reads as the worst thing currently true about it. There is no weighted score.
              Every panel can show the signals that made the call, each with its own age and its own
              source. Data freshness is assessed separately: a project whose data has gone quiet is
              greyed rather than judged, because the picture cannot be trusted until it refreshes.
            </p>
          </section>

          <section className="about-section">
            <h3 className="about-h3">Where the content comes from</h3>
            <dl className="provenance-list">
              <div>
                <dt>Real terminology</dt>
                <dd>
                  New Zealand regions, project types, industry acronyms, and the systems named below as
                  sources. Used because getting the language right is most of what makes a picture
                  legible to the people who work in it.
                </dd>
              </div>
              <div>
                <dt>Inferred structure</dt>
                <dd>
                  Business unit names and the shape of the source-system landscape. Plausible, not
                  asserted as fact, and marked as inferred wherever it appears.
                </dd>
              </div>
              <div>
                <dt>Notional data</dt>
                <dd>
                  Every project, person, percentage, date, issue and coordinate. All invented. No real
                  project data, personal information or commercially sensitive material is present.
                </dd>
              </div>
            </dl>
          </section>

          <section className="about-section">
            <h3 className="about-h3">Branding</h3>
            <p>
              Colour, type and layout follow brand guidance supplied for this prototype and derived
              from Fulton Hogan's public material. That guidance describes itself as provisional
              rather than an official brand manual, so every value here is an approximation that
              official brand files would replace.
            </p>
            <p>
              No Fulton Hogan logo appears anywhere in this prototype. No official asset was
              supplied, the mark must not be redrawn or recreated, and a third-party download is not
              a substitute, so the header carries a slot that stays empty until an official file is
              dropped in. Nothing on screen approximates the mark. The TACEDGE attribution is
              deliberately secondary.
            </p>
          </section>

          <section className="about-section">
            <h3 className="about-h3">Conceptual integration model</h3>
            <p className="u-caption about-note">
              None of these connections is built. Every adapter below reports not connected, and every
              reading in this prototype is served by static demonstration data.
            </p>
            <table className="about-table">
              <thead>
                <tr>
                  <th>System</th>
                  <th>Would read</th>
                  <th>Stays out of scope</th>
                  <th>State</th>
                </tr>
              </thead>
              <tbody>
                {SOURCE_SYSTEMS.map((system) => {
                  const adapter = ADAPTER_BY_SOURCE.get(system.id);
                  return (
                    <tr key={system.id}>
                      <td>
                        <span className="about-system">{system.label}</span>
                        <span className="u-caption">{system.kind === "named" ? "Named system" : "Role placeholder"}</span>
                      </td>
                      <td className="u-caption">{adapter?.reads.join(", ")}</td>
                      <td className="u-caption">{adapter?.outOfScope}</td>
                      <td>
                        <span className="not-connected">Not connected</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <section className="about-section">
            <h3 className="about-h3">Terms used</h3>
            <dl className="glossary">
              {GLOSSARY.map((entry) => (
                <div key={entry.term}>
                  <dt>
                    <span className="u-num">{entry.term}</span> {entry.expansion}
                  </dt>
                  <dd className="u-caption">{entry.note}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="about-section about-footer">
            <p className="u-caption">
              Operational Picture — concept prototype by TACEDGE. Demonstration data throughout. Not
              commissioned, reviewed, approved or deployed by Fulton Hogan, and not a representation of
              any live project.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
