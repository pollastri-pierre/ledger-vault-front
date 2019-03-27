// @flow

import React from "react";
import styled from "styled-components";

import colors from "shared/colors";
import IconClose from "components/icons/Close";

const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  cursor: pointer;

  color: ${colors.lightGrey};

  &:hover {
    color: ${colors.mediumGrey};
  }

  &:active {
    color: ${colors.steel};
  }
`;

export default ({ onClick }: { onClick: () => void }) => (
  <Container onClick={onClick} data-test="close">
    <IconClose size={16} />
  </Container>
);
