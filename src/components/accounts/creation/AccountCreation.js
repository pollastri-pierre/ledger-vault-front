//@flow

import React, { PureComponent } from "react";
import { connect } from "react-redux";
import type { MemoryHistory } from "history";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";

import type { Member } from "data/types";

import type { RestlayEnvironment } from "restlay/connectData";
import connectData from "restlay/connectData";

import PendingAccountsQuery from "api/queries/PendingAccountsQuery";
import NewAccountMutation from "api/mutations/NewAccountMutation";

import DeviceAuthenticate from "components/DeviceAuthenticate";

import AccountCreationRateLimiter from "./AccountCreationRateLimiter";
import AccountCreationApprovals from "./AccountCreationApprovals";
import AccountCreationTimeLock from "./AccountCreationTimeLock";
import AccountCreationMembers from "./AccountCreationMembers";
import MainCreation from "./MainCreation";

import type {
  State as AccountCreationState,
  Ratelimiter,
  Timelock
} from "redux/modules/account-creation";

import {
  changeTab,
  selectCurrency,
  changeAccountName,
  switchInternalModal,
  addMember,
  setApprovals,
  setTimelock,
  setRatelimiter,
  clearState
} from "redux/modules/account-creation";

type Props = {
  restlay: RestlayEnvironment,
  history: MemoryHistory,
  onChangeAccountName: string => void,
  onSelectCurrency: CryptoCurrency => void,
  onChangeTabAccount: number => void,
  onSwitchInternalModal: string => void,
  onAddMember: Member => void,
  onSetApprovals: number => void,
  onSetTimelock: Timelock => void,
  onSetRatelimiter: Ratelimiter => void,
  onClearState: () => void,
  accountCreation: AccountCreationState
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
  selectCurrency: CryptoCurrency => void,
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
  accountCreation: state.accountCreation
});

const mapDispatchToProps = {
  onAddMember: addMember,
  onSetApprovals: setApprovals,
  onSetTimelock: setTimelock,
  onSetRatelimiter: setRatelimiter,
  onChangeTabAccount: changeTab,
  onSelectCurrency: selectCurrency,
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
    const { restlay } = this.props;
    const account = this.props.accountCreation;

    const approvers = account.approvers.map(pubKey => {
      return { pub_key: pubKey };
    });

    const securityScheme: Object = {
      quorum: account.quorum
    };

    if (account.time_lock.enabled) {
      Object.assign(securityScheme, {
        time_lock: account.time_lock.value * account.time_lock.frequency
      });
    }

    if (account.rate_limiter.enabled) {
      Object.assign(securityScheme, {
        rate_limiter: {
          max_transaction: account.rate_limiter.value,
          time_slot: account.rate_limiter.frequency
        }
      });
    }

    if (!account.currency) return;

    const data = {
      account_id: entity_id,
      name: account.name,
      currency: { name: account.currency.id },
      security_scheme: securityScheme,
      members: approvers
    };

    return restlay
      .commitMutation(new NewAccountMutation(data))
      .then(this.close)
      .then(() => restlay.fetchQuery(new PendingAccountsQuery()));
  };

  getGateAccountType() {
    const { accountCreation } = this.props;
    const { currency } = accountCreation;

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
      onChangeAccountName,
      onSelectCurrency,
      onChangeTabAccount,
      onSwitchInternalModal,
      onAddMember,
      onSetApprovals,
      onSetTimelock,
      onSetRatelimiter
    } = this.props;

    const account = this.props.accountCreation;
    const Step = this.stepsByModalId[account.internModalId];

    if (!Step) return null;

    const stepProps: StepProps = {
      close: this.close,
      cancel: () => onSwitchInternalModal("main"),

      // TODO why different names for same thing
      approvers: account.approvers,
      members: account.approvers,

      tabsIndex: account.currentTab,
      switchInternalModal: onSwitchInternalModal,
      addMember: onAddMember,
      setApprovals: onSetApprovals,
      approvals: account.quorum,
      timelock: account.time_lock,
      setTimelock: onSetTimelock,
      rate_limiter: account.rate_limiter,
      setRatelimiter: onSetRatelimiter,
      account: account,
      changeAccountName: onChangeAccountName,
      selectCurrency: onSelectCurrency,
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
  )(AccountCreation)
);
