//@flow
import React, { Component } from "react";
import connectData from "restlay/connectData";
import AbortConfirmation from "./AbortConfirmation";
import AccountApprove from "../accounts/approve/AccountApprove";
import StepDeviceGeneric from "containers/Onboarding/StepDeviceGeneric";
import createDevice, {
  U2F_PATH,
  VALIDATION_PATH,
  CONFIDENTIALITY_PATH
} from "device";

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
  entity: string,
  account: *
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

  title = entity => `Approve ${entity}`;
  steps = entity => [
    "Connect your Ledger Blue to your computer using one of its USB port.",
    "Power on your device and unlock it by entering your 4 to 8 digit personal PIN code.",
    `Open the Vault app on the dashboard. When displayed, approve the ${entity} request on the device.`
  ];

  aborting = () => {
    this.setState({ isAborting: !this.state.isAborting });
  };

  approving = async accountOrOperation => {
    const { restlay, entity } = this.props;
    this.setState({ ...this.state, isDevice: !this.state.isDevice });

    const operation = this.props.account.hsm_operation["operation"];

    try {
      // for approver in pick_approvers(admins):
      //   logger.debug("Approver picked {}".format(approver))
      //   pub_key = utils.pub_key(approver)
      //   operation = operations[pub_key]
      //   if operation != None:
      //       ephemeral_public_key = unhexlify(operation["ephemeral_public_key"])
      //       certificate_attestation = b64decode(operation["certificate_attestation"])
      //       data = b64decode(operation["data"])
      //
      //       approver.vault_open_session(approver.CONFIDENTIALITY_PATH, ephemeral_public_key,
      //                                   certificate_attestation)
      //       approval = b64encode(approver.vault_validate_operation(approver.VALIDATION_PATH, data))
      //       logger.debug("APPROVE {} with {}".format(pub_key, hexlify(b64decode(approval))))
      //       response = put(self.api, "/hsm/wallet/{}".format(account_id), headers=headers,
      //                      json=dict(public_key=pub_key, approval=approval))

      const device = await createDevice();
      const { pubKey } = await device.getPublicKey(U2F_PATH);
      const channel = operation[pubKey.toUpperCase()];
      const ephemeral_public_key = channel["ephemeral_public_key"];
      const certificate_attestation = channel["certificate_attestation"];

      this.setState({ step: 1 });
      await device.openSession(
        CONFIDENTIALITY_PATH,
        Buffer.from(ephemeral_public_key, "hex"),
        Buffer.from(certificate_attestation, "base64")
      );
      const approval = await device.validateVaultOperation(
        VALIDATION_PATH,
        Buffer.from(operation, "base64")
      );

      if (entity === "account") {
        await restlay.commitMutation(
          new ApproveAccountMutation({
            accountId: accountOrOperation.id,
            approval: approval
          })
        );
        await restlay.fetchQuery(new PendingAccountsQuery());
      } else if (entity === "operation") {
        await restlay.commitMutation(
          new ApproveOperationMutation({
            operationId: accountOrOperation.id,
            approval: approval
          })
        );
        await restlay.fetchQuery(new PendingOperationsQuery());
      }
      this.close();
    } catch (e) {
      console.error(e);
      this.close();
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
              step={step}
            />
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
