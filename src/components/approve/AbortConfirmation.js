//@flow
import React from "react";
import DialogButton from "../buttons/DialogButton";
import { withStyles } from "@material-ui/core/styles";
import Trash from "../icons/thin/Trash";
import colors from "../../shared/colors";

const styles = {
  base: {
    width: "400px",
    padding: "40px 40px 0",
    textAlign: "center",
    "& > header": {
      "& > h3": {
        fontWeight: "400",
        fontSize: "18px",
        marginTop: "10px",
        "&:after": {
          content: '""',
          display: "block",
          width: "80%",
          height: "1px",
          background: "#eee",
          margin: "auto",
          marginTop: "20px",
          marginBottom: "20px"
        }
      }
    }
  },
  content: {
    fontSize: "13px",
    lineHeight: "1.54",
    marginBottom: "20px",
    "& p": {
      margin: "0"
    }
  },
  footer: {
    marginTop: "35px"
  }
};

function AbortConfirmation(props: {
  abort: Function,
  aborting: Function,
  entity: string,
  classes: Object
}) {
  const { abort, aborting, entity, classes } = props;
  return (
    <div className={classes.base}>
      <header>
        <Trash
          style={{
            width: "27px",
            strokeWidth: "2px",
            height: "32px",
            fill: "none",
            color: colors.mouse
          }}
        />
        <h3>Abort {entity} request</h3>
      </header>

      <div className={classes.content}>
        <p>Do you really want to abort the {entity} ?</p>
        <p>
          The request will be cancelled and the {entity} will not be created.
        </p>
      </div>
      <div className={classes.footer}>
        <DialogButton abort onTouchTap={aborting}>
          Cancel
        </DialogButton>
        <DialogButton highlight right onTouchTap={abort}>
          Abort
        </DialogButton>
      </div>
    </div>
  );
}

export default withStyles(styles)(AbortConfirmation);
