// @flow
import React from "react";
import AddLink from "components/base/AddLink";
import Text from "components/base/Text";

export default ({ onClick }: { onClick: () => void }) => (
  <AddLink onClick={onClick}>
    <Text i18nKey="inviteUser:inviteLink" />
  </AddLink>
);
