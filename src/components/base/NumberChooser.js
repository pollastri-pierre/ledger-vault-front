// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

import colors, { opacity, darken } from "shared/colors";

type Props = {
  value: number,
  onChange: number => void,
  min: number,
  max: number
};

class NumberChooser extends PureComponent<Props> {
  canDecrement = () => this.props.value > this.props.min;

  canIncrement = () => this.props.value < this.props.max;

  increment = () => this.props.onChange(this.props.value + 1);

  decrement = () => this.props.onChange(this.props.value - 1);

  render() {
    const { value, ...props } = this.props;
    return (
      <NumberChooserContainer {...props}>
        <NumberChooserAction
          isDisabled={!this.canDecrement()}
          onClick={this.decrement}
        >
          <FaAngleLeft />
        </NumberChooserAction>
        <NumberChooserValue>{value}</NumberChooserValue>
        <NumberChooserAction
          isDisabled={!this.canIncrement()}
          onClick={this.increment}
        >
          <FaAngleRight />
        </NumberChooserAction>
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
  pointer-events: ${p => (p.isDisabled ? "none" : "auto")};

  color: ${p => (p.isDisabled ? "#ddd" : opacity(colors.ocean, 0.5))};
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

  color: #888;
  font-size: 18px;
  font-weight: bold;
`;

export default NumberChooser;
