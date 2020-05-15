// @flow

import React from "react";
import styled from "styled-components";

import imgEmptyStateHappy from "assets/img/empty-state-happy.svg";
import VaultLink from "components/VaultLink";
import colors, { darken } from "shared/colors";
import Text from "components/base/Text";

export const List = styled.div((p) => {
  const listDisplaySpecific =
    p.display === "grid"
      ? `
          display: flex;
          flex-wrap: wrap;
        `
      : `
          border: 1px solid ${colors.form.border};
          border-radius: 4px;

          > * + * {
            border-top: 1px solid ${colors.form.border};
          }
          > *:first-child {
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
          }
          > *:last-child {
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
          }
        `;

  return `
    ${listDisplaySpecific};
  `;
});

const ListItemContainer = styled(({ tileWidth, ...p }) => <div {...p} />)(
  (p) => {
    const listItemDisplaySpecific =
      p.display === "grid"
        ? `
          width: ${p.tileWidth ? p.tileWidth : 300}px;
          border: 1px solid ${colors.form.border};
          border-radius: 4px;
          margin: 5px;
        `
        : ``;

    return `
    ${listItemDisplaySpecific}

    // important to keep display: block, because can be forwarded as <a />
    display: block;
    position: relative;
    background: white;

    &:hover {
      cursor: ${p.onClick ? "pointer" : ""};
      background: ${colors.form.bg};
    }
    &:active {
      cursor: ${p.onClick ? "pointer" : ""};
      background: ${darken(colors.form.bg, 0.02)};
    }
    padding: ${p.compact ? "10px" : "20px"};

    `;
  },
);

// hacky to put `tileWidth` here, but it's the only way I found to prevent
// styled-components from putting it in the DOM as an attribute (create a
// big redish warning in the console)...
type RoleVaultLinkProps = {
  to: string,
  tileWidth?: any,
};

const RoleVaultLink = ({ to, tileWidth, ...p }: RoleVaultLinkProps) => (
  <VaultLink withRole to={to} {...p} />
);

export const ListItem = ({ to, ...props }: { to?: string }) => {
  return (
    <ListItemContainer as={to ? RoleVaultLink : undefined} to={to} {...props} />
  );
};

type ListEmptyProps = {
  children: React$Node,
};

export function ListEmpty(props: ListEmptyProps) {
  const { children } = props;
  return (
    <ListEmptyContainer>
      <img
        src={imgEmptyStateHappy}
        alt=""
        style={{ width: 80, marginRight: -10 }}
      />
      <Text color={colors.textLight}>{children}</Text>
    </ListEmptyContainer>
  );
}

const ListEmptyContainer = styled.div`
  border: 1px dashed ${colors.form.border};
  padding: 20px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 4px;
  > * + * {
    margin-top: 20px;
  }
`;
