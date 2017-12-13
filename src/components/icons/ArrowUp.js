//@flow
import React, { PureComponent } from "react";

export default class ArrowUp extends PureComponent<*> {
  render() {
    const { color, ...props } = this.props;
    return (
      <svg viewBox="0 0 30.32 32.83" {...props}>
        <polyline
          style={{
            fill: "none",
            stroke: color,
            strokeMiterlimit: "10",
            strokeWidth: "4px"
          }}
          points="28.9 16.57 15.16 2.83 1.41 16.57"
        />
        <line
          style={{
            fill: "none",
            stroke: color,
            strokeMiterlimit: "10",
            strokeWidth: "4px"
          }}
          x1="15.16"
          y1="2.83"
          x2="15.16"
          y2="32.83"
        />
      </svg>
    );
  }
}
