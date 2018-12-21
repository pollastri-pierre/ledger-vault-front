// @flow

import React from "react";

const path = (
  <path
    fill="currentColor"
    d="M9.65 8.413l4.066-4.065a.375.375 0 0 0 0-.532l-.706-.706a.375.375 0 0 0-.531 0L8.413 7.176 4.348 3.11a.375.375 0 0 0-.532 0l-.706.706a.375.375 0 0 0 0 .532l4.066 4.065L3.11 12.48a.375.375 0 0 0 0 .531l.706.706a.375.375 0 0 0 .532 0l4.065-4.065 4.066 4.065a.375.375 0 0 0 .531 0l.706-.706a.375.375 0 0 0 0-.531L9.651 8.413z"
  />
);

const Close = ({ size, ...p }: { size: number }) => (
  <svg viewBox="0 0 16 16" height={size} width={size} {...p}>
    {path}
  </svg>
);

export default Close;
