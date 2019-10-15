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
  const isERC20 = account.account_type === "Erc20";
  const isRipple = account.account_type === "Ripple";
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
      {transaction.note.title && (
        <LineRow
          label={<Trans i18nKey="transactionCreation:steps.note.noteTitle" />}
        >
          <span data-test="note_title">{transaction.note.title}</span>
        </LineRow>
      )}
      {transaction.note.content && (
        <LineRow
          label={<Trans i18nKey="transactionCreation:steps.note.noteContent" />}
        >
          <span data-test="note_comments">{transaction.note.content}</span>
        </LineRow>
      )}
      <LineRow label={<Trans i18nKey="send:confirmation.fees" />}>
        <Amount account={account} value={fees} disableERC20 />
      </LineRow>
      <LineRow
        label={<Trans i18nKey="send:confirmation.total" />}
        tooltipInfoMessage={
          isERC20 && <Trans i18nKey="send:confirmation.totalERC20Info" />
        }
      >
        {totalSpent !== null && (
          <Amount account={account} value={totalSpent} strong />
        )}
      </LineRow>
      {isRipple && (
        <LineRow
          label={
            <Trans i18nKey="transactionCreation:steps.amount.destinationTag" />
          }
        >
          {transaction.destinationTag}
        </LineRow>
      )}
    </Box>
  );
};
