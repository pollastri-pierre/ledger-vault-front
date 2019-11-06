// @flow

import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { space, color } from "styled-system";
import Loader from "components/base/Loader";
import {
  getStyles,
  getFontSize,
  getButtonHeight,
  getPaddingX,
  getPaddingY,
  getLoaderSize,
} from "./helpers";

type ButtonType = "filled" | "outline" | "link";
type ButtonVariant = "primary" | "danger" | "warning" | "info";
type ButtonSize = "tiny" | "small" | "slim";

export type ButtonProps = {|
  children?: React$Node,
  type?: ButtonType,
  variant?: ButtonVariant,
  disabled?: boolean,
  onClick?: Function,
  size?: ButtonSize,
  circular?: boolean,
  "data-test"?: string,
  style?: Object,
|};

export const ButtonBase = styled.div.attrs(p => ({
  px: getPaddingX(p),
  py: getPaddingY(p),
  color: "grey",
  bg: "transparent",
  tabIndex: 0,
}))`
  ${space};
  ${color};
  font-size: ${p => getFontSize(p)}px;
  font-weight: bold;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${p => (p.circular ? "50%" : "2px")};
  cursor: ${p => (p.disabled ? "not-allowed" : "pointer")};
  opacity: ${p => (p.disabled ? "0.6" : "1")};
  pointer-events: ${p => (p.disabled || p.isLoading ? "none" : "auto")};
  text-decoration: ${p => (p.link ? "underline" : "none")};
  outline: none;
  height: ${p => getButtonHeight(p)}px;

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

function Button(props: ButtonProps, ref: any) {
  const isUnmounted = useRef(false);
  const { onClick, children, ...rest } = props;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    () => () => {
      isUnmounted.current = true;
    },
    [],
  );

  const handleClick = () => {
    if (!onClick) return;
    setIsLoading(true);
    Promise.resolve()
      .then(onClick)
      .catch(e => e)
      .finally(() => {
        if (isUnmounted.current === false) {
          setIsLoading(false);
        }
      });
  };

  return (
    <ButtonBase {...rest} isLoading={isLoading} onClick={handleClick} ref={ref}>
      <Container isLoading={isLoading}>{children}</Container>
      {isLoading && (
        <Loader size={getLoaderSize(props)} style={{ position: "absolute" }} />
      )}
    </ButtonBase>
  );
}

export default React.forwardRef<ButtonProps, typeof Button>(Button);

const Container = styled.div`
  opacity: ${p => (p.isLoading ? 0 : 1)};
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
`;
