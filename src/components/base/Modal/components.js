// @flow

import React from "react";
import styled from "styled-components";

import colors from "shared/colors";
import Box, { px } from "components/base/Box";
import Text from "components/base/Text";
import IconClose from "components/icons/Close";

export const ModalDialog = styled(Box)`
  min-height: 200px;
`;

export const boxShadow = `0px 11px 15px -7px rgba(0, 0, 0, 0.04),
    0px 24px 38px 3px rgba(0, 0, 0, 0.04), 0px 9px 46px 8px rgba(0, 0, 0, 0.04)`;

export const ModalDialogInner = styled(Box)`
  background: ${p => (p.transparent ? "transparent" : "white")};
  position: relative;
  margin-bottom: 40px;
  margin-top: 40px;
  border-radius: 4px;
  flex-shrink: 0;
  box-shadow: ${p => (p.transparent ? "none" : boxShadow)};
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
  px: 15,
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

const ModalCloseContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  cursor: pointer;

  color: ${colors.lightGrey};

  &:hover {
    color: ${colors.mediumGrey};
  }

  &:active {
    color: ${colors.steel};
  }
`;

export const ModalClose = ({ onClick }: { onClick: () => void }) => (
  <ModalCloseContainer onClick={onClick} data-test="close">
    <IconClose size={16} />
  </ModalCloseContainer>
);
