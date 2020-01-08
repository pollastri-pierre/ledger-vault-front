// @flow

// ==================================================
// DISCLAIMER: this is legacy code. to be refactored.
// ==================================================

import React from "react";
import { Trans } from "react-i18next";

import InfoBox from "components/base/InfoBox";
import MultiRules from "components/MultiRules";
import Box from "components/base/Box";
import Text from "components/base/Text";
import AccountName from "components/AccountName";
import LineRow from "components/LineRow";
import type { AccountCreationStepProps } from "../types";

export default (props: AccountCreationStepProps) => {
  const { payload, whitelists } = props;

  const { currency, erc20token, accountStatus } = payload;
  const currencyOrToken = currency || erc20token;

  return (
    <Box grow flow={20}>
      <Box grow>
        {currency && (
          <LineRow label={<Trans i18nKey="newAccount:confirmation.account" />}>
            <AccountName currencyId={currency.id} name={payload.name} />
          </LineRow>
        )}
        {erc20token && (
          <>
            <LineRow
              label={<Trans i18nKey="newAccount:confirmation.account" />}
            >
              <AccountName
                account={{
                  account_type: "Erc20",
                  contract_address: erc20token.contract_address,
                }}
                name={payload.name}
              />
            </LineRow>
            {!!payload.parentAccount && !!payload.parentAccount.name && (
              <LineRow
                label={
                  <Trans i18nKey="newAccount:confirmation.parentAccount" />
                }
              >
                {/* $FlowFixMe */}
                {payload.parentAccount.name}
              </LineRow>
            )}
          </>
        )}
        {currency && (
          <LineRow label={<Trans i18nKey="newAccount:confirmation.currency" />}>
            <span className="info-value currency">{currency.name}</span>
          </LineRow>
        )}
        {currencyOrToken && (
          <LineRow
            label={<Trans i18nKey="newAccount:confirmation.transactionRules" />}
            collapsibleState="open"
            collapsibleChildren={
              <MultiRules
                readOnly
                rulesSets={payload.rulesSets}
                currencyOrToken={currencyOrToken}
                whitelists={whitelists.edges.map(e => e.node)}
              />
            }
          >
            <Text
              i18nKey="accountCreation:rulesSumup"
              count={payload.rulesSets.length}
              values={{ count: payload.rulesSets.length }}
            />
          </LineRow>
        )}
      </Box>
      <InfoBox type="info" withIcon>
        {accountStatus === "MIGRATED" ? (
          <Trans i18nKey="newAccount:confirmation.descMigrated" />
        ) : (
          <Trans i18nKey="newAccount:confirmation.desc" />
        )}
      </InfoBox>
    </Box>
  );
};
