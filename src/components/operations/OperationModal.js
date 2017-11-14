//@flow
import React, { Component } from "react";
import { withRouter } from "react-router";
import { BlurDialog } from "../../containers";
import OperationDetails from "./OperationDetails";

type Props = {
  history: *,
  match: *
};

class OperationModal extends Component<Props> {
  close = () => {
    this.props.history.goBack();
  };

  render() {
    const index = parseInt(this.props.match.params.tabIndex, 10);
    return (
      <BlurDialog
        open
        nopadding
        onRequestClose={this.close}
        className="operation-details"
      >
        <OperationDetails close={this.close} tabIndex={index} />
      </BlurDialog>
    );
  }
}

export default withRouter(OperationModal);
