//@flow
import React, { Component } from "react";
import OperationCreation from "./operations/creation/OperationCreation";
import NewOperationMutation from "api/mutations/NewOperationMutation";
import PendingOperationsQuery from "api/queries/PendingOperationsQuery";
import connectData from "restlay/connectData";
import AccountsQuery from "api/queries/AccountsQuery";
import ModalLoading from "components/ModalLoading";
import type { RestlayEnvironment } from "restlay/connectData";
import type { Account } from "data/types";

export type Details = {
  amount: ?number,
  fees: ?number,
  address: ?string
};

class NewOperationModal extends Component<
  {
    accounts: Array<Account>,
    restlay: RestlayEnvironment,
    close: Function,
    history: *,
    location: *
  },
  {
    tabsIndex: number,
    selectedAccount: ?Account,
    details: Details,
    note: string,
    title: string
  }
> {
  state = {
    tabsIndex: 0,
    selectedAccount: null,
    details: {
      amount: null,
      fees: null,
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
    this.setState({ details });
  };

  save = () => {
    if (
      this.state.details.fees &&
      this.state.details.address &&
      this.state.details.amount &&
      this.state.selectedAccount
    ) {
      const data = {
        operation: {
          fees_amount: this.state.details.fees,
          price_amount: this.state.details.amount,
          tx_hash: this.state.details.address,
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
        .catch(this.props.close);
    }
  };

  render() {
    const { accounts, close } = this.props;

    return (
      <OperationCreation
        close={close}
        onTabsChange={this.onTabsChange}
        save={this.save}
        accounts={accounts}
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
    accounts: AccountsQuery
  }
});
