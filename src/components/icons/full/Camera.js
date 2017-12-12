//@flow
import React, { PureComponent } from "react";

export default class Camera extends PureComponent<*> {
  render() {
    const { color, ...props } = this.props;
    return (
      <svg viewBox="0 0 30 24.87" {...props}>
        <path
          fill={color}
          d="M22.32,3.59,18.87.32A1.15,1.15,0,0,0,18.08,0H11.92a1.15,1.15,0,0,0-.79.32L7.68,3.59H0V24.87H30V3.59ZM15,20a5.77,5.77,0,1,1,5.77-5.77A5.77,5.77,0,0,1,15,20Zm0,0"
        />
      </svg>
    );
  }
}
