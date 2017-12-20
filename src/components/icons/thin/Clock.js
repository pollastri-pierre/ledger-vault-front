//@flow
import React, { PureComponent } from "react";

type Props = { color: string };

export default class ClockThin extends PureComponent<Props> {
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
      <svg viewBox="0 0 32 32" {...props}>
        <circle style={style} cx="16" cy="16" r="15" />
        <polyline style={style} points="16 7.8 16 16.42 20.96 21" />
      </svg>
    );
  }
}
