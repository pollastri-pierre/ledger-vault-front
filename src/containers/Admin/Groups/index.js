// @flow

import React, { PureComponent } from "react";
import { withRouter } from "react-router";
import q from "query-string";
import { Trans } from "react-i18next";

import type { Match } from "react-router-dom";
import type { MemoryHistory } from "history";

import GroupsQuery from "api/queries/GroupsQuery";
import connectData from "restlay/connectData";

import AddLink from "components/base/AddLink";
import ModalRoute from "components/ModalRoute";
import TryAgain from "components/TryAgain";
import InfiniteScrollable from "components/InfiniteScrollable";
import { GroupsTable } from "components/Table";
import Card, { CardLoading, CardTitle } from "components/base/Card";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { FiltersGroups } from "components/filters";
import GroupDetails from "containers/Admin/Groups/GroupDetails";
import CreateGroup from "containers/Admin/Groups/CreateGroup";

import type { Group } from "data/types";
import type { RestlayEnvironment } from "restlay/connectData";
import type { Connection } from "restlay/ConnectionQuery";

type Props = {
  match: Match,
  history: MemoryHistory
};

type State = {
  query: string
};

class AdminGroups extends PureComponent<Props, State> {
  state = {
    query: location.search
  };

  handleGroupClick = (group: Group) => {
    const { history } = this.props;
    history.push(`groups/${group.id}`);
  };

  createGroup = () => {
    const { history } = this.props;
    history.push(`groups/new`);
  };

  handleChangeQuery = query => {
    this.setState({ query });
    this.props.history.push({ search: query });
  };

  CardHeader = () => (
    <Box horizontal align="flex-start" justify="space-between" pb={20}>
      <CardTitle>Groups</CardTitle>
      <AddLink onClick={this.createGroup}>
        <Text>
          <Trans i18nKey="group:create.title" />
        </Text>
      </AddLink>
    </Box>
  );

  render() {
    const { match } = this.props;
    const { query } = this.state;
    return (
      <Box horizontal flow={20} align="flex-start">
        <GroupsResult
          query={query}
          onGroupClick={this.handleGroupClick}
          onCreateGroupClick={this.createGroup}
          CardHeader={this.CardHeader}
        />
        <FiltersGroups query={query} onChange={this.handleChangeQuery} />
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

const GroupsResultComponent = ({
  restlay,
  groups,
  onGroupClick,
  CardHeader
}: {
  restlay: RestlayEnvironment,
  groups: Connection<Group>,
  onGroupClick: Group => void,
  CardHeader: React$ComponentType<*>
}) => (
  <Card grow title="Groups">
    <CardHeader />
    <InfiniteScrollable
      restlay={restlay}
      restlayVariable="search"
      chunkSize={20}
    >
      <GroupsTable
        groups={groups.edges.map(e => e.node)}
        onGroupClick={onGroupClick}
      />
    </InfiniteScrollable>
  </Card>
);

const RenderError = ({
  error,
  restlay
}: {
  error: Error,
  restlay: RestlayEnvironment
}) => (
  <Card grow className="search-results">
    <TryAgain error={error} action={restlay.forceFetch} />
  </Card>
);

const RenderLoading = () => <CardLoading grow />;

const GroupsResult = connectData(GroupsResultComponent, {
  queries: {
    groups: GroupsQuery
  },
  initialVariables: {
    groups: 30
  },
  propsToQueryParams: ({ query }) => q.parse(query),
  RenderError,
  RenderLoading
});

export default withRouter(AdminGroups);
