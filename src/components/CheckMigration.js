// @flow

import React, { useState } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { FaHourglassHalf, FaCheck } from "react-icons/fa";

import colors from "shared/colors";
import AccountsToMigrateQuery from "api/queries/AccountsToMigrateQuery";
import OperatorsForAccountCreationQuery from "api/queries/OperatorsForAccountCreationQuery";
import GroupsForAccountCreationQuery from "api/queries/GroupsForAccountCreationQuery";
import SearchWhitelists from "api/queries/SearchWhitelists";
import connectData from "restlay/connectData";
import { createAndApprove } from "device/interactions/hsmFlows";
import { getAccountCurrencyOrToken } from "utils/accounts";
import type { User, Account, Group, Whitelist } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";

import {
  areRulesSetsValid,
  serializePayload,
  deserialize as accountToPayload,
} from "components/AccountCreationFlow";
import AccountName from "components/AccountName";
import ApproveRequestButton from "components/ApproveRequestButton";
import MultiRules from "components/MultiRules";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import Modal, { ModalClose } from "components/base/Modal";
import Text from "components/base/Text";
import Box from "components/base/Box";
import Button from "components/base/Button";
import Absolute from "components/base/Absolute";
import { RestlayTryAgain } from "components/TryAgain";

type Props = {
  allUsers: Connection<User>,
  allGroups: Connection<Group>,
  allWhitelists: Connection<Whitelist>,
  accountsToMigrate: Connection<Account>,
};

const isAccountHSMAppUpdated = (a) => a.status === "HSM_COIN_UPDATED";

const CheckMigration = (props: Props) => {
  const { allUsers, allGroups, allWhitelists, accountsToMigrate } = props;

  // used to close the modal without migrating
  const [hasForceClose, setForceClose] = useState(false);

  // used to know on which account we are
  const [cursor, setCursor] = useState(0);

  // TODO we may have a transform at higher level
  const accounts = accountsToMigrate.edges.map((n) => n.node);
  const users = allUsers.edges.map((n) => n.node);
  const groups = allGroups.edges.map((n) => n.node);
  const whitelists = allWhitelists.edges.map((n) => n.node);

  // view props
  const count = accounts.length;
  const isOpened = accounts.length > 0 && !hasForceClose;
  const onClose = () => setForceClose(true);
  const isHSMAppUpdatedReason = accounts.some(isAccountHSMAppUpdated);
  const desc = isHSMAppUpdatedReason ? (
    <Text i18nKey="welcome:migration.desc_hsm_app_updated" />
  ) : (
    <Text i18nKey="welcome:migration.desc" />
  );

  const isFinished = cursor === count;

  return (
    <Modal isOpened={isOpened} onClose={onClose}>
      <Box width={750} p={40}>
        <ModalClose onClick={onClose} />
        <Box flow={20}>
          <Text
            size="large"
            fontWeight="bold"
            i18nKey="welcome:migration.title"
          />
          {desc}
          <Text fontWeight="bold">
            <Trans i18nKey="welcome:migration.accounts" count={count} />
          </Text>
          <AccountsToMigrate>
            {accounts.map((account, i) => {
              const onSuccess = () => setCursor(cursor + 1);
              const status =
                i === cursor ? "active" : i < cursor ? "done" : "waiting";
              return (
                <AccountToMigrate
                  key={account.id}
                  status={status}
                  account={account}
                  users={users}
                  groups={groups}
                  whitelists={whitelists}
                  onMigrationSuccess={onSuccess}
                />
              );
            })}
          </AccountsToMigrate>
        </Box>
        {isFinished && (
          <Box height={40} position="relative">
            <Absolute top={20} right={0}>
              <Button type="filled" onClick={onClose}>
                <Text>Access the Vault</Text>
              </Button>
            </Absolute>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

const AccountsToMigrate = styled(Box)`
  border: 1px solid ${colors.legacyLightGrey1};
  border-radius: 4px;
  > * + * {
    border-top: 1px solid ${colors.legacyLightGrey1};
  }
`;

const AccountToMigrate = ({
  account,
  users,
  groups,
  whitelists,
  onMigrationSuccess,
  status,
}: {
  account: Account,
  users: User[],
  groups: Group[],
  whitelists: Whitelist[],
  onMigrationSuccess: () => void,
  status: "active" | "waiting" | "done",
}) => {
  const isMigrated = account.status === "MIGRATED";
  const [payload, setPayload] = useState(accountToPayload(account));
  const onRulesSetsChange = (rulesSets) =>
    setPayload({ ...payload, rulesSets });
  const isValid = areRulesSetsValid(payload.rulesSets);
  const isEditMode = true;
  const data = isValid ? serializePayload(payload, isEditMode) : null;
  const isOpened = status === "active";
  const currencyOrToken = getAccountCurrencyOrToken(account);
  return (
    <Box key={account.id} p={20} flow={10} position="relative">
      <Box horizontal align="center" justify="space-between">
        <Box horizontal align="center" flow={10}>
          <AccountName account={account} />
          <span>-</span>
          <span>
            <CurrencyAccountValue value={account.balance} account={account} />
          </span>
        </Box>
        {!isOpened &&
          (status === "waiting" ? (
            <FaHourglassHalf />
          ) : (
            <FaCheck color={colors.ocean} />
          ))}
      </Box>
      {isOpened && (
        <>
          <MultiRules
            rulesSets={payload.rulesSets}
            onChange={onRulesSetsChange}
            users={users}
            whitelists={whitelists}
            groups={groups}
            currencyOrToken={currencyOrToken}
          />
          <Box height={80} position="relative">
            <Absolute top={20} right={20}>
              <ApproveRequestButton
                disabled={!isValid}
                interactions={createAndApprove("ACCOUNT", {
                  successNotif: true,
                })}
                onSuccess={onMigrationSuccess}
                additionalFields={{
                  type: isMigrated ? "MIGRATE_ACCOUNT" : "EDIT_ACCOUNT",
                  data,
                }}
                buttonLabel="Update account"
              />
            </Absolute>
          </Box>
        </>
      )}
    </Box>
  );
};

export default connectData(CheckMigration, {
  RenderError: RestlayTryAgain,
  queries: {
    accountsToMigrate: AccountsToMigrateQuery,
    allUsers: OperatorsForAccountCreationQuery,
    allGroups: GroupsForAccountCreationQuery,
    allWhitelists: SearchWhitelists,
  },
});
