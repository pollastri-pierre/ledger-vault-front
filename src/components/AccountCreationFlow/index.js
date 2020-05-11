// @flow

import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { FaMoneyCheck } from "react-icons/fa";
import { connect } from "react-redux";

import connectData from "restlay/connectData";
import { resetRequest } from "redux/modules/requestReplayStore";
import type { RestlayEnvironment } from "restlay/connectData";
import type { Match } from "react-router-dom";
import TryAgain from "components/TryAgain";
import { createAndApprove } from "device/interactions/hsmFlows";
import GrowingCard, { GrowingSpinner } from "components/base/GrowingCard";
import PotentialParentAccountsQuery from "api/queries/PotentialParentAccountsQuery";
import OperatorsForAccountCreationQuery from "api/queries/OperatorsForAccountCreationQuery";
import GroupsForAccountCreationQuery from "api/queries/GroupsForAccountCreationQuery";
import InfoBox from "components/base/InfoBox";
import SearchWhitelistsForAccountQuery from "api/queries/SearchWhitelistsForAccountQuery";
import AccountQuery from "api/queries/AccountQuery";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import MultiStepsFlow from "components/base/MultiStepsFlow";
import Button from "components/base/Button";
import MultiStepsSuccess from "components/base/MultiStepsFlow/MultiStepsSuccess";
import Text from "components/base/Text";
import Box from "components/base/Box";
import ApproveRequestButton from "components/ApproveRequestButton";
import { handleCancelOnDevice } from "utils/request";
import {
  isNotSupportedCoin,
  getCurrencyIdFromBlockchainName,
  getERC20TokenByContractAddress,
} from "utils/cryptoCurrencies";
import {
  serializeRulesSetsForPOST,
  isValidRulesSet,
  isEmptyRulesSet,
  convertEditDataIntoRules,
} from "components/MultiRules/helpers";
import type { RulesSet } from "components/MultiRules/types";
import CryptoCurrencyIcon from "components/CryptoCurrencyIcon";
import type {
  EditAccountReplay,
  CreateAccountReplay,
} from "redux/modules/requestReplayStore";

import type { Account, Group, User } from "data/types";
import type { PayloadUpdater } from "components/base/MultiStepsFlow/types";
import AccountCreationCurrency from "./steps/AccountCreationCurrency";
import AccountCreationName from "./steps/AccountCreationName";
import AccountCreationRules from "./steps/AccountCreationRules";
import AccountCreationConfirmation from "./steps/AccountCreationConfirmation";

import type { AccountCreationPayload } from "./types";

const emptyRulesSets = [
  {
    name: "Rule 1",
    rules: [
      {
        type: "MULTI_AUTHORIZATIONS",
        data: [],
      },
    ],
  },
];

export const initialPayload: AccountCreationPayload = {
  name: "",
  accountStatus: "",
  rulesSets: emptyRulesSets,
  currency: null,
  erc20token: null,
  parentAccount: null,
  derivationMode: null,
};

const cleanRules = (
  payload: AccountCreationPayload,
  updatePayload: PayloadUpdater<AccountCreationPayload>,
) => {
  const rulesSets = payload.rulesSets.filter(isValidRulesSet);
  updatePayload({ ...payload, rulesSets });
};

const steps = [
  {
    id: "chooseCurrencyOrToken",
    name: <Trans i18nKey="accountCreation:steps.chooseCurrencyOrToken.title" />,
    Step: AccountCreationCurrency,
  },
  {
    id: "name",
    name: <Trans i18nKey="accountCreation:steps.name.title" />,
    Step: AccountCreationName,
    requirements: (payload: AccountCreationPayload) => {
      if (!payload.currency && !payload.erc20token) return false;
      if (payload.currency && isNotSupportedCoin(payload.currency))
        return false;
      return true;
    },
  },
  {
    id: "rules",
    name: <Trans i18nKey="accountCreation:steps.rules.title" />,
    Step: AccountCreationRules,
    WarningNext: ({ payload }: { payload: AccountCreationPayload }) => {
      if (payload.rulesSets.length > 1 && hasEmptyRules(payload.rulesSets)) {
        return (
          <InfoBox type="warning">
            <Trans i18nKey="accountCreation:multirules.delete_empty_rule" />
          </InfoBox>
        );
      }
      return null;
    },
    requirements: (payload: AccountCreationPayload, additionalProps) => {
      if (
        additionalProps &&
        !additionalProps.isEditMode &&
        additionalProps.allAccounts.edges
          .map(e => e.node.name)
          .indexOf(payload.name) > -1
      )
        return false;
      if (payload.name === "") return false;
      if (payload.erc20token) {
        const { parentAccount } = payload;
        if (!parentAccount) return false;
        if (parentAccount.id) return true;
        return (
          !!parentAccount.name &&
          parentAccount.name !== "" &&
          parentAccount.name !== payload.name
        );
      }
      return true;
    },
    onNext: cleanRules,
  },
  {
    id: "confirmation",
    name: <Trans i18nKey="accountCreation:steps.confirmation.title" />,
    Step: AccountCreationConfirmation,
    requirements: (payload: AccountCreationPayload) => {
      return areRulesSetsValid(payload.rulesSets);
    },
    Cta: ({
      payload,
      onClose,
      isEditMode,
      restlay,
      onSuccess,
    }: {
      payload: AccountCreationPayload,
      onClose: () => void,
      isEditMode?: boolean,
      restlay: RestlayEnvironment,
      onSuccess: () => void,
    }) => {
      const data = serializePayload(payload, isEditMode);
      const isMigrated = payload.accountStatus === "MIGRATED";
      return (
        <ApproveRequestButton
          interactions={createAndApprove("ACCOUNT")}
          onError={handleCancelOnDevice(restlay, onClose)}
          onSuccess={async () => {
            try {
              if (isEditMode && payload.id) {
                await restlay.fetchQuery(
                  new AccountQuery({ accountId: `${payload.id}` }),
                );
              }
            } finally {
              onSuccess();
            }
          }}
          disabled={false}
          additionalFields={{
            type: isMigrated
              ? "MIGRATE_ACCOUNT"
              : isEditMode
              ? "EDIT_ACCOUNT"
              : "CREATE_ACCOUNT",
            data,
          }}
          buttonLabel={
            <Trans
              i18nKey={`accountCreation:${isEditMode ? "cta_edit" : "cta"}`}
            />
          }
        />
      );
    },
  },
  {
    id: "finish",
    name: <Trans i18nKey="accountCreation:finish" />,
    hideBack: true,
    Step: ({
      payload,
      isEditMode,
    }: {
      payload: AccountCreationPayload,
      isEditMode: boolean,
    }) => {
      const { t } = useTranslation();
      return (
        <MultiStepsSuccess
          title={
            <Box horizontal align="center" justify="center" flow={5}>
              {payload.currency && (
                <CryptoCurrencyIcon
                  currency={payload.currency}
                  color={payload.currency.color}
                  size={18}
                />
              )}
              {isEditMode ? (
                <Text i18nKey="accountCreation:finishEditTitle" />
              ) : (
                <Text i18nKey="accountCreation:finishTitle" />
              )}
            </Box>
          }
          desc={t(
            isEditMode
              ? "accountCreation:finishEditDesc"
              : "accountCreation:finishDesc",
          )}
        />
      );
    },
    Cta: ({ onClose }: { onClose: () => void }) => {
      const { t } = useTranslation();
      return (
        <Box my={10}>
          <Button type="filled" onClick={onClose}>
            {t("common:done")}
          </Button>
        </Box>
      );
    },
  },
];

const title = <Trans i18nKey="accountCreation:title" />;

const GATE_ACCOUNT_TYPES_BY_CURRENCY_FAMILY = {
  bitcoin: "Bitcoin",
  ethereum: "Ethereum",
  ripple: "Ripple",
};

function getGateAccountType(payload: AccountCreationPayload) {
  const { currency, erc20token } = payload;

  if (erc20token) {
    return "Erc20";
  }

  if (!currency) {
    throw new Error("Cannot gate account type without currency");
  }

  const accountType = GATE_ACCOUNT_TYPES_BY_CURRENCY_FAMILY[currency.family];

  if (!accountType) {
    throw new Error(`Cannot get account type for family: ${currency.family}`);
  }

  return accountType;
}

// TODO see if we can get rid of some api call like potentialAccounts
const AccountEdit = connectData(
  props => {
    const { t } = useTranslation();
    return (
      <GrowingCard>
        <MultiStepsFlow
          Icon={FaMoneyCheck}
          title={
            <Text>
              {t("accountCreation:edit_title")}: {props.account.name}
            </Text>
          }
          steps={steps}
          additionalProps={{ ...props, isEditMode: true }}
          onClose={props.close}
          isEditMode
          initialPayload={mergeEditData(
            props.account,
            props.requestToReplay,
            props.users.edges.map(e => e.node),
            props.groups.edges.map(e => e.node),
          )}
          payloadToCompareTo={props.account}
          initialCursor={1}
        />
      </GrowingCard>
    );
  },
  {
    RenderLoading: GrowingSpinner,
    RenderError: TryAgain,
    queries: {
      allAccounts: PotentialParentAccountsQuery,
      account: AccountQuery,
      users: OperatorsForAccountCreationQuery,
      whitelists: SearchWhitelistsForAccountQuery,
      groups: GroupsForAccountCreationQuery,
    },
    propsToQueryParams: props => ({
      accountId: props.accountId,
    }),
  },
);

const AccountCreation = connectData(
  props => (
    <GrowingCard>
      <MultiStepsFlow
        Icon={FaMoneyCheck}
        title={title}
        initialPayload={
          (props.requestToReplay &&
            deserialize(props.requestToReplay.entity)) ||
          initialPayload
        }
        steps={steps}
        additionalProps={props}
        payloadToCompareTo={initialPayload}
        onClose={props.close}
        initialCursor={props.request ? 3 : 0}
      />
    </GrowingCard>
  ),
  {
    RenderLoading: GrowingSpinner,
    RenderError: TryAgain,
    queries: {
      allAccounts: PotentialParentAccountsQuery,
      users: OperatorsForAccountCreationQuery,
      groups: GroupsForAccountCreationQuery,
      whitelists: SearchWhitelistsForAccountQuery,
    },
  },
);

const Wrapper = ({
  match,
  close,
  requestToReplay,
  resetRequest,
}: {
  match: Match,
  close: Function,
  requestToReplay: EditAccountReplay | CreateAccountReplay,
  resetRequest: void => void,
}) => {
  const closeAndEmptyStore = () => {
    resetRequest();
    close();
  };
  if (match.params.accountId) {
    return (
      <AccountEdit
        accountId={match.params.accountId}
        close={closeAndEmptyStore}
        requestToReplay={requestToReplay}
      />
    );
  }
  return (
    <AccountCreation
      close={closeAndEmptyStore}
      requestToReplay={requestToReplay}
    />
  );
};

const mapStateToProps = state => ({
  requestToReplay: state.requestReplay,
});
const mapDispatch = {
  resetRequest,
};

export default connect(mapStateToProps, mapDispatch)(Wrapper);

export const deserialize: Account => AccountCreationPayload = account => {
  return {
    id: account.id,
    accountStatus: account.status,
    name: account.name,
    rulesSets: account.governance_rules || emptyRulesSets,
    currency:
      account.account_type === "Bitcoin" ||
      account.account_type === "Ethereum" ||
      account.account_type === "Ripple"
        ? getCryptoCurrencyById(account.currency)
        : null,
    parentAccount: account.parent ? { id: account.parent } : null,
    erc20token:
      account.account_type === "Erc20"
        ? getERC20TokenByContractAddress(account.contract_address) || null
        : null,
    derivationMode: account.derivation_mode,
  };
};

function mergeEditData(
  account: Account,
  requestToReplay: EditAccountReplay,
  users: User[],
  groups: Group[],
) {
  const acc = deserialize(account);
  if (
    requestToReplay &&
    requestToReplay.edit_data &&
    requestToReplay.edit_data.name
  ) {
    Object.assign(acc, { name: requestToReplay.edit_data.name });
  }
  if (
    requestToReplay &&
    requestToReplay.edit_data &&
    requestToReplay.edit_data.governance_rules
  ) {
    Object.assign(acc, {
      rulesSets: convertEditDataIntoRules(
        requestToReplay.edit_data.governance_rules,
        users,
        groups,
      ),
    });
  }
  return acc;
}

export function serializePayload(
  payload: AccountCreationPayload,
  isEditMode: ?boolean,
) {
  const data: Object = {
    name: payload.name,
    governance_rules: serializeRulesSetsForPOST(payload.rulesSets),
  };

  if (payload.currency) {
    Object.assign(data, { currency: { name: payload.currency.id } });
  }

  // if "standard", it will be empty string, so we don't send it and gate will default
  if (payload.derivationMode) {
    Object.assign(data, { derivation_mode: payload.derivationMode });
  }

  if (payload.erc20token) {
    const { erc20token: token } = payload;
    const currencyName = getCurrencyIdFromBlockchainName(token.blockchain_name);
    const erc20 = {
      ticker: token.ticker,
      address: token.contract_address,
      decimals: token.decimals,
      hsm_signature: token.hsm_signature,
      hsm_account_parameters: token.hsm_account_parameters,
    };
    Object.assign(data, {
      currency: { name: currencyName },
      erc20,
      parent_account: payload.parentAccount,
    });
  }

  if (isEditMode && payload.accountStatus !== "MIGRATED") {
    return {
      account_id: payload.id,
      edit_data: data,
    };
  }

  const finalPayload: Object = {
    account_type: getGateAccountType(payload),
    account_data: data,
  };

  if (payload.accountStatus === "MIGRATED") {
    finalPayload.account_id = payload.id;
  }

  return finalPayload;
}

export function areRulesSetsValid(rulesSets: RulesSet[]) {
  // we consider rules sets valids if at least one is valid
  return rulesSets.find(isValidRulesSet) !== undefined;
}

export function hasEmptyRules(rulesSets: RulesSet[]) {
  return rulesSets.some(r => isEmptyRulesSet(r));
}
