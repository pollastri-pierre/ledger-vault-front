// @flow

import styled from "styled-components";

import { lighten, darken } from "shared/colors";

export default styled.div`
  cursor: pointer;
  color: ${(p) => p.theme.colors.bLive};
  &:hover {
    color: ${(p) => lighten(p.theme.colors.bLive, 0.1)};
    text-decoration: underline;
  }
  &:active {
    color: ${(p) => darken(p.theme.colors.bLive, 0.1)};
  }
`;
