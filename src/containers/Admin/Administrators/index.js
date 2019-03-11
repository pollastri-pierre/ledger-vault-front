// @flow
import React, { PureComponent, Fragment } from "react";
import type { Match } from "react-router-dom";
import type { MemoryHistory } from "history";

import SearchAdministratorsQuery from "api/queries/SearchAdministrators";

import { CardTitle } from "components/base/Card";
import { UsersTable } from "components/Table";
import { UsersFilters } from "components/filters";
import ModalRoute from "components/ModalRoute";
import InviteUserLink from "components/InviteUserLink";
import Box from "components/base/Box";
import DataSearch from "components/DataSearch";
import InviteUserMutation from "api/mutations/InviteUserMutation";

import type { Member } from "data/types";

import AdminDetails from "./AdminDetails";
import InviteAdmin from "../InviteAdmin";

type Props = {
  match: Match,
  history: MemoryHistory
};

const mutationsToListen = [InviteUserMutation];

class Administrators extends PureComponent<Props> {
  handleUserClick = (admin: Member) => {
    this.props.history.push(`administrators/details/${admin.id}`);
  };

  inviteUser = () => {
    this.props.history.push("administrators/invite/admin");
  };

  HeaderComponent = () => (
    <Box horizontal align="flex-start" justify="space-between" pb={20}>
      <CardTitle>Administrators</CardTitle>
      <InviteUserLink onClick={this.inviteUser} user="admin" />
    </Box>
  );

  render() {
    const { match, history } = this.props;

    return (
      <Fragment>
        <DataSearch
          Query={SearchAdministratorsQuery}
          TableComponent={UsersTable}
          FilterComponent={UsersFilters}
          HeaderComponent={this.HeaderComponent}
          history={history}
          onRowClick={this.handleUserClick}
          listenMutations={mutationsToListen}
        />
        <ModalRoute
          path={`${match.url}/invite/admin`}
          component={InviteAdmin}
        />
        <ModalRoute
          path={`${match.url}/details/:userID`}
          component={AdminDetails}
        />
      </Fragment>
    );
  }
}

export default Administrators;
