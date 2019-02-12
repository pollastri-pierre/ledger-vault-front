import styled from "styled-components";

import Box from "components/base/Box";

export default styled(Box).attrs({
  p: 20,
  position: "relative"
})`
  background-color: white;
  box-shadow: 0 2.5px 2.5px 0 rgba(0, 0, 0, 0.07);
`;
