// @flow
import React from "react";
import { Route, Switch, Redirect } from "react-router";
import type { Match } from "react-router-dom";
import { withMe } from "components/UserContextProvider";

import AdminDashboard from "containers/Admin/Dashboard";
import AdminTasks from "containers/Admin/AdminTasks";
import AdminGroups from "containers/Admin/Groups";
import Users from "containers/Admin/Users";
import AdminAccounts from "containers/Admin/Accounts";

import OperatorDashboard from "containers/Operator/Dashboard";
import OperatorAccounts from "containers/Operator/Accounts";
import AccountView from "containers/Account/AccountView";

import Transactions from "containers/Transactions";

import type { User } from "data/types";

function Content({ match, me }: { match: Match, me: User }) {
  const u = match.url;
  const defaultUrl =
    me.role === "OPERATOR" ? `${u}/operator/dashboard` : `${u}/admin/dashboard`;
  return (
    <Switch>
      <Route path={`${u}/admin/dashboard`} component={AdminDashboard} />
      <Route path={`${u}/admin/tasks`} component={AdminTasks} />
      <Route path={`${u}/admin/groups`} component={AdminGroups} />
      <Route path={`${u}/admin/users`} component={Users} />
      <Route path={`${u}/admin/accounts`} component={AdminAccounts} />
      <Route path={`${u}/admin/account/:id`} component={AccountView} />
      <Route path={`${u}/admin/transactions`} component={Transactions} />

      <Route path={`${u}/operator/dashboard`} component={OperatorDashboard} />
      <Route path={`${u}/operator/transactions`} component={Transactions} />
      <Route path={`${u}/operator/accounts`} component={OperatorAccounts} />

      <Route exact path={`${u}`} render={() => <Redirect to={defaultUrl} />} />
    </Switch>
  );
}

export default withMe(Content);
