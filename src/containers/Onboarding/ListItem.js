//@flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  base: {
    fontSize: 13,
    lineHeight: 1.54
  },
  number: {
    fontSize: 16
  }
};
const ListItem = ({
  children,
  number,
  classes
}: {
  children: any,
  number: number,
  classes: { [$Keys<typeof styles>]: string }
}) => {
  return (
    <li className={classes.base}>
      <span className={classes.number}>{number}.</span>
      <span>{children}</span>
    </li>
  );
};

export default withStyles(styles)(ListItem);
