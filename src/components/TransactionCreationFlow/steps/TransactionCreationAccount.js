// @flow

import React, { useCallback } from "react";
import invariant from "invariant";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { Trans } from "react-i18next";

import { getBridgeForCurrency } from "bridge";
import Box from "components/base/Box";
import { Label } from "components/base/form";
import SelectAccount from "components/SelectAccount";

import type { TransactionCreationStepProps } from "../types";

export default (props: TransactionCreationStepProps<any>) => {
  const { payload, updatePayload, transitionTo, accounts } = props;

  const handleChange = useCallback(
    account => {
      if (account) {
        const currency = getCryptoCurrencyById(account.currency);
        const bridge = account ? getBridgeForCurrency(currency) : null;
        invariant(bridge, `Cannot find bridge for currency: ${currency.id}`);
        const transaction = bridge ? bridge.createTransaction(account) : null;
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
    .filter(account => account.balance.isGreaterThan(0));

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
