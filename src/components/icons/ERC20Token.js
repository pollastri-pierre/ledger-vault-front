// @flow

import React from "react";

const inner = (
  <path
    d="m100-2.1362e-4 -2e-3 0.0014-0.0014 0.0027-88.875 147.46 88.875 52.534 0.0014 2e-3v-3e-3l88.874-52.533zm-15.649 83.972h31.291l2e-3 5.6853h-12.314v54.153h-6.6665v-54.153h-12.313z"
    strokeWidth=".69455"
  />
);

const ERC20Token = ({ size, ...p }: { size: number }) => (
  <svg viewBox="0 0 200 200" height={size} width={size} {...p}>
    {inner}
  </svg>
);

export default ERC20Token;
