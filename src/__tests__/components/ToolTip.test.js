import React from 'react';
import { shallow } from 'enzyme';
import { Tooltip } from '../../components';

describe('ToolTip', () => {
  it('should have a ReactToolTip item', () => {
    const wrapper = shallow(
      <Tooltip />,
    );
    expect(wrapper.find('ReactTooltip').length).toEqual(1);
  });

  it('should have vlt-tooltip class', () => {
    const wrapper = shallow(
      <Tooltip />,
    );
    expect(wrapper.hasClass('vlt-tooltip')).toBe(true);
  });

  it('should accept className as prop', () => {
    const wrapper = shallow(
      <Tooltip className="test" />,
    );
    expect(wrapper.hasClass('test')).toBe(true);
  });

  it('should have a prop effect set to solid', () => {
    const wrapper = shallow(
      <Tooltip className="test" />,
    );
    expect(wrapper.prop('effect')).toBe('solid');
  });
});

