// @flow

import React from "react";
import styled from "styled-components";

import Absolute from "components/base/Absolute";
import colors from "shared/colors";

const DEFAULT_COLOR = colors.spinner;

const SIZES = {
  big: 40,
  normal: 16,
  small: 12,
};

const STROKE = 1;
type Size = $Keys<typeof SIZES>;

type Props = {
  size?: Size,
  color?: string,
};

export default function Spinner(props: Props) {
  const { size: sizeProp, color: colorProp } = props;
  const size = SIZES[sizeProp || "normal"];
  const spinnerPosition = size / 2;
  const spinnerSize = size / 2 - STROKE;
  const color = colorProp || DEFAULT_COLOR;
  return (
    <SpinnerContainer size={size}>
      <CircleStyle
        color={color}
        cx={spinnerPosition}
        cy={spinnerPosition}
        r={spinnerSize}
        fill="none"
        strokeWidth={STROKE}
        strokeMiterlimit="10"
      />
    </SpinnerContainer>
  );
}

export function SpinnerCentered(props: Props) {
  return (
    <Absolute top={0} left={0} right={0} bottom={0} center>
      <Spinner {...props} />
    </Absolute>
  );
}

const SpinnerContainer = styled.svg`
  height: ${p => p.size}px;
  width: ${p => p.size}px;
  animation: rotate 2s linear infinite;
  position: relative;
`;

const CircleStyle = styled.circle`
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  animation: dash 1.5s ease-in-out infinite;
  stroke-linecap: round;
  stroke: ${p => p.color};

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -124;
    }
`;
