// @flow

import React from "react";
import styled from "styled-components";

import Box from "components/base/Box";
import Text from "components/base/Text";

export const CardTitle = ({ children }: { children: React$Node }) => (
  <Box mb={20}>
    <Text small bold uppercase>
      {children}
    </Text>
  </Box>
);

export { default as CardError } from "./CardError";
export { default as CardLoading } from "./CardLoading";

export default styled(Box).attrs({
  // $FlowFixMe
  p: p => p.p || 40,
  // $FlowFixMe
  position: "relative"
})`
  overflow-x: auto;
  background-color: white;
  color: #555;
  box-shadow: 0 2.5px 2.5px 0 rgba(0, 0, 0, 0.07);
`;
