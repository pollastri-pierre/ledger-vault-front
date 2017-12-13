//@flow
import React, { PureComponent } from "react";

export default class Bell extends PureComponent<*> {
  render() {
    const { ...props } = this.props;
    return (
      <svg viewBox="0 0 28.77 32" {...props}>
        <path d="M23.51,20.05V12.76A9.12,9.12,0,0,0,17,4a2.59,2.59,0,0,0,0-.4,2.61,2.61,0,1,0-5.22,0,2.59,2.59,0,0,0,0,.4,9.12,9.12,0,0,0-6.55,8.75v7.29l-3.65,7.3h8.3a4.56,4.56,0,0,0,8.94,0h8.3Z" />
      </svg>
    );
  }
}
