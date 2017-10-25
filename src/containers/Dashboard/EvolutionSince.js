//@flow
import React, { Component } from 'react';
import DeltaChange from '../../components/DeltaChange';
import DashboardField from './DashboardField';
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
      <DashboardField label={`since ${TotalBalanceFilters[filter].title}`}>
        <DeltaChange before={valueHistory[filter]} after={value} showArrows />
      </DashboardField>
    );
  }
}

export default EvolutionSince;
