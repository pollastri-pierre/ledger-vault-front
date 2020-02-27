// @flow
import React, { PureComponent } from "react";

import colors from "shared/colors";

class Lock extends PureComponent<*> {
  render() {
    return (
      <svg viewBox="0 0 25.1 32" style={{ width: 25 }}>
        <defs />
        <title>lock</title>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Line">
            <g id="Lock">
              <rect
                x="1"
                y="13.67"
                width="23.1"
                height="17.33"
                fill="none"
                style={{ strokeWidth: 2 }}
                stroke={colors.legacyGrey}
              />
              <path
                d="M4.95,13.67V8.6a7.6,7.6,0,1,1,15.21,0v5.07"
                fill="none"
                style={{ strokeWidth: 2 }}
                stroke={colors.legacyGrey}
              />
            </g>
          </g>
        </g>
      </svg>
    );
  }
}

export default Lock;
