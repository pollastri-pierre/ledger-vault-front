// @flow
import React from "react";
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
import UserCreationFlow from "components/UserCreationFlow";

export default () => (
  <>
    {/* USER */}
    <ModalRoute
      transparent
      path="*/users/details/:userID"
      component={UserDetails}
    />
    <ModalRoute
      path="*/users/new"
      component={UserCreationFlow}
      disableBackdropClick
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
      disableBackdropClick
    />
    <ModalRoute
      transparent
      path="*/accounts/new"
      component={AccountCreationFlow}
      disableBackdropClick
    />

    {/* GROUP */}
    <ModalRoute
      transparent
      path="*/groups/new"
      component={GroupCreationFlow}
      disableBackdropClick
    />
    <ModalRoute
      transparent
      path="*/groups/edit/:groupId"
      component={GroupCreationFlow}
      disableBackdropClick
    />
    <ModalRoute
      transparent
      path="*/groups/details/:groupId/:tab?"
      component={GroupDetails}
    />

    {/* TRANSACTION */}
    <ModalRoute
      transparent
      path="*/send/:id?"
      component={TransactionCreationFlow}
      disableBackdropClick
    />
    <ModalRoute
      transparent
      path="*/transactions/details/:transactionId/:tabIndex"
      component={TransactionDetails}
    />
    <ModalRoute transparent path="*/receive/:id?" component={ReceiveFlow} />

    {/* ORGANIZATION */}
    <ModalRoute
      transparent
      path="*/organization/details/:id"
      component={OrganizationDetails}
    />
    <ModalRoute transparent path="*/admin-rules" component={EditAdminRules} />
  </>
);
