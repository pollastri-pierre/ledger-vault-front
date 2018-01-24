//@flow
import React, { Component } from "react";
import PropTypes from "prop-types";
import emailValidator from "email-validator";
import Dropzone from "react-dropzone";
import { withRouter } from "react-router-dom";
import rectCrop from "rect-crop";
import connectData from "restlay/connectData";
import { TextField } from "components";
import DialogButton from "components/buttons/DialogButton";
import ProfileIcon from "components/icons/thin/Profile";
import ProfileQuery from "api/queries/ProfileQuery";
import SaveProfile from "api/mutations/SaveProfileMutation";
import SpinnerCard from "components/spinners/SpinnerCard";
import { withStyles } from "material-ui/styles";
import modals from "shared/modals";
import colors from "shared/colors";

import type { Member } from "data/types";

type Validator = (value: string) => boolean;

const validateName: Validator = name => typeof name === "string" && name !== "";
const validateMail: Validator = email => emailValidator.validate(email);

const validators: { [_: string]: Validator } = {
  first_name: validateName,
  last_name: validateName,
  email: validateMail,
  picture: _ => true
};

export const styles = {
  base: {
    ...modals.base,
    paddingBottom: 0
  },
  profilePic: {
    width: 80,
    height: 80,
    float: "left",
    borderRadius: "50%",
    backgroundColor: colors.argile,
    "& img": {
      width: "100%",
      height: "100%",
      borderRadius: "50%"
    }
  },
  profileBody: {
    marginTop: 35
  },
  profileForm: {
    marginLeft: 120,
    width: 320,
    fontSize: 13
  },
  role: {
    marginTop: 20,
    fontSize: 11,
    color: colors.lead
  },
  icon: {
    width: 28,
    marginTop: "30%",
    marginLeft: "33%"
  }
};
class ProfileEditModal extends Component<
  {
    profile: Member,
    close: Function,
    classes: Object,
    title: string,
    labelSubmit: string,
    onSubmit: Function
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
        isValid: true
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

  isEmpty = () => {
    return (
      this.state.first_name.value === "" ||
      this.state.last_name.value === "" ||
      this.state.email.value === ""
    );
  };

  render() {
    const t = this.context.translate;
    const { classes, title, labelSubmit } = this.props;
    const error =
      !this.state.first_name.isValid ||
      !this.state.last_name.isValid ||
      !this.state.email.isValid;

    return (
      <div className={classes.base}>
        <div>{title}</div>
        <div className={classes.profileBody}>
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
            <div className={classes.profilePic}>
              {this.state.picture.value ? (
                <img src={this.state.picture.value} alt="" />
              ) : (
                <ProfileIcon className={classes.icon} color="white" />
              )}
            </div>
          </Dropzone>
          <div className={classes.profileForm}>
            <TextField
              name="first_name"
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
              fullWidth
              value={this.state.email.value}
              error={!this.state.email.isValid}
              onChange={this.updateField}
            />
            <div className={classes.role}>{t("role.administrator")}</div>
          </div>
        </div>
        <div style={{ height: "50px" }} />
        <DialogButton onTouchTap={this.props.close}>
          {t("common.cancel")}
        </DialogButton>
        <DialogButton
          highlight
          right
          disabled={error || this.isEmpty()}
          onTouchTap={error ? null : () => this.props.onSubmit(this.state)}
        >
          {labelSubmit}
        </DialogButton>
      </div>
    );
  }
}

export default withStyles(styles)(ProfileEditModal);
