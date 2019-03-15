// @flow

import React from "react";
import { Trans } from "react-i18next";
import { FaMoneyCheck } from "react-icons/fa";

import connectData from "restlay/connectData";
import { createAndApprove } from "device/interactions/approveFlow";
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
import type { ERC20Token } from "data/types";

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
    Cta: ({ payload }: { payload: AccountCreationPayload }) => {
      const data = serializePayload(payload);
      return (
        <ApproveRequestButton
          interactions={createAndApprove}
          onSuccess={data => {
            console.log(data); // eslint-disable-line no-console
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
    queries: {
      allAccounts: PotentialParentAccountsQuery,
      users: UsersQuery,
      groups: GroupsQuery,
    },
    initialVariables: {
      users: 30,
    },
  },
);

function serializePayload(payload: AccountCreationPayload) {
  const data: Object = {
    name: payload.name,
    rules: payload.rules,
  };
  if (payload.currency) {
    Object.assign(data, {
      currency: {
        name: payload.currency.id,
      },
    });
    // HACK because ll-common "ethereum_testnet" should be "ethereum_ropsten"
    if (data.currency.name === "ethereum_testnet") {
      data.currency.name = "ethereum_ropsten";
    }
  }
  if (payload.erc20token) {
    const token: ERC20Token = payload.erc20token;
    Object.assign(data, {
      currency: {
        name: getCurrencyIdFromBlockchainName(token.blockchain_name),
      },
      erc20: {
        ticker: token.ticker,
        address: token.contract_address,
        decimals: token.decimals,
        signature: token.signature || "",
      },
      parent_account: payload.parentAccount,
    });
  }
  return data;
}
