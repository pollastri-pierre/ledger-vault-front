// @flow
import React, { PureComponent, Fragment } from "react";
import type { Match } from "react-router-dom";
import type { MemoryHistory } from "history";
import MembersQuery from "api/queries/MembersQuery";
import connectData from "restlay/connectData";

import Card, { CardTitle } from "components/base/Card";
import MembersTable from "components/Table/MembersTable";
import ModalRoute from "components/ModalRoute";

import type { Member } from "data/types";

import AdminDetails from "./AdminDetails";

type Props = {
  admins: Member[],
  match: Match,
  history: MemoryHistory
};

class Administrators extends PureComponent<Props> {
  handleUserClick = (admin: Member) => {
    this.props.history.push(`administrators/${admin.id}`);
  };

  render() {
    const { admins, match } = this.props;
    return (
      <Fragment>
        <Card>
          <CardTitle>Administrators</CardTitle>
          <MembersTable users={admins} onMemberClick={this.handleUserClick} />
        </Card>
        <ModalRoute path={`${match.url}/:memberId`} component={AdminDetails} />
      </Fragment>
    );
  }
}

export default connectData(Administrators, {
  queries: {
    admins: MembersQuery
  },
  propsToQueryParams: () => ({
    memberRole: "admin"
  })
});
