import React from 'react';
import { shallow } from 'enzyme';
import { NModalsContainer } from '../../containers/ModalsContainer';
import { OPEN_MODAL_ACCOUNT  } from '../../redux/modules/account-creation';

const props = {
  modals: OPEN_MODAL_ACCOUNT,
  organization: {},
  operations: {
    tabsIndex: 0,
  },
  allCurrencies: {},
  accountCreation: {
    currentTab: 0,
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
    const wrapper = shallow(<NModalsContainer {...props} />, { context: { translate: jest.fn() } });
    expect(wrapper.find('AccountCreation').length).toBe(1);
  });

  it('should attach the correct props to OperationDetails', () => {
    const wrapper = shallow(<NModalsContainer {...sProps} />, { context: { translate: jest.fn() } });
    const operation = wrapper.find('OperationDetails');

    expect(operation.prop('operations')).toBe(sProps.operations);
    expect(operation.prop('getOperation')).toBe(sProps.onGetOperation);
    expect(operation.prop('close')).toBe(sProps.onClose);
    expect(operation.prop('tabsIndex')).toBe(sProps.operations.tabsIndex);
  });

  it('should attach the correct props to AccountCreation', () => {
    const wrapper = shallow(<NModalsContainer {...props} />, { context: { translate: jest.fn() } });
    const account = wrapper.find('AccountCreation');

    expect(account.prop('organization')).toBe(props.organization);
    expect(account.prop('tabsIndex')).toBe(props.accountCreation.currentTab);
    expect(account.prop('onSelect')).toBe(props.onChangeTabAccount);
    expect(account.prop('setApprovals')).toBe(props.onSetApprovals);
    expect(account.prop('getCurrencies')).toBe(props.onGetCurrencies);
    expect(account.prop('getOrganizationMembers')).toBe(props.onGetOrganizationMembers);
    expect(account.prop('selectCurrency')).toBe(props.onSelectCurrency);
    expect(account.prop('addMember')).toBe(props.onAddMember);
    expect(account.prop('enableTimeLock')).toBe(props.onEnableTimeLock);
    expect(account.prop('changeTimeLock')).toBe(props.onChangeTimeLock);
    expect(account.prop('enableRatelimiter')).toBe(props.onEnableRatelimiter);
    expect(account.prop('changeRatelimiter')).toBe(props.onChangeRatelimiter);
    expect(account.prop('changeFrequency')).toBe(props.onChangeFrequency);
    expect(account.prop('openPopBubble')).toBe(props.onOpenPopBubble);
    expect(account.prop('changeAccountName')).toBe(props.onChangeAccountName);
    expect(account.prop('currencies')).toBe(props.allCurrencies);
    expect(account.prop('save')).toBe(props.onSaveAccount);
    expect(account.prop('close')).toBe(props.onCloseAccount);
    expect(account.prop('switchInternalModal')).toBe(props.onSwitchInternalModal);
    expect(account.prop('account')).toBe(props.accountCreation);
  });
});

