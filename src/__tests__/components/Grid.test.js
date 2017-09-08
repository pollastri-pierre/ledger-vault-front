import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { Col, Row } from '../../components/Grid/Grid';

describe('Grid', () => {
  it('Row should have row css class', () => {
    const wrapper = mount(<Row />);
    expect(wrapper.find('div').hasClass('row')).toBe(true);
  });

  it('Col should have col-width css class', () => {
    const wrapper = mount(<Col width={25} />);
    expect(wrapper.find('div').hasClass('col-25')).toBe(true);
  });

  it('Row should render children', () => {
    const children = (<p>test</p>);
    const wrapper = mount(<Row children={children} />);
    expect(wrapper.find('div').children().matchesElement(<p>test</p>)).toBe(true);
  });

  it('Col should render children', () => {
    const children = (<p>test</p>);
    const wrapper = mount(<Col children={children} />);
    expect(wrapper.find('div').children().matchesElement(<p>test</p>)).toBe(true);
  });

});


