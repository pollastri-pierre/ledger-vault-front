// @flow

import React from "react";
import styled from "styled-components";

import imgEmptyStateHappy from "assets/img/empty-state-happy.svg";
import colors from "shared/colors";
import Text from "components/base/Text";

export const List = styled.div`
  border: 1px solid ${colors.form.border};
  background: white;
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

export const ListItem = styled.div`
  padding: 20px;
  background: white;
  position: relative;
  &:hover {
    cursor: ${p => (p.onClick ? "pointer" : "")};
  }
`;

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
  > * + * {
    margin-top: 20px;
  }
`;
