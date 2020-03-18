// @flow

import React from "react";
import styled, { keyframes } from "styled-components";

import colors from "shared/colors";

const bubble = keyframes`
  50% {
    transform: scale(1.5, 1.5);
    opacity: 0;
  }
  99% {
    transform: scale(0.001, 0.001);
    opacity: 0;
  }
  100% {
    transform: scale(0.001, 0.001);
    opacity: 1;
  }
`;

const bubble2 = keyframes`
  50% {
    transform: scale(2, 2);
    opacity: 0;
  }
  99% {
    transform: scale(0.001, 0.001);
    opacity: 0;
  }
  100% {
    transform: scale(0.001, 0.001);
    opacity: 1;
  }
`;

export default () => (
  <Container>
    <Outer />
    <Inner />
  </Container>
);

const Container = styled.div`
  position: relative;
`;

const Outer = styled.div`
  position: absolute;
  top: -20px;
  left: -20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${colors.bLive};
  opacity: 0.5;
  position: relative;

  animation: 1.5s ${bubble} ease-out infinite;
`;

const Inner = styled.div`
  position: absolute;
  top: -10px;
  left: -10px;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  background: ${colors.bLive};
  opacity: 0.5;
  animation: 1.5s ${bubble2} ease-out infinite;
`;
