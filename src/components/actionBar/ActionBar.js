//@flow
import { translate } from "react-i18next";
import AccountsQuery from "api/queries/AccountsQuery";
import type { Translate } from "data/types";
import connectData from "restlay/connectData";
import type { Account } from "data/types";
import React, { Component } from "react";
// import { Route } from "react-router";
import { Link } from "react-router-dom";
import ProfileCard from "./ProfileCard";
import ActivityCard from "./ActivityCard";
import ModalRoute from "../ModalRoute";
import AccountCreation from "../accounts/creation/AccountCreation";
import colors from "shared/colors";
import SettingsModal from "../SettingsModal";
import { withStyles } from "@material-ui/core/styles";
import Plus from "../icons/full/Plus";
// import Share from "../icons/full/Share";
import Settings from "../icons/full/Settings";
import Question from "../icons/full/Question";
import Logo from "components/Logo";

const styles = {
  base: {
    height: "200px",
    background: colors.night,
    color: "white",
    position: "relative"
  },
  header: {
    marginLeft: "280px",
    padding: "54px 38px 0 0"
  },
  header_left: {
    float: "left"
  },
  actions: {
    float: "right",
    margin: "-7px -13px",
    "& a, > span": {
      display: "inline-block",
      textDecoration: "none",
      textTransform: "uppercase",
      textAlign: "center",
      fontWeight: "600",
      fontSize: "11px",
      color: "white",
      margin: "0 14px",
      opacity: ".5",
      "&:hover": {
        opacity: "1"
      }
    }
  },
  icon: {
    width: 16,
    fill: "white",
    marginBottom: 5
  }
};

class ActionBar extends Component<{
  location: Object,
  match: Object,
  t: Translate,
  accounts: Account[],
  classes: { [_: $Keys<typeof styles>]: string }
}> {
  render() {
    const { location, classes, accounts, match, t } = this.props;

    return (
      <div className={classes.base}>
        <ProfileCard match={match} />
        <ModalRoute path="*/new-account" component={AccountCreation} />
        <ModalRoute
          path="*/settings"
          component={SettingsModal}
          undoAllHistoryOnClickOutside
        />
        <div className={classes.header}>
          <div className={classes.header_left}>
            <Logo white />
          </div>
          <div className={classes.actions}>
            <Link to={`${location.pathname}/new-account`}>
              <Plus className={classes.icon} />
              <div>account</div>
            </Link>
            {accounts.length > 0 && (
              <Link
                to={location.pathname + "/settings"}
                className="content-header-button"
              >
                <Settings className={classes.icon} />
                <div>{t("actionBar:settings")}</div>
              </Link>
            )}
            <ActivityCard match={match} />
            <a href="http://alpha.vault.ledger.fr:81/">
              <Question className={classes.icon} />
              <div>Help</div>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default connectData(withStyles(styles)(translate()(ActionBar)), {
  queries: {
    accounts: AccountsQuery
  }
});
