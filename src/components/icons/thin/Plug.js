// @flow
import React, { PureComponent } from "react";

type Props = { color?: string };

export default class Plug extends PureComponent<Props> {
  static defaultProps = {
    color: "currentColor",
  };

  render() {
    const { color, ...props } = this.props;
    const style = {
      fill: "none",
      stroke: color,
      strokeMiterlimit: "10",
      strokeWidth: "2px",
    };

    return (
      <svg viewBox="0 0 32 20.12" {...props}>
        <rect
          x="0.51"
          y="1.49"
          width="18.12"
          height="17.14"
          transform="translate(19.63 0.49) rotate(90)"
          style={style}
        />
        <rect
          x="18.14"
          y="3.63"
          width="12.86"
          height="12.86"
          transform="translate(34.63 -14.51) rotate(90)"
          style={style}
        />
        <rect
          fill={color}
          stroke="none"
          x="23.57"
          y="5.22"
          width="2"
          height="4.84"
          transform="translate(32.21 -16.93) rotate(90)"
        />
        <rect
          fill={color}
          stroke="none"
          x="23.57"
          y="10.06"
          width="2"
          height="4.84"
          transform="translate(37.05 -12.09) rotate(90)"
        />
      </svg>
    );
  }
}
