import React from 'react';
import { shallow, mount } from 'enzyme';
import AccountCreationOptions from '../../../../components/accounts/creation/AccountCreationOptions';

describe('AccountCreationOptions test', () => {
  const props = {
    currency: {
      name: 'Ethereum-classic',
    },
    options: {
      name: 'name',
    },
    changeName: jest.fn(),
  };

  it('should render an account-creation-options div', () => {
    const wrapper = shallow(<AccountCreationOptions {...props} />);
    expect(wrapper.prop('className')).toBe('account-creation-options');
  });

  it('should render a label with Name', () => {
    const wrapper = shallow(<AccountCreationOptions {...props} />);
    expect(wrapper.find('label').text()).toBe('Name');
  });

  it('should render a div with .dot and currency as className lowercase and space replaced with dash', () => {
    const wrapper = shallow(<AccountCreationOptions {...props} />);
    expect(wrapper.find('.dot').prop('className')).toContain('ethereum-classic');
  });

  it('should render an input with value', () => {
    const wrapper = shallow(<AccountCreationOptions {...props} />);
    expect(wrapper.find('input').prop('value')).toBe(props.options.name);
  });

  it('onChange on input should call changeName()', () => {
    const wrapper = shallow(<AccountCreationOptions {...props} />);
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'test' } });
    expect(props.changeName).toHaveBeenCalledWith('test');
  });
});
