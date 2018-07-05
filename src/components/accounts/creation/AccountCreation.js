//@flow
import { connect } from "react-redux";
import connectData from "restlay/connectData";
import type { RestlayEnvironment } from "restlay/connectData";
import React, { Component } from "react";
import MainCreation from "./MainCreation";
import AccountCreationMembers from "./AccountCreationMembers";
import AccountCreationApprovals from "./AccountCreationApprovals";
import DeviceAuthenticate from "components/DeviceAuthenticate";
import AccountCreationTimeLock from "./AccountCreationTimeLock";
import AccountCreationRateLimiter from "./AccountCreationRateLimiter";
import NewAccountMutation from "api/mutations/NewAccountMutation";
import PendingAccountsQuery from "api/queries/PendingAccountsQuery";

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
  onChangeAccountName: Function,
  onSelectCurrency: Function,
  onChangeTabAccount: Function,
  onSwitchInternalModal: Function,
  restlay: RestlayEnvironment,
  onGet: Function,
  onChangeAccountName: Function,
  onAddMember: Function,
  onSetApprovals: Function,
  onSetTimelock: Function,
  onSetRatelimiter: Function,
  close: Function,
  onClearState: Function,
  accountCreation: *,
  history: *
};

class AccountCreation extends Component<Props> {
  componentDidMount() {
    this.props.onClearState();
  }

  close = () => {
    this.props.history.goBack();
  };

  createAccount = entity_id => {
    const { restlay } = this.props;
    const account = this.props.accountCreation;
    const approvers = account.approvers.map(pubKey => {
      return { pub_key: pubKey };
    });

    const securityScheme = Object.assign(
      {
        quorum: account.quorum
      },
      account.time_lock.enabled && {
        time_lock: account.time_lock.value * account.time_lock.frequency
      },
      account.rate_limiter.enabled && {
        rate_limiter: {
          max_transaction: account.rate_limiter.value,
          time_slot: account.rate_limiter.frequency
        }
      }
    );

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
    return (
      <div>
        {account.internModalId === "members" && (
          <div id="account-creation" className="modal">
            <AccountCreationMembers
              approvers={account.approvers}
              switchInternalModal={onSwitchInternalModal}
              addMember={onAddMember}
            />
          </div>
        )}
        {account.internModalId === "approvals" && (
          <div className="modal">
            <AccountCreationApprovals
              setApprovals={onSetApprovals}
              members={account.approvers}
              approvals={account.quorum}
              switchInternalModal={onSwitchInternalModal}
            />
          </div>
        )}
        {account.internModalId === "time-lock" && (
          <div className="modal">
            <AccountCreationTimeLock
              switchInternalModal={onSwitchInternalModal}
              timelock={account.time_lock}
              setTimelock={onSetTimelock}
            />
          </div>
        )}
        {account.internModalId === "rate-limiter" && (
          <div className="modal">
            <AccountCreationRateLimiter
              switchInternalModal={onSwitchInternalModal}
              rate_limiter={account.rate_limiter}
              setRatelimiter={onSetRatelimiter}
            />
          </div>
        )}

        {account.internModalId === "main" && (
          <div id="account-creation" className="modal">
            <MainCreation
              account={account}
              changeAccountName={onChangeAccountName}
              selectCurrency={onSelectCurrency}
              tabsIndex={account.currentTab}
              onSelect={onChangeTabAccount}
              close={this.close}
              switchInternalModal={onSwitchInternalModal}
            />
          </div>
        )}
        {account.internModalId === "device" && (
          <div id="account-creation" className="modal">
            <DeviceAuthenticate
              cancel={() => onSwitchInternalModal("main")}
              callback={this.createAccount}
              type="accounts"
              close={this.close}
            />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  accountCreation: state.accountCreation
});

const mapDispatchToProps = (dispatch: *) => ({
  onAddMember: m => dispatch(addMember(m)),
  onSetApprovals: n => dispatch(setApprovals(n)),
  onSetTimelock: timelock => dispatch(setTimelock(timelock)),
  onSetRatelimiter: ratelimiter => dispatch(setRatelimiter(ratelimiter)),
  onChangeTabAccount: index => dispatch(changeTab(index)),
  onSelectCurrency: c => dispatch(selectCurrency(c)),
  onChangeAccountName: n => dispatch(changeAccountName(n)),
  onSwitchInternalModal: n => dispatch(switchInternalModal(n)),
  onClearState: () => dispatch(clearState())
});

export default connectData(
  connect(mapStateToProps, mapDispatchToProps)(AccountCreation)
);
