import React, { Component } from 'react';
import PropTypes from 'prop-types';
import emailValidator from 'email-validator';
import Dropzone from 'react-dropzone';
import Script from 'react-load-script';
import { TextField, Alert } from '../../components';
import DialogButton from '../../components/buttons/DialogButton';

import './Profile.css';

class Profile extends Component {
  constructor(props, context) {
    super(props);

    this.state = {
      first_name: {
        value: this.props.profile.first_name,
        isValid: this.validateName(this.props.profile.first_name),
      },
      last_name: {
        value: this.props.profile.last_name,
        isValid: this.validateName(this.props.profile.last_name),
      },
      email: {
        value: this.props.profile.email,
        isValid: this.validateMail(this.props.profile.email),
      },
      picture: {
        value: this.props.profile.picture,
      },
      alert: {},
      alertOpen: false,
    };

    this.t = context.translate;
  }

  onDrop = (files) => {
    if (files.length) {
      /* global Jimp */
      Jimp.read(files[0].preview).then((image) => {
        image.cover(100, 100).getBase64(Jimp.MIME_JPEG, (err, base64) => {
          if (err) throw err;

          this.setState({
            picture: {
              value: base64,
            },
          });
        });
      }).catch((err) => {
        throw err;
      });
    }
  };

  validateName = name => (typeof name === 'string' && name !== '');

  validateMail = email => (emailValidator.validate(email));

  updateName = (event) => {
    const key = event.target.id === 'profile-form-name-first' ? 'first_name' : 'last_name';

    this.setState({
      [key]: {
        value: event.target.value,
        isValid: this.validateName(event.target.value),
      },
    });
  };

  updateMail = (event) => {
    this.setState({
      email: {
        value: event.target.value,
        isValid: this.validateMail(event.target.value),
      },
    });
  };

  save = () => {
    if (!this.state.first_name.isValid
      || !this.state.last_name.isValid
      || !this.state.email.isValid) {
      this.setState({
        alert: {
          theme: 'error',
          title: 'oops',
          message: 'Lipsum, mec.',
        },
        alertOpen: true,
      });
    } else {
      const newProfile = {
        first_name: this.state.first_name.value,
        last_name: this.state.last_name.value,
        email: this.state.email.value,
        picture: this.state.picture.value,
      };

      this.props.save(newProfile);
    }
  };

  closeAlert = () => {
    this.setState({ alertOpen: false });
  };

  render() {
    return (
      <div className="Profile">
        <div className="profile-title">{this.t('profile.title')}</div>
        <div className="profile-body">
          <Dropzone
            style={{
              width: 'initial',
              height: 'initial',
              border: 'none',
              cursor: 'pointer',
            }}
            accept="image/jpeg, image/png"
            onDrop={this.onDrop}
          >
            <div className="profile-pic"><img src={this.state.picture.value} alt="" /></div>
          </Dropzone>
          <div className="profile-form">
            <TextField
              id="profile-form-name-first"
              className="profile-form-name"
              hintText={this.t('profile.firstName')}
              value={this.state.first_name.value}
              hasError={!this.state.first_name.isValid}
              onChange={this.updateName}
              style={{
                fontWeight: 600,
              }}
            />
            <TextField
              id="profile-form-name-last"
              className="profile-form-name"
              hintText={this.t('profile.lastName')}
              value={this.state.last_name.value}
              hasError={!this.state.last_name.isValid}
              onChange={this.updateName}
              style={{
                fontWeight: 600,
              }}
            />
            <br />
            <TextField
              id="profile-form-mail"
              hintText={this.t('profile.mail')}
              value={this.state.email.value}
              hasError={!this.state.email.isValid}
              onChange={this.updateMail}
            />
            <div className="profile-role">{this.t('role.administrator')}</div>
          </div>
        </div>
        <div style={{ height: '50px' }} />
        <DialogButton onTouchTap={this.props.close}>{this.t('common.cancel')}</DialogButton>
        <DialogButton highlight right onTouchTap={this.save}>{this.t('common.save')}</DialogButton>
        <Alert
          open={this.state.alertOpen}
          onRequestClose={this.closeAlert}
          theme={this.state.alert.theme}
          title={this.state.alert.title}
        >
          {this.state.alert.message}
        </Alert>
        <Script
          // Lib for cropping and converting new profile pic
          url="scripts/jimp.min.js"
        />
      </div>
    );
  }
}

Profile.propTypes = {
  profile: PropTypes.shape({
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    picture: PropTypes.string,
  }).isRequired,
  save: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

Profile.defaultProps = {
  profile: {
    picture: '',
  },
};

Profile.contextTypes = {
  translate: PropTypes.func.isRequired,
};

export default Profile;
