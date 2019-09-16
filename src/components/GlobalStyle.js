import { createGlobalStyle } from "styled-components";
import colors from "shared/colors";

export default createGlobalStyle`
  * {
    color: inherit;
    box-sizing: border-box;
  }

  input {
    font: inherit;
  }

  body {
    margin: 0;
    font-family: "Open Sans", sans-serif;
    -webkit-font-smoothing: antialiased;
    color: ${colors.text};
    font-size: 13px;
    line-height: 20px;

    user-select: none;

    & ::selection {
      background: ${colors.legacyTranslucentGrey3};
    }
  }

  a {
    text-decoration: none;
  }
`;
