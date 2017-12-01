// @flow
import React, { Component } from "react";
import ModalRoute from "../../components/ModalRoute";
import OperationModal from "../../components/operations/OperationModal";
import ReceiveFundsCard from "./ReceiveFundsCard";
import QuicklookCard from "./QuicklookCard";
import AccountBalanceCard from "./AccountBalanceCard";
import AccountLastOperationsCard from "./AccountLastOperationsCard";
import AccountCountervalueCard from "./AccountCountervalueCard";
import "./Account.css";

class AccountView extends Component<
  {
    match: {
      url: string,
      params: {
        id: string
      }
    }
  },
  {
    quicklookFilter: string,
    tabsIndex: number
  }
> {
  state = {
    quicklookFilter: "balance",
    tabsIndex: 0
  };

  render() {
    const { match } = this.props;
    const accountId = match.params.id;
    return (
      <div className="account-view">
        <div className="account-view-infos">
          <div className="infos-left">
            <div className="infos-left-top">
              <AccountBalanceCard accountId={accountId} />
              <AccountCountervalueCard accountId={accountId} />
            </div>
            <ReceiveFundsCard accountId={accountId} />
          </div>
          <QuicklookCard accountId={accountId} />
        </div>
        <AccountLastOperationsCard key={accountId} accountId={accountId} />
        <ModalRoute
          path={`${match.url}/operation/:operationId/:tabIndex`}
          component={OperationModal}
        />
      </div>
    );
  }
}

export default AccountView;
