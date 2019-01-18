// @flow

import React, { PureComponent } from "react";
import { connect } from "react-redux";
import type { MemoryHistory } from "history";

import type { Member, Account } from "data/types";

import type { RestlayEnvironment } from "restlay/connectData";
import connectData from "restlay/connectData";

import PendingAccountsQuery from "api/queries/PendingAccountsQuery";
import NewAccountMutation from "api/mutations/NewAccountMutation";
import PotentialParentAccountsQuery from "api/queries/PotentialParentAccountsQuery";

import DeviceAuthenticate from "components/DeviceAuthenticate";
import ModalLoading from "components/ModalLoading";

import type {
  State as AccountCreationState,
  UpdateState as UpdateAccountCreationState,
  Ratelimiter,
  Timelock
} from "redux/modules/account-creation";
import {
  updateAccountCreationState,
  changeTab,
  changeAccountName,
  switchInternalModal,
  addMember,
  setApprovals,
  setTimelock,
  setRatelimiter,
  clearState
} from "redux/modules/account-creation";
import AccountCreationRateLimiter from "./AccountCreationRateLimiter";
import AccountCreationApprovals from "./AccountCreationApprovals";
import AccountCreationTimeLock from "./AccountCreationTimeLock";
import AccountCreationMembers from "./AccountCreationMembers";
import MainCreation from "./MainCreation";

type Props = {
  restlay: RestlayEnvironment,
  history: MemoryHistory,
  allAccounts: Account[],
  onChangeAccountName: string => void,
  onChangeTabAccount: number => void,
  onSwitchInternalModal: string => void,
  onAddMember: Member => void,
  onSetApprovals: number => void,
  onSetTimelock: Timelock => void,
  onSetRatelimiter: Ratelimiter => void,
  onClearState: () => void,
  accountCreationState: AccountCreationState,
  updateAccountCreationState: UpdateAccountCreationState
};

// TODO this HIGHLY need some cleaning:
// - duplicate values
// - passing an AccountCreationState + some keys of AccountCreationState
//   is pointless. we should either pass the whole state OR only some keys.
// - inconsistent naming
export type StepProps = {
  approvers: Member[],
  members: Member[],
  switchInternalModal: string => void,
  addMember: Member => void,
  setApprovals: number => void,
  approvals: number,
  timelock: Timelock,
  setTimelock: Timelock => void,
  rate_limiter: Ratelimiter,
  setRatelimiter: Ratelimiter => void,
  account: AccountCreationState,
  changeAccountName: string => void,
  tabsIndex: number,
  onSelect: number => void,
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
  onAddMember: addMember,
  onSetApprovals: setApprovals,
  onSetTimelock: setTimelock,
  onSetRatelimiter: setRatelimiter,
  onChangeTabAccount: changeTab,
  onChangeAccountName: changeAccountName,
  onSwitchInternalModal: switchInternalModal,
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

    if (accountCreationState.time_lock.enabled) {
      Object.assign(securityScheme, {
        time_lock:
          accountCreationState.time_lock.value *
          accountCreationState.time_lock.frequency
      });
    }

    if (accountCreationState.rate_limiter.enabled) {
      Object.assign(securityScheme, {
        rate_limiter: {
          max_transaction: accountCreationState.rate_limiter.value,
          time_slot: accountCreationState.rate_limiter.frequency
        }
      });
    }

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
      Object.assign(data, {
        currency: {
          name:
            accountCreationState.erc20token.network_id === 3
              ? "ethereum_ropsten"
              : "ethereum"
        },
        erc20: {
          ticker: accountCreationState.erc20token.ticker,
          address: accountCreationState.erc20token.contract_address,
          decimals: accountCreationState.erc20token.decimals,
          signature: accountCreationState.erc20token.signature || ""
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
      cancel={() => this.props.onSwitchInternalModal("main")}
      callback={this.createAccount}
      type="accounts"
      gateAccountType={this.getGateAccountType()}
    />
  );

  stepsByModalId = {
    members: AccountCreationMembers,
    approvals: AccountCreationApprovals,
    "time-lock": AccountCreationTimeLock,
    "rate-limiter": AccountCreationRateLimiter,
    main: MainCreation,
    device: this.DeviceAuthenticate
  };

  render() {
    const {
      accountCreationState,
      updateAccountCreationState,
      allAccounts,

      onChangeAccountName,
      onChangeTabAccount,
      onSwitchInternalModal,
      onAddMember,
      onSetApprovals,
      onSetTimelock,
      onSetRatelimiter
    } = this.props;

    const Step = this.stepsByModalId[accountCreationState.internModalId];

    if (!Step) return null;

    const stepProps: StepProps = {
      close: this.close,
      cancel: () => onSwitchInternalModal("main"),

      // get / set the redux state
      accountCreationState,
      updateAccountCreationState,

      // give all accounts (all statuses) to child, to be able to determine
      // potential parent accounts AND validate if they don't already have
      // same erc20 token as children
      allAccounts,

      // TODO why different names for same thing?
      approvers: accountCreationState.approvers,
      members: accountCreationState.approvers,

      // TODO legacy stuff
      tabsIndex: accountCreationState.currentTab,
      switchInternalModal: onSwitchInternalModal,
      addMember: onAddMember,
      setApprovals: onSetApprovals,
      approvals: accountCreationState.quorum,
      timelock: accountCreationState.time_lock,
      setTimelock: onSetTimelock,
      rate_limiter: accountCreationState.rate_limiter,
      setRatelimiter: onSetRatelimiter,
      account: accountCreationState,
      changeAccountName: onChangeAccountName,
      onSelect: onChangeTabAccount
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
