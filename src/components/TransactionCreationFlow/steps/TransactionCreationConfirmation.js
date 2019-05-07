// @flow

import React from "react";
import invariant from "invariant";
import { Trans } from "react-i18next";

import Box from "components/base/Box";
import LineRow from "components/LineRow";
import OverviewTransaction from "components/OverviewTransaction";
import AccountName from "components/AccountName";
import Amount from "components/Amount";
import Copy from "components/base/Copy";
import type { TransactionCreationStepProps } from "../types";

export default (props: TransactionCreationStepProps<any>) => {
  const { payload } = props;
  const { transaction, account, bridge } = payload;
  invariant(transaction && account && bridge, "Invalid transaction");
  const isERC20 = account.account_type === "ERC20";
  const fees = bridge.getFees(account, transaction);
  const totalSpent = bridge.getTotalSpent(account, transaction);
  return (
    <Box>
      <OverviewTransaction
        amount={transaction.amount}
        account={account}
        transactionType="SEND"
      />
      <LineRow label={<Trans i18nKey="send:confirmation.identifier" />}>
        <Copy text={transaction.recipient} />
      </LineRow>
      <LineRow label={<Trans i18nKey="send:confirmation.account" />}>
        <AccountName account={account} />
      </LineRow>
      <LineRow label={<Trans i18nKey="send:confirmation.fees" />}>
        <Amount account={account} value={fees} />
      </LineRow>
      <LineRow
        label={<Trans i18nKey="send:confirmation.total" />}
        tooltipInfoMessage={
          isERC20 && <Trans i18nKey="send:confirmation.totalERC20Info" />
        }
      >
        {totalSpent !== null && (
          <Amount
            account={account}
            value={totalSpent}
            strong
            erc20Format={isERC20}
          />
        )}
      </LineRow>
    </Box>
  );
};
