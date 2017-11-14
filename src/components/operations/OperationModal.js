//@flow
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
    return <OperationDetails close={this.props.close} tabIndex={index} />;
  }
}

export default OperationModal;
