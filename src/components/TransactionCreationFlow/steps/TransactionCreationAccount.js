// @flow

import React, { useCallback, useMemo } from "react";
import invariant from "invariant";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { useTranslation } from "react-i18next";

import { getBridgeForCurrency } from "bridge";
import Box from "components/base/Box";
import { Label } from "components/base/form";
import SelectAccount from "components/SelectAccount";
import { isAccountSpendable } from "utils/transactions";

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
  props: $Shape<TransactionCreationStepProps<any>>,
) => {
  const { payload, updatePayload, accounts } = props;
  const { t } = useTranslation();
  const handleChange = useCallback(
    acc => {
      if (acc) {
        const {
          transaction,
          account,
          bridge,
        } = getBridgeAndTransactionFromAccount(acc);
        if (transaction) {
          updatePayload({ account, transaction, bridge });
        }
      } else {
        updatePayload({ transaction: null, account: null });
      }
    },
    [updatePayload],
  );

  const filteredAccounts = useMemo(
    () => accounts.edges.map(el => el.node).filter(isAccountSpendable),
    [accounts],
  );

  return (
    <Box>
      <Label>{t("transactionCreation:steps.account.title")}</Label>
      <SelectAccount
        value={payload.account}
        accounts={filteredAccounts}
        autoFocus
        onChange={handleChange}
      />
    </Box>
  );
};
export default TransactionCreationAccount;
