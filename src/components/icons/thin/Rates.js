//@flow
import React, { PureComponent } from "react";

export default class Rates extends PureComponent<*> {
  render() {
    const { ...props } = this.props;
    return (
      <svg viewBox="0 0 25 30" {...props}>
        <line
          style={{ fill: "none", strikeMiterlimit: 10 }}
          x1="1"
          x2="1"
          y2="30"
        />
        <line
          style={{ fill: "none", strikeMiterlimit: 10 }}
          x1="9"
          y1="10"
          x2="9"
          y2="30"
        />
        <line
          style={{ fill: "none", strikeMiterlimit: 10 }}
          x1="17"
          y1="5.69"
          x2="17"
          y2="30"
        />
        <line
          style={{ fill: "none", strikeMiterlimit: 10 }}
          x1="24"
          y1="15.42"
          x2="24"
          y2="30"
        />
      </svg>
    );
  }
}
