// @flow

import React from "react";
import styled, { keyframes } from "styled-components";

import colors from "shared/colors";

import Box from "components/base/Box";
import Text from "components/base/Text";

import type { Hint } from "components/base/form/types";

type Props = {
  hints: ?(Hint[]),
  value: string,
};

function HintsWrapper(props: Props) {
  const { hints, value } = props;
  if (!hints) return null;
  return (
    <HintsWrap>
      <HintsContainer>
        {hints.map(hint => {
          const { label, check, key } = hint;

          const displayedLabel =
            typeof label === "function" ? label(value) : label;

          const status = value
            ? check(value)
              ? "valid"
              : "invalid"
            : "unchecked";

          return (
            <Box position="relative" key={key} horizontal flow={5} noShrink>
              <Ball status={status} />
              <Text
                small
                color={status === "unchecked" ? colors.textLight : undefined}
              >
                {displayedLabel}
              </Text>
            </Box>
          );
        })}
      </HintsContainer>
    </HintsWrap>
  );
}

const enter = keyframes`
  from {
    opacity: 0;
    transform: translateX(-5px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const HintsContainer = styled.div`
  padding: 10px 20px;
  max-width: 200px;
  position: relative;
  left: 100%;
  margin-left: 10px;
  background: white;
  border: 1px solid ${colors.form.border};
  border-radius: 4px;
  // box-shadow: ${colors.form.shadow.grey};
  animation: 250ms ease ${enter};
  white-space: nowrap;
  pointer-events: auto;
`;

const HintsWrap = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  pointer-events: none;
`;

const Ball = styled.div`
  position: absolute;
  top: 7px;
  left: -8px;
  background: ${p =>
    p.status === "unchecked"
      ? colors.textLight
      : p.status === "valid"
      ? colors.ocean
      : colors.grenade};
  width: 5px;
  height: 5px;
  border-radius: 50%;
`;

export default HintsWrapper;
