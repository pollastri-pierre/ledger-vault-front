// @flow

import React, { PureComponent } from "react";

import connectData from "restlay/connectData";
import UsersQuery from "api/queries/UsersQuery";
import GroupsQuery from "api/queries/GroupsQuery";
import Box from "components/base/Box";
import Spinner from "components/base/Spinner";
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

class AccountEditRequest extends PureComponent<Props> {
  render() {
    const { account, groups, users } = this.props;
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
            >
              BEFORE
            </Text>
          </Box>
          {hasNameChanged && (
            <Box mb={20}>
              <b>Name</b>
              <span>{account.name}</span>
            </Box>
          )}
          {haveRulesChanged && (
            <Box mb={20}>
              <b>Rules</b>
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
            >
              After
            </Text>
          </Box>
          {hasNameChanged && editData && (
            <Box mb={20}>
              <b>Name</b>
              <span>{editData.name}</span>
            </Box>
          )}
          {haveRulesChanged && (
            <Box mb={20}>
              <b>Rules</b>
              <RulesViewer rules={newRules} />
            </Box>
          )}
        </Box>
      </Box>
    );
  }
}

const diffBoxProps = {
  borderRadius: 2,
  padding: 5,
  flex: 1,
};

const RenderLoading = () => (
  <Box align="center">
    <Spinner />
  </Box>
);
const C: React$ComponentType<$Shape<Props>> = connectData(AccountEditRequest, {
  RenderLoading,
  queries: {
    users: UsersQuery,
    groups: GroupsQuery,
  },
});

export default C;
