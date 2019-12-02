// @flow

// ==================================================
// DISCLAIMER: this is legacy code. to be refactored.
// ==================================================

import React from "react";
import { Trans } from "react-i18next";

import InfoBox from "components/base/InfoBox";
import MultiRules from "components/MultiRules";
import { DiffBlock } from "containers/Admin/Accounts/AccountEditRequest";
import Box from "components/base/Box";
import AccountName from "components/AccountName";
import LineRow from "components/LineRow";
import type { AccountCreationStepProps } from "../types";

export default (props: AccountCreationStepProps) => {
  const {
    payload,
    isEditMode,
    users,
    whitelists,
    groups,
    initialPayload,
  } = props;
  const { currency, erc20token, accountStatus } = payload;
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
      </Box>
      {isEditMode && currency && (
        <Box horizontal flow={10} justify="space-between">
          <DiffBlock
            type="current"
            hasNameChanged={payload.name !== initialPayload.name}
            accountName={initialPayload.name}
          >
            <MultiRules
              textMode
              users={users.edges.map(n => n.node)}
              whitelists={whitelists.edges.map(n => n.node)}
              groups={groups.edges.map(n => n.node)}
              rulesSets={initialPayload.rulesSets}
              currencyOrToken={currency}
            />
          </DiffBlock>
          <DiffBlock
            type="previous"
            hasNameChanged={payload.name !== initialPayload.name}
            accountName={initialPayload.name}
          >
            <MultiRules
              textMode
              users={users.edges.map(n => n.node)}
              whitelists={whitelists.edges.map(n => n.node)}
              groups={groups.edges.map(n => n.node)}
              rulesSets={payload.rulesSets}
              currencyOrToken={currency}
            />
          </DiffBlock>
        </Box>
      )}
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
