// @flow
import React, { Component } from "react";
import { translate } from "react-i18next";
import emailValidator from "email-validator";
// import Dropzone from "react-dropzone";
import rectCrop from "rect-crop";
import TextField from "components/utils/TextField";
import DialogButton from "components/buttons/DialogButton";
import ProfileIcon from "components/icons/thin/Profile";
import { withStyles } from "@material-ui/core/styles";
import modals from "shared/modals";
import colors from "shared/colors";

import type { Member, Translate } from "data/types";

type Validator = (value: string) => boolean;

const hasMoreThanAscii = str =>
  str.split("").some(char => char.charCodeAt(0) > 127);

const validateName: Validator = name => name !== "" && !hasMoreThanAscii(name);

const validateUsername: Validator = name =>
  validateName(name) && name.length < 19;

const validateMail: Validator = email => emailValidator.validate(email);

const validators: { [_: string]: Validator } = {
  username: validateUsername,
  email: validateMail,
  picture: _ => true,
};

const sanitize = (object: Object): Object => ({
  email: object.email.value,
  username: object.username.value,
  picture: object.picture.value,
});

const errorDesc = {
  base: {
    position: "absolute",
    fontSize: "11px",
    color: "rgb(234, 46, 73)",
  },
};

const ErrorDesc = withStyles(errorDesc)(
  ({
    visible,
    children,
    classes,
  }: {
    visible: boolean,
    children: *,
    classes: { [_: $Keys<typeof errorDesc>]: string },
  }) => (visible ? <div className={classes.base}>{children}</div> : null),
);

export const styles = {
  base: {
    ...modals.base,
    paddingBottom: 0,
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
      borderRadius: "50%",
    },
  },
  profileBody: {
    marginTop: 35,
  },
  profileForm: {
    marginLeft: 120,
    width: 320,
    fontSize: 13,
  },
  role: {
    marginTop: 20,
    fontSize: 11,
    color: colors.lead,
  },
  icon: {
    width: 28,
    marginTop: "30%",
    marginLeft: "33%",
  },
};
class ProfileEditModal extends Component<
  {
    profile: Member,
    close: Function,
    t: Translate,
    classes: Object,
    title: string,
    labelSubmit: string,
    onSubmit: Function,
  },
  *,
> {
  _unmounted = false;

  constructor(props) {
    super();
    const state = {};
    ["username", "email", "picture"].forEach(key => {
      const value = props.profile[key];
      state[key] = {
        value,
        isValid: true,
      };
    });
    this.state = state;
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  onDrop = (files: Array<File>): mixed => {
    if (files.length) {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 160; // eslint-disable-line no-multi-assign
      const ctx = canvas.getContext("2d");
      const img = new Image();
      // @$FlowFixMe
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
        isValid: validators[name](value),
      },
    });
  };

  isEmpty = () =>
    this.state.username.value === "" || this.state.email.value === "";

  render() {
    const { classes, title, labelSubmit, t } = this.props;
    const error = !this.state.username.isValid || !this.state.email.isValid;

    return (
      <div className={classes.base}>
        <div>{title}</div>
        <div className={classes.profileBody}>
          <div>
            <div className={classes.profilePic}>
              {this.state.picture.value ? (
                <img src={this.state.picture.value} alt="" />
              ) : (
                <ProfileIcon className={classes.icon} color="white" />
              )}
            </div>
          </div>
          {/* </Dropzone> */}
          <div className={classes.profileForm}>
            <TextField
              name="username"
              placeholder={t("profile:username")}
              value={this.state.username.value}
              error={!this.state.username.isValid}
              onChange={this.updateField}
              inputProps={{
                style: {
                  fontWeight: 600,
                  color: "black",
                  width: "100%",
                },
              }}
            />
            <ErrorDesc visible={!this.state.username.isValid}>
              Only ASCII char, 19 length max
            </ErrorDesc>
            <br />
            <br />
            <TextField
              name="email"
              placeholder={t("profile:mail")}
              fullWidth
              value={this.state.email.value}
              error={!this.state.email.isValid}
              onChange={this.updateField}
              inputProps={{
                style: {
                  fontWeight: 600,
                  color: "black",
                },
              }}
            />
            <div className={classes.role}>{t("common:administrator")}</div>
          </div>
        </div>
        <div style={{ height: "50px" }} />
        <DialogButton onTouchTap={this.props.close}>
          {t("common:cancel")}
        </DialogButton>
        <DialogButton
          highlight
          right
          disabled={error || this.isEmpty()}
          onTouchTap={
            error ? null : () => this.props.onSubmit(sanitize(this.state))
          }
        >
          {labelSubmit}
        </DialogButton>
      </div>
    );
  }
}

export default withStyles(styles)(translate()(ProfileEditModal));
