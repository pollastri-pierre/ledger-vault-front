// @flow

import React, { useState } from "react";
import styled from "styled-components";
import { space, color } from "styled-system";
import Loader from "components/base/Loader";
import Box from "components/base/Box";
import { getStyles } from "./helpers";

type ButtonType = "filled" | "outline" | "link";
type ButtonVariant = "primary" | "danger" | "warning" | "info";

export type ButtonProps = {
  children?: React$Node,
  type?: ButtonType,
  variant?: ButtonVariant,
  disabled?: boolean,
  onClick?: Function,
  small?: boolean,
  circular?: boolean,
};

export const ButtonBase = styled.div.attrs(p => ({
  px: p.circular ? 12 : p.small ? 16 : 25,
  py: p.circular ? 12 : p.small ? 5 : 8,
  color: "grey",
  bg: "transparent",
  tabIndex: 0,
}))`
  ${space};
  ${color};
  font-size: ${p => p.fontSize || (p.small ? "11px" : "13px")};
  font-weight: bold;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${p => (p.circular ? "50%" : "2px")};
  cursor: ${p => (p.disabled ? "not-allowed" : "pointer")};
  pointer-events: ${p => (p.disabled || p.isLoading ? "none" : "auto")};
  text-decoration: ${p => (p.link ? "underline" : "none")};
  outline: none;
  height: ${p => (!p.circular ? (p.small ? "30px" : "40px") : "inherit")};

  ${p => getStyles(p, "default")};

  &:hover {
    ${p => getStyles(p, "hover")};
  }
  &:focus {
    ${p => getStyles(p, "focus")};
  }
  &:active {
    ${p => getStyles(p, "active")};
  }
`;

export default function Button(props: ButtonProps) {
  const { onClick, children, small, ...rest } = props;
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    if (!onClick) return;
    setIsLoading(true);
    Promise.resolve()
      .then(onClick)
      .catch(e => e)
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <ButtonBase
      {...rest}
      small={small}
      isLoading={isLoading}
      onClick={handleClick}
    >
      <Container isLoading={isLoading}>{children}</Container>
      {isLoading && (
        <Loader size={small ? 12 : 16} style={{ position: "absolute" }} />
      )}
    </ButtonBase>
  );
}

const Container = styled(Box)`
  opacity: ${p => (p.isLoading ? 0 : 1)};
`;
