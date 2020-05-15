// @flow
import React from "react";
import styled from "styled-components";

import colors from "shared/colors";

type MenuLinkOnboardingType = {
  children: React$Node,
  color?: string,
  selected: boolean,
};

const MenuLinkOnboarding = ({
  children,
  color,
  selected,
}: MenuLinkOnboardingType) => {
  return (
    <MenuLink selected={selected} color={color}>
      <Span> {children}</Span>
    </MenuLink>
  );
};

const MenuLink = styled.div`
  height: 28px;
  font-size: 11px;
  font-weight: 600;
  padding-left: 40px;
  opacity: ${(p) => (p.selected ? 1 : 0.5)};
  display: flex;
  align-items: center;

  ${(p) =>
    p.selected
      ? `
      &:before {
        left: 0;
        width: 5px;
        height: 28px;
        content: "";
        position: absolute;
        background-color: ${p.color || colors.ocean};
      }
    `
      : ""}
`;

const Span = styled.span`
  color: ${colors.steel};
`;

export default MenuLinkOnboarding;
