// @flow

import React from "react";
import type { Match } from "react-router-dom";
import Animated from "animated/lib/targets/react-dom";
import styled from "styled-components";
import { FaQuestionCircle, FaPowerOff } from "react-icons/fa";

import colors from "shared/colors";
import type { User } from "data/types";
import Box from "components/base/Box";
import Text from "components/base/Text";
import ActivityCard from "components/legacy/ActivityMenu";
import { vaultLayoutConfig } from "styles/theme";
import { urls } from "utils/urls";

type Props = {
  globalAnimation: Animated.Value,
  user: User,
  onLogout: () => void,
  match: Match,
  BreadcrumbComponent: React$ComponentType<*>,
};

export default ({
  globalAnimation,
  user,
  onLogout,
  match,
  BreadcrumbComponent,
}: Props) => {
  const contentStyle = getContentStyle(globalAnimation);
  return (
    <VaultLayoutTopBar>
      <Animated.div style={contentStyle}>
        <BreadcrumbComponent />
      </Animated.div>
      <VaultLayoutTopBarRight>
        <Box horizontal align="center" px={20}>
          <Text small>{user.username}</Text>
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
  position: relative;
  align-items: center;
  padding: 0 20px;
  height: ${vaultLayoutConfig.TOP_BAR_HEIGHT}px;
  background: white;
  box-shadow: 0 -2px 5px 0 rgba(0, 0, 0, 0.2);
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
    color: #aaa;
  }

  &:active {
    background-color: ${colors.form.bg};
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

function getContentStyle(globalAnimation: Animated.Value) {
  return {
    position: "relative",
    zIndex: 1,
    transform: [
      {
        translateX: globalAnimation.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [
            vaultLayoutConfig.MENU_WIDTH,
            vaultLayoutConfig.COLLAPSED_MENU_WIDTH,
            vaultLayoutConfig.COLLAPSED_MENU_WIDTH,
          ],
          clamp: true,
        }),
      },
    ],
  };
}
