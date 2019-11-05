// @flow

import React from "react";

import connectData from "restlay/connectData";
import UsersQuery from "api/queries/UsersQuery";
import GroupsQuery from "api/queries/GroupsQuery";
import Box from "components/base/Box";
import { SpinnerCentered } from "components/base/Spinner";
import Text from "components/base/Text";
import colors, { opacity, darken } from "shared/colors";
import type {
  Account,
  User,
  Group,
  TxApprovalStepCollection,
} from "data/types";
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
      <DiffBlock
        name={hasNameChanged ? account.name : null}
        rules={haveRulesChanged ? oldRules : null}
        type="current"
      />
      <DiffBlock
        name={hasNameChanged && editData ? editData.name : null}
        rules={haveRulesChanged ? newRules : null}
        type="proposed"
      />
    </Box>
  );
}

const diffBoxProps = {
  borderRadius: 10,
  padding: 10,
  flex: 1,
};

export default connectData(AccountEditRequest, {
  RenderLoading: () => <SpinnerCentered />,
  queries: {
    users: UsersQuery,
    groups: GroupsQuery,
  },
});

type DiffBlockProps = {
  name: ?string,
  rules: ?TxApprovalStepCollection,
  type: string,
};
function DiffBlock(props: DiffBlockProps) {
  const { name, rules, type } = props;
  return (
    <Box
      bg={
        type === "current"
          ? opacity(colors.paleBlue, 0.2)
          : opacity(colors.paleRed, 0.2)
      }
      {...diffBoxProps}
    >
      <Box mb={20}>
        <Text
          size="small"
          uppercase
          fontWeight="bold"
          color={
            type === "current"
              ? darken(colors.paleBlue, 0.7)
              : darken(colors.paleRed, 0.7)
          }
          i18nKey={
            type === "current"
              ? "entityModal:diff.before"
              : "entityModal:diff.after"
          }
        />
      </Box>
      {name && (
        <Box mb={20}>
          <Text fontWeight="bold" i18nKey="entityModal:diff.name" />
          <Text>{name}</Text>
        </Box>
      )}
      {rules && (
        <Box mb={20}>
          <Text fontWeight="bold" i18nKey="entityModal:diff.rules" />
          <Box>TODO DIFF RULES</Box>
        </Box>
      )}
    </Box>
  );
}
