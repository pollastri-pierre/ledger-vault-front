// @flow
import React, { Fragment } from "react";
import { connect } from "react-redux";
import Alert from "components/utils/Alert";
import { closeMessage } from "redux/modules/alerts";
import TranslatedError from "components/TranslatedError";

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
    error?: Error,
    content?: string
  },
  onClose: Function
}) {
  const { alerts, onClose } = props;
  const { error, visible, title, type, content } = alerts;
  const titleComponent = error ? (
    <TranslatedError field="title" error={error} />
  ) : (
    title
  );
  return (
    <Fragment>
      <Alert
        onClose={onClose}
        open={visible}
        autoHideDuration={4000}
        title={titleComponent}
        theme={type}
      >
        {error ? (
          <TranslatedError field="description" error={error} />
        ) : (
          <div>{content}</div>
        )}
      </Alert>
    </Fragment>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagesContainer);
