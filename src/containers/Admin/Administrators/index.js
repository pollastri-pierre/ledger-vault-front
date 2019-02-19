// @flow
import React, { PureComponent, Fragment } from "react";
import type { Match } from "react-router-dom";
import type { MemoryHistory } from "history";
import MembersQuery from "api/queries/MembersQuery";
import connectData from "restlay/connectData";

import Card, { CardTitle, CardError, CardLoading } from "components/base/Card";
import MembersTable from "components/Table/MembersTable";
import ModalRoute from "components/ModalRoute";
import InviteMemberLink from "components/InviteMemberLink";

import type { Member } from "data/types";

import AdminDetails from "./AdminDetails";
import InviteAdmin from "../InviteAdmin";

type Props = {
  admins: Member[],
  match: Match,
  history: MemoryHistory
};

class Administrators extends PureComponent<Props> {
  handleUserClick = (admin: Member) => {
    this.props.history.push(`administrators/details/${admin.id}`);
  };

  inviteMember = () => {
    this.props.history.push("administrators/invite/admin");
  };

  render() {
    const { admins, match } = this.props;
    return (
      <Fragment>
        <Card>
          <CardTitle>Administrators</CardTitle>
          <InviteMemberLink onClick={this.inviteMember} member="admin" />
          <MembersTable members={admins} onMemberClick={this.handleUserClick} />
        </Card>
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

export default connectData(Administrators, {
  RenderLoading: CardLoading,
  RenderError: CardError,
  queries: {
    admins: MembersQuery
  },
  propsToQueryParams: () => ({
    memberRole: "admin"
  })
});
