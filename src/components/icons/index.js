// @flow

// FIXME drop this file. we should directly import the font we need. also the global className are to be removed

import React from "react";
import colors from "shared/colors";
import Plug from "./thin/Plug";

export function PlugIcon(props: *) {
  return (
    <Plug
      style={{
        width: "32px",
        height: "20px",
        fill: "none",
        stroke: colors.mouse,
        strokeWidth: "2px",
      }}
      {...props}
    />
  );
}
