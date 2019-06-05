// @flow

import React from "react";
import { Trans } from "react-i18next";
import MemberName from "components/base/MemberName";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { FaArrowRight, FaUsers } from "react-icons/fa";
import type { Group, TxApprovalStep, User } from "data/types";
import colors from "shared/colors";

type Props = {
  rules: TxApprovalStep[],
};
const arrowRight = <FaArrowRight size={9} color={colors.ocean} />;
const groupIcon = <FaUsers />;

const RulesViewer = ({ rules }: Props) => (
  <Box flow={10}>
    {rules.map(r => (
      <RuleItem rule={r} key={r.group.id} />
    ))}
  </Box>
);

export default RulesViewer;

const RuleItem = ({ rule }: { rule: TxApprovalStep }) => (
  <Box
    horizontal
    align="center"
    justify="space-between"
    flow={7}
    py={10}
    style={{ borderBottom: `1px solid ${colors.cream}` }}
  >
    {arrowRight}

    <Box horizontal align="center" grow="1" justify="space-between" p={5}>
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
  group.status !== "ACTIVE" ? (
    <ListUsers users={group.members} />
  ) : (
    <Box horizontal align="center" flow={5}>
      {groupIcon}
      <Text>{group.name}</Text>
    </Box>
  );

const ListUsers = ({ users }: { users: User[] }) => (
  <Box
    pl={5}
    horizontal
    align="center"
    flexWrap="wrap"
    justify="flex-end"
    style={{ maxWidth: 350 }}
  >
    {users.map(m => (
      <Box key={m.id} style={{ marginLeft: 8 }}>
        <MemberName member={m} />
      </Box>
    ))}
  </Box>
);
