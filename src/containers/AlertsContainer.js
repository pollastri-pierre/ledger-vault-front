import _ from "lodash";
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Alert } from "../components";
import { closeMessage } from "../redux/modules/alerts";

const mapStateToProps = state => ({
  alerts: state.alerts
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(closeMessage())
});

export function MessagesContainer(props, context) {
  const { alerts, onClose } = props;

  return (
    <div>
      <Alert
        onRequestClose={onClose}
        open={alerts.visible}
        autoHideDuration={4000}
        title={alerts.title}
        theme={alerts.type}
      >
        <div>{alerts.content}</div>
      </Alert>
    </div>
  );
}

MessagesContainer.propTypes = {
  alerts: PropTypes.shape({
    type: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string
  }).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(MessagesContainer);
