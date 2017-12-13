//@flow
import React, { PureComponent } from "react";

export default class Home extends PureComponent<*> {
  render() {
    const { ...props } = this.props;
    return (
      <svg viewBox="0 0 30 25.31" {...props}>
        <path d="M15,0,0,15.94H3.75v9.37h8V16.85h6.58v8.46h8V15.94H30Z" />
      </svg>
    );
  }
}
