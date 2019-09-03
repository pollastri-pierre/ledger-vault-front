// @flow
import React, { useState } from "react";
import { Trans } from "react-i18next";
import LineRow from "components/LineRow";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import Copy from "components/base/Copy";
import AccountName from "components/AccountName";
import Box from "components/base/Box";
import { FaChevronDown } from "react-icons/fa";
import colors from "shared/colors";
import InfoBox from "components/base/InfoBox";
import AccountTransactionRules from "containers/Admin/Accounts/AccountTransactionRules";
import ParentAccount from "components/ParentAccount";
import { isBalanceAvailable } from "utils/accounts";
import type { Account } from "data/types";

const iconDown = <FaChevronDown size={12} color={colors.lightGrey} />;
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

const Rows = ({ account }: { account: Account }) => {
  const [isRuleVisible, setRule] = useState(false);
  const setRuleVisible = () => setRule(true);
  return (
    <div>
      <LineRow label={<Trans i18nKey="accountDetails:name" />}>
        <AccountName account={account} />
      </LineRow>
      {isBalanceAvailable(account) && (
        <LineRow label={<Trans i18nKey="accountDetails:balance" />}>
          <CurrencyAccountValue account={account} value={account.balance} />
        </LineRow>
      )}
      {account.account_type === "Erc20" && account.parent && (
        <>
          <LineRow
            label={<Trans i18nKey="accountView:summary.token_address" />}
          >
            <Copy text={account.contract_address} />
          </LineRow>
          <LineRow
            label={<Trans i18nKey="accountView:summary.parent_account" />}
          >
            <ParentAccount id={account.parent} />
          </LineRow>
        </>
      )}
      {account.tx_approval_steps && !isRuleVisible && (
        <LineRow label={<Trans i18nKey="entityModal:tabs.transactionRules" />}>
          <Box
            onClick={setRuleVisible}
            horizontal
            flow={10}
            align="center"
            style={{ cursor: "pointer" }}
          >
            <div>
              <Trans
                i18nKey="accountCreation:rulesSumup"
                count={account.tx_approval_steps.length}
                values={{ count: account.tx_approval_steps.length }}
              />
            </div>
            {iconDown}
          </Box>
        </LineRow>
      )}
      {account.tx_approval_steps && isRuleVisible && (
        <LineRow
          label={<Trans i18nKey="entityModal:tabs.transactionRules" />}
          vertical
        >
          <AccountTransactionRules account={account} noTitle />
        </LineRow>
      )}
    </div>
  );
};

export default AccountOverview;
