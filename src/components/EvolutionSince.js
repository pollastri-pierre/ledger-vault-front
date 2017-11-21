//@flow
import React, { Component } from "react";
import DeltaChange from "./DeltaChange";
import CardField from "./CardField";

export type FilterKey = string;
export type Filter = { title: string, key: FilterKey };

export const TotalBalanceFilters: Filter[] = [
  { title: "yesterday", key: "yesterday" },
  { title: "a week ago", key: "week" },
  { title: "a month ago", key: "month" }
];

// TODO move into components
class EvolutionSince extends Component<{
  value: number,
  valueHistory: { [_: FilterKey]: number },
  filter: ?Filter
}> {
  render() {
    const { value, valueHistory, filter } = this.props;
    if (!filter) return null;
    return (
      <CardField label={`since ${filter.title}`} className="evolution-since">
        <DeltaChange
          before={valueHistory[filter.key]}
          after={value}
          showArrow
        />
      </CardField>
    );
  }
}

export default EvolutionSince;
