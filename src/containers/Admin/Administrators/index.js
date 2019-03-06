// @flow
import React, { PureComponent, Fragment } from "react";
import type { Match } from "react-router-dom";
import type { MemoryHistory } from "history";

import SearchMembersQuery from "api/queries/SearchMembers";

import { CardTitle } from "components/base/Card";
import { MembersTable } from "components/Table";
import { MembersFilters } from "components/filters";
import ModalRoute from "components/ModalRoute";
import InviteMemberLink from "components/InviteMemberLink";
import Box from "components/base/Box";
import DataSearch from "components/DataSearch";

import type { Member } from "data/types";

import AdminDetails from "./AdminDetails";
import InviteAdmin from "../InviteAdmin";

type Props = {
  match: Match,
  history: MemoryHistory
};

class Administrators extends PureComponent<Props> {
  handleMemberClick = (admin: Member) => {
    this.props.history.push(`administrators/details/${admin.id}`);
  };

  inviteMember = () => {
    this.props.history.push("administrators/invite/admin");
  };

  HeaderComponent = () => (
    <Box horizontal align="flex-start" justify="space-between" pb={20}>
      <CardTitle>Administrators</CardTitle>
      <InviteMemberLink onClick={this.inviteMember} member="admin" />
    </Box>
  );

  render() {
    const { match, history } = this.props;

    return (
      <Fragment>
        <DataSearch
          Query={SearchMembersQuery}
          TableComponent={MembersTable}
          FilterComponent={MembersFilters}
          HeaderComponent={this.HeaderComponent}
          history={history}
          onRowClick={this.handleMemberClick}
        />
        <ModalRoute
          path={`${match.url}/invite/admin`}
          component={InviteAdmin}
        />
        <ModalRoute
          path={`${match.url}/details/:memberId`}
          component={AdminDetails}
        />
      </Fragment>
    );
  }
}

export default Administrators;
