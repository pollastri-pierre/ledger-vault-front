// @flow

import styled from "styled-components";

import { opacity } from "shared/colors";

export default styled.button.attrs(p => ({
  tabIndex: p.isDisabled ? -1 : 0,
}))`
  display: flex;
  align-items: center;
  justify-content: center;
  font: inherit;
  height: 60px;
  padding: 0 10px;
  border: none;
  background-color: transparent;
  box-shadow: ${p => p.color} 0 -4px 0 inset;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
  pointer-events: ${p => (p.isDisabled ? "none" : "auto")};
  opacity: ${p => (p.isDisabled ? 0.5 : 1)};

  color: ${p => p.color};

  &:hover {
    background-color: ${p => opacity(p.color, 0.05)};
  }
  &:active {
    background-color: ${p => opacity(p.color, 0.1)};
  }
  &:focus {
    outline: none;
    background-color: ${p => opacity(p.color, 0.1)};
  }
`;
