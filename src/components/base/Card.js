import styled from "styled-components";

import Box from "components/base/Box";
import Text from "components/base/Text";

export const CardTitle = styled(Text).attrs({
  uppercase: true,
  fontSize: 11,
  color: "black"
})`
  display: block !important;
  margin-bottom: 20px;
  font-weight: 600;
`;

export default styled(Box).attrs({
  p: 40,
  position: "relative"
})`
  overflow-x: auto;
  background-color: white;
  box-shadow: 0 2.5px 2.5px 0 rgba(0, 0, 0, 0.07);
`;
