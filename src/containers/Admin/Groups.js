// @flow
import React, { PureComponent } from "react";
import connectData from "restlay/connectData";
import Text from "components/base/Text";
import Card, { CardTitle } from "components/base/Card";
import GroupsQuery from "api/queries/GroupsQuery";
import type { Group } from "data/types";
import GroupsTable from "components/Table/GroupsTable";

class AdminGroups extends PureComponent<*> {
  handleGroupClick = (group: Group) => {
    console.warn(`TODO ${group.id}`);
  };

  render() {
    return (
      <Card>
        <CardTitle>Admin Groups</CardTitle>
        <GroupsTable
          groups={this.props.groups}
          onGroupClick={this.handleGroupClick}
        />
      </Card>
    );
  }
}

const RenderLoading = () => <Text>Render loading todo</Text>;
const RenderError = () => <Text>Render error todo</Text>;

export default connectData(AdminGroups, {
  RenderError,
  RenderLoading,
  queries: {
    groups: GroupsQuery
  }
});
