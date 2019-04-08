// @flow

import React, { Component, createRef } from "react";
import { FaCaretDown } from "react-icons/fa";
import styled from "styled-components";

import colors from "shared/colors";

import Box from "components/base/Box";
import Text from "components/base/Text";

type Props = {
  label: string,
  children: React$Node,
  RenderCollapsed?: React$ComponentType<*>,
  closeOnChange: any,
  isActive: boolean,
  width: number,
};

type State = {
  isOpened: boolean,
  pos: "left" | "right" | "unset",
  closeOnChangeRef: any,
};

const MENU_WIDTH = 400;
const GUTTER = 50;

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

    const resizeObserver = new ResizeObserver(this.measure);
    if (document.body) resizeObserver.observe(document.body);
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
    const { label, children, RenderCollapsed, isActive, width } = this.props;
    const { isOpened, pos } = this.state;
    return (
      <Box position="relative" ref={this.ref}>
        <InlineLabel
          onClick={this.toggle}
          isOpened={isOpened}
          isActive={isActive}
        >
          <Text small>
            {label}
            {isActive ? ": " : ""}
          </Text>
          {isActive && RenderCollapsed && <RenderCollapsed />}
          <FaCaretDown color={colors.mediumGrey} />
        </InlineLabel>
        {isOpened && (
          <Menu pos={pos} width={width}>
            {children}
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
  px: 10,
  position: "relative",
})`
  height: 40px;
  border: 1px solid;
  user-select: none;

  border-radius: 2px;
  border-color: ${p =>
    p.isOpened ? "#f0f0f0" : p.isActive ? "transparent" : "transparent"};
  border-bottom-color: ${p => (p.isOpened ? "white" : "")};
  z-index: ${p => (p.isOpened ? 30 : 0)};
  background-color: ${p => (p.isOpened ? "white" : "#fafafa")};

  &:hover {
    cursor: pointer;

    svg {
      fill: ${colors.shark};
    }
  }

  &:active {
    background-color: #efefef;
  }
`;

const Menu = styled(Box).attrs({
  position: "absolute",
  p: 10,
})`
  opacity: ${p => (p.pos === "unset" ? 0 : 1)};
  top: 100%;
  margin-top: -1px;
  left: ${p => (p.pos === "left" ? 0 : "auto")};
  right: ${p => (p.pos === "right" ? 0 : "auto")};
  width: ${p => p.width}px;
  background: white;
  border: 1px solid #f0f0f0;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  border-top-right-radius: 2px;
  box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.07);
  z-index: 20;
`;

export default WrappableField;