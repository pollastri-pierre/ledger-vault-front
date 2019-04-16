// @flow
import React, { Fragment } from "react";
import ModalRoute from "components/ModalRoute";
import GroupDetails from "containers/Admin/Groups/GroupDetails";
import AccountCreationFlow from "components/AccountCreationFlow";
import GroupCreationFlow from "components/GroupCreationFlow";
import TransactionCreationFlow from "components/TransactionCreationFlow";
import UserDetails from "containers/Admin/Users/UserDetails";
import AccountDetails from "containers/Accounts/AccountDetails";
import TransactionDetails from "components/transactions/TransactionModal";

export default () => (
  <Fragment>
    <ModalRoute
      path="*/groups/details/:groupId/:tabIndex?"
      undoAllHistoryOnClickOutside
      component={GroupDetails}
    />
    <ModalRoute path="*/groups/edit/:groupId" component={GroupCreationFlow} />
    <ModalRoute path="*/users/details/:userID" component={UserDetails} />
    <ModalRoute
      path="*/accounts/details/:accountId"
      component={AccountDetails}
    />
    <ModalRoute path="*/groups/new" component={GroupCreationFlow} />
    <ModalRoute path="*/new-transaction" component={TransactionCreationFlow} />
    <ModalRoute
      path="*/transactions/details/:transactionId/:tabIndex"
      component={TransactionDetails}
    />
    <ModalRoute
      path="*/accounts/new"
      component={AccountCreationFlow}
      disableBackdropClick
    />
  </Fragment>
);
