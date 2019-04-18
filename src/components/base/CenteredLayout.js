// @flow

import styled from "styled-components";

import Box from "components/base/Box";

export default styled(Box).attrs({
  align: "center",
  justify: "center",
})`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: ${p => p.bg || "#f9f9f9"};
`;
