// @flow

import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

import colors from "shared/colors";
import Modal from "components/base/Modal";
import Versions from "components/Versions";
import VaultLink from "components/VaultLink";
import Box from "components/base/Box";
import VaultLogo from "components/icons/Logo";
import VersionLink from "components/VersionLink";
import { vaultLayoutConfig } from "styles/theme";
import { VaultLayoutMenuItem } from "./index";
import type { MenuItem } from "./types";

type Props = {
  items: MenuItem[],
  isOpened: boolean,
  onToggle: () => void,
};

const arrowLeft = <FaArrowLeft />;
const arrowRight = <FaArrowRight />;

function VaultLayoutMenu(props: Props) {
  const { isOpened, onToggle, items } = props;
  const [isVersionOpened, setVersionOpened] = useState(false);
  const openVersionModal = useCallback(() => setVersionOpened(true), [
    setVersionOpened,
  ]);
  const closeVersionModal = useCallback(() => setVersionOpened(false), [
    setVersionOpened,
  ]);
  return (
    <VaultLayoutMenuContainer isOpened={isOpened}>
      <Modal isOpened={isVersionOpened} onClose={closeVersionModal}>
        <Versions onClose={closeVersionModal} />
      </Modal>
      <Box>
        <VaultLink to="/dashboard" withRole>
          <VaultLayoutMenuHeader isOpened={isOpened}>
            <VaultLogo width={120} />
          </VaultLayoutMenuHeader>
        </VaultLink>
        <VaultLayoutToggle isOpened={isOpened} onToggle={onToggle} />
        {items.map(item => (
          <VaultLayoutMenuItem
            key={item.key}
            item={item}
            isMenuOpened={isOpened}
          >
            {item.label}
          </VaultLayoutMenuItem>
        ))}
      </Box>
      <Box>
        <VaultVersionLinkContainer>
          <VersionLink onClick={openVersionModal} />
        </VaultVersionLinkContainer>
      </Box>
    </VaultLayoutMenuContainer>
  );
}

function VaultLayoutToggle({ isOpened, onToggle }: $Shape<Props>) {
  return (
    <VaultLayoutToggleContainer onClick={onToggle}>
      {isOpened ? arrowLeft : arrowRight}
    </VaultLayoutToggleContainer>
  );
}

const VaultVersionLinkContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const VaultLayoutMenuContainer = styled.div`
  background: white;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  box-shadow: -3px 2px 5px 0 ${colors.legacyTranslucentGrey2};
  border-right: 1px solid ${colors.legacyLightGrey1};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${p =>
    p.isOpened
      ? vaultLayoutConfig.MENU_WIDTH
      : vaultLayoutConfig.COLLAPSED_MENU_WIDTH}px;

  @media (min-width: ${vaultLayoutConfig.BREAKPOINT}px) {
    width: ${vaultLayoutConfig.MENU_WIDTH}px;
  }
`;

const VaultLayoutMenuHeader = styled.div`
  height: ${vaultLayoutConfig.TOP_BAR_HEIGHT}px;
  width: ${vaultLayoutConfig.MENU_WIDTH + 20}px;
  margin-bottom: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${p => (p.isOpened ? 1 : 0)};
  pointer-events: none;
  @media (min-width: ${vaultLayoutConfig.BREAKPOINT}px) {
    opacity: 1;
    pointer-events: auto;
  }
`;

const VaultLayoutToggleContainer = styled.div`
  pointer-events: auto;
  border: 1px solid ${colors.form.border};
  width: 100px;
  height: 40px;
  border-radius: 40px;
  background: ${colors.white};
  cursor: pointer;
  padding-right: 15px;
  position: absolute;
  top: 10px;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  transform: translateX(-50px);

  &:hover {
    background: ${colors.legacyTranslucentGrey6};
  }

  &:active {
    background: ${colors.legacyTranslucentGrey1};
  }

  @media (min-width: ${vaultLayoutConfig.BREAKPOINT}px) {
    opacity: 0;
    pointer-events: none;
  }
`;

export default VaultLayoutMenu;
