// @flow

import React from "react";
import Tooltip from "@reach/tooltip";
import styled from "styled-components";

import colors from "shared/colors";

type ToolTipProps = {|
  children: React$Node,
  content: React$Node,
|};

const toolTipStyle = {
  zIndex: 101, // Modal z-index is 100
  background: colors.night,
  color: colors.argile,
  border: "none",
  borderRadius: "4px",
  padding: "5px 10px",
  fontWeight: "bold",
  fontSize: "12px",
  boxShadow: colors.shadows.material2,
};

const Container = styled.div`
  flex-shrink: 0;
`;

export default ({ children, content }: ToolTipProps) => {
  return (
    <Tooltip label={content} style={toolTipStyle}>
      <Container>{children}</Container>
    </Tooltip>
  );
};
