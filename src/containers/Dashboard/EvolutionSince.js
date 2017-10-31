//@flow
import React, { Component } from "react";
import DeltaChange from "../../components/DeltaChange";
import CardField from "../../components/CardField";

export type FilterKey = "yesterday" | "week" | "month";
export type Filter = { title: string, key: FilterKey };

// TODO move into components
class EvolutionSince extends Component<*> {
  props: {
    value: number,
    valueHistory: { [_: FilterKey]: number },
    filter: Filter
  };
  render() {
    const { value, valueHistory, filter } = this.props;
    return (
      <CardField label={`since ${filter.title}`}>
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
