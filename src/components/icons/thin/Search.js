//@flow
import React, { PureComponent } from "react";

type Props = { color: string };

export default class Search extends PureComponent<Props> {
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
      <svg viewBox="0 0 23.31 31.5" {...props}>
        <line style={style} x1="22.44" y1="31" x2="15.79" y2="19.49" />
        <circle style={style} cx="10.82" cy="10.82" r="9.82" />
      </svg>
    );
  }
}
