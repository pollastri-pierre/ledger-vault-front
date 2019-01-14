// @flow
import React, { PureComponent } from "react";

class RateLimiterValue extends PureComponent<*> {
  props: {
    max_transaction: number,
    time_slot: number
  };

  getFrequency = (max_transaction: number, frequency: number) => {
    const operations = max_transaction > 1 ? "operations" : "operation";
    let granularity = "day";
    if (frequency === 60) {
      granularity = "minute";
    } else if (frequency === 3600) {
      granularity = "hour";
    }

    return `${max_transaction} ${operations} per ${granularity}`;
  };

  /* this is a generic component which displays "x operations per x frequency */

  render() {
    const { max_transaction, time_slot, ...rest } = this.props;
    return (
      <span {...rest}>{this.getFrequency(max_transaction, time_slot)}</span>
    );
  }
}

export default RateLimiterValue;
