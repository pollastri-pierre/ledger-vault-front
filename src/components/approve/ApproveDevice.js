//@flow
import React from "react";
import { DialogButton } from "../";
import { PlugIcon } from "../icons";
import { withStyles } from "material-ui/styles";
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
    textAlign: "left",
    fontSize: "13px",
    lineHeight: "1.54",
    marginBottom: "20px",
    "& ul": {
      padding: "0",
      listStyleType: "none",
      "& li": {
        lineHeight: "1.54",
        position: "relative",
        paddingLeft: "30px",
        marginBottom: "20px"
      },
      "& li > span": {
        fontSize: "18px",
        letterSpacing: "-0.4px",
        lineHeight: "1.28",
        position: "absolute",
        left: "0",
        top: "-4px"
      }
    }
  },
  footer: {
    marginTop: "35px"
  },
  wait: {
    textTransform: "uppercase",
    fontSize: "11px",
    color: colors.ocean,
    fontWeight: "600",
    float: "right"
  }
};
function ApproveDevice(props: {
  cancel: Function,
  entity: string,
  classes: Object
}) {
  const { cancel, entity, classes } = props;
  return (
    <div className={classes.base}>
      <header>
        <PlugIcon fill="#e2e2e2" />

        <h3>Approve {entity}</h3>
      </header>

      <div className={classes.content}>
        <ul>
          <li>
            <span>1.</span>
            Connect your Ledger Blue to your computer using one of its USB port.
          </li>
          <li>
            <span>2.</span>
            Power on your device and unlock it by entering your 4 to 8 digit
            personal PIN code.
          </li>
          <li>
            <span>3.</span>
            Open the Vault app on the dashboard. When displayed, approve the{" "}
            {entity} request on the device.
          </li>
        </ul>
      </div>
      <div className={classes.footer}>
        <DialogButton onTouchTap={cancel}>Cancel</DialogButton>
        <div className={classes.wait}>awaiting device...</div>
      </div>
    </div>
  );
}

export default withStyles(styles)(ApproveDevice);
