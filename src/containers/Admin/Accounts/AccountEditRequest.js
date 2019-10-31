// @flow

import React from "react";

import connectData from "restlay/connectData";
import UsersQuery from "api/queries/UsersQuery";
import GroupsQuery from "api/queries/GroupsQuery";
import Box from "components/base/Box";
import { SpinnerCentered } from "components/base/Spinner";
import Text from "components/base/Text";
import colors, { opacity } from "shared/colors";
import RulesViewer from "components/ApprovalsRules/RulesViewer";
import type { Account, User, Group } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";

import { haveRulesChangedDiff, resolveRules } from "./helpers";

type Props = {
  account: Account,
  users: Connection<User>,
  groups: Connection<Group>,
};

function AccountEditRequest(props: Props) {
  const { account, groups, users } = props;
  const { tx_approval_steps, last_request } = account;

  if (!last_request) return null;

  const isAccountMigration = last_request.type === "MIGRATE_ACCOUNT";
  const editData = last_request.edit_data || null;

  const newRules = isAccountMigration
    ? tx_approval_steps
    : editData
    ? resolveRules(
        editData.governance_rules.tx_approval_steps,
        groups.edges.map(e => e.node),
        users.edges.map(e => e.node),
      )
    : null;

  const oldRules = isAccountMigration ? null : tx_approval_steps;
  const hasNameChanged = editData && account.name !== editData.name;

  const haveRulesChanged =
    newRules && oldRules && haveRulesChangedDiff(newRules, oldRules);
  return (
    <Box flow={10} horizontal justify="space-between">
      <Box bg={opacity(colors.grenade, 0.05)} {...diffBoxProps}>
        <Box mb={20}>
          <Text
            size="small"
            uppercase
            fontWeight="bold"
            color={opacity(colors.grenade, 0.8)}
            i18nKey="entityModal:diff.before"
          />
        </Box>
        {hasNameChanged && (
          <Box mb={20}>
            <Text fontWeight="bold" i18nKey="entityModal:diff.name" />
            <Text>{account.name}</Text>
          </Box>
        )}
        {haveRulesChanged && (
          <Box mb={20}>
            <Text fontWeight="bold" i18nKey="entityModal:diff.rules" />
            <RulesViewer rules={oldRules} />
          </Box>
        )}
      </Box>
      <Box bg={opacity(colors.ocean, 0.05)} {...diffBoxProps}>
        <Box mb={20}>
          <Text
            size="small"
            uppercase
            fontWeight="bold"
            color={opacity(colors.ocean, 0.8)}
            i18nKey="entityModal:diff.after"
          />
        </Box>
        {hasNameChanged && editData && (
          <Box mb={20}>
            <Text fontWeight="bold" i18nKey="entityModal:diff.name" />
            <Text>{editData.name}</Text>
          </Box>
        )}
        {haveRulesChanged && (
          <Box mb={20}>
            <Text fontWeight="bold" i18nKey="entityModal:diff.rules" />
            <RulesViewer rules={newRules} />
          </Box>
        )}
      </Box>
    </Box>
  );
}

const diffBoxProps = {
  borderRadius: 2,
  padding: 5,
  flex: 1,
};

export default connectData(AccountEditRequest, {
  RenderLoading: () => <SpinnerCentered />,
  queries: {
    users: UsersQuery,
    groups: GroupsQuery,
  },
});
