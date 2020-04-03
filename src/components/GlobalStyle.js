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

  [data-reach-popover] {
    z-index: 1000;
  }

  body {
    margin: 0;
    font-family: "Inter", sans-serif;
    -webkit-font-smoothing: antialiased;
    color: ${colors.text};
    font-size: 13px;
    line-height: 20px;

    & ::selection {
      background: ${colors.legacyTranslucentGrey3};
    }
  }

  a {
    text-decoration: none;
  }
`;
