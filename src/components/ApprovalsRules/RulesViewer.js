// @flow

import React from "react";
import styled from "styled-components";
import Box from "components/base/Box";
import Text from "components/base/Text";
import type { Group, TxApprovalStep } from "data/types";

type Props = {
  rules: TxApprovalStep[],
  isDiff?: boolean,
};

const RulesViewer = ({ rules, isDiff }: Props) => (
  <Box flow={20}>
    {rules.map(r => (
      <RuleItem rule={r} key={r.group.id} isDiff={isDiff} />
    ))}
  </Box>
);

export default RulesViewer;

const RuleItem = ({
  rule,
  isDiff,
}: {
  rule: TxApprovalStep,
  isDiff?: boolean,
}) => (
  <ItemContainer isDiff={isDiff}>
    <Box px={5} style={styles.quorum}>
      <Text small bold>
        {rule.quorum}
      </Text>
    </Box>
    <Text>approval in</Text>
    <GroupItem group={rule.group} />
  </ItemContainer>
);

const GroupItem = ({ group }: { group: Group }) => {
  if (group.status !== "ACTIVE") {
    return (
      <div style={styles.group}>
        {group.members.map(m => (
          <Text small key={m.id}>
            {" "}
            {m.username}
          </Text>
        ))}
      </div>
    );
  }
  return <Box>{group.name}</Box>;
};

const ItemContainer = styled(Box).attrs({
  horizontal: true,
  align: "center",
  flow: 5,
  p: 10,
})`
  background: ${p => (p.isDiff ? "white" : "rgb(247,247,247)")};
`;
const styles = {
  item: {
    background: "rgb(247, 247, 247)",
    // background: "white",
    borderRadius: 2,
  },
  group: {
    border: " 1px solid #d6d4d4",
    borderRadius: 2,
    padding: 10,
    background: "white",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(62px, 1fr) )",
    flexGrow: 1,
  },
  quorum: {
    background: "black",
    color: "white",
    borderRadius: 2,
  },
};
