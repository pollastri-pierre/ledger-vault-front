//@flow
import { connect } from "react-redux";
import React, { Component } from "react";
import MainCreation from "./MainCreation";
import AccountCreationMembers from "./AccountCreationMembers";
import AccountCreationApprovals from "./AccountCreationApprovals";
import AccountCreationTimeLock from "./AccountCreationTimeLock";
import AccountCreationRateLimiter from "./AccountCreationRateLimiter";

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
  componentWillMount() {
    this.props.onClearState();
  }

  close = () => {
    this.props.history.goBack();
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  accountCreation: state.accountCreation
});

const mapDispatchToProps = dispatch => ({
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

export default connect(mapStateToProps, mapDispatchToProps)(AccountCreation);
