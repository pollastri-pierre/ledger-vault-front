// @flow

import React, { useCallback } from "react";
import styled from "styled-components";
import colors from "shared/colors";

type SwitchProps = {|
  value: boolean,
  onChange?: (boolean) => any,
  disabled?: boolean,
|};

const ENTER_KEYCODE = 13;
const Switch = ({ value, onChange, disabled }: SwitchProps) => {
  const onToggle = useCallback(
    () => !disabled && onChange && onChange(!value),
    [disabled, onChange, value],
  );

  const onEnterKeyDown = useCallback(
    (event) => {
      const { keyCode } = event;

      if (keyCode === ENTER_KEYCODE) {
        onToggle();
      }
    },
    [onToggle],
  );

  return (
    <SwitchContainer
      disabled={disabled}
      tabIndex={disabled ? undefined : 0}
      onClick={onToggle}
      onKeyDown={onEnterKeyDown}
      value={value}
    >
      <Round value={value} />
    </SwitchContainer>
  );
};

const SwitchContainer = styled.div`
  cursor: pointer;
  opacity: ${(p) => (p.disabled ? 0.5 : 1)};
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
  background: ${(p) => (p.value ? colors.white : colors.mouse)};
  border-radius: 30px;
  border: 1px solid ${(p) => (p.value ? colors.bLive : "transparent")};
  &:focus {
    border-color: ${colors.form.focus};
    outline: none;
    box-shadow: ${colors.form.shadow.focus};
  }
`;

const Round = styled.div`
  border-radius: 50%;
  background: ${(p) => (p.value ? colors.bLive : colors.switchRoundUnCheck)};
  position: absolute;
  height: 18px;
  width: 18px;
  transform: translateX(${(p) => (p.value ? "16px" : "0")});
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
  transition: 150ms ease-in-out transform;
  bottom: 2px;
  left: 2px;
`;

export default Switch;
