// @flow

import React from "react";
import { connect } from "react-redux";
import { FaExclamationCircle } from "react-icons/fa";
import type { MemoryHistory } from "history";
import { withRouter } from "react-router";

import colors, { opacity } from "shared/colors";
import Alert from "components/legacy/Alert";
import { closeMessage } from "redux/modules/alerts";
import { DEVICE_REJECT_ERROR_CODE, U2F_TIMEOUT } from "device";
import { OutOfDateApp } from "utils/errors";
import Modal, { RichModalHeader } from "components/base/Modal";
import Box from "components/base/Box";
import Copy from "components/base/Copy";
import Text from "components/base/Text";
import BlockingReasons from "components/BlockingReasons";
import TranslatedError from "components/TranslatedError";
import type { DeviceError } from "components/DeviceInteraction";

const mapStateToProps = state => ({
  alerts: state.alerts,
});

const mapDispatchToProps = (dispatch: *) => ({
  onClose: () => dispatch(closeMessage()),
});

const genericError = new Error();
const errorRed = opacity(colors.grenade, 0.7);

const IconError = p => <FaExclamationCircle {...p} color={errorRed} />;

const STATUS_NO_ERROR = [DEVICE_REJECT_ERROR_CODE, U2F_TIMEOUT];
export function MessagesContainer(props: {
  alerts: {
    visible: boolean,
    type: string,
    title: string,
    error?: Error | DeviceError,
    content?: string,
  },
  history: MemoryHistory,
  onClose: Function,
}) {
  const { alerts, onClose, history } = props;
  const { error, visible, title, type, content } = alerts;

  // we don't want to display timeout and reject by user as an error
  if (
    error &&
    error.statusCode &&
    STATUS_NO_ERROR.indexOf(error.statusCode) > -1
  ) {
    return null;
  }
  if (type === "reason") {
    return (
      <Modal isOpened={visible} onClose={onClose}>
        <BlockingReasons error={error} onClose={onClose} />
      </Modal>
    );
  }
  if (error instanceof OutOfDateApp) {
    history.push(`update-app`);
    return false;
  }

  if (type === "error") {
    const displayedTitle = (
      <Text color={errorRed} data-test="error-message-title">
        {title || (
          <TranslatedError field="title" error={error || genericError} />
        )}
      </Text>
    );
    const errText = JSON.stringify({ error, title, type, content });
    return (
      <Modal isOpened={visible} onClose={onClose}>
        <RichModalHeader
          Icon={IconError}
          title={displayedTitle}
          onClose={onClose}
        />
        <Box width={400} p={40} flow={20} align="center">
          <Copy text={errText}>
            <Text data-test="error-message-desc" style={styles.desc}>
              {content || (
                <TranslatedError
                  field="description"
                  error={error || genericError}
                />
              )}
            </Text>
          </Copy>
        </Box>
      </Modal>
    );
  }

  return (
    <Alert
      onClose={onClose}
      open={visible && type !== "reason"}
      autoHideDuration={4000}
      title={title}
      theme={type}
    >
      <div>{content}</div>
    </Alert>
  );
}

const styles = {
  desc: {
    wordBreak: "break-word",
  },
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(MessagesContainer));
