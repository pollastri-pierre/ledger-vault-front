// @flow

import React from "react";
import styled from "styled-components";

import Box from "components/base/Box";
import Text from "components/base/Text";

export const CardTitle = ({
  children,
  i18nKey,
  noMargin,
}: {
  children?: React$Node,
  noMargin?: boolean,
  i18nKey?: string,
}) => (
  <Box mb={noMargin ? 0 : 20}>
    <Text small bold uppercase i18nKey={i18nKey}>
      {children}
    </Text>
  </Box>
);

export const CardDesc = ({
  children,
  i18nKey,
}: {
  children?: React$Node,
  i18nKey?: string,
}) => (
  <Box my={10}>
    <Text small i18nKey={i18nKey}>
      {children}
    </Text>
  </Box>
);

export { default as CardError } from "./CardError";
export { default as CardLoading } from "./CardLoading";

export default styled(Box).attrs(p => ({
  // $FlowFixMe
  p: "p" in p ? p.p : 20,
  // $FlowFixMe
  position: "relative",
}))`
  overflow-x: ${p => p.overflow || "unset"};
  background-color: ${p => p.bc || "white"};
  color: #555;
  box-shadow: 0 2.5px 2.5px 0 rgba(0, 0, 0, 0.07);
`;
