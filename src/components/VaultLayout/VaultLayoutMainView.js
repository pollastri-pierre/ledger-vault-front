// @flow

import React from "react";
import styled from "styled-components";

import { vaultLayoutConfig } from "styles/theme";

const VaultLayoutMainView = styled.div`
  position: relative;
  z-index: 2;
  flex-grow: 1;

  padding: 0 20px 20px 20px;
  pointer-events: auto;

  // NOTE: to discuss which behavior we want for the content
  // overflow: scroll;
  padding-left: ${vaultLayoutConfig.MENU_WIDTH + 20}px;

  @media (max-width: ${vaultLayoutConfig.BREAKPOINT}px) {
    padding-left: ${vaultLayoutConfig.COLLAPSED_MENU_WIDTH + 20}px;
  }
`;

const Offset = styled.div`
  padding-top: 20px;
`;

type Props = {
  children: React$ComponentType<*>,
};

export default ({ children }: Props) => (
  <VaultLayoutMainView>
    <Offset>{children}</Offset>
  </VaultLayoutMainView>
);
