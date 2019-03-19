// @flow
import { Trans } from "react-i18next";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import type { Match, Location } from "react-router-dom";
import { FaPlus, FaQuestionCircle } from "react-icons/fa";
import colors from "shared/colors";
import { withStyles } from "@material-ui/core/styles";
import { urls } from "utils/urls";
import Logo from "components/Logo";
import Text from "components/Text";
import ProfileCard from "./ProfileCard";
import ActivityCard from "./ActivityCard";
import ModalRoute from "../ModalRoute";
import AccountCreation from "../accounts/creation/AccountCreation";

// NOTE: more refactor to do, might be a part of general layout refactor
const styles = {
  base: {
    height: 200,
    background: colors.night,
    color: colors.white,
    position: "relative"
  },
  header: {
    marginLeft: 280,
    padding: "54px 38px 0 0",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  actions: {
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
  }
};

class ActionBar extends Component<{
  location: Location,
  match: Match,
  classes: { [_: $Keys<typeof styles>]: string }
}> {
  render() {
    const { location, classes, match } = this.props;
    return (
      <div className={classes.base}>
        <ProfileCard match={match} />
        <ModalRoute
          path="*/new-account"
          component={AccountCreation}
          disableBackdropClick
        />
        <div className={classes.header}>
          <Logo white />
          <div className={classes.actions}>
            <Link
              className="test-new-account"
              to={`${location.pathname}/new-account`}
            >
              <FaPlus size={18} />
              <div>
                <Trans i18nKey="actionBar:account" />
              </div>
            </Link>
            <ActivityCard match={match} />
            <a href={urls.customer_support} target="new">
              <FaQuestionCircle size={18} />
              <Text small uppercase>
                <Trans i18nKey="actionBar:help" />
              </Text>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ActionBar);
