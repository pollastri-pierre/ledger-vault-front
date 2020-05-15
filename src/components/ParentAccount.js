// @flow

/* gate return only the  id of the parent account, so we need to get all the
 * accounts to retrieve info
 * */
import React from "react";

import type { Account } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";
import SearchAccounts from "api/queries/SearchAccounts";
import connectData from "restlay/connectData";
import AccountName from "components/AccountName";
import VaultLink from "components/VaultLink";
import Spinner from "components/base/Spinner";

type Props = {
  id: number,
  accounts: Connection<Account>,
};

const ParentAccount = (props: Props) => {
  const { id, accounts } = props;
  const account = accounts.edges.map((el) => el.node).find((a) => a.id === id);
  if (!account) return null;

  return (
    <VaultLink key={account.id} withRole to={`/accounts/view/${account.id}`}>
      <AccountName account={account} />
    </VaultLink>
  );
};

const RenderLoading = () => <Spinner size="small" />;

export default connectData(ParentAccount, {
  RenderLoading,
  queries: {
    accounts: SearchAccounts,
  },
  propsToQueryParams: () => ({
    pageSize: -1,
  }),
});
