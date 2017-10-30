//@flow
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { PopBubble } from "../../components";
import ProfileCard from "./ProfileCard";
import type { Member } from "../../datatypes";

import "./ActionBar.css";

class ActionBar extends Component<*, *> {
  props: {
    openCloseProfile: Function,
    openCloseEdit: Function,
    saveProfile: Function,
    pathname: string,
    openAccount: Function
  };
  state = {
    profileOpened: false,
    profileOpenedEdit: false,
    profileTarget: null
  };

  static contextTypes = {
    translate: PropTypes.func.isRequired
  };

  openProfileDialog = (event: *) => {
    event.preventDefault();
    this.openCloseProfile();
    this.openCloseEdit();
  };

  openCloseProfile = (profileTarget: *) => {
    this.setState(({ profileOpened }) => ({
      profileOpened: !profileOpened,
      profileTarget
    }));
  };

  openCloseEdit = () => {
    this.setState(({ profileOpenedEdit }) => ({
      profileOpenedEdit: !profileOpenedEdit
    }));
  };

  render() {
    const { profileOpened, profileTarget, profileOpenedEdit } = this.state;
    const t = this.context.translate;
    return (
      <div className="ActionBar">
        <ProfileCard
          openCloseProfile={this.openCloseProfile}
          openCloseEdit={this.openCloseEdit}
          profileOpenedEdit={profileOpenedEdit}
        />
        <PopBubble
          open={profileOpened}
          anchorEl={profileTarget}
          onRequestClose={this.openCloseProfile}
          style={{
            marginLeft: "50px",
            boxShadow:
              "0 0 5px 0 rgba(0, 0, 0, 0.04), 0 10px 10px 0 rgba(0, 0, 0, 0.04)"
          }}
        >
          <div className="profile-bubble">
            <a
              href="profile"
              onClick={this.openProfileDialog}
              className="edit-profile"
            >
              {t("actionBar.editProfile")}
            </a>
            <Link to="/logout" className="log-out">
              {t("actionBar.logOut")}
            </Link>
          </div>
        </PopBubble>
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
            {this.props.pathname === "/" ? (
              <Link
                to=""
                onClick={this.props.openAccount}
                className="content-header-button"
              >
                <div className="content-header-button-icon">
                  <i className="material-icons flipped">add</i>
                </div>
                <div className="content-header-button-text">account</div>
              </Link>
            ) : (
              false
            )}
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

export default ActionBar;
