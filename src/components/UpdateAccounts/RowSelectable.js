// @flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import cx from "classnames";
import colors from "shared/colors";

const style = {
  base: {
    display: "flex",
    borderBottom: `1px solid ${colors.argile}`,
    width: 150,
    cursor: "pointer",
    justifyContent: "space-between",
    lineHeight: "40px"
  },
  noBorder: {
    border: 0
  },
  label: {
    textTransform: "uppercase",
    color: "black",
    fontSize: 11,
    fontWeight: "bold"
  },
  select: {
    color: "grey",
    fontSize: 12
  },
  value: {
    color: "grey"
  }
};

const RowSelectable = ({
  label,
  classes,
  onClick,
  noBorder,
  descriptionSelected,
  value
}: {
  label: string,
  descriptionSelected: string,
  noBorder: boolean,
  onClick: Function,
  value: number,
  classes: { [_: $Keys<typeof style>]: string }
}) => (
  <div
    className={cx(classes.base, { [classes.noBorder]: noBorder })}
    onClick={onClick}
  >
    <div className={classes.label}>{label}</div>
    {value === 0 ? (
      <div className={classes.select}>select {" > "}</div>
    ) : (
      <div className={classes.value}>
        {value} {descriptionSelected}
      </div>
    )}
  </div>
);

export default withStyles(style)(RowSelectable);
