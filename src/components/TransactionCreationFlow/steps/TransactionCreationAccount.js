// @flow

import React, { useCallback } from "react";
import invariant from "invariant";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { Trans } from "react-i18next";

import { getBridgeForCurrency } from "bridge";
import { withMe } from "components/UserContextProvider";
import Box from "components/base/Box";
import { Label } from "components/base/form";
import SelectAccount from "components/SelectAccount";
import { isMemberOfFirstApprovalStep } from "utils/users";

import type { Account } from "data/types";
import type { TransactionCreationStepProps } from "../types";

export const getBridgeAndTransactionFromAccount = (account: Account) => {
  const currency = getCryptoCurrencyById(account.currency);
  const bridge = account ? getBridgeForCurrency(currency) : null;
  invariant(bridge, `Cannot find bridge for currency: ${currency.id}`);
  const transaction = bridge ? bridge.createTransaction(account) : null;
  return {
    account,
    bridge,
    transaction,
  };
};

const TransactionCreationAccount = (
  props: TransactionCreationStepProps<any>,
) => {
  const { payload, updatePayload, transitionTo, accounts } = props;

  const handleChange = useCallback(
    acc => {
      if (acc) {
        const {
          transaction,
          account,
          bridge,
        } = getBridgeAndTransactionFromAccount(acc);
        if (transaction) {
          updatePayload({ account, transaction, bridge }, () =>
            transitionTo("amount"),
          );
        }
      } else {
        updatePayload({ transaction: null, account: null });
      }
    },
    [transitionTo, updatePayload],
  );

  const filteredAccounts = accounts.edges
    .map(el => el.node)
    .filter(
      account =>
        isMemberOfFirstApprovalStep(account) &&
        account.balance.isGreaterThan(0),
    );

  return (
    <Box>
      <Label>
        <Trans i18nKey="transactionCreation:steps.account.desc" />
      </Label>
      <SelectAccount
        value={payload.account}
        accounts={filteredAccounts}
        autoFocus
        openMenuOnFocus
        onChange={handleChange}
      />
    </Box>
  );
};
export default withMe(TransactionCreationAccount);
