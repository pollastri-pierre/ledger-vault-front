// @flow
import { PureComponent } from "react";
import { connect } from "react-redux";
import { NetworkError } from "network";

import { NoChannelForDevice, GenericError } from "utils/errors";
import { addMessage, addError } from "redux/modules/alerts";
import type { GateError } from "data/types";

type Props = {
  error: Error | GateError | typeof NetworkError,
  addMessage: (string, string, ?string) => void,
  addError: Error => void,
};

const mapDispatchToProps = {
  addMessage,
  addError,
};

class TriggerErrorNotification extends PureComponent<Props> {
  componentDidMount() {
    this.findErrorType();
  }

  findErrorType = () => {
    const { error, addMessage, addError } = this.props;
    switch (true) {
      case error.json && error instanceof NetworkError:
        // $FlowFixMe
        addMessage(`Error ${error.json.code}`, error.json.message, "error");
        break;
      case error instanceof Error && error instanceof NoChannelForDevice:
        // $FlowFixMe
        addError(error);
        break;
      default:
        addError(new GenericError());
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
