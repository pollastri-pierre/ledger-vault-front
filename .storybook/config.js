import React from "react";
import JssProvider from "react-jss/lib/JssProvider";
import { withStyles } from "@material-ui/core/styles";
import { withKnobs } from "@storybook/addon-knobs";
import { configure, addDecorator } from "@storybook/react";
import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName
} from "@material-ui/core/styles";

import theme from "styles/theme";

const muiTheme = createMuiTheme(theme);

const req = require.context("../src", true, /.stories.js$/);

const generateClassName = (a, b) => {
  return `${b.options.classNamePrefix}-${a.key}`;
};

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(story => (
  <JssProvider generateClassName={generateClassName}>
    <MuiThemeProvider theme={muiTheme}>
      <StyledContainer>{story()}</StyledContainer>
    </MuiThemeProvider>
  </JssProvider>
));

addDecorator(withKnobs);

const Container = ({ children, classes }) => (
  <div className={classes.container}>{children}</div>
);

const StyledContainer = withStyles({
  container: {
    "& *": {
      boxSizing: "border-box"
    }
  }
})(Container);

configure(loadStories, module);
