// @flow

import React, { PureComponent } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

import connectData from "restlay/connectData";
import UsersQuery from "api/queries/UsersQuery";
import GroupsQuery from "api/queries/GroupsQuery";
import Box from "components/base/Box";
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
    if (!tx_approval_steps || !last_request || !last_request.edit_data)
      return null;

    const newRules = resolveRules(
      last_request.edit_data.governance_rules.tx_approval_steps,
      groups.edges.map(e => e.node),
      users.edges.map(e => e.node),
    );
    return (
      <Box flow={10} horizontal align="flex-start">
        <Box bg={opacity(colors.grenade, 0.05)} style={{ ...styles }}>
          <Text small uppercase bold color={opacity(colors.grenade, 0.8)}>
            BEFORE
          </Text>
          <RulesViewer rules={tx_approval_steps} />
        </Box>
        <Box bg={opacity(colors.ocean, 0.05)} style={{ ...styles }}>
          <Text small uppercase bold color={opacity(colors.ocean, 0.8)}>
            After
          </Text>
          <RulesViewer rules={newRules} />
        </Box>
      </Box>
    );
  }
}

const styles = {
  borderRadius: 2,
  padding: 5,
};

const RenderLoading = () => (
  <Box align="center">
    <CircularProgress size={20} />;
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
