// @flow

import React from "react";
import styled from "styled-components";
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from "react-icons/md";

const ICON_SIZE = 24;

type RadioProps = {
  checked: boolean,
  size?: number,
};
export default ({ checked, size = ICON_SIZE }: RadioProps) => {
  return (
    <RadioButtonContainer size={size}>
      {checked ? (
        <MdRadioButtonChecked size={size} />
      ) : (
        <MdRadioButtonUnchecked size={size} />
      )}
    </RadioButtonContainer>
  );
};

const RadioButtonContainer = styled.div`
  height: ${p => p.size}px;
  width: ${p => p.size}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
