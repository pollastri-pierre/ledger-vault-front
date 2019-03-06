// @flow

import React, { PureComponent } from "react";

import { FiltersCard, FieldText, FieldCurrency } from "components/filters";
import type { FieldsGroupProps } from "components/filters/types";

class AccountsFilters extends PureComponent<FieldsGroupProps> {
  render() {
    const { ...props } = this.props;
    return (
      <FiltersCard title="Find accounts" subtitle="Find accounts" {...props}>
        <FieldCurrency />
        <FieldText title="Name" queryKey="name" placeholder="Name" />
      </FiltersCard>
    );
  }
}

export default AccountsFilters;
