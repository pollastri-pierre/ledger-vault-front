import { createGlobalStyle } from "styled-components";
import colors from "shared/colors";

export default createGlobalStyle`
  * {
    color: inherit;
    box-sizing: border-box;
    min-width: 0;
  }

  input {
    font: inherit;
  }

  body {
    margin: 0;
    font-family: "Inter", "Open Sans", sans-serif;
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
