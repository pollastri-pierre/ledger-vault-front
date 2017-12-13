//@flow
import React, { PureComponent } from "react";

export default class Rates extends PureComponent<*> {
  render() {
    const { props } = this.props;
    return (
      <svg viewBox="0 0 30 28.57" {...props}>
        <rect width="4.76" height="28.57" />
        <rect x="8.41" y="11.43" width="4.76" height="17.14" />
        <rect x="16.83" y="5.71" width="4.76" height="22.86" />
        <rect x="25.24" y="17.14" width="4.76" height="11.43" />
      </svg>
    );
  }
}
