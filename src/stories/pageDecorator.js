import React from "react";
import { createGlobalStyle } from "styled-components";

import colors from "shared/colors";

export default function PageDecorator(story) {
  return (
    <>
      {story()}
      <GlobalStyle />
    </>
  );
}

const GlobalStyle = createGlobalStyle`
  body {
    background: ${colors.form.bg};
    padding: 20px;
  }
`;
