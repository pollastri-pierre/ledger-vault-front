// @flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import DialogButton from "../buttons/DialogButton";

const styles = {
  base: {
    position: "absolute",
    bottom: "0",
    left: "0",
    width: "100%",
    padding: "0 40px",
  },
  abort: {
    marginRight: "20px",
  },
};

function Footer(props: {
  approved: boolean,
  approve: Function,
  aborting: Function,
  percentage?: *,
  classes: Object,
}) {
  const { approved, approve, aborting, percentage, classes } = props;

  if (approved) {
    return (
      <div className={classes.base}>
        {percentage}
        <div style={{ float: "right" }}>
          <DialogButton abort onTouchTap={aborting} className={classes.abort}>
            Abort
          </DialogButton>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.base}>
      {percentage}
      <div style={{ float: "right" }}>
        <DialogButton abort onTouchTap={aborting} className={classes.abort}>
          Abort
        </DialogButton>
        <DialogButton highlight onTouchTap={approve}>
          Approve
        </DialogButton>
      </div>
    </div>
  );
}

export default withStyles(styles)(Footer);
