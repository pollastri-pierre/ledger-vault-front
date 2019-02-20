// @flow

import React, { PureComponent } from "react";

import connectData from "restlay/connectData";
import GroupsQuery from "api/queries/GroupsQuery";

import Box from "components/base/Box";
import Card, { CardTitle, CardError, CardLoading } from "components/base/Card";
import ModalRoute from "components/ModalRoute";
import GroupsTable from "components/Table/GroupsTable";

import type { Group } from "data/types";

import GroupDetails from "./GroupDetails";

class AdminGroups extends PureComponent<*> {
  handleGroupClick = (group: Group) => {
    const { history } = this.props;
    history.push(`groups/${group.id}`);
  };

  render() {
    const { match } = this.props;
    return (
      <Box horizontal align="flex-start" flow={40}>
        <Card grow>
          <CardTitle>Admin Groups</CardTitle>
          <GroupsTable
            groups={this.props.groups}
            onGroupClick={this.handleGroupClick}
          />
        </Card>
        <Card width={500} noShrink>
          <CardTitle>Search</CardTitle>
        </Card>
        <ModalRoute path={`${match.url}/:groupId`} component={GroupDetails} />
      </Box>
    );
  }
}

export default connectData(AdminGroups, {
  RenderError: CardError,
  RenderLoading: CardLoading,
  queries: {
    groups: GroupsQuery
  }
});
