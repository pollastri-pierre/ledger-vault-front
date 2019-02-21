// @flow

import React, { PureComponent, Fragment } from "react";

import FiltersCard from "./FiltersCard";

import FieldCurrency from "./fields/FilterFieldCurrency";
import FieldDate from "./fields/FilterFieldDate";

import type { FieldProps } from "./FiltersCard";

type Props = {
  query: string,
  onChange: string => void
};

class FiltersOperations extends PureComponent<Props> {
  renderFields = (p: FieldProps) => (
    <Fragment>
      <FieldCurrency {...p} />
      <FieldDate {...p} />
    </Fragment>
  );

  render() {
    return (
      <FiltersCard title="Filters" subtitle="Find transactions" {...this.props}>
        {this.renderFields}
      </FiltersCard>
    );
  }
}

export default FiltersOperations;
