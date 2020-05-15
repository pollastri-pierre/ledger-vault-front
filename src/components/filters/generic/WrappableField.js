// @flow

import React, { Component, createRef } from "react";
import { FaCaretDown } from "react-icons/fa";
import styled from "styled-components";

import colors, { opacity } from "shared/colors";

import Box from "components/base/Box";
import Text from "components/base/Text";

type Props = {
  label: string,
  children: React$Node,
  RenderCollapsed?: React$ComponentType<*>,
  closeOnChange: any,
  isActive: boolean,
  width: number,
  labelWidth?: number,
  inPlace?: boolean,
};

type State = {
  isOpened: boolean,
  pos: "left" | "right" | "unset",
  closeOnChangeRef: any,
};

const MENU_WIDTH = 400;
const GUTTER = 50;
const ACTIVE_COLOR = opacity(colors.blue, 0.1);

class WrappableField extends Component<Props, State> {
  static defaultProps = {
    width: MENU_WIDTH,
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const patch = {};
    if (state.closeOnChangeRef !== props.closeOnChange) {
      patch.isOpened = false;
    }
    patch.closeOnChangeRef = props.closeOnChange;
    return patch;
  }

  state = {
    isOpened: false,
    pos: "unset",
    closeOnChangeRef: this.props.closeOnChange,
  };

  componentDidMount() {
    this.measure();

    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(this.measure);
      if (document.body) resizeObserver.observe(document.body);
    }
  }

  componentWillUnmount() {
    this.unsubscribeClick();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const didOpened = this.state.isOpened && !prevState.isOpened;
    const didClosed = !this.state.isOpened && prevState.isOpened;
    if (didOpened) {
      this.subscribeClick();
      this.measure();
    }
    if (didClosed) {
      this.unsubscribeClick();
    }
  }

  measure = () => {
    const {
      ref: { current },
    } = this;
    if (current) {
      const rect = current.getBoundingClientRect();
      const inWindow = rect.x + this.props.width + GUTTER < window.innerWidth;
      const { pos: prevPos } = this.state;
      const pos = inWindow ? "left" : "right";
      if (pos !== prevPos) this.setState({ pos });
    }
  };

  subscribeClick = () => {
    document.body && document.body.addEventListener("click", this.clickOutside);
  };

  unsubscribeClick = () => {
    document.body &&
      document.body.removeEventListener("click", this.clickOutside);
  };

  clickOutside = (e: MouseEvent) => {
    const {
      ref: { current },
    } = this;
    if (current && !current.contains(e.target)) {
      this.setState({ isOpened: false });
    }
  };

  toggle = () => {
    this.setState(({ isOpened }) => ({ isOpened: !isOpened }));
  };

  ref: any = createRef();

  render() {
    const {
      label,
      children,
      RenderCollapsed,
      isActive,
      width,
      labelWidth,
      inPlace,
    } = this.props;
    const { isOpened, pos } = this.state;
    const renderChildren = () =>
      typeof children === "function"
        ? children({ toggle: this.toggle })
        : children;

    const inner =
      isOpened && inPlace ? (
        <div style={{ width: width || 250 }}>{renderChildren()}</div>
      ) : (
        <InlineLabel
          onClick={this.toggle}
          isOpened={isOpened}
          isActive={isActive}
          width={inPlace ? width || undefined : labelWidth || undefined}
        >
          <Box horizontal align="center" overflow="hidden" flow={5} grow>
            <Text
              fontWeight={isActive ? "bold" : null}
              noWrap
              style={{ flexShrink: 0 }}
            >
              {label}
              {isActive ? ": " : ""}
            </Text>
            {isActive && RenderCollapsed && <RenderCollapsed />}
          </Box>
          <div style={styles.noShrink}>
            <FaCaretDown data-role="chevron" color={colors.mediumGrey} />
          </div>
        </InlineLabel>
      );
    const borderColor = isActive && !isOpened ? ACTIVE_COLOR : colors.argile;
    return (
      <Box
        position="relative"
        borderRadius={4}
        bg={isActive && !isOpened ? ACTIVE_COLOR : colors.white}
        ref={this.ref}
        style={{
          border: `1px solid ${borderColor}`,
          borderTop: isOpened && inPlace ? "none" : `1px solid ${borderColor}`,
          borderBottom:
            isOpened && inPlace
              ? "none"
              : `1px solid ${isOpened ? "transparent" : borderColor}`,
          borderBottomLeftRadius: !inPlace && isOpened ? 0 : 4,
          borderBottomRightRadius: !inPlace && isOpened ? 0 : 4,
        }}
      >
        {inner}
        {isOpened && !inPlace && (
          <Menu pos={pos} width={width}>
            {renderChildren()}
          </Menu>
        )}
      </Box>
    );
  }
}

const InlineLabel = styled(Box).attrs({
  horizontal: true,
  flow: 5,
  align: "center",
  color: colors.shark,
  position: "relative",
})`
  user-select: none;
  max-width: 400px;
  min-height: 38px;
  padding: 5px 10px;

  border-bottom: ${(p) => (p.isOpened ? "1px solid white" : "none")};
  border-bottom-left-radius: ${(p) => (p.isOpened ? 0 : "4px")};
  border-bottom-right-radius: ${(p) => (p.isOpened ? 0 : "4px")};
  z-index: ${(p) => (p.isOpened ? 30 : 0)};
  transition: 100ms linear background-color;
  pointer-events: ${(p) => (p.interactive === false ? "none" : "auto")};
  opacity: ${(p) => (p.interactive === false ? 0.7 : 1)};

  &:hover {
    cursor: pointer;

    svg[data-role="chevron"] {
      fill: ${colors.shark};
    }
  }

  &:active {
    background-color: ${colors.legacyLightGrey2};
  }
`;

const Loading = styled(InlineLabel)`
  min-height: 40px;
  border: 1px solid;
  border-radius: 4px;
  border-color: ${colors.legacyLightGrey1};
  background-color: ${colors.legacyLightGrey2};
`;

const Menu = styled(Box).attrs({
  position: "absolute",
  p: 10,
})`
  opacity: ${(p) => (p.pos === "unset" ? 0 : 1)};
  top: 100%;
  margin-top: -1px;
  left: ${(p) => (p.pos === "left" ? "-1px" : "auto")};
  right: ${(p) => (p.pos === "right" ? "-1px" : "auto")};
  width: ${(p) => p.width}px;
  background: ${colors.white};
  border: 1px solid ${colors.legacyLightGrey1};
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-top-right-radius: 2px;
  box-shadow: 0 3px 3px 0 ${colors.legacyTranslucentGrey1};
  z-index: 20;
`;

const styles = {
  noShrink: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export const WrappableFieldLoading = ({ width }: { width: number }) => (
  <Loading interactive={false} style={{ width }}>
    Loading...
  </Loading>
);

export default WrappableField;
