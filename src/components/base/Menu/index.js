import styled from "styled-components";
import { MenuButton, MenuItem, MenuList } from "@reach/menu-button";

import colors from "shared/colors";

export { Menu } from "@reach/menu-button";

export const MenuButtonStyle = styled(MenuButton)`
  cursor: pointer;
  border: none;
  padding: 0;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 1px rgba(238, 238, 238, 0.5) inset,
      0 0 0 1px rgba(238, 238, 238, 0.3), 0 0 0 2px rgba(238, 238, 238, 0.3);
  }
`;
export const MenuButtonStyleIcon = styled(MenuButtonStyle)`
  width: 30px;
  background: transparent;
  color: ${colors.lightGrey};

  &:hover,
  &:focus {
    outline: none;
    box-shadow: none;
    color: ${colors.mediumGrey};
  }
`;

export const MenuItemStyle = styled(MenuItem)`
  background: ${colors.white} !important;
  padding: 5px 20px;
  border-left: 4px solid transparent;
  color: ${colors.legacyDarkGrey1} !important;
  opacity: 0.5;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;

  &:hover,
  &:focus {
    opacity: 1;
    border-color: ${colors.bLive};
    outline: none;
  }
`;

export const MenuListStyle = styled(MenuList)`
  border-radius: 4px;
  width: 108px;
  padding: 10px 0;
  background: ${colors.white};
  box-shadow: ${colors.shadows.material};
  border: none !important;
  &:focus {
    outline: none;
  }
`;
