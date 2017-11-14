//@flow
import React, { Component } from "react";
import OperationCreation from "./operations/creation/OperationCreation";
import connectData from "../restlay/connectData";
import AccountsQuery from "../api/queries/AccountsQuery";
import type { Account } from "../data/types";

class NewOperationModal extends Component<
  {
    accounts: Array<Account>,
    close: Function
  },
  {
    tabsIndex: number
  }
> {
  state = {
    tabsIndex: 0
  };
  onSaveOperation = () => {
    console.log(
      "TODO: this.props.restlay.commitUpdate(new SaveOperationMutation({...}))"
    );
  };
  onSelect = (tabsIndex: number) => {
    this.setState({ tabsIndex });
  };
  render() {
    const { accounts, close } = this.props;
    return (
      <OperationCreation
        close={close}
        onSelect={this.onSelect}
        save={this.onSaveOperation}
        tabsIndex={this.state.tabsIndex}
        accounts={{
          isLoadingAccounts: false,
          accounts
        }}
        getAccounts={() => {
          console.warn("getAccounts is no longer needed");
        }}
      />
    );
  }
}

export default connectData(NewOperationModal, {
  queries: {
    accounts: AccountsQuery
  }
});
