// @flow

import React, { useState } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";

import AccountsToMigrateQuery from "api/queries/AccountsToMigrateQuery";
import connectData from "restlay/connectData";
import type { User, Account } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";

import AccountName from "components/AccountName";
import Modal, { ModalClose } from "components/base/Modal";
import Text from "components/base/Text";
import Box from "components/base/Box";
import { RestlayTryAgain } from "components/TryAgain";

type Props = {
  me: User,
  accountsToMigrate: Connection<Account>,
};

const CheckMigration = (props: Props) => {
  const { me, accountsToMigrate } = props;
  const [hasForceClose, setForceClose] = useState(false);

  if (me.role !== "ADMIN") {
    return null;
  }

  const accounts = accountsToMigrate.edges.map(n => n.node);

  // if (!accounts.length) {
  //   return null;
  // }

  // const onClick = () => {
  //   history.push(`admin/accounts?status=MIGRATED&status=HSM_COIN_UPDATED`);
  // };

  // display different description if it's due to an update of hsm app
  // instead of account migration
  const isHSMAppUpdatedReason = accounts.some(
    a => a.status === "HSM_COIN_UPDATED",
  );

  return (
    <Modal
      isOpened={accounts.length > 0 && !hasForceClose}
      onClose={() => setForceClose(true)}
    >
      <Box width={400} p={40}>
        <ModalClose onClick={() => setForceClose(true)} />
        <Box flow={20}>
          <Text large bold i18nKey="welcome:migration.title" />
          {isHSMAppUpdatedReason ? (
            <Text i18nKey="welcome:migration.desc_hsm_app_updated" />
          ) : (
            <Text i18nKey="welcome:migration.desc" />
          )}
          <Text bold>
            <Trans
              i18nKey="welcome:migration.accounts"
              count={accounts.length}
            />
          </Text>
          <div>
            {accounts.map(account => (
              <Box
                horizontal
                align="center"
                justify="space-between"
                key={account.id}
              >
                <AccountName account={account} />
              </Box>
            ))}
          </div>
          <Box pt={40} horizontal flow={10} justify="center">
            <MigrateButton>Migrate all</MigrateButton>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

const MigrateButton = styled.div`
  background: hsl(0, 0%, 90%);
  padding: 5px 10px;
  border-radius: 2px;
  transition: 100ms linear background;
  &:hover {
    background: hsl(0, 0%, 93%);
    cursor: pointer;
  }
  &:active {
    background: hsl(0, 0%, 87%);
  }
`;

export default connectData(CheckMigration, {
  RenderError: RestlayTryAgain,
  queries: {
    accountsToMigrate: AccountsToMigrateQuery,
  },
});
