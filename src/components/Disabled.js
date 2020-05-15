// @flow
import styled from "styled-components";

const Disabled = styled.div`
  opacity: ${(p) => (p.disabled ? p.customOpacity || 0.4 : 1)};
  pointer-events: ${(p) => (p.disabled ? "none" : "default")};
`;

export default Disabled;
