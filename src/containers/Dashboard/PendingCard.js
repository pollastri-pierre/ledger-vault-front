// @flow
import React, { Component } from "react";
import { translate } from "react-i18next";
import connectData from "restlay/connectData";
import ViewAllLink from "components/ViewAllLink";
import Card from "components/Card";
import CardField from "components/CardField";
import DateFormat from "components/DateFormat";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import type { Operation, Account, Translate } from "data/types";
import AccountName from "components/AccountName";
import PendingAccountsQuery from "api/queries/PendingAccountsQuery";
import AccountsQuery from "api/queries/AccountsQuery";
import PendingOperationsQuery from "api/queries/PendingOperationsQuery";
import TryAgain from "components/TryAgain";
import SpinnerCard from "components/spinners/SpinnerCard";
import { withStyles } from "@material-ui/core/styles";
import { getPendingsOperations } from "utils/operations";

const styles = {
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1px solid #eee",
    padding: "10px 0",
    "&:last-child": {
      borderBottom: "0px"
    }
  },
  date: {
    color: " #000",
    fontSize: " 10px",
    fontWeight: " 600",
    lineHeight: " 18px",
    textTransform: " uppercase"
  },
  body: {
    fontSize: "13px"
  },
  header: {
    padding: "20px 46px",
    display: "flex",
    justifyContent: "space-between"
  }
};
const Row_c = ({
  date,
  children,
  classes
}: {
  date: string,
  children: React$Node | string,
  classes: Object
}) => (
  <div className={classes.row}>
    <div className={classes.date}>
      <DateFormat date={date} />
    </div>
    <div className={classes.body}>{children}</div>
  </div>
);

const Row = withStyles(styles)(Row_c);

const OperationRow = ({
  operation,
  account
}: {
  operation: Operation,
  account: ?Account
}) =>
  account ? (
    <Row date={operation.created_on}>
      <CurrencyAccountValue account={account} value={operation.price.amount} />
    </Row>
  ) : null;

const AccountRow = ({ account }: { account: Account }) => (
  <Row date={account.created_on}>
    <AccountName account={account} />
  </Row>
);

class PendingCard extends Component<{
  classes: { [_: $Keys<typeof styles>]: string },
  accounts: Account[],
  allAccounts: Account[],
  match: *,
  t: Translate,
  operations: Operation[],
  reloading: boolean
}> {
  render() {
    const {
      accounts,
      operations,
      classes,
      t,
      allAccounts,
      match,
      reloading
    } = this.props;
    const filtered_operations = getPendingsOperations(operations);
    const totalOperations = filtered_operations.length;
    const totalAccounts = accounts.length;
    const total = totalOperations + totalAccounts;
    return (
      <Card
        reloading={reloading}
        title={t("dashboard:pending")}
        titleRight={
          <ViewAllLink to={`/${match.params.orga_name}/pending`}>
            {t("dashboard:view_all")} ({total})
          </ViewAllLink>
        }
        className="pendingCard"
      >
        <header className={classes.header}>
          <CardField
            label={t("dashboard:operations")}
            align="center"
            dataTest="dashboard_nb_pending_operations"
          >
            {totalOperations}
          </CardField>
          <CardField
            label={t("onboarding:accounts")}
            align="center"
            dataTest="dashboard_nb_pending_operations"
          >
            {totalAccounts}
          </CardField>
        </header>
        <div className="pending-list" data-test="pending-list">
          <div data-test="op_list">
            {filtered_operations.map((operation, i) => (
              <OperationRow
                key={`op_${i}`} // eslint-disable-line react/no-array-index-key
                operation={operation}
                account={allAccounts.find(a => a.id === operation.account_id)}
              />
            ))}
          </div>
          <div data-test="ac_list">
            {accounts.map((account, i) => (
              <AccountRow key={`ac_${i}`} account={account} /> // eslint-disable-line react/no-array-index-key
            ))}
          </div>
        </div>
      </Card>
    );
  }
}

const RenderError = translate()(({ error, restlay, t }: *) => (
  <Card title={t("dashboard:pending")} className="pendingCard">
    <TryAgain error={error} action={restlay.forceFetch} />
  </Card>
));

const RenderLoading = translate()(({ t }: { t: Translate }) => (
  <Card title={t("dashboard:pending")} className="pendingCard">
    <SpinnerCard />
  </Card>
));

export default connectData(withStyles(styles)(translate()(PendingCard)), {
  queries: {
    accounts: PendingAccountsQuery,
    allAccounts: AccountsQuery,
    operations: PendingOperationsQuery
  },
  optimisticRendering: true,
  RenderError,
  RenderLoading
});
