//@flow
import React, { PureComponent } from "react";

type Props = { color: string };

export default class Home extends PureComponent<Props> {
  static defaultProps = {
    color: "#000"
  };

  render() {
    const { color, ...props } = this.props;
    return (
      <svg viewBox="0 0 30 25.31" {...props}>
        <path
          fill={color}
          d="M15,0,0,15.94H3.75v9.37h8V16.85h6.58v8.46h8V15.94H30Z"
        />
      </svg>
    );
  }
}
