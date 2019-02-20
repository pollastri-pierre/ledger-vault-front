// @flow

import React from "react";
import styled from "styled-components";
import { FaPlus } from "react-icons/fa";

import Box from "components/base/Box";
import colors from "shared/colors";

const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;

  color: ${colors.ocean};

  &:hover {
    color: ${colors.mediumGrey};
  }
`;

export default ({
  onClick,
  children
}: {
  onClick: () => void,
  children: *
}) => (
  <Container>
    <Box horizontal flow={7} p={20} onClick={onClick} align="center">
      <FaPlus />
      {children}
    </Box>
  </Container>
);
