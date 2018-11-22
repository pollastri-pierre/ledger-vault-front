// @flow
import AccountQuery from "api/queries/AccountQuery";
import ProfileQuery from "api/queries/ProfileQuery";
import Card from "components/Card";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import SpinnerCard from "components/spinners/SpinnerCard";
import TryAgain from "components/TryAgain";
import React, { Component } from "react";
import ModalRoute from "components/ModalRoute";
import { withStyles } from "@material-ui/core/styles";
import type { Account, Member } from "data/types";
import connectData from "restlay/connectData";
import OperationModal from "components/operations/OperationModal";
// import QuicklookCard from "./QuicklookCard";
import AccountBalanceCard from "./AccountBalanceCard";
import AccountLastOperationsCard from "./AccountLastOperationsCard";
import AccountCountervalueCard from "./AccountCountervalueCard";
import AccountQuickInfo from "./AccountQuickInfo";

const styles = {
  flex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  left: {},
  half: {
    width: "100%",
    marginRight: "20px"
  }
};
class AccountView extends Component<
  {
    classes: { [_: $Keys<typeof styles>]: string },
    account: Account,
    me: Member,
    t: Translate,
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
    const { match, classes, account, t, me } = this.props;
    const accountId = match.params.id;
    if (
      account.status &&
      account.status !== "APPROVED" &&
      account.status !== "PENDING_UPDATE"
    ) {
      return (
        <div>
          <Card title="Account pending">{t("accountView:approved")}</Card>
        </div>
      );
    }
    return (
      <div>
        <div>
          <AccountQuickInfo me={me} account={account} match={match} />
        </div>
        <div className={classes.flex}>
          <AccountBalanceCard account={account} />
          <AccountCountervalueCard account={account} />
        </div>
        {/* <QuicklookCard accountId={accountId} key={accountId} /> */}
        <AccountLastOperationsCard key={accountId} account={account} />
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

export default connectData(withStyles(styles)(translate()(AccountView)), {
  queries: {
    account: AccountQuery,
    me: ProfileQuery
  },
  RenderError,
  RenderLoading,
  optimisticRendering: true,
  propsToQueryParams: ({ match }: { match: * }) => ({
    accountId: match.params.id
  })
});
