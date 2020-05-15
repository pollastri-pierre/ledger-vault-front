// @flow

import React from "react";
import styled from "styled-components";

import colors from "shared/colors";

const HEADER_TEXT = {
  info: "Info",
  success: "Success",
  warning: "Warning",
  error: "Error",
};

type ToastType = "info" | "success" | "warning" | "error";

type ToastProps = {
  type: ToastType,
};

export default function Toast(props: ToastProps) {
  const { type } = props;
  const fg = colors.toast[type].fg;
  const bg = colors.toast[type].bg;
  return (
    <StyledContainer>
      <StyledHeader fg={fg} bg={bg}>
        {HEADER_TEXT[type]}
      </StyledHeader>
      <StyledBody>this is a toast</StyledBody>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  max-width: 350px;
  background: white;
  border-radius: 4px;
  box-shadow: ${colors.form.shadow.grey};
`;

const StyledHeader = styled.div`
  padding: 5px 10px;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  font-weight: bold;
  font-size: 11px;
  text-transform: uppercase;
  color: ${(p) => p.fg};
  background: ${(p) => p.bg};
`;

const StyledBody = styled.div`
  padding: 20px;
`;
