//@flow
import React, { Component } from "react";
import connectData from "restlay/connectData";
import AbortConfirmation from "./AbortConfirmation";
import ApproveDevice from "./ApproveDevice";
import AccountApprove from "../accounts/approve/AccountApprove";
import createDevice, { CONFIDENTIALITY_PATH } from "device";

// import ApproveAccount from "api/mutations/ApproveAccountMutation";
// import NonceQuery from "api/queries/NonceQuery";
import ApproveAccountMutation from "api/mutations/ApproveAccountMutation";
import AbortAccount from "api/mutations/AbortAccountMutation";
import ApproveOperationMutation from "api/mutations/ApproveOperationMutation";
import AbortOperationMutation from "api/mutations/AbortOperationMutation";
import PendingAccountsQuery from "api/queries/PendingAccountsQuery";
import PendingOperationsQuery from "api/queries/PendingOperationsQuery";
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

  approving = async accountOrOperation => {
    const { restlay, entity } = this.props;
    const { id } = this.props.match.params;
    this.setState({ ...this.state, isDevice: !this.state.isDevice });
    // TODO: replace delay by device API call

    if (entity === "account") {
      try {
        // const { nonce } = await restlay.fetchQuery(new NonceQuery());
        // console.log(nonce);
        const device = await createDevice();
        /* const { pubKey, signature } =  */ await device.getPublicKey(
          CONFIDENTIALITY_PATH
        );
        // await device.openSession(CONFIDENTIALITY_PATH, pubKey, signature);
        // await device.approveAccount(accountOrOperation, nonce);
        // POST to /API
        //
        await restlay.commitMutation(
          new ApproveAccountMutation({ accountId: accountOrOperation.id })
        );
        await restlay.fetchQuery(new PendingAccountsQuery());
        this.close();
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        // const { nonce } = await restlay.fetchQuery(new NonceQuery());
        // console.log(nonce);
        const device = await createDevice();
        /* const { pubKey, signature } =  */
        await device.getPublicKey(CONFIDENTIALITY_PATH);
        // await device.openSession(CONFIDENTIALITY_PATH, pubKey, signature);
        // await device.approveAccount(accountOrOperation, nonce);
        // POST to /API
        //
        await restlay.commitMutation(
          new ApproveOperationMutation({ operationId: accountOrOperation.id })
        );
        await restlay.fetchQuery(new PendingOperationsQuery());
        this.close();
      } catch (e) {
        console.error(e);
      }
    }
  };

  abort = () => {
    const { restlay, entity } = this.props;
    const { id } = this.props.match.params;
    // TODO: replace delay by device API call
    if (entity === "account") {
      return delay(500)
        .then(() => restlay.commitMutation(new AbortAccount({ accountId: id })))
        .then(() => restlay.fetchQuery(new PendingAccountsQuery()))
        .then(this.close);
    } else {
      return delay(500)
        .then(() =>
          restlay.commitMutation(
            new AbortOperationMutation({ operationId: id })
          )
        )
        .then(() => restlay.fetchQuery(new PendingOperationsQuery()))
        .then(this.close);
    }
  };

  render() {
    const { entity } = this.props;
    const { isDevice, isAborting } = this.state;

    return (
      <div>
        {!isDevice &&
          isAborting && (
            <AbortConfirmation
              entity={entity}
              aborting={this.aborting}
              abort={this.abort}
            />
          )}
        {this.state.isDevice &&
          !this.state.isAborting && (
            <ApproveDevice entity={entity} cancel={this.approving} />
          )}
        {!this.state.isDevice &&
          !this.state.isAborting && (
            <div style={{ height: "615px" }}>
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
          )}
      </div>
    );
  }
}

export default connectData(EntityApprove);
