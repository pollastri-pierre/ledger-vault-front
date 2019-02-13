// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";

import Box from "components/base/Box";

type Props = {
  onClick: () => void,
  color?: string,
  children: React$Node
};

const Container = styled(Box).attrs({
  horizontal: true,
  px: 10,
  align: "center",
  justify: "center"
})`
  height: 60px;
  box-shadow: #333 0 -4px 0 inset;
  font-weight: bold;
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  &:active {
    background-color: rgba(0, 0, 0, 0.07);
  }
`;

class ModalFooterButton extends PureComponent<Props> {
  render() {
    const { onClick, color, children } = this.props;
    return (
      <Container color={color} onClick={onClick}>
        {children}
      </Container>
    );
  }
}

export default ModalFooterButton;
