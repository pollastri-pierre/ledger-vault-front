// @flow
import { PureComponent } from "react";
import { connect } from "react-redux";
import { NetworkError } from "network";

import { NoChannelForDevice } from "utils/errors";
import {
  addMessage,
  addError,
  extractErrorTitle,
  extractErrorContent,
} from "redux/modules/alerts";
import type { GateError } from "data/types";

type Props = {
  error: Error | GateError | typeof NetworkError,
  addMessage: (string, string, ?string) => void,
  addError: (Error | GateError | typeof NetworkError, type?: string) => void,
};

const mapDispatchToProps = {
  addMessage,
  addError,
};

class TriggerErrorNotification extends PureComponent<Props> {
  componentDidMount() {
    this.findErrorType();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.error !== this.props.error) {
      this.findErrorType();
    }
  }

  findErrorType = () => {
    const { error, addMessage, addError } = this.props;
    const title = extractErrorTitle(error);
    const content = extractErrorContent(error);
    switch (true) {
      case error.json && error instanceof NetworkError:
        // $FlowFixMe
        if (error.json.blocking_reasons) {
          addError(error, "reason");
        } else {
          addMessage(title, content, "error");
        }
        break;
      case error instanceof Error && error instanceof NoChannelForDevice:
        addError(error);
        break;
      default:
        addError(error);
    }
  };

  render() {
    return null;
  }
}
export default connect(
  null,
  mapDispatchToProps,
)(TriggerErrorNotification);
