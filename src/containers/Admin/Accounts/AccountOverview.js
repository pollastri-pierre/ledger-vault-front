// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import LineRow from "components/LineRow";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import Copy from "components/base/Copy";
import AccountName from "components/AccountName";
import Box from "components/base/Box";
import Text from "components/base/Text";
import InfoBox from "components/base/InfoBox";
import ParentAccount from "components/ParentAccount";
import MultiRules from "components/MultiRules";
import { isBalanceAvailable, getAccountCurrencyOrToken } from "utils/accounts";
import type { Account } from "data/types";

const AccountOverview = ({
  account,
  hasPendingTransactions,
}: {
  account: Account,
  hasPendingTransactions: boolean,
}) => {
  const { t } = useTranslation();
  return (
    <Box flow={20}>
      {hasPendingTransactions && (
        <InfoBox type="info">{t("accountDetails:warnPendingTxs")}</InfoBox>
      )}
      <Rows account={account} />
    </Box>
  );
};

const Rows = ({ account }: { account: Account }) => {
  const currencyOrToken = getAccountCurrencyOrToken(account);
  const { t } = useTranslation();
  return (
    <div>
      <LineRow label={t("accountDetails:name")}>
        <AccountName account={account} />
      </LineRow>
      {isBalanceAvailable(account) && (
        <LineRow label={t("accountDetails:balance")}>
          <CurrencyAccountValue account={account} value={account.balance} />
        </LineRow>
      )}
      {account.account_type === "Erc20" && account.parent && (
        <>
          <LineRow label={t("accountView:summary.token_address")}>
            <Copy text={account.contract_address} />
          </LineRow>
          <LineRow label={t("accountView:summary.parent_account")}>
            <ParentAccount id={account.parent} />
          </LineRow>
        </>
      )}
      {account.governance_rules && account.governance_rules.length && (
        <LineRow
          label={t("entityModal:tabs.transactionRules")}
          collapsibleState="collapsed"
          collapsibleChildren={
            account.governance_rules && (
              <MultiRules
                readOnly
                rulesSets={account.governance_rules}
                currencyOrToken={currencyOrToken}
              />
            )
          }
        >
          <Text
            i18nKey="accountCreation:rulesSumup"
            count={account.governance_rules.length}
            values={{ count: account.governance_rules.length }}
          />
        </LineRow>
      )}
    </div>
  );
};

export default AccountOverview;
