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
  const estimatedFees = bridge.getEstimatedFees(transaction);
  const totalSpent = bridge.getTotalSpent(account, transaction);
  // TODO display speed, btc and etc is different, checkout type
  const { t } = useTranslation();

  return (
    <Box>
      <OverviewTransaction
        amount={transaction.amount}
        account={account}
        transactionType="SEND"
      />
      <LineRow label={t("transactionCreation:steps.confirmation.account")}>
        <AccountName account={account} />
      </LineRow>
      <LineRow label={t("transactionCreation:steps.confirmation.identifier")}>
        <Copy text={transaction.recipient} />
      </LineRow>
      {transaction.note.title && (
        <LineRow label="Title (optional)">
          <span data-test="note_title">{transaction.note.title}</span>
        </LineRow>
      )}
      {transaction.note.content && (
        <CollapsibleText
          data-test="note_comments"
          label="Comments (optional)"
          content={transaction.note.content || ""}
        />
      )}
      {isRipple && (
        <LineRow label={t("transactionCreation:steps.account.destinationTag")}>
          {transaction.destinationTag ? (
            transaction.destinationTag
          ) : (
            <NotApplicableText inline />
          )}
        </LineRow>
      )}
      {transaction.utxoPickingStrategy && (
        <LineRow label={t("transactionCreation:steps.confirmation.strategy")}>
          {transaction.utxoPickingStrategy}
        </LineRow>
      )}
      <LineRow label={t("transactionCreation:steps.confirmation.amount")}>
        <Amount account={account} value={transaction.amount} />
      </LineRow>
      <LineRow label="Max fees">
        <Amount account={account} value={estimatedFees} disableERC20 />
      </LineRow>
      <LineRow
        label="Max total amount"
        tooltipInfoMessage={
          isERC20 && t("transactionCreation:steps.confirmation.totalERC20Info")
        }
      >
        {totalSpent !== null && (
          <Amount account={account} value={totalSpent} strong />
        )}
      </LineRow>
    </Box>
  );
};
