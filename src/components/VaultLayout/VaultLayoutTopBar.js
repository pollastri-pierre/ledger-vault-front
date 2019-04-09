// @flow

import React from "react";
import type { Match } from "react-router-dom";
import Animated from "animated/lib/targets/react-dom";
import styled from "styled-components";
import { FaQuestionCircle, FaPowerOff } from "react-icons/fa";

import type { User } from "data/types";
import colors from "shared/colors";
import Logo from "components/icons/Logo";
import Box from "components/base/Box";
import ActivityCard from "components/legacy/ActivityMenu";
import { vaultLayoutConfig } from "styles/theme";
import { urls } from "utils/urls";

type Props = {
  isMenuOpened: boolean,
  isMenuFloating: boolean,
  globalAnimation: Animated.Value,
  user: User,
  onLogout: () => void,
  match: Match,
};

export default ({
  globalAnimation,
  isMenuOpened,
  isMenuFloating,
  user,
  onLogout,
  match,
}: Props) => {
  const logoStyle = getLogoStyle(globalAnimation);
  return (
    <VaultLayoutTopBar>
      <Animated.div style={logoStyle}>
        <VaultLayoutTopBarLeftContent invert={isMenuOpened || !isMenuFloating}>
          <Logo width={vaultLayoutConfig.TOP_BAR_LOGO_WIDTH} />
        </VaultLayoutTopBarLeftContent>
      </Animated.div>
      <VaultLayoutTopBarRight>
        <Box horizontal align="center" px={20}>
          {user.username}
        </Box>
        <ActivityCard match={match} />
        <TopBarAction link={urls.customer_support} Icon={FaQuestionCircle} />
        <TopBarAction data-test="logout" Icon={FaPowerOff} onClick={onLogout} />
      </VaultLayoutTopBarRight>
    </VaultLayoutTopBar>
  );
};

const VaultLayoutTopBar = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  position: relative;

  background: ${vaultLayoutConfig.TOP_BAR_BG};
  color: white;

  height: ${vaultLayoutConfig.TOP_BAR_HEIGHT}px;
  padding: 0 20px 0 20px;
`;

const VaultLayoutTopBarRight = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 20px;
  line-height: 1;
  display: flex;
`;

const TopBarActionComponent = styled.div`
  cursor: pointer;
  color: #ccc;
  display: flex;
  align-items: center;

  padding-left: ${p => (p.link ? "0" : "10px")};
  padding-right: ${p => (p.link ? "0" : "10px")};

  &:hover {
    color: white;
  }

  a {
    color: inherit;
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: ${p => (p.link ? "10px" : "0")};
    padding-right: ${p => (p.link ? "10px" : "0")};
  }
`;

const TopBarAction = ({
  link,
  onClick,
  Icon,
  ...props
}: {
  link?: string,
  Icon: React$ComponentType<*>,
  onClick?: () => void,
}) => {
  let inner = <Icon size={18} />;
  if (link) {
    inner = (
      <a href={link} target="new">
        {inner}
      </a>
    );
  }
  return (
    <TopBarActionComponent onClick={onClick} link={link} {...props}>
      {inner}
    </TopBarActionComponent>
  );
};

const VaultLayoutTopBarLeftContent = styled.div`
  color: ${p => (p.invert ? colors.night : colors.white)};
  transition: 200ms linear filter;
`;

function getLogoStyle(globalAnimation: Animated.Value) {
  const openedTranslateX =
    vaultLayoutConfig.MENU_WIDTH / 2 -
    vaultLayoutConfig.TOP_BAR_LOGO_WIDTH / 2 -
    20;
  return {
    position: "relative",
    zIndex: 3,
    transform: [
      {
        translateX: globalAnimation.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [
            openedTranslateX,
            vaultLayoutConfig.COLLAPSED_MENU_WIDTH,
            openedTranslateX,
          ],
        }),
      },
    ],
  };
}
