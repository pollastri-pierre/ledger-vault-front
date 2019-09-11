// @flow

import React, { useState } from "react";
import { Trans } from "react-i18next";
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
    <Button
      IconLeft={() => <FaSync style={{ marginRight: 2 }} />}
      size="tiny"
      variant="text"
      customColor={colors.mediumGrey}
      onClick={forceSync}
    >
      {synced ? (
        <Trans i18nKey="accountView:synced" />
      ) : (
        <Trans i18nKey="accountView:sync_button" />
      )}
    </Button>
  ) : (
    <Box horizontal flow={5} align="center">
      <FaCheck color={colors.mediumGrey} />
      <Text i18nKey="accountView:synced" color={colors.mediumGrey} />
    </Box>
  );
};

export default connectData(SyncButton);
