// @flow
import React from "react";
import { Trans } from "react-i18next";
import LineRow from "components/LineRow";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import AccountName from "components/AccountName";
import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import AccountTransactionRules from "containers/Admin/Accounts/AccountTransactionRules";
import { isBalanceAvailable } from "utils/accounts";
import type { Account } from "data/types";

const AccountOverview = ({
  account,
  hasPendingTransactions,
}: {
  account: Account,
  hasPendingTransactions: boolean,
}) => (
  <Box flow={20}>
    {hasPendingTransactions && (
      <InfoBox type="info">
        <Trans i18nKey="accountDetails:warnPendingTxs" />
      </InfoBox>
    )}
    <Rows account={account} />
  </Box>
);

const Rows = ({ account }: { account: Account }) => (
  <div>
    <LineRow label={<Trans i18nKey="accountDetails:name" />}>
      <AccountName account={account} />
    </LineRow>
    {isBalanceAvailable(account) && (
      <LineRow label={<Trans i18nKey="accountDetails:balance" />}>
        <CurrencyAccountValue account={account} value={account.balance} />
      </LineRow>
    )}
    {account.tx_approval_steps && (
      <LineRow
        vertical
        label={<Trans i18nKey="entityModal:tabs.transactionRules" />}
      >
        <AccountTransactionRules account={account} />
      </LineRow>
    )}
  </div>
);

export default AccountOverview;
