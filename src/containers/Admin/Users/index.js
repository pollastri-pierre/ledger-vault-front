// @flow
import React, { PureComponent, Fragment } from "react";
import type { Match } from "react-router-dom";
import type { MemoryHistory } from "history";

import SearchUsersQuery from "api/queries/SearchUsers";

import { CardTitle } from "components/base/Card";
import { UsersTable } from "components/Table";
import { UsersFilters } from "components/filters";
import ModalRoute from "components/ModalRoute";
import InviteUserLink from "components/InviteUserLink";
import Box from "components/base/Box";
import DataSearch from "components/DataSearch";
import InviteUserMutation from "api/mutations/InviteUserMutation";
import UpdateUserRegistrationMutation from "api/mutations/UpdateUserRegistrationMutation";

import type { Member } from "data/types";

import UserDetails from "./UserDetails";
import InviteUser from "../InviteUser";

type Props = {
  match: Match,
  history: MemoryHistory,
};

const mutationsToListen = [InviteUserMutation, UpdateUserRegistrationMutation];

class Users extends PureComponent<Props> {
  handleUserClick = (user: Member) => {
    this.props.history.push(`users/details/${user.id}`);
  };

  inviteUser = () => {
    this.props.history.push("users/invite/user");
  };

  HeaderComponent = () => (
    <Box horizontal align="flex-start" justify="space-between" pb={20}>
      <CardTitle i18nKey="inviteUser:header" />
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
          HeaderComponent={this.HeaderComponent}
          history={history}
          onRowClick={this.handleUserClick}
          listenMutations={mutationsToListen}
        />
        <ModalRoute path={`${match.url}/invite/user`} component={InviteUser} />
        <ModalRoute
          path={`${match.url}/details/:userID`}
          component={UserDetails}
        />
      </Fragment>
    );
  }
}

export default Users;
