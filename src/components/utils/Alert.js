// @flow
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";

import IconCheck from "../icons/Validate";
import IconError from "../icons/Error";
import colors from "../../shared/colors";

const common = {
  padding: "30px",
  width: "380px",
  fontFamily: "inherit",
  fontSize: "11px",
  lineHeight: "1.82",
  boxShadow: "0 10px 10px 0 rgba(0, 0, 0, 0.04)"
};
const error = {
  root: {
    background: "#ea2e49",
    ...common
  }
};
const success = {
  root: {
    background: "#27d0e2",
    ...common
  }
};

function Snack(props: { message: *, classes: Object }) {
  const { message, classes } = props;
  return <SnackbarContent message={message} classes={{ root: classes.root }} />;
}

const Error = withStyles(error)(Snack);
const Success = withStyles(success)(Snack);

function Alert(props: { children: *, open: boolean, theme: string, title: * }) {
  const { title, children, theme: themeName, ...newProps } = props;
  let iconDiv = null;
  let titleDiv = null;
  const theme = {};

  switch (themeName) {
    case "success":
      theme.icon = <IconCheck color={colors.white} size={38} />;
      break;

    case "error":
      theme.icon = <IconError color={colors.white} size={38} />;
      break;

    default:
      theme.color = false;
      theme.icon = false;
      break;
  }

  if (theme.icon) {
    iconDiv = <div style={{ marginRight: 30 }}>{theme.icon}</div>;
  }

  if (title) {
    titleDiv = (
      <div
        className="top-message-title"
        style={{
          fontWeight: 600,
          textTransform: "uppercase",
          marginBottom: "10px"
        }}
      >
        {title}
      </div>
    );
  }

  const content = (
    <div style={{ display: "flex" }}>
      {iconDiv}
      <div>
        {titleDiv}
        <div className="top-message-body">{children}</div>
      </div>
    </div>
  );

  return (
    <Snackbar
      {...newProps}
      className="top-message"
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      {themeName === "error" ? (
        <Error message={content} />
      ) : (
        <Success message={content} />
      )}
    </Snackbar>
  );
}

export default Alert;
