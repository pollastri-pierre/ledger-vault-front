// @flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import cx from "classnames";
import colors from "shared/colors";

const style = {
  base: {
    borderBottom: `1px solid ${colors.argile}`,
    display: "flex",
    minHeight: 40,
    alignItems: "center",
    justifyContent: "space-between",
  },
  noBorder: {
    border: 0,
  },
  label: {
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: 11,
  },
  children: {
    color: "grey",
    fontSize: 12,
  },
};
const Row = ({
  classes,
  label,
  children,
  noBorder,
}: {
  classes: { [_: $Keys<typeof style>]: string },
  label: string,
  children: *,
  noBorder: boolean,
}) => (
  <div className={cx(classes.base, { [classes.noBorder]: noBorder })}>
    <div className={classes.label}>{label}</div>
    <div className={classes.children}>{children}</div>
  </div>
);

export default withStyles(style)(Row);
