//@flow
import React, { PureComponent } from "react";

type Props = { color: string };

export default class Plus extends PureComponent<Props> {
  static defaultProps = {
    color: "#000"
  };
  render() {
    const { color, ...props } = this.props;
    return (
      <svg viewBox="0 0 30 30" {...props}>
        <polygon
          fill={color}
          stroke="none"
          points="12.6 30 12.6 17.4 0 17.4 0 12.6 12.6 12.6 12.6 0 17.4 0 17.4 12.6 30 12.6 30 17.4 17.4 17.4 17.4 30 12.6 30"
        />
      </svg>
    );
  }
}
