// @flow
import React, { Component } from "react";
import ModalRoute from "../../components/ModalRoute";
import { withStyles } from "material-ui/styles";
import OperationModal from "../../components/operations/OperationModal";
import ReceiveFundsCard from "./ReceiveFundsCard";
import QuicklookCard from "./QuicklookCard";
import AccountBalanceCard from "./AccountBalanceCard";
import AccountLastOperationsCard from "./AccountLastOperationsCard";
import AccountCountervalueCard from "./AccountCountervalueCard";

const styles = {
  flex: {
    display: "flex"
  },
  left: {
    width: "65.4%"
  },
  half: {
    width: "50%",
    marginRight: "20px"
  }
};
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
    const { match, classes } = this.props;
    const accountId = match.params.id;
    return (
      <div>
        <div className={classes.flex}>
          <div className={classes.left}>
            <div className={classes.flex}>
              <div className={classes.half}>
                <AccountBalanceCard accountId={accountId} />
              </div>
              <div className={classes.half}>
                <AccountCountervalueCard accountId={accountId} />
              </div>
            </div>
            <ReceiveFundsCard accountId={accountId} />
          </div>
          <QuicklookCard accountId={accountId} key={accountId} />
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

export default withStyles(styles)(AccountView);
