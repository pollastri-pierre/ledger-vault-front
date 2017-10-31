//@flow
import React, { Component } from "react";
import DeltaChange from "../../components/DeltaChange";
import CardField from "../../components/CardField";
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
