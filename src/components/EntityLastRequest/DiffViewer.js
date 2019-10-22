// @flow

import React from "react";
import Box from "components/base/Box";
import GroupEditRequest from "containers/Admin/Groups/GroupEditRequest";
import AccountEditRequest from "containers/Admin/Accounts/AccountEditRequest";
import type { Entity } from "data/types";

type Props = {
  entity: Entity,
  additionalFields: Object,
};

function DiffViewer(props: Props) {
  const { entity, additionalFields } = props;
  if (!entity.last_request) return null;

  return (
    <Box flow={20}>
      {entity.entityType === "GROUP" && (
        <GroupEditRequest
          group={entity}
          operators={additionalFields && additionalFields.operators}
        />
      )}
      {entity.entityType === "ACCOUNT" && (
        <AccountEditRequest account={entity} />
      )}
    </Box>
  );
}

export default DiffViewer;
