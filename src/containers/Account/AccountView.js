// @flow

import React from "react";
import type { Match } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Route, Switch } from "react-router-dom";

import { useMe } from "components/UserContextProvider";
import AccountWarning from "containers/Account/AccountWarning";
import { UtxosTable } from "components/Table";
import ResponsiveContainer from "components/base/ResponsiveContainer";
import type { Account } from "data/types";
import AccountQuery from "api/queries/AccountQuery";
import DataSearch from "components/DataSearch";
import AccountUTXOQuery from "api/queries/AccountUTXOQuery";
import { AccountQuickInfoHeaderUtxo } from "components/widgets/AccountQuickInfoWidget";
import { isBalanceAvailable } from "utils/accounts";
import { UtxosFilters } from "components/filters";
import Box from "components/base/Box";
import Card from "components/base/Card";
import {
  AccountQuickInfoWidget,
  AccountLastTransactionsWidget,
  SubAccountsWidget,
  TransactionsGraphWidget,
  connectWidget,
  UtxoGraphWidget,
  UtxoDistributionWidget,
} from "components/widgets";
import Widget from "components/widgets/Widget";

type Props = {
  account: Account,
};

const DISPLAY_UTXO_GRAPH = false;

function AccountView(props: Props) {
  const { account } = props;
  const me = useMe();
  const { t } = useTranslation();

  return (
    <Switch>
      <Route path="/:org/:role/accounts/view/:id/utxo">
        <Box>
          <AccountQuickInfoHeaderUtxo account={account} />
          <Box flow={50}>
            <UtxoDistributionWidget account={account} />
            <Widget title={t("accountView:utxos.utxo_search_title")}>
              <Card style={{ padding: 0 }}>
                <DataSearch
                  noFilter
                  Query={AccountUTXOQuery}
                  extraProps={{ accountId: account.id, account }}
                  queryExtraProps={{ accountId: account.id }}
                  TableComponent={UtxosTable}
                  FilterComponent={UtxosFilters}
                />
              </Card>
            </Widget>
          </Box>
        </Box>
      </Route>
      <Route path="/:org/:role/accounts/view/:id">
        <Box flow={20} key={account.id}>
          <AccountWarning account={account} me={me} />
          <ResponsiveContainer>
            <Box flow={20} grow>
              <AccountQuickInfoWidget account={account} />
              <ResponsiveContainer>
                {account.account_type === "Ethereum" ? (
                  <Box flex={1}>
                    <SubAccountsWidget account={account} />
                  </Box>
                ) : account.account_type === "Bitcoin" && DISPLAY_UTXO_GRAPH ? (
                  <Box flex={2}>
                    <UtxoGraphWidget account={account} />
                  </Box>
                ) : null}
                {isBalanceAvailable(account) && (
                  <Box flex={2} style={{ minWidth: 500 }}>
                    <TransactionsGraphWidget account={account} />
                  </Box>
                )}
              </ResponsiveContainer>
              <AccountLastTransactionsWidget account={account} />
            </Box>
          </ResponsiveContainer>
        </Box>
      </Route>
    </Switch>
  );
}

export default connectWidget(AccountView, {
  height: 600,
  queries: {
    account: AccountQuery,
  },
  propsToQueryParams: ({ match }: { match: Match }) => ({
    accountId: match.params.id,
  }),
});
