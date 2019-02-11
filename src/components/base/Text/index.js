// @flow

import styled from "styled-components";
import { color } from "styled-system";

export default styled.div`
  ${color};
  display: ${p => (p.inline ? "inline-block" : "block")};
  font-family: "Open Sans", "Roboto", "Helvetica", "Arial", sans-serif;
  font-size: ${p => (p.header ? 18 : p.small ? 11 : p.large ? 16 : 13)}px;
  font-weight: ${p => (p.bold ? "bold" : "")};
  font-style: ${p => (p.italic ? "italic" : "")};
  line-height: ${p => ("lineHeight" in p ? p.lineHeight : "1.75")};
  text-transform: ${p => (p.uppercase ? "uppercase" : "")};
`;
