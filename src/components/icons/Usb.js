// @flow

import React from "react";

const inner = (
  <path
    transform="translate(-1 -.5)"
    d="m14.79 3.65-2.94-2.94c-0.28-0.28-0.7-0.28-0.98 0l-2.45 2.45-1.05-0.98c-0.28-0.28-0.7-0.28-0.98 0l-3.01 3.01c-1.68 1.68-1.89 4.41-0.42 6.37l-1.75 1.75c-0.28 0.28-0.28 0.7 0 0.98s0.7 0.28 0.98 0l1.75-1.75c1.96 1.47 4.69 1.26 6.37-0.49l2.94-2.94c0.28-0.28 0.28-0.7 0-0.98l-0.98-0.98 2.52-2.45c0.28-0.28 0.28-0.77 0-1.05zm-5.46 7.42c-1.33 1.33-3.57 1.33-4.97 0-1.4-1.4-1.4-3.57 0-4.97l2.45-2.45 4.97 4.97zm2.03-4.9-1.96-1.96 1.96-1.96 1.96 1.96z"
  />
);

const Usb = ({ size, ...p }: { size: number }) => (
  <svg viewBox="0 0 14 14" height={size} width={size} {...p}>
    {inner}
  </svg>
);

export default Usb;