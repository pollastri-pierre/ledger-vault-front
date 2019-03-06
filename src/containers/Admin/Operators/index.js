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

import OperatorDetails from "./OperatorDetails";
import InviteOperator from "../InviteOperator";

type Props = {
  match: Match,
  history: MemoryHistory
};

class Operators extends PureComponent<Props> {
  handleMemberClick = (operator: Member) => {
    this.props.history.push(`operators/details/${operator.id}`);
  };

  inviteMember = () => {
    this.props.history.push("operators/invite/operator");
  };

  HeaderComponent = () => (
    <Box horizontal align="flex-start" justify="space-between" pb={20}>
      <CardTitle>Operators</CardTitle>
      <InviteMemberLink onClick={this.inviteMember} member="operator" />
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
          path={`${match.url}/invite/operator`}
          component={InviteOperator}
        />
        <ModalRoute
          path={`${match.url}/details/:memberId`}
          component={OperatorDetails}
        />
      </Fragment>
    );
  }
}

export default Operators;
