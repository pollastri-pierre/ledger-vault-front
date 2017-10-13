import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal } from '../components';

import {
  getOperation,
  getOperationFake,
  close,
} from '../redux/modules/operations';

import {
  closeModalAccount,
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
  saveAccount,
  OPEN_MODAL_ACCOUNT,
} from '../redux/modules/account-creation';

import {
  OPEN_ACCOUNT_APPROVE,
  closeAccountApprove,
  getAccountToApprove,
  aborting,
  approving,
  abort,
} from '../redux/modules/account-approve';

import {
  getOrganizationMembers,
} from '../redux/modules/organization';

import { getCurrencies } from '../redux/modules/all-currencies';
import { BlurDialog } from '../containers';
import { OperationDetails, AccountCreation, AccountApprove } from '../components';
// import _ from 'lodash';

const mapStateToProps = state => ({
  modals: state.modals,
  operations: state.operations,
  organization: state.organization,
  accountCreation: state.accountCreation,
  allCurrencies: state.allCurrencies,
  accountToApprove: state.accountApprove,
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(close()),
  onCloseAccount: (from) => dispatch(closeModalAccount(from)),
  onGetOperation: id => dispatch(getOperationFake(id)),
  onChangeTabAccount: index => dispatch(changeTab(index)),
  onGetCurrencies: () => dispatch(getCurrencies()),
  onSelectCurrency: c => dispatch(selectCurrency(c)),
  onChangeAccountName: n => dispatch(changeAccountName(n)),
  onSwitchInternalModal: n => dispatch(switchInternalModal(n)),
  onGetOrganizationMembers: () => dispatch(getOrganizationMembers()),
  onAddMember: m => dispatch(addMember(m)),
  onSetApprovals: n => dispatch(setApprovals(n)),
  onEnableTimeLock: () => dispatch(enableTimeLock()),
  onChangeTimeLock: v => dispatch(changeTimeLock(v)),
  onEnableRatelimiter: () => dispatch(enableRatelimiter()),
  onChangeRatelimiter: v => dispatch(changeRatelimiter(v)),
  onOpenPopBubble: anchor => dispatch(openPopBubble(anchor)),
  onChangeFrequency: (field, freq) => dispatch(changeFrequency(field, freq)),
  onSaveAccount: () => dispatch(saveAccount()),
  onCloseAccountApprouve: () => dispatch(closeAccountApprove()),
  onGetAccountToApprove: () => dispatch(getAccountToApprove()),
  onAbortingAccount: () => dispatch(aborting()),
  onAbortAccount: () => dispatch(abort()),
  onApprovingAccount: () => dispatch(approving()),
});

function ModalsContainer(props) {
  const { onChangeTabAccount,
    accountToApprove,
    organization,
    operations,
    allCurrencies,
    onClose,
    accountCreation,
    onGetCurrencies,
    onSelectCurrency,
    onChangeAccountName,
    onSwitchInternalModal,
    onGetOrganizationMembers,
    onCloseAccount,
    onAddMember,
    onSetApprovals,
    onEnableTimeLock,
    onChangeTimeLock,
    onEnableRatelimiter,
    onChangeRatelimiter,
    onOpenPopBubble,
    onChangeFrequency,
    onSaveAccount,
    onAbortingAccount,
    onAbortAccount,
    onCloseAccountApprouve,
    onGetAccountToApprove,
    onApprovingAccount,
  } = props;

  return (
    <div>
      { props.modals === OPEN_MODAL_ACCOUNT &&
          <Modal close={onCloseAccount}>
            <AccountCreation
              organization={organization}
              tabsIndex={accountCreation.currentTab}
              onSelect={onChangeTabAccount}
              setApprovals={onSetApprovals}
              getCurrencies={onGetCurrencies}
              getOrganizationMembers={onGetOrganizationMembers}
              selectCurrency={onSelectCurrency}
              addMember={onAddMember}
              enableTimeLock={onEnableTimeLock}
              changeTimeLock={onChangeTimeLock}
              enableRatelimiter={onEnableRatelimiter}
              changeRatelimiter={onChangeRatelimiter}
              changeFrequency={onChangeFrequency}
              openPopBubble={onOpenPopBubble}
              changeAccountName={onChangeAccountName}
              currencies={allCurrencies}
              account={accountCreation}
              save={onSaveAccount}
              close={onCloseAccount}
              switchInternalModal={onSwitchInternalModal}
            />
          </Modal>
      }
      { accountToApprove.modalOpened &&
          <Modal close={onCloseAccountApprouve}>
            <AccountApprove
              account={accountToApprove}
              getAccount={onGetAccountToApprove}
              account={accountToApprove}
              aborting={onAbortingAccount}
              approving={onApprovingAccount}
              abort={onAbortAccount}
              close={onCloseAccountApprouve}
            />
          </Modal>
      }
      { operations.operationInModal !== null && !_.isUndefined(operations.operationInModal) &&
          <Modal close={props.onClose}>
            <OperationDetails
              operations={operations}
              getOperation={props.onGetOperation}
              close={props.onClose}
              tabsIndex={operations.tabsIndex}
            />
          </Modal>
      }
    </div>
  );
}

ModalsContainer.propTypes = {
  onChangeTabAccount: PropTypes.func.isRequired,
  onGetCurrencies: PropTypes.func.isRequired,
  onChangeAccountName: PropTypes.func.isRequired,
  onSwitchInternalModal: PropTypes.func.isRequired,
  onGetOrganizationMembers: PropTypes.func.isRequired,
  onAddMember: PropTypes.func.isRequired,
  onSetApprovals: PropTypes.func.isRequired,
  onEnableTimeLock: PropTypes.func.isRequired,
  onChangeTimeLock: PropTypes.func.isRequired,
  onEnableRatelimiter: PropTypes.func.isRequired,
  onChangeRatelimiter: PropTypes.func.isRequired,
  onOpenPopBubble: PropTypes.func.isRequired,
  onCloseAccount: PropTypes.func.isRequired,
  onSaveAccount: PropTypes.func.isRequired,
  onChangeFrequency: PropTypes.func.isRequired,
  onSelectCurrency: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onGetOperation: PropTypes.func.isRequired,
  operations: PropTypes.shape({}).isRequired,
};

ModalsContainer.contextTypes = {
  translate: PropTypes.func.isRequired,
};

export { ModalsContainer as NModalsContainer };

export default connect(mapStateToProps, mapDispatchToProps)(ModalsContainer);

