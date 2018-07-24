//@flow
import {
  isCreateOperationEnabled,
  getPendingsOperations
} from "utils/operations";
import React, { Component } from "react";
import DeviceAuthenticate from "components/DeviceAuthenticate";
import AccountCalculateFeeQuery from "api/queries/AccountCalculateFeeQuery";
import { Redirect } from "react-router";
import OperationCreation from "./operations/creation/OperationCreation";
import NewOperationMutation from "api/mutations/NewOperationMutation";
import PendingOperationsQuery from "api/queries/PendingOperationsQuery";
import connectData from "restlay/connectData";
import AccountsQuery from "api/queries/AccountsQuery";
import ModalLoading from "components/ModalLoading";
import type { RestlayEnvironment } from "restlay/connectData";
import type { Account, Operation } from "data/types";

export type Details = {
  amount: ?number,
  feesSelected: string,
  unitIndex: number,
  amountFormated: string,
  address: ?string
};

class NewOperationModal extends Component<
  {
    accounts: Array<Account>,
    allPendingOperations: Array<Operation>,
    restlay: RestlayEnvironment,
    close: Function,
    restlay: *,
    match: *,
    history: *,
    location: *
  },
  {
    tabsIndex: number,
    selectedAccount: ?Account,
    estimatedFees: number,
    details: Details,
    device: boolean,
    note: string,
    title: string
  }
> {
  state = {
    device: false,
    tabsIndex: 0,
    estimatedFees: 0,
    selectedAccount: null,
    details: {
      amount: null,
      amountFormated: "",
      unitIndex: 0,
      feesSelected: "normal",
      address: null
    },
    note: "",
    title: ""
  };

  onTabsChange = (tabsIndex: number) => {
    this.setState({ tabsIndex });
  };

  selectAccount = (selectedAccount: Account) => {
    this.setState({
      selectedAccount,
      tabsIndex: 1
    });
  };

  updateNote = (val: string) => {
    this.setState({
      note: val
    });
  };
  updateTitle = (val: string) => {
    this.setState({
      title: val
    });
  };

  saveDetails = (details: Details) => {
    this.setState({ details }, this.setFees);
  };

  save = () => {
    this.setState({ device: !this.state.device });
  };

  createOperation = operation_id => {
    if (
      this.state.details.address &&
      this.state.details.amount &&
      this.state.selectedAccount
    ) {
      const data: * = {
        operation: {
          fee_level: this.state.details.feesSelected,
          amount: this.state.details.amount,
          recipient: this.state.details.address,
          operation_id: operation_id,
          note: {
            title: this.state.title,
            content: this.state.note
          }
        },
        accountId: this.state.selectedAccount.id
      };

      return this.props.restlay
        .commitMutation(new NewOperationMutation(data))
        .then(() => {
          this.props.restlay.fetchQuery(new PendingOperationsQuery());
          this.props.close();
        })
        .catch(this.closeOnError);
    }
  };

  setFees = () => {
    const operation = {
      fee_level: this.state.details.feesSelected || "normal",
      amount: this.state.details.amount || 0,
      recipient: this.state.details.address || ""
    };
    if (
      operation.amount > 0 &&
      operation.recipient !== "" &&
      this.state.selectedAccount
    ) {
      this.props.restlay
        .fetchQuery(
          new AccountCalculateFeeQuery({
            accountId: this.state.selectedAccount.id,
            operation: operation
          })
        )
        .then(data => {
          this.setState({ estimatedFees: data.fees });
        })
        .catch(e => {
          console.error(e);
          this.setState({ estimatedFees: 0 });
        });
    }
  };

  closeOnError = () => {
    this.props.close();
  };

  render() {
    const { accounts, close, allPendingOperations, match } = this.props;
    const { device } = this.state;

    const disabledTabs = [
      false, // tab 0
      this.state.selectedAccount === null, // tab 1
      !this.state.details.amount ||
        !this.state.details.address ||
        this.state.estimatedFees === 0,
      !this.state.details.amount ||
        !this.state.details.address ||
        this.state.estimatedFees === 0
    ];

    const pendingApprovalOperations = getPendingsOperations(
      allPendingOperations
    );
    if (!isCreateOperationEnabled(accounts, pendingApprovalOperations)) {
      return <Redirect to={match.params[0]} />;
    }
    if (device) {
      return (
        <DeviceAuthenticate
          cancel={this.save}
          callback={this.createOperation}
          type="operations"
          account_id={
            this.state.selectedAccount && this.state.selectedAccount.id
          }
          close={this.props.close}
        />
      );
    }
    return (
      <OperationCreation
        close={close}
        onTabsChange={this.onTabsChange}
        setFees={this.setFees}
        estimatedFees={this.state.estimatedFees}
        save={this.save}
        accounts={accounts}
        pendingOperations={pendingApprovalOperations}
        disabledTabs={disabledTabs}
        selectAccount={this.selectAccount}
        saveDetails={this.saveDetails}
        note={this.state.note}
        title={this.state.title}
        updateTitle={this.updateTitle}
        updateNote={this.updateNote}
        {...this.state}
      />
    );
  }
}

export default connectData(NewOperationModal, {
  RenderLoading: ModalLoading,
  queries: {
    accounts: AccountsQuery,
    allPendingOperations: PendingOperationsQuery
  }
});
