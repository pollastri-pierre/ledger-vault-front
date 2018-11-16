//@flow
import React from "react";
import { Route, Switch, Redirect } from "react-router";
import { AccountView, PendingRequests } from "../../containers"; // Tests
import Dashboard from "containers/Dashboard";
import { withStyles } from "@material-ui/core/styles";
import Search from "containers/Search";

const styles = {
  base: {
    width: "calc(100% - 320px)",
    position: "relative",
    margin: "0",
    float: "left",
    marginTop: "-80px"
  }
};
function Content({
  classes,
  match
}: {
  classes: { [_: $Keys<typeof styles>]: string },
  match: *
}) {
  return (
    <div className={classes.base}>
      <Switch>
        <Route path={`${match.url}/pending`} component={PendingRequests} />
        <Route path={`${match.url}/search`} component={Search} />
        <Route path={`${match.url}/account/:id`} component={AccountView} />
        <Route
          path={`${match.url}/dashboard`}
          render={() => {
            return <Dashboard match={match} />;
          }}
        />
        <Route
          exact
          path={`${match.url}`}
          render={() => <Redirect to={`${match.url}/dashboard`} />}
        />
      </Switch>
    </div>
  );
}

export default withStyles(styles)(Content);
