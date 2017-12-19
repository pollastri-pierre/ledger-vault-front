//@flow
import React, { PureComponent } from "react";

type Props = { color: string };

export default class Bell extends PureComponent<Props> {
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
      <svg viewBox="0 0 28.77 32" {...props}>
        <path
          style={style}
          d="M23.51,20.05V12.76A9.12,9.12,0,0,0,17,4a2.59,2.59,0,0,0,0-.4,2.61,2.61,0,1,0-5.22,0,2.59,2.59,0,0,0,0,.4,9.12,9.12,0,0,0-6.55,8.75v7.29l-3.65,7.3h8.3a4.56,4.56,0,0,0,8.94,0h8.3Z"
        />
      </svg>
    );
  }
}
