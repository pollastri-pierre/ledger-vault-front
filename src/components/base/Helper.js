// @flow

import styled from "styled-components";

import colors, { darken } from "shared/colors";

export const Helper = styled.div`
  background: ${colors.helperBg};
  font-size: 16px;
  line-height: 24px;
  padding: 20px;
  user-select: text;

  a {
    color: ${colors.bLive};
    padding: 0 2px;
    &:hover {
      color: ${darken(colors.bLive, 0.1)};
    }
    &:active {
      color: ${darken(colors.bLive, 0.2)};
    }
    &:focus {
      outline: 1px dashed ${colors.bLive};
    }
  }
`;

export const HelperTitle = styled.div`
  font-weight: bold;
  color: ${colors.helperTitle};
`;
