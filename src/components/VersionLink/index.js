// @flow

import React from "react";

import Text from "components/base/Text";
import productVersion from "../../version";

const VersionLink = ({ onClick }: { onClick: boolean => void }) => {
  return (
    <span onClick={onClick} style={{ cursor: "pointer" }}>
      <Text size="small">Ledger Vault - {productVersion}</Text>
    </span>
  );
};

export default VersionLink;
