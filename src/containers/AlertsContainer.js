import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import isEmpty from 'lodash/isEmpty';
import { Alert } from '../components';
import { connect } from 'react-redux';
import { closeMessage } from '../redux/modules/alerts';
import { CHECK_TEAM_ERROR, AUTHENTICATION_FAILED, LOGOUT} from '../redux/modules/auth';
import _ from 'lodash';

const mapStateToProps = state => ({ 
  alerts: state.alerts
});

const mapDispatchToProps = (dispatch) => {
  return {
    onClose: (id) => dispatch(closeMessage(id)),
  }
};

export const getTitle = (id, alerts, translate) => {
  const message = _.find(alerts, {id: id});
  if (message && message.title) {
    return translate(message.title);
  }
  else {
    return ''
  }
};

export const getTheme = (id, alerts) => {
  const message = _.find(alerts, {id: id});
  if (message && message.type) {
    return message.type;
  }
  else {
    return ''
  }
};

export const getContent = (id, alerts, translate) => {
  const message = _.find(alerts, {id: id});
  if (message && message.content) {
    return translate(message.content);
  }
  else {
    return ''
  }
};

const hasError = (id, alerts) => {
  return !_.isUndefined(_.find(alerts, {id: id}));
}

export const allMessages = [CHECK_TEAM_ERROR, AUTHENTICATION_FAILED, LOGOUT];

export class MessagesContainer extends Component {
  render() {
    const { alerts } = this.props;
    const { translate } = this.context;

    return (
      <div>
        {_.map(allMessages, (message) => {
          return (
            <Alert
              onRequestClose={this.props.onClose.bind(this, message)}
              open={hasError(message, alerts)}
              autoHideDuration={4000}
              title={getTitle(message, alerts, translate)}
              theme={getTheme(message, alerts)}
              key={message}
            >
              <div>{getContent(message, alerts, translate)}</div>
            </Alert>
          );
        })}
      </div>
    );
  }
}

MessagesContainer.propTypes = {
  onClose: PropTypes.func.isRequired,
}

MessagesContainer.contextTypes = {
  translate: PropTypes.func.isRequired,
}
export default connect(mapStateToProps, mapDispatchToProps)(MessagesContainer);

