// @flow
import React, { Component } from "react";
import OperationDetails from "./OperationDetails";

type Props = {
  history: *,
  match: *,
  close: *
};

class OperationModal extends Component<Props> {
  render() {
    const index = parseInt(this.props.match.params.tabIndex, 10);
    const { match, history } = this.props;
    return (
      <OperationDetails
        close={this.props.close}
        tabIndex={index}
        match={match}
        history={history}
      />
    );
  }
}

export default OperationModal;
