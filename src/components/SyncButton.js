// @flow

import React, { useState } from "react";
import Button from "components/base/Button";
import Box from "components/base/Box";
import Text from "components/base/Text";
import colors from "shared/colors";
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
  return !synced ? (
    <Button type="filled" small onClick={forceSync}>
      <Box horizontal flow={5} align="center">
        <FaSync />
        <Text
          i18nKey={synced ? "accountView:synced" : "accountView:sync_button"}
        />
      </Box>
    </Button>
  ) : (
    <Box horizontal flow={5} align="center">
      <FaCheck color={colors.mediumGrey} />
      <Text i18nKey="accountView:synced" color={colors.mediumGrey} />
    </Box>
  );
};

export default connectData(SyncButton);
