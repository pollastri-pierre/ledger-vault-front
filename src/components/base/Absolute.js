import styled from "styled-components";

export default styled.div`
  position: absolute;
  top: ${position("top")};
  left: ${position("left")};
  right: ${position("right")};
  bottom: ${position("bottom")};
`;

function position(pos) {
  return p =>
    p[pos] === true ? 0 : p[pos] === 0 ? 0 : p[pos] ? `${p[pos]}px` : "auto";
}
