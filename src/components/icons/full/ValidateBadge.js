//@flow
import React, { PureComponent } from "react";

type Props = { color: string };

export default class ValidateBadge extends PureComponent<Props> {
  static defaultProps = {
    color: "#000"
  };

  render() {
    const { color, ...props } = this.props;

    return (
      <svg viewBox="0 0 30 30" {...props}>
        <path
          fill={color}
          d="M15,0A15,15,0,1,0,30,15,15,15,0,0,0,15,0ZM12.95,22.32,5.87,15.46l2.51-2.58,4.57,4.43,8.68-8.41,2.51,2.58Z"
        />
      </svg>
    );
  }
}
