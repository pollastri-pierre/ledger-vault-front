// @flow
import styled from "styled-components";
import Box from "components/base/Box";
import React, { PureComponent } from "react";
import {
  FaFastBackward,
  FaFastForward,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import colors from "shared/colors";

type Props = {
  onChange: Function,
  page: number,
  count: number,
  pageSize: number,
};

function getSlice(nbPages, page) {
  const full = [...Array(nbPages).keys()].map(i => i + 1);
  const pageIndex = full.indexOf(page);

  // slightly ashamed of this ugly conditionnal. could certainly be refactored
  // in a more abstract and concise way. I mean. Maybe intern job.
  //
  // TL;DR: this is to handle the left & right edges.
  const offset =
    page === 1
      ? 0
      : page === 2
      ? -1
      : page === nbPages
      ? -4
      : page === nbPages - 1
      ? -3
      : -2;
  return full.slice(pageIndex + offset, pageIndex + offset + 5);
}

class Paginator extends PureComponent<Props> {
  render() {
    const { count, pageSize, page, onChange } = this.props;
    const nbPages = Math.ceil(count / pageSize);
    const pages = getSlice(nbPages, page);
    return (
      <Container>
        <ItemContainer disabled={page === 1} onClick={() => onChange(1)}>
          <FaFastBackward />
        </ItemContainer>
        <ItemContainer disabled={page === 1} onClick={() => onChange(page - 1)}>
          <FaChevronLeft />
        </ItemContainer>
        {pages.map(i => (
          <ItemContainer
            key={i}
            selected={i === page}
            onClick={() => onChange(i)}
          >
            {i}
          </ItemContainer>
        ))}
        <ItemContainer
          disabled={page === nbPages}
          onClick={() => onChange(page + 1)}
        >
          <FaChevronRight />
        </ItemContainer>
        <ItemContainer
          disabled={page === nbPages}
          onClick={() => onChange(nbPages)}
        >
          <FaFastForward />
        </ItemContainer>
      </Container>
    );
  }
}

const Container = styled.div`
  display: inline-flex;
  align-items: center;
`;

const ItemContainer = styled(Box).attrs({
  align: "center",
  justify: "center",
})`
  width: 30px;
  height: 30px;
  position: relative;
  user-select: none;
  border-radius: 2px;

  span {
    position: relative;
  }

  &:active {
    font-weight: bold;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: rgba(0, 0, 0, 0.6);
  }

  &:active {
    background: rgba(0, 0, 0, 0.1);
    color: rgba(0, 0, 0, 0.6);
  }

  ${({ selected, disabled }) => `
    color: ${
      selected
        ? colors.ocean
        : disabled
        ? "rgba(0, 0, 0, 0.1)"
        : "rgba(0, 0, 0, 0.35)"
    };
    font-weight: ${selected ? "bold" : "inherit"};
    cursor: ${selected ? "default" : "pointer"};
    pointer-events: ${selected || disabled ? "none" : "auto"};
  `}
`;
export default Paginator;
