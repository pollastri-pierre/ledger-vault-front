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
import type { Account, User, Group, TxApprovalStep } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";

type Props = {
  account: Account,
  users: Connection<User>,
  groups: Connection<Group>,
};

type EditApprovalStep = {
  group_id?: number,
  quorum: number,
  users?: number[],
};

class AccountEditRequest extends PureComponent<Props> {
  render() {
    const { account, groups, users } = this.props;
    const { tx_approval_steps, last_request } = account;

    if (!last_request || !last_request.edit_data) return null;

    const { edit_data } = last_request;

    const newRules = resolveRules(
      edit_data.governance_rules.tx_approval_steps,
      groups.edges.map(e => e.node),
      users.edges.map(e => e.node),
    );

    const hasNameChanged = edit_data && account.name !== edit_data.name;

    return (
      <Box flow={10} horizontal justify="space-between">
        <Box bg={opacity(colors.grenade, 0.05)} {...diffBoxProps}>
          <Box mb={20}>
            <Text small uppercase bold color={opacity(colors.grenade, 0.8)}>
              BEFORE
            </Text>
          </Box>
          {hasNameChanged && (
            <Box mb={20}>
              <b>Name</b>
              <span>{account.name}</span>
            </Box>
          )}
          <b>Rules</b>
          <RulesViewer rules={tx_approval_steps} />
        </Box>
        <Box bg={opacity(colors.ocean, 0.05)} {...diffBoxProps}>
          <Box mb={20}>
            <Text small uppercase bold color={opacity(colors.ocean, 0.8)}>
              After
            </Text>
          </Box>
          {hasNameChanged && edit_data && (
            <Box mb={20}>
              <b>Name</b>
              <span>{edit_data.name}</span>
            </Box>
          )}
          <b>Rules</b>
          <RulesViewer rules={newRules} />
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
export default connectData(AccountEditRequest, {
  RenderLoading,
  queries: {
    users: UsersQuery,
    groups: GroupsQuery,
  },
});

const resolveRules = (
  editRules: EditApprovalStep[],
  groups: Group[],
  users: User[],
): TxApprovalStep[] => {
  const newRules = [];
  editRules.forEach((r, i) => {
    const { users: ruleUsers } = r;
    if (r.group_id) {
      const group = groups.find(g => g.id === r.group_id);
      if (group) {
        newRules.push({
          quorum: r.quorum,
          group,
        });
      }
    } else if (ruleUsers) {
      const members = users.filter(u => ruleUsers.indexOf(u.id) > -1);
      const group = {
        id: i,
        is_internal: true,
        members,
      };
      newRules.push({
        quorum: r.quorum,
        group,
      });
    }
  });
  return newRules;
};
