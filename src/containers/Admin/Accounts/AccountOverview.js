// @flow
import React from "react";
import { Trans } from "react-i18next";
import LineRow from "components/LineRow";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import AccountName from "components/AccountName";
import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
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
  <>
    <LineRow label={<Trans i18nKey="accountDetails:type" />}>
      {account.last_request && account.last_request.type}
    </LineRow>
    <LineRow label={<Trans i18nKey="accountDetails:name" />}>
      <AccountName account={account} />
    </LineRow>
    <LineRow label={<Trans i18nKey="accountDetails:balance" />}>
      <CurrencyAccountValue
        account={account}
        value={account.balance}
        erc20Format={account.account_type === "ERC20"}
      />
    </LineRow>
  </>
);

export default AccountOverview;
