import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  * {
    color: inherit;
    box-sizing: border-box;
  }

  input {
    font: inherit;
  }

  body {
    font-family: "Open Sans", sans-serif;
    -webkit-font-smoothing: antialiased;
    font-size: 16px;

    color: #6f6f6f;
    font-size: 13px;
    line-height: 20px;

    user-select: none;

    & ::selection {
      background: rgba(0, 0, 0, 0.1);
    }
  }

  a {
    text-decoration: none;
  }
`;
