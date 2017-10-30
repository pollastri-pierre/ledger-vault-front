import React, { Component } from 'react';
import ArrowDown from "../icons/ArrowDown";
import "./TotalBalanceFilter.css";
import CustomSelectField from "../CustomSelectField/CustomSelectField.js"
import _ from "lodash";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


export const TotalBalanceFilters = {
 yesterday: { title: 'yesterday' },
 week: { title: 'a week ago' },
 month: { title: 'a month ago' }
};


class TotalBalanceFilter extends Component {

  onChange = (event, index, value) => this.props.onChange(value);

  render() {
    const values = _.reduce(Object.keys(TotalBalanceFilters), (values, filter) => {values.push({key: filter, title: TotalBalanceFilters[filter].title}); return values;}, []);
    const { value } = this.props;
    return (
      // FIXME this is not pixel perfect with wireframes.
      // we need to see how to make material-ui match that.
      <CustomSelectField values={values} selected={values[0]} onChange={this.onChange} />
    );
  }
}

export default TotalBalanceFilter;
