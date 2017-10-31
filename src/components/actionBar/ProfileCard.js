//@flow
import React, { Component } from "react";
import PropTypes from "prop-types";
import type { Member } from "../../datatypes";
import Profile from "../../components/profile/Profile";
import { BlurDialog } from "../../containers";
import ProfileIcon from "../icons/thin/Profile";
import CircularProgress from "material-ui/CircularProgress";
import connectData from "../../decorators/connectData";
import api from "../../data/api-spec";

class ProfileCard extends Component<{
  profileOpenedEdit: boolean,
  profile: Member,
  fetchData: Function,
  openCloseProfile: Function,
  openCloseEdit: Function
}> {
  // FIXME translate should be a component so i don't have to depend on context
  static contextTypes = {
    translate: PropTypes.func.isRequired
  };

  openProfileMenu = (event: *) => {
    // This prevents ghost click.
    event.preventDefault();
    this.props.openCloseProfile(
      event.currentTarget.querySelector(".profile-pic")
    );
  };

  saveProfile = (error, profile: Member) =>
    this.props
      .fetchData(api.saveProfile, profile)
      .then(() => this.props.openCloseEdit());
  // on fail, we need to trigger an error message. (also how can we generalize that?)

  render() {
    const { profile, profileOpenedEdit, openCloseEdit } = this.props;
    const t = this.context.translate;
    return (
      <span>
        <a
          href="profile"
          className="profile-card"
          onClick={this.openProfileMenu}
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

        <BlurDialog open={profileOpenedEdit} onRequestClose={openCloseEdit}>
          <Profile
            profile={profile}
            close={openCloseEdit}
            save={this.saveProfile}
          />
        </BlurDialog>
      </span>
    );
  }
}

const RenderLoading = () => (
  <div className="profile-card">
    <CircularProgress />
  </div>
);

export default connectData(ProfileCard, {
  RenderLoading,
  api: {
    profile: api.profile
  }
});
