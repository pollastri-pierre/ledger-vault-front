//@flow
import React, { Component } from "react";
import connectData from "../../restlay/connectData";
import { withRouter } from "react-router";
import BlurDialog from "../BlurDialog"; // FIXME use ModalRoute
import AbortConfirmation from "./AbortConfirmation";
import ApproveDevice from "./ApproveDevice";
import AccountApprove from "../accounts/approve/AccountApprove";

import PendingsQuery from "../../api/queries/PendingsQuery";
import ApproveAccount from "../../api/mutations/ApproveAccountMutation";
import AbortAccount from "../../api/mutations/AbortAccountMutation";
import ApproveOperation from "../../api/mutations/ApproveOperationMutation";
import AbortOperation from "../../api/mutations/AbortOperationMutation";
import OperationApprove from "../operations/approve/OperationApprove";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

type Props = {
  history: *,
  match: *,
  restlay: *,
  entity: string
};

type State = {
  isDevice: boolean,
  isAborting: boolean
};
class EntityApprove extends Component<Props, State> {
  state: State = {
    isDevice: false,
    isAborting: false
  };

  close = () => {
    this.props.history.goBack();
  };

  aborting = () => {
    this.setState({ isAborting: !this.state.isAborting });
  };

  approving = () => {
    const { restlay, entity } = this.props;
    const { id } = this.props.match.params;
    this.setState({ ...this.state, isDevice: !this.state.isDevice });
    // TODO: replace delay by device API call

    if (entity === "account") {
      return delay(500)
        .then(() =>
          restlay.commitMutation(new ApproveAccount({ accountId: id }))
        )
        .then(() => restlay.fetchQuery(new PendingsQuery()))
        .then(this.close);
    } else {
      return delay(500)
        .then(() =>
          restlay.commitMutation(new ApproveOperation({ operationId: id }))
        )
        .then(() => restlay.fetchQuery(new PendingsQuery()))
        .then(this.close);
    }
  };

  abort = () => {
    const { restlay, entity } = this.props;
    const { id } = this.props.match.params;
    // TODO: replace delay by device API call
    if (entity === "account") {
      return delay(500)
        .then(() => restlay.commitMutation(new AbortAccount({ accountId: id })))
        .then(() => restlay.fetchQuery(new PendingsQuery()))
        .then(this.close);
    } else {
      return delay(500)
        .then(() =>
          restlay.commitMutation(new AbortOperation({ operationId: id }))
        )
        .then(() => restlay.fetchQuery(new PendingsQuery()))
        .then(this.close);
    }
  };

  render() {
    const { entity } = this.props;
    const { isDevice, isAborting } = this.state;

    return (
      <div className="entity-approve">
        <BlurDialog open={!isDevice && isAborting}>
          <AbortConfirmation
            entity={entity}
            aborting={this.aborting}
            abort={this.abort}
          />
        </BlurDialog>
        <BlurDialog
          open={this.state.isDevice && !this.state.isAborting}
          nopadding
        >
          <ApproveDevice entity={entity} cancel={this.approving} />
        </BlurDialog>
        <BlurDialog
          open={!this.state.isDevice && !this.state.isAborting}
          nopadding
          onRequestClose={this.close}
        >
          <div className="modal">
            {entity === "account" && (
              <AccountApprove
                close={this.close}
                approve={this.approving}
                aborting={this.aborting}
              />
            )}
            {entity === "operation" && (
              <OperationApprove
                close={this.close}
                approve={this.approving}
                aborting={this.aborting}
              />
            )}
          </div>
        </BlurDialog>
      </div>
    );
  }
}

export default withRouter(connectData(EntityApprove));
