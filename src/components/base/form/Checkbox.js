// @flow

import React from "react";
import styled from "styled-components";
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";

type CheckboxProps = {
  checked: boolean,
};

const ICON_SIZE = 24;
export default ({ checked }: CheckboxProps) => {
  return (
    <CheckBoxContainer>
      {checked ? (
        <MdCheckBoxOutlineBlank size={ICON_SIZE} />
      ) : (
        <MdCheckBox size={ICON_SIZE} />
      )}
    </CheckBoxContainer>
  );
};

const CheckBoxContainer = styled.div`
  height: 36px;
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
