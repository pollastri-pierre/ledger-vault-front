// @flow

import React, { PureComponent, Fragment } from "react";
import { Trans } from "react-i18next";

import type { Match } from "react-router-dom";
import type { MemoryHistory } from "history";

import AddLink from "components/base/AddLink";
import ModalRoute from "components/ModalRoute";
import { GroupsTable } from "components/Table";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { GroupsFilters } from "components/filters";
import GroupDetails from "containers/Admin/Groups/GroupDetails";
import CreateGroup from "containers/Admin/Groups/CreateGroup";
import SearchGroupsQuery from "api/queries/SearchGroups";
import ApproveRequestMutation from "api/mutations/ApproveRequestMutation";
import DataSearch from "components/DataSearch";

import type { Group } from "data/types";

type Props = {
  match: Match,
  history: MemoryHistory
};

const mutationsToListen = [ApproveRequestMutation];
class AdminGroups extends PureComponent<Props> {
  handleGroupClick = (group: Group) => {
    const { history } = this.props;
    history.push(`groups/${group.id}`);
  };

  createGroup = () => {
    const { history } = this.props;
    history.push(`groups/new`);
  };

  CardHeader = () => (
    <Box horizontal justify="flex-start" pb={20}>
      <AddLink onClick={this.createGroup}>
        <Text>
          <Trans i18nKey="group:create.title" />
        </Text>
      </AddLink>
    </Box>
  );

  render() {
    const { match, history } = this.props;
    return (
      <Fragment>
        <DataSearch
          Query={SearchGroupsQuery}
          TableComponent={GroupsTable}
          FilterComponent={GroupsFilters}
          HeaderComponent={this.CardHeader}
          onRowClick={this.handleGroupClick}
          history={history}
          listenMutations={mutationsToListen}
        />
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
      </Fragment>
    );
  }
}

export default AdminGroups;
