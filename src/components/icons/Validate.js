//@flow
import React, { PureComponent } from "react";

export default class Validate extends PureComponent<*> {
  render() {
    const { ...props } = this.props;
    return (
      <svg viewBox="0 0 30 22.17" {...props}>
        <polygon
          id="Validate"
          points="0 11.09 3.26 7.83 11.09 15.68 26.74 0 30 3.26 11.09 22.17 0 11.09"
        />
      </svg>
    );
  }
}
