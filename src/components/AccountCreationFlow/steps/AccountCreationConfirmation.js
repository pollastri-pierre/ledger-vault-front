// @flow

// ==================================================
// DISCLAIMER: this is legacy code. to be refactored.
// ==================================================

import React, { Fragment } from "react";
import { Trans } from "react-i18next";

import User from "components/icons/User";
import colors from "shared/colors";
import InfoBox from "components/base/InfoBox";
import Box from "components/base/Box";
import Text from "components/base/Text";
import AccountName from "components/AccountName";
import LineRow from "components/LineRow";
import type { AccountCreationStepProps } from "../types";

export default (props: AccountCreationStepProps) => {
  const { payload } = props;
  const { currency, erc20token, accountStatus } = payload;
  return (
    <Box grow flow={20}>
      <Box align="center" justify="center" horizontal flow={10}>
        <User size={16} color={colors.shark} />
        <Text i18nKey="newAccount:confirmation.members" />
        <Text color={colors.lead}>(5 selected)</Text>
      </Box>
      <Box grow>
        {currency && (
          <LineRow label={<Trans i18nKey="newAccount:confirmation.account" />}>
            <AccountName currencyId={currency.id} name={payload.name} />
          </LineRow>
        )}
        {erc20token && (
          <Fragment>
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
          </Fragment>
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
