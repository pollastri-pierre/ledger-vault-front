import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { PopBubble, Divider, Profile } from '../../components';
import { BlurDialog } from '../../containers';
import translate from '../../decorators/Translate';

import './ActionBar.css';

class ActionBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: false,
      openProfileMenu: false,
      openProfileDialog: false,
    };
  }

  componentWillMount() {
    // fetchProfile();
    // this.props.fetch();
  }

  openProfileMenu = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      openProfileMenu: true,
      anchorEl: event.currentTarget.querySelector('.profile-pic'),
    });
  };

  closeProfileMenu = () => {
    this.setState({ openProfileMenu: false });
  };

  openProfileDialog = (event) => {
    event.preventDefault();

    this.setState({
      openProfileMenu: false,
      openProfileDialog: true,
    });
  };

  closeProfileDialog = () => {
    this.setState({ openProfileDialog: false });
  };

  saveProfile = (profile) => {
    console.log(profile);
    this.closeProfileDialog();
  };

  render() {
    // let profile;
    let profileCard;
    let profileDialog = '';

    const t = this.props.translate;

    if (!_.isEmpty(this.props.profile)) {
      // Displayed when profile is loaded
      // profile = this.state.profile.results[0];
      const profile = this.props.profile;

      profileCard = (
        <a href="profile" className="profile-card" onClick={this.openProfileMenu} >
          <div className="profile-pic">
            <img src={false} alt="" />
          </div>
          <div className="profile-info">
            <div className="profile-name">{`${profile.first_name} ${profile.last_name}`}</div>
            <div className="profile-view-profile">{t('actionBar.viewProfile')}</div>
          </div>
        </a>
      );

      profileDialog = (
        <BlurDialog
          open={this.state.openProfileDialog}
          onRequestClose={this.closeProfileDialog}
        >
          <Profile
            profile={profile}
            close={this.closeProfileDialog}
            save={this.saveProfile}
          />
        </BlurDialog>
      );
    } else {
      // Displayed while profile is loading
      profileCard = (
        <div className="profile-card">
          <CircularProgress />
        </div>
      );
    }

    return (
      <div className="ActionBar">
        { profileCard }
        <PopBubble
          open={this.state.openProfileMenu}
          anchorEl={this.state.anchorEl}
          onRequestClose={this.closeProfileMenu}
          style={{
            marginLeft: '50px',
          }}
        >
          <div className="profile-bubble">
            <div className="profile-bubble-title">{t('actionBar.myProfile')}</div>
            <div className="profile-bubble-role">{t('role.administrator')}</div>
            <Divider className="profile-bubble-divider" />
            <a href="profile" onClick={this.openProfileDialog}>{t('actionBar.editProfile')}</a>
            <Link to="/logout">{t('actionBar.logOut')}</Link>
          </div>
        </PopBubble>
        { profileDialog }
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
                {t('actionBar.export')}
              </div>
            </Link>
            <Link to="/settings" className="content-header-button">
              <div className="content-header-button-icon">
                <i className="material-icons">settings</i>
              </div>
              <div className="content-header-button-text">
                {t('actionBar.settings')}
              </div>
            </Link>
            <Link to="/activity" className="content-header-button">
              <div className="content-header-button-icon">
                <i className="material-icons">notifications</i>
              </div>
              <div className="content-header-button-text">
                {t('actionBar.activity')}
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
  profile: PropTypes.shape({}).isRequired,
};

export default translate(ActionBar);
