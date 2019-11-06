// @flow

import React, { PureComponent } from "react";
import type { MemoryHistory } from "history";
import { GroupsTable } from "components/Table";
import Text from "components/base/Text";
import PageHeaderActions from "components/base/PageHeaderActions";
import { GroupsFilters } from "components/filters";
import SearchGroupsQuery from "api/queries/SearchGroups";
import ApproveRequestMutation from "api/mutations/ApproveRequestMutation";
import AbortRequestMutation from "api/mutations/AbortRequestMutation";
import DataSearch from "components/DataSearch";

import type { Group } from "data/types";

type Props = {
  history: MemoryHistory,
};

const mutationsToListen = [ApproveRequestMutation, AbortRequestMutation];

class AdminGroups extends PureComponent<Props> {
  handleGroupClick = (group: Group) => {
    const { history } = this.props;
    history.push(`groups/details/${group.id}/overview`);
  };

  createGroup = () => {
    const { history } = this.props;
    history.push(`groups/new`);
  };

  render() {
    const { history } = this.props;
    return (
      <>
        <PageHeaderActions
          onClick={this.createGroup}
          title={<Text i18nKey="menu:admin.groups" />}
          label={<Text i18nKey="group:create.title" />}
        />
        <DataSearch
          Query={SearchGroupsQuery}
          TableComponent={GroupsTable}
          FilterComponent={GroupsFilters}
          onRowClick={this.handleGroupClick}
          history={history}
          listenMutations={mutationsToListen}
        />
      </>
    );
  }
}

export default AdminGroups;
