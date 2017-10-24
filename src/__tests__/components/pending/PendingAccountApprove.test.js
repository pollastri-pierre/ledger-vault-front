import React from 'react';
import { shallow } from 'enzyme';
import { PendingAccountApprove } from '../../../components';
import moment from 'moment';

const props = {
  accounts: [
    {
      id: 1,
      name: 'account',
      creation_time: new Date(),
      currency: {
        family: 'BITCOIN',
        units: [{
          name: 'bitcoin',
          symbol: 'BTC',
        }],
      },
      approved: ['fwefwe'],
    },
  ],
  open: jest.fn(),
  approved: false,
  approvers: [{pub_key: 'fwefwe'}],
};

const props2 = {
  accounts: [
    {
      id: 1,
      name: 'account',
      creation_time: new Date(),
      currency: {
        family: 'BITCOIN',
        units: [{
          name: 'bitcoin',
          symbol: 'BTC',
        }],
      },
      approved: ['fwefwe'],
    },
    {
      id: 2,
      name: 'account 2',
      creation_time: new Date(),
      currency: {
        family: 'ETHEREUM',
        units: [{
          name: 'Ethereum',
          symbol: 'ETH',
        }],
      },
      approved: ['fwefwe'],
    },
  ],
  open: jest.fn(),
  approved: false,
  approvers: [{ pub_key: 'fwefwe' }],
};

describe('AccountView container', () => {
  it('should be .pending-request-list ', () => {
    const wrapper = shallow(<PendingAccountApprove {...props} />);
    expect(wrapper.prop('className')).toBe('pending-request-list');
  });

  it('should have a .header.dark with number of account', () => {
    const wrapper = shallow(<PendingAccountApprove {...props} />);
    expect(wrapper.find('.header.dark span').at(0).text()).toBe('1 account');
  });

  it('should have a .header.dark with number of account at plural', () => {
    const wrapper = shallow(<PendingAccountApprove {...props2} />);
    expect(wrapper.find('.header.dark span').at(0).text()).toBe('2 accounts');
  });

  it('should have a .header.dark with number of different currency', () => {
    const wrapper = shallow(<PendingAccountApprove {...props} />);
    expect(wrapper.find('.header.dark span').at(1).text()).toBe('1');
  });

  it('should have a .header.dark with number of different currency and handle multiple currency', () => {
    const wrapper = shallow(<PendingAccountApprove {...props2} />);
    expect(wrapper.find('.header.dark span').at(1).text()).toBe('2');
  });

  it('should have a .header.light with label currency singular', () => {
    const wrapper = shallow(<PendingAccountApprove {...props} />);
    expect(wrapper.find('.header.light span').at(1).text()).toBe('currency');
  });

  it('should have a .header.light with label currencies', () => {
    const wrapper = shallow(<PendingAccountApprove {...props2} />);
    expect(wrapper.find('.header.light span').at(1).text()).toBe('currencies');
  });

  it('should have a .pending-request', () => {
    const wrapper = shallow(<PendingAccountApprove {...props} />);
    expect(wrapper.find('.pending-request').length).toBe(1);
  });

  it('should have as many .pending-request as accounts', () => {
    const wrapper = shallow(<PendingAccountApprove {...props2} />);
    expect(wrapper.find('.pending-request').length).toBe(2);
  });

  it('should have a .pending-request.watch if approved', () => {
    const sProps = { ...props, approved: true };
    const wrapper = shallow(<PendingAccountApprove {...sProps} />);
    expect(wrapper.find('.pending-request.watch').length).toBe(1);
  });

  it('.pending-request onClick should trigger open(account,approved)', () => {
    const sProps = { ...props, approved: true };
    const wrapper = shallow(<PendingAccountApprove {...sProps} />);
    const line = wrapper.find('.pending-request.watch').at(0);
    line.simulate('click');

    expect(props.open).toHaveBeenCalledWith(props.accounts[0], true);
  });

  it('should have a .request-date-creation', () => {
    const wrapper = shallow(<PendingAccountApprove {...props} />);
    const line = wrapper.find('.pending-request').at(0);

    expect(line.find('.request-date-creation').text()).toBe(
      moment(props.accounts[0].creation_time).format('lll')
    );
  });

  it('should have a .request-name', () => {
    const wrapper = shallow(<PendingAccountApprove {...props} />);
    const line = wrapper.find('.pending-request').at(0);

    expect(line.find('.request-name').text()).toBe(props.accounts[0].name);
  });

  it('should have a .request-name with the currency in class', () => {
    const wrapper = shallow(<PendingAccountApprove {...props} />);
    const line = wrapper.find('.pending-request').at(0);

    expect(line.find('.request-name').prop('className')).toContain('bitcoin');
  });

  it('should have a .request-currency ', () => {
    const wrapper = shallow(<PendingAccountApprove {...props} />);
    const line = wrapper.find('.pending-request').at(0);

    expect(line.find('.request-currency').text()).toBe(props.accounts[0].currency.family);
  });

  it('should have a .request-approval-state', () => {
    const wrapper = shallow(<PendingAccountApprove {...props} />);
    const line = wrapper.find('.pending-request').at(0);

    expect(line.find('.request-approval-state').text()).toBe('Collecting Approvals (1/1) ');
  });

  it('should have a ValidateBage if approved', () => {
    const sProps = { ...props, approved: true };
    const wrapper = shallow(<PendingAccountApprove {...sProps} />);
    const line = wrapper.find('.pending-request').at(0);

    expect(line.find('.request-approval-state.approved').find('ValidateBadge').length).toBe(1);
  });
});

