import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';
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
        <a href="profile" className="profile-card">
          <div className="profile-pic">
            <img src={profile.picture.thumbnail} alt="" />
          </div>
          <div className="profile-info">
            <div className="profile-name">{`${profile.name.first} ${profile.name.last}`}</div>
            <div className="profile-view-profile">{this.t('actionBar.viewProfile')}</div>
          </div>
        </a>);
    } else {
      profileCard = <CircularProgress />;
    }

    return (
      <div className="ActionBar">
        { profileCard }
        <div className="content-header">
          <div className="content-header-left">
            <div className="content-header-title">
              Marketing
            </div>
            <div className="content-header-subtitle">
              {this.t('actionBar.overview')}
            </div>
          </div>
          <div className="content-header-right">
            <a className="content-header-button" href="/export">
              <div className="content-header-button-icon">
                <i className="material-icons flipped">reply</i>
              </div>
              <div className="content-header-button-text">
                {this.t('actionBar.export')}
              </div>
            </a>
            <a className="content-header-button" href="/settings">
              <div className="content-header-button-icon">
                <i className="material-icons">settings</i>
              </div>
              <div className="content-header-button-text">
                {this.t('actionBar.settings')}
              </div>
            </a>
            <a className="content-header-button" href="/activity">
              <div className="content-header-button-icon">
                <i className="material-icons">notifications</i>
              </div>
              <div className="content-header-button-text">
                {this.t('actionBar.activity')}
              </div>
            </a>
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
