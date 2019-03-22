// @flow
import React, { PureComponent, Fragment } from "react";
import type { Match } from "react-router-dom";
import ModalRoute from "components/ModalRoute";
import CreateGroup from "containers/Admin/Groups/CreateGroup";
import GroupDetails from "containers/Admin/Groups/GroupDetails";
import AccountCreationFlow from "components/AccountCreationFlow";
import UserDetails from "containers/Admin/Users/UserDetails";
import AccountDetails from "containers/Admin/Accounts/AccountDetails";

type Props = {
  match: Match,
};

class Modals extends PureComponent<Props> {
  render() {
    return (
      <Fragment>
        <ModalRoute
          path="*/groups/details/:groupId"
          render={(
            props, // looks hacky but prevent bug with <Switch> and ModalRoute with the overlay animation
          ) =>
            props.match.params.groupId === "new" ? (
              <CreateGroup {...props} />
            ) : (
              <GroupDetails {...props} />
            )
          }
        />
        <ModalRoute
          path="*/accounts/new"
          component={AccountCreationFlow}
          disableBackdropClick
        />
        <ModalRoute path="*/users/details/:userID" component={UserDetails} />
        <ModalRoute
          path="*/accounts/details/:accountId"
          component={AccountDetails}
        />
      </Fragment>
    );
  }
}

export default Modals;
