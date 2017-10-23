import React from 'react';
import { shallow } from 'enzyme';
import { NModalsContainer } from '../../containers/ModalsContainer';

const props = {
  organization: {},
  operations: {
    tabsIndex: 0,
  },
  accountToApprove: {
    modalOpened: false,
  },
  allCurrencies: {},
  accountCreation: {
    currentTab: 0,
    modalOpened: false,
  },
  onClose: jest.fn(),
  onGetOperation: jest.fn(),
  getOperation: jest.fn(),
  onGetCurrencies: jest.fn(),
  onSelectCurrency: jest.fn(),
  onChangeTabAccount: jest.fn(),
  onChangeAccountName: jest.fn(),
  onSwitchInternalModal: jest.fn(),
  onGetOrganizationMembers: jest.fn(),
  onCloseAccount: jest.fn(),
  onAddMember: jest.fn(),
  onSetApprovals: jest.fn(),
  onEnableTimeLock: jest.fn(),
  onChangeTimeLock: jest.fn(),
  onEnableRatelimiter: jest.fn(),
  onChangeRatelimiter: jest.fn(),
  onOpenPopBubble: jest.fn(),
  onChangeFrequency: jest.fn(),
  onSaveAccount: jest.fn(),
  onGetAccountToApprove: jest.fn(),
  onCloseAccountApprouve: jest.fn(),
  onGetOrganizationApprovers: jest.fn(),
  onAbortingAccount: jest.fn(),
  onApprovingAccount: jest.fn(),
};

const sProps = {
  ...props,
  operations: {
    ...props.operations,
    operationInModal: 1,
  },
};

describe('Modals container', () => {
  it('should render a OperationDetails component', () => {
    const wrapper = shallow(<NModalsContainer {...sProps} />, { context: { translate: jest.fn() } });
    expect(wrapper.find('OperationDetails').length).toBe(1);
  });

  it('should render a AccountCreation component', () => {
    const propsAccount = {
      ...props,
      accountCreation: {
        ...props.accountCreation,
        modalOpened: true,
      },
    };

    const wrapper = shallow(<NModalsContainer {...propsAccount} />, { context: { translate: jest.fn() } });
    expect(wrapper.find('AccountCreation').length).toBe(1);
  });

  it('should render a AccountApprove component', () => {
    const propsAccountApprove = {
      ...props,
      accountToApprove: {
        ...props.accountToApprove,
        modalOpened: true,
      },
    };

    const wrapper = shallow(<NModalsContainer {...propsAccountApprove} />, { context: { translate: jest.fn() } });
    expect(wrapper.find('AccountApprove').length).toBe(1);
  });

  it('should attach the correct props to OperationDetails', () => {
    const propsAccountApprove = {
      ...props,
      accountToApprove: {
        ...props.accountToApprove,
        modalOpened: true,
      },
    };

    const wrapper = shallow(<NModalsContainer {...propsAccountApprove} />, { context: { translate: jest.fn() } });
    const account = wrapper.find('AccountApprove');

    expect(account.prop('organization')).toEqual(props.organization);
    expect(account.prop('getOrganizationMembers')).toEqual(props.onGetOrganizationMembers);
    expect(account.prop('getOrganizationApprovers')).toEqual(props.onGetOrganizationApprovers);
    expect(account.prop('close')).toEqual(props.onCloseAccountApprouve);
    expect(account.prop('abort')).toEqual(props.onAbortAccount);
    expect(account.prop('aborting')).toEqual(props.onAbortingAccount);
    expect(account.prop('approving')).toEqual(props.onApprovingAccount);
    expect(account.prop('account')).toEqual(propsAccountApprove.accountToApprove);
    expect(account.prop('getAccount')).toEqual(propsAccountApprove.onGetAccountToApprove);
  });


  it('should attach the correct props to OperationDetails', () => {
    const wrapper = shallow(<NModalsContainer {...sProps} />, { context: { translate: jest.fn() } });
    const operation = wrapper.find('OperationDetails');

    expect(operation.prop('operations')).toEqual(sProps.operations);
    expect(operation.prop('getOperation')).toEqual(sProps.onGetOperation);
    expect(operation.prop('close')).toEqual(sProps.onClose);
    expect(operation.prop('tabsIndex')).toEqual(sProps.operations.tabsIndex);
  });

  it('should attach the correct props to AccountCreation', () => {
    const propsAccount = {
      ...props,
      accountCreation: {
        ...props.accountCreation,
        modalOpened: true,
      },
    };

    const wrapper = shallow(<NModalsContainer {...propsAccount} />, { context: { translate: jest.fn() } });
    const account = wrapper.find('AccountCreation');

    expect(account.prop('organization')).toEqual(props.organization);
    expect(account.prop('tabsIndex')).toEqual(props.accountCreation.currentTab);
    expect(account.prop('onSelect')).toEqual(props.onChangeTabAccount);
    expect(account.prop('setApprovals')).toEqual(props.onSetApprovals);
    expect(account.prop('getCurrencies')).toEqual(props.onGetCurrencies);
    expect(account.prop('getOrganizationMembers')).toEqual(props.onGetOrganizationMembers);
    expect(account.prop('selectCurrency')).toEqual(props.onSelectCurrency);
    expect(account.prop('addMember')).toEqual(props.onAddMember);
    expect(account.prop('enableTimeLock')).toEqual(props.onEnableTimeLock);
    expect(account.prop('changeTimeLock')).toEqual(props.onChangeTimeLock);
    expect(account.prop('enableRatelimiter')).toEqual(props.onEnableRatelimiter);
    expect(account.prop('changeRatelimiter')).toEqual(props.onChangeRatelimiter);
    expect(account.prop('changeFrequency')).toEqual(props.onChangeFrequency);
    expect(account.prop('openPopBubble')).toEqual(props.onOpenPopBubble);
    expect(account.prop('changeAccountName')).toEqual(props.onChangeAccountName);
    expect(account.prop('currencies')).toEqual(props.allCurrencies);
    expect(account.prop('save')).toEqual(props.onSaveAccount);
    expect(account.prop('close')).toEqual(props.onCloseAccount);
    expect(account.prop('switchInternalModal')).toEqual(props.onSwitchInternalModal);
    expect(account.prop('account')).toEqual(propsAccount.accountCreation);
  });
});

