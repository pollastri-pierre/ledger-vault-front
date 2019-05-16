// @flow

import React from "react";
import qs from "query-string";
import { Link } from "react-router-dom";
import Animated from "animated/lib/targets/react-dom";
import styled from "styled-components";

import colors, { opacity } from "shared/colors";
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
    const query = item.query ? qs.stringify(item.query) : "";
    icon = (
      <Link style={styles.link} to={`${item.url}?${query}`}>
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
            vaultLayoutConfig.COLLAPSED_MENU_WIDTH - 10,
            vaultLayoutConfig.MENU_WIDTH - 30,
          ],
        }),
      },
      {
        translateY: globalAnimation.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [10, -5, 10],
        }),
      },
    ],
  };
  return <Animated.div style={style}>{children}</Animated.div>;
};

const VaultLayoutMenuItem = styled.div`
  position: relative;
  height: 40px;

  ${({ isActive, isMenuOpened, isDisabled, isMenuFloating }) => {
    const isInteractive = !isDisabled && (isMenuOpened || !isMenuFloating);
    const isIcon = !isMenuOpened;

    const bg =
      (!isIcon || !isMenuFloating) && isActive
        ? opacity(colors.blue, 0.05)
        : "inherit";
    const color = isActive ? colors.blue : "#777";

    return `
      color: ${color};
      background-color: ${bg};
      opacity: ${isDisabled ? "0.6" : "1"};
      pointer-events: ${isInteractive ? "auto" : "none"};

      &:hover {
        color: ${isActive ? colors.blue : "#333"};
        cursor: pointer;
      }

      &:active {
        background-color: ${isIcon ? "inherit" : "rgba(0, 0, 0, 0.02)"};
      }
    `;
  }}
`;

const VaultLayoutIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 40px;
  color: inherit;
  pointer-events: ${p => (p.isDisabled ? "none" : "auto")};
  background-color: ${p =>
    p.isActive && (p.isMenuFloating && !p.isMenuOpened)
      ? opacity(colors.blue, 0.05)
      : "inherit"};
  &:hover {
    cursor: ${p => (p.isMenuOpened ? "inherit" : "pointer")};
  }
  &:active {
    background-color: ${p =>
      p.isMenuOpened ? "inherit" : "rgba(0, 0, 0, 0.02)"};
  }
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
