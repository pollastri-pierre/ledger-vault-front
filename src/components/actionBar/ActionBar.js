//@flow
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, withRouter } from "react-router";
import { Link } from "react-router-dom";
import ProfileCard from "./ProfileCard";
import ModalRoute from "../ModalRoute";
import AccountCreation from "../accounts/creation/AccountCreation";
import colors from "../../shared/colors";
import SettingsModal from "../SettingsModal";
import injectSheet from "react-jss";
import {
  ActionAddAccountIcon,
  ActionExportIcon,
  ActionSettingsIcon,
  ActionActivityIcon
} from "../icons";

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
    "& a": {
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

const NewAccountLink = () => (
  <Link to="/dashboard/new-account">
    <ActionAddAccountIcon type="white" />
    <div className="content-header-button-text">account</div>
  </Link>
);

class ActionBar extends Component<{
  location: Object,
  classes: Object
}> {
  static contextTypes = {
    translate: PropTypes.func.isRequired
  };
  context: {
    translate: string => string
  };
  render() {
    const { location, classes } = this.props;
    // FIXME introduce a component for i18n
    const t = this.context.translate;

    return (
      <div className={classes.base}>
        <ProfileCard />
        <ModalRoute path="*/new-account" component={AccountCreation} />
        <ModalRoute
          path="*/settings"
          component={SettingsModal}
          undoAllHistoryOnClickOutside
        />

        <div className={classes.header}>
          <div className={classes.header_left}>
            <img
              src="/img/logo.png"
              srcSet="/img/logo@2x.png 2x, /img/logo@3x.png 3x"
              className="content-header-logo"
              alt="Ledger Vault logo"
            />
          </div>
          <div className={classes.actions}>
            <Route path="/dashboard" component={NewAccountLink} />
            <Link to="/export">
              <ActionExportIcon />
              <div className="content-header-button-text">
                {t("actionBar.export")}
              </div>
            </Link>
            <Link
              to={location.pathname + "/settings"}
              className="content-header-button"
            >
              <ActionSettingsIcon />
              <div className="content-header-button-text">
                {t("actionBar.settings")}
              </div>
            </Link>
            <Link to="/activity" className="content-header-button">
              <ActionActivityIcon />
              <div className="content-header-button-text">
                {t("actionBar.activity")}
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(injectSheet(styles)(ActionBar));
