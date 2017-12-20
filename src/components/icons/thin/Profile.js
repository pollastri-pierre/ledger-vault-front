//@flow
import React, { PureComponent } from "react";

type Props = { color: string };

export default class Profile extends PureComponent<Props> {
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
      <svg viewBox="0 0 27.8 32" {...props}>
        <path
          d="M13.9,18.1A12.9,12.9,0,0,0,1,31H26.8A12.9,12.9,0,0,0,13.9,18.1Z"
          style={style}
        />
        <circle cx="13.9" cy="9.55" r="8.55" style={style} />
      </svg>
    );
  }
}
