// @flow
import React, { Fragment } from "react";
import ModalRoute from "components/ModalRoute";
import GroupDetails from "containers/Admin/Groups/GroupDetails";
import AccountCreationFlow from "components/AccountCreationFlow";
import GroupCreationFlow from "components/GroupCreationFlow";
import TransactionCreationFlow from "components/TransactionCreationFlow";
import UserDetails from "containers/Admin/Users/UserDetails";
import OrganizationDetails from "containers/Admin/OrganizationDetails";
import AccountDetails from "containers/Accounts/AccountDetails";
import TransactionDetails from "components/transactions/TransactionDetails";
import EditAdminRules from "containers/Admin/Dashboard/EditAdminRules";
import ReceiveFlow from "components/ReceiveFlow";

export default () => (
  <Fragment>
    {/* USER */}
    <ModalRoute
      transparent
      path="*/users/details/:userID"
      component={UserDetails}
    />

    {/* ACCOUNT */}
    <ModalRoute
      transparent
      path="*/accounts/details/:accountId/:tab?"
      component={AccountDetails}
    />
    <ModalRoute
      transparent
      path="*/accounts/edit/:accountId"
      component={AccountCreationFlow}
    />
    <ModalRoute
      transparent
      path="*/accounts/new"
      component={AccountCreationFlow}
      disableBackdropClick
    />

    {/* GROUP */}
    <ModalRoute transparent path="*/groups/new" component={GroupCreationFlow} />
    <ModalRoute
      transparent
      path="*/groups/edit/:groupId"
      component={GroupCreationFlow}
    />
    <ModalRoute
      transparent
      path="*/groups/details/:groupId/:tab?"
      undoAllHistoryOnClickOutside
      component={GroupDetails}
    />

    {/* TRANSACTION */}
    <ModalRoute transparent path="*/send" component={TransactionCreationFlow} />
    <ModalRoute
      transparent
      path="*/transactions/details/:transactionId/:tabIndex"
      component={TransactionDetails}
    />
    <ModalRoute path="*/receive" component={ReceiveFlow} disableBackdropClick />

    {/* ORGANIZATION */}
    <ModalRoute
      transparent
      path="*/organization/details/:id"
      component={OrganizationDetails}
    />
    <ModalRoute transparent path="*/admin-rules" component={EditAdminRules} />
  </Fragment>
);
