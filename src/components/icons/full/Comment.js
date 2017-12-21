//@flow
import React, { PureComponent } from "react";

type Props = { color: string };

export default class Comment extends PureComponent<Props> {
  static defaultProps = {
    color: "currentColor"
  };

  render() {
    const { color, className } = this.props;
    return (
      <svg viewBox="0 0 30 22.38" className={className}>
        <path
          fill={color}
          d="M30,9a9,9,0,0,0-9-9H9A9,9,0,0,0,0,9v1.87c0,2.24,0,11.5,0,11.5a81.35,81.35,0,0,1,9-2.5H21a9,9,0,0,0,9-9ZM11,12.38H7v-4h4Zm6,0H13v-4h4Zm6,0H19v-4h4Z"
        />
      </svg>
    );
  }
}
