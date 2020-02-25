// @flow
import React, { PureComponent } from "react";

type Props = { className?: string };

class ValidateBadge extends PureComponent<Props> {
  render() {
    const { className } = this.props;

    return (
      <svg
        viewBox="0 0 30 30"
        className={className}
        style={{ width: 13 }}
        fill="currentColor"
      >
        <path d="M15,0A15,15,0,1,0,30,15,15,15,0,0,0,15,0ZM12.95,22.32,5.87,15.46l2.51-2.58,4.57,4.43,8.68-8.41,2.51,2.58Z" />
      </svg>
    );
  }
}

export default ValidateBadge;
