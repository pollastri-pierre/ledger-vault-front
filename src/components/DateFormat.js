//@flow
import moment from "moment";
import React, { Component } from "react";

class DateFormat extends Component<*> {
  props: {
    date: Date | string,
    dataTest: ?string,
    format: string
  };
  static defaultProps = {
    format: "lll"
  };
  render() {
    const { date, format, dataTest } = this.props;
    return <span data-test={dataTest}>{moment(date).format(format)}</span>;
  }
}

export default DateFormat;
