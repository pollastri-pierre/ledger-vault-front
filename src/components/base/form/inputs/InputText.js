// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";

import colors from "shared/colors";

import Absolute from "components/base/Absolute";
import Box from "components/base/Box";

import ErrorsWrapper from "components/base/form/ErrorsWrapper";
import type { InputProps } from "components/base/form/types";

type Icon = {
  size?: number,
  color?: string,
};

type Alignment = "left" | "right";

type Props = InputProps<string> & {
  IconLeft?: React$ComponentType<Icon>,
  label: string,
  autoFocus?: boolean,
  maxLength?: number,
  onlyAscii?: boolean,
  align?: Alignment,
  grow?: boolean,
  inputRef?: *,
};

type State = {
  isFocused: boolean,
};

const isAscii = c => c.charCodeAt(0) <= 127;

class InputText extends PureComponent<Props, State> {
  state = {
    isFocused: !!this.props.autoFocus,
  };

  handleFocus = () => this.setState(() => ({ isFocused: true }));

  handleBlur = () => this.setState(() => ({ isFocused: false }));

  handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { onChange, maxLength, onlyAscii } = this.props;
    if (onChange) {
      let value = e.target.value;
      if (maxLength) {
        value = value.substr(0, maxLength);
      }
      if (onlyAscii) {
        value = value
          .split("")
          .filter(isAscii)
          .join("");
      }
      this.props.onChange(value);
    }
  };

  render() {
    const {
      IconLeft,
      errors,
      warnings,
      align,
      grow,
      inputRef,
      ...props
    } = this.props;
    const { isFocused } = this.state;
    const hasError = !!errors && !!errors.length;
    const hasWarning = !hasError && !!warnings && !!warnings.length;
    return (
      <Box position="relative" grow={grow}>
        <IconWrapper left={13} top={12} Icon={IconLeft} isFocused={isFocused} />
        <StyledInput
          // this prevents chrome to autocomplete... https://bugs.chromium.org/p/chromium/issues/detail?id=370363#c7
          autoComplete="new-password"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          {...props}
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
          </>
        )}
      </Box>
    );
  }
}

type IconWrapperProps = {
  top?: number,
  left?: number,
  Icon?: React$ComponentType<Icon>,
  isFocused: boolean,
};

const IconWrapper = ({ top, left, Icon, isFocused }: IconWrapperProps) =>
  Icon ? (
    <Absolute left={left} top={top}>
      <Icon
        size={16}
        color={isFocused ? colors.text : colors.form.placeholder}
      />
    </Absolute>
  ) : null;

const StyledInput = styled.input`
  display: block;
  width: ${p => (p.width ? `${p.width}px` : "100%")};
  height: 40px;
  border-radius: 4px;
  text-align: ${p => (p.align === "right" ? "right" : "left")};
  border: 1px solid
    ${p =>
      p.hasError
        ? colors.form.error
        : p.hasWarning
        ? colors.form.warning
        : colors.form.border};
  padding-left: ${p => p.pl + 10}px;
  padding-right: 10px;

  svg {
    color: red;
  }

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

  ::placeholder {
    color: ${colors.form.placeholder};
  }
`;

export default InputText;
