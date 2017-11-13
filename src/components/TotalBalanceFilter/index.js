//@flow
import React, { Component } from "react";
import "./TotalBalanceFilter.css";
import CustomSelectField from "../CustomSelectField/CustomSelectField.js";

export const TotalBalanceFilters = [
  { title: "yesterday", key: "yesterday" },
  { title: "a week ago", key: "week" },
  { title: "a month ago", key: "month" }
];

class TotalBalanceFilter extends Component<*> {
  onChange = (value: *) => this.props.onChange(value);

  render() {
    return (
      <CustomSelectField
        values={TotalBalanceFilters}
        selected={TotalBalanceFilters[0]}
        onChange={this.onChange}
      />
    );
  }
}

export default TotalBalanceFilter;
