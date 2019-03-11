// @flow
import React from "react";
import { Trans } from "react-i18next";
import AddLink from "components/base/AddLink";
import Text from "components/base/Text";

export default ({ onClick, user }: { onClick: () => void, user: string }) => (
  <AddLink onClick={onClick}>
    <Text>
      <Trans
        i18nKey="inviteUser:inviteLink"
        values={{
          userRole: user
        }}
      />
    </Text>
  </AddLink>
);
