//@flow
import React, { PureComponent } from "react";

export default class ClockThin extends PureComponent<*> {
  render() {
    const { ...props } = this.props;
    return (
      <svg viewBox="0 0 32 32" {...props}>
        <circle
          style={{
            fill: "none",
            strokeMiterlimit: "10",
            strokeWidth: "2px"
          }}
          cx="16"
          cy="16"
          r="15"
        />
        <polyline
          style={{
            fill: "none",
            strokeMiterlimit: "10",
            strokeWidth: "2px"
          }}
          points="16 7.8 16 16.42 20.96 21"
        />
      </svg>
    );
  }
}
