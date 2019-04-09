// @flow

import React, { PureComponent, Fragment } from "react";
import Animated from "animated/lib/targets/react-dom";
import Easing from "animated/lib/Easing";
import styled from "styled-components";
import { createPortal } from "react-dom";

import Box, { px } from "components/base/Box";
import Text from "components/base/Text";
import ModalClose from "./ModalClose";

const modalsContainer = document.createElement("div");
modalsContainer.classList.add("modals-container");
const modalRoot = document.body && document.body.appendChild(modalsContainer);

const animShowHide = {
  duration: 200,
  easing: Easing.bezier(0.3, 1.0, 0.5, 0.8),
};

const ModalDialog = styled(Box)`
  min-height: 200px;
`;

const ModalDialogInner = styled(Box).attrs({ bg: "white" })`
  position: relative;
  margin-bottom: 40px;
  margin-top: 40px;
  border-radius: 4px;
  flex-shrink: 0;
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.04),
    0px 24px 38px 3px rgba(0, 0, 0, 0.04), 0px 9px 46px 8px rgba(0, 0, 0, 0.04);
`;

export const ModalBreadcrumb = styled(Box).attrs({
  bg: "#f5f5f5",
  pb: 100,
  width: 100,
  p: 20,
})`
  user-select: none;
  flex-shrink: 0;
  font-size: 11px;
`;

export const ModalFooter = styled(Box).attrs(p => ({
  position: "absolute",
  horizontal: true,
  justify: p.justify || "flex-end",
  align: p.align || "flex-end",
  px: 40,
}))`
  bottom: 0;
  left: 0;
  right: 0;
`;

const ModalBodyRaw = styled(Box).attrs({
  p: 40,
  pb: 100,
})`
  height: ${p => ("height" in p ? px(p.height) : "auto")};
`;

export const ModalBody = ({
  children,
  onClose,
  ...props
}: {
  children: React$Node,
  onClose?: () => void,
}) => (
  <ModalBodyRaw width={500} {...props}>
    {onClose ? <ModalClose onClick={onClose} /> : null}
    {children}
  </ModalBodyRaw>
);

export const ModalHeader = styled(Box).attrs({
  mb: 30,
})`
  flex-shrink: 0;
`;

export const ModalTitle = ({
  children,
  ...props
}: {
  children: React$Node,
}) => (
  <Box mb={20} {...props}>
    <Text header>{children}</Text>
  </Box>
);

type Props = {
  isOpened: boolean,
  children: React$Node,
  onHide?: () => void,
  onClose?: () => void,
  disableBackdropClick?: boolean,
};

type State = {
  isInDOM: boolean,
  animShowHide: Animated.Value,
};

class Modal extends PureComponent<Props, State> {
  static defaultProps = {
    centered: true,
  };

  state = {
    isInDOM: false,
    animShowHide: new Animated.Value(0),
  };

  static getDerivedStateFromProps = (props: Props, state: State) => ({
    isInDOM: state.isInDOM || props.isOpened,
  });

  componentDidMount() {
    if (this.props.isOpened) {
      this.animateEnter();
    }

    this.state.animShowHide.addListener(({ value }) => {
      if (value === 0) {
        const { onHide } = this.props;
        this.setState({ isInDOM: false });
        if (onHide) {
          onHide();
        }
      }
      if (value === 1) this.setState({ isInDOM: true });
    });
  }

  componentDidUpdate(prevProps: Props) {
    const didOpened = !prevProps.isOpened && this.props.isOpened;
    const didClosed = prevProps.isOpened && !this.props.isOpened;

    if (didOpened) {
      this.animateEnter();
    }

    if (didClosed) {
      this.animateLeave();
    }
  }

  animateEnter = () => {
    window.requestAnimationFrame(() => {
      Animated.timing(this.state.animShowHide, {
        ...animShowHide,
        toValue: 1,
      }).start();
      if (document.body) {
        document.body.classList.add("blurDialogOpened");
      }
    });
  };

  animateLeave = () => {
    window.requestAnimationFrame(() => {
      Animated.timing(this.state.animShowHide, {
        ...animShowHide,
        toValue: 0,
      }).start();
      if (document.body) {
        document.body.classList.remove("blurDialogOpened");
      }
    });
  };

  handleClickOnBackdrop = () => {
    const { disableBackdropClick, onClose } = this.props;
    if (!disableBackdropClick && onClose) {
      onClose();
    }
  };

  swallowClick = (e: SyntheticInputEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  render() {
    const { isOpened, children } = this.props;
    const { isInDOM, animShowHide } = this.state;

    if (!isInDOM || !modalRoot) return null;

    const backdropOpacity = animShowHide.interpolate({
      inputRange: [0, 0.7],
      outputRange: [0, 1],
      clamp: true,
    });

    const backdropStyle = {
      ...BACKDROP_STYLE,
      opacity: backdropOpacity,
    };

    const containerStyle = {
      ...CONTAINER_STYLE,
      pointerEvents: isOpened ? "auto" : "none",
    };

    const scale = animShowHide.interpolate({
      inputRange: [0, 1],
      outputRange: [0.95, 1],
      clamp: true,
    });

    const bodyWrapperStyle = {
      ...BODY_WRAPPER_STYLE,
      opacity: animShowHide,
      transform: [{ scale }],
    };

    const modal = (
      <Fragment>
        <Animated.div style={backdropStyle} />
        <div style={containerStyle} onClick={this.handleClickOnBackdrop}>
          <Animated.div style={bodyWrapperStyle}>
            <ModalDialog>
              <ModalDialogInner onClick={this.swallowClick}>
                <Box grow>{children}</Box>
              </ModalDialogInner>
            </ModalDialog>
          </Animated.div>
        </div>
      </Fragment>
    );

    return createPortal(modal, modalRoot);
  }
}

const BACKDROP_STYLE = {
  pointerEvents: "none",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0, 0, 0, 0.5)",
};

const CONTAINER_STYLE = {
  ...BACKDROP_STYLE,
  background: "transparent",
  overflow: "auto",
  display: "flex",
};

const BODY_WRAPPER_STYLE = {
  borderRadius: 3,
  boxShadow: "box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.2)",
  flexShrink: 1,
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

export { default as ModalFooterButton } from "./ModalFooterButton";
export { ModalClose };
export default Modal;
