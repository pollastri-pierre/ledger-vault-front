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
    filter: Filter
  };
  render() {
    const { value, valueHistory, filter } = this.props;
    return (
      <CardField label={`since ${TotalBalanceFilters[filter].title}`}>
        <DeltaChange before={valueHistory[filter]} after={value} showArrow />
      </CardField>
    );
  }
}

export default EvolutionSince;
