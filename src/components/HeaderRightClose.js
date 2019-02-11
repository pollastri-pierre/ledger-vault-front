// @flow

import React from "react";
import styled from "styled-components";

import Close from "components/icons/Close";
import colors from "shared/colors";

const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 25px;
  cursor: pointer;
  color: ${colors.lead};
  line-height: 1;
  &:hover {
    color: ${colors.steel};
  }
  &:active {
    color: ${colors.shark};
  }
`;

export default ({ close }: { close: () => void }) => (
  <Container onClick={close}>
    <Close size={14} />
  </Container>
);
