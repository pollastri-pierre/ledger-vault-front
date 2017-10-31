import React from "react";
import { shallow, mount, render } from "enzyme";
import { PopBubble } from "../../components";
import { Alert } from "../../components";
import Snackbar from "material-ui/Snackbar";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";

const muiTheme = getMuiTheme({
  fontFamily: "Open Sans, sans-serif"
});

describe("Alert", () => {
  it("should be a Snackbar component", () => {
    const wrapper = shallow(<Alert />);
    expect(wrapper.type()).toBe(Snackbar);
  });

  it("should have a css class top-message", () => {
    const wrapper = shallow(<Alert />);
    expect(wrapper.hasClass("top-message")).toBe(true);
  });

  it("should accept className as props", () => {
    const wrapper = shallow(<Alert className="test" />);
    expect(wrapper.hasClass("test")).toBe(true);
  });

  it("should set the success theme", () => {
    const wrapper = mount(
      <MuiThemeProvider muiTheme={muiTheme}>
        <Alert theme="success" />
      </MuiThemeProvider>
    );

    const style = wrapper.children().props().style;
    expect(style).toEqual({
      height: "initial",
      lineHeight: "initial",
      padding: "40px",
      backgroundColor: "#27d0e2",
      width: "379px",
      boxSizing: "border-box"
    });
  });

  it("should set the error theme", () => {
    const wrapper = mount(
      <MuiThemeProvider muiTheme={muiTheme}>
        <Alert theme="error" />
      </MuiThemeProvider>
    );

    const style = wrapper.children().props().style;
    expect(style).toEqual({
      height: "initial",
      lineHeight: "initial",
      padding: "40px",
      backgroundColor: "#ea2e49",
      width: "379px",
      boxSizing: "border-box"
    });
  });

  it("should set the default theme", () => {
    const wrapper = mount(
      <MuiThemeProvider muiTheme={muiTheme}>
        <Alert />
      </MuiThemeProvider>
    );

    const style = wrapper.children().props().style;
    expect(style).toEqual({
      height: "initial",
      lineHeight: "initial",
      padding: "40px",
      width: "379px",
      boxSizing: "border-box"
    });
  });
});
