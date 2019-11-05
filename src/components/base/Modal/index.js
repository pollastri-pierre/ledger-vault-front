// @flow

import React, { useState, useEffect } from "react";
import { animated, useSpring } from "react-spring";
import { createPortal } from "react-dom";

import Box from "components/base/Box";
import {
  ModalClose,
  ModalDialog,
  ModalDialogInner,
  ModalFooter,
  ModalBody,
  ModalHeader,
  ModalTitle,
  RichModalHeader,
  RichModalFooter,
  RichModalTabsContainer,
  RichModalTab,
} from "./components";
import type { ModalProps } from "./types";

const modalsContainer = document.createElement("div");
modalsContainer.classList.add("modals-container");
const modalRoot = document.body && document.body.appendChild(modalsContainer);

function Modal(props: ModalProps) {
  const {
    isOpened,
    transparent,
    onClose,
    disableBackdropClick,
    children,
  } = props;
  const [isInDOM, setIsInDOM] = useState(false);

  useEffect(() => {
    if (!isInDOM && isOpened) {
      setIsInDOM(true);
    }
  }, [isOpened, isInDOM]);

  const handleClickOnBackdrop = () => {
    if (!disableBackdropClick && onClose) {
      onClose();
    }
  };

  const swallowClick = (e: SyntheticInputEvent<HTMLInputElement>) =>
    e.stopPropagation();

  const backdropStyle = useSpring({
    ...BACKDROP_STYLE,
    opacity: isOpened ? 0.7 : 0,
    config: {
      tension: 300,
    },
  });

  const containerStyle = {
    ...CONTAINER_STYLE,
    pointerEvents: isOpened ? "auto" : "none",
  };

  const bodyWrapperStyle = useSpring({
    ...BODY_WRAPPER_STYLE,
    opacity: isOpened ? 1 : 0,
    transform: `scale(${isOpened ? 1 : 0.95})`,
    config: {
      tension: 500,
      friction: 38,
    },
  });

  if (!modalRoot || !isInDOM) return null;

  const modal = (
    <>
      <animated.div data-role="modal-backdrop" style={backdropStyle} />
      <div style={containerStyle} onClick={handleClickOnBackdrop}>
        <animated.div style={bodyWrapperStyle}>
          <ModalDialog>
            <ModalDialogInner
              transparent={transparent}
              onClick={swallowClick}
              data-role="modal-inner"
            >
              <Box grow>{children}</Box>
            </ModalDialogInner>
          </ModalDialog>
        </animated.div>
      </div>
    </>
  );

  return createPortal(modal, modalRoot);
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

export {
  ModalClose,
  ModalFooter,
  ModalBody,
  ModalHeader,
  ModalTitle,
  RichModalHeader,
  RichModalFooter,
  RichModalTabsContainer,
  RichModalTab,
};
export { default as ConfirmModal } from "./ConfirmModal";
export default Modal;
