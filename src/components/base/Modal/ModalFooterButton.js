// @flow

import React, { useState } from "react";
import styled from "styled-components";
import CircularProgress from "@material-ui/core/CircularProgress";

import Absolute from "components/base/Absolute";

import { opacity } from "shared/colors";

const StyledModalFooterButton = styled.button.attrs(p => ({
  tabIndex: p.isDisabled || p.isLoading ? -1 : 0,
}))`
  display: flex;
  min-width: 50px;
  align-items: center;
  justify-content: center;
  font: inherit;
  height: 60px;
  padding: 0 15px;
  border: none;
  background-color: transparent;
  box-shadow: ${p => p.color} 0 -4px 0 inset;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  pointer-events: ${p => (p.isDisabled || p.isLoading ? "none" : "auto")};
  opacity: ${p => (p.isDisabled || p.isLoading ? 0.5 : 1)};

  color: ${p => p.color};

  &:hover {
    background-color: ${p => opacity(p.color, 0.05)};
  }
  &:active {
    background-color: ${p => opacity(p.color, 0.1)};
  }
  &:focus {
    outline: none;
  }
`;

type Props = {
  children: React$Node,
  onClick?: () => any | Promise<any>,
  isLoading?: boolean,
};

export default (props: Props) => {
  const { children, isLoading, onClick, ...p } = props;
  const [isLocalLoading, setIsLocalLoading] = useState(isLoading);

  const handleClick = () => {
    if (!onClick) return;
    const p = onClick();
    if (p && p.then) {
      setIsLocalLoading(true);
      p.finally(() => {
        setIsLocalLoading(false);
      });
    }
  };

  return (
    <StyledModalFooterButton
      isLoading={isLoading || isLocalLoading}
      onClick={handleClick}
      {...p}
    >
      {isLoading && (
        <Absolute top={0} left={0} right={0} bottom={0} center>
          <CircularProgress size={15} />
        </Absolute>
      )}
      <div style={{ opacity: isLoading ? 0 : 1 }}>{children}</div>
    </StyledModalFooterButton>
  );
};
