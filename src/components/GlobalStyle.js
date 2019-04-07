import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  * {
    font: inherit;
    color: inherit;
    box-sizing: border-box;
  }

  body {
    font-family: "Open Sans", sans-serif;
    -webkit-font-smoothing: antialiased;
    font-size: 16px;
    line-height: 24px;

    color: #6f6f6f;
    font-size: 13px;
    line-height: 1.75;

    user-select: none;

    & ::selection {
      background: rgba(0, 0, 0, 0.1);
    }
  }

  // FIXME i mean
  body.blurDialogOpened .App {
    filter: blur(3px);
  }
`;
