// @flow

import React from "react";
import Button from "components/base/Button";
import SyncAccountMutation from "api/mutations/SyncAccountMutation";
import connectData from "restlay/connectData";
import type { RestlayEnvironment } from "restlay/connectData";
import { FaSync } from "react-icons/fa";

import type { Account } from "data/types";

type Props = {
  account: Account,
  restlay: RestlayEnvironment,
};

const SyncButton = (props: Props) => {
  const { restlay, account } = props;
  const forceSync = async () => {
    await restlay.fetchQuery(
      new SyncAccountMutation({ accountID: `${account.id}` }),
    );

    // VFE-158
    //
    // do full page refresh as refreshing specific data leads to inconsistent
    // states (we need txs, account, utxos... maybe more some day...)
    document.location.reload();

    // keep loading state 5s so it still spin during page refresh
    return new Promise((r) => setTimeout(r, 5e3));
  };

  return (
    <Button type="outline" variant="primary" size="small" onClick={forceSync}>
      <FaSync />
    </Button>
  );
};

export default connectData(SyncButton);
