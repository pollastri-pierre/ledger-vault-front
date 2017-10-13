import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert } from '../components';
import { closeMessage } from '../redux/modules/alerts';
import { AUTHENTICATION_SUCCEED, CHECK_TEAM_ERROR, AUTHENTICATION_FAILED, AUTHENTICATION_FAILED_API, AUTHENTICATION_FAILED_TIMEOUT, LOGOUT } from '../redux/modules/auth';
import { SAVE_PROFILE_INVALID, SAVE_PROFILE_FAIL, SAVED_PROFILE } from '../redux/modules/profile';
import { GOT_OPERATION_FAIL } from '../redux/modules/operations';
import { SAVED_ACCOUNT } from '../redux/modules/account-creation';

const mapStateToProps = state => ({
  alerts: state.alerts,
});

const mapDispatchToProps = dispatch => ({
  onClose: id => dispatch(closeMessage(id)),
});

export const getTitle = (id, alerts, translate) => {
  const message = _.find(alerts, { id });
  if (message && message.title) {
    return translate(message.title);
  }

  return '';
};

export const getTheme = (id, alerts) => {
  const message = _.find(alerts, { id });
  if (message && message.type) {
    return message.type;
  }

  return '';
};

export const getContent = (id, alerts, translate) => {
  const message = _.find(alerts, { id });
  if (message && message.content) {
    return translate(message.content);
  }
  return '';
};

const hasError = (id, alerts) => !_.isUndefined(_.find(alerts, { id }));

export const allMessages = [
  SAVED_ACCOUNT,
  CHECK_TEAM_ERROR,
  AUTHENTICATION_FAILED,
  AUTHENTICATION_FAILED_API,
  AUTHENTICATION_FAILED_TIMEOUT,
  LOGOUT,
  GOT_OPERATION_FAIL,
  AUTHENTICATION_SUCCEED,
  SAVE_PROFILE_INVALID,
  SAVE_PROFILE_FAIL,
  SAVED_PROFILE,
];

export function MessagesContainer(props, context) {
  const alerts = props.alerts.alerts;
  const cache = props.alerts.cache;

  const { translate } = context;
  return (
    <div>
      {
        _.map(allMessages, message => (
          <Alert
            onRequestClose={() => props.onClose(message)}
            open={hasError(message, alerts)}
            autoHideDuration={4000}
            title={getTitle(message, cache, translate)}
            theme={getTheme(message, cache)}
            key={message}
          >
            <div>{getContent(message, cache, translate)}</div>
          </Alert>
        ))
      }
    </div>
  );
}

MessagesContainer.propTypes = {
  alerts: PropTypes.shape({
    alerts: PropTypes.array,
    cache: PropTypes.array,
  }).isRequired,
};

MessagesContainer.contextTypes = {
  translate: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(MessagesContainer);

