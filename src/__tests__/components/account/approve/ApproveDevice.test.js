import React from 'react';
import { shallow } from 'enzyme';
import ApproveDevice from '../../../../components/accounts/approve/ApproveDevice';

const props = {
  cancel: jest.fn(),
};


describe('ApproveDevice component', () => {
  it('should display an #account-approve-device.small-modal', () => {
    const wrapper = shallow(<ApproveDevice {...props} />);
    expect(wrapper.prop('id')).toBe('account-approve-device');
    expect(wrapper.prop('className')).toBe('small-modal');
  });

  it('should display an header with Plug icon and hr', () => {
    const wrapper = shallow(<ApproveDevice {...props} />);
    expect(wrapper.find('header h3').text()).toBe('Approve account');
    expect(wrapper.find('header').find('Plug').prop('className')).toBe('plug-icon');
  });

  it('should have a list with 3 li in .content', () => {
    const wrapper = shallow(<ApproveDevice {...props} />);
    expect(wrapper.find('.content li').length).toBe(3);
  });

  it('should have a footer with a DialogButon .cancel', () => {
    const wrapper = shallow(<ApproveDevice {...props} />);
    expect(wrapper.find('.footer DialogButton').prop('className')).toBe('cancel margin');
  });

  it('DialogButton in footer should be binded to cancel()', () => {
    const wrapper = shallow(<ApproveDevice {...props} />);
    const Button = wrapper.find('.footer DialogButton');

    Button.simulate('touchTap');
    expect(props.cancel).toHaveBeenCalled();
  });

  it('should have a footer with a .wait "awaiting device"', () => {
    const wrapper = shallow(<ApproveDevice {...props} />);
    expect(wrapper.find('.footer .wait').text()).toBe('awaiting device...');
  });
});

