// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

import colors, { opacity, darken } from "shared/colors";

type Props = {
  value: number,
  onChange: (number) => void,
  min: number,
  max: number,
  readOnly?: boolean,
};

class NumberChooser extends PureComponent<Props> {
  canDecrement = () => this.props.value > this.props.min;

  canIncrement = () => this.props.value < this.props.max;

  increment = () => this.props.onChange(this.props.value + 1);

  decrement = () => this.props.onChange(this.props.value - 1);

  render() {
    const { value, readOnly, ...props } = this.props;
    return (
      <NumberChooserContainer {...props}>
        {!readOnly && (
          <NumberChooserAction
            isDisabled={!this.canDecrement()}
            onClick={this.decrement}
          >
            <FaAngleLeft data-test="leftAngle" />
          </NumberChooserAction>
        )}
        <NumberChooserValue>{value}</NumberChooserValue>
        {!readOnly && (
          <NumberChooserAction
            isDisabled={!this.canIncrement()}
            onClick={this.increment}
          >
            <FaAngleRight data-test="rightANgle" />
          </NumberChooserAction>
        )}
      </NumberChooserContainer>
    );
  }
}

const NumberChooserContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  width: 80px;
  user-select: none;
`;

const NumberChooserAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 30px;
  pointer-events: ${(p) => (p.isDisabled ? "none" : "auto")};

  color: ${(p) =>
    p.isDisabled ? colors.legacyLightGrey7 : opacity(colors.ocean, 0.5)};
  &:hover {
    cursor: pointer;
    color: ${colors.ocean};
  }
  &:active {
    color: ${darken(colors.ocean, 0.2)};
  }
`;

const NumberChooserValue = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;

  color: ${colors.legacyDarkGrey2};
  font-size: 18px;
  font-weight: bold;
`;

export default NumberChooser;
