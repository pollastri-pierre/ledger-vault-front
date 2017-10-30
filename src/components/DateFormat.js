//@flow
import moment from "moment";
import React, { Component } from "react";

class DateFormat extends Component<*> {
  props: {
    date: Date | string,
    format: string
  };
  static defaultProps = {
    format: "lll"
  };
  render() {
    const { date, format } = this.props;
    return <span>{moment(date).format(format)}</span>;
  }
}

export default DateFormat;
