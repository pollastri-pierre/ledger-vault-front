//@flow
import React, { PureComponent } from "react";

type Props = { color: string };

export default class Share extends PureComponent<Props> {
  static defaultProps = {
    color: "#000"
  };

  render() {
    const { color, ...props } = this.props;
    return (
      <svg viewBox="0 0 30 23.63" {...props}>
        <path
          fill={color}
          d="M30,10.58,17.3,0V6.33A17.3,17.3,0,0,0,0,23.63a17.3,17.3,0,0,1,17.3-8.85v6.37Z"
        />
      </svg>
    );
  }
}
