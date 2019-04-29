// @flow

import React from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { FaUsers } from "react-icons/fa";

import connectData from "restlay/connectData";
import GroupQuery from "api/queries/GroupQuery";
import UsersQuery from "api/queries/UsersQuery";
import EntityModal from "components/EntityModal";
import GroupDetailsOverview from "containers/Admin/Groups/GroupDetailsOverview";
import GroupDetailsAccounts from "containers/Admin/Groups/GroupDetailsAccounts";
import GroupHistory from "containers/Admin/Groups/GroupHistory";
import colors from "shared/colors";
import { createAndApprove } from "device/interactions/approveFlow";
import { CardError } from "components/base/Card";
import ApproveRequestButton from "components/ApproveRequestButton";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { GrowingSpinner } from "components/base/GrowingCard";
import type { Group, User } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";

type Props = {
  group: Group,
  operators: Connection<User>,
  close: Function,
};

function GroupDetails(props: Props) {
  const { close, group, operators } = props;
  const revokeButton = (
    <ApproveRequestButton
      interactions={createAndApprove}
      onSuccess={close}
      color={colors.grenade}
      isRevoke
      additionalFields={{
        data: { group_id: group.id },
        type: "REVOKE_GROUP",
      }}
      buttonLabel={<Trans i18nKey="group:delete" />}
      withConfirm
      confirmLabel={<Trans i18nKey="group:delete" />}
      confirmContent={
        <Box flow={15} align="flex-start">
          <Text i18nKey="group:revokeWarning.content" />
        </Box>
      }
    />
  );
  return (
    <EntityModal
      growing
      entity={group}
      Icon={FaUsers}
      title={group.name}
      onClose={close}
      revokeButton={revokeButton}
      editURL={`/groups/edit/${group.id}`}
      additionalFields={{ operators: operators.edges.map(e => e.node) }}
    >
      <GroupDetailsOverview
        key="overview"
        group={group}
        operators={operators}
        close={close}
      />
      <GroupDetailsAccounts key="accounts" group={group} />
      <GroupHistory key="history" group={group} />
    </EntityModal>
  );
}

export default connectData(GroupDetails, {
  RenderError: CardError,
  RenderLoading: GrowingSpinner,
  queries: {
    group: GroupQuery,
    operators: UsersQuery,
  },
  propsToQueryParams: props => ({
    groupId: props.match.params.groupId || "",
    role: "OPERATOR",
  }),
});

export const TabName = styled(Box).attrs({
  horizontal: true,
  align: "center",
  flow: 5,
  p: 12,
})`
  background: ${p => (p.isActive ? "white" : "inherit")};
  border-top-right-radius: 2px;
  border-top-left-radius: 2px;
  box-shadow: ${p => (p.isActive ? "2px -2px 3px #eceaea" : "none")};
  font-weight: ${p => (p.isActive ? "bold" : "normal")};
  opacity: ${p => (p.isActive ? "1" : "0.5")};
  &:hover {
    cursor: pointer;
    opacity: 1;
    color: #555;
  }
`;
