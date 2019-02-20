// @flow
import React from "react";
import { Trans } from "react-i18next";
import AddLink from "components/base/AddLink";
import Text from "components/base/Text";

export default ({
  onClick,
  member
}: {
  onClick: () => void,
  member: string
}) => (
  <AddLink onClick={onClick}>
    <Text>
      <Trans
        i18nKey="inviteMember:inviteLink"
        values={{
          memberRole: member
        }}
      />
    </Text>
  </AddLink>
);
