// @flow
import React, { PureComponent } from "react";

type Props = {
  className: string,
};

class Plus extends PureComponent<Props> {
  render() {
    const { className } = this.props;
    return (
      <svg viewBox="0 0 30 30" style={{ width: 16 }} className={className}>
        <polygon
          fill="currentColor"
          stroke="none"
          points="12.6 30 12.6 17.4 0 17.4 0 12.6 12.6 12.6 12.6 0 17.4 0 17.4 12.6 30 12.6 30 17.4 17.4 17.4 17.4 30 12.6 30"
        />
      </svg>
    );
  }
}
export default Plus;
