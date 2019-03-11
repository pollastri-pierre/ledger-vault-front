// @flow

import React, { PureComponent, Fragment } from "react";
import type { Match } from "react-router-dom";
import type { MemoryHistory } from "history";

import SearchOperatorsQuery from "api/queries/SearchOperators";

import { CardTitle } from "components/base/Card";
import { UsersTable } from "components/Table";
import { UsersFilters } from "components/filters";
import ModalRoute from "components/ModalRoute";
import InviteUserLink from "components/InviteUserLink";
import Box from "components/base/Box";
import DataSearch from "components/DataSearch";
import InviteUserMutation from "api/mutations/InviteUserMutation";

import type { Member } from "data/types";

import OperatorDetails from "./OperatorDetails";
import InviteOperator from "../InviteOperator";

type Props = {
  match: Match,
  history: MemoryHistory
};

const mutationsToListen = [InviteUserMutation];
class Operators extends PureComponent<Props> {
  handleMemberClick = (operator: Member) => {
    this.props.history.push(`operators/details/${operator.id}`);
  };

  inviteUser = () => {
    this.props.history.push("operators/invite/operator");
  };

  HeaderComponent = () => (
    <Box horizontal align="flex-start" justify="space-between" pb={20}>
      <CardTitle>Operators</CardTitle>
      <InviteUserLink onClick={this.inviteUser} user="operator" />
    </Box>
  );

  render() {
    const { match, history } = this.props;

    return (
      <Fragment>
        <DataSearch
          Query={SearchOperatorsQuery}
          TableComponent={UsersTable}
          FilterComponent={UsersFilters}
          HeaderComponent={this.HeaderComponent}
          history={history}
          onRowClick={this.handleMemberClick}
          listenMutations={mutationsToListen}
        />
        <ModalRoute
          path={`${match.url}/invite/operator`}
          component={InviteOperator}
        />
        <ModalRoute
          path={`${match.url}/details/:userID`}
          component={OperatorDetails}
        />
      </Fragment>
    );
  }
}

export default Operators;
