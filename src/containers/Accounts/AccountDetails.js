// @flow

import React from "react";
import connectData from "restlay/connectData";
import { FaMoneyCheck } from "react-icons/fa";

import AccountQuery from "api/queries/AccountQuery";
import PendingTransactionsForAccountQuery from "api/queries/PendingTransactionsForAccountQuery";
import { CardError } from "components/base/Card";
import { GrowingSpinner } from "components/base/GrowingCard";
import { withMe } from "components/UserContextProvider";
import AccountOverview from "containers/Admin/Accounts/AccountOverview";
import AccountSettings from "containers/Accounts/AccountSettings";
import { FetchEntityHistory } from "components/EntityHistory";
import EntityModal from "components/EntityModal";
import type { Connection } from "restlay/ConnectionQuery";
import type { Account, User, Transaction } from "data/types";

type Props = {
  close: () => void,
  me: User,
  account: Account,
  pendingTransactions: Connection<Transaction>,
};

function AccountDetails(props: Props) {
  const { close, account, me, pendingTransactions } = props;

  const hasPendingTransactions = pendingTransactions.edges.length > 0;
  const hasPendingEditGroup =
    account.tx_approval_steps &&
    account.tx_approval_steps.some(s => s && s.group.is_under_edit);

  return (
    <EntityModal
      growing
      entity={account}
      Icon={FaMoneyCheck}
      title={account.name}
      onClose={close}
      editURL={`/accounts/edit/${account.id}`}
      customWidth={680}
      disableEdit={hasPendingTransactions || hasPendingEditGroup}
    >
      <AccountOverview
        key="overview"
        hasPendingTransactions={hasPendingTransactions}
        account={account}
      />
      {me.role === "ADMIN" && (
        <FetchEntityHistory
          key="history"
          url={`/accounts/${account.id}/history`}
          entityType="account"
        />
      )}
      {account.status === "ACTIVE" && account.account_type !== "Erc20" && (
        <AccountSettings key="settings" account={account} />
      )}
    </EntityModal>
  );
}

export default connectData(withMe(AccountDetails), {
  RenderError: CardError,
  RenderLoading: GrowingSpinner,
  queries: {
    account: AccountQuery,
    pendingTransactions: PendingTransactionsForAccountQuery,
  },
  propsToQueryParams: props => ({
    accountId: props.match.params.accountId || "",
  }),
});
