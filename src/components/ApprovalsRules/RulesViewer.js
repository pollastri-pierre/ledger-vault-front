// @flow

import React from "react";
import { Trans } from "react-i18next";
import MemberName from "components/base/MemberName";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { FaArrowRight, FaUsers } from "react-icons/fa";
import type {
  Group,
  TxApprovalStep,
  TxApprovalStepCollection,
  User,
} from "data/types";
import colors from "shared/colors";

type Props = {
  rules: TxApprovalStepCollection | null | typeof undefined,
};
const arrowRight = <FaArrowRight size={8} />;
const groupIcon = <FaUsers />;

const RulesViewer = ({ rules }: Props) => {
  if (!rules) {
    return "No rules";
  }
  return (
    <Box flow={10}>
      {rules.map(r => (r ? <RuleItem rule={r} key={r.group.id} /> : null))}
    </Box>
  );
};

export default RulesViewer;

const RuleItem = ({ rule }: { rule: TxApprovalStep }) => (
  <Box
    horizontal
    align="flex-start"
    justify="space-between"
    flow={5}
    style={{ borderBottom: `1px solid ${colors.cream}` }}
  >
    <Box noShrink pt={7}>
      {arrowRight}
    </Box>

    <Box align="flex-start" grow justify="space-between">
      <Box noShrink>
        <Trans
          i18nKey="approvalsRules:approval"
          count={rule.quorum}
          values={{ count: rule.quorum }}
        />
      </Box>
      <GroupOrUsers group={rule.group} />
    </Box>
  </Box>
);

const GroupOrUsers = ({ group }: { group: Group }) =>
  group.is_internal ? (
    <ListUsers users={group.members} />
  ) : (
    <Box horizontal align="center" flow={5}>
      <Box noShrink>{groupIcon}</Box>
      <Text noWrap>{group.name}</Text>
    </Box>
  );

const ListUsers = ({ users }: { users: User[] }) => (
  <Box horizontal align="center" flexWrap="wrap">
    {users.map(m => (
      <Box key={m.id} style={{ marginRight: 8 }}>
        <MemberName member={m} />
      </Box>
    ))}
  </Box>
);
