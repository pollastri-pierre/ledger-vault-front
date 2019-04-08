// @flow

import styled from "styled-components";

export default styled.div`
  position: absolute;
  top: ${position("top")};
  left: ${position("left")};
  right: ${position("right")};
  bottom: ${position("bottom")};

  ${p =>
    p.center
      ? `
    display: flex;
    align-items: center;
    justify-content: center;
  `
      : ""}
`;

function position(pos) {
  return p =>
    p[pos] === true
      ? 0
      : p[pos] === 0
      ? 0
      : p[pos]
      ? typeof p[pos] === "string"
        ? p[pos]
        : `${p[pos]}px`
      : "auto";
}
