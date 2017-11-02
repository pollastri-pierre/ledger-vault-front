import React from "react";
import { Route, Switch, Redirect } from "react-router";

import { SandBox, AccountView, PendingRequests } from "../../containers"; // Tests
import Dashboard from "../../containers/Dashboard";

function Content() {
  return (
    <div className="Content">
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/dashboard/" />} />
        <Route path="/sandbox/" component={SandBox} />
        <Route path="/pending/" component={PendingRequests} />
        <Route path="/account/:id/" component={AccountView} />
        <Route path="/dashboard/" component={Dashboard} />
      </Switch>
    </div>
  );
}

export default Content;
