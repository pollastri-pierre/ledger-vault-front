// @flow

import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import colors from "shared/colors";
import Box, { px } from "components/base/Box";
import Text from "components/base/Text";
import IconClose from "components/icons/Close";

export const ModalDialog = styled(Box)`
  min-height: 200px;
`;

export const boxShadow = `0px 11px 15px -7px ${colors.legacyTranslucentGrey7},
    0px 24px 38px 3px ${colors.legacyTranslucentGrey7}, 0px 9px 46px 8px ${colors.legacyTranslucentGrey7}`;

export const ModalDialogInner = styled(Box)`
  background: ${p => (p.transparent ? "transparent" : colors.white)};
  position: relative;
  margin-bottom: 40px;
  margin-top: 40px;
  border-radius: 4px;
  flex-shrink: 0;
  box-shadow: ${p => (p.transparent ? "none" : boxShadow)};
`;

export const ModalBreadcrumb = styled(Box).attrs({
  bg: colors.legacyLightGrey5,
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

export const ModalClose = ({ onClick }: { onClick?: () => void }) => (
  <ModalCloseContainer onClick={onClick} data-test="close">
    <IconClose size={16} />
  </ModalCloseContainer>
);

const RichModalHeaderContainer = styled.div`
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background: ${colors.legacyLightGrey5};
  padding: 40px;
  color: ${colors.textLight};
`;

const RichModalHeaderButt = styled.div`
  margin-top: 20px;
  margin-bottom: -40px;
`;

export const RichModalHeader = ({
  title,
  children,
  Icon,
  onClose,
}: {
  children?: React$Node,
  title: React$Node,
  Icon: React$ComponentType<*>,
  onClose: () => void,
}) => (
  <RichModalHeaderContainer>
    <ModalClose onClick={onClose} />
    <Box horizontal flow={10} align="center">
      <Icon size={24} color={colors.legacyLightGrey7} />
      <Text large>{title}</Text>
    </Box>
    {children && (
      <RichModalHeaderButt>
        <Box horizontal align="center" justify="space-between">
          {children}
        </Box>
      </RichModalHeaderButt>
    )}
  </RichModalHeaderContainer>
);

export const RichModalFooter = styled.div`
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  padding: 0 20px;
  // border-top: 1px solid #f0f0f0;
  box-shadow: hsla(0, 0%, 10%, 0.1) 0 4px 6px -4px inset;
  background: ${colors.form.bg};
  min-height: 90px;
  display: flex;
  align-items: flex-end;
`;

export const RichModalTabsContainer = styled.div`
  display: flex;

  > * + * {
    margin-left: 5px;
  }
`;

export const RichModalTab = styled(({ isActive, dark, ...props }) => (
  <Link data-role="modal-tab" {...props} />
))`
  position: relative;
  background: ${p =>
    p.isActive
      ? colors.white
      : p.dark
      ? colors.legacyTranslucentGrey2
      : "unset"};
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 10px;
  text-decoration: none;
  pointer-events: ${p => (p.isActive ? "none" : "auto")};

  &:hover {
    cursor: pointer;
    background: ${p =>
      p.isActive
        ? colors.white
        : p.dark
        ? colors.legacyTranslucentGrey6
        : colors.legacyTranslucentGrey2};
  }

  &:active {
    transition: 100ms linear background-color;
    background: ${colors.legacyTranslucentGrey4};
  }
`;
