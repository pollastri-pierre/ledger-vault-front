// @flow

import React from "react";
import styled from "styled-components";

import colors from "shared/colors";

const ScrollingBlock = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: ${colors.cream};
  justify-content: ${(p) => (p.noVerticalAlign ? "flex-start" : "center")};
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
`;

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 1;
  min-height: 0;
`;

const Inner = styled.div`
  margin-top: 80px;
  margin-bottom: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

export default ({
  children,
  noVerticalAlign,
}: {
  children: React$Node,
  noVerticalAlign?: boolean,
}) => (
  <ScrollingBlock noVerticalAlign={noVerticalAlign}>
    <Outer>
      <Inner>{children}</Inner>
    </Outer>
  </ScrollingBlock>
);
