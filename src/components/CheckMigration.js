// @flow

import React, { useState } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { FaHourglassHalf, FaCheck, FaArrowRight } from "react-icons/fa";

import colors from "shared/colors";
import AccountsToMigrateQuery from "api/queries/AccountsToMigrateQuery";
import OperatorsForAccountCreationQuery from "api/queries/OperatorsForAccountCreationQuery";
import GroupsForAccountCreationQuery from "api/queries/GroupsForAccountCreationQuery";
import connectData from "restlay/connectData";
import { createAndApprove } from "device/interactions/hsmFlows";
import type { User, Account, Group } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";

import {
  areApprovalsRulesValid,
  serializePayload,
  deserialize as accountToPayload,
} from "components/AccountCreationFlow";
import AccountName from "components/AccountName";
import ApproveRequestButton from "components/ApproveRequestButton";
import ApprovalsRules from "components/ApprovalsRules";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import Modal, {
  ModalClose,
  ModalFooterButton,
  ModalFooter,
} from "components/base/Modal";
import Text from "components/base/Text";
import Box from "components/base/Box";
import { RestlayTryAgain } from "components/TryAgain";

type Props = {
  allUsers: Connection<User>,
  allGroups: Connection<Group>,
  accountsToMigrate: Connection<Account>,
};

const isAccountHSMAppUpdated = a => a.status === "HSM_COIN_UPDATED";

const CheckMigration = (props: Props) => {
  const { allUsers, allGroups, accountsToMigrate } = props;

  // used to close the modal without migrating
  const [hasForceClose, setForceClose] = useState(false);

  // used to know on which account we are
  const [cursor, setCursor] = useState(0);

  // TODO we may have a transform at higher level
  const accounts = accountsToMigrate.edges.map(n => n.node);
  const users = allUsers.edges.map(n => n.node);
  const groups = allGroups.edges.map(n => n.node);

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
          <Text large bold i18nKey="welcome:migration.title" />
          {desc}
          <Text bold>
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
                  onMigrationSuccess={onSuccess}
                />
              );
            })}
          </AccountsToMigrate>
        </Box>
        {isFinished && (
          <Box height={40}>
            <ModalFooter>
              <ModalFooterButton color={colors.ocean} onClick={onClose}>
                <Box align="center" horizontal flow={10}>
                  <span>Access the Vault</span>
                  <FaArrowRight />
                </Box>
              </ModalFooterButton>
            </ModalFooter>
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
  onMigrationSuccess,
  status,
}: {
  account: Account,
  users: User[],
  groups: Group[],
  onMigrationSuccess: () => void,
  status: "active" | "waiting" | "done",
}) => {
  const isMigrated = account.status === "MIGRATED";
  const [payload, setPayload] = useState(accountToPayload(account));
  const onRulesChange = rules => setPayload({ ...payload, rules });
  const isValid = areApprovalsRulesValid(payload.rules);
  const isEditMode = true;
  const data = isValid ? serializePayload(payload, isEditMode) : null;
  const isOpened = status === "active";
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
          <ApprovalsRules
            users={users}
            groups={groups}
            rules={payload.rules}
            onChange={onRulesChange}
          />
          <Box
            horizontal
            align="flex-end"
            justify="flex-end"
            height={80}
            mb={-20}
            mr={-5}
          >
            <ApproveRequestButton
              disabled={!isValid}
              interactions={createAndApprove("ACCOUNT")}
              onSuccess={onMigrationSuccess}
              additionalFields={{
                type: isMigrated ? "MIGRATE_ACCOUNT" : "EDIT_ACCOUNT",
                data,
              }}
              buttonLabel="Update account"
            />
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
  },
});
