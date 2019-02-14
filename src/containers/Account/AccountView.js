// @flow
import AccountQuery from "api/queries/AccountQuery";
import ProfileQuery from "api/queries/ProfileQuery";
import Card from "components/legacy/Card";
import { Trans } from "react-i18next";
import SpinnerCard from "components/spinners/SpinnerCard";
import TryAgain from "components/TryAgain";
import React, { Component } from "react";
import ModalRoute from "components/ModalRoute";
import { withStyles } from "@material-ui/core/styles";
import type { Account, Member } from "data/types";
import connectData from "restlay/connectData";
import { VISIBLE_MENU_STATUS } from "utils/accounts";
import OperationModal from "components/operations/OperationModal";
import InfoBox from "components/base/InfoBox";
import Text from "components/base/Text";
// import QuicklookCard from "./QuicklookCard";
import AccountBalanceCard from "./AccountBalanceCard";
import AccountLastOperationsCard from "./AccountLastOperationsCard";
import AccountCountervalueCard from "./AccountCountervalueCard";
import AccountQuickInfo from "./AccountQuickInfo";
import SubAccounts from "./SubAccounts";

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
class AccountView extends Component<{
  classes: { [_: $Keys<typeof styles>]: string },
  account: Account,
  me: Member,
  match: {
    url: string,
    params: {
      id: string
    }
  }
}> {
  render() {
    const { match, classes, account, me } = this.props;
    const accountId = match.params.id;
    if (account.status && VISIBLE_MENU_STATUS.indexOf(account.status) === -1) {
      return (
        <div>
          <Card title="Account pending">
            <InfoBox withIcon type="info">
              <Text>
                <Trans i18nKey="accountView:approved" components={<b>0</b>} />
              </Text>
            </InfoBox>
          </Card>
        </div>
      );
    }
    return (
      <div>
        <div>
          <AccountQuickInfo me={me} account={account} match={match} />
        </div>
        {account.account_type === "Ethereum" && (
          <SubAccounts account={account} />
        )}
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

export default connectData(withStyles(styles)(AccountView), {
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
