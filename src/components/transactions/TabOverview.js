// @flow
import React from "react";
import { useTranslation } from "react-i18next";

import TransactionStatus from "components/TransactionStatus";
import Copy from "components/base/Copy";
import Box from "components/base/Box";
import NotApplicableText from "components/base/NotApplicableText";
import NextRequestButton from "components/NextRequestButton";
import type { Transaction, Account } from "data/types";
import LineRow from "../LineRow";
import AccountName from "../AccountName";
import OverviewTransaction from "../OverviewTransaction";
import Amount from "../Amount";

type Props = {
  transaction: Transaction,
  account: Account,
};

export default function TabOverview(props: Props) {
  const { transaction, account } = props;
  const note = transaction.notes.length ? transaction.notes[0] : null;
  const isRipple = account.account_type === "Ripple";
  const { t } = useTranslation();
  const totalSpent =
    account.account_type === "Erc20"
      ? transaction.amount
      : transaction.amount.plus(transaction.fees);

  return (
    <Box>
      <OverviewTransaction
        amount={transaction.amount}
        account={account}
        transactionType={transaction.type}
        created_on={transaction.created_on}
      />
      <Box>
        <LineRow label={t("transactionDetails:overview.identifier")}>
          {transaction.tx_hash ? (
            <Copy text={transaction.tx_hash} />
          ) : (
            <NotApplicableText inline />
          )}
        </LineRow>
        <LineRow label={t("transactionDetails:overview.recipient")}>
          <Copy text={transaction.recipient} />
        </LineRow>
        <LineRow label={t("transactionDetails:overview.status")}>
          <Box flow={10} horizontal align="center">
            <TransactionStatus transaction={transaction} />
            {transaction.status === "APPROVED" && transaction.last_request && (
              <NextRequestButton request={transaction.last_request} />
            )}
          </Box>
        </LineRow>

        <LineRow label={t("transactionDetails:overview.account")}>
          <Box align="flex-end">
            <AccountName account={account} />
          </Box>
        </LineRow>

        {isRipple && (
          <LineRow
            label={t("transactionCreation:steps.account.destinationTag")}
          >
            {transaction.destination_tag}
          </LineRow>
        )}
        {note && note.title && (
          <LineRow label={t("transactionCreation:steps.note.noteTitle")}>
            {note.title}
          </LineRow>
        )}
        {note && note.content && (
          <LineRow label={t("transactionCreation:steps.note.noteContent")}>
            {note.content}
          </LineRow>
        )}
        <LineRow label={t("transactionDetails:overview.fees")}>
          <Amount disableERC20 account={account} value={transaction.fees} />
        </LineRow>
        <LineRow label={t("transactionDetails:overview.amount")}>
          <Amount account={account} value={transaction.amount} />
        </LineRow>
        <LineRow label={t("transactionDetails:overview.total")}>
          <Amount account={account} value={totalSpent} strong />
        </LineRow>
      </Box>
    </Box>
  );
}
