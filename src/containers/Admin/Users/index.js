// @flow
import React, { PureComponent, Fragment } from "react";
import type { Match } from "react-router-dom";
import type { MemoryHistory } from "history";

import SearchUsersQuery from "api/queries/SearchUsers";

import { UsersTable } from "components/Table";
import { UsersFilters } from "components/filters";
import ModalRoute from "components/ModalRoute";
import InviteUserLink from "components/InviteUserLink";
import Box from "components/base/Box";
import DataSearch from "components/DataSearch";
import InviteUserMutation from "api/mutations/InviteUserMutation";
import UpdateUserRegistrationMutation from "api/mutations/UpdateUserRegistrationMutation";
import ApproveRequestMutation from "api/mutations/ApproveRequestMutation";
import AbortRequestMutation from "api/mutations/AbortRequestMutation";

import type { User } from "data/types";

import UserCreationFlow from "components/UserCreationFlow";

type Props = {
  match: Match,
  history: MemoryHistory,
};

const mutationsToListen = [
  InviteUserMutation,
  UpdateUserRegistrationMutation,
  ApproveRequestMutation,
  AbortRequestMutation,
];

class Users extends PureComponent<Props> {
  handleUserClick = (user: User) => {
    this.props.history.push(`users/details/${user.id}/overview`);
  };

  inviteUser = () => {
    this.props.history.push("users/invite/user");
  };

  ActionComponent = () => (
    <Box>
      <InviteUserLink onClick={this.inviteUser} />
    </Box>
  );

  render() {
    const { match, history } = this.props;

    return (
      <Fragment>
        <DataSearch
          Query={SearchUsersQuery}
          TableComponent={UsersTable}
          FilterComponent={UsersFilters}
          ActionComponent={this.ActionComponent}
          history={history}
          onRowClick={this.handleUserClick}
          listenMutations={mutationsToListen}
        />
        <ModalRoute
          path={`${match.url}/invite/user`}
          component={UserCreationFlow}
        />
      </Fragment>
    );
  }
}

export default Users;
