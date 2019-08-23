// @flow
import React from "react";
import { FaSpinner } from "react-icons/fa";
import styled, { keyframes } from "styled-components";

import Box from "components/base/Box";
import colors from "shared/colors";

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
    position="relative"
    style={{
      height: HEIGHT,
      border: `1px solid ${colors.form.border}`,
      background: colors.form.bg,
      paddingLeft: indeterminate ? 20 : 0,
    }}
    p={2}
  >
    {indeterminate ? (
      <Spinner>
        <FaSpinner size={SPINNER_SIZE} />
      </Spinner>
    ) : progress ? (
      <>
        <Box
          position="absolute"
          style={{ left: "50%", color: "black", fontWeight: "bold" }}
        >
          {Math.round(progress)}%
        </Box>
        <Box
          align="center"
          justify="center"
          style={{
            width: `${progress}%`,
            height: HEIGHT,
            background: "rgba(0, 0, 0, 0.3)",
          }}
        />
      </>
    ) : null}
  </Box>
);

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
