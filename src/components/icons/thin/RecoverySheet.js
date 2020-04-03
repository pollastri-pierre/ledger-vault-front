// @flow
import React, { PureComponent } from "react";

import colors from "shared/colors";

const styles = {
  fill: "none",
  stroke: colors.legacyGrey,
  strokeMiterlimit: 10,
  strokeWidth: 2,
};

class RecoverySheet extends PureComponent<*> {
  render() {
    return (
      <svg {...this.props} viewBox="0 0 22 32">
        <g id="Layer_2" data-name="Layer 2">
          <g id="Line">
            <g id="Recovery_sheet" data-name="Recovery sheet">
              <line style={styles} x1="4.45" y1="7.67" x2="17.55" y2="7.67" />
              <line style={styles} x1="4.45" y1="12" x2="14.45" y2="12" />
              <line style={styles} x1="4.45" y1="16.33" x2="14.45" y2="16.33" />
              <rect style={styles} x="1" y="1" width="20" height="30" />
            </g>
          </g>
        </g>
      </svg>
    );
  }
}

export default RecoverySheet;
