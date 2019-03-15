// @flow
import React, { PureComponent } from "react";

type Props = { color?: string };

export default class ArrowUp extends PureComponent<Props> {
  static defaultProps = {
    color: "currentColor",
  };

  render() {
    const { color, ...props } = this.props;
    const style = {
      fill: "none",
      stroke: color,
      strokeMiterlimit: "10",
      strokeWidth: "4px",
    };

    return (
      <svg viewBox="0 0 30.32 32.83" {...props}>
        <polyline style={style} points="28.9 16.57 15.16 2.83 1.41 16.57" />
        <line style={style} x1="15.16" y1="2.83" x2="15.16" y2="32.83" />
      </svg>
    );
  }
}
