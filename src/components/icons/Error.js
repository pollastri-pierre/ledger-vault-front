// @flow
import React, { PureComponent } from "react";

import colors from "../../shared/colors";

type Props = { size?: number, color?: string };

export default class Error extends PureComponent<Props> {
  static defaultProps = {
    size: 20,
    color: colors.black
  };

  render() {
    const { size, color } = this.props;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 31.41 31.41"
        width={size}
        height={size}
      >
        <line
          x1="0.71"
          y1="30.71"
          x2="30.71"
          y2="0.71"
          fill="none"
          stroke={color}
        />
        <line
          x1="0.71"
          y1="0.71"
          x2="30.71"
          y2="30.71"
          fill="none"
          stroke={color}
        />
      </svg>
    );
  }
}
