// @flow
import React from "react";
import { Route, Switch, Redirect } from "react-router";
import type { Match } from "react-router-dom";

import AdminDashboard from "containers/Admin/Dashboard";
import AdminTasks from "containers/Admin/AdminTasks";
import AdminOperators from "containers/Admin/Operators";
import AdminGroups from "containers/Admin/Groups";
import Administrators from "containers/Admin/Administrators";
import AdminAccounts from "containers/Admin/Accounts";
import AdminTransactions from "containers/Admin/Transactions";

import OperatorDashboard from "containers/Operator/Dashboard";
import OperatorTransactions from "containers/Operator/Transactions";
import OperatorAccounts from "containers/Operator/Accounts";
import AccountView from "containers/Account/AccountView";

import Box from "components/base/Box";

const styles = {
  base: {
    width: "calc(100% - 320px)",
    maxWidth: 1700,
    margin: "0 auto",
    marginTop: -40,
    marginBottom: 40
  }
};

function Content({ match }: { match: Match }) {
  const u = match.url;
  return (
    <Box style={styles.base}>
      <Switch>
        <Route path={`${u}/admin/dashboard`} component={AdminDashboard} />
        <Route path={`${u}/admin/tasks`} component={AdminTasks} />
        <Route path={`${u}/admin/operators`} component={AdminOperators} />
        <Route path={`${u}/admin/groups`} component={AdminGroups} />
        <Route path={`${u}/admin/administrators`} component={Administrators} />
        <Route path={`${u}/admin/accounts`} component={AdminAccounts} />
        <Route path={`${u}/admin/account/:id`} component={AccountView} />
        <Route path={`${u}/admin/transactions`} component={AdminTransactions} />

        <Route path={`${u}/operator/dashboard`} component={OperatorDashboard} />
        <Route
          path={`${u}/operator/transactions`}
          component={OperatorTransactions}
        />
        <Route path={`${u}/operator/accounts`} component={OperatorAccounts} />

        <Route
          exact
          path={`${u}`}
          render={() => <Redirect to={`${u}/admin/dashboard`} />}
        />
      </Switch>
    </Box>
  );
}

export default Content;
