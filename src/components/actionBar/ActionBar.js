//@flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, withRouter } from "react-router";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ProfileCard from "./ProfileCard";
import AccountCreation from "../accounts/creation/AccountCreation";

import "./ActionBar.css";

const NewAccountLink = () => (
  <Link to="/dashboard/new-account" className="content-header-button">
    <div className="content-header-button-icon">
      <i className="material-icons flipped">add</i>
    </div>
    <div className="content-header-button-text">account</div>
  </Link>
);

class ActionBar extends Component<*, *> {
  props: {
    openCloseProfile: Function,
    openCloseEdit: Function,
    saveProfile: Function
  };
  static contextTypes = {
    translate: PropTypes.func.isRequired
  };

  render() {
    // FIXME introduce a component for i18n
    const t = this.context.translate;

    return (
      <div className="ActionBar">
        <ProfileCard />
        <Route path="*/new-account" component={AccountCreation} />
        <div className="content-header">
          <div className="content-header-left">
            <img
              src="/img/logo.png"
              srcSet="/img/logo@2x.png 2x, /img/logo@3x.png 3x"
              className="content-header-logo"
              alt="Ledger Vault logo"
            />
          </div>
          <div className="content-header-right">
            <Route path="/dashboard" render={() => <NewAccountLink />} />
            <Link to="/export" className="content-header-button">
              <div className="content-header-button-icon">
                <i className="material-icons flipped">reply</i>
              </div>
              <div className="content-header-button-text">
                {t("actionBar.export")}
              </div>
            </Link>
            <Link to="/settings" className="content-header-button">
              <div className="content-header-button-icon">
                <i className="material-icons">settings</i>
              </div>
              <div className="content-header-button-text">
                {t("actionBar.settings")}
              </div>
            </Link>
            <Link to="/activity" className="content-header-button">
              <div className="content-header-button-icon">
                <i className="material-icons">notifications</i>
              </div>
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

export default withRouter(ActionBar);
