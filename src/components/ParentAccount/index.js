// @flow

/* gate return only the  id of the parent account, so we need to get all the
 * accounts to retrieve info
 * */
import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

import type { Account } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";
import AccountsQuery from "api/queries/AccountsQuery";
import connectData from "restlay/connectData";
import AccountName from "components/AccountName";
import VaultLink from "components/VaultLink";

type Props = {
  id: number,
  accounts: Connection<Account>,
};

const ParentAccount = (props: Props) => {
  const { id, accounts } = props;
  const account = accounts.edges.map(el => el.node).find(a => a.id === id);
  if (!account) return null;

  return (
    <VaultLink key={account.id} withRole to={`/accounts/view/${account.id}`}>
      <AccountName account={account} />
    </VaultLink>
  );
};

// FIXME don't know why I had to wrap it inside a div, otherwise i had a weird effect
const RenderLoading = () => (
  <div>
    <CircularProgress size={12} />
  </div>
);

export default connectData(ParentAccount, {
  RenderLoading,
  queries: {
    accounts: AccountsQuery,
  },
});
