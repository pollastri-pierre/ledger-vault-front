// @flow

import React, { PureComponent } from "react";

import type { Account } from "data/types";

import FiltersCard from "./FiltersCard";

import FieldCurrency from "./fields/FilterFieldCurrency";
import FieldAccounts from "./fields/FilterFieldAccounts";
import FieldDate from "./fields/FilterFieldDate";
import FieldText from "./fields/FilterFieldText";
import FieldOperationStatuses from "./fields/FilterFieldOperationStatuses";

type Props = {
  query: string,
  onChange: string => void,
  accounts: Account[]
};

class FiltersOperations extends PureComponent<Props> {
  render() {
    const { accounts, ...props } = this.props;
    return (
      <FiltersCard title="Filters" subtitle="Find transactions" {...props}>
        <FieldCurrency />
        <FieldAccounts accounts={accounts} />
        <FieldDate />
        <FieldText title="Label" queryKey="label" placeholder="Label" />
        <FieldOperationStatuses />
      </FiltersCard>
    );
  }
}

export default FiltersOperations;
