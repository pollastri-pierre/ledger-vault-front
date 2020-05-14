// @flow
import React from "react";
import { useTranslation } from "react-i18next";

import TransactionStatus from "components/TransactionStatus";
import Copy from "components/base/Copy";
import Box from "components/base/Box";
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
  const isRipple = account.account_type === "Ripple";
  const { t } = useTranslation();

  const totalAmount =
    account.account_type === "Erc20"
      ? transaction.amount
      : transaction.amount.plus(transaction.fees || transaction.max_fees);

  return (
    <Box>
      <OverviewTransaction
        amount={transaction.amount}
        account={account}
        transactionType={transaction.type}
        created_on={transaction.created_on}
      />
      <Box>
        <LineRow label="Account to debit">
          <Box align="flex-end">
            <AccountName account={account} />
          </Box>
        </LineRow>

        <LineRow label={t("transactionDetails:overview.recipient")}>
          <Copy text={transaction.recipient} />
        </LineRow>

        {transaction.tx_hash && (
          <LineRow label={t("transactionDetails:overview.identifier")}>
            <Copy text={transaction.tx_hash} />
          </LineRow>
        )}

        <LineRow label={t("transactionDetails:overview.status")}>
          <TransactionStatus transaction={transaction} />
        </LineRow>

        {isRipple && (
          <LineRow
            label={t("transactionCreation:steps.account.destinationTag")}
          >
            {transaction.destination_tag}
          </LineRow>
        )}

        <LineRow label={t("transactionDetails:overview.amount")}>
          <Amount account={account} value={transaction.amount} />
        </LineRow>

        {transaction.fees ? (
          <LineRow label={t("transactionDetails:overview.fees")}>
            <Amount disableERC20 account={account} value={transaction.fees} />
          </LineRow>
        ) : transaction.max_fees ? (
          <LineRow label={t("transactionDetails:overview.maxFees")}>
            <Amount
              disableERC20
              account={account}
              value={transaction.max_fees}
            />
          </LineRow>
        ) : null}

        <LineRow label={t("transactionDetails:overview.total")}>
          <Amount account={account} value={totalAmount} strong />
        </LineRow>
      </Box>
    </Box>
  );
}
