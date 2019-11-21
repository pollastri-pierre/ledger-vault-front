// @flow

import React from "react";
import styled from "styled-components";
import { FaMoneyCheck } from "react-icons/fa";

import connectData from "restlay/connectData";
import OperatorsForAccountCreationQuery from "api/queries/OperatorsForAccountCreationQuery";
import GroupsQuery from "api/queries/GroupsQuery";
import SearchWhitelists from "api/queries/SearchWhitelists";
import Box from "components/base/Box";
import LineSeparator from "components/LineSeparator";
import MultiRules from "components/MultiRules";
import { SpinnerCentered } from "components/base/Spinner";
import Text from "components/base/Text";
import colors, { opacity, darken } from "shared/colors";
import type { Account, User, Group, Whitelist } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";

type Props = {
  account: Account,
  users: Connection<User>,
  groups: Connection<Group>,
  whitelists: Connection<Whitelist>,
};

function AccountEditRequest(props: Props) {
  const { account, users, whitelists, groups } = props;
  const { governance_rules, last_request } = account;

  if (!last_request) return null;

  const isAccountMigration = last_request.type === "MIGRATE_ACCOUNT";
  const editData = last_request.edit_data || null;
  const hasNameChanged = editData && account.name !== editData.name;

  const newRules = isAccountMigration
    ? governance_rules
    : editData
    ? editData.governance_rules
    : null;
  const oldRules = isAccountMigration ? null : governance_rules;

  return (
    <Box flow={10} horizontal justify="space-between">
      {oldRules && (
        <DiffBlock
          type="current"
          hasNameChanged={hasNameChanged}
          accountName={account.name}
        >
          <MultiRules
            textMode
            users={users.edges.map(n => n.node)}
            whitelists={whitelists.edges.map(n => n.node)}
            groups={groups.edges.map(n => n.node)}
            rulesSets={oldRules}
          />
        </DiffBlock>
      )}
      {newRules && (
        <DiffBlock
          type="previous"
          hasNameChanged={hasNameChanged}
          accountName={editData ? editData.name : ""}
        >
          <MultiRules
            textMode
            users={users.edges.map(n => n.node)}
            whitelists={whitelists.edges.map(n => n.node)}
            groups={groups.edges.map(n => n.node)}
            rulesSets={newRules}
          />
        </DiffBlock>
      )}
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
    users: OperatorsForAccountCreationQuery,
    groups: GroupsQuery,
    whitelists: SearchWhitelists,
  },
});

type DiffBlockProps = {
  type: string,
  hasNameChanged?: ?boolean,
  accountName?: string,
  children: React$Node,
};
function DiffBlock(props: DiffBlockProps) {
  const { type, children, hasNameChanged, accountName } = props;
  return (
    <Box noShrink flex={1}>
      <Box m={5}>
        <Text
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
      <Box
        mb={20}
        flow={10}
        p={5}
        bg={
          type === "current"
            ? opacity(colors.paleBlue, 0.2)
            : opacity(colors.paleRed, 0.2)
        }
        {...diffBoxProps}
      >
        <>
          {hasNameChanged && (
            <>
              <Text
                fontWeight="bold"
                i18nKey="approvalsRules:textMode.accountName"
              />
              <StyledUl>
                <StyledLi>
                  <Box horizontal flow={5} align="center">
                    <FaMoneyCheck />
                    <Text>{accountName}</Text>
                  </Box>
                </StyledLi>
              </StyledUl>
              <LineSeparator />
            </>
          )}
        </>
        {children}
      </Box>
    </Box>
  );
}

// as a separate story - TODO: create our own li and ul to control the bullet points better
const StyledUl = styled.ul`
  margin: 0;
`;

const StyledLi = styled.li`
  word-break: break-all;
`;
