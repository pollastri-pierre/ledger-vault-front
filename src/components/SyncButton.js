// @flow

import React, { useState } from "react";
import Button from "components/base/Button";
import Box from "components/base/Box";
import SyncAccountMutation from "api/mutations/SyncAccountMutation";
import SearchTransactions from "api/queries/SearchTransactions";
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
    await restlay.commitMutation(
      new SyncAccountMutation({ accountID: `${account.id}` }),
    );
    const promise = await restlay.fetchQuery(
      new SearchTransactions({ account: [`${account.id}`] }),
    );
    setSynced(true);
    return promise;
  };
  // had to wrap in a fixed width box  because outline button are slightly larger than filled button
  return (
    <Box width={40}>
      <Button
        type={synced ? "outline" : "filled"}
        variant="info"
        small
        onClick={forceSync}
        disabled={synced}
      >
        {synced ? <FaCheck /> : <FaSync />}
      </Button>
    </Box>
  );
};

export default connectData(SyncButton);
