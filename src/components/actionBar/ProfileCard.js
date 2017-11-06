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
    history: *,
    location: *
  },
  *
> {
  state = {
    bubbleOpened: false
  };

  // FIXME translate should be a component so i don't have to depend on context
  static contextTypes = {
    translate: PropTypes.func.isRequired
  };

  anchorEl: *;

  onProfileRef = (ref: *) => {
    this.anchorEl = ref;
  };

  onCloseBubble = () => {
    this.setState({ bubbleOpened: false });
  };

  onCloseProfileEdit = () => {
    this.props.history.goBack();
  };

  onClickProfileCard = (/* event: * */) => {
    this.setState({
      bubbleOpened: !this.state.bubbleOpened
    });
  };

  saveProfile = (error, profile: Member) =>
    this.props
      .fetchData(api.saveProfile, profile)
      .then(() => this.onCloseProfileEdit());

  render() {
    const { profile, location } = this.props;
    const { bubbleOpened } = this.state;
    const t = this.context.translate;
    return (
      <span>
        <span
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
        </span>

        <PopBubble
          anchorEl={this.anchorEl}
          open={bubbleOpened}
          onRequestClose={this.onCloseBubble}
          style={{
            boxShadow:
              "0 0 5px 0 rgba(0, 0, 0, 0.04), 0 10px 10px 0 rgba(0, 0, 0, 0.04)"
          }}
        >
          <div className="profile-bubble" onClick={this.onCloseBubble}>
            <Link to={location.pathname + "/profile-edit"}>
              {t("actionBar.editProfile")}
            </Link>
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
