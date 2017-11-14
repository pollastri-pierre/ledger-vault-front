//@flow
import { connect } from "react-redux";
import React, { Component } from "react";
import { withRouter } from "react-router";
import BlurDialog from "../../BlurDialog"; // FIXME use ModalRoute
import MainCreation from "./MainCreation";
import AccountCreationMembers from "./AccountCreationMembers";
import AccountCreationApprovals from "./AccountCreationApprovals";
import AccountCreationTimeLock from "./AccountCreationTimeLock";
import AccountCreationRateLimiter from "./AccountCreationRateLimiter";
import "./AccountCreation.css";

import {
  changeTab,
  selectCurrency,
  changeAccountName,
  switchInternalModal,
  addMember,
  setApprovals,
  enableTimeLock,
  enableRatelimiter,
  openPopBubble,
  changeTimeLock,
  changeRatelimiter,
  changeFrequency,
  clearState
} from "../../../redux/modules/account-creation";

type Props = {
  onChangeAccountName: Function,
  onSelectCurrency: Function,
  onChangeTabAccount: Function,
  onSwitchInternalModal: Function,
  onGet: Function,
  onChangeAccountName: Function,
  onAddMember: Function,
  onSetApprovals: Function,
  onEnableTimeLock: Function,
  onEnableRatelimiter: Function,
  onChangeTimeLock: Function,
  onChangeRatelimiter: Function,
  onOpenPopBubble: Function,
  onChangeFrequency: Function,
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
      onEnableTimeLock,
      onEnableRatelimiter,
      onOpenPopBubble,
      onChangeTimeLock,
      onChangeRatelimiter,
      onChangeFrequency
    } = this.props;

    const account = this.props.accountCreation;
    return (
      <div>
        <BlurDialog
          open={account.internModalId === "members"}
          nopadding
          onRequestClose={this.close}
        >
          <div id="account-creation" className="modal">
            <AccountCreationMembers
              approvers={account.approvers}
              switchInternalModal={onSwitchInternalModal}
              addMember={onAddMember}
            />
          </div>
        </BlurDialog>
        <BlurDialog
          open={account.internModalId === "approvals"}
          nopadding
          onRequestClose={this.close}
        >
          <div className="modal">
            <AccountCreationApprovals
              setApprovals={onSetApprovals}
              members={account.approvers}
              approvals={account.quorum}
              switchInternalModal={onSwitchInternalModal}
            />
          </div>
        </BlurDialog>
        <BlurDialog
          open={account.internModalId === "time-lock"}
          nopadding
          onRequestClose={this.close}
        >
          <div className="modal">
            <AccountCreationTimeLock
              switchInternalModal={onSwitchInternalModal}
              timelock={account.time_lock}
              enable={onEnableTimeLock}
              change={onChangeTimeLock}
              popbubble={account.popBubble}
              anchor={account.popAnchor}
              openPopBubble={onOpenPopBubble}
              changeFrequency={onChangeFrequency}
            />
          </div>
        </BlurDialog>
        <BlurDialog
          open={account.internModalId === "rate-limiter"}
          nopadding
          onRequestClose={this.close}
        >
          <div className="modal">
            <AccountCreationRateLimiter
              switchInternalModal={onSwitchInternalModal}
              rate_limiter={account.rate_limiter}
              enable={onEnableRatelimiter}
              change={onChangeRatelimiter}
              popbubble={account.popBubble}
              anchor={account.popAnchor}
              openPopBubble={onOpenPopBubble}
              changeFrequency={onChangeFrequency}
            />
          </div>
        </BlurDialog>

        <BlurDialog
          open={account.internModalId === "main"}
          nopadding
          onRequestClose={this.close}
        >
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
        </BlurDialog>
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
  onEnableTimeLock: () => dispatch(enableTimeLock()),
  onChangeTimeLock: v => dispatch(changeTimeLock(v)),
  onEnableRatelimiter: () => dispatch(enableRatelimiter()),
  onChangeRatelimiter: v => dispatch(changeRatelimiter(v)),
  onOpenPopBubble: anchor => dispatch(openPopBubble(anchor)),
  onChangeFrequency: (field, freq) => dispatch(changeFrequency(field, freq)),
  onChangeTabAccount: index => dispatch(changeTab(index)),
  onSelectCurrency: c => dispatch(selectCurrency(c)),
  onChangeAccountName: n => dispatch(changeAccountName(n)),
  onSwitchInternalModal: n => dispatch(switchInternalModal(n)),
  onClearState: () => dispatch(clearState())
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AccountCreation)
);
