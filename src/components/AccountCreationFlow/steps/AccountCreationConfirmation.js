// @flow

// ==================================================
// DISCLAIMER: this is legacy code. to be refactored.
// ==================================================

import React from "react";
import { Trans } from "react-i18next";

import InfoBox from "components/base/InfoBox";
import Box from "components/base/Box";
import AccountName from "components/AccountName";
import LineRow from "components/LineRow";
import ApprovalsRules from "components/ApprovalsRules";
import type { AccountCreationStepProps } from "../types";

export default (props: AccountCreationStepProps) => {
  const { payload } = props;
  const { currency, erc20token } = payload;
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
              <AccountName isERC20 name={payload.name} />
            </LineRow>
            {payload.parentAccount && payload.parentAccount.name && (
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
        <LineRow label={<Trans i18nKey="newAccount:confirmation.approvals" />}>
          <Trans
            i18nKey="accountCreation:rulesSumup"
            count={payload.rules.length}
            values={{ count: payload.rules.length }}
          />
        </LineRow>
        <Box py={20}>
          <ApprovalsRules
            rules={payload.rules}
            users={props.users.edges.map(u => u.node)}
            onChange={() => {}}
            groups={props.groups.edges.map(g => g.node)}
            readOnly
          />
        </Box>
      </Box>
      <InfoBox type="info" withIcon>
        <Trans i18nKey="newAccount:confirmation.desc" />
      </InfoBox>
    </Box>
  );
};
