// @flow
import React from "react";
import { MdCreateNewFolder, MdDelete, MdEdit } from "react-icons/md";
import { Trans } from "react-i18next";

import Box from "components/base/Box";
import Text from "components/base/Text";
import type { GenericRequest } from "data/types";
import colors from "shared/colors";

const ICON_SIZE = 16;
const editIcon = <MdEdit size={ICON_SIZE} />;
const newIcon = <MdCreateNewFolder size={ICON_SIZE} />;
const deleteIcon = <MdDelete size={ICON_SIZE} />;

type Props = {
  request: GenericRequest,
};

function RequestTitle(props: Props) {
  const { request } = props;
  return (
    <Box horizontal align="center" flow={5}>
      <Box color={colors.lightGrey} justify="center">
        {getIconByType(request)}
      </Box>
      <Text>
        <Trans
          i18nKey={`request:richType.${request.type}`}
          values={{ extra: getRequestExtra(request) }}
          components={[<strong>extra</strong>]}
        />
      </Text>
    </Box>
  );
}

function getIconByType(request) {
  const { type } = request;
  if (type.startsWith("CREATE")) {
    return newIcon;
  }
  if (
    type.startsWith("EDIT") ||
    type.startsWith("UPDATE") ||
    type.startsWith("MIGRATE")
  ) {
    return editIcon;
  }
  if (type.startsWith("REVOKE")) {
    return deleteIcon;
  }
}

const extraByRequest = [
  [
    ["CREATE_GROUP", "EDIT_GROUP", "REVOKE_GROUP"],
    request => (request.group ? request.group.name : null),
  ],
  [
    ["REVOKE_USER", "CREATE_ADMIN", "CREATE_OPERATOR"],
    request => (request.user ? request.user.username : null),
  ],
  [
    ["CREATE_ACCOUNT", "EDIT_ACCOUNT", "REVOKE_ACCOUNT", "MIGRATE_ACCOUNT"],
    request => (request.account ? request.account.name : null),
  ],
];

function getRequestExtra(request) {
  const matchingGroup = extraByRequest.find(e => e[0].includes(request.type));
  if (!matchingGroup) return null;
  return matchingGroup[1](request);
}

export default RequestTitle;
