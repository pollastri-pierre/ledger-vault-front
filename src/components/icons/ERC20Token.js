// @flow

import React from "react";
import styled from "styled-components";

import colors from "shared/colors";
import type { ERC20Token } from "data/types";
import Box from "components/base/Box";

const ERC20TokenIcon = ({
  size,
  token,
}: {
  size: number,
  token: ERC20Token,
}) => (
  <Container width={size} height={size}>
    {token ? getFirstLetter(token.name) : ""}
  </Container>
);

export default ERC20TokenIcon;

const Container = styled(Box).attrs({
  align: "center",
  justify: "center",
})`
  background: ${colors.night};
  border-radius: 4px;
  font-weight: bold;
  font-size: 11px;
  color: white;
`;

function getFirstLetter(name: string) {
  const alphaNumRegex = /[0-9a-zA-Z]/;

  const matches = name.match(alphaNumRegex);

  if (matches && matches.length > 0) {
    return matches[0].toUpperCase();
  }
  return "";
}
