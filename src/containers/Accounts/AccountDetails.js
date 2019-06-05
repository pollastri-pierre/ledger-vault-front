// @flow

import React from "react";
import connectData from "restlay/connectData";
import { Trans } from "react-i18next";
import { FaMoneyCheck, FaArchive } from "react-icons/fa";

import colors from "shared/colors";
import AccountQuery from "api/queries/AccountQuery";
import { CardError } from "components/base/Card";
import { GrowingSpinner } from "components/base/GrowingCard";
import { withMe } from "components/UserContextProvider";
import { createAndApprove } from "device/interactions/hsmFlows";
import AccountOverview from "containers/Admin/Accounts/AccountOverview";
import AccountTransactionRules from "containers/Admin/Accounts/AccountTransactionRules";
import AccountSettings from "containers/Accounts/AccountSettings";
import AccountHistory from "containers/Admin/Accounts/AccountHistory";
import ApproveRequestButton from "components/ApproveRequestButton";
import EntityModal from "components/EntityModal";
import type { Account, User } from "data/types";

type Props = {
  close: () => void,
  me: User,
  account: Account,
};

function AccountDetails(props: Props) {
  const { close, account, me } = props;
  const revokeButton = (
    <ApproveRequestButton
      interactions={createAndApprove}
      onSuccess={close}
      color={colors.warning}
      isRevoke
      Icon={FaArchive}
      disabled={false}
      additionalFields={{
        data: { account_id: account.id },
        type: "REVOKE_ACCOUNT",
      }}
      buttonLabel={<Trans i18nKey="accountDetails:archive" />}
    />
  );
  return (
    <EntityModal
      growing
      entity={account}
      Icon={FaMoneyCheck}
      title={account.name}
      onClose={close}
      revokeButton={revokeButton}
      editURL={`/accounts/edit/${account.id}`}
    >
      <AccountOverview key="overview" account={account} />
      <AccountTransactionRules key="transactionRules" account={account} />
      {me.role === "ADMIN" && (
        <AccountHistory key="history" account={account} />
      )}
      <AccountSettings key="settings" account={account} />
    </EntityModal>
  );
}

export default connectData(withMe(AccountDetails), {
  RenderError: CardError,
  RenderLoading: GrowingSpinner,
  queries: {
    account: AccountQuery,
  },
  propsToQueryParams: props => ({
    accountId: props.match.params.accountId || "",
  }),
});
