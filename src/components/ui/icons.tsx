/* One icon set, one stroke weight, one corner style. Line icons for navigation
   and controls; filled marks are reserved for map status, where a shape has to
   read at 16px over imagery.

   Hand-drawn rather than pulled from a library so that stroke, size and join
   stay consistent and the prototype carries no icon dependency. */

import type { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

function Icon({ size = 20, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const IconFolder = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4l2 2.5h7A1.5 1.5 0 0 1 19 10v7.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 3 17.5Z" />
  </Icon>
);

export const IconCheckCircle = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m8.5 12.2 2.4 2.4 4.6-4.9" />
  </Icon>
);

export const IconAlertTriangle = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 4.6 21 19.4H3Z" />
    <path d="M12 10v4" />
    <path d="M12 16.8h.01" />
  </Icon>
);

export const IconAlertOctagon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8.6 3.5h6.8L20.5 8.6v6.8L15.4 20.5H8.6L3.5 15.4V8.6Z" />
    <path d="M12 8v4.6" />
    <path d="M12 16.2h.01" />
  </Icon>
);

export const IconClock = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.6V12l2.9 1.8" />
  </Icon>
);

export const IconChevronDown = (p: IconProps) => (
  <Icon {...p}>
    <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />
  </Icon>
);

export const IconChevronLeft = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14.5 6.5 9 12l5.5 5.5" />
  </Icon>
);

export const IconChevronRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9.5 6.5 15 12l-5.5 5.5" />
  </Icon>
);

export const IconClose = (p: IconProps) => (
  <Icon {...p}>
    <path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />
  </Icon>
);

export const IconArrowLeft = (p: IconProps) => (
  <Icon {...p}>
    <path d="M19 12H5.5" />
    <path d="M11 5.5 4.5 12l6.5 6.5" />
  </Icon>
);

export const IconArrowRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h13.5" />
    <path d="M13 5.5 19.5 12 13 18.5" />
  </Icon>
);

export const IconExternal = (p: IconProps) => (
  <Icon {...p}>
    <path d="M13.5 5.5H19V11" />
    <path d="M19 5.5 11.5 13" />
    <path d="M18 14v4.5A1.5 1.5 0 0 1 16.5 20h-10A1.5 1.5 0 0 1 5 18.5v-10A1.5 1.5 0 0 1 6.5 7H11" />
  </Icon>
);

export const IconLayers = (p: IconProps) => (
  <Icon {...p}>
    <path d="m12 3.8 8.2 4.3-8.2 4.3-8.2-4.3Z" />
    <path d="m4.4 12.4 7.6 4 7.6-4" />
    <path d="m4.4 16.4 7.6 4 7.6-4" />
  </Icon>
);

export const IconPlus = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 6v12M6 12h12" />
  </Icon>
);

export const IconMinus = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 12h12" />
  </Icon>
);

export const IconFrame = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 9V5.5a1 1 0 0 1 1-1H9" />
    <path d="M15 4.5h3.5a1 1 0 0 1 1 1V9" />
    <path d="M19.5 15v3.5a1 1 0 0 1-1 1H15" />
    <path d="M9 19.5H5.5a1 1 0 0 1-1-1V15" />
  </Icon>
);

export const IconImage = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.8" y="5.2" width="16.4" height="13.6" rx="1.6" />
    <circle cx="9" cy="10" r="1.4" />
    <path d="m4.6 16.6 4.2-3.8 3.4 3 2.8-2.4 4.4 3.8" />
  </Icon>
);

export const IconFileText = (p: IconProps) => (
  <Icon {...p}>
    <path d="M13.5 3.8H7a1.6 1.6 0 0 0-1.6 1.6v13.2A1.6 1.6 0 0 0 7 20.2h10a1.6 1.6 0 0 0 1.6-1.6V8.9Z" />
    <path d="M13.5 3.8v5.1h5.1" />
    <path d="M8.6 13h6.8M8.6 16.4h4.8" />
  </Icon>
);

export const IconTarget = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="7.8" />
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 1.8v2.6M12 19.6v2.6M1.8 12h2.6M19.6 12h2.6" />
  </Icon>
);

export const IconFlag = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6.2 20.2V4.4" />
    <path d="M6.2 5.2h10.4l-1.9 3.4 1.9 3.4H6.2" />
  </Icon>
);

export const IconRefresh = (p: IconProps) => (
  <Icon {...p}>
    <path d="M19.4 11.2A7.5 7.5 0 1 0 19 15" />
    <path d="M19.6 9.6v4h-4" />
  </Icon>
);

export const IconInfo = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11.2v5" />
    <path d="M12 8.2h.01" />
  </Icon>
);

export const IconSliders = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 7.5h9M17.5 7.5H19M5 16.5h1.5M10 16.5h9" />
    <circle cx="15.6" cy="7.5" r="2.1" />
    <circle cx="8.2" cy="16.5" r="2.1" />
  </Icon>
);
