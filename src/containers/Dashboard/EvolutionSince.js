//@flow
import React, { Component } from "react";
import DeltaChange from "../../components/DeltaChange";
import DashboardField from "./DashboardField";
import { TotalBalanceFilters } from "../../components/TotalBalanceFilter";

type Filter = "yesterday" | "week" | "month";

class EvolutionSince extends Component<*> {
  props: {
    value: number,
    valueHistory: { [_: Filter]: number },
    filter: { title: string, key: string }
  };
  render() {
    const { value, valueHistory, filter } = this.props;
    return (
      <DashboardField label={`since ${filter.title}`}>
        <DeltaChange
          before={valueHistory[filter.key]}
          after={value}
          showArrow
        />
      </DashboardField>
    );
  }
}

export default EvolutionSince;
