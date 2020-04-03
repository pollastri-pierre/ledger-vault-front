// @flow

import React, { useState } from "react";
import styled from "styled-components";

import Box from "components/base/Box";
import colors from "shared/colors";

import type { InputProps } from "components/base/form/types";

import ErrorsWrapper from "components/base/form/ErrorsWrapper";
import HintsWrapper, { evalHints } from "components/base/form/HintsWrapper";

type TextAreaProps = InputProps<string> & {
  autoFocus?: boolean,
  onlyAscii?: boolean,
  grow?: boolean,
  onFocus?: () => void,
  onBlur?: () => void,
};
const isAscii = c => c.charCodeAt(0) <= 127;

export default function TextArea(props: TextAreaProps) {
  const {
    value,
    errors,
    warnings,
    hints,
    autoFocus,
    grow,
    onFocus,
    onBlur,
    onChange,
    onlyAscii,
  } = props;

  const [isFocused, setIsFocused] = useState(!!autoFocus);
  const enrichedHints = evalHints(hints, value);
  const hasError =
    (!!errors && !!errors.length) ||
    (enrichedHints && enrichedHints.some(h => h.status === "invalid"));

  const hasWarning = !hasError && !!warnings && !!warnings.length;

  const handleFocus = () => {
    onFocus && onFocus();
    setIsFocused(true);
  };

  const handleBlur = () => {
    onBlur && onBlur();
    setIsFocused(false);
  };

  const handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    if (onChange) {
      let value = e.target.value;
      if (onlyAscii) {
        value = value
          .split("")
          .filter(isAscii)
          .join("");
      }
      onChange(value);
    }
  };

  return (
    <Box position="relative" grow={grow}>
      <StyledTextarea
        {...props}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        hasError={hasError}
        hasWarning={hasWarning}
      />
      {isFocused && (
        <>
          <ErrorsWrapper errors={errors} />
          <ErrorsWrapper
            errors={hasWarning ? warnings : undefined}
            bg={colors.form.warning}
          />
          <HintsWrapper hints={enrichedHints} value={value} />
        </>
      )}
    </Box>
  );
}

const StyledTextarea = styled.textarea`
  font: inherit;
  box-sizing: border-box;
  border-radius: 4px;
  overflow: auto;
  font-size: 13px;
  padding: 10px;
  border: 1px solid
    ${p =>
      p.hasError
        ? colors.form.error
        : p.hasWarning
        ? colors.form.warning
        : colors.form.border};
  &:focus {
    outline: none;
    border-color: ${p =>
      p.hasError
        ? colors.form.error
        : p.hasWarning
        ? colors.form.warning
        : colors.form.focus};
    box-shadow: ${p =>
      p.hasError
        ? colors.form.shadow.error
        : p.hasWarning
        ? colors.form.shadow.warning
        : colors.form.shadow.focus};
  }
  }
  ::placeholder {
    color: ${colors.form.placeholder};
    font-size: 13px;
  }
`;
