// @flow

import React, { PureComponent } from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import { MdClose } from "react-icons/md";
import type { ObjectParameters, ObjectParameter } from "query-string";

import SelectAccount from "components/SelectAccount";
import AccountName from "components/AccountName";

import Box from "components/base/Box";
import type { Account } from "data/types";

import FieldTitle from "./FieldTitle";
import { defaultFieldProps } from "../FiltersCard";
import type { FieldProps } from "../FiltersCard";

const EMPTY_ARRAY = [];

type Props = FieldProps & {
  accounts: Account[]
};

class FilterFieldAccounts extends PureComponent<Props> {
  static defaultProps = defaultFieldProps;

  updateAccounts = (
    updater: (
      $ReadOnlyArray<ObjectParameter>
    ) => $ReadOnlyArray<ObjectParameter>
  ) => {
    const { query, updateQuery } = this.props;
    updateQuery("accounts", updater(resolveAccounts(query)));
  };

  handleChange = (account: ?Account) => {
    if (!account) return;
    // $FlowFixMe WTF is flow complaining about no `id` in undefined.. I checked it the *line before*.
    this.updateAccounts(accountsIds => [...(accountsIds || []), account.id]);
  };

  handleRemoveAccount = (account: Account) => {
    const EXCLUDE_ID = id => id !== account.id;
    this.updateAccounts(accountsIds => accountsIds.filter(EXCLUDE_ID));
  };

  render() {
    const { accounts, query } = this.props;

    const selectedAccountsIds = resolveAccounts(query);
    const selectedCurrency = resolveCurrency(query);

    const selectedAccounts = selectedAccountsIds
      .map(accountId => accounts.find(account => account.id === accountId))
      .filter(Boolean);

    const filteredAccounts = accounts.filter(
      account =>
        !selectedAccountsIds.find(id => id === account.id) &&
        (!selectedCurrency || account.currency_id === selectedCurrency)
    );

    const isActive = selectedAccounts.length > 0;

    if (!filteredAccounts.length && !selectedAccounts.length) return null;

    return (
      <Box flow={5}>
        <FieldTitle isActive={isActive}>Accounts</FieldTitle>

        <Box flow={10}>
          <AccountsList
            accounts={selectedAccounts}
            onRemove={this.handleRemoveAccount}
          />
          {filteredAccounts.length > 0 && (
            <SelectAccount
              value={null}
              accounts={filteredAccounts}
              onChange={this.handleChange}
              closeMenuOnSelect={false}
            />
          )}
        </Box>
      </Box>
    );
  }
}

const AccountsList = ({
  accounts,
  onRemove
}: {
  accounts: Account[],
  onRemove: Account => void
}) =>
  accounts.length ? (
    <Box flow={5}>
      {accounts.map(account => (
        <ButtonBase key={account.id} onClick={() => onRemove(account)}>
          <Box
            align="flex-start"
            horizontal
            width="100%"
            justify="space-between"
            px={5}
            py={10}
          >
            <AccountName account={account} />
            <MdClose />
          </Box>
        </ButtonBase>
      ))}
    </Box>
  ) : null;

function resolveAccounts(query: ObjectParameters) {
  return Array.isArray(query.accounts) ? query.accounts : EMPTY_ARRAY;
}

function resolveCurrency(query: ObjectParameters) {
  return typeof query.currency === "string" ? query.currency : null;
}

export default FilterFieldAccounts;
