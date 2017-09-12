import React, { Component } from 'react';
// import isEmpty from 'lodash/isEmpty';
import { Alert } from '../components';
import translate from '../decorators/Translate';
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

const getTitle = (id, alerts, translate) => {
  const message = _.find(alerts, {id: id});
  if (message && message.title) {
    return translate(message.title);
  }
  else {
    return ''
  }
};

const getTheme = (id, alerts) => {
  const message = _.find(alerts, {id: id});
  if (message && message.type) {
    return message.type;
  }
  else {
    return ''
  }
};

const getContent = (id, alerts, translate) => {
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

const allMessages = [CHECK_TEAM_ERROR, AUTHENTICATION_FAILED, LOGOUT];

class MessagesContainer extends Component {
  render() {
    const { translate, alerts } = this.props;
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
export default connect(mapStateToProps, mapDispatchToProps)(translate(MessagesContainer));

