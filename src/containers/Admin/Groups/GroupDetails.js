// @flow

import React, { useMemo } from "react";
import { Trans } from "react-i18next";
import { FaUsers } from "react-icons/fa";

import connectData from "restlay/connectData";
import GroupQuery from "api/queries/GroupQuery";
import UsersQuery from "api/queries/UsersQuery";
import EntityModal from "components/EntityModal";
import GroupDetailsOverview from "containers/Admin/Groups/GroupDetailsOverview";
import GroupDetailsAccounts from "containers/Admin/Groups/GroupDetailsAccounts";
import { FetchEntityHistory } from "components/EntityHistory";
import { CardError } from "components/base/Card";
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

  const revokeParams = {
    buttonLabel: <Trans i18nKey="group:delete" />,
    confirmLabel: <Trans i18nKey="group:delete" />,
    confirmContent: (
      <Text textAlign="center" i18nKey="group:revokeWarning.content" />
    ),
  };

  const refreshDataQuery = useMemo(
    () => new GroupQuery({ groupId: String(group.id) }),
    [group.id],
  );

  return (
    <EntityModal
      growing
      entity={group}
      Icon={FaUsers}
      title={group.name}
      onClose={close}
      revokeParams={revokeParams}
      editURL={`/groups/edit/${group.id}`}
      additionalFields={{ operators: operators.edges.map(e => e.node) }}
      refreshDataQuery={refreshDataQuery}
    >
      <GroupDetailsOverview
        key="overview"
        group={group}
        operators={operators}
        close={close}
      />
      {group.status !== "PENDING" && (
        <GroupDetailsAccounts key="accounts" group={group} />
      )}
      <FetchEntityHistory
        key="history"
        url={`/groups/${group.id}/history`}
        entity={group}
        entityType="group"
      />
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
