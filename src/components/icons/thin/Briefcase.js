// @flow
import React, { PureComponent } from "react";

import colors from "shared/colors";

const styles = {
  fill: "none",
  stroke: colors.legacyGrey,
  strokeMiterlimit: 10,
  strokeWidth: 2,
};

class Briefcase extends PureComponent<*> {
  render() {
    const { ...rest } = this.props;
    return (
      <svg viewBox="0 0 32 29.82" {...rest}>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Line">
            <g id="Briefcase">
              <rect style={styles} x="1" y="5.14" width="30" height="23.68" />
              <rect style={styles} x="12.41" y="1" width="7.18" height="4.14" />
            </g>
          </g>
        </g>
      </svg>
    );
  }
}

export default Briefcase;
