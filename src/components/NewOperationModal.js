//@flow
import React, { Component } from "react";
import OperationCreation from "./operations/creation/OperationCreation";
import connectData from "../restlay/connectData";
import AccountsQuery from "../api/queries/AccountsQuery";
import ModalLoading from "../components/ModalLoading";
import type { Account } from "../data/types";

export type Details = {
  amount: ?number,
  fees: ?number,
  address: ?string
};

class NewOperationModal extends Component<
  {
    accounts: Array<Account>,
    close: Function,
    history: *,
    location: *
  },
  {
    tabsIndex: number,
    selectedAccount: ?Account,
    details: Details
  }
> {
  state = {
    tabsIndex: 0,
    selectedAccount: null,
    details: {
      amount: null,
      fees: null,
      address: null
    }
  };

  onSaveOperation = () => {
    console.warn(
      "TODO: this.props.restlay.commitUpdate(new SaveOperationMutation({...}))"
    );

    this.props.close();
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

  saveDetails = (details: Details) => {
    this.setState({ details });
  };

  render() {
    const { accounts, close } = this.props;
    return (
      <OperationCreation
        close={close}
        onTabsChange={this.onTabsChange}
        save={this.onSaveOperation}
        accounts={accounts}
        selectAccount={this.selectAccount}
        saveDetails={this.saveDetails}
        {...this.state}
      />
    );
  }
}

export default connectData(NewOperationModal, {
  RenderLoading: ModalLoading,
  queries: {
    accounts: AccountsQuery
  }
});
