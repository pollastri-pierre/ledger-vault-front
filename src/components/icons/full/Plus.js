// @flow
import React from "react";

export default ({ style }: { style: Object }) => (
  <svg viewBox="0 0 30 30" style={{ width: 16, ...style }}>
    <polygon
      fill="currentColor"
      stroke="none"
      points="12.6 30 12.6 17.4 0 17.4 0 12.6 12.6 12.6 12.6 0 17.4 0 17.4 12.6 30 12.6 30 17.4 17.4 17.4 17.4 30 12.6 30"
    />
  </svg>
);
