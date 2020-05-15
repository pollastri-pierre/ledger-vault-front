// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";

import colors from "shared/colors";

import Absolute from "components/base/Absolute";
import Box from "components/base/Box";

import ErrorsWrapper from "components/base/form/ErrorsWrapper";
import HintsWrapper, { evalHints } from "components/base/form/HintsWrapper";
import type { InputProps, Icon, Alignment } from "components/base/form/types";

export type Props = InputProps<string> & {
  IconLeft?: React$ComponentType<Icon>,
  autoFocus?: boolean,
  maxLength?: number,
  onlyAscii?: boolean,
  align?: Alignment,
  grow?: boolean,
  inputRef?: *,
  onFocus?: () => void,
  onBlur?: () => void,
};

type State = {
  isFocused: boolean,
};

const isAscii = (c) => c.charCodeAt(0) <= 127;

class InputText extends PureComponent<Props, State> {
  state = {
    isFocused: !!this.props.autoFocus,
  };

  handleFocus = () => {
    this.props.onFocus && this.props.onFocus();
    this.setState(() => ({ isFocused: true }));
  };

  handleBlur = () => {
    this.props.onBlur && this.props.onBlur();
    this.setState(() => ({ isFocused: false }));
  };

  handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { onChange, maxLength, onlyAscii } = this.props;
    if (onChange) {
      let value = e.target.value;
      if (maxLength) {
        value = value.substr(0, maxLength);
      }
      if (onlyAscii) {
        value = value.split("").filter(isAscii).join("");
      }
      this.props.onChange(value);
    }
  };

  render() {
    const {
      value,
      IconLeft,
      errors,
      warnings,
      hints,
      align,
      grow,
      inputRef,
      ...props
    } = this.props;
    const { isFocused } = this.state;
    const enrichedHints = evalHints(hints, value);
    const hasError =
      (!!errors && !!errors.length) ||
      (enrichedHints && enrichedHints.some((h) => h.status === "invalid"));

    const hasWarning = !hasError && !!warnings && !!warnings.length;

    return (
      <Box position="relative" grow={grow}>
        {IconLeft && <IconWrapper Icon={IconLeft} isFocused={isFocused} />}
        <StyledInput
          // prevent LastPass autocomplete see https://stackoverflow.com/a/44984917
          data-lpignore="true"
          autoComplete="new-password"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          type="text"
          {...props}
          value={value}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          hasError={hasError}
          hasWarning={hasWarning}
          pl={IconLeft ? 28 : 0}
          align={align}
          ref={inputRef}
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
}

type IconWrapperProps = {
  Icon: React$ComponentType<Icon>,
  isFocused: boolean,
};

const IconWrapper = ({ Icon, isFocused }: IconWrapperProps) => (
  <Absolute left={0} top={0} bottom={0} center width={40}>
    <Icon color={isFocused ? colors.text : colors.form.placeholder} size={16} />
  </Absolute>
);

const StyledInput = styled.input`
  display: block;
  width: ${(p) => (p.width ? `${p.width}px` : "100%")};
  height: 40px;
  border-radius: 4px;
  text-align: ${(p) => p.align || "left"};
  border: 1px solid
    ${(p) =>
      p.hasError
        ? colors.form.error
        : p.hasWarning
        ? colors.form.warning
        : colors.form.border};
  padding-left: ${(p) => p.pl + 10}px;
  padding-right: 10px;

  svg {
    color: red;
  }

  &:focus {
    outline: none;
    border-color: ${(p) =>
      p.hasError
        ? colors.form.error
        : p.hasWarning
        ? colors.form.warning
        : colors.form.focus};
    box-shadow: ${(p) =>
      p.hasError
        ? colors.form.shadow.error
        : p.hasWarning
        ? colors.form.shadow.warning
        : colors.form.shadow.focus};
  }

  &:disabled {
    // taken from react-select style, so we are unified
    background: hsl(0, 0%, 95%);
  }

  ::placeholder {
    color: ${colors.form.placeholder};
  }
`;

export default InputText;
