//@flow
import React from "react";
import { connect } from "react-redux";
import { Alert } from "components";
import { closeMessage } from "redux/modules/alerts";

const mapStateToProps = state => ({
  alerts: state.alerts
});

const mapDispatchToProps = (dispatch: *) => ({
  onClose: () => dispatch(closeMessage())
});

export function MessagesContainer(props: {
  alerts: {
    visible: boolean,
    type: string,
    title: string,
    content: string
  },
  onClose: Function
}) {
  const { alerts, onClose } = props;
  return (
    <div>
      <Alert
        onClose={onClose}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagesContainer);
