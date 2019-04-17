// @flow

import React from "react";
import { Link } from "react-router-dom";
import Animated from "animated/lib/targets/react-dom";
import styled from "styled-components";

import { vaultLayoutConfig } from "styles/theme";
import type { MenuItem } from "./types";

type Props = {
  children: React$Node,
  item: MenuItem,
  globalAnimation: Animated.Value,
  isMenuOpened: boolean,
  isMenuFloating: boolean,
};

export default ({
  children,
  item,
  globalAnimation,
  isMenuOpened,
  isMenuFloating,
}: Props) => {
  const { Icon, NotifComponent, dataTest } = item;

  const iconContainerStyle = {
    ...styles.stick,
    transform: [
      {
        translateX: globalAnimation.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [10, 0, 0],
        }),
      },
    ],
  };

  const labelContainerStyle = {
    ...styles.stick,
    alignItems: "center",
    opacity: globalAnimation.interpolate({
      inputRange: [0, 0.5, 1, 1.5, 2],
      outputRange: [1, 0, 0, 0, 1],
    }),
    transform: [
      {
        translateX: globalAnimation.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [60, 0, 50],
        }),
      },
    ],
  };

  const notifComponent = NotifComponent ? (
    <Notif globalAnimation={globalAnimation}>
      <NotifComponent />
    </Notif>
  ) : null;

  let icon = (
    <VaultLayoutIconContainer
      isMenuOpened={isMenuOpened}
      isMenuFloating={isMenuFloating}
      isDisabled={item.isDisabled}
      isActive={item.isActive}
    >
      <Icon />
    </VaultLayoutIconContainer>
  );

  if (item.url && (!isMenuOpened && isMenuFloating)) {
    icon = (
      <Link style={styles.link} to={item.url}>
        {icon}
      </Link>
    );
  }

  let menuItem = (
    <VaultLayoutMenuItem
      isDisabled={item.isDisabled}
      isMenuOpened={isMenuOpened}
      isMenuFloating={isMenuFloating}
      isActive={item.isActive}
      onClick={!isMenuFloating || isMenuOpened ? item.onClick : undefined}
    >
      <Animated.div
        style={iconContainerStyle}
        className="VaultLayoutIconContainer"
        onClick={isMenuFloating && !isMenuOpened ? item.onClick : undefined}
      >
        {icon}
      </Animated.div>
      <Animated.div style={labelContainerStyle}>{children}</Animated.div>
    </VaultLayoutMenuItem>
  );

  if (item.url && (isMenuOpened || !isMenuFloating)) {
    menuItem = (
      <Link style={styles.link} to={item.url}>
        {menuItem}
      </Link>
    );
  }

  return (
    <div style={styles.relative} data-test={dataTest}>
      {menuItem}
      {notifComponent}
    </div>
  );
};

const Notif = ({
  globalAnimation,
  children,
}: {
  globalAnimation: Animated.Value,
  children: React$Node,
}) => {
  const style = {
    ...styles.stick,
    transform: [
      {
        translateX: globalAnimation.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [
            vaultLayoutConfig.MENU_WIDTH - 30,
            vaultLayoutConfig.COLLAPSED_MENU_WIDTH - 15,
            vaultLayoutConfig.MENU_WIDTH - 30,
          ],
        }),
      },
      {
        translateY: globalAnimation.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [10, 0, 10],
        }),
      },
    ],
  };
  return <Animated.div style={style}>{children}</Animated.div>;
};

const VaultLayoutMenuItem = styled.div`
  position: relative;
  height: 40px;
  opacity: ${p => (p.isDisabled ? "0.6" : "1")};

  pointer-events: ${p =>
    p.isDisabled || ((p.isMenuFloating && !p.isMenuOpened) || p.isActive)
      ? "none"
      : "auto"};

  font-weight: ${p => (p.isActive ? "bold" : "normal")};
  &:hover {
    color: #333;
    cursor: pointer;
    box-shadow: ${p =>
      (p.isMenuFloating && p.isMenuOpened) || !p.isMenuFloating
        ? `${vaultLayoutConfig.MENU_HINT_COLOR_HOVER} 4px 0 0 inset`
        : "none"};
  }
  background-color: ${p =>
    p.isActive && !(p.isMenuFloating && !p.isMenuOpened)
      ? "#efefef"
      : "inherit"};
  box-shadow: ${p =>
    p.isActive && !(p.isMenuFloating && !p.isMenuOpened)
      ? `${vaultLayoutConfig.MENU_HINT_COLOR} 4px 0 0 inset !important`
      : "none"};
  color: ${p => (p.isActive ? "#333" : "#777")};
`;

const VaultLayoutIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 40px;
  color: inherit;
  pointer-events: ${p => (p.isDisabled || p.isActive ? "none" : "auto")};
  background-color: ${p =>
    p.isActive && (p.isMenuFloating && !p.isMenuOpened)
      ? "#efefef"
      : "inherit"};
  &:hover {
    cursor: ${p => (p.isMenuOpened ? "inherit" : "pointer")};
    box-shadow: ${p =>
      p.isMenuFloating && !p.isMenuOpened
        ? `${vaultLayoutConfig.MENU_HINT_COLOR_HOVER} 4px 0 0 inset`
        : "none"};
  }

  box-shadow: ${p =>
    p.isMenuFloating && p.isActive
      ? `${vaultLayoutConfig.MENU_HINT_COLOR} 4px 0 0 inset !important`
      : "none"};
`;

const styles = {
  relative: {
    position: "relative",
  },
  stick: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    display: "flex",
  },
  link: { color: "inherit" },
};
