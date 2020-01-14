// @flow

import React from "react";

import Text from "components/base/Text";

const VersionLink = ({ onClick }: { onClick: boolean => void }) => {
  return (
    <span onClick={onClick} style={{ cursor: "pointer" }}>
      <Text size="small">Vault - v{VAULT_FRONT_VERSION}</Text>
    </span>
  );
};

export default VersionLink;
