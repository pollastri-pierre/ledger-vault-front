// @flow

import React from "react";
import qs from "query-string";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { vaultLayoutConfig } from "styles/theme";
import colors, { opacity } from "shared/colors";
import type { MenuItem } from "./types";

type Props = {
  children: React$Node,
  item: MenuItem,
  isMenuOpened: boolean,
};

export default ({ children, item, isMenuOpened }: Props) => {
  const { Icon, NotifComponent, dataTest } = item;

  const url = item.url
    ? `${item.url}?${item.query ? qs.stringify(item.query) : ""}`
    : null;

  const notifComponent = NotifComponent ? (
    <NotifWrapper isMenuOpened={isMenuOpened}>
      <NotifComponent />
    </NotifWrapper>
  ) : null;

  const icon = (
    <VaultLayoutIconContainer>
      <Icon />
    </VaultLayoutIconContainer>
  );

  let menuItem = (
    <VaultLayoutMenuItem
      isDisabled={item.isDisabled}
      isMenuOpened={isMenuOpened}
      isActive={item.isActive}
      onClick={item.onClick}
    >
      {icon}
      <div className="VaultLayoutMenuItem--content">{children}</div>
    </VaultLayoutMenuItem>
  );

  if (url) {
    menuItem = item.isDisabled ? menuItem : <Link to={url}>{menuItem}</Link>;
  }

  return (
    <div style={{ position: "relative" }} data-test={dataTest}>
      {menuItem}
      {notifComponent}
    </div>
  );
};

const VaultLayoutMenuItem = styled.div`
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;

  .VaultLayoutMenuItem--content {
    display: block;
  }

  @media (max-width: ${vaultLayoutConfig.BREAKPOINT}px) {
    .VaultLayoutMenuItem--content {
      display: ${p => (p.isMenuOpened ? "block" : "none")};
    }
  }

  ${({ isActive, isDisabled }) => {
    const bg = isActive ? opacity(colors.blue, 0.05) : "inherit";
    const color = isActive ? colors.blue : colors.legacyLightGrey3;

    return `
      color: ${color};
      background-color: ${bg};
      opacity: ${isDisabled ? "0.6" : "1"};
      pointer-events: ${!isDisabled ? "auto" : "none"};

      &:hover {
        color: ${isActive ? colors.blue : colors.legacyDarkGrey1};
        cursor: pointer;
      }

      &:active {
        background-color: ${colors.legacyTranslucentGrey8};
      }
    `;
  }}
`;

const VaultLayoutIconContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 40px;
  color: inherit;
`;

const NotifWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 30px;

  @media (max-width: ${vaultLayoutConfig.BREAKPOINT}px) {
    top: ${p => (p.isMenuOpened ? 10 : -5)}px;
    right: ${p => (p.isMenuOpened ? 30 : 8)}px;
  }
`;
