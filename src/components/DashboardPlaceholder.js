//@flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
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
  classes,
  t
}: {
  classes: { [$Keys<typeof styles>]: string },
  t: Translate
}) => (
  <div className={classes.base}>
    <div>
      <h3>{t("dashboard:empty_state.title")}</h3>
      <p>
        <span>{t("dashboard:empty_state.click")} </span>
        <Link to={`dashboard/new-account`} className={classes.link}>
          <Plus className={classes.icon} />
          <span> {t("dashboard:empty_state.account")} </span>
        </Link>
        <span> {t("dashboard:empty_state.to_create")} </span>
      </p>
      <p className={classes.needHelp}>
        <strong>{t("dashboard:empty_state.need_help")}</strong>{" "}
        <HelpLink className={classes.help}>
          {t("dashboard:empty_state.visit")}
        </HelpLink>
      </p>
    </div>
  </div>
);

export default withStyles(styles)(translate()(DashboardPlaceholder));
