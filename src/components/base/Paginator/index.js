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

const MAX_DISPLAYED_PAGES = 5;
/**
 * This function eventually slices the total pages to ensure we don't display
 * more pages items than we want. Also, it tries to "center" the active page
 * if possible.
 *
 * examples with 5 max displayed pages:
 *
 *    < [1] 2  3  4  5  >
 *    <  1 [2] 3  4  5  >
 *    <  1  2 [3] 4  5  >
 *    <  2  3 [4] 5  6  >
 *    <  2  3  4 [5] 6  >
 *    <  2  3  4  5 [6] >
 */
export function getPages(nbPages: number, page: number, maxDisplayed: number) {
  if (maxDisplayed % 2 === 0) {
    throw new Error("Max displayed pages should be even");
  }
  const full: number[] = [...Array(nbPages).keys()].map<number>(i => i + 1);
  if (nbPages <= maxDisplayed) return full;
  const index = page - 1;
  const center = Math.floor(maxDisplayed / 2);
  let offset = index - center;
  if (index + center > maxDisplayed) offset = nbPages - maxDisplayed;
  if (offset < 0) offset = 0;
  const slice: number[] = full.slice(offset, offset + maxDisplayed);
  return slice;
}

class Paginator extends PureComponent<Props> {
  render() {
    const { count, pageSize, page, onChange } = this.props;
    const nbPages = Math.ceil(count / pageSize);
    const pages = getPages(nbPages, page, MAX_DISPLAYED_PAGES);
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
        ? colors.blue
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
