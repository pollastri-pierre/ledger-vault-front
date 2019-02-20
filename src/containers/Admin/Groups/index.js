// @flow

import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import connectData from "restlay/connectData";
import GroupsQuery from "api/queries/GroupsQuery";
import Text from "components/base/Text";
import Card, { CardTitle, CardError, CardLoading } from "components/base/Card";
import AddLink from "components/base/AddLink";
import ModalRoute from "components/ModalRoute";
import Box from "components/base/Box";
import GroupsTable from "components/Table/GroupsTable";
import type { Group } from "data/types";
import GroupDetails from "./GroupDetails";
import CreateGroup from "./CreateGroup";

class AdminGroups extends PureComponent<*> {
  handleGroupClick = (group: Group) => {
    const { history } = this.props;
    history.push(`groups/${group.id}`);
  };

  createGroup = () => {
    const { history } = this.props;
    history.push(`groups/new`);
  };

  render() {
    const { match } = this.props;
    return (
      <Box horizontal align="flex-start" flow={40}>
        <Card grow>
          <CardTitle>Admin Groups</CardTitle>
          <AddLink onClick={this.createGroup}>
            <Text>
              <Trans i18nKey="group:create.title" />
            </Text>
          </AddLink>
          <GroupsTable
            groups={this.props.groups}
            onGroupClick={this.handleGroupClick}
          />
        </Card>
        <Card width={500} noShrink>
          <CardTitle>Search</CardTitle>
        </Card>
        <ModalRoute
          path={`${match.url}/:groupId`}
          render={(
            props // looks hacky but prevent bug with <Switch> and ModalRoute with the overlay animation
          ) =>
            props.match.params.groupId === "new" ? (
              <CreateGroup {...props} />
            ) : (
              <GroupDetails {...props} />
            )
          }
        />
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
