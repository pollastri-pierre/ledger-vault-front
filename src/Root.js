// @flow

import React from "react";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Provider } from "react-redux";

import { styledTheme } from "styles/theme";
import GlobalStyle from "components/GlobalStyle";
import RestlayProvider from "restlay/RestlayProvider";
import { SoftDevicesProvider } from "components/SoftDevices/SoftDevicesContext";
import network from "network";
import i18n from "./i18n";
import "./insertFontsTags";

const Root = ({ children, store }: { children: React$Node, store: string }) => (
  <BrowserRouter>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <RestlayProvider network={network}>
          <ThemeProvider theme={styledTheme}>
            <SoftDevicesProvider>
              <GlobalStyle />
              {children}
            </SoftDevicesProvider>
          </ThemeProvider>
        </RestlayProvider>
      </Provider>
    </I18nextProvider>
  </BrowserRouter>
);

export default Root;
