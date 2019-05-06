// @flow
import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

import connectData from "restlay/connectData";
import UsersQuery from "api/queries/UsersQuery";
import GroupsQuery from "api/queries/GroupsQuery";
import ApprovalsRules from "components/ApprovalsRules";
import Box from "components/base/Box";
import { deserializeApprovalSteps } from "utils/accounts";
import type { Account, User, Group } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";

const AccountTransactionRules = ({
  account,
  users,
  groups,
}: {
  account: Account,
  users: Connection<User>,
  groups: Connection<Group>,
}) =>
  account.tx_approval_steps ? (
    <ApprovalsRules
      rules={deserializeApprovalSteps(account.tx_approval_steps)}
      users={users.edges.map(u => u.node)}
      groups={groups.edges.map(g => g.node)}
      readOnly
      onChange={() => {}}
    />
  ) : null;

const RenderLoading = () => (
  <Box align="center">
    <CircularProgress size={20} />;
  </Box>
);
export default connectData(AccountTransactionRules, {
  RenderLoading,
  queries: {
    users: UsersQuery,
    groups: GroupsQuery,
  },
});
