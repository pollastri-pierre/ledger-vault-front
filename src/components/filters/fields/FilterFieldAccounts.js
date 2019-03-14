// @flow

import React, { PureComponent } from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import { MdClose } from "react-icons/md";
import type { ObjectParameters, ObjectParameter } from "query-string";

import SelectAccount from "components/SelectAccount";
import AccountName from "components/AccountName";

import Box from "components/base/Box";
import type { Account } from "data/types";

import { FieldTitle, defaultFieldProps } from "components/filters";
import type { FieldProps } from "components/filters/types";

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
    const { queryParams, updateQueryParams } = this.props;
    updateQueryParams("accounts", updater(resolveAccounts(queryParams)));
  };

  handleChange = (account: ?Account) => {
    if (!account) return;
    // $FlowFixMe WTF is flow complaining about no `id` in undefined.. I checked it the *line before*.
    this.updateAccounts(accountsIds => [...(accountsIds || []), account.id]);
  };

  handleRemoveAccount = (account: Account) => {
    const EXCLUDE_ID = id => id && id.toString() !== account.id.toString();
    this.updateAccounts(accountsIds => accountsIds.filter(EXCLUDE_ID));
  };

  render() {
    const { accounts, queryParams } = this.props;

    const selectedAccountsIds = resolveAccounts(queryParams);
    const selectedCurrency = resolveCurrency(queryParams);

    const selectedAccounts = selectedAccountsIds
      .map(accountId =>
        accounts.find(
          account => accountId && account.id.toString() === accountId.toString()
        )
      )
      .filter(Boolean);

    const filteredAccounts = accounts.filter(
      account =>
        !selectedAccountsIds.find(
          id => id && id.toString() === account.id.toString()
        ) &&
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

function resolveAccounts(queryParams: ObjectParameters) {
  return Array.isArray(queryParams.accounts)
    ? queryParams.accounts
    : typeof queryParams.accounts === "string"
    ? [queryParams.accounts]
    : EMPTY_ARRAY;
}

function resolveCurrency(queryParams: ObjectParameters) {
  return typeof queryParams.currency === "string" ? queryParams.currency : null;
}

export default FilterFieldAccounts;
