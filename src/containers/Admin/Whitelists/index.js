// @flow
import React from "react";
import type { MemoryHistory } from "history";
import SearchWhitelists from "api/queries/SearchWhitelists";
import WhitelistsTable from "components/Table/WhitelistsTable";
import { WhitelistsFilters } from "components/filters";
import PageHeaderActions from "components/base/PageHeaderActions";
import ApproveRequestMutation from "api/mutations/ApproveRequestMutation";
import AbortRequestMutation from "api/mutations/AbortRequestMutation";
import Text from "components/base/Text";
import DataSearch from "components/DataSearch";
import type { Whitelist } from "data/types";

type Props = {
  history: MemoryHistory,
};
const mutationsToListen = [ApproveRequestMutation, AbortRequestMutation];
const Whitelists = (props: Props) => {
  const handleRowClick = (whitelist: Whitelist) => {
    const { history } = props;
    history.push(`whitelists/details/${whitelist.id}/overview`);
  };

  const createWhitelist = () => {
    const { history } = props;
    history.push(`whitelists/new`);
  };

  const { history } = props;
  return (
    <>
      <PageHeaderActions
        onClick={createWhitelist}
        title={<Text i18nKey="menu:admin.whitelists" />}
        label={<Text i18nKey="whitelists:create.title" />}
      />
      <DataSearch
        Query={SearchWhitelists}
        TableComponent={WhitelistsTable}
        FilterComponent={WhitelistsFilters}
        listenMutations={mutationsToListen}
        history={history}
        onRowClick={handleRowClick}
      />
    </>
  );
};

export default Whitelists;
