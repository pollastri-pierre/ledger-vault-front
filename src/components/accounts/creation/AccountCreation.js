// @flow

import React, { PureComponent } from "react";
import { connect } from "react-redux";
import type { MemoryHistory } from "history";

import type { Account, ERC20Token } from "data/types";

import type { RestlayEnvironment } from "restlay/connectData";
import connectData from "restlay/connectData";

import PendingAccountsQuery from "api/queries/PendingAccountsQuery";
import NewAccountMutation from "api/mutations/NewAccountMutation";
import PotentialParentAccountsQuery from "api/queries/PotentialParentAccountsQuery";

import DeviceAuthenticate from "components/DeviceAuthenticate";
import ModalLoading from "components/ModalLoading";
import { getCurrencyIdFromBlockchainName } from "utils/cryptoCurrencies";

import type {
  State as AccountCreationState,
  UpdateState as UpdateAccountCreationState,
  InternModalId
} from "redux/modules/account-creation";
import {
  updateAccountCreationState,
  clearState
} from "redux/modules/account-creation";
import AccountCreationApprovals from "./AccountCreationApprovals";
import AccountCreationMembers from "./AccountCreationMembers";
import MainCreation from "./MainCreation";

type Props = {
  restlay: RestlayEnvironment,
  history: MemoryHistory,
  allAccounts: Account[],
  onClearState: () => void,
  accountCreationState: AccountCreationState,
  updateAccountCreationState: UpdateAccountCreationState
};

export type StepProps = {
  switchInternalModal: InternModalId => void,
  accountCreationState: AccountCreationState,
  updateAccountCreationState: UpdateAccountCreationState,
  allAccounts: Account[],
  close: () => void,
  cancel: () => void
};

const GATE_ACCOUNT_TYPES_BY_CURRENCY_FAMILY = {
  bitcoin: "Bitcoin",
  ethereum: "Ethereum",
  ripple: "Ripple"
};

const mapStateToProps = state => ({
  accountCreationState: state.accountCreation
});

const mapDispatchToProps = {
  updateAccountCreationState,
  onClearState: clearState
};

class AccountCreation extends PureComponent<Props> {
  componentDidMount() {
    this.props.onClearState();
  }

  close = () => {
    this.props.history.goBack();
  };

  createAccount = (entity_id: number) => {
    const { restlay, accountCreationState } = this.props;

    const approvers = accountCreationState.approvers.map(pubKey => ({
      pub_key: pubKey
    }));

    const securityScheme: Object = {
      quorum: accountCreationState.quorum
    };

    if (!accountCreationState.currency && !accountCreationState.erc20token)
      return;

    const data: Object = {
      account_id: entity_id,
      name: accountCreationState.name,
      security_scheme: securityScheme,
      members: approvers
    };

    if (accountCreationState.currency) {
      Object.assign(data, {
        currency: { name: accountCreationState.currency.id }
      });

      // HACK because ll-common "ethereum_testnet" should be "ethereum_ropsten"
      if (data.currency.name === "ethereum_testnet") {
        data.currency.name = "ethereum_ropsten";
      }
    }

    if (accountCreationState.erc20token) {
      const token: ERC20Token = accountCreationState.erc20token; // weird flow behaviour without this line
      Object.assign(data, {
        currency: {
          name: getCurrencyIdFromBlockchainName(token.blockchain_name)
        },
        erc20: {
          ticker: token.ticker,
          address: token.contract_address,
          decimals: token.decimals,
          signature: token.signature || ""
        },
        parent_account: accountCreationState.parent_account
      });
    }

    return restlay
      .commitMutation(new NewAccountMutation(data))
      .then(this.close)
      .then(() => restlay.fetchQuery(new PendingAccountsQuery()));
  };

  getGateAccountType() {
    const { accountCreationState } = this.props;
    const { currency, erc20token } = accountCreationState;

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

  DeviceAuthenticate = () => (
    <DeviceAuthenticate
      cancel={() => this.switchInternalModal("main")}
      callback={this.createAccount}
      type="accounts"
      gateAccountType={this.getGateAccountType()}
    />
  );

  stepsByModalId = {
    members: AccountCreationMembers,
    approvals: AccountCreationApprovals,
    main: MainCreation,
    device: this.DeviceAuthenticate
  };

  switchInternalModal = (id: InternModalId) => {
    const { updateAccountCreationState } = this.props;
    updateAccountCreationState(() => ({ internModalId: id }));
  };

  changeTabAccount = (index: number) => {
    const { updateAccountCreationState } = this.props;
    updateAccountCreationState(() => ({ currentTab: index }));
  };

  render() {
    const {
      accountCreationState,
      updateAccountCreationState,
      allAccounts
    } = this.props;

    const Step = this.stepsByModalId[accountCreationState.internModalId];

    if (!Step) return null;

    const stepProps: StepProps = {
      // get / set the redux state
      accountCreationState,
      updateAccountCreationState,

      // give all accounts (all statuses) to child, to be able to determine
      // potential parent accounts AND validate if they don't already have
      // same erc20 token as children
      allAccounts,

      // UI stuff
      tabsIndex: accountCreationState.currentTab,
      switchInternalModal: this.switchInternalModal,
      close: this.close,
      cancel: () => this.switchInternalModal("main")
    };

    return <Step {...stepProps} />;
  }
}

export { AccountCreation };

export default connectData(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AccountCreation),
  {
    queries: {
      allAccounts: PotentialParentAccountsQuery
    },
    RenderLoading: ModalLoading
  }
);
