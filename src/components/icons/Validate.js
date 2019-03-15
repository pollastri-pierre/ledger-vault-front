// @flow
import React, { PureComponent } from "react";

import colors from "../../shared/colors";

type Props = { size?: number, color?: string };

export default class Validate extends PureComponent<Props> {
  static defaultProps = {
    size: 20,
    color: colors.black,
  };

  render() {
    const { size, color, ...rest } = this.props;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 31.41 21.03"
        width={size}
        height={size}
      >
        <polyline
          points="30.71 0.71 11.79 19.62 0.71 8.53"
          stroke={color}
          fill="none"
          {...rest}
        />
      </svg>
    );
  }
}
