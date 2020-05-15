// @flow

import React from "react";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";
import { FaSort, FaArrowDown, FaArrowUp } from "react-icons/fa";

import colors from "shared/colors";

export type Direction = "asc" | "desc" | null;
type Alignment = "left" | "right" | "center";

type Props = {
  label: React$Node,
  direction: Direction,
  align: Alignment,
  onClick: () => void,
};

const TableSortCell = (props: Props) => {
  const { label, align, onClick, direction } = props;

  const translate = getTranslate(direction);
  const animation = useSpring({ transform: `translateY(-${translate}px)` });

  const wrapperStyle = {
    ...styles.iconsWrapper,
    ...animation,
  };

  return (
    <Container align={align} onClick={onClick}>
      <span>{label}</span>
      <div style={styles.iconsContainer}>
        <animated.div style={wrapperStyle}>
          <div style={styles.icon}>
            <FaArrowUp color={colors.shark} />
          </div>
          <div style={styles.icon}>
            <FaSort color={colors.lightGrey} />
          </div>
          <div style={styles.icon}>
            <FaArrowDown color={colors.shark} />
          </div>
        </animated.div>
      </div>
    </Container>
  );
};

const translateByDirection = {
  asc: 0,
  desc: 32,
};

const getTranslate = (direction: Direction) =>
  direction ? translateByDirection[direction] : 16;

const styles = {
  iconsContainer: {
    position: "relative",
    width: 16,
    height: 16,
    overflow: "hidden",
  },
  iconsWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  icon: {
    width: 16,
    height: 16,
  },
};

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: ${(p) => (p.align !== "left" ? "row" : "row-reverse")};
  justify-content: flex-end;

  &:hover {
    cursor: pointer;
    color: ${colors.legacyDarkGrey4};
  }

  > * + * {
    margin-left: ${(p) => (p.align === "right" ? "2px" : "0")};
    margin-right: ${(p) => (p.align === "left" ? "2px" : "0")};
  }
`;

export default TableSortCell;
