//@flow

import React, { PureComponent } from "react";
import { connect } from "react-redux";
import type { MemoryHistory } from "history";

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

type Props = {
  restlay: RestlayEnvironment,
  history: MemoryHistory,
  onChangeAccountName: string => void,
  onChangeTabAccount: number => void,
  onSwitchInternalModal: string => void,
  onAddMember: Member => void,
  onSetApprovals: number => void,
  onSetTimelock: Timelock => void,
  onSetRatelimiter: Ratelimiter => void,
  onClearState: () => void,
  accountCreationState: AccountCreationState,
  updateAccountCreationState: AccountCreationState => $Shape<
    AccountCreationState
  >
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
    const { restlay } = this.props;
    const account = this.props.accountCreationState;

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

  DeviceAuthenticate = () => (
    <DeviceAuthenticate
      cancel={() => this.props.onSwitchInternalModal("main")}
      callback={this.createAccount}
      type="accounts"
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

      // TODO yep, we already have `account` prop for that. but it's confusing.
      // it's not storing an account but an account creation state. let's keep
      // the old one for migrating smoothly
      //
      // basically, we only need those two. get and set.
      accountCreationState,
      updateAccountCreationState,

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
  )(AccountCreation)
);
