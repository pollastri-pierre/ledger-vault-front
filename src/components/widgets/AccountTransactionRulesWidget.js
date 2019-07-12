// @flow

import React from "react";

import { SoftCard } from "components/base/Card";
import UsersQuery from "api/queries/UsersQuery";
import GroupsQuery from "api/queries/GroupsQuery";
import ApprovalsRules from "components/ApprovalsRules";
import type { Account, User, Group } from "data/types";
import NoDataPlaceholder from "components/NoDataPlaceholder";
import { deserializeApprovalSteps } from "utils/accounts";
import type { Connection } from "restlay/ConnectionQuery";
import Widget, { connectWidget } from "./Widget";

type Props = {
  account: Account,
  users: Connection<User>,
  groups: Connection<Group>,
};

function AccountTransactionRulesWidget(props: Props) {
  const { account, groups, users } = props;
  return (
    <Widget title="Transaction rules">
      <SoftCard>
        {account.tx_approval_steps ? (
          <ApprovalsRules
            rules={deserializeApprovalSteps(account.tx_approval_steps)}
            users={users.edges.map(u => u.node)}
            groups={groups.edges.map(g => g.node)}
            readOnly
          />
        ) : (
          <NoDataPlaceholder title="No transaction rules" />
        )}
      </SoftCard>
    </Widget>
  );
}

export default connectWidget(AccountTransactionRulesWidget, {
  height: 300,
  queries: {
    users: UsersQuery,
    groups: GroupsQuery,
  },
});
