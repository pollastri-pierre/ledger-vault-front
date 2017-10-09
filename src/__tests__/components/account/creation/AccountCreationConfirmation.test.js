import React from 'react';
import { shallow } from 'enzyme';
import AccountCreationConfirmation from '../../../../components/accounts/creation/AccountCreationConfirmation';

describe('AccountCreationConfirmation test', () => {
  const props = {
    account: {
      security: {
        approvals: 'a',
        members: [{
          id: 1,
          name: 'name',
          firstname: 'firstname',
        }],
        ratelimiter: {
          enabled: true,
          frequency: 'day',
          rate: 3,
        },
        timelock: {
          enabled: true,
          frequency: 'hour',
          duration: 3,
        },
      },
      options: {
        name: 'name',
      },
      currency: {
        name: 'Bitcoin',
        shortname: 'btc',
      },
    },
  };

  const wrapper = shallow(<AccountCreationConfirmation {...props} />);

  it('should contain .confirmation-security ', () => {
    expect(wrapper.find('.confirmation-security').length).toBe(1);
  });

  it('.confirmation-security should contain 3 .confirmation-security-item', () => {
    expect(wrapper.find('.confirmation-security').children().length).toBe(3);
  });

  it('first .confirmation-security-item should be members', () => {
    const member = wrapper.find('.confirmation-security').children().at(0);
    expect(member.find('People').prop('className')).toBe('security-icon member');
    expect(member.find('.security-title').text()).toBe('Members');
    expect(member.find('.security-value').text()).toBe('1 selected');
  });

  it('second .confirmation-security-item should be timelock', () => {
    const timelock = wrapper.find('.confirmation-security').children().at(1);
    expect(timelock.find('Hourglass').prop('className')).toBe('security-icon timelock');
    expect(timelock.find('.security-title').text()).toBe('Time-lock');
    expect(timelock.find('.security-value').text()).toBe('3 hour');
  });

  it('second .confirmation-security-item should be disabled if timelock enabled is set to false', () => {
    const sProps = {
      ...props,
      account: {
        ...props.account,
        security: {
          ...props.account.security,
          timelock: {
            ...props.account.security.timelock,
            enabled: false,
          },
        },
      },
    };

    const disabled = shallow(<AccountCreationConfirmation {...sProps} />);
    const timelock = disabled.find('.confirmation-security').children().at(1);
    expect(timelock.prop('className')).toContain('disabled');
    expect(timelock.find('.security-value').text()).toBe('disabled');
  });

  it('third .confirmation-security-item should be ratelimiter', () => {
    const ratelimiter = wrapper.find('.confirmation-security').children().at(2);
    expect(ratelimiter.find('Rates').prop('className')).toBe('security-icon ratelimiter');
    expect(ratelimiter.find('.security-title').text()).toBe('Rate limiter');
    expect(ratelimiter.find('.security-value').text()).toBe('3 per day');
  });

  it('third .confirmation-security-item should be disabled if ratelimiter enabled is set to false', () => {
    const sProps = {
      ...props,
      account: {
        ...props.account,
        security: {
          ...props.account.security,
          ratelimiter: {
            ...props.account.security.ratelimiter,
            enabled: false,
          },
        },
      },
    };

    const disabled = shallow(<AccountCreationConfirmation {...sProps} />);
    const ratelimiter = disabled.find('.confirmation-security').children().at(2);
    expect(ratelimiter.prop('className')).toContain('disabled');
    expect(ratelimiter.find('.security-value').text()).toBe('disabled');
  });

  it('should contain a .confirmation-infos with 3 .confirmation-info', () => {
    expect(wrapper.find('div.confirmation-infos').find('div.confirmation-info').length).toBe(3);
  });

  it('first .confirmation-info should be name of account', () => {
    const first = wrapper.find('div.confirmation-infos').find('div.confirmation-info').at(0);
    expect(first.find('.info-title').text()).toBe('Name');
    expect(first.find('.info-value').text()).toBe('name');
  });

  it('first .confirmation-info should have a className according to currency name in lowercase', () => {
    const first = wrapper.find('div.confirmation-infos').find('div.confirmation-info').at(0);
    expect(first.find('.info-value').prop('className')).toContain('bitcoin');
  });

  it('second .confirmation-info should be the currency', () => {
    const second = wrapper.find('div.confirmation-infos').find('div.confirmation-info').at(1);
    expect(second.find('.info-title').text()).toBe('Currency');
    expect(second.find('.info-value').text()).toBe('Bitcoin');
  });

  it('third .confirmation-info should be the number of approvals', () => {
    const third = wrapper.find('div.confirmation-infos').find('div.confirmation-info').at(2);
    expect(third.find('.info-title').text()).toBe('Approvals to spend');
    expect(third.find('.info-value').text()).toBe('a of 1 members');
  });

  it('should contain a .confirmation-explain', () => {
    expect(wrapper.find('.confirmation-explain').length).toBe(1);
  });
});

