/* Client logo slot.
   ----------------------------------------------------------------------------
   No official Fulton Hogan logo asset exists in any of the connected
   repositories. The brand guidance is explicit that the mark must not be
   redrawn or recreated in CSS, and that third-party logo downloads are not a
   substitute for the supplied asset, so this prototype ships without one.

   Drop an official file at `public/brand/fulton-hogan-logo.svg` and the header
   renders it, unmodified and at the supplied aspect ratio, in the position the
   guidance specifies. Until then the slot collapses and the header leads with
   the product name. Nothing here approximates the mark. */

import { useState } from "react";

const LOGO_SRC = "/brand/fulton-hogan-logo.svg";

export function BrandLockup() {
  const [available, setAvailable] = useState(true);
  if (!available) return null;
  return (
    <img
      src={LOGO_SRC}
      alt="Fulton Hogan"
      className="brand-lockup"
      onError={() => setAvailable(false)}
    />
  );
}
