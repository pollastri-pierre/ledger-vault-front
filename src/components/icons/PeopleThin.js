//@flow
import React, { PureComponent } from "react";

export default class PeopleThin extends PureComponent<*> {
  render() {
    const { props } = this.props;
    return (
      <svg viewBox="0 0 32 29.05" {...props}>
        <path d="M24.08,26H31a9.88,9.88,0,0,0-14.28-8.87A11.63,11.63,0,0,1,24.08,26Z" />
        <path d="M12.63,16.42A11.63,11.63,0,0,0,1,28H24.26A11.63,11.63,0,0,0,12.63,16.42Z" />
        <path d="M21.1,3a6.53,6.53,0,0,0-2.71.59,7.68,7.68,0,0,1-1.15,11.27A6.56,6.56,0,1,0,21.1,3Z" />
        <circle cx="12.63" cy="8.71" r="7.71" />
      </svg>
    );
  }
}
