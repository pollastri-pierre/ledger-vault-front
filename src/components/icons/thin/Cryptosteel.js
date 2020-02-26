// @flow
import React, { PureComponent } from "react";

import colors from "shared/colors";

const styles = {
  fill: "none",
  stroke: colors.legacyGrey,
  strokeMiterlimit: 10,
  strokeWidth: 2,
};

class Cryptosteel extends PureComponent<*> {
  render() {
    const { ...rest } = this.props;
    return (
      <svg {...rest}>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Line">
            <g id="Cryptosteel">
              <path
                style={styles}
                d="M30.68,14.54,23.42,4.61a1.68,1.68,0,0,0-2.35-.37l-4.4,3.22V2.68A1.69,1.69,0,0,0,15,1H2.68A1.69,1.69,0,0,0,1,2.68V25.44a1.68,1.68,0,0,0,1.68,1.68H7.52l2.06,2.82a1.68,1.68,0,0,0,2.35.37L30.31,16.89A1.69,1.69,0,0,0,30.68,14.54Z"
              />
              <rect
                style={styles}
                x="8.67"
                y="4.21"
                width="15.67"
                height="26.12"
                rx="1.68"
                ry="1.68"
                transform="translate(20.73 -6.24) rotate(53.87)"
              />
              <circle style={styles} cx="9.22" cy="23.16" r="1" />
            </g>
          </g>
        </g>
      </svg>
    );
  }
}

export default Cryptosteel;
