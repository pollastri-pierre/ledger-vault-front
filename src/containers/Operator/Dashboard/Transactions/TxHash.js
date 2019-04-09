// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";

import Box from "components/base/Box";

import colors from "shared/colors";

import type { Transaction } from "data/types";

const Hash = ({ value }: { value: string }) => {
  if (!value) {
    return <Box />;
  }

  const hashSize = value.length / 2;
  const left = value.slice(0, 10);
  const right = value.slice(-hashSize);
  const middle = value.slice(10, -hashSize);
  return (
    <Box horizontal grow color="smoke">
      <div>{left}</div>
      <HashEllipsis>{middle}</HashEllipsis>
      <div>{right}</div>
    </Box>
  );
};

const HashEllipsis = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

class TxHash extends PureComponent<{
  operation: Transaction,
}> {
  render() {
    const { operation } = this.props;
    const hash = operation.transaction.hash || "N/A";

    return (
      <Box color={colors.lead} grow={hash.length > 10} px={20} width={150}>
        <Hash value={hash} />
      </Box>
    );
  }
}

export default TxHash;
