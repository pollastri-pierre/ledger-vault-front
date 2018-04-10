//@flow
import React from "react";
import { Route, Switch, Redirect } from "react-router";
import { SandBox, AccountView, PendingRequests } from "../../containers"; // Tests
import Dashboard from "containers/Dashboard";
import { withStyles } from "material-ui/styles";
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
    classes
}: {
    classes: { [_: $Keys<typeof styles>]: string }
}) {
    return (
        <div className={classes.base}>
            <Switch>
                <Route
                    exact
                    path="/"
                    render={() => <Redirect to="/dashboard" />}
                />
                <Route path="/sandbox" component={SandBox} />
                <Route path="/pending" component={PendingRequests} />
                <Route path="/search" component={Search} />
                <Route path="/account/:id" component={AccountView} />
                <Route path="/dashboard" component={Dashboard} />
            </Switch>
        </div>
    );
}

export default withStyles(styles)(Content);
