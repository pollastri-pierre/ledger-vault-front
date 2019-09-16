// @flow
import React from "react";
import { FaSpinner } from "react-icons/fa";
import styled, { keyframes } from "styled-components";

import Box from "components/base/Box";
import colors, { opacity } from "shared/colors";

const SPINNER_SIZE = 15;
const HEIGHT = 40;

export default ({
  progress,
  indeterminate,
}: {
  progress?: number,
  indeterminate?: boolean,
}) => (
  <Box
    justify="center"
    align="center"
    position="relative"
    style={{
      height: HEIGHT,
      border: `1px solid ${colors.form.border}`,
      borderRadius: 4,
      background: colors.form.bg,
    }}
    p={2}
  >
    {indeterminate || progress === 0 ? (
      <Spinner>
        <FaSpinner size={SPINNER_SIZE} />
      </Spinner>
    ) : progress ? (
      <>
        <Percent>{Math.round(progress * 100)}%</Percent>
        <Bar style={{ transform: `scaleX(${progress})` }} />
      </>
    ) : null}
  </Box>
);

const Percent = styled.div`
  font-weight: bold;
  color: ${colors.lead};
`;

const Bar = styled.div`
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  transform-origin: center left;
  background: ${opacity(colors.ocean, 0.2)};
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  animation: ${rotate} 500ms linear infinite;
  display: flex;
  width: ${SPINNER_SIZE - 1}px;
`;
