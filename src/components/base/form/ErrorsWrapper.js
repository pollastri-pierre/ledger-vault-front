// @flow

import React from "react";
import styled, { keyframes } from "styled-components";
import { FaTimes } from "react-icons/fa";

import colors from "shared/colors";

import Absolute from "components/base/Absolute";
import TranslatedError from "components/TranslatedError";
import Box from "components/base/Box";

const ErrorsWrapper = ({ bg, errors }: { bg?: string, errors?: Error[] }) =>
  errors ? (
    <Absolute top="100%" right={0}>
      <StyledErrorsWrapper bg={bg}>
        {errors.map(err => (
          <Box horizontal flow={5} align="center" key={err.message}>
            <FaTimes size={10} />
            <span>
              <TranslatedError error={err} field="description" />
            </span>
          </Box>
        ))}
      </StyledErrorsWrapper>
    </Absolute>
  ) : null;

const enter = keyframes`
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledErrorsWrapper = styled.div`
  background: ${p => p.bg || colors.form.error};
  color: white;
  padding: 5px 10px;
  margin-top: 10px;
  border-radius: 2px;
  font-size: 11px;
  line-height: 20px;
  box-shadow: ${colors.form.shadow.error};
  position: relative;
  z-index: 1;
  animation: 250ms ease ${enter};
`;

export default ErrorsWrapper;
