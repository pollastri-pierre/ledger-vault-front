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

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
`;

export default ({ children }: { children: React$Node }) => (
  <ScrollingBlock>
    <Outer>
      <Inner>{children}</Inner>
    </Outer>
  </ScrollingBlock>
);
