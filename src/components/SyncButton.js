// @flow

import React, { useState } from "react";
import Button from "components/base/Button";
import SearchTransactions from "api/queries/SearchTransactions";
import SyncAccountMutation from "api/mutations/SyncAccountMutation";
import connectData from "restlay/connectData";
import type { RestlayEnvironment } from "restlay/connectData";
import { FaSync, FaCheck } from "react-icons/fa";

import type { Account } from "data/types";

type Props = {
  account: Account,
  restlay: RestlayEnvironment,
};

const SyncButton = (props: Props) => {
  const { restlay, account } = props;
  const [synced, setSynced] = useState(false);
  const forceSync = async () => {
    await restlay.fetchQuery(
      new SyncAccountMutation({ accountID: `${account.id}` }),
    );
    const promise = await restlay.fetchQuery(
      new SearchTransactions({ account: [`${account.id}`] }),
    );
    setSynced(true);
    return promise;
  };

  return (
    <Button
      type="outline"
      variant="primary"
      size="small"
      onClick={forceSync}
      disabled={synced}
    >
      {synced ? <FaCheck /> : <FaSync />}
    </Button>
  );
};

export default connectData(SyncButton);
