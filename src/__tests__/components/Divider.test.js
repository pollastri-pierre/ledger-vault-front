import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { Divider } from '../../components';

describe('Divider', () => {

  it('Divider should have divider css class', () => {
    const wrapper = mount(<Divider />);
    expect(wrapper.find('div').hasClass('divider')).toBe(true);
  });

  it('should accept css class as props', () => {
    const wrapper = mount(<Divider className='test'/>);
    expect(wrapper.find('div').hasClass('divider')).toBe(true);
    expect(wrapper.find('div').hasClass('test')).toBe(true);
  });

});



