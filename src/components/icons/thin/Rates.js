// @flow
import React, { PureComponent } from "react";

type Props = { color?: string };

export default class Rates extends PureComponent<Props> {
  static defaultProps = {
    color: "currentColor"
  };

  render() {
    const { color, ...props } = this.props;
    const style = {
      fill: "none",
      stroke: color,
      strokeMiterlimit: "10",
      strokeWidth: "2px"
    };

    return (
      <svg viewBox="0 0 25 30" {...props}>
        <line style={style} x1="1" x2="1" y2="30" />
        <line style={style} x1="9" y1="10" x2="9" y2="30" />
        <line style={style} x1="17" y1="5.69" x2="17" y2="30" />
        <line style={style} x1="24" y1="15.42" x2="24" y2="30" />
      </svg>
    );
  }
}
