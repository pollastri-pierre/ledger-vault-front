// @flow

import React from "react";
import invariant from "invariant";
import { useTranslation } from "react-i18next";

import Box from "components/base/Box";
import NotApplicableText from "components/base/NotApplicableText";
import LineRow from "components/LineRow";
import CollapsibleText from "components/CollapsibleText";
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
  const { t } = useTranslation();

  return (
    <Box>
      <OverviewTransaction
        amount={transaction.amount}
        account={account}
        transactionType="SEND"
      />
      <LineRow label={t("transactionCreation:steps.confirmation.identifier")}>
        <Copy text={transaction.recipient} />
      </LineRow>
      <LineRow label={t("transactionCreation:steps.confirmation.account")}>
        <AccountName account={account} />
      </LineRow>
      {transaction.note.title && (
        <LineRow label={t("transactionCreation:steps.note.noteTitle")}>
          <span data-test="note_title">{transaction.note.title}</span>
        </LineRow>
      )}
      <CollapsibleText
        data-test="note_comments"
        label={t("transactionCreation:steps.note.noteContent")}
        content={transaction.note.content || ""}
      />
      {transaction.utxoPickingStrategy && (
        <LineRow label={t("transactionCreation:steps.confirmation.strategy")}>
          {transaction.utxoPickingStrategy}
        </LineRow>
      )}
      <LineRow label={t("transactionCreation:steps.confirmation.fees")}>
        <Amount account={account} value={fees} disableERC20 />
      </LineRow>
      <LineRow label={t("transactionCreation:steps.confirmation.amount")}>
        <Amount account={account} value={transaction.amount} />
      </LineRow>
      <LineRow
        label={t("transactionCreation:steps.confirmation.total")}
        tooltipInfoMessage={
          isERC20 && t("transactionCreation:steps.confirmation.totalERC20Info")
        }
      >
        {totalSpent !== null && (
          <Amount account={account} value={totalSpent} strong />
        )}
      </LineRow>
      {isRipple && (
        <LineRow label={t("transactionCreation:steps.account.destinationTag")}>
          {transaction.destinationTag ? (
            transaction.destinationTag
          ) : (
            <NotApplicableText inline />
          )}
        </LineRow>
      )}
    </Box>
  );
};
