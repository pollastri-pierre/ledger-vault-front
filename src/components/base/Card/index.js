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

export default styled(Box)`
  position: relative;
  padding: 20px;
  background: white;
  overflow-x: ${p => p.overflow || "unset"};
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.07);
`;
