// @flow

import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import type { MemoryHistory } from "history";
import AddLink from "components/base/AddLink";
import { GroupsTable } from "components/Table";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { GroupsFilters } from "components/filters";
import SearchGroupsQuery from "api/queries/SearchGroups";
import ApproveRequestMutation from "api/mutations/ApproveRequestMutation";
import DataSearch from "components/DataSearch";

import type { Group } from "data/types";

type Props = {
  history: MemoryHistory,
};

const mutationsToListen = [ApproveRequestMutation];
class AdminGroups extends PureComponent<Props> {
  handleGroupClick = (group: Group) => {
    const { history } = this.props;
    history.push(`groups/details/${group.id}/0`);
  };

  createGroup = () => {
    const { history } = this.props;
    history.push(`groups/new`);
  };

  ActionComponent = () => (
    <Box>
      <AddLink onClick={this.createGroup}>
        <Text>
          <Trans i18nKey="group:create.title" />
        </Text>
      </AddLink>
    </Box>
  );

  render() {
    const { history } = this.props;
    return (
      <DataSearch
        Query={SearchGroupsQuery}
        TableComponent={GroupsTable}
        FilterComponent={GroupsFilters}
        ActionComponent={this.ActionComponent}
        onRowClick={this.handleGroupClick}
        history={history}
        listenMutations={mutationsToListen}
      />
    );
  }
}

export default AdminGroups;
