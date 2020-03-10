// @flow

import styled from "styled-components";

import Box from "components/base/Box";

import colors from "shared/colors";

export default styled(Box).attrs(p => ({
  align: "center",
  justify: p.leftAlign ? "flex-start" : "flex-end",
  horizontal: true,
  px: 10,
  borderRadius: 4,
  grow: !!p.grow,
}))`
  height: 40px;
  width: ${p => (p.width ? p.width : "inherit")}
  background: ${colors.form.bg};
  border: 1px solid ${colors.form.border};
  min-width: ${p => (p.width ? p.width : "180px")};
`;
