// @flow

import React from "react";
import { Trans } from "react-i18next";
import { FaUser } from "react-icons/fa";
import ApproveRequestButton from "components/ApproveRequestButton";
import EntityModal from "components/EntityModal";
import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import Text from "components/base/Text";
import type { User } from "data/types";
import { createAndApprove } from "device/interactions/hsmFlows";
import { useMe } from "components/UserContextProvider";

import { FetchEntityHistory } from "components/EntityHistory";
import UserDetailsOverview from "./UD-Overview";
import UserDetailsPermissions from "./UD-Permissions";

type Props = {
  user: User,
  close: () => void,
};

function UserDetails(props: Props) {
  const { user, close } = props;
  const me = useMe();
  const isActuallyMyself = user.id === me.id;
  const revokeButton = isActuallyMyself ? null : (
    <ApproveRequestButton
      interactions={createAndApprove("PERSON")}
      onSuccess={close}
      isRevoke
      disabled={false}
      additionalFields={{
        data: { user_id: user.id },
        type: "REVOKE_USER",
      }}
      buttonLabel={<Trans i18nKey="common:revoke" />}
      withConfirm
      confirmTitle={<Trans i18nKey="userDetails:revokeWarning.title" />}
      confirmLabel={<Trans i18nKey="userDetails:revokeWarning.confirm" />}
      confirmContent={
        <Box flow={15} align="flex-start">
          <Text i18nKey="userDetails:revokeWarning.content" />
          {user.role === "ADMIN" && (
            <InfoBox type="warning">
              <Text i18nKey="userDetails:revokeWarning.contentAdmin" />
            </InfoBox>
          )}
        </Box>
      }
    />
  );

  const showPermissionTab = ["ACTIVE", "ACCESS_SUSPENDED"].includes(
    user.status,
  );

  return (
    <EntityModal
      growing
      entity={user}
      Icon={FaUser}
      title={user.username}
      onClose={close}
      revokeButton={revokeButton}
    >
      <UserDetailsOverview key="overview" user={user} />
      {user.role === "OPERATOR" && showPermissionTab && (
        <UserDetailsPermissions key="permissions" user={user} />
      )}
      <FetchEntityHistory
        key="history"
        url={`/people/${user.id}/history`}
        entityType="user"
      />
    </EntityModal>
  );
}
export default UserDetails;
