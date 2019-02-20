// @flow

import React from "react";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { FaPlus } from "react-icons/fa";

const Container = styled.div`
  position: absolute;
  top: 20px;
  right: 40px;
`;

export default ({
  onClick,
  children
}: {
  onClick: () => void,
  children: *
}) => (
  <Container>
    <Button onClick={onClick} color="primary" variant="outlined">
      <FaPlus style={{ marginRight: 10 }} />
      {children}
    </Button>
  </Container>
);
