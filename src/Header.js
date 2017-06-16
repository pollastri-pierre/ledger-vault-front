import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';

import './Header.css';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: false,
    };

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
    let content;

    if (this.state.profile) {
      const profile = this.state.profile.results[0];

      content = (
        <a href="profile" className="profile-card">
          <div className="profile-pic">
            <img src={profile.picture.thumbnail} alt="" />
          </div>
          <div className="profile-info">
            <div className="profile-name">{`${profile.name.first} ${profile.name.last}`}</div>
            <div className="profile-view-profile">View profile</div>
          </div>
        </a>);
    } else {
      content = <CircularProgress />;
    }

    return (
      <div className="Header">
        { content }
      </div>
    );
  }
}

export default Header;
