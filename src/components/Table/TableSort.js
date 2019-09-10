// @flow

import React, { PureComponent } from "react";
import Animated from "animated/lib/targets/react-dom";
import noop from "lodash/noop";
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

type State = {
  anim: Animated.Value,
};

function getAnimByDirection(d: Direction) {
  return d === null ? 1 : d === "asc" ? 0 : 2;
}

class TableSortCell extends PureComponent<Props, State> {
  static defaultProps = {
    align: "left",
    onClick: noop,
  };

  componentDidUpdate(prevProps: Props) {
    const { direction } = this.props;
    const hasChangedDirection = prevProps.direction !== direction;
    if (hasChangedDirection) {
      Animated.spring(this.state.anim, {
        toValue: getAnimByDirection(direction),
      }).start();
    }
  }

  state = {
    anim: new Animated.Value(getAnimByDirection(this.props.direction)),
  };

  render() {
    const { label, align, onClick } = this.props;
    const { anim } = this.state;

    const wrapperStyle = {
      ...styles.iconsWrapper,
      transform: [
        {
          translateY: anim.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [0, -16, -32],
          }),
        },
      ],
    };
    return (
      <Container align={align} onClick={onClick}>
        <span>{label}</span>
        <div style={styles.iconsContainer}>
          <Animated.div style={wrapperStyle}>
            <div style={styles.icon}>
              <FaArrowUp color={colors.shark} />
            </div>
            <div style={styles.icon}>
              <FaSort color={colors.lightGrey} />
            </div>
            <div style={styles.icon}>
              <FaArrowDown color={colors.shark} />
            </div>
          </Animated.div>
        </div>
      </Container>
    );
  }
}
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
  flex-direction: ${p => (p.align === "left" ? "row-reverse" : "row")};
  justify-content: flex-end;

  &:hover {
    cursor: pointer;
    color: ${colors.legacyDarkGrey4};
  }

  > * + * {
    margin-left: ${p => (p.align === "right" ? "2px" : "0")};
    margin-right: ${p => (p.align === "left" ? "2px" : "0")};
  }
`;

export default TableSortCell;
