// @flow

// ==================================================
// DISCLAIMER: this is legacy code. to be refactored.
// ==================================================

import React, { useState } from "react";
import { Trans } from "react-i18next";

import InfoBox from "components/base/InfoBox";
import MultiRules from "components/MultiRules";
import { DiffBlock } from "containers/Admin/Accounts/AccountEditRequest";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import AccountName from "components/AccountName";
import LineRow from "components/LineRow";
import colors from "shared/colors";
import type { AccountCreationStepProps } from "../types";

const iconDown = <FaChevronDown size={12} color={colors.lightGrey} />;
const iconUp = <FaChevronUp size={12} color={colors.lightGrey} />;

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
  const currencyOrToken = currency || erc20token;
  const [isRuleVisible, setRule] = useState(true);
  const toggleRuleVisible = () => {
    return setRule(!isRuleVisible);
  };
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
        <LineRow
          label={<Trans i18nKey="newAccount:confirmation.transactionRules" />}
        >
          <Box
            onClick={toggleRuleVisible}
            horizontal
            flow={10}
            align="center"
            style={{ cursor: "pointer" }}
          >
            <Text
              i18nKey="accountCreation:rulesSumup"
              count={payload.rulesSets.length}
              values={{ count: payload.rulesSets.length }}
            />
            {isRuleVisible ? iconUp : iconDown}
          </Box>
        </LineRow>
        {currencyOrToken && isRuleVisible && (
          <MultiRules
            readOnly
            rulesSets={payload.rulesSets}
            currencyOrToken={currencyOrToken}
          />
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
