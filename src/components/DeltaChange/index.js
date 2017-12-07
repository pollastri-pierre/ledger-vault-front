//@flow
import React, { PureComponent } from "react";
import ArrowUp from "../icons/ArrowUp";

const arrowIncr = <ArrowUp className="arrow incr" />;
const arrowDecr = <ArrowUp className="arrow decr" />;

// render a delta percentage (e.g. +2.89%) from a before and after value
class DeltaChange extends PureComponent<*> {
  props: {
    before: number,
    after: number,
    showArrow?: boolean
  };
  render() {
    const { before, after, showArrow } = this.props;
    if (!before || !after) return <span className="delta-change">{" "}</span>;
    const ratio = after / before;
    return (
      <span className="delta-change">
        {ratio >= 1
          ? "+" + Math.round(10000 * (ratio - 1)) / 100 + "%"
          : "-" + Math.round(10000 * (1 - ratio)) / 100 + "%"}
        {showArrow && ratio !== 0 ? (ratio > 0 ? arrowIncr : arrowDecr) : null}
      </span>
    );
  }
}

export default DeltaChange;
