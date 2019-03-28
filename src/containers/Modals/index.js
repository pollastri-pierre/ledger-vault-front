// @flow
import React, { Fragment } from "react";
import ModalRoute from "components/ModalRoute";
import GroupDetails from "containers/Admin/Groups/GroupDetails";
import AccountCreationFlow from "components/AccountCreationFlow";
import GroupCreationFlow from "components/GroupCreationFlow";
import UserDetails from "containers/Admin/Users/UserDetails";
import AccountDetails from "containers/Admin/Accounts/AccountDetails";

export default () => (
  <Fragment>
    <ModalRoute path="*/groups/details/:groupId" component={GroupDetails} />
    <ModalRoute path="*/users/details/:userID" component={UserDetails} />
    <ModalRoute
      path="*/accounts/details/:accountId"
      component={AccountDetails}
    />
    <ModalRoute path="*/groups/new" component={GroupCreationFlow} />
    <ModalRoute
      path="*/accounts/new"
      component={AccountCreationFlow}
      disableBackdropClick
    />
  </Fragment>
);
