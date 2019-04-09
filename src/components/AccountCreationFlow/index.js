// @flow

import React from "react";
import { Trans } from "react-i18next";
import { FaMoneyCheck } from "react-icons/fa";

import connectData from "restlay/connectData";
import TryAgain from "components/TryAgain";
import { createAndApproveAccount } from "device/interactions/approveFlow";
import ModalLoading from "components/ModalLoading";
import NewAccountMutation from "api/mutations/NewAccountMutation";
import PotentialParentAccountsQuery from "api/queries/PotentialParentAccountsQuery";
import UsersQuery from "api/queries/UsersQuery";
import GroupsQuery from "api/queries/GroupsQuery";
import MultiStepsFlow from "components/base/MultiStepsFlow";
import ApproveRequestButton from "components/ApproveRequestButton";
import {
  isNotSupportedCoin,
  getCurrencyIdFromBlockchainName,
} from "utils/cryptoCurrencies";

import AccountCreationCurrency from "./steps/AccountCreationCurrency";
import AccountCreationName from "./steps/AccountCreationName";
import AccountCreationRules from "./steps/AccountCreationRules";
import AccountCreationConfirmation from "./steps/AccountCreationConfirmation";

import type { AccountCreationPayload } from "./types";

const initialPayload: AccountCreationPayload = {
  name: "",
  rules: [{ quorum: 1, group: null, users: [] }],
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
      const { rules } = payload;
      if (!rules.length) return false;
      return rules.every(rule => rule.group !== null || rule.users.length > 0);
    },
    Cta: ({
      payload,
      onClose,
    }: {
      payload: AccountCreationPayload,
      onClose: Function,
    }) => {
      const data = serializePayload(payload);
      return (
        <ApproveRequestButton
          interactions={createAndApproveAccount}
          onSuccess={data => {
            console.log(data); // eslint-disable-line no-console
            onClose();
          }}
          disabled={false}
          onError={null}
          additionalFields={{ type: "CREATE_ACCOUNT", data }}
          buttonLabel={<Trans i18nKey="accountCreation:cta" />}
        />
      );
    },
  },
];

const title = <Trans i18nKey="accountCreation:title" />;

const styles = {
  container: { minHeight: 670 },
};

const RenderLoading = () => <ModalLoading height={670} width={700} />;

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

export default connectData(
  props => (
    <MultiStepsFlow
      Icon={FaMoneyCheck}
      title={title}
      initialPayload={initialPayload}
      steps={steps}
      mutation={NewAccountMutation}
      additionalProps={props}
      style={styles.container}
      onClose={props.close}
    />
  ),
  {
    RenderLoading,
    RenderError: TryAgain,
    queries: {
      allAccounts: PotentialParentAccountsQuery,
      users: UsersQuery,
      groups: GroupsQuery,
    },
    propsToQueryParams: () => ({
      // FIXME FIXME FIXME this is a hack to actually be able to create
      // an account, because 1rst approval group require to have admin on it
      role: ["ADMIN", "OPERATOR"],
    }),
  },
);

function serializePayload(payload: AccountCreationPayload) {
  const data: Object = {
    name: payload.name,
    tx_approval_rules: payload.rules,
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

  return {
    account_type: getGateAccountType(payload),
    account_data: data,
  };
}
