// @flow

import React, { useState } from "react";
import type { Match } from "react-router-dom";
import styled from "styled-components";
import colors from "shared/colors";

import type { User } from "data/types";

import {
  VaultLayoutTopBar,
  VaultLayoutMenu,
  VaultLayoutMainView,
} from "./index";

import type { MenuItem } from "./types";

type Props = {
  children: React$ComponentType<*>,
  menuItems: MenuItem[],
  user: User,
  onLogout: () => void,
  match: Match,
  TopBarContent: React$ComponentType<*>,
};

function VaultLayout(props: Props) {
  const { children, menuItems, user, onLogout, match, TopBarContent } = props;

  const [isMenuOpened, setMenuOpened] = useState(false);

  const toggleMenu = () => setMenuOpened(!isMenuOpened);

  return (
    <VaultLayoutFixedContainer>
      <VaultLayoutTopBar
        match={match}
        user={user}
        onLogout={onLogout}
        TopBarContent={TopBarContent}
      />
      <VaultLayoutMainView isMenuOpened={isMenuOpened}>
        {children}
      </VaultLayoutMainView>
      <VaultLayoutMenu
        items={menuItems}
        isOpened={isMenuOpened}
        onToggle={toggleMenu}
      />
    </VaultLayoutFixedContainer>
  );
}

const VaultLayoutFixedContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  min-height: 100vh;
  position: relative;

  display: flex;
  flex-direction: column;
  background-color: ${colors.form.bg};
`;

export default VaultLayout;
