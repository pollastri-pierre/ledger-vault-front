// @flow

import React from "react";
import styled from "styled-components";

import { vaultLayoutConfig } from "styles/theme";

const VaultLayoutMainView = styled.div`
  position: relative;
  z-index: 2;
  flex-grow: 1;

  padding: 20px;
  background-color: ${vaultLayoutConfig.MAIN_VIEW_BG};
  // NOTE: to discuss which behavior we want for the content
  // overflow: scroll;
  padding-left: ${vaultLayoutConfig.MENU_WIDTH + 20}px;

  @media (max-width: ${vaultLayoutConfig.BREAKPOINT}px) {
    padding-left: ${vaultLayoutConfig.COLLAPSED_MENU_WIDTH + 20}px;
  }
`;

const Offset = styled.div`
  margin-top: ${-vaultLayoutConfig.MAIN_VIEW_OFFSET}px;
`;

type Props = {
  children: React$ComponentType<*>,
};

export default ({ children }: Props) => (
  <VaultLayoutMainView>
    <Offset>{children}</Offset>
  </VaultLayoutMainView>
);
