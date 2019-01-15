// @flow
import React, { PureComponent } from "react";

type Props = { color?: string };

export default class Trash extends PureComponent<Props> {
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
      <svg viewBox="0 0 26.95 32" {...props}>
        <rect style={style} x="4.15" y="6.04" width="18.71" height="24.96" />
        <polyline style={style} points="7.48 6.07 10.14 1 16.8 1 19.47 6.07" />
        <line style={style} y1="6.04" x2="26.95" y2="6.04" />
        <line style={style} x1="13.5" y1="12.18" x2="13.5" y2="24.86" />
        <line style={style} x1="8.05" y1="12.18" x2="8.05" y2="24.86" />
        <line style={style} x1="18.95" y1="12.18" x2="18.95" y2="24.86" />
      </svg>
    );
  }
}
