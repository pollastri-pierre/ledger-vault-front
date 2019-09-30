// @flow

import React from "react";
import styled from "styled-components";

type Props = {
  size: number,
  style?: Object,
};
const Loader = (props: Props) => (
  <StyledLoader style={props.style} size={props.size} viewBox="0 0 50 50">
    <circle
      className="path"
      cx="25"
      cy="25"
      r="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
    />
  </StyledLoader>
);

const StyledLoader = styled.svg`
  animation: rotate 2s linear infinite;
  width: ${p => p.size}px;
  height: ${p => p.size}px;

  & .path {
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`;

export default Loader;
