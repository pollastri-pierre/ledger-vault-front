//@flow
import React, { Component } from "react";
import PropTypes from "prop-types";
import emailValidator from "email-validator";
import Dropzone from "react-dropzone";
import { withRouter } from "react-router-dom";
import rectCrop from "rect-crop";
import connectData from "../../restlay/connectData";
import { TextField } from "../../components";
import DialogButton from "../../components/buttons/DialogButton";
import ProfileIcon from "../icons/thin/Profile";
import ProfileQuery from "../../api/queries/ProfileQuery";
import SaveProfile from "../../api/mutations/SaveProfileMutation";
import SpinnerCard from "../../components/spinners/SpinnerCard";

import type { Member } from "../../data/types";

type Validator = (value: string) => boolean;

const validateName: Validator = name => typeof name === "string" && name !== "";
const validateMail: Validator = email => emailValidator.validate(email);

const validators: { [_: string]: Validator } = {
  first_name: validateName,
  last_name: validateName,
  email: validateMail,
  picture: _ => true
};

class ProfileEditModal extends Component<
  {
    profile: Member,
    restlay: *,
    history: *,
    close: Function
  },
  *
> {
  static contextTypes = {
    translate: PropTypes.func.isRequired
  };
  _unmounted = false;

  constructor(props) {
    super();
    const state = {};
    ["first_name", "last_name", "email", "picture"].forEach(key => {
      const value = props.profile[key];
      state[key] = {
        value,
        isValid: validators[key](value)
      };
    });
    this.state = state;
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  onDrop = (files: *) => {
    if (files.length) {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 160;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = files[0].preview;
      img.onload = () => {
        if (this._unmounted) return;
        const [x, y, w, h] = rectCrop.largest(canvas, img);
        ctx.drawImage(img, x, y, w, h, 0, 0, canvas.width, canvas.height);
        const value = canvas.toDataURL();
        this.setState({ picture: { value, isValid: true } });
      };
    }
  };

  updateField = ({ target: { name, value } }: *) => {
    this.setState({
      [name]: {
        value,
        isValid: validators[name](value)
      }
    });
  };

  save = () =>
    this.props.restlay
      .commitMutation(
        new SaveProfile({
          first_name: this.state.first_name.value,
          last_name: this.state.last_name.value,
          email: this.state.email.value,
          picture: this.state.picture.value
        })
      )
      .then(this.props.close);

  render() {
    const t = this.context.translate;
    const error =
      !this.state.first_name.isValid ||
      !this.state.last_name.isValid ||
      !this.state.email.isValid;

    return (
      <div className="Profile">
        <div className="profile-title">{t("profile.title")}</div>
        <div className="profile-body">
          <Dropzone
            style={{
              width: "initial",
              height: "initial",
              border: "none",
              cursor: "pointer"
            }}
            accept="image/jpeg, image/png"
            onDrop={this.onDrop}
          >
            <div className="profile-pic">
              {this.state.picture.value ? (
                <img src={this.state.picture.value} alt="" />
              ) : (
                <ProfileIcon className="profile-default-icon" color="white" />
              )}
            </div>
          </Dropzone>
          <div className="profile-form">
            <TextField
              name="first_name"
              className="profile-form-name"
              placeholder={t("profile.firstName")}
              value={this.state.first_name.value}
              error={!this.state.first_name.isValid}
              onChange={this.updateField}
              style={{
                fontWeight: 600,
                width: "45%"
              }}
            />
            <TextField
              name="last_name"
              className="profile-form-name"
              placeholder={t("profile.lastName")}
              value={this.state.last_name.value}
              error={!this.state.last_name.isValid}
              onChange={this.updateField}
              style={{
                fontWeight: 600,
                width: "46%",
                marginLeft: "28px"
              }}
            />
            <br />
            <br />
            <TextField
              name="email"
              placeholder={t("profile.mail")}
              value={this.state.email.value}
              hasError={!this.state.email.isValid}
              onChange={this.updateField}
            />
            <div className="profile-role">{t("role.administrator")}</div>
          </div>
        </div>
        <div style={{ height: "50px" }} />
        <DialogButton onTouchTap={this.props.close}>
          {t("common.cancel")}
        </DialogButton>
        <DialogButton highlight right onTouchTap={error ? null : this.save}>
          {t("common.save")}
        </DialogButton>
      </div>
    );
  }
}

const RenderLoading = () => {
  return (
    <div style={{ width: "520px", height: "320px" }}>
      <SpinnerCard />
    </div>
  );
};

export default withRouter(
  connectData(ProfileEditModal, {
    RenderLoading,
    queries: {
      profile: ProfileQuery
    }
  })
);
