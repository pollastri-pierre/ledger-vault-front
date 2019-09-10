// @flow

import React from "react";
import styled from "styled-components";

import colors, { opacity } from "shared/colors";

type Props = {
  children: React$Node,
  Icon?: React$ComponentType<*>,
};

export const Breadcrumb = (props: Props) => {
  const { children, Icon, ...p } = props;
  return (
    <StyledBreadcrumb {...p}>
      {Icon && <Icon />}
      <div>{children}</div>
    </StyledBreadcrumb>
  );
};

export const BreadcrumbContainer = styled.div`
  display: inline-flex;
  border-radius: 4px;
`;

const StyledBreadcrumb = styled.div`
  display: flex;
  text-decoration: none;
  align-items: center;
  position: relative;
  background: ${colors.legacyLightBlue3};
  padding: 5px 5px 5px 20px;
  line-height: 20px;
  font-size: 11px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  margin-right: 5px;
  color: ${colors.blue};

  > * + * {
    margin-left: 5px;
  }

  &:hover {
    cursor: pointer;
    background: ${opacity(colors.blue, 0.11)};
    &:after {
      border-left-color: ${opacity(colors.blue, 0.11)};
    }
  }

  &:active {
    cursor: pointer;
    background: ${opacity(colors.blue, 0.14)};
    &:after {
      border-left-color: ${opacity(colors.blue, 0.14)};
    }
  }

  &:first-child {
    padding-left: 10px;
    &:before {
      border: 0 !important;
    }
  }

  &:last-child {
    pointer-events: none;
    padding-right: 10px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    background: ${colors.form.bg};
    color: ${colors.text};
    &:after {
      border: 0;
    }
  }
  &:after {
    content: "";
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    border-left: 15px solid ${colors.legacyLightBlue3};
    position: absolute;
    right: -15px;
    top: 0;
    z-index: 1;
  }
  &:before {
    content: "";
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    border-left: 15px solid ${colors.white};
    position: absolute;
    left: 0;
    top: 0;
  }
`;
