// @flow

import React, { PureComponent } from "react";

import type { Account } from "data/types";
import type { FieldsGroupProps } from "components/filters/types";

import {
  FiltersCard,
  FieldCurrency,
  FieldAccounts,
  FieldDate,
  FieldText,
  FieldTransactionStatuses,
} from "components/filters";

type Props = FieldsGroupProps & {
  accounts: Account[],
};

class TransactionsFilters extends PureComponent<Props> {
  render() {
    const { accounts, ...props } = this.props;
    return (
      <FiltersCard
        title="Find transactions"
        subtitle="Find transactions"
        {...props}
      >
        <FieldCurrency />
        <FieldAccounts accounts={accounts} />
        <FieldTransactionStatuses />
        <FieldDate />
        <FieldText title="Label" queryKey="label" placeholder="Label" />
      </FiltersCard>
    );
  }
}

export default TransactionsFilters;
