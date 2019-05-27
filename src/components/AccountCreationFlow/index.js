// @flow

import React from "react";
import { Trans } from "react-i18next";
import { FaMoneyCheck } from "react-icons/fa";

import connectData from "restlay/connectData";
import type { Match } from "react-router-dom";
import TryAgain from "components/TryAgain";
import { createAndApprove } from "device/interactions/hsmFlows";
import GrowingCard, { GrowingSpinner } from "components/base/GrowingCard";
import PotentialParentAccountsQuery from "api/queries/PotentialParentAccountsQuery";
import AccountQuery from "api/queries/AccountQuery";
import UsersQuery from "api/queries/UsersQuery";
import GroupsQuery from "api/queries/GroupsQuery";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import MultiStepsFlow from "components/base/MultiStepsFlow";
import Text from "components/base/Text";
import ApproveRequestButton from "components/ApproveRequestButton";
import {
  isNotSupportedCoin,
  getCurrencyIdFromBlockchainName,
  getERC20TokenByContractAddress,
} from "utils/cryptoCurrencies";
import { deserializeApprovalSteps } from "utils/accounts";
import type { ApprovalsRule } from "components/ApprovalsRules";

import type { Account } from "data/types";
import AccountCreationCurrency from "./steps/AccountCreationCurrency";
import AccountCreationName from "./steps/AccountCreationName";
import AccountCreationRules from "./steps/AccountCreationRules";
import AccountCreationConfirmation from "./steps/AccountCreationConfirmation";

import type { AccountCreationPayload } from "./types";

const initialPayload: AccountCreationPayload = {
  name: "",
  accountStatus: "",
  rules: [{ quorum: 1, group_id: null, users: [] }],
  currency: null,
  erc20token: null,
  parentAccount: null,
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
    requirements: (payload: AccountCreationPayload) => {
      if (payload.name === "") return false;
      if (payload.erc20token) {
        const { parentAccount } = payload;
        if (!parentAccount) return false;
        if (parentAccount.id) return true;
        return !!parentAccount.name && parentAccount.name !== "";
      }
      return true;
    },
  },
  {
    id: "confirmation",
    name: <Trans i18nKey="accountCreation:steps.confirmation.title" />,
    Step: AccountCreationConfirmation,
    requirements: (payload: AccountCreationPayload) => {
      return areApprovalsRulesValid(payload.rules);
    },
    Cta: ({
      payload,
      onClose,
      isEditMode,
    }: {
      payload: AccountCreationPayload,
      onClose: () => void,
      isEditMode?: boolean,
    }) => {
      const data = serializePayload(payload, isEditMode);
      const isMigrated = payload.accountStatus === "MIGRATED";
      return (
        <ApproveRequestButton
          interactions={createAndApprove}
          onSuccess={data => {
            console.log(data); // eslint-disable-line no-console
            onClose();
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
    return "ERC20";
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
  props => (
    <GrowingCard>
      <MultiStepsFlow
        Icon={FaMoneyCheck}
        title={
          <Text>
            <Trans i18nKey="accountCreation:edit_title" />: {props.account.name}
          </Text>
        }
        steps={steps}
        additionalProps={props}
        onClose={props.close}
        isEditMode
        initialPayload={deserialize(props.account)}
        initialCursor={props.account.status === "VIEW_ONLY" ? 1 : 2}
      />
    </GrowingCard>
  ),
  {
    RenderLoading: GrowingSpinner,
    RenderError: TryAgain,
    queries: {
      allAccounts: PotentialParentAccountsQuery,
      account: AccountQuery,
      users: UsersQuery,
      groups: GroupsQuery,
    },
    propsToQueryParams: props => ({
      role: ["OPERATOR"],
      accountId: props.accountId || "",
    }),
  },
);

const AccountCreation = connectData(
  props => (
    <GrowingCard>
      <MultiStepsFlow
        Icon={FaMoneyCheck}
        title={title}
        initialPayload={initialPayload}
        steps={steps}
        additionalProps={props}
        onClose={props.close}
      />
    </GrowingCard>
  ),
  {
    RenderLoading: GrowingSpinner,
    RenderError: TryAgain,
    queries: {
      allAccounts: PotentialParentAccountsQuery,
      users: UsersQuery,
      groups: GroupsQuery,
    },
    propsToQueryParams: () => ({
      role: ["OPERATOR"],
    }),
  },
);

const Wrapper = ({ match, close }: { match: Match, close: Function }) => {
  if (match.params.accountId) {
    return <AccountEdit accountId={match.params.accountId} close={close} />;
  }
  return <AccountCreation close={close} />;
};

export default Wrapper;

export const deserialize: Account => AccountCreationPayload = account => {
  const { tx_approval_steps } = account;

  const rules =
    !tx_approval_steps || tx_approval_steps.length === 0
      ? initialPayload.rules
      : deserializeApprovalSteps(tx_approval_steps);

  return {
    id: account.id,
    accountStatus: account.status,
    name: account.name,
    rules,
    currency:
      account.account_type === "Bitcoin" || account.account_type === "Ethereum"
        ? getCryptoCurrencyById(account.currency)
        : null,
    parentAccount: account.parent ? { id: account.parent } : null,
    erc20token:
      account.account_type === "ERC20"
        ? getERC20TokenByContractAddress(account.contract_address) || null
        : null,
  };
};

export function serializePayload(
  payload: AccountCreationPayload,
  isEditMode: ?boolean,
) {
  const data: Object = {
    name: payload.name,
    governance_rules: {
      tx_approval_steps: payload.rules,
    },
  };

  if (payload.currency) {
    Object.assign(data, { currency: { name: payload.currency.id } });
  }

  if (payload.erc20token) {
    const { erc20token: token } = payload;
    const currencyName = getCurrencyIdFromBlockchainName(token.blockchain_name);
    const erc20 = {
      ticker: token.ticker,
      address: token.contract_address,
      decimals: token.decimals,
      signature: token.signature || "",
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

export function areApprovalsRulesValid(rules: ApprovalsRule[]) {
  if (!rules.length) return false;
  return rules.every(rule => rule.group_id !== null || rule.users.length > 0);
}
