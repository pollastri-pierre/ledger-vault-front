// @flow

import styled from "styled-components";

import colors from "shared/colors";
import Box from "components/base/Box";

export default styled(Box)`
  font-size: 11px;
  text-transform: uppercase;
  padding-bottom: ${p => (p.noPadding ? 0 : 5)}px;
  white-space: no-wrap;
  color: ${colors.textLight};
`;
