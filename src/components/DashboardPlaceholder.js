// @flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import cx from "classnames";
import { Trans } from "react-i18next";
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
    textDecoration: "none",
    color: colors.ocean,
    fontWeight: 600,
    fontSize: 12,
    textTransform: "uppercase",
    marginLeft: 10,
    marginRight: 10
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
      <h3>{<Trans i18nKey="dashboard:empty_state.title" />}</h3>
      <p>
        <Trans i18nKey="dashboard:empty_state.click" />
        <Link to="dashboard/new-account" className={classes.link}>
          <Plus className={cx(classes.icon, "test-new-account-dashboard")} />
          <span>
            <Trans i18nKey="dashboard:empty_state.account" />
          </span>
        </Link>
        <Trans i18nKey="dashboard:empty_state.to_create" />
      </p>
      <p className={classes.needHelp}>
        <strong>
          <Trans i18nKey="dashboard:empty_state.need_help" />
        </strong>{" "}
        <HelpLink className={classes.help}>
          <Trans i18nKey="dashboard:empty_state.visit" />
        </HelpLink>
      </p>
    </div>
  </div>
);

export default withStyles(styles)(DashboardPlaceholder);
