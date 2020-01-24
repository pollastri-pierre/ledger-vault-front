// @flow

import React, { useMemo } from "react";
import { Trans } from "react-i18next";
import { FaUser } from "react-icons/fa";
import EntityModal from "components/EntityModal";
import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import Text from "components/base/Text";
import UserQuery from "api/queries/UserQuery";
import type { User } from "data/types";
import { useMe } from "components/UserContextProvider";

import { FetchEntityHistory } from "components/EntityHistory";
import UserDetailsOverview from "./UD-Overview";
import UserDetailsPermissions from "./UD-Permissions";
import UserDetailsGroups from "./UD-Groups";
import UserDetailsAccounts from "./UD-Accounts";

type Props = {
  user: User,
  close: () => void,
};

function UserDetails(props: Props) {
  const { user, close } = props;
  const me = useMe();
  const isActuallyMyself = user.id === me.id;
  const revokeParams = isActuallyMyself
    ? null
    : {
        buttonLabel: <Trans i18nKey="common:revoke" />,
        confirmTitle: <Trans i18nKey="userDetails:revokeWarning.title" />,
        confirmLabel: <Trans i18nKey="userDetails:revokeWarning.confirm" />,
        confirmContent: (
          <Box flow={15} align="flex-start">
            <Text
              textAlign="center"
              i18nKey="userDetails:revokeWarning.content"
            />
            {user.role === "ADMIN" && (
              <InfoBox type="warning" style={{ alignSelf: "center" }}>
                <Text i18nKey="userDetails:revokeWarning.contentAdmin" />
              </InfoBox>
            )}
          </Box>
        ),
      };

  const showPermissionTab = ["ACTIVE", "ACCESS_SUSPENDED"].includes(
    user.status,
  );

  const refreshDataQuery = useMemo(
    () => new UserQuery({ userID: String(user.id) }),
    [user.id],
  );

  return (
    <EntityModal
      growing
      entity={user}
      Icon={FaUser}
      title={user.username}
      onClose={close}
      refreshDataQuery={refreshDataQuery}
      revokeParams={revokeParams}
    >
      <UserDetailsOverview key="overview" user={user} />
      {user.role === "OPERATOR" && (
        <UserDetailsAccounts userID={user.id} key="accounts" />
      )}
      {user.role === "OPERATOR" && (
        <UserDetailsGroups userID={user.id} key="groups" />
      )}
      {user.role === "OPERATOR" && showPermissionTab && (
        <UserDetailsPermissions key="permissions" user={user} />
      )}
      <FetchEntityHistory
        key="history"
        url={`/people/${user.id}/history`}
        entity={user}
        entityType="user"
      />
    </EntityModal>
  );
}
export default UserDetails;
