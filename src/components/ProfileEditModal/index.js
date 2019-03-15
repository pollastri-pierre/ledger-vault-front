// @flow
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import connectData from "restlay/connectData";
import ProfileQuery from "api/queries/ProfileQuery";
import SaveProfile from "api/mutations/SaveProfileMutation";
import SpinnerCard from "components/spinners/SpinnerCard";
import EditProfile from "components/EditProfile";
import type { Member } from "data/types";

class ProfileEditModal extends Component<{
  profile: Member,
  restlay: *,
  close: Function,
}> {
  save = data =>
    this.props.restlay
      .commitMutation(
        new SaveProfile({
          first_name: data.first_name.value,
          last_name: data.last_name.value,
          email: data.email.value,
          picture: data.picture.value,
        }),
      )
      .then(this.props.close);

  render() {
    return (
      <EditProfile
        profile={this.props.profile}
        title="Edit profile"
        onSubmit={this.save}
        close={this.props.close}
        labelSubmit="save"
      />
    );
  }
}

const RenderLoading = () => (
  <div style={{ width: "520px", height: "320px" }}>
    <SpinnerCard />
  </div>
);

export default withRouter(
  connectData(ProfileEditModal, {
    RenderLoading,
    queries: {
      profile: ProfileQuery,
    },
  }),
);
