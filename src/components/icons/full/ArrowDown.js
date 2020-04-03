// @flow
import React, { PureComponent } from "react";

type Props = { className: string };

class ArrowDown extends PureComponent<Props> {
  render() {
    const { className } = this.props;

    return (
      <svg viewBox="0 0 30 18.25" style={{ width: 13 }} className={className}>
        <polygon points="0 3.25 3.26 0 15 11.75 26.75 0 30 3.25 15 18.25 0 3.25" />
      </svg>
    );
  }
}

export default ArrowDown;
