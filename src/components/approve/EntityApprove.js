// @flow
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import AccountsQuery from "api/queries/AccountsQuery";
import PendingAccountsQuery from "api/queries/PendingAccountsQuery";
import { InvalidDataDevice, NoChannelForDevice } from "utils/errors";
import { addError } from "redux/modules/alerts";
import connectData from "restlay/connectData";
import StepDeviceGeneric from "containers/Onboarding/StepDeviceGeneric";
import createDevice, {
  U2F_PATH,
  VALIDATION_PATH,
  ACCOUNT_MANAGER_SESSION,
  MATCHER_SESSION,
  INVALID_DATA,
  CONFIDENTIALITY_PATH
} from "device";

// import ApproveAccount from "api/mutations/ApproveAccountMutation";
// import NonceQuery from "api/queries/NonceQuery";
import ApproveAccountMutation from "api/mutations/ApproveAccountMutation";
import AbortAccount from "api/mutations/AbortAccountMutation";
import ApproveOperationMutation from "api/mutations/ApproveOperationMutation";
import AbortOperationMutation from "api/mutations/AbortOperationMutation";
import PendingOperationsQuery from "api/queries/PendingOperationsQuery";
import AccountApprove from "../accounts/approve/AccountApprove";
import AbortConfirmation from "./AbortConfirmation";
import OperationApprove from "../operations/approve/OperationApprove";

type Props = {
  history: *,
  match: *,
  restlay: *,
  onAddErrorMessage: Error => void,
  entity: string
};

type State = {
  isDevice: boolean,
  isAborting: boolean,
  step: number
};
class EntityApprove extends Component<Props, State> {
  state: State = {
    isDevice: false,
    isAborting: false,
    step: 0
  };

  close = () => {
    this.props.history.goBack();
  };

  title = (entity: string) => `Approve ${entity}`;

  steps = (entity: string) => [
    "Connect your Ledger Blue to your computer using one of its USB port.",
    "Power on your device and unlock it by entering your 4 to 8 digit personal PIN code.",
    `Open the Vault app on the dashboard. When displayed, approve the ${entity} request on the device.`
  ];

  aborting = () => {
    this.setState(state => ({ isAborting: !state.isAborting }));
  };

  approving = async (accountOrOperation: *) => {
    const { restlay, entity } = this.props;
    this.setState(state => ({ isDevice: !state.isDevice }));

    const operation = accountOrOperation.hsm_operations;

    try {
      const device = await await createDevice();
      const { pubKey } = await device.getPublicKey(U2F_PATH, false);
      const channel = operation[pubKey.toUpperCase()];
      if (!channel) {
        throw new NoChannelForDevice();
      }
      const ephemeral_public_key = channel.ephemeral_public_key;
      const certificate_attestation = channel.certificate_attestation;

      this.setState({ step: 1 });

      await device.openSession(
        CONFIDENTIALITY_PATH,
        Buffer.from(ephemeral_public_key, "hex"),
        Buffer.from(certificate_attestation, "base64"),
        entity === "account" ? ACCOUNT_MANAGER_SESSION : MATCHER_SESSION
      );
      const approval = await device.validateVaultOperation(
        VALIDATION_PATH,
        Buffer.from(channel.data, "base64")
      );

      this.setState({ step: 2 });

      if (entity === "account") {
        await restlay.commitMutation(
          new ApproveAccountMutation({
            accountId: accountOrOperation.id,
            approval: approval.toString("base64"),
            public_key: pubKey.toUpperCase()
          })
        );
        await restlay.fetchQuery(new AccountsQuery());
        await restlay.fetchQuery(new PendingAccountsQuery());
      } else if (entity === "operation") {
        await restlay.commitMutation(
          new ApproveOperationMutation({
            operationId: accountOrOperation.id,
            approval: approval.toString("base64"),
            public_key: pubKey.toUpperCase()
          })
        );
        await restlay.fetchQuery(new PendingOperationsQuery());
      }
      this.close();
    } catch (e) {
      console.error(e);
      if (e instanceof NoChannelForDevice) {
        this.props.onAddErrorMessage(e);
      }
      if (e.statusCode && e.statusCode === INVALID_DATA) {
        const error = new InvalidDataDevice();
        this.props.onAddErrorMessage(error);
      }
      this.setState({ isDevice: false });
    }
  };

  abort = async () => {
    const { restlay, entity, match } = this.props;
    // const { id } = this.props.match.params;
    // TODO: replace delay by device API call
    const id = parseInt(match.params.id, 10);
    if (entity === "account") {
      try {
        await restlay.commitMutation(new AbortAccount({ accountId: id }));
        await restlay.fetchQuery(new PendingAccountsQuery());
        this.close();
      } catch (e) {
        this.close();
        console.error(e);
      }
    } else {
      try {
        await restlay.commitMutation(
          new AbortOperationMutation({ operationId: id })
        );
        await restlay.fetchQuery(new PendingOperationsQuery());
        this.close();
      } catch (e) {
        this.close();
        console.error(e);
      }
    }
  };

  render() {
    const { entity } = this.props;
    const { isDevice, step, isAborting } = this.state;
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
            <StepDeviceGeneric
              title={this.title(entity)}
              steps={this.steps(entity)}
              cancel={this.approving}
              device={step < 2}
              step={step}
            />
          )}
        {!this.state.isDevice &&
          !this.state.isAborting && (
            <Fragment>
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
            </Fragment>
          )}
      </div>
    );
  }
}

const mapDispatch = {
  onAddErrorMessage: addError
};

export { EntityApprove };
export default connect(
  null,
  mapDispatch
)(connectData(EntityApprove));
