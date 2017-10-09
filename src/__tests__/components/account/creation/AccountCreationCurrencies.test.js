import React from 'react';
import { shallow } from 'enzyme';
import AccountCreationCurrencies from '../../../../components/accounts/creation/AccountCreationCurrencies';

describe('AccountCreationCurrencies test', () => {
  const props = {
    onSelect: jest.fn(),
    currency: {},
    currencies: [
      {
        name: 'Bitcoin',
        shortname: 'BTC',
      },
      {
        name: 'Litecoin',
        shortname: 'LTC',
      },
      {
        name: 'Ethereum-classic',
        shortname: 'ETH',
      },
    ],
  };

  const wrapper = shallow(<AccountCreationCurrencies {...props} />);
  // const wrapperDom = mount(<AccountCreationApprovals {...props} />);

  it('should render in account-creation-currencies div', () => {
    expect(wrapper.prop('className')).toBe('account-creation-currencies');
  });

  it('should display as many account-creation-currency as props.currencies length', () => {
    expect(wrapper.find('.account-creation-currency').length).toBe(props.currencies.length);
  });

  it('should display firstname', () => {
    expect(wrapper.find('.account-creation-currency').at(0).find('.currency-name').text()).toBe('Bitcoin');
  });

  it('should display shortname', () => {
    expect(wrapper.find('.account-creation-currency').at(0).find('.currency-short').text()).toBe('BTC');
  });

  it('should set the className as the currency name lowercase and space replaced with dash', () => {
    expect(wrapper.find('.account-creation-currency').at(2).prop('className')).toContain('ethereum-classic');
  });

  it('should set the className selected if current currency is selected', () => {
    const sProps = { ...props, currency: { name: 'Bitcoin', shortname: 'BTC' } };
    const sWrapper = shallow(<AccountCreationCurrencies {...sProps} />);
    expect(sWrapper.find('.account-creation-currency').at(0).prop('className')).toContain('selected');
  });

  it('click on account-creation-currency should call onSelect', () => {
    const item = wrapper.find('.account-creation-currency').at(0);
    item.simulate('click');
    expect(props.onSelect).toHaveBeenCalled();
  });
});

