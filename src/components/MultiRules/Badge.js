// @flow

import React from "react";
import styled from "styled-components";

import colors from "shared/colors";

type Props = {
  children?: React$Node,
  Icon?: React$ComponentType<{ size: number }>,
  type?: "primary",
};

const Badge = ({ Icon, children, type, ...p }: Props) => (
  <Container type={type} {...p}>
    {Icon && <Icon style={{ marginRight: 3, marginBottom: -1 }} size={12} />}
    <span>{children}</span>
  </Container>
);

const Container = styled.div`
  display: inline;
  align-items: baseline;
  background: white;
  border: 1px dashed rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 5px;
  white-space: nowrap;
  color: ${p => (p.type === "primary" ? colors.bLive : "inherit")};
  font-weight: ${p => (p.type === "primary" ? "bold" : "normal")};
`;

export default Badge;
