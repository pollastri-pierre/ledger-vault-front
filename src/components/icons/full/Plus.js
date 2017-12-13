//@flow
import React, { PureComponent } from "react";

export default class Plus extends PureComponent<*> {
  render() {
    const { ...props } = this.props;
    return (
      <svg viewBox="0 0 30 30" {...props}>
        <polygon points="12.6 30 12.6 17.4 0 17.4 0 12.6 12.6 12.6 12.6 0 17.4 0 17.4 12.6 30 12.6 30 17.4 17.4 17.4 17.4 30 12.6 30" />
      </svg>
    );
  }
}
