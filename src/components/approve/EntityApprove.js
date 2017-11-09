//@flow
import React, { Component } from "react";
import connectData from "../../decorators/connectData";
import api from "../../data/api-spec";
import { DialogButton } from "../";
import { withRouter } from "react-router";
import { BlurDialog } from "../../containers";
import AbortConfirmation from "./AbortConfirmation";
import ApproveDevice from "./ApproveDevice";
import AccountApprove from "../accounts/approve/AccountApprove";
import OperationApprove from "../operations/approve/OperationApprove";
import Footer from "./Footer";

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

type Props = {
  history: *,
  match: *,
  entity: string,
  approved: boolean,
  fetchData: Function
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
    const { fetchData, entity } = this.props;
    this.setState({ ...this.state, isDevice: !this.state.isDevice });

    // TODO: replace setTimeout by device/NANO API call
    const request = api[`approve${capitalize(entity)}`];

    setTimeout(() => {
      return fetchData(request).then(() => {
        return fetchData(api.pendings).then(() => this.close());
      });
    }, 500);
  };

  abort = () => {
    const { fetchData, entity } = this.props;
    const close = this.close;

    const request = api[`abort${capitalize(entity)}`];

    return fetchData(request).then(() => {
      return fetchData(api.pendings).then(() => close());
    });
  };

  render() {
    console.log(this.props);
    const { entity, approved } = this.props;
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

export default withRouter(
  connectData(EntityApprove, {
    propsToApiParams: props => ({
      operationId: props.match.params.id,
      accountId: props.match.params.id
    })
  })
);
