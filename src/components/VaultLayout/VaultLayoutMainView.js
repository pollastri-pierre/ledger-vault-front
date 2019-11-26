// @flow

import React from "react";
import styled from "styled-components";

import { vaultLayoutConfig } from "styles/theme";

const VaultLayoutMainView = styled.div`
  position: relative;
  flex-grow: 1;

  padding: 0 20px 20px 20px;
  pointer-events: auto;

  padding-left: ${vaultLayoutConfig.COLLAPSED_MENU_WIDTH + 20}px;

  @media (min-width: ${vaultLayoutConfig.BREAKPOINT}px) {
    padding-left: ${vaultLayoutConfig.MENU_WIDTH + 20}px;
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
