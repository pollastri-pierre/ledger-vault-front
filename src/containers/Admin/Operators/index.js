// @flow
import React, { PureComponent, Fragment } from "react";
import type { Match } from "react-router-dom";
import type { MemoryHistory } from "history";
import MembersQuery from "api/queries/MembersQuery";
import connectData from "restlay/connectData";

import Card, { CardTitle, CardLoading, CardError } from "components/base/Card";
import MembersTable from "components/Table/MembersTable";
import ModalRoute from "components/ModalRoute";
import InviteMemberLink from "components/InviteMemberLink";
import Box from "components/base/Box";

import type { Member } from "data/types";

import OperatorDetails from "./OperatorDetails";
import InviteOperator from "../InviteOperator";

type Props = {
  operators: Member[],
  match: Match,
  history: MemoryHistory
};

class Administrators extends PureComponent<Props> {
  handleMemberClick = (operator: Member) => {
    this.props.history.push(`operators/details/${operator.id}`);
  };

  inviteMember = () => {
    this.props.history.push("operators/invite/operator");
  };

  render() {
    const { operators, match } = this.props;
    return (
      <Fragment>
        <Card>
          <Box horizontal align="flex-start" justify="space-between" pb={20}>
            <CardTitle>Operators</CardTitle>
            <InviteMemberLink onClick={this.inviteMember} member="admin" />
          </Box>
          <MembersTable
            members={operators}
            onMemberClick={this.handleMemberClick}
          />
        </Card>
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

export default connectData(Administrators, {
  RenderLoading: CardLoading,
  RenderError: CardError,
  queries: {
    operators: MembersQuery
  },
  propsToQueryParams: () => ({
    memberRole: "operator"
  })
});
