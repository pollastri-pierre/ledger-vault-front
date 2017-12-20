//@flow
import React, { PureComponent } from "react";

type Props = { color: string };

export default class Lines extends PureComponent<Props> {
  static defaultProps = {
    color: "currentColor"
  };

  render() {
    const { color, ...props } = this.props;
    return (
      <svg viewBox="0 0 30 25.78" {...props}>
        <path
          fill={color}
          d="M0,25.78v-4H30v4Zm0-7.25v-4H23.51v4Zm0-7.25v-4H27.83v4ZM0,4V0H21.34V4Z"
        />
      </svg>
    );
  }
}
