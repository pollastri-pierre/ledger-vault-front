//@flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import HelpLink from "components/HelpLink";
import Plus from "components/icons/full/Plus";
import colors from "shared/colors";
import { Link } from "react-router-dom";

const styles = {
  base: {
    textAlign: "center",
    background: "white",
    padding: "40px",
    boxShadow: "0 2.5px 2.5px 0 rgba(0,0,0,.04)",
    position: "relative",
    marginBottom: "20px",
    boxSizing: "border-box",
    "& h3": {
      marginTop: 0
    },
    "& p": {
      margin: 0
    }
  },
  icon: {
    width: 12,
    fill: "black",
    display: "inline-block",
    marginRight: 2,
    marginTop: "-3px",
    verticalAlign: "middle"
  },
  link: {
    marginTop: 20,
    textDecoration: "none",
    color: colors.ocean,
    fontWeight: 600,
    fontSize: 12,
    textTransform: "uppercase"
  },
  linkLabel: {
    color: colors.ocean,
    fontWeight: 600,
    textTransform: "uppercase",
    display: "inline-block",
    verticalAlign: "middle"
  },
  needHelp: {
    marginTop: "30px !important",
    fontSize: 13
  },
  help: {
    textDecoration: "none",
    color: colors.ocean
  }
};
const DashboardPlaceholder = ({
  classes
}: {
  classes: { [$Keys<typeof styles>]: string }
}) => (
  <div className={classes.base}>
    <div>
      <h3>Your workspace is empty</h3>
      <p>
        <span>Click </span>
        <Link to={`dashboard/new-account`} className={classes.link}>
          <Plus className={classes.icon} />
          <span> Account </span>
        </Link>
        <span>to create your first account.</span>
      </p>
      <p className={classes.needHelp}>
        <strong>Need help?</strong>{" "}
        <HelpLink className={classes.help}>Visit our Help Center</HelpLink>
      </p>
    </div>
  </div>
);

export default withStyles(styles)(DashboardPlaceholder);
