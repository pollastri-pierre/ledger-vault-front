// @flow
import AccountQuery from "api/queries/AccountQuery";
import Card from "components/Card";
import SpinnerCard from "components/spinners/SpinnerCard";
import TryAgain from "components/TryAgain";
import React, { Component } from "react";
import ModalRoute from "components/ModalRoute";
import { withStyles } from "material-ui/styles";
import type { Account } from "data/types";
import connectData from "restlay/connectData";
import OperationModal from "components/operations/OperationModal";
import ReceiveFundsCard from "./ReceiveFundsCard";
import QuicklookCard from "./QuicklookCard";
import AccountBalanceCard from "./AccountBalanceCard";
import AccountLastOperationsCard from "./AccountLastOperationsCard";
// import AccountCountervalueCard from "./AccountCountervalueCard";

const styles = {
  flex: {
    display: "flex"
  },
  left: {
    width: "65.4%"
  },
  half: {
    width: "100%",
    marginRight: "20px"
  }
};
class AccountView extends Component<
  {
    classes: { [_: $Keys<typeof styles>]: string },
    account: Account,
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
    const { match, classes, account } = this.props;
    const accountId = match.params.id;
    return (
      <div>
        <div className={classes.flex}>
          <div className={classes.left}>
            <div className={classes.flex}>
              <div className={classes.half}>
                <AccountBalanceCard account={account} />
              </div>
              {/* <div className={classes.half}> */}
              {/*   <AccountCountervalueCard accountId={accountId} /> */}
              {/* </div> */}
            </div>
            <ReceiveFundsCard account={account} />
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

const RenderError = withStyles(styles)(({ error, restlay, classes }: *) => (
  <Card className={classes.card} title="Error occured">
    <TryAgain error={error} action={restlay.forceFetch} />
  </Card>
));

const RenderLoading = withStyles(styles)(({ classes }) => (
  <Card className={classes.card} title="Balance">
    <SpinnerCard />
  </Card>
));

export default connectData(withStyles(styles)(AccountView), {
  queries: {
    account: AccountQuery
  },
  RenderError,
  RenderLoading,
  optimisticRendering: true,
  propsToQueryParams: ({ match }: { match: * }) => ({
    accountId: match.params.id
  })
});
