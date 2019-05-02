// @flow

import React from "react";
import { Redirect } from "react-router";
import { Trans } from "react-i18next";
import type { MemoryHistory } from "history";

import colors from "shared/colors";
import ProfileQuery from "api/queries/ProfileQuery";
import AccountsToMigrateQuery from "api/queries/AccountsToMigrateQuery";
import connectData from "restlay/connectData";
import type { User, Account } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";

import CenteredLayout from "components/base/CenteredLayout";
import Card from "components/base/Card";
import Box from "components/base/Box";
import Absolute from "components/base/Absolute";
import { ModalFooterButton } from "components/base/Modal";
import Text from "components/base/Text";
import AccountName from "components/AccountName";
import { RestlayTryAgain } from "components/TryAgain";

type OuterProps = {
  workspace: string,
  history: MemoryHistory,
};

type Props = OuterProps & {
  profile: User,
  accountsToMigrate: Connection<Account>,
};

const CheckMigration = (props: Props) => {
  const { profile, workspace, accountsToMigrate, history } = props;

  if (profile.role !== "ADMIN" || accountsToMigrate.edges.length === 0) {
    return <Redirect to={workspace} />;
  }

  const accounts = accountsToMigrate.edges.map(n => n.node);

  const onClick = () => {
    history.push(`/${workspace}/admin/accounts?status=MIGRATED`);
  };

  return (
    <Card width={500} pb={80}>
      <Box flow={20}>
        <Text large bold i18nKey="welcome:migration.title" />
        <Text i18nKey="welcome:migration.desc" />
        <Text bold i18nKey="welcome:migration.accounts" />
        <Box>
          {accounts.map(account => (
            <AccountName key={account.id} account={account} />
          ))}
        </Box>
      </Box>
      <Absolute bottom={0} right={15}>
        <ModalFooterButton color={colors.ocean} onClick={onClick}>
          <Text i18nKey="welcome:migration.takeMeThere" />
        </ModalFooterButton>
      </Absolute>
    </Card>
  );
};

const options = {
  RenderLoading: () => <Trans i18nKey="welcome:migration.settingUp" />,
  RenderError: RestlayTryAgain,
  queries: {
    accountsToMigrate: AccountsToMigrateQuery,
    profile: ProfileQuery,
  },
  propsToFetchParams: ({ workspace }: { workspace: string }) => ({
    prefix: workspace,
  }),
};

const ConnectedCheckMigration = connectData(CheckMigration, options);

export default (p: OuterProps) => (
  <CenteredLayout>
    <ConnectedCheckMigration {...p} />
  </CenteredLayout>
);
