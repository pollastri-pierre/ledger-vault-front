import React from 'react';
import { shallow } from 'enzyme';
import AccountApproveDetails from '../../../../components/accounts/approve/AccountApproveDetails';
import { formatDate } from '../../../../redux/utils/format';

const props = {
  account: {
    name: 'Name',
    creation_time: new Date(),
    currency: {
      family: 'ETHEREUM',
      units: [{ name: 'Ethereum Classic', symbol: 'ETH' }],
    },
    security: {
      members: ['hash1', 'hash2'],
      approvals: 1,
      timelock: {
        enabled: true,
        duration: '4',
        frequency: 'day',
      },
      ratelimiter: {
        enabled: true,
        rate: '3',
        frequency: 'hour',
      },
    },
    approved: ['hash'],
  },
  organization: {
    approvers: [{}, {}, {}],
  },
};

const propsDisabled = {
  ...props,
  account: {
    ...props.account,
    security: {
      ...props.account.security,
      ratelimiter: {
        ...props.account.security.ratelimiter,
        enabled: false,
      },
      timelock: {
        ...props.account.security.timelock,
        enabled: false,
      },
    },
  },
};

describe('AccountApproveDetails tab component', () => {
  describe('Security items', () => {
    it('should have a .confirmation-security', () => {
      const wrapper = shallow(<AccountApproveDetails {...props} />);
      expect(wrapper.find('.confirmation-security').length).toBe(1);
    });

    it('first .confirmation-security-item should be the number of members', () => {
      const wrapper = shallow(<AccountApproveDetails {...props} />);
      expect(wrapper.find('.confirmation-security-item').at(0).find('.security-title').text()).toBe('Members');
      expect(wrapper.find('.confirmation-security-item').at(0).find('.security-value').text()).toEqual('2 selected');
    });

    it('second .confirmation-security-item should be timelock', () => {
      const wrapper = shallow(<AccountApproveDetails {...props} />);
      expect(wrapper.find('.confirmation-security-item').at(1).find('.security-title').text()).toBe('Time-lock');
      expect(wrapper.find('.confirmation-security-item').at(1).find('.security-value').text()).toEqual('4 day');
    });

    it('second .confirmation-security-item should be timelock disabled', () => {
      const wrapper = shallow(<AccountApproveDetails {...propsDisabled} />);
      expect(wrapper.find('.confirmation-security-item').at(1).prop('className')).toContain('disabled');
      expect(wrapper.find('.confirmation-security-item').at(1).find('.security-title').text()).toBe('Time-lock');
      expect(wrapper.find('.confirmation-security-item').at(1).find('.security-value').text()).toEqual('disabled');
    });

    it('third .confirmation-security-item should be ratelimiter', () => {
      const wrapper = shallow(<AccountApproveDetails {...props} />);
      expect(wrapper.find('.confirmation-security-item').at(2).find('.security-title').text()).toBe('Rate limiter');
      expect(wrapper.find('.confirmation-security-item').at(2).find('.security-value').text()).toEqual('3 per hour');
    });

    it('third .confirmation-security-item should be ratelimiter', () => {
      const wrapper = shallow(<AccountApproveDetails {...propsDisabled} />);
      expect(wrapper.find('.confirmation-security-item').at(2).prop('className')).toContain('disabled');
      expect(wrapper.find('.confirmation-security-item').at(2).find('.security-title').text()).toBe('Rate limiter');
      expect(wrapper.find('.confirmation-security-item').at(2).find('.security-value').text()).toEqual('disabled');
    });
  });

  describe('Account informations', () => {
    it('should have a .confirmations-infos', () => {
      const wrapper = shallow(<AccountApproveDetails {...props} />);
      expect(wrapper.find('.confirmation-infos').length).toBe(1);
    });

    it('first .confirmation-info should be the status', () => {
      const wrapper = shallow(<AccountApproveDetails {...props} />);
      expect(wrapper.find('.confirmation-infos .confirmation-info').at(0).find('.info-title').text()).toBe('Status');
      expect(wrapper.find('.confirmation-infos .confirmation-info').at(0).find('.info-value.status').text()).toBe('Collecting approvals (33%)');
    });

    it('second .confirmation-info should be the creation time', () => {
      const wrapper = shallow(<AccountApproveDetails {...props} />);
      expect(wrapper.find('.confirmation-infos .confirmation-info').at(1).find('.info-title').text()).toBe('Requested');
      expect(wrapper.find('.confirmation-infos .confirmation-info').at(1).find('.info-value.date').text()).toBe(formatDate(props.account.creation_time, 'lll'));
    });

    it('third .confirmation-info should be the name', () => {
      const wrapper = shallow(<AccountApproveDetails {...props} />);
      expect(wrapper.find('.confirmation-infos .confirmation-info').at(2).find('.info-title').text()).toBe('Name');
      expect(wrapper.find('.confirmation-infos .confirmation-info').at(2).find('.info-value.name').text()).toBe(props.account.name);
    });

    it('third .confirmation-info should be the name and have the currency as class', () => {
      const wrapper = shallow(<AccountApproveDetails {...props} />);
      expect(wrapper.find('.confirmation-infos .confirmation-info').at(2).find('.info-value').prop('className')).toContain('ethereum-classic');
    });

    it('Fourth .confirmation-info should be the currency', () => {
      const wrapper = shallow(<AccountApproveDetails {...props} />);
      expect(wrapper.find('.confirmation-infos .confirmation-info').at(3).find('.info-title').text()).toBe('Currency');
      expect(wrapper.find('.confirmation-infos .confirmation-info').at(3).find('.info-value.currency').text()).toBe(props.account.currency.units[0].name);
    });

    it('Fith .confirmation-info should be the approvals', () => {
      const wrapper = shallow(<AccountApproveDetails {...props} />);
      expect(wrapper.find('.confirmation-infos .confirmation-info').at(4).find('.info-title').text()).toBe('Approvals to spend');
      expect(wrapper.find('.confirmation-infos .confirmation-info').at(4).find('.info-value').text()).toBe('1 of 2 members');
    });
  });
});
