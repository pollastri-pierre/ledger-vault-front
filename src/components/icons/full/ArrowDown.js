//@flow
import React, { PureComponent } from "react";

type Props = { color: string };

export default class ArrowDown extends PureComponent<Props> {
  static defaultProps = {
    color: "#000"
  };

  render() {
    const { color, ...props } = this.props;

    return (
      <svg viewBox="0 0 30 18.25" {...props}>
        <polygon
          fill={color}
          points="0 3.25 3.26 0 15 11.75 26.75 0 30 3.25 15 18.25 0 3.25"
        />
      </svg>
    );
  }
}
