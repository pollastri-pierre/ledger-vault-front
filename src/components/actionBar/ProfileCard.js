//@flow
import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import type { Member } from "../../datatypes";
import Profile from "../../components/profile/Profile";
import { BlurDialog } from "../../containers";
import { Link } from "react-router-dom";
import PopBubble from "../utils/PopBubble";
import ProfileIcon from "../icons/thin/Profile";
import CircularProgress from "material-ui/CircularProgress";
import connectData from "../../decorators/connectData";
import api from "../../data/api-spec";

class ProfileCard extends Component<
  {
    profile: Member,
    fetchData: Function,
    history: *
  },
  *
> {
  state = {
    profileOpened: false
  };

  // FIXME translate should be a component so i don't have to depend on context
  static contextTypes = {
    translate: PropTypes.func.isRequired
  };

  profileRef: *;

  onProfileRef = (ref: *) => {
    this.profileRef = ref;
  };

  openProfileDialog = (event: *) => {
    event.preventDefault();
    this.setState({
      profileOpened: false
    });
  };

  onCloseBubble = () => {
    this.setState({ profileOpened: false });
  };

  onCloseProfileEdit = () => {
    this.props.history.goBack();
  };

  onClickProfileCard = (event: *) => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState(({ profileOpened }) => ({
      profileOpened: !profileOpened
    }));
  };

  saveProfile = (error, profile: Member) =>
    this.props.fetchData(api.saveProfile, profile);

  render() {
    const { profile } = this.props;
    const t = this.context.translate;
    return (
      <span>
        <a
          href="profile"
          className="profile-card"
          onClick={this.onClickProfileCard}
          ref={this.onProfileRef}
        >
          <div className="profile-pic">
            {profile.picture ? (
              <img src={profile.picture} alt="" />
            ) : (
              <ProfileIcon className="profile-default-icon" color="white" />
            )}
          </div>
          <div className="profile-info">
            <div className="profile-name">
              {profile.first_name} {profile.last_name}
            </div>
            <div className="profile-view-profile">
              {t("actionBar.viewProfile")}
            </div>
          </div>
        </a>

        <PopBubble
          anchorEl={this.profileRef}
          open={this.state.profileOpened}
          onRequestClose={this.onCloseBubble}
          style={{
            boxShadow:
              "0 0 5px 0 rgba(0, 0, 0, 0.04), 0 10px 10px 0 rgba(0, 0, 0, 0.04)"
          }}
        >
          <div className="profile-bubble" onClick={this.onCloseBubble}>
            <Link to="profile-edit">{t("actionBar.editProfile")}</Link>
            <Link to="/logout">{t("actionBar.logOut")}</Link>
          </div>
        </PopBubble>

        <Route
          path="*/profile-edit"
          render={() => (
            <BlurDialog open onRequestClose={this.onCloseProfileEdit}>
              <Profile
                profile={profile}
                close={this.onCloseProfileEdit}
                save={this.saveProfile}
              />
            </BlurDialog>
          )}
        />
      </span>
    );
  }
}

const RenderLoading = () => (
  <div className="profile-card">
    <CircularProgress />
  </div>
);

export default withRouter(
  connectData(ProfileCard, {
    RenderLoading,
    api: {
      profile: api.profile
    }
  })
);
