//@flow
import React, { Component } from 'react';
import DeltaChange from '../../components/DeltaChange';
import { TotalBalanceFilters } from '../../redux/modules/dashboard';

type Filter = 'yesterday' | 'week' | 'month';

class EvolutionSince extends Component<*> {
  props: {
    value: number,
    valueHistory: { [_: Filter]: number },
    filter: Filter
  };
  render() {
    const { value, valueHistory, filter } = this.props;
    return (
      <div className="evolution-since">
        <DeltaChange before={valueHistory[filter]} after={value} />
        <div>since {TotalBalanceFilters[filter].title}</div>
      </div>
    );
  }
}

export default EvolutionSince;
