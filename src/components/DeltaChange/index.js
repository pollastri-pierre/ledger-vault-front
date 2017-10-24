//@flow
import React, { Component } from 'react';

// render a delta percentage (e.g. +2.89%) from a before and after value
class DeltaChange extends Component {
  props: {
    before: number,
    after: number
  };
  render() {
    const { before, after } = this.props;
    if (!before || !after) return <span />;
    const ratio = after / before;
    return (
      <span>
        {ratio >= 1
          ? '+' + Math.round(10000 * (ratio - 1)) / 100 + '%'
          : '-' + Math.round(10000 * (1 - ratio)) / 100 + '%'}
      </span>
    );
  }
}

export default DeltaChange;
