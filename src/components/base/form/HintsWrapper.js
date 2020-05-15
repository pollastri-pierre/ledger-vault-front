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
  if (!hints || !hints.length) return null;
  return (
    <HintsWrap>
      <HintsContainer>
        {hints.map((hint) => {
          const { label, key, status } = hint;

          const displayedLabel =
            typeof label === "function" ? label(value) : label;

          return (
            <Box position="relative" key={key} horizontal flow={5} noShrink>
              <Ball status={status} />
              <Text
                size="small"
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

export function evalHints(hints: ?(Hint[]), value: string): Hint[] {
  if (!hints) return [];
  return hints.map((hint) => ({
    ...hint,
    status: value ? (hint.check(value) ? "valid" : "invalid") : "unchecked",
  }));
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
  top: 5px;
  background: white;
  border: 1px solid ${colors.form.border};
  border-radius: 4px;
  box-shadow: ${colors.form.shadow.grey};
  animation: 250ms ease ${enter};
  white-space: nowrap;
  pointer-events: auto;
  text-align: left;
`;

const HintsWrap = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  pointer-events: none;
  z-index: 2;
`;

const Ball = styled.div`
  position: absolute;
  top: 7px;
  left: -8px;
  background: ${(p) =>
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
