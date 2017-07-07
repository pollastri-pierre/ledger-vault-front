import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';
import { Link } from 'react-router-dom';
import translate from './translate';

import './ActionBar.css';

class ActionBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: false,
    };

    this.t = this.props.translate;
    this.fetchProfile();
  }

  fetchProfile() {
    const apiUrl = 'https://randomuser.me/api/';

    fetch(apiUrl).then(
      result => result.json()).then(
      (json) => {
        this.setState({ profile: json });
      });
  }

  render() {
    let profileCard;

    if (this.state.profile) {
      const profile = this.state.profile.results[0];

      profileCard = (
        <Link to="profile" className="profile-card">
          <div className="profile-pic">
            <img src={profile.picture.thumbnail} alt="" />
          </div>
          <div className="profile-info">
            <div className="profile-name">{`${profile.name.first} ${profile.name.last}`}</div>
            <div className="profile-view-profile">{this.t('actionBar.viewProfile')}</div>
          </div>
        </Link>);
    } else {
      profileCard = <CircularProgress />;
    }

    return (
      <div className="ActionBar">
        { profileCard }
        <div className="content-header">
          <div className="content-header-left">
            <img
              src="img/logo.png"
              srcSet="img/logo@2x.png 2x, img/logo@3x.png 3x"
              className="content-header-logo"
              alt="Ledger Vault logo"
            />
          </div>
          <div className="content-header-right">
            <Link to="/export" className="content-header-button">
              <div className="content-header-button-icon">
                <i className="material-icons flipped">reply</i>
              </div>
              <div className="content-header-button-text">
                {this.t('actionBar.export')}
              </div>
            </Link>
            <Link to="/settings" className="content-header-button">
              <div className="content-header-button-icon">
                <i className="material-icons">settings</i>
              </div>
              <div className="content-header-button-text">
                {this.t('actionBar.settings')}
              </div>
            </Link>
            <Link to="/activity" className="content-header-button">
              <div className="content-header-button-icon">
                <i className="material-icons">notifications</i>
              </div>
              <div className="content-header-button-text">
                {this.t('actionBar.activity')}
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

ActionBar.propTypes = {
  translate: PropTypes.func.isRequired,
};

export default translate(ActionBar);
