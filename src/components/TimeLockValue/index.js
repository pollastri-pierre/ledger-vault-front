// @flow
import React, { PureComponent } from "react";

class TimeLockValue extends PureComponent<*> {
  props: {
    time_lock: number,
  };

  getDuration = (time_lock: number) => {
    const minuts = { value: time_lock / 60, label: "minutes" };
    const hours = { value: time_lock / 3600, label: "hours" };
    const days = { value: time_lock / 84600, label: "days" };
    const values = [minuts, hours, days]
      .filter(item => Number.isInteger(item.value))
      .sort(item => item.value);

    if (values.length > 0) {
      return `${values[0].value} ${values[0].label}`;
    }
    return "";
  };

  /* this is a generic component which displays "x operations per x frequency */

  render() {
    const { time_lock, ...rest } = this.props;
    return <span {...rest}>{this.getDuration(time_lock)}</span>;
  }
}

export default TimeLockValue;
