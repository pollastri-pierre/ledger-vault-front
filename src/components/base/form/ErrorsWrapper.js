// @flow

import React from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";

import colors, { opacity } from "shared/colors";

import Absolute from "components/base/Absolute";
import Box from "components/base/Box";

const ErrorsWrapper = ({ bg, errors }: { bg?: string, errors?: Error[] }) =>
  errors ? (
    <Absolute top="100%" right={0}>
      <StyledErrorsWrapper bg={bg}>
        {errors.map(err => (
          <Box horizontal flow={5} align="center" key={err.message}>
            <FaTimes size={10} />
            <span>{err.message}</span>
          </Box>
        ))}
      </StyledErrorsWrapper>
    </Absolute>
  ) : null;

const StyledErrorsWrapper = styled.div`
  background: ${p => p.bg || colors.form.error};
  border-radius: 2px;
  margin-top: 10px;
  color: white;
  padding: 10px;
  font-size: 11px;
  line-height: 20px;
  box-shadow: ${opacity(colors.form.error, 0.07)} 0 2px 5px 2px;
`;

export default ErrorsWrapper;
